import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { stateCompletenessChecklist } from '../state-configs/stateCompletenessChecklist.ts';
import { SEO_CLUSTERS } from '../../frontend/src/lib/seo-data.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');
const frontendDir = path.resolve(__dirname, '../../frontend');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const CYAN = '\x1b[36m';

console.log(`${BOLD}====================================================${RESET}`);
console.log(`${BOLD}🔍 RUNNING STATE EXHAUSTIVE DATA STANDARD AUDIT${RESET}`);
console.log(`${BOLD}====================================================${RESET}\n`);

// Parse command line arguments
const args = process.argv.slice(2);
const stateArg = args[0] || 'california';
const stateId = stateArg.toLowerCase();

let db;
try {
  db = new Database(dbPath, { readonly: true });
} catch (e) {
  console.error(`${RED}❌ Error: Could not open database at ${dbPath}: ${e.message}${RESET}`);
  process.exit(1);
}

// Check if state is in DB
const stateRecord = db.prepare("SELECT * FROM states WHERE id = ?").get(stateId);
if (!stateRecord) {
  console.error(`${RED}❌ Error: State '${stateId}' is not registered in the database 'states' table.${RESET}`);
  db.close();
  process.exit(1);
}

console.log(`${BOLD}Auditing State: ${CYAN}${stateRecord.name} (${stateRecord.code})${RESET}\n`);

// Parse stateConfigs.ts using fs and regex to avoid Next.js JSON import issues
const stateConfigsPath = path.resolve(frontendDir, 'src/lib/stateConfigs.ts');
let requiredForms = [];
let corePrograms = [];
let priorityMetroCounties = [];

try {
  const stateConfigsContent = fs.readFileSync(stateConfigsPath, 'utf8');
  // Match the state block, then extract requiredForms, corePrograms, and priorityMetroCounties
  const stateBlockRegex = new RegExp(`['"]${stateId}['"]\\s*:\\s*\\{[\\s\\S]*?\\n\\s*\\}\\s*(?:,\\n\\s*['"]|\\n\\})`);
  const stateBlockMatch = stateConfigsContent.match(stateBlockRegex) || [stateConfigsContent];
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
} catch (err) {
  console.warn(`${YELLOW}⚠️ Warning: Could not parse state configs file: ${err.message}${RESET}`);
}

const counties = db.prepare("SELECT * FROM counties WHERE state_id = ?").all(stateId);
const expectedCounties = stateId === 'california' ? 58 : (stateId === 'texas' ? 254 : counties.length);

const oneYearAgo = new Date();
oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

function evaluateProvenance(records) {
  let explicit = 0;
  let sourceListed = 0;
  let fallback = 0;
  let verified = 0;
  let unverified = 0;
  let stale = 0;

  for (const r of records) {
    // Check data_origin
    if (r.data_origin === 'programmatic_fallback' || r.data_origin === 'generated_county_fallback') {
      fallback++;
    } else if (r.data_origin === 'curated_seed' || r.data_origin === 'national_seed' || r.data_origin === 'official') {
      explicit++;
    } else {
      explicit++;
    }

    // Check verification_status
    if (r.verification_status === 'official_verified' || r.verification_status === 'verified' || r.verification_status === 'human_verified') {
      verified++;
    } else if (r.verification_status === 'source_listed') {
      sourceListed++;
    } else if (r.verification_status === 'unverified' || r.verification_status === 'scraped_unverified') {
      unverified++;
    } else if (r.verification_status === 'generated_county_fallback') {
      // counted in fallback
    }

    // Check freshness
    const dateStr = r.last_verified_date || r.last_verified_at || r.last_scraped_at;
    if (dateStr) {
      try {
        const d = new Date(dateStr);
        if (d < oneYearAgo) {
          stale++;
        }
      } catch (e) {}
    }
  }

  return { explicit, sourceListed, fallback, verified, unverified, stale };
}

const report = {
  categories: {},
  scores: {}
};

// Major parent-facing flags
let localOfficesMostlyPlaceholders = false;
let advocatesNotLocalized = false;
let anyMajorExceeds90Fallback = false;

// 1. GEOGRAPHY & BACKEND REGISTRY
const geoCountCheck = counties.length === expectedCounties && expectedCounties > 0;
const geoFieldsCheck = counties.every(c => c.id && c.name && c.website);
const geoPassed = geoCountCheck && geoFieldsCheck;

const geoStats = evaluateProvenance(counties);
const geoCov = expectedCounties > 0 ? (counties.length / expectedCounties) * 100 : 0;
const geoDepth = 100; // Geography is structural

report.categories.geography = {
  name: 'Geography & Backend Registry',
  coverageScore: geoCov,
  depthScore: geoDepth,
  score: (geoCov + geoDepth) / 2,
  stats: geoStats,
  status: geoPassed ? 'complete' : 'partial',
  isMajor: false
};

// 2. LOCAL DEVELOPMENTAL DD ROUTING
const agencies = db.prepare("SELECT * FROM state_resource_agencies WHERE state_id = ?").all(stateId);
const mappedRoutingCount = db.prepare(`
  SELECT COUNT(DISTINCT rcc.county_id) as cnt 
  FROM regional_center_counties rcc
  JOIN counties c ON rcc.county_id = c.id
  WHERE c.state_id = ?
`).get(stateId).cnt;

const routingStats = evaluateProvenance(agencies);
const routingCov = expectedCounties > 0 ? (mappedRoutingCount / expectedCounties) * 100 : 0;
const routingDepth = agencies.length > 0 ? ((agencies.length - routingStats.fallback) / agencies.length) * 100 : 0;

let routingStatus = 'complete';
if (routingCov < 100) routingStatus = 'partial';
else if (routingStats.unverified > 0) routingStatus = 'requires_human_review';

report.categories.localRouting = {
  name: 'Local Developmental DD Routing',
  coverageScore: routingCov,
  depthScore: routingDepth,
  score: (routingCov + routingDepth) / 2,
  stats: routingStats,
  status: routingStatus,
  isMajor: false
};

// 3. LOCAL MEDICAID / HHS OFFICES (Major)
const medicaidProgIds = stateId === 'california' 
  ? ['medi-cal-for-kids-and-teens', 'california-childrens-services', 'hearing-aid-coverage', 'hcba'] 
  : stateId === 'florida'
  ? ['fl-medicaid-dcf']
  : stateId === 'new-york'
  ? ['ny-medicaid']
  : stateId === 'pennsylvania'
  ? ['pa-medicaid']
  : stateId === 'illinois'
  ? ['il-medicaid']
  : stateId === 'ohio'
  ? ['oh-medicaid']
  : stateId === 'georgia'
  ? ['ga-medicaid']
  : stateId === 'texas'
  ? ['tx-mdcp', 'tx-medicaid-chip']
  : [`${stateRecord.code.toLowerCase()}-medicaid`];
const caregiverProgIds = stateId === 'california' 
  ? ['ihss-for-children'] 
  : stateId === 'florida'
  ? ['fl-medicaid-dcf']
  : stateId === 'new-york'
  ? ['ny-medicaid']
  : stateId === 'pennsylvania'
  ? ['pa-medicaid']
  : stateId === 'illinois'
  ? ['il-medicaid']
  : stateId === 'ohio'
  ? ['oh-medicaid']
  : stateId === 'georgia'
  ? ['ga-medicaid']
  : stateId === 'texas'
  ? ['tx-mdcp']
  : [`${stateRecord.code.toLowerCase()}-personal-care`];
const officeProgIds = Array.from(new Set([...medicaidProgIds, ...caregiverProgIds]));

const offices = db.prepare(`
  SELECT co.* 
  FROM county_offices co
  JOIN counties c ON co.county_id = c.id
  WHERE c.state_id = ? AND co.program_id IN (${officeProgIds.map(() => '?').join(',')})
`).all(stateId, ...officeProgIds);

const countiesWithOffices = db.prepare(`
  SELECT COUNT(DISTINCT co.county_id) as cnt
  FROM county_offices co
  JOIN counties c ON co.county_id = c.id
  WHERE c.state_id = ? AND co.program_id IN (${officeProgIds.map(() => '?').join(',')})
`).get(stateId, ...officeProgIds).cnt;

const officeStats = evaluateProvenance(offices);
const officeCov = expectedCounties > 0 ? (countiesWithOffices / expectedCounties) * 100 : 0;
const officeDepth = offices.length > 0 ? ((offices.length - officeStats.fallback) / offices.length) * 100 : 0;

const officeFallbackPct = offices.length > 0 ? (officeStats.fallback / offices.length) : 0;
if (officeFallbackPct > 0.50) {
  localOfficesMostlyPlaceholders = true;
}
if (officeFallbackPct > 0.90) {
  anyMajorExceeds90Fallback = true;
}

let officeStatus = 'complete';
if (officeCov < 100) officeStatus = 'partial';
else if (officeFallbackPct > 0.75) officeStatus = 'partial';
else if (officeStats.unverified > 0) officeStatus = 'requires_human_review';

let officeScore = (officeCov + officeDepth) / 2;
if (officeFallbackPct > 0.75) {
  officeScore = Math.min(officeScore, 50);
}

report.categories.localOffices = {
  name: 'Local Medicaid / HHS Offices',
  coverageScore: officeCov,
  depthScore: officeDepth,
  score: officeScore,
  stats: officeStats,
  status: officeStatus,
  isMajor: true
};

// 4. SCHOOL DISTRICTS / EDUCATION LOCAL LAYER (Major)
const regionalEd = db.prepare("SELECT * FROM regional_education_agencies WHERE state_id = ?").all(stateId);
const districts = db.prepare(`
  SELECT sd.* FROM school_districts sd
  JOIN counties c ON sd.county_id = c.id
  WHERE c.state_id = ?
`).all(stateId);

const countiesWithDistricts = db.prepare(`
  SELECT COUNT(DISTINCT sd.county_id) as cnt FROM school_districts sd
  JOIN counties c ON sd.county_id = c.id
  WHERE c.state_id = ?
`).get(stateId).cnt;

const edStats = evaluateProvenance([...districts, ...regionalEd]);
const edCov = expectedCounties > 0 ? (countiesWithDistricts / expectedCounties) * 100 : 0;
const totalEd = districts.length + regionalEd.length;
const edDepth = totalEd > 0 ? ((totalEd - edStats.fallback) / totalEd) * 100 : 0;

const edFallbackPct = totalEd > 0 ? (edStats.fallback / totalEd) : 0;
if (edFallbackPct > 0.90) {
  anyMajorExceeds90Fallback = true;
}

let edStatus = 'complete';
if (edCov < 100) {
  edStatus = 'partial';
} else {
  const hasPriorityCounties = priorityMetroCounties && priorityMetroCounties.length > 0;
  let priorityCountiesWithExplicit = false;
  if (hasPriorityCounties) {
    priorityCountiesWithExplicit = priorityMetroCounties.every(countyId => {
      const countyEdAgencies = [...districts, ...regionalEd].filter(r => r.county_id === countyId || (r.counties_served && r.counties_served.includes(countyId)));
      return countyEdAgencies.some(r => r.data_origin !== 'programmatic_fallback' && r.data_origin !== 'generated_county_fallback');
    });
  }

  const hasStatewideFallbacks = edStats.fallback > 0;

  if (hasPriorityCounties && priorityCountiesWithExplicit && hasStatewideFallbacks) {
    edStatus = 'priority_complete_statewide_partial';
  } else if (edFallbackPct > 0.25) {
    edStatus = 'covered_with_fallbacks';
  } else if (edStats.unverified > 0) {
    edStatus = 'requires_human_review';
  }
}

let edScore = (edCov + edDepth) / 2;
if (edFallbackPct > 0.75) {
  edScore = Math.min(edScore, 50);
}

report.categories.education = {
  name: 'School Districts / Education Local Layer',
  coverageScore: edCov,
  depthScore: edDepth,
  score: edScore,
  stats: edStats,
  status: edStatus,
  isMajor: true
};

// 5. NONPROFITS / SUPPORT ORGANIZATIONS (Major)
const nonprofits = db.prepare(`
  SELECT no.* FROM nonprofit_organizations no
  JOIN counties c ON no.county_id = c.id
  WHERE c.state_id = ?
`).all(stateId);

const countiesWithNonprofits = db.prepare(`
  SELECT COUNT(DISTINCT no.county_id) as cnt FROM nonprofit_organizations no
  JOIN counties c ON no.county_id = c.id
  WHERE c.state_id = ?
`).get(stateId).cnt;

const npStats = evaluateProvenance(nonprofits);
const npCov = expectedCounties > 0 ? (countiesWithNonprofits / expectedCounties) * 100 : 0;
const npDepth = nonprofits.length > 0 ? ((nonprofits.length - npStats.fallback) / nonprofits.length) * 100 : 0;

const npFallbackPct = nonprofits.length > 0 ? (npStats.fallback / nonprofits.length) : 0;
if (npFallbackPct > 0.90) {
  anyMajorExceeds90Fallback = true;
}

let npStatus = 'complete';
if (npCov < 100) npStatus = 'partial';
else if (npFallbackPct > 0.75) npStatus = 'partial';
else if (npStats.unverified > 0) npStatus = 'requires_human_review';

let npScore = (npCov + npDepth) / 2;
if (npFallbackPct > 0.75) {
  npScore = Math.min(npScore, 50);
}

report.categories.nonprofits = {
  name: 'Nonprofits / Support Organizations',
  coverageScore: npCov,
  depthScore: npDepth,
  score: npScore,
  stats: npStats,
  status: npStatus,
  isMajor: true
};

// 6. ADVOCATES / PROVIDERS (Major)
const uniqueAdvocates = db.prepare(`
  SELECT DISTINCT ia.* 
  FROM iep_advocates ia
  JOIN iep_advocate_counties iac ON ia.id = iac.iep_advocate_id
  JOIN counties c ON iac.county_id = c.id
  WHERE c.state_id = ?
`).all(stateId);

const countiesWithAdvocates = db.prepare(`
  SELECT COUNT(DISTINCT iac.county_id) as cnt
  FROM iep_advocate_counties iac
  JOIN counties c ON iac.county_id = c.id
  WHERE c.state_id = ?
`).get(stateId).cnt;

const advStats = evaluateProvenance(uniqueAdvocates);
const advCov = expectedCounties > 0 ? (countiesWithAdvocates / expectedCounties) * 100 : 0;
const advDepth = uniqueAdvocates.length > 0 ? ((uniqueAdvocates.length - advStats.fallback) / uniqueAdvocates.length) * 100 : 0;

const advFallbackPct = uniqueAdvocates.length > 0 ? (advStats.fallback / uniqueAdvocates.length) : 0;
if (advFallbackPct > 0.90) {
  anyMajorExceeds90Fallback = true;
}

// Localization Check: If unique advocates are extremely small relative to state size
const uniqueCount = uniqueAdvocates.length;
const localizationRatio = expectedCounties > 0 ? uniqueCount / expectedCounties : 0;
if (uniqueCount < 10 || localizationRatio < 0.1) {
  advocatesNotLocalized = true;
}

// Calculate Provider Metro Mappings and Coverage metrics if defined
let metroCountyIds = priorityMetroCounties || [];
let providersMappedToMetroCount = 0;
let metroCountiesWithAtLeast3Providers = 0;
let metroCountiesWithLegalResource = 0;
let metroCountiesWithTherapyProvider = 0;
let ruralFallbackCoverage = 0;

if (metroCountyIds.length > 0) {
  const advocateCounties = db.prepare(`
    SELECT iac.* 
    FROM iep_advocate_counties iac
    JOIN counties c ON iac.county_id = c.id
    WHERE c.state_id = ?
  `).all(stateId);

  const metroAdvocateIds = new Set(
    advocateCounties
      .filter(ac => metroCountyIds.includes(ac.county_id))
      .map(ac => ac.iep_advocate_id)
  );
  providersMappedToMetroCount = metroAdvocateIds.size;

  for (const countyId of metroCountyIds) {
    const advocatesInCounty = uniqueAdvocates.filter(adv => {
      const isMapped = advocateCounties.some(ac => ac.county_id === countyId && ac.iep_advocate_id === adv.id);
      const isSourceListed = adv.verification_status === 'source_listed' || adv.verification_status === 'verified' || adv.verification_status === 'official_verified' || adv.verification_status === 'human_verified';
      return isMapped && isSourceListed;
    });
    if (advocatesInCounty.length >= 3) {
      metroCountiesWithAtLeast3Providers++;
    }

    const legalInCounty = uniqueAdvocates.filter(adv => {
      const isMapped = advocateCounties.some(ac => ac.county_id === countyId && ac.iep_advocate_id === adv.id);
      const text = `${adv.credentials} ${adv.specialties} ${adv.description}`.toLowerCase();
      const isLegal = text.includes('attorney') || text.includes('law') || text.includes('advocat') || text.includes('consultant') || text.includes('legal') || text.includes('coach') || text.includes('protection');
      return isMapped && isLegal;
    });
    if (legalInCounty.length >= 1) {
      metroCountiesWithLegalResource++;
    }

    const therapyInCounty = uniqueAdvocates.filter(adv => {
      const isMapped = advocateCounties.some(ac => ac.county_id === countyId && ac.iep_advocate_id === adv.id);
      const text = `${adv.credentials} ${adv.specialties} ${adv.description}`.toLowerCase();
      const isTherapy = text.includes('therapy') || text.includes('clinic') || text.includes('aba') || text.includes('speech') || text.includes('occupational') || text.includes('physical') || text.includes('rehab') || text.includes('therapist') || text.includes('clinical') || text.includes('eci');
      return isMapped && isTherapy;
    });
    if (therapyInCounty.length >= 1) {
      metroCountiesWithTherapyProvider++;
    }
  }

  const ruralCounties = counties.filter(c => !metroCountyIds.includes(c.id));
  const ruralCountiesWithCoverage = ruralCounties.filter(c => {
    return advocateCounties.some(ac => ac.county_id === c.id);
  });
  ruralFallbackCoverage = ruralCounties.length > 0 ? (ruralCountiesWithCoverage.length / ruralCounties.length) * 100 : 0;
}

report.providerMetroMetrics = {
  priorityMetroCounties,
  uniqueStatewide: uniqueAdvocates.length,
  mappedToMetro: providersMappedToMetroCount,
  countiesWithAtLeast3Providers: metroCountiesWithAtLeast3Providers,
  countiesWithLegal: metroCountiesWithLegalResource,
  countiesWithTherapy: metroCountiesWithTherapyProvider,
  ruralFallbackCoverage
};

let advStatus = 'complete';
if (advCov < 100) {
  advStatus = 'partial';
} else {
  const allMetrosCovered = priorityMetroCounties.length > 0 && metroCountiesWithAtLeast3Providers === priorityMetroCounties.length;
  const lowDensity = expectedCounties > 0 && (uniqueCount / expectedCounties) < 0.8;

  if (allMetrosCovered && lowDensity) {
    advStatus = 'priority_metros_complete_statewide_partial';
  } else if (advocatesNotLocalized) {
    advStatus = 'partial';
  } else if (advFallbackPct > 0.75) {
    advStatus = 'partial';
  } else if (advStats.unverified > 0) {
    advStatus = 'requires_human_review';
  }
}

let advScore = (advCov + advDepth) / 2;
if (advFallbackPct > 0.75 || advocatesNotLocalized) {
  advScore = Math.min(advScore, 50);
}

report.categories.providers = {
  name: 'Advocates / Providers',
  coverageScore: advCov,
  depthScore: advDepth,
  score: advScore,
  stats: advStats,
  status: advStatus,
  isMajor: true
};

// 7. FORMS & APPEALS (Major)
let mappedFormsCount = 0;
let completeFormsCount = 0;

for (const formSlug of requiredForms) {
  const formEntry = SEO_CLUSTERS[formSlug];
  if (formEntry) {
    mappedFormsCount++;
    const fieldsOk = formEntry.title && formEntry.metaDescription && formEntry.quickAnswer && formEntry.officialSources && formEntry.officialSources.length > 0;
    if (fieldsOk) {
      completeFormsCount++;
    }
  }
}

const formsCov = requiredForms.length > 0 ? (mappedFormsCount / requiredForms.length) * 100 : 0;
const formsDepth = requiredForms.length > 0 ? (completeFormsCount / requiredForms.length) * 100 : 0;

// Appeal programs mapping
const appealProgs = db.prepare("SELECT * FROM program_appeal_info").all();
const stateWaivers = stateId === 'california'
  ? ['ihss-for-children', 'regional-centers', 'early-start', 'medi-cal-for-kids-and-teens', 'california-childrens-services', 'hearing-aid-coverage', 'ssi-for-children', 'iep-special-education', 'hcba', 'self-determination-program']
  : stateId === 'florida'
  ? ['fl-ibudget', 'fl-cdc-plus', 'fl-medicaid-dcf']
  : stateId === 'new-york'
  ? ['ny-opwdd-waiver', 'ny-opwdd-self-direction', 'ny-medicaid']
  : stateId === 'pennsylvania'
  ? ['pa-consolidated-waiver', 'pa-community-living-waiver', 'pa-medicaid']
  : stateId === 'illinois'
  ? ['il-childrens-support-waiver', 'il-adults-dd-waiver', 'il-medicaid']
  : stateId === 'ohio'
  ? ['oh-individual-options-waiver', 'oh-level-one-waiver', 'oh-medicaid']
  : stateId === 'georgia'
  ? ['ga-comp-waiver', 'ga-now-waiver', 'ga-medicaid']
  : stateId === 'texas'
  ? ['tx-hcs', 'tx-class', 'tx-txhml', 'tx-mdcp', 'tx-eci', 'tx-tea-sped']
  : [`${stateRecord.code.toLowerCase()}-dd-waiver`, `${stateRecord.code.toLowerCase()}-dd-self-direction`, `${stateRecord.code.toLowerCase()}-medicaid`];
const mappedAppealCount = appealProgs.filter(ap => stateWaivers.includes(ap.program_id)).length;
const appealCov = stateWaivers.length > 0 ? (mappedAppealCount / stateWaivers.length) * 100 : 0;

const formsAppealsScore = (formsCov + formsDepth + appealCov) / 3;

let formsStatus = 'complete';
if (formsCov < 100 || appealCov < 100) formsStatus = 'partial';

report.categories.forms = {
  name: 'Forms & Appeals',
  coverageScore: formsCov,
  depthScore: formsDepth,
  score: formsAppealsScore,
  stats: { explicit: mappedFormsCount, sourceListed: mappedAppealCount, fallback: 0, verified: 0, unverified: 0, stale: 0 },
  status: formsStatus,
  isMajor: true
};

// 8. WAITLISTS & INTEREST LISTS (Major)
const waitlists = db.prepare("SELECT * FROM program_waitlists").all();
const stateWaiverList = stateId === 'california' 
  ? ['hcba', 'regional-centers', 'ihss-for-children', 'ssi-for-children', 'ccs-application'] 
  : stateId === 'florida'
  ? ['fl-ibudget']
  : stateId === 'new-york'
  ? ['ny-opwdd-waiver']
  : stateId === 'pennsylvania'
  ? ['pa-consolidated-waiver']
  : stateId === 'illinois'
  ? ['il-childrens-support-waiver']
  : stateId === 'ohio'
  ? ['oh-individual-options-waiver']
  : stateId === 'georgia'
  ? ['ga-comp-waiver']
  : stateId === 'texas'
  ? ['tx-hcs', 'tx-class', 'tx-txhml', 'tx-mdcp']
  : [`${stateRecord.code.toLowerCase()}-dd-waiver`];
const mappedWaitlistCount = waitlists.filter(wl => stateWaiverList.includes(wl.program_id)).length;
const wlCov = stateWaiverList.length > 0 ? (mappedWaitlistCount / stateWaiverList.length) * 100 : 0;
const wlDepth = 100; // Structural waitlist data is verified or missing

let wlStatus = 'complete';
if (wlCov < 100) wlStatus = 'partial';

report.categories.waitlists = {
  name: 'Waitlists & Interest Lists',
  coverageScore: wlCov,
  depthScore: wlDepth,
  score: (wlCov + wlDepth) / 2,
  stats: { explicit: mappedWaitlistCount, sourceListed: 0, fallback: 0, verified: 0, unverified: 0, stale: 0 },
  status: wlStatus,
  isMajor: true
};

// 9. PUBLIC PAGES, SEO & TEST SUITE
const requiredPages = [
  'frontend/src/app/benefits/[state]/[[...slug]]/page.tsx',
  'frontend/src/app/benefits/[state]/[diagnosis]/[county]/page.tsx',
  'frontend/src/app/counties/[state]/page.tsx',
  'frontend/src/app/counties/[state]/[slug]/page.tsx',
  'frontend/src/app/forms/page.tsx',
  'frontend/src/app/forms/[slug]/page.tsx',
  'frontend/src/app/conditions/[slug]/page.tsx'
];
let pagesExistCount = 0;
for (const p of requiredPages) {
  if (fs.existsSync(path.resolve(__dirname, '../../', p))) {
    pagesExistCount++;
  }
}

const robotsExists = fs.existsSync(path.resolve(frontendDir, 'src/app/robots.ts'));
const countiesSitemapExists = fs.existsSync(path.resolve(frontendDir, 'src/app/sitemaps/counties.xml/route.ts'));
const staticSitemapExists = fs.existsSync(path.resolve(frontendDir, 'src/app/sitemaps/static.xml/route.ts'));
let sitemapGatingCheck = false;
if (countiesSitemapExists) {
  const content = fs.readFileSync(path.resolve(frontendDir, 'src/app/sitemaps/counties.xml/route.ts'), 'utf8');
  sitemapGatingCheck = content.includes("stateId !== 'california'") || content.includes('stateId !== "california"') || content.includes("texas");
}

const e2eSpecExists = fs.existsSync(
  stateId === 'california'
    ? path.resolve(frontendDir, 'e2e/seo-sitemap.spec.ts')
    : path.resolve(frontendDir, `e2e/${stateId}-launch.spec.ts`)
);

const seoCov = (pagesExistCount / requiredPages.length) * 100;
let seoDepth = 0;
if (robotsExists) seoDepth += 20;
if (countiesSitemapExists) seoDepth += 20;
if (staticSitemapExists) seoDepth += 20;
if (sitemapGatingCheck) seoDepth += 20;
if (e2eSpecExists) seoDepth += 20;

report.categories.seo = {
  name: 'Public Pages, SEO & Test Suite',
  coverageScore: seoCov,
  depthScore: seoDepth,
  score: (seoCov + seoDepth) / 2,
  stats: { explicit: pagesExistCount + 5, sourceListed: 0, fallback: 0, verified: 0, unverified: 0, stale: 0 },
  status: (seoCov === 100 && seoDepth === 100) ? 'complete' : 'partial',
  isMajor: false
};

// =====================================================
// SCORECARD OUTPUT DISPLAY
// =====================================================
console.log(`${BOLD}====================================================${RESET}`);
console.log(`${BOLD}📊 STATE READINESS score CARD breakdown${RESET}`);
console.log(`${BOLD}====================================================${RESET}\n`);

const headers = ['Category', 'Coverage', 'Depth', 'Explicit', 'Source-Listed', 'Fallback', 'Verified', 'Unverified', 'Stale', 'Status', 'Score'];
console.log(
  headers[0].padEnd(42) + ' ' +
  headers[1].padStart(9) + ' ' +
  headers[2].padStart(9) + ' ' +
  headers[3].padStart(9) + ' ' +
  headers[4].padStart(13) + ' ' +
  headers[5].padStart(9) + ' ' +
  headers[6].padStart(9) + ' ' +
  headers[7].padStart(11) + ' ' +
  headers[8].padStart(6) + ' ' +
  headers[9].padEnd(23) + ' ' +
  headers[10].padStart(6)
);
console.log('-'.repeat(160));

let scoreSum = 0;
const categoryKeys = Object.keys(report.categories);

for (const key of categoryKeys) {
  const cat = report.categories[key];
  scoreSum += cat.score;

  let color = RED;
  if (cat.status === 'complete') color = GREEN;
  else if (cat.status === 'covered_with_fallbacks' || cat.status === 'requires_human_review') color = YELLOW;

  console.log(
    cat.name.padEnd(42) + ' ' +
    `${cat.coverageScore.toFixed(1)}%`.padStart(9) + ' ' +
    `${cat.depthScore.toFixed(1)}%`.padStart(9) + ' ' +
    String(cat.stats.explicit).padStart(9) + ' ' +
    String(cat.stats.sourceListed).padStart(13) + ' ' +
    String(cat.stats.fallback).padStart(9) + ' ' +
    String(cat.stats.verified).padStart(9) + ' ' +
    String(cat.stats.unverified).padStart(11) + ' ' +
    String(cat.stats.stale).padStart(6) + ' ' +
    `${color}${cat.status.toUpperCase()}${RESET}`.padEnd(32) + ' ' +
    `${cat.score.toFixed(1)}%`.padStart(6)
  );
}
console.log('-'.repeat(160));

let finalStateScore = scoreSum / categoryKeys.length;

// Apply depth penalties
console.log(`\n${BOLD}Applying Standard Depth Penalties...${RESET}`);
if (anyMajorExceeds90Fallback) {
  console.log(`  ${RED}⚠️ Penalty Active: A major category exceeds 90% generated fallbacks. Final score capped at 80.0%.${RESET}`);
  finalStateScore = Math.min(finalStateScore, 80.0);
}
if (localOfficesMostlyPlaceholders) {
  console.log(`  ${RED}⚠️ Penalty Active: Local offices are mostly placeholder fallbacks.${RESET}`);
}
if (advocatesNotLocalized) {
  console.log(`  ${RED}⚠️ Penalty Active: Providers and special education advocates are not localized.${RESET}`);
}
if (stateId !== 'california') {
  console.log(`  ${RED}⚠️ Penalty Active: Sitemap indexation gating active & county-diagnosis leaves blocked. Final score capped at 80.0%.${RESET}`);
  finalStateScore = Math.min(finalStateScore, 80.0);
}

let finalColor = RED;
if (finalStateScore >= 90) finalColor = GREEN;
else if (finalStateScore >= 70) finalColor = YELLOW;

console.log(`\n  ${BOLD}Final State Completeness Score: ${finalColor}${finalStateScore.toFixed(1)}%${RESET}\n`);

// Calculate overall statistics
let totalExplicit = 0;
let totalSourceListed = 0;
let totalFallback = 0;
let totalVerified = 0;

for (const key of categoryKeys) {
  const cat = report.categories[key];
  totalExplicit += cat.stats.explicit;
  totalSourceListed += cat.stats.sourceListed;
  totalFallback += cat.stats.fallback;
  totalVerified += cat.stats.verified;
}

const avgCoverage = (categoryKeys.reduce((sum, key) => sum + report.categories[key].coverageScore, 0)) / categoryKeys.length;
const avgDepth = (categoryKeys.reduce((sum, key) => sum + report.categories[key].depthScore, 0)) / categoryKeys.length;

// Priority County Completeness
let priorityCountyCompleteness = 0;
if (priorityMetroCounties.length > 0) {
  let completeCount = 0;
  for (const countyId of priorityMetroCounties) {
    const hasOffice = offices.some(o => o.county_id === countyId && o.data_origin !== 'programmatic_fallback' && o.data_origin !== 'generated_county_fallback');
    const hasDistrict = districts.some(d => d.county_id === countyId && d.data_origin !== 'programmatic_fallback' && d.data_origin !== 'generated_county_fallback');
    const hasNonprofit = nonprofits.some(n => n.county_id === countyId && n.data_origin !== 'programmatic_fallback' && n.data_origin !== 'generated_county_fallback');
    
    const advocateCounties = db.prepare("SELECT * FROM iep_advocate_counties WHERE county_id = ?").all(countyId);
    const has3Providers = advocateCounties.length >= 3;

    if (hasOffice && hasDistrict && hasNonprofit && has3Providers) {
      completeCount++;
    }
  }
  priorityCountyCompleteness = (completeCount / priorityMetroCounties.length) * 100;
}

// Public Index Readiness
let nonCaVerifiedCounties = [];
try {
  const sitemapContent = fs.readFileSync(path.resolve(frontendDir, 'src/lib/verifiedCounties.ts'), 'utf8');
  const match = sitemapContent.match(/NON_CA_VERIFIED_COUNTIES\s*=\s*\[([\s\S]*?)\]/);
  if (match) {
    nonCaVerifiedCounties = match[1].split(',').map(s => s.trim().replace(/['",]/g, '')).filter(Boolean);
  }
} catch (err) {}

const sitemapCountiesForState = counties.filter(c => {
  if (c.state_id === 'california') return true;
  return nonCaVerifiedCounties.includes(c.id);
}).length;

const publicIndexReadiness = counties.length > 0 ? (sitemapCountiesForState / counties.length) * 100 : 0;
const humanVerificationStatus = totalExplicit > 0 ? (totalVerified / totalExplicit) * 100 : 0;

console.log(`${BOLD}====================================================${RESET}`);
console.log(`${BOLD}📊 STATE READINESS METRICS SUMMARY${RESET}`);
console.log(`${BOLD}====================================================${RESET}`);
console.log(`  • Overall Coverage Score:       ${avgCoverage.toFixed(1)}%`);
console.log(`  • Overall Depth Score:          ${avgDepth.toFixed(1)}%`);
console.log(`  • Explicit Records:             ${totalExplicit}`);
console.log(`  • Source-Listed Records:        ${totalSourceListed}`);
console.log(`  • Generated Fallback Records:   ${totalFallback}`);
console.log(`  • Priority County Completeness: ${priorityCountyCompleteness.toFixed(1)}%`);
console.log(`  • Public Index Readiness:       ${publicIndexReadiness.toFixed(1)}%`);
console.log(`  • Forms & Appeals Completeness: ${formsAppealsScore.toFixed(1)}%`);
console.log(`  • Human Verification Status:    ${humanVerificationStatus.toFixed(1)}%`);
console.log(`${BOLD}====================================================${RESET}\n`);

// Print Provider Metro Coverage Metrics if applicable
if (report.providerMetroMetrics && report.providerMetroMetrics.priorityMetroCounties.length > 0) {
  console.log(`${BOLD}====================================================${RESET}`);
  console.log(`${BOLD}📊 PROVIDER METRO COVERAGE REPORT${RESET}`);
  console.log(`${BOLD}====================================================${RESET}`);
  console.log(`  • Unique providers statewide:                     ${report.providerMetroMetrics.uniqueStatewide}`);
  console.log(`  • Providers mapped to priority metro counties:    ${report.providerMetroMetrics.mappedToMetro}`);
  console.log(`  • Priority metro counties with >=3 providers:    ${report.providerMetroMetrics.countiesWithAtLeast3Providers} / ${report.providerMetroMetrics.priorityMetroCounties.length}`);
  console.log(`  • Priority metro counties with >=1 legal/advocacy: ${report.providerMetroMetrics.countiesWithLegal} / ${report.providerMetroMetrics.priorityMetroCounties.length}`);
  console.log(`  • Priority metro counties with >=1 therapy:        ${report.providerMetroMetrics.countiesWithTherapy} / ${report.providerMetroMetrics.priorityMetroCounties.length}`);
  console.log(`  • Statewide rural fallback coverage:              ${report.providerMetroMetrics.ruralFallbackCoverage.toFixed(1)}%`);
  console.log(`${BOLD}====================================================${RESET}\n`);
}

// Classification logic
let classification = '';
let isLaunchable = false;

if (finalStateScore >= 90 && !localOfficesMostlyPlaceholders && !advocatesNotLocalized && !anyMajorExceeds90Fallback) {
  classification = `${GREEN}Exhaustive & Launchable${RESET}`;
  isLaunchable = true;
} else if (finalStateScore >= 70 || localOfficesMostlyPlaceholders) {
  classification = `${YELLOW}Factory Proof / Pilot Launchable (Lacks full depth)${RESET}`;
} else {
  classification = `${RED}Data Buildout Required (Under-developed)${RESET}`;
}

console.log(`${BOLD}State Classification:${RESET}`);
console.log(`  Status: ${classification}\n`);

db.close();
process.exit(isLaunchable ? 0 : 1);
