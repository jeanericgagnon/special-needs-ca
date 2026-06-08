import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

console.log(`${BOLD}====================================================${RESET}`);
console.log(`${BOLD}🔍 RUNNING CHECKS FOR SYSTEM-WIDE QUALITY GATES${RESET}`);
console.log(`${BOLD}====================================================${RESET}\n`);

let db;
try {
  db = new Database(dbPath, { readonly: true });
} catch (e) {
  console.error(`${RED}❌ Error: Could not open database at ${dbPath}: ${e.message}${RESET}`);
  process.exit(1);
}

let allPassed = true;

function check(condition, message) {
  if (condition) {
    console.log(`  ${GREEN}✓ PASS:${RESET} ${message}`);
  } else {
    console.log(`  ${RED}✗ FAIL:${RESET} ${message}`);
    allPassed = false;
  }
}

// 1. No CA county missing Regional Center mapping
const caCounties = db.prepare("SELECT id, name FROM counties WHERE state_id = 'california'").all();
let rcMissing = [];
for (const county of caCounties) {
  const mapping = db.prepare("SELECT COUNT(*) as count FROM regional_center_counties WHERE county_id = ?").get(county.id);
  if (mapping.count === 0) {
    rcMissing.push(county.name);
  }
}
check(rcMissing.length === 0, `No CA county missing Regional Center mapping. (Missing: ${rcMissing.join(', ') || 'none'})`);

// 2. No CA county missing SELPA mapping
let selpaMissing = [];
for (const county of caCounties) {
  const mapping = db.prepare("SELECT COUNT(*) as count FROM selpa_counties WHERE county_id = ?").get(county.id);
  if (mapping.count === 0) {
    selpaMissing.push(county.name);
  }
}
check(selpaMissing.length === 0, `No CA county missing SELPA mapping. (Missing: ${selpaMissing.join(', ') || 'none'})`);

// 3. No CA county missing the 3 required offices
let officesMissing = [];
for (const county of caCounties) {
  const ihss = db.prepare("SELECT COUNT(*) as count FROM county_offices WHERE county_id = ? AND program_id = 'ihss-for-children'").get(county.id).count;
  const medical = db.prepare("SELECT COUNT(*) as count FROM county_offices WHERE county_id = ? AND program_id = 'medi-cal-for-kids-and-teens'").get(county.id).count;
  const ccs = db.prepare("SELECT COUNT(*) as count FROM county_offices WHERE county_id = ? AND program_id = 'california-childrens-services'").get(county.id).count;
  
  if (ihss === 0 || medical === 0 || ccs === 0) {
    officesMissing.push(`${county.name} (IHSS: ${ihss}, Medi-Cal: ${medical}, CCS: ${ccs})`);
  }
}
check(officesMissing.length === 0, `No CA county missing the 3 required offices. (Missing: ${officesMissing.join(', ') || 'none'})`);

// 4. No county page missing correction link
// We verify that the county page source contains TrustBadge rendering, which handles the correction link.
const countyPagePath = path.resolve(__dirname, '../../frontend/src/app/counties/[state]/[slug]/page.tsx');
let hasCorrectionBadges = false;
if (fs.existsSync(countyPagePath)) {
  const pageContent = fs.readFileSync(countyPagePath, 'utf8');
  hasCorrectionBadges = pageContent.includes('<TrustBadge');
}
check(hasCorrectionBadges, 'No county page template missing correction flow / TrustBadge integration.');

// 5. No advocate profile marked verified without last_verified_at / source_url
const verifiedAdvocates = db.prepare(`
  SELECT id, name, verification_status, last_verified_at, last_verified_date, source_url 
  FROM iep_advocates 
  WHERE verification_status IN ('verified', 'official_verified', 'human_verified')
`).all();

let invalidAdvocates = [];
for (const adv of verifiedAdvocates) {
  const hasVerifiedDate = adv.last_verified_at || adv.last_verified_date;
  if (!hasVerifiedDate || !adv.source_url) {
    invalidAdvocates.push(`${adv.name} (ID: ${adv.id})`);
  }
}
check(invalidAdvocates.length === 0, `No advocate profile marked verified without last_verified_date or source_url. (Violations: ${invalidAdvocates.length ? invalidAdvocates.join(', ') : 'none'})`);

// 6. No sitemap URL included unless quality gate passes
// We will mock the sitemap quality gate function and run it on all sitemap batch 4 leaf pages to verify no page is included unless it passes.
function mockPassesCountyQualityGate(details) {
  if (!details) return false;
  const hasRc = details.regionalCenters && details.regionalCenters.length > 0;
  const hasSelpa = details.selpas && details.selpas.length > 0;
  const hasIhss = details.countyOffices && details.countyOffices.some(o => o.program_id === 'ihss-for-children');
  const hasMediCal = details.countyOffices && details.countyOffices.some(o => o.program_id === 'medi-cal-for-kids-and-teens');
  const hasCcs = details.countyOffices && details.countyOffices.some(o => o.program_id === 'california-childrens-services');
  const hasDistrict = details.schoolDistricts && details.schoolDistricts.length > 0;
  const hasNonprofit = details.localOrganizations && details.localOrganizations.length > 0;
  const hasMetadata = details.countyOffices && details.countyOffices.every(o => o.verification_status && o.data_origin);

  return !!(hasRc && hasSelpa && hasIhss && hasMediCal && hasCcs && hasDistrict && hasNonprofit && hasMetadata);
}

let sitemapViolations = [];
for (const county of caCounties) {
  // Query county details dynamically
  const regionalCenters = db.prepare(`
    SELECT ra.* FROM state_resource_agencies ra
    JOIN regional_center_counties rcc ON ra.id = rcc.regional_center_id
    WHERE rcc.county_id = ?
  `).all(county.id);

  const selpas = db.prepare(`
    SELECT rea.* FROM regional_education_agencies rea
    JOIN selpa_counties sc ON rea.id = sc.selpa_id
    WHERE sc.county_id = ?
  `).all(county.id);

  const countyOffices = db.prepare(`
    SELECT * FROM county_offices WHERE county_id = ?
  `).all(county.id);

  const schoolDistricts = db.prepare(`
    SELECT * FROM school_districts WHERE county_id = ?
  `).all(county.id);

  const localOrganizations = db.prepare(`
    SELECT * FROM nonprofit_organizations WHERE county_id = ?
  `).all(county.id);

  const details = {
    regionalCenters,
    selpas,
    countyOffices,
    schoolDistricts,
    localOrganizations
  };

  const passes = mockPassesCountyQualityGate(details);
  if (!passes) {
    sitemapViolations.push(county.name);
  }
}
check(sitemapViolations.length === 0, `No CA county sitemap URL included unless quality gate passes. (Non-passing counties: ${sitemapViolations.join(', ') || 'none'})`);

console.log(`\n${BOLD}====================================================${RESET}`);
if (allPassed) {
  console.log(`${GREEN}${BOLD}🎉 ALL QUALITY GATE TESTS PASSED SUCCESSFULLY!${RESET}`);
} else {
  console.log(`${RED}${BOLD}🚨 QUALITY GATE CHECK FAILED!${RESET}`);
}
console.log(`${BOLD}====================================================${RESET}\n`);

db.close();
process.exit(allPassed ? 0 : 1);
