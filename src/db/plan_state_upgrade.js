import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');
const stateConfigsPath = path.resolve(__dirname, '../../frontend/src/lib/stateConfigs.ts');

const args = process.argv.slice(2);
const stateArg = args[0] || 'california';
const stateId = stateArg.toLowerCase();

const db = new Database(dbPath, { readonly: true });

// Check state in DB
const stateRecord = db.prepare('SELECT * FROM states WHERE id = ?').get(stateId);
if (!stateRecord) {
  console.error(`❌ Error: State '${stateId}' is not registered in the database.`);
  db.close();
  process.exit(1);
}

const stateCode = stateRecord.code.toLowerCase();

// Load state config
let stateConfigsContent = '';
try {
  stateConfigsContent = fs.readFileSync(stateConfigsPath, 'utf8');
} catch (e) {}

let requiredForms = [];
let corePrograms = [];
let priorityMetroCounties = [];
let catchmentName = 'Local DD Agency';

try {
  const stateBlockRegex = new RegExp(`['"]${stateId}['"]\\s*:\\s*\\{[\\s\\S]*?\\n\\s*\\}\\s*(?:,\\n\\s*['"]|\\n\\})`);
  const stateBlockMatch = stateConfigsContent.match(stateBlockRegex);
  if (stateBlockMatch) {
    const stateBlock = stateBlockMatch[0];
    const formsMatch = stateBlock.match(/requiredForms:\s*\[([\s\S]*?)\]/);
    if (formsMatch) requiredForms = formsMatch[1].split(',').map(s => s.trim().replace(/['",]/g, '')).filter(Boolean);

    const progsMatch = stateBlock.match(/corePrograms:\s*\[([\s\S]*?)\]/);
    if (progsMatch) corePrograms = progsMatch[1].split(',').map(s => s.trim().replace(/['",]/g, '')).filter(Boolean);

    const metroMatch = stateBlock.match(/priorityMetroCounties:\s*\[([\s\S]*?)\]/);
    if (metroMatch) priorityMetroCounties = metroMatch[1].split(',').map(s => s.trim().replace(/['",]/g, '')).filter(Boolean);

    const catchmentMatch = stateBlock.match(/catchmentName:\s*['"](.*?)['"]/);
    if (catchmentMatch) catchmentName = catchmentMatch[1];
  }
} catch (err) {}

// Query count of counties
const counties = db.prepare('SELECT id, name FROM counties WHERE state_id = ?').all(stateId);
const countyCount = counties.length;

// Missing local offices (Medicaid/HHS offices that are fallbacks)
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
  SELECT co.id, co.data_origin, co.county_id 
  FROM county_offices co
  JOIN counties c ON co.county_id = c.id
  WHERE c.state_id = ? AND co.program_id IN (${medicaidProgIds.map(() => '?').join(',')})
`).all(stateId, ...medicaidProgIds);

const missingOffices = offices.filter(o => o.data_origin === 'programmatic_fallback' || o.data_origin === 'generated_county_fallback');

// Missing school district contacts
const districts = db.prepare(`
  SELECT sd.id, sd.data_origin, sd.county_id 
  FROM school_districts sd
  JOIN counties c ON sd.county_id = c.id
  WHERE c.state_id = ?
`).all(stateId);

const missingDistricts = districts.filter(d => d.data_origin === 'programmatic_fallback' || d.data_origin === 'generated_county_fallback');

// Missing nonprofits
const nonprofits = db.prepare(`
  SELECT no.id, no.data_origin, no.county_id 
  FROM nonprofit_organizations no
  JOIN counties c ON no.county_id = c.id
  WHERE c.state_id = ?
`).all(stateId);

const missingNonprofits = nonprofits.filter(n => n.data_origin === 'programmatic_fallback' || n.data_origin === 'generated_county_fallback');

// Missing providers
const advocates = db.prepare(`
  SELECT DISTINCT ia.id, ia.data_origin, iac.county_id 
  FROM iep_advocates ia
  JOIN iep_advocate_counties iac ON ia.id = iac.iep_advocate_id
  JOIN counties c ON iac.county_id = c.id
  WHERE c.state_id = ?
`).all(stateId);

const missingProviders = advocates.filter(a => a.data_origin === 'programmatic_fallback' || a.data_origin === 'generated_county_fallback');

// Missing forms (out of the expected forms list)
const expectedFormsList = [
  'iep-assessment-request',
  'independent-educational-evaluation-request',
  'education-records-request',
  'prior-written-notice-request',
  'due-process-complaint',
  'medi-cal-application', // or state equivalent
  'ssi-child-disability-checklist',
  'calable-account-opening'
];
const missingForms = expectedFormsList.filter(f => !requiredForms.includes(f));

// Missing Appeals Mappings
const appealProgs = db.prepare("SELECT * FROM program_appeal_info").all();
const stateWaiverListForAppeals = stateId === 'california'
  ? ['ihss-for-children', 'regional-centers', 'early-start', 'medi-cal-for-kids-and-teens', 'california-childrens-services', 'hearing-aid-coverage', 'ssi-for-children', 'iep-special-education', 'hcba', 'self-determination-program']
  : stateId === 'florida' ? ['fl-ibudget', 'fl-cdc-plus', 'fl-medicaid-dcf']
  : stateId === 'new-york' ? ['ny-opwdd-waiver', 'ny-opwdd-self-direction', 'ny-medicaid']
  : stateId === 'pennsylvania' ? ['pa-consolidated-waiver', 'pa-community-living-waiver', 'pa-medicaid']
  : stateId === 'illinois' ? ['il-childrens-support-waiver', 'il-adults-dd-waiver', 'il-medicaid']
  : stateId === 'ohio' ? ['oh-individual-options-waiver', 'oh-level-one-waiver', 'oh-medicaid']
  : stateId === 'georgia' ? ['ga-comp-waiver', 'ga-now-waiver', 'ga-medicaid']
  : stateId === 'texas' ? ['tx-hcs', 'tx-class', 'tx-txhml', 'tx-mdcp', 'tx-eci', 'tx-tea-sped']
  : [`${stateCode}-dd-waiver`, `${stateCode}-dd-self-direction`, `${stateCode}-medicaid`];

const missingAppeals = stateWaiverListForAppeals.filter(pId => !appealProgs.some(ap => ap.program_id === pId));

// Missing waitlists
const waitlists = db.prepare("SELECT * FROM program_waitlists").all();
const stateWaiverList = stateId === 'california' 
  ? ['hcba', 'regional-centers', 'ihss-for-children', 'ssi-for-children', 'ccs-application'] 
  : stateId === 'florida' ? ['fl-ibudget']
  : stateId === 'new-york' ? ['ny-opwdd-waiver']
  : stateId === 'pennsylvania' ? ['pa-consolidated-waiver']
  : stateId === 'illinois' ? ['il-childrens-support-waiver']
  : stateId === 'ohio' ? ['oh-individual-options-waiver']
  : stateId === 'georgia' ? ['ga-comp-waiver']
  : stateId === 'texas' ? ['tx-hcs', 'tx-class', 'tx-txhml', 'tx-mdcp']
  : [`${stateCode}-dd-waiver`];

const missingWaitlists = stateWaiverList.filter(pId => !waitlists.some(wl => wl.program_id === pId));

// High-Priority Counties to Deepen
const priorityCountiesStatus = [];
for (const countyId of priorityMetroCounties) {
  const countyOff = offices.filter(o => o.county_id === countyId);
  const countyDist = districts.filter(d => d.county_id === countyId);
  const countyNp = nonprofits.filter(n => n.county_id === countyId);
  const countyProv = advocates.filter(p => p.county_id === countyId);

  const fallbackCount = 
    countyOff.filter(o => o.data_origin === 'programmatic_fallback' || o.data_origin === 'generated_county_fallback').length +
    countyDist.filter(d => d.data_origin === 'programmatic_fallback' || d.data_origin === 'generated_county_fallback').length +
    countyNp.filter(n => n.data_origin === 'programmatic_fallback' || n.data_origin === 'generated_county_fallback').length +
    countyProv.filter(p => p.data_origin === 'programmatic_fallback' || p.data_origin === 'generated_county_fallback').length;

  priorityCountiesStatus.push({
    id: countyId,
    fallbackCount,
    totalRecords: countyOff.length + countyDist.length + countyNp.length + countyProv.length
  });
}

// Recommended crawl targets
const crawlers = [
  { domain: `https://www.hhs.${stateId}.gov`, data: 'Local Medicaid Eligibility Offices directory', priority: 'High' },
  { domain: `https://www.education.${stateId}.gov`, data: 'Special Education directors roster', priority: 'High' },
  { domain: `https://www.parentcenterhub.org`, data: 'Federally funded Parent Training & Information (PTI) Center contacts', priority: 'High' },
  { domain: `https://www.thearc.org`, data: `Local Arc chapters locator in ${stateRecord.name}`, priority: 'Medium' }
];

console.log('====================================================');
console.log(`📋 STATE UPGRADE PLAN & GAP REPORT: ${stateRecord.name.toUpperCase()} (${stateRecord.code})`);
console.log('====================================================\n');

console.log('1. Local Placeholder Gap Summary:');
console.log(`  - Local Medicaid/HHS Offices:      ${missingOffices.length} placeholder records`);
console.log(`  - Local School Districts:          ${missingDistricts.length} placeholder records`);
console.log(`  - Local Support Nonprofits:        ${missingNonprofits.length} placeholder records`);
console.log(`  - Child Therapy / IEP Providers:   ${missingProviders.length} placeholder records\n`);

console.log('2. National Standards Gaps:');
console.log(`  - Missing Forms Guides:            ${missingForms.length} (${missingForms.join(', ') || 'None'})`);
console.log(`  - Missing Program Appeals Guides:  ${missingAppeals.length} (${missingAppeals.join(', ') || 'None'})`);
console.log(`  - Missing Waiver Waitlist Rules:   ${missingWaitlists.length} (${missingWaitlists.join(', ') || 'None'})\n`);

console.log('3. High-Priority Counties to Deepen:');
if (priorityCountiesStatus.length > 0) {
  priorityCountiesStatus.forEach(c => {
    console.log(`  - County: ${c.id.padEnd(20)} | Placeholders: ${c.fallbackCount}/${c.totalRecords} records`);
  });
} else {
  console.log('  - No priority counties registered in state config yet.');
}

console.log('\n4. Recommended Crawl targets & Data Sources:');
crawlers.forEach((cr, idx) => {
  console.log(`  ${idx + 1}. Domain:   ${cr.domain}`);
  console.log(`     Extract:  ${cr.data}`);
  console.log(`     Priority: ${cr.priority}`);
});

console.log('\n5. Indexation Gating Audit:');
const totalFallbackRecords = offices.filter(o => o.data_origin === 'programmatic_fallback' || o.data_origin === 'generated_county_fallback').length +
  districts.filter(d => d.data_origin === 'programmatic_fallback' || d.data_origin === 'generated_county_fallback').length +
  nonprofits.filter(n => n.data_origin === 'programmatic_fallback' || n.data_origin === 'generated_county_fallback').length +
  advocates.filter(a => a.data_origin === 'programmatic_fallback' || a.data_origin === 'generated_county_fallback').length;
const totalDbRecords = offices.length + districts.length + nonprofits.length + advocates.length;
const fallbackShare = totalDbRecords > 0 ? (totalFallbackRecords / totalDbRecords) * 100 : 0;

if (fallbackShare > 15) {
  console.log(`  🚦 GATING STATUS: 🔴 KEEP GATED (noindex served on county pages)`);
  console.log(`     Reason: Generated fallback share is ${fallbackShare.toFixed(1)}% (must be < 15% to release indexation gating).`);
} else {
  console.log(`  🚦 GATING STATUS: 🟢 RELEASE GATING READY (Counties can be indexed)`);
  console.log(`     Reason: Explicit data coverage is healthy, placeholder fallbacks are at ${fallbackShare.toFixed(1)}%.`);
}
console.log('');

db.close();
