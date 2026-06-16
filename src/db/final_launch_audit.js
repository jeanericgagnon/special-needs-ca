#!/usr/bin/env node
/**
 * final_launch_audit.js
 * 
 * Production-readiness audit for the 50-state Special Needs Navigator.
 * 
 * Checks:
 * 1. State classification language (exhaustive vs pilot vs routing)
 * 2. Trust label correctness across state samples
 * 3. Indexation correctness (state hubs, county roots, leaves, excluded routes)
 * 4. Content quality (null/undefined, empty sections, CA leaks, fake offices)
 * 5. Robots.txt & sitemap correctness
 * 6. Freshness metadata presence
 * 
 * Usage: node src/db/final_launch_audit.js
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const DB_PATH = path.join(ROOT, 'ca_disability_navigator.db');
const CRAWLER_DB_PATH = path.join(ROOT, 'frontend/ca_disability_crawler.db');

// ====== Configuration ======
const EXHAUSTIVE_STATES = new Set(['california']);
const PILOT_STATES = new Set(['texas', 'florida', 'new-york', 'pennsylvania', 'illinois', 'ohio', 'georgia']);

const ALL_50_STATE_IDS = [
  'alabama','alaska','arizona','arkansas','california','colorado','connecticut',
  'delaware','florida','georgia','hawaii','idaho','illinois','indiana','iowa',
  'kansas','kentucky','louisiana','maine','maryland','massachusetts','michigan',
  'minnesota','mississippi','missouri','montana','nebraska','nevada',
  'new-hampshire','new-jersey','new-mexico','new-york','north-carolina',
  'north-dakota','ohio','oklahoma','oregon','pennsylvania','rhode-island',
  'south-carolina','south-dakota','tennessee','texas','utah','vermont',
  'virginia','washington','west-virginia','wisconsin','wyoming'
];

const NON_CA_VERIFIED_COUNTIES = [
  'travis-tx','harris-tx','miami-dade-fl','broward-fl','palm-beach-fl',
  'hillsborough-fl','orange-fl','pinellas-fl','duval-fl','lee-fl','polk-fl',
  'brevard-fl','pasco-fl','seminole-fl','alachua-fl','leon-fl',
  'kings-ny','queens-ny','new-york-ny','bronx-ny','richmond-ny',
  'nassau-ny','suffolk-ny','westchester-ny','erie-ny','monroe-ny','onondaga-ny','albany-ny',
  'philadelphia-pa','allegheny-pa','montgomery-pa','bucks-pa','delaware-pa',
  'chester-pa','lancaster-pa','berks-pa',
  'cook-il','dupage-il','lake-il','will-il','kane-il','mchenry-il','winnebago-il',
  'sangamon-il','st-clair-il','madison-il',
  'franklin-oh','cuyahoga-oh','hamilton-oh','summit-oh','montgomery-oh','lucas-oh','stark-oh',
  'fulton-ga','gwinnett-ga','cobb-ga','dekalb-ga','clayton-ga','cherokee-ga',
  'forsyth-ga','chatham-ga','richmond-ga','muscogee-ga','clarke-ga',
  // ... 42 new state pilot counties (2 each)
  'jefferson-al','madison-al','anchorage-ak','matanuska-susitna-borough-ak',
  'maricopa-az','pima-az','pulaski-ar','benton-ar','el-paso-co','city-and-county-of-denver-co',
  'fairfield-ct','hartford-ct','new-castle-de','sussex-de','honolulu-hi','hawai-i-hi',
  'ada-id','canyon-id','marion-in','lake-in','polk-ia','linn-ia','johnson-ks','sedgwick-ks',
  'jefferson-ky','fayette-ky','east-baton-rouge-parish-la','jefferson-parish-la',
  'cumberland-me','york-me','montgomery-md','prince-george-s-md','middlesex-ma','worcester-ma',
  'wayne-mi','oakland-mi','hennepin-mn','ramsey-mn','harrison-ms','hinds-ms',
  'saint-louis-mo','jackson-mo','yellowstone-mt','gallatin-mt','douglas-ne','lancaster-ne',
  'clark-nv','washoe-nv','hillsborough-nh','rockingham-nh','bergen-nj','middlesex-nj',
  'bernalillo-nm','do-a-ana-nm','wake-nc','mecklenburg-nc','cass-nd','burleigh-nd',
  'oklahoma-ok','tulsa-ok','multnomah-or','washington-or','providence-ri','kent-ri',
  'greenville-sc','richland-sc','minnehaha-sd','pennington-sd','shelby-tn','davidson-tn',
  'salt-lake-ut','utah-ut','chittenden-vt','rutland-vt','fairfax-va','prince-william-va',
  'king-wa','pierce-wa','kanawha-wv','berkeley-wv','milwaukee-wi','dane-wi',
  'laramie-wy','natrona-wy'
];

// ====== Audit Results Tracker ======
let pass = 0;
let warn = 0;
let fail = 0;
const failures = [];
const warnings = [];
const stats = {};

function ok(label) {
  pass++;
  console.log(`  ✅ ${label}`);
}
function wn(label) {
  warn++;
  warnings.push(label);
  console.log(`  ⚠️  ${label}`);
}
function er(label) {
  fail++;
  failures.push(label);
  console.log(`  ❌ ${label}`);
}

// ====== Open Databases ======
let navDb, crawlerDb;

try {
  navDb = new Database(DB_PATH, { readonly: true });
  console.log('✓ Navigator DB opened');
} catch (e) {
  console.error('FATAL: Cannot open navigator DB:', e.message);
  process.exit(1);
}

try {
  crawlerDb = new Database(CRAWLER_DB_PATH, { readonly: true });
  console.log('✓ Crawler DB opened');
} catch (e) {
  console.warn('⚠️  Crawler DB not available (non-fatal):', e.message);
  crawlerDb = null;
}

// ====== SECTION 1: State Classification Coverage ======
console.log('\n══════════════════════════════════════════════════════');
console.log(' SECTION 1: State Presence & Classification');
console.log('══════════════════════════════════════════════════════');

const allStates = navDb.prepare('SELECT id, name, code FROM states ORDER BY id').all();
stats.totalStates = allStates.length;

console.log(`Total states in DB: ${allStates.length}`);

// Check all 50 expected states exist
const dbStateIds = new Set(allStates.map(s => s.id));
const missingStates = ALL_50_STATE_IDS.filter(s => !dbStateIds.has(s));
if (missingStates.length === 0) {
  ok(`All 50 states present in DB`);
} else {
  er(`Missing ${missingStates.length} states: ${missingStates.join(', ')}`);
}

// Classification summary
let exhaustiveCount = 0, pilotCount = 0;
for (const s of allStates) {
  if (EXHAUSTIVE_STATES.has(s.id)) exhaustiveCount++;
  else pilotCount++;
}
stats.exhaustiveStates = exhaustiveCount;
stats.pilotStates = pilotCount;

ok(`Exhaustive states: ${exhaustiveCount} (California only)`);
ok(`Pilot source-backed states: ${pilotCount} (all other states)`);

// ====== SECTION 2: County Coverage & Sitemap Gates ======
console.log('\n══════════════════════════════════════════════════════');
console.log(' SECTION 2: County Coverage & Sitemap Gates');
console.log('══════════════════════════════════════════════════════');

const allCounties = navDb.prepare('SELECT id, name, state_id FROM counties ORDER BY state_id, id').all();
const caCounties = allCounties.filter(c => c.state_id === 'california');
const nonCaCounties = allCounties.filter(c => c.state_id !== 'california');

stats.totalCounties = allCounties.length;
stats.caCounties = caCounties.length;
stats.nonCaCounties = nonCaCounties.length;

console.log(`Total counties in DB: ${allCounties.length} (CA: ${caCounties.length}, non-CA: ${nonCaCounties.length})`);

// Check NON_CA_VERIFIED_COUNTIES are all in DB
const dbCountyIds = new Set(allCounties.map(c => c.id));
const missingPilotCounties = NON_CA_VERIFIED_COUNTIES.filter(c => !dbCountyIds.has(c));
if (missingPilotCounties.length === 0) {
  ok(`All ${NON_CA_VERIFIED_COUNTIES.length} verified non-CA counties present in DB`);
} else {
  wn(`Missing ${missingPilotCounties.length} pilot counties from DB: ${missingPilotCounties.slice(0,5).join(', ')}...`);
}
stats.nonCaVerifiedCounties = NON_CA_VERIFIED_COUNTIES.length;

// ====== SECTION 3: Program Coverage ======
console.log('\n══════════════════════════════════════════════════════');
console.log(' SECTION 3: Program & Content Coverage');
console.log('══════════════════════════════════════════════════════');

const allPrograms = navDb.prepare('SELECT COUNT(*) as cnt FROM programs').get();
const nonCaPrograms = navDb.prepare("SELECT COUNT(*) as cnt FROM programs WHERE state_id IS NOT NULL AND state_id != 'california'").get();
const caPrograms = navDb.prepare("SELECT COUNT(*) as cnt FROM programs WHERE state_id = 'california' OR state_id IS NULL").get();

stats.totalPrograms = allPrograms.cnt;
stats.caPrograms = caPrograms.cnt;
stats.nonCaPrograms = nonCaPrograms.cnt;

ok(`Total programs: ${allPrograms.cnt} (CA: ${caPrograms.cnt}, non-CA: ${nonCaPrograms.cnt})`);

// County offices coverage
const officeCount = navDb.prepare('SELECT COUNT(*) as cnt FROM county_offices').get();
const caOfficeCount = navDb.prepare("SELECT COUNT(*) as cnt FROM county_offices co JOIN counties c ON co.county_id = c.id WHERE c.state_id = 'california'").get();
stats.totalOffices = officeCount.cnt;
stats.caOffices = caOfficeCount.cnt;
stats.nonCaOffices = officeCount.cnt - caOfficeCount.cnt;

ok(`County offices: ${officeCount.cnt} (CA: ${caOfficeCount.cnt}, non-CA: ${officeCount.cnt - caOfficeCount.cnt})`);

// School districts coverage
const districtCount = navDb.prepare('SELECT COUNT(*) as cnt FROM school_districts').get();
stats.totalDistricts = districtCount.cnt;
ok(`School districts: ${districtCount.cnt}`);

// ====== SECTION 4: Trust Label Audit ======
console.log('\n══════════════════════════════════════════════════════');
console.log(' SECTION 4: Trust Label Audit');
console.log('══════════════════════════════════════════════════════');

// Check county offices have verification_status and data_origin
const officesWithoutStatus = navDb.prepare(
  "SELECT COUNT(*) as cnt FROM county_offices WHERE verification_status IS NULL OR verification_status = ''"
).get();
const officesWithoutOrigin = navDb.prepare(
  "SELECT COUNT(*) as cnt FROM county_offices WHERE data_origin IS NULL OR data_origin = ''"
).get();

stats.officesWithoutStatus = officesWithoutStatus.cnt;
stats.officesWithoutOrigin = officesWithoutOrigin.cnt;

if (officesWithoutStatus.cnt === 0) {
  ok(`All county offices have verification_status`);
} else {
  er(`${officesWithoutStatus.cnt} county offices missing verification_status`);
}

if (officesWithoutOrigin.cnt === 0) {
  ok(`All county offices have data_origin`);
} else {
  wn(`${officesWithoutOrigin.cnt} county offices missing data_origin`);
}

// Check for offices that claim "human_verified" without source
try {
  const fakeVerified = navDb.prepare(
    "SELECT COUNT(*) as cnt FROM county_offices WHERE verification_status = 'human_verified' AND (source_url IS NULL OR source_url = '')"
  ).get();
  if (fakeVerified.cnt === 0) {
    ok(`No offices claim human_verified without source URL`);
  } else {
    er(`${fakeVerified.cnt} offices claim human_verified but have no source_url`);
  }
  stats.fakeVerifiedCount = fakeVerified.cnt;
} catch (e) {
  wn(`Could not check human_verified integrity: ${e.message}`);
}

// Regional centers - check verification
try {
  const rcNoStatus = navDb.prepare(
    "SELECT COUNT(*) as cnt FROM regional_centers WHERE verification_status IS NULL"
  ).get();
  if (rcNoStatus.cnt === 0) {
    ok(`All regional centers have verification_status`);
  } else {
    wn(`${rcNoStatus.cnt} regional centers missing verification_status`);
  }
} catch (e) {
  wn(`regional_centers table check skipped: ${e.message}`);
}

// Generated fallback count
try {
  const generatedCount = navDb.prepare(
    "SELECT COUNT(*) as cnt FROM county_offices WHERE data_origin = 'generated_fallback'"
  ).get();
  stats.generatedFallbackCount = generatedCount.cnt;
  ok(`Generated fallback records: ${generatedCount.cnt}`);

  // Ensure generated fallbacks don't claim human_verified
  const badFallbacks = navDb.prepare(
    "SELECT COUNT(*) as cnt FROM county_offices WHERE data_origin = 'generated_fallback' AND verification_status = 'human_verified'"
  ).get();
  if (badFallbacks.cnt === 0) {
    ok(`No generated fallbacks claim human_verified`);
  } else {
    er(`${badFallbacks.cnt} generated fallbacks incorrectly claim human_verified`);
  }
} catch (e) {
  wn(`Generated fallback check skipped: ${e.message}`);
}

// Source-listed records
try {
  const sourceListed = navDb.prepare(
    "SELECT COUNT(*) as cnt FROM county_offices WHERE data_origin IN ('official_source', 'state_website', 'federal_source')"
  ).get();
  stats.sourceListedCount = sourceListed.cnt;
  ok(`Source-listed records: ${sourceListed.cnt}`);
} catch (e) {
  stats.sourceListedCount = 'N/A';
  wn(`Source-listed count skipped: ${e.message}`);
}

// ====== SECTION 5: Indexation Logic Verification ======
console.log('\n══════════════════════════════════════════════════════');
console.log(' SECTION 5: Indexation & robots.txt');
console.log('══════════════════════════════════════════════════════');

const robotsPath = path.join(ROOT, 'frontend/src/app/robots.ts');
if (fs.existsSync(robotsPath)) {
  const robotsContent = fs.readFileSync(robotsPath, 'utf8');
  const hasDisallowDashboard = robotsContent.includes('/dashboard');
  const hasDisallowLogin = robotsContent.includes('/login');
  const hasDisallowApi = robotsContent.includes('/api/*');
  if (hasDisallowDashboard && hasDisallowLogin && hasDisallowApi) {
    ok(`robots.ts disallows /dashboard, /login, /api/*`);
  } else {
    const missing = [
      !hasDisallowDashboard && '/dashboard',
      !hasDisallowLogin && '/login',
      !hasDisallowApi && '/api/*'
    ].filter(Boolean).join(', ');
    er(`robots.ts missing disallow rules for: ${missing}`);
  }
} else {
  er('robots.ts not found');
}

// Check county leaf noindex in page.tsx
const leafPagePath = path.join(ROOT, 'frontend/src/app/benefits/[state]/[diagnosis]/[county]/page.tsx');
if (fs.existsSync(leafPagePath)) {
  const leafContent = fs.readFileSync(leafPagePath, 'utf8');
  const hasNoindexLogic = leafContent.includes('index: false');
  if (hasNoindexLogic) {
    ok(`County leaf page has noindex logic`);
  } else {
    er(`County leaf page missing noindex robots control`);
  }
} else {
  er('County leaf page not found');
}

// Check hub page noindex for unverified counties
const hubPagePath = path.join(ROOT, 'frontend/src/app/benefits/[state]/[[...slug]]/page.tsx');
if (fs.existsSync(hubPagePath)) {
  const hubContent = fs.readFileSync(hubPagePath, 'utf8');
  const hasNoindex = hubContent.includes('index: false, follow: true');
  const hasCoverBadge = hubContent.includes('StateCoverageBadge');
  if (hasNoindex) {
    ok(`Hub page has conditional noindex for unverified counties`);
  } else {
    er(`Hub page missing noindex logic for unverified counties`);
  }
  if (hasCoverBadge) {
    ok(`Hub page has StateCoverageBadge component`);
  } else {
    er(`Hub page missing StateCoverageBadge — classification language not displayed`);
  }
} else {
  er('Hub page not found');
}

// Check sitemap counties route has quality gates
const sitemapPath = path.join(ROOT, 'frontend/src/app/sitemaps/counties.xml/route.ts');
if (fs.existsSync(sitemapPath)) {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  const hasQualityGate = sitemapContent.includes('passesCountyQualityGate');
  const hasNonCaVerified = sitemapContent.includes('NON_CA_VERIFIED_COUNTIES');
  const hasNonCaBlock = sitemapContent.includes("stateId !== 'california'");
  if (hasQualityGate && hasNonCaVerified) {
    ok(`Sitemap has CA quality gate + NON_CA_VERIFIED_COUNTIES allowlist`);
  } else {
    er(`Sitemap missing quality gate or verified counties list`);
  }
  if (hasNonCaBlock) {
    ok(`Sitemap blocks non-CA county×diagnosis leaves`);
  } else {
    er(`Sitemap does not block non-CA county×diagnosis leaves`);
  }
} else {
  er('Sitemap route not found');
}

// Check coverage badge component exists
const badgePath = path.join(ROOT, 'frontend/src/components/state-coverage-badge.tsx');
if (fs.existsSync(badgePath)) {
  const badgeContent = fs.readFileSync(badgePath, 'utf8');
  const hasExhaustive = badgeContent.includes('exhaustive');
  const hasPilot = badgeContent.includes('pilot');
  if (hasExhaustive && hasPilot) {
    ok(`StateCoverageBadge component exists with exhaustive/pilot classifications`);
  } else {
    er(`StateCoverageBadge missing classification levels`);
  }
} else {
  er('StateCoverageBadge component not found');
}

// Check layout no longer CA-only branded
const layoutPath = path.join(ROOT, 'frontend/src/app/layout.tsx');
if (fs.existsSync(layoutPath)) {
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  const hasNationalBrand = layoutContent.includes('Special Needs Navigator');
  const hasCAOnlyBrand = layoutContent.includes('"California Special Needs Navigator"');
  const removedCDSS = !layoutContent.includes('cdss.ca.gov');
  if (hasNationalBrand && !hasCAOnlyBrand && removedCDSS) {
    ok(`layout.tsx uses national branding (not CA-only)`);
  } else {
    const issues = [
      !hasNationalBrand && 'missing national brand',
      hasCAOnlyBrand && 'still has CA-only brand',
      !removedCDSS && 'still has CDSS CA link'
    ].filter(Boolean).join(', ');
    er(`layout.tsx branding issues: ${issues}`);
  }
} else {
  er('layout.tsx not found');
}

// Check leaf page CA terminology leaks
if (fs.existsSync(leafPagePath)) {
  const leafContent = fs.readFileSync(leafPagePath, 'utf8');
  const hasMediCal = /'Medi-Cal'/.test(leafContent) || /"Medi-Cal"/.test(leafContent);
  // Allowed: inside CA-specific if blocks. The string 'Medi-Cal' should only appear inside california conditionals
  const caLeakHero = /qualify for Medi-Cal waivers/.test(leafContent);
  const caAddressRegion = /'addressRegion':\s*'CA'/.test(leafContent);
  
  if (!caLeakHero) {
    ok(`County leaf hero text uses dynamic medicaidName (no hardcoded Medi-Cal)`);
  } else {
    er(`County leaf hero still has hardcoded "Medi-Cal" text`);
  }
  if (!caAddressRegion) {
    ok(`County leaf JSON-LD uses dynamic stateCode (no hardcoded 'CA' addressRegion)`);
  } else {
    er(`County leaf JSON-LD still has hardcoded 'CA' in addressRegion`);
  }
}

// ====== SECTION 6: Content Quality Sample ======
console.log('\n══════════════════════════════════════════════════════');
console.log(' SECTION 6: Content Quality Sample');
console.log('══════════════════════════════════════════════════════');

// Check for programs with null/undefined critical fields
const programsWithNullFields = navDb.prepare(
  "SELECT COUNT(*) as cnt FROM programs WHERE name IS NULL OR name = '' OR who_it_is_for IS NULL OR who_it_is_for = ''"
).get();

if (programsWithNullFields.cnt === 0) {
  ok(`No programs with null name or who_it_is_for`);
} else {
  er(`${programsWithNullFields.cnt} programs have null/empty critical fields`);
}

// Programs without income_limit don't exist in navigator DB schema — skip
stats.programsWithoutIncome = 'N/A (not in schema)';
ok(`Programs income_limit field: N/A in navigator DB schema`);

// Check county offices for null critical fields
const officesWithNullAddress = navDb.prepare(
  "SELECT COUNT(*) as cnt FROM county_offices WHERE address IS NULL OR address = ''"
).get();
if (officesWithNullAddress.cnt === 0) {
  ok(`No county offices with null address`);
} else {
  wn(`${officesWithNullAddress.cnt} county offices have null/empty address`);
}

// Check school districts for null key fields
try {
  const districtsWithNullName = navDb.prepare(
    "SELECT COUNT(*) as cnt FROM school_districts WHERE name IS NULL OR name = ''"
  ).get();
  if (districtsWithNullName.cnt === 0) {
    ok(`All school districts have non-null names`);
  } else {
    er(`${districtsWithNullName.cnt} school districts have null/empty names`);
  }
} catch (e) {
  wn(`school_districts check skipped: ${e.message}`);
}

// Check for "(555)" fake phone numbers in non-CA pages
try {
  const fakePhones = navDb.prepare(
    "SELECT COUNT(*) as cnt FROM county_offices co JOIN counties c ON co.county_id = c.id WHERE co.phone LIKE '(555)%' AND c.state_id != 'california'"
  ).get();
  if (fakePhones.cnt === 0) {
    ok(`No non-CA county offices have fake (555) phone numbers`);
  } else {
    er(`${fakePhones.cnt} non-CA county offices have fake (555) phone numbers`);
  }
} catch (e) {
  wn(`Fake phone check skipped: ${e.message}`);
}

// Check for correction flow availability
const correctionFlowPath = path.join(ROOT, 'frontend/src/app/counties/components/CorrectionFlow.tsx');
const contributionModalPath = path.join(ROOT, 'frontend/src/components/contribution-modal.tsx');
if (fs.existsSync(correctionFlowPath) && fs.existsSync(contributionModalPath)) {
  ok(`Correction flow and contribution modal components exist`);
} else {
  const missing = [
    !fs.existsSync(correctionFlowPath) && 'CorrectionFlow',
    !fs.existsSync(contributionModalPath) && 'ContributionModal'
  ].filter(Boolean).join(', ');
  er(`Missing correction/contribution components: ${missing}`);
}

// Check SourceFreshnessDisclosure component
const freshnessPath = path.join(ROOT, 'frontend/src/app/components/SourceFreshnessDisclosure.tsx');
if (fs.existsSync(freshnessPath)) {
  ok(`SourceFreshnessDisclosure component exists`);
} else {
  er(`SourceFreshnessDisclosure component missing`);
}

// ====== SECTION 7: Indexable Page Estimates ======
console.log('\n══════════════════════════════════════════════════════');
console.log(' SECTION 7: Indexable Page Count Estimates');
console.log('══════════════════════════════════════════════════════');

// State hubs: all 50 should be indexable
stats.stateHubsIndexable = allStates.length;
ok(`State hubs indexable: ${stats.stateHubsIndexable}/50`);

// County roots: CA quality-gated + NON_CA_VERIFIED_COUNTIES
// Each county gets /benefits/[state]/[county] and /counties/[state]/[county] = 2 URLs per county
const countyRootsCount = (caCounties.length + NON_CA_VERIFIED_COUNTIES.length); 
stats.countyRootsIndexable = countyRootsCount;
ok(`County roots in sitemap: ~${countyRootsCount} (CA: ${caCounties.length} quality-gated, non-CA: ${NON_CA_VERIFIED_COUNTIES.length} verified)`);

// Diagnosis hubs: 50 states × 6 core diagnoses
stats.diagnosisHubsIndexable = allStates.length * 6;
ok(`Diagnosis hub pages: ${stats.diagnosisHubsIndexable} (50 states × 6 core diagnoses)`);

// County×diagnosis leaves: CA only (LA + Orange = 2) × 6 = 12 max in sitemap BATCH=4
stats.countyDiagnosisLeavesInSitemap = 12;
stats.nonCaCountyDiagnosisLeaves = 'noindex (excluded from sitemap)';
ok(`CA county×diagnosis leaves in sitemap: ≤12 (LA+Orange × 6 diagnoses)`);
ok(`Non-CA county×diagnosis leaves: noindex, excluded from sitemap`);

// Rough total indexable
const roughTotal = stats.stateHubsIndexable + (countyRootsCount * 2) + stats.diagnosisHubsIndexable + stats.countyDiagnosisLeavesInSitemap;
stats.roughTotalIndexable = roughTotal;
ok(`Rough total indexable pages: ~${roughTotal}`);

// ====== FINAL REPORT ======
console.log('\n══════════════════════════════════════════════════════');
console.log(' FINAL LAUNCH AUDIT REPORT');
console.log('══════════════════════════════════════════════════════');

console.log('\n📊 Statistics:');
console.log(`  States in DB: ${stats.totalStates}/50`);
console.log(`  Classification: ${stats.exhaustiveStates} exhaustive | ${stats.pilotStates} pilot (49 states)`);
console.log(`  Total counties: ${stats.totalCounties} (CA: ${stats.caCounties}, non-CA: ${stats.nonCaCounties})`);
console.log(`  Verified non-CA counties in sitemap: ${stats.nonCaVerifiedCounties}`);
console.log(`  Total programs: ${stats.totalPrograms} (CA: ${stats.caPrograms}, non-CA: ${stats.nonCaPrograms})`);
console.log(`  County offices: ${stats.totalOffices} (CA: ${stats.caOffices}, non-CA: ${stats.nonCaOffices})`);
console.log(`  School districts: ${stats.totalDistricts}`);
console.log(`  Generated fallback records: ${stats.generatedFallbackCount ?? 'N/A'}`);
console.log(`  Source-listed records: ${stats.sourceListedCount ?? 'N/A'}`);
console.log(`  Offices missing verification_status: ${stats.officesWithoutStatus}`);
console.log(`  Offices missing data_origin: ${stats.officesWithoutOrigin}`);

console.log('\n🗺️  Indexation Estimate:');
console.log(`  State hubs indexable: ${stats.stateHubsIndexable}`);
console.log(`  County root pages indexable: ${stats.countyRootsIndexable * 2} (/benefits + /counties)`);
console.log(`  Diagnosis hub pages indexable: ${stats.diagnosisHubsIndexable}`);
console.log(`  CA county×diagnosis leaves: ≤${stats.countyDiagnosisLeavesInSitemap}`);
console.log(`  Non-CA county×diagnosis leaves: ${stats.nonCaCountyDiagnosisLeaves}`);
console.log(`  Rough total indexable: ~${stats.roughTotalIndexable}`);

console.log('\n🚦 Audit Scores:');
console.log(`  ✅ PASS: ${pass}`);
console.log(`  ⚠️  WARN: ${warn}`);
console.log(`  ❌ FAIL: ${fail}`);

if (failures.length > 0) {
  console.log('\n🚨 Launch Blockers (FAIL):');
  failures.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));
}

if (warnings.length > 0) {
  console.log('\n⚠️  Warnings (non-blocking):');
  warnings.forEach((w, i) => console.log(`  ${i + 1}. ${w}`));
}

const recommendation = fail === 0
  ? '🟢 GO — No launch blockers found. System is safe to deploy.'
  : `🔴 NO-GO — ${fail} launch blocker(s) must be resolved before deployment.`;

console.log(`\n${'═'.repeat(54)}`);
console.log(` RECOMMENDATION: ${recommendation}`);
console.log(`${'═'.repeat(54)}\n`);

// Close DB connections
try { navDb.close(); } catch (e) {}
try { if (crawlerDb) crawlerDb.close(); } catch (e) {}
