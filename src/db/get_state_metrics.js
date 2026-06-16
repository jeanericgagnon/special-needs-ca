import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');
const stateConfigsPath = path.resolve(__dirname, '../../frontend/src/lib/stateConfigs.ts');
const sitemapPath = path.resolve(__dirname, '../../frontend/src/app/sitemaps/counties.xml/route.ts');

const db = new Database(dbPath, { readonly: true });

// Load stateConfigs file content
let stateConfigsContent = '';
try {
  stateConfigsContent = fs.readFileSync(stateConfigsPath, 'utf8');
} catch (e) {
  console.error('Failed to read stateConfigs.ts:', e.message);
}

// Load sitemap verified counties
let nonCaVerifiedCounties = [];
try {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  const match = sitemapContent.match(/NON_CA_VERIFIED_COUNTIES\s*=\s*\[([\s\S]*?)\]/);
  if (match) {
    nonCaVerifiedCounties = match[1].split(',').map(s => s.trim().replace(/['",]/g, '')).filter(Boolean);
  }
} catch (err) {}

const states = db.prepare('SELECT id, name, code FROM states ORDER BY name ASC').all();

const wave1 = new Set(['texas', 'florida', 'new-york', 'pennsylvania', 'illinois', 'ohio', 'georgia']);
const wave2 = new Set(['north-carolina', 'michigan', 'new-jersey', 'virginia', 'washington', 'arizona', 'massachusetts', 'colorado', 'tennessee', 'indiana']);

const results = [];

for (const state of states) {
  const stateId = state.id;
  const stateCode = state.code.toLowerCase();

  // Extract from stateConfigs
  let requiredForms = [];
  let corePrograms = [];
  let priorityMetroCounties = [];
  let catchmentName = 'Local Agency';
  let educationAgencyLabel = 'District Support';
  let earlyInterventionLabel = 'Early Intervention';

  try {
    const stateBlockRegex = new RegExp(`['"]${stateId}['"]\\s*:\\s*\\{[\\s\\S]*?\\n\\s*\\}\\s*(?:,\\n\\s*['"]|\\n\\})`);
    const stateBlockMatch = stateConfigsContent.match(stateBlockRegex);
    if (stateBlockMatch) {
      const stateBlock = stateBlockMatch[0];
      
      const formsMatch = stateBlock.match(/requiredForms:\s*\[([\s\S]*?)\]/);
      if (formsMatch) {
        requiredForms = formsMatch[1].split(',').map(s => s.trim().replace(/['",]/g, '')).filter(Boolean);
      }

      const progsMatch = stateBlock.match(/corePrograms:\s*\[([\s\S]*?)\]/);
      if (progsMatch) {
        corePrograms = progsMatch[1].split(',').map(s => s.trim().replace(/['",]/g, '')).filter(Boolean);
      }

      const metroMatch = stateBlock.match(/priorityMetroCounties:\s*\[([\s\S]*?)\]/);
      if (metroMatch) {
        priorityMetroCounties = metroMatch[1].split(',').map(s => s.trim().replace(/['",]/g, '')).filter(Boolean);
      }

      const catchmentMatch = stateBlock.match(/catchmentName:\s*['"](.*?)['"]/);
      if (catchmentMatch) catchmentName = catchmentMatch[1];

      const edLabelMatch = stateBlock.match(/educationAgencyLabel:\s*['"](.*?)['"]/);
      if (edLabelMatch) educationAgencyLabel = edLabelMatch[1];

      const eiLabelMatch = stateBlock.match(/earlyInterventionLabel:\s*['"](.*?)['"]/);
      if (eiLabelMatch) earlyInterventionLabel = eiLabelMatch[1];
    }
  } catch (err) {}

  // Counties
  const counties = db.prepare('SELECT id, name FROM counties WHERE state_id = ?').all(stateId);
  const countyCount = counties.length;

  // DD Routing Agencies
  const ddAgencies = db.prepare('SELECT id, name, agency_type, data_origin FROM state_resource_agencies WHERE state_id = ?').all(stateId);
  const ddType = ddAgencies.length > 0 ? ddAgencies[0].agency_type : 'N/A';
  const ddAgenciesFallback = ddAgencies.filter(a => a.data_origin === 'programmatic_fallback' || a.data_origin === 'generated_county_fallback').length;

  // Medicaid Offices
  const medicaidProgIds = stateId === 'california' 
    ? ['medi-cal-for-kids-and-teens', 'california-childrens-services', 'hearing-aid-coverage', 'hcba'] 
    : stateId === 'florida' ? ['fl-medicaid-dcf']
    : stateId === 'new-york' ? ['ny-medicaid']
    : stateId === 'pennsylvania' ? ['pa-medicaid']
    : stateId === 'illinois' ? ['il-medicaid']
    : stateId === 'ohio' ? ['oh-medicaid']
    : stateId === 'georgia' ? ['ga-medicaid']
    : stateId === 'texas' ? ['tx-mdcp', 'tx-medicaid-chip']
    : [`${stateCode}-medicaid`];

  const offices = db.prepare(`
    SELECT co.id, co.data_origin, co.verification_status 
    FROM county_offices co
    JOIN counties c ON co.county_id = c.id
    WHERE c.state_id = ? AND co.program_id IN (${medicaidProgIds.map(() => '?').join(',')})
  `).all(stateId, ...medicaidProgIds);

  const officesFallback = offices.filter(o => o.data_origin === 'programmatic_fallback' || o.data_origin === 'generated_county_fallback').length;

  // Education Regional Agencies
  const regionalEd = db.prepare('SELECT id, name, agency_type, data_origin FROM regional_education_agencies WHERE state_id = ?').all(stateId);
  const edType = regionalEd.length > 0 ? regionalEd[0].agency_type : 'N/A';
  const regionalEdFallback = regionalEd.filter(e => e.data_origin === 'programmatic_fallback' || e.data_origin === 'generated_county_fallback').length;

  // School Districts
  const districts = db.prepare(`
    SELECT sd.id, sd.data_origin 
    FROM school_districts sd
    JOIN counties c ON sd.county_id = c.id
    WHERE c.state_id = ?
  `).all(stateId);

  const districtsFallback = districts.filter(d => d.data_origin === 'programmatic_fallback' || d.data_origin === 'generated_county_fallback').length;

  // Waitlists
  const stateWaivers = stateId === 'california' 
    ? ['ihss-for-children', 'regional-centers', 'early-start', 'medi-cal-for-kids-and-teens', 'california-childrens-services', 'hearing-aid-coverage', 'ssi-for-children', 'iep-special-education', 'hcba', 'self-determination-program']
    : stateId === 'florida' ? ['fl-ibudget', 'fl-cdc-plus', 'fl-medicaid-dcf']
    : stateId === 'new-york' ? ['ny-opwdd-waiver', 'ny-opwdd-self-direction', 'ny-medicaid']
    : stateId === 'pennsylvania' ? ['pa-consolidated-waiver', 'pa-community-living-waiver', 'pa-medicaid']
    : stateId === 'illinois' ? ['il-childrens-support-waiver', 'il-adults-dd-waiver', 'il-medicaid']
    : stateId === 'ohio' ? ['oh-individual-options-waiver', 'oh-level-one-waiver', 'oh-medicaid']
    : stateId === 'georgia' ? ['ga-comp-waiver', 'ga-now-waiver', 'ga-medicaid']
    : stateId === 'texas' ? ['tx-hcs', 'tx-class', 'tx-txhml', 'tx-mdcp', 'tx-eci', 'tx-tea-sped']
    : [`${stateCode}-dd-waiver`, `${stateCode}-dd-self-direction`, `${stateCode}-medicaid`];

  const waitlists = db.prepare('SELECT id, program_id FROM program_waitlists').all();
  const waitlistCount = waitlists.filter(w => stateWaivers.includes(w.program_id)).length;

  // Providers & Advocates
  const uniqueAdvocates = db.prepare(`
    SELECT DISTINCT ia.id, ia.data_origin, ia.verification_status 
    FROM iep_advocates ia
    JOIN iep_advocate_counties iac ON ia.id = iac.iep_advocate_id
    JOIN counties c ON iac.county_id = c.id
    WHERE c.state_id = ?
  `).all(stateId);
  
  const providersFallback = uniqueAdvocates.filter(a => a.data_origin === 'programmatic_fallback' || a.data_origin === 'generated_county_fallback').length;

  // Nonprofits
  const nonprofits = db.prepare(`
    SELECT no.id, no.data_origin 
    FROM nonprofit_organizations no
    JOIN counties c ON no.county_id = c.id
    WHERE c.state_id = ?
  `).all(stateId);

  const nonprofitsFallback = nonprofits.filter(n => n.data_origin === 'programmatic_fallback' || n.data_origin === 'generated_county_fallback').length;

  // Totals
  const totalFallback = ddAgenciesFallback + officesFallback + regionalEdFallback + districtsFallback + providersFallback + nonprofitsFallback;

  // Calculate actual record counts
  const totalRealOffices = offices.length - officesFallback;
  const totalRealDistricts = districts.length - districtsFallback;
  const totalRealNonprofits = nonprofits.length - nonprofitsFallback;
  const totalRealProviders = uniqueAdvocates.length - providersFallback;

  let wave = 4;
  if (stateId === 'california') wave = 0;
  else if (wave1.has(stateId)) wave = 1;
  else if (wave2.has(stateId)) wave = 2;
  else if (countyCount > 50) wave = 3; // medium states

  results.push({
    id: stateId,
    name: state.name,
    code: state.code,
    countyCount,
    priorityCounties: priorityMetroCounties.length,
    ddType,
    medicaidRouting: catchmentName,
    educationRouting: educationAgencyLabel,
    formsCount: requiredForms.length,
    waitlistCount,
    providerCount: uniqueAdvocates.length,
    realProviders: totalRealProviders,
    nonprofitCount: nonprofits.length,
    realNonprofits: totalRealNonprofits,
    fallbackCount: totalFallback,
    realOffices: totalRealOffices,
    realDistricts: totalRealDistricts,
    wave
  });
}

console.log(JSON.stringify(results, null, 2));
db.close();
