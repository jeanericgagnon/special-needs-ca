import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SEO_CLUSTERS } from '../../frontend/src/lib/seo-data.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');
const stateConfigsPath = path.resolve(__dirname, '../../frontend/src/lib/stateConfigs.ts');
const sitemapPath = path.resolve(__dirname, '../../frontend/src/lib/verifiedCounties.ts');

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

// Load configurations
let stateConfigsContent = '';
try {
  stateConfigsContent = fs.readFileSync(stateConfigsPath, 'utf8');
} catch (e) {}

let nonCaVerifiedCounties = [];
try {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  const match = sitemapContent.match(/NON_CA_VERIFIED_COUNTIES\s*=\s*\[([\s\S]*?)\]/);
  if (match) {
    nonCaVerifiedCounties = match[1].split(',').map(s => s.trim().replace(/['",]/g, '')).filter(Boolean);
  }
} catch (err) {}

// Parse specific state config
let requiredForms = [];
let corePrograms = [];
let priorityMetroCounties = [];
let catchmentName = 'Local DD Agency';
const stateCode = stateRecord.code.toLowerCase();

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

const counties = db.prepare('SELECT id, name, state_id FROM counties WHERE state_id = ?').all(stateId);
const countyCount = counties.length;
const expectedCounties = stateId === 'california' ? 58 : (stateId === 'texas' ? 254 : countyCount);

// Helpers
function getProvenance(records) {
  let fallback = 0;
  let explicit = 0;
  let verified = 0;
  let weightedDepthSum = 0;

  for (const r of records) {
    const isFallback = r.data_origin === 'programmatic_fallback' || r.data_origin === 'generated_county_fallback';
    if (isFallback) {
      fallback++;
    } else {
      explicit++;
    }

    // Check verification status
    const status = (r.verification_status || '').toLowerCase().trim();
    if (status === 'verified' || status === 'official_verified' || status === 'human_verified') {
      verified++;
    }

    // Calculate verified-depth weight
    let weight = 0.0;
    if (!isFallback) {
      if (status === 'verified' || status === 'official_verified' || status === 'human_verified') {
        weight = 1.0;
      } else if (status === 'source_listed' || status === 'pending_review') {
        weight = 0.5; // partial depth
      } else if (status === 'manual_review_required') {
        weight = 0.0; // zero depth
      } else {
        weight = 0.25; // default unverified weight
      }

      // Penalty: No source_url or evidence_level
      if (!r.source_url || r.source_url === '') {
        weight = 0.0;
      }

      // Penalty: Empty local contact data (no phone, no email, no website)
      const phone = r.phone || r.spec_ed_contact_phone;
      const email = r.email || r.spec_ed_contact_email;
      const website = r.website;
      const isContactEmpty = (!phone || phone === '') && (!email || email === '') && (!website || website === '');
      if (isContactEmpty) {
        weight = 0.0;
      }
    }

    weightedDepthSum += weight;
  }

  const weightedDepth = records.length > 0 ? (weightedDepthSum / records.length) * 100 : 0;
  return { fallback, explicit, verified, weightedDepth, total: records.length };
}

// Global Stats Tracker
const categoryScores = {};
const structuralCategoryScores = {}; // To store structural coverage scores
let totalFallbackRecords = 0;
let totalVerifiedRecords = 0;
let totalExplicitRecords = 0;
let totalDbRecords = 0;

function evaluateCategory(name, cov, depth, dens, hasFallback = true, fallbackShare = 0, verifiedShare = 0, explicitDepthVal = 0) {
  const penalty = hasFallback ? (1.0 - fallbackShare) : 1.0;
  const score = ((cov * 0.35) + (depth * 0.45) + (dens * 0.20)) * penalty;
  const structuralScore = ((cov * 0.35) + (explicitDepthVal * 0.45) + (dens * 0.20)) * penalty;

  categoryScores[name] = {
    coverage: cov,
    depth, // weighted verified depth
    density: dens,
    score,
    penalty,
    humanVerifiedMod: verifiedShare
  };

  structuralCategoryScores[name] = structuralScore;
  return score;
}

// 1. Geography
const geoCov = expectedCounties > 0 ? (countyCount / expectedCounties) * 100 : 0;
evaluateCategory('geography', geoCov, 100, 100, false);
totalDbRecords += countyCount;
totalExplicitRecords += countyCount;

// 2. Local DD Routing
const ddAgencies = db.prepare('SELECT id, name, agency_type, data_origin, verification_status, intake_phone AS phone, \'\' AS email, website, source_url FROM state_resource_agencies WHERE state_id = ?').all(stateId);
const mappedRoutingCount = db.prepare(`
  SELECT COUNT(DISTINCT rcc.county_id) as cnt 
  FROM regional_center_counties rcc
  JOIN counties c ON rcc.county_id = c.id
  WHERE c.state_id = ?
`).get(stateId).cnt;
const ddProv = getProvenance(ddAgencies);
totalFallbackRecords += ddProv.fallback;
totalExplicitRecords += ddProv.explicit;
totalVerifiedRecords += ddProv.verified;
totalDbRecords += ddProv.total;

const ddCov = countyCount > 0 ? (mappedRoutingCount / countyCount) * 100 : 0;
const ddDepth = ddProv.weightedDepth;
const ddExplicitDepth = ddAgencies.length > 0 ? (ddProv.explicit / ddAgencies.length) * 100 : 0;
const ddDens = ddAgencies.length > 0 ? 100 : 0;
const ddFallbackShare = ddAgencies.length > 0 ? ddProv.fallback / ddAgencies.length : 0;
const ddVerifiedShare = ddAgencies.length > 0 ? ddProv.verified / ddAgencies.length : 0;
evaluateCategory('ddRouting', ddCov, ddDepth, ddDens, true, ddFallbackShare, ddVerifiedShare, ddExplicitDepth);

// 3. Medicaid/HHS Offices
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
  SELECT co.id, co.data_origin, co.verification_status, co.phone, co.email, co.website, co.source_url
  FROM county_offices co
  JOIN counties c ON co.county_id = c.id
  WHERE c.state_id = ? AND co.program_id IN (${medicaidProgIds.map(() => '?').join(',')})
`).all(stateId, ...medicaidProgIds);

const officeProv = getProvenance(offices);
totalFallbackRecords += officeProv.fallback;
totalExplicitRecords += officeProv.explicit;
totalVerifiedRecords += officeProv.verified;
totalDbRecords += officeProv.total;

const countiesWithOffices = db.prepare(`
  SELECT COUNT(DISTINCT co.county_id) as cnt
  FROM county_offices co
  JOIN counties c ON co.county_id = c.id
  WHERE c.state_id = ? AND co.program_id IN (${medicaidProgIds.map(() => '?').join(',')})
`).get(stateId, ...medicaidProgIds).cnt;

const officeCov = countyCount > 0 ? (countiesWithOffices / countyCount) * 100 : 0;
const officeDepth = officeProv.weightedDepth;
const officeExplicitDepth = offices.length > 0 ? (officeProv.explicit / offices.length) * 100 : 0;
const officeDens = Math.min(officeProv.explicit / (countyCount || 1), 1.0) * 100;
const officeFallbackShare = offices.length > 0 ? officeProv.fallback / offices.length : 0;
const officeVerifiedShare = offices.length > 0 ? officeProv.verified / offices.length : 0;
evaluateCategory('medicaidOffices', officeCov, officeDepth, officeDens, true, officeFallbackShare, officeVerifiedShare, officeExplicitDepth);

// 4. Education/school layer
const regionalEd = db.prepare('SELECT id, name, agency_type, data_origin, verification_status, \'\' AS phone, \'\' AS email, website, source_url FROM regional_education_agencies WHERE state_id = ?').all(stateId);
const districts = db.prepare(`
  SELECT sd.id, sd.data_origin, sd.verification_status, sd.spec_ed_contact_phone as phone, sd.spec_ed_contact_email as email, sd.website, sd.source_url
  FROM school_districts sd
  JOIN counties c ON sd.county_id = c.id
  WHERE c.state_id = ?
`).all(stateId);

const edProv = getProvenance([...districts, ...regionalEd]);
totalFallbackRecords += edProv.fallback;
totalExplicitRecords += edProv.explicit;
totalVerifiedRecords += edProv.verified;
totalDbRecords += edProv.total;

const countiesWithDistricts = db.prepare(`
  SELECT COUNT(DISTINCT sd.county_id) as cnt FROM school_districts sd
  JOIN counties c ON sd.county_id = c.id
  WHERE c.state_id = ?
`).get(stateId).cnt;

const edCov = countyCount > 0 ? (countiesWithDistricts / countyCount) * 100 : 0;
const totalEdCount = districts.length + regionalEd.length;
const edDepth = edProv.weightedDepth;
const edExplicitDepth = totalEdCount > 0 ? (edProv.explicit / totalEdCount) * 100 : 0;
const edDens = Math.min(districts.filter(d => d.data_origin !== 'programmatic_fallback' && d.data_origin !== 'generated_county_fallback').length / (countyCount || 1), 1.0) * 100;
const edFallbackShare = totalEdCount > 0 ? edProv.fallback / totalEdCount : 0;
const edVerifiedShare = totalEdCount > 0 ? edProv.verified / totalEdCount : 0;
evaluateCategory('education', edCov, edDepth, edDens, true, edFallbackShare, edVerifiedShare, edExplicitDepth);

// 5. Forms & Appeals
const expectedFormsCount = stateId === 'california' ? 22 : 20;
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

const mappedAppealCount = appealProgs.filter(ap => stateWaiverListForAppeals.includes(ap.program_id)).length;
const appealCov = stateWaiverListForAppeals.length > 0 ? (mappedAppealCount / stateWaiverListForAppeals.length) * 100 : 0;
const formsCov = (requiredForms.length / expectedFormsCount) * 100;

const formsAppealsDepth = formsCov; 
const formsAppealsDens = appealCov;
evaluateCategory('formsAppeals', formsCov, formsAppealsDepth, formsAppealsDens, false, 0, 0, formsAppealsDepth);
totalDbRecords += requiredForms.length;
totalExplicitRecords += requiredForms.length;

// 6. Waivers & Waitlists
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

const mappedWaitlistCount = waitlists.filter(wl => stateWaiverList.includes(wl.program_id)).length;
const wlCov = stateWaiverList.length > 0 ? (mappedWaitlistCount / stateWaiverList.length) * 100 : 0;
evaluateCategory('waitlists', wlCov, 100, 100, false, 0, 0, 100);
totalDbRecords += mappedWaitlistCount;
totalExplicitRecords += mappedWaitlistCount;

// 7. Nonprofits
const nonprofits = db.prepare(`
  SELECT no.id, no.data_origin, no.verification_status, no.phone, '' as email, no.website, no.source_url
  FROM nonprofit_organizations no
  JOIN counties c ON no.county_id = c.id
  WHERE c.state_id = ?
`).all(stateId);

const npProv = getProvenance(nonprofits);
totalFallbackRecords += npProv.fallback;
totalExplicitRecords += npProv.explicit;
totalVerifiedRecords += npProv.verified;
totalDbRecords += npProv.total;

const countiesWithNonprofits = db.prepare(`
  SELECT COUNT(DISTINCT no.county_id) as cnt FROM nonprofit_organizations no
  JOIN counties c ON no.county_id = c.id
  WHERE c.state_id = ?
`).get(stateId).cnt;

const npCov = countyCount > 0 ? (countiesWithNonprofits / countyCount) * 100 : 0;
const npDepth = npProv.weightedDepth;
const npExplicitDepth = nonprofits.length > 0 ? (npProv.explicit / nonprofits.length) * 100 : 0;
const npDens = Math.min(nonprofits.filter(n => n.data_origin !== 'programmatic_fallback' && n.data_origin !== 'generated_county_fallback').length / (countyCount || 1), 0.5) * 200;
const npFallbackShare = nonprofits.length > 0 ? npProv.fallback / nonprofits.length : 0;
const npVerifiedShare = nonprofits.length > 0 ? npProv.verified / nonprofits.length : 0;
evaluateCategory('nonprofits', npCov, npDepth, npDens, true, npFallbackShare, npVerifiedShare, npExplicitDepth);

// 8. Providers/advocates
const uniqueAdvocates = db.prepare(`
  SELECT DISTINCT ia.id, ia.data_origin, ia.verification_status, ia.phone, ia.email, ia.website, ia.source_url
  FROM iep_advocates ia
  JOIN iep_advocate_counties iac ON ia.id = iac.iep_advocate_id
  JOIN counties c ON iac.county_id = c.id
  WHERE c.state_id = ?
`).all(stateId);

const advProv = getProvenance(uniqueAdvocates);
totalFallbackRecords += advProv.fallback;
totalExplicitRecords += advProv.explicit;
totalVerifiedRecords += advProv.verified;
totalDbRecords += advProv.total;

const countiesWithAdvocates = db.prepare(`
  SELECT COUNT(DISTINCT iac.county_id) as cnt
  FROM iep_advocate_counties iac
  JOIN counties c ON iac.county_id = c.id
  WHERE c.state_id = ?
`).get(stateId).cnt;

const advCov = countyCount > 0 ? (countiesWithAdvocates / countyCount) * 100 : 0;
const advDepth = advProv.weightedDepth;
const advExplicitDepth = uniqueAdvocates.length > 0 ? (advProv.explicit / uniqueAdvocates.length) * 100 : 0;
const advDens = Math.min(uniqueAdvocates.filter(a => a.data_origin !== 'programmatic_fallback' && a.data_origin !== 'generated_county_fallback').length / (countyCount || 1), 3.0) * 33.3;
const advFallbackShare = uniqueAdvocates.length > 0 ? advProv.fallback / uniqueAdvocates.length : 0;
const advVerifiedShare = uniqueAdvocates.length > 0 ? advProv.verified / uniqueAdvocates.length : 0;
evaluateCategory('providers', advCov, advDepth, advDens, true, advFallbackShare, advVerifiedShare, advExplicitDepth);

// 9. Source/provenance/trust
const totalWithOrigin = totalExplicitRecords + totalFallbackRecords;
const sourceCov = 100;
const sourceDepth = totalDbRecords > 0 ? (totalExplicitRecords / totalDbRecords) * 100 : 0;
const sourceDens = totalDbRecords > 0 ? (totalVerifiedRecords / totalDbRecords) * 100 : 0;
const sourceVerifiedShare = totalDbRecords > 0 ? totalVerifiedRecords / totalDbRecords : 0;
evaluateCategory('sourceTrust', sourceCov, sourceDepth, sourceDens, false, 0, sourceVerifiedShare, sourceDepth);

// 10. SEO/Index Quality
const sitemapCountiesForState = counties.filter(c => {
  if (c.state_id === 'california') return true;
  return nonCaVerifiedCounties.includes(c.id);
}).length;
const publicIndexReadiness = countyCount > 0 ? (sitemapCountiesForState / countyCount) * 100 : 0;
const seoCov = publicIndexReadiness;
const seoDepth = publicIndexReadiness;
const seoDens = 100;
evaluateCategory('seoIndex', seoCov, seoDepth, seoDens, false, 0, 0, seoDepth);

// --- COMPUTE WEIGHTED FINAL SCORE ---
const weights = {
  geography: 0.05,
  ddRouting: 0.15,
  medicaidOffices: 0.12,
  education: 0.12,
  formsAppeals: 0.12,
  waitlists: 0.10,
  nonprofits: 0.10,
  providers: 0.10,
  sourceTrust: 0.10,
  seoIndex: 0.04
};

let finalScore = 0;
let structuralScore = 0;
for (const key in weights) {
  finalScore += categoryScores[key].score * weights[key];
  structuralScore += structuralCategoryScores[key] * weights[key];
}

// --- APPLY HARD CAPS ---
const capApplied = {
  medicaidOfficeDepth: false,
  educationDepth: false,
  providerDepth: false,
  sourceProvenance: false,
  fallbackShare: false
};

const MedicaidOfficeDepthVal = categoryScores.medicaidOffices.depth;
const EducationDepthVal = categoryScores.education.depth;
const ProviderDepthVal = categoryScores.providers.depth;
const SourceProvenanceVal = categoryScores.sourceTrust.depth;
const FallbackShareVal = totalDbRecords > 0 ? (totalFallbackRecords / totalDbRecords) * 100 : 0;
const HumanVerificationShareVal = totalDbRecords > 0 ? (totalVerifiedRecords / totalDbRecords) * 100 : 0;

if (MedicaidOfficeDepthVal < 25) {
  finalScore = Math.min(finalScore, 85);
  capApplied.medicaidOfficeDepth = true;
}
if (EducationDepthVal < 35) {
  finalScore = Math.min(finalScore, 85);
  capApplied.educationDepth = true;
}
if (ProviderDepthVal < 25) {
  finalScore = Math.min(finalScore, 85);
  capApplied.providerDepth = true;
}
if (SourceProvenanceVal < 70) {
  finalScore = Math.min(finalScore, 80);
  capApplied.sourceProvenance = true;
}
if (FallbackShareVal > 50) {
  finalScore = Math.min(finalScore, 75);
  capApplied.fallbackShare = true;
}

// Apply caps to structural score too
if (officeExplicitDepth < 25) structuralScore = Math.min(structuralScore, 85);
if (edExplicitDepth < 35) structuralScore = Math.min(structuralScore, 85);
if (advExplicitDepth < 25) structuralScore = Math.min(structuralScore, 85);
if (SourceProvenanceVal < 70) structuralScore = Math.min(structuralScore, 80);
if (FallbackShareVal > 50) structuralScore = Math.min(structuralScore, 75);

// --- CLASSIFICATION ---
let classification = 'Structural shell';
if (finalScore >= 95 && HumanVerificationShareVal >= 50.0) {
  classification = 'Human-verified state';
} else if (finalScore >= 92) {
  classification = 'California-equivalent candidate';
} else if (finalScore >= 85) {
  classification = 'Near launch-grade';
} else if (finalScore >= 75) {
  classification = 'Strong pilot';
} else if (finalScore >= 60) {
  classification = 'Source-backed pilot';
} else if (finalScore >= 40) {
  classification = 'Basic pilot';
} else {
  classification = 'Structural shell';
}

if (HumanVerificationShareVal === 0 && classification === 'Human-verified state') {
  classification = 'California-equivalent candidate';
}

// Pilot launch score (with original 80% cap for non-CA)
const officeRealRatio = offices.length > 0 ? (offices.length - officeProv.fallback) / offices.length : 0;
const edRealRatio = totalEdCount > 0 ? (totalEdCount - edProv.fallback) / totalEdCount : 0;
const npRealRatio = nonprofits.length > 0 ? (nonprofits.length - npProv.fallback) / nonprofits.length : 0;
const advRealRatio = uniqueAdvocates.length > 0 ? (uniqueAdvocates.length - advProv.fallback) / uniqueAdvocates.length : 0;
const formsAppealsScore = (formsCov + appealCov) / 2;
const wlScore = stateWaiverList.length > 0 ? (mappedWaitlistCount / stateWaiverList.length) * 100 : 0;

let baseScore = (geoCov + ddCov + (officeCov + officeRealRatio*100)/2 + (edCov + edRealRatio*100)/2 + (npCov + npRealRatio*100)/2 + (advCov + advRealRatio*100)/2 + formsAppealsScore + (wlScore + 100)/2 + 90.0) / 9;
if (stateId !== 'california') {
  baseScore = Math.min(baseScore, 80.0);
}

// Next 10 Actions
const actions = [];
if (ddProv.fallback > 0) actions.push('Map catchment boundaries for DD agency routing to replace programmatic fallbacks');
if (officeProv.fallback > 0) actions.push('Crawl and ingest local HHS/Medicaid enrollment office addresses');
if (edProv.fallback > 0) actions.push('Research and seed direct school district special education director contacts');
if (npProv.fallback > 0) actions.push('Seeding of local parent networks, Arc chapters, and condition-specific nonprofits');
if (advProv.fallback > 0) actions.push('Collect and verify child developmental clinics, IEP advocates, and special ed attorneys');
if (mappedWaitlistCount < stateWaiverList.length) actions.push('Document state-specific waiver waitlist rules and interest list wait times');
if (mappedAppealCount < stateWaiverListForAppeals.length) actions.push('Seed appeals steps, fair hearing requirements, and deadlines in program_appeal_info');
if (requiredForms.length < expectedFormsCount) actions.push(`Collect required state forms guides (missing ${expectedFormsCount - requiredForms.length} checklists)`);
if (HumanVerificationShareVal === 0) actions.push('Submit priority counties and programs to human auditing queue');
if (publicIndexReadiness < 50) actions.push('Review and append pilot counties into counties.xml sitemap allowlist');
if (actions.length === 0) actions.push('Maintain quarterly data freshness crawls');

// --- PRINT OUTPUT ---
console.log('====================================================');
console.log(`🔍 CA-EQUIVALENCE DEPTH AUDIT: ${stateRecord.name.toUpperCase()} (${stateRecord.code})`);
console.log('====================================================\n');

console.log(`Pilot Launch Score:       ${baseScore.toFixed(1)}%`);
console.log(`Structural Coverage Score: ${structuralScore.toFixed(1)}%`);
console.log(`Verified-Depth Score:      ${finalScore.toFixed(1)}%  (${classification})`);
console.log(`Overall Coverage Score:   ${((ddCov + officeCov + edCov + npCov + advCov + formsCov + wlCov + publicIndexReadiness) / 8).toFixed(1)}%`);
console.log(`Overall Depth Score:      ${((ddDepth + officeDepth + edDepth + npDepth + advDepth + formsAppealsDepth + 100 + publicIndexReadiness) / 8).toFixed(1)}%`);
console.log(`Generated Fallback Share: ${FallbackShareVal.toFixed(1)}%`);
console.log(`Explicit/Source-Listed:   ${(100 - FallbackShareVal).toFixed(1)}%`);
console.log(`Human Verification Share: ${HumanVerificationShareVal.toFixed(1)}%`);
console.log(`Index Readiness:          ${publicIndexReadiness.toFixed(1)}%\n`);

console.log('Category Scores Breakdown:');
for (const key in categoryScores) {
  const c = categoryScores[key];
  console.log(`  - ${key.padEnd(16)}: ${c.score.toFixed(1)}%  (Cov: ${c.coverage.toFixed(0)}%, Depth: ${c.depth.toFixed(0)}%, Dens: ${c.density.toFixed(0)}%, Fallback Penalty: x${c.penalty.toFixed(2)})`);
}

console.log('\nHard Caps Applied:');
console.log(`  - Medicaid/HHS Local Depth < 25%: ${capApplied.medicaidOfficeDepth ? '⚠️  CAP TRIGGERED (Max 85%)' : '✅ Pass'}`);
console.log(`  - Education Local Depth < 35%:    ${capApplied.educationDepth ? '⚠️  CAP TRIGGERED (Max 85%)' : '✅ Pass'}`);
console.log(`  - Provider/Advocate Depth < 25%:  ${capApplied.providerDepth ? '⚠️  CAP TRIGGERED (Max 85%)' : '✅ Pass'}`);
console.log(`  - Source/Provenance Depth < 70%:  ${capApplied.sourceProvenance ? '⚠️  CAP TRIGGERED (Max 80%)' : '✅ Pass'}`);
console.log(`  - Fallback Share > 50%:           ${capApplied.fallbackShare ? '⚠️  CAP TRIGGERED (Max 75%)' : '✅ Pass'}`);

console.log('\nNext 10 Missing Actions:');
actions.slice(0, 10).forEach((act, idx) => {
  console.log(`  ${idx + 1}. [ ] ${act}`);
});
console.log('');

db.close();
