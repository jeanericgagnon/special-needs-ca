import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

console.log(`${BOLD}====================================================${RESET}`);
console.log(`${BOLD}🔍 RUNNING CALIFORNIA COVERAGE & TRUST AUDIT${RESET}`);
console.log(`${BOLD}====================================================${RESET}\n`);

let db;
try {
  db = new Database(dbPath, { readonly: true });
} catch (e) {
  console.error(`${RED}❌ Error: Could not open database at ${dbPath}: ${e.message}${RESET}`);
  process.exit(1);
}

let auditPassed = true;
const missingReport = [];

// Helper assertion function
function check(condition, label, details = '') {
  if (condition) {
    console.log(`  ${GREEN}✅ ${label}${RESET}`);
    return true;
  } else {
    console.log(`  ${RED}❌ ${label}${RESET}`);
    if (details) {
      console.log(`     ${RED}Details: ${details}${RESET}`);
      missingReport.push(details);
    }
    auditPassed = false;
    return false;
  }
}

// 1. County counts
const caCounties = db.prepare("SELECT id, name FROM counties WHERE state_id = 'california'").all();
check(caCounties.length === 58, `CA Counties Count: ${caCounties.length}/58`, `Expected 58 CA counties, found ${caCounties.length}`);

// 2. County-by-county details coverage
let rcCount = 0;
let selpaCount = 0;
let ihssOfficeCount = 0;
let mediCalOfficeCount = 0;
let ccsOfficeCount = 0;
let districtCount = 0;
let nonprofitCount = 0;
let advocateCount = 0;

const missingRcs = [];
const missingSelpas = [];
const missingIhss = [];
const missingMediCal = [];
const missingCcs = [];
const missingDistricts = [];
const missingNonprofits = [];
const missingAdvocates = [];

for (const county of caCounties) {
  // Regional Centers
  const rcs = db.prepare(`
    SELECT COUNT(*) as cnt FROM regional_center_counties WHERE county_id = ?
  `).get(county.id).cnt;
  if (rcs > 0) rcCount++; else missingRcs.push(county.id);

  // SELPAs
  const selpas = db.prepare(`
    SELECT COUNT(*) as cnt FROM selpa_counties WHERE county_id = ?
  `).get(county.id).cnt;
  if (selpas > 0) selpaCount++; else missingSelpas.push(county.id);

  // IHSS Offices
  const ihss = db.prepare(`
    SELECT COUNT(*) as cnt FROM county_offices WHERE county_id = ? AND program_id = 'ihss-for-children'
  `).get(county.id).cnt;
  if (ihss > 0) ihssOfficeCount++; else missingIhss.push(county.id);

  // Medi-Cal Offices
  const medical = db.prepare(`
    SELECT COUNT(*) as cnt FROM county_offices WHERE county_id = ? AND program_id = 'medi-cal-for-kids-and-teens'
  `).get(county.id).cnt;
  if (medical > 0) mediCalOfficeCount++; else missingMediCal.push(county.id);

  // CCS Offices
  const ccs = db.prepare(`
    SELECT COUNT(*) as cnt FROM county_offices WHERE county_id = ? AND program_id = 'california-childrens-services'
  `).get(county.id).cnt;
  if (ccs > 0) ccsOfficeCount++; else missingCcs.push(county.id);

  // School Districts
  const districts = db.prepare(`
    SELECT COUNT(*) as cnt FROM school_districts WHERE county_id = ?
  `).get(county.id).cnt;
  if (districts > 0) districtCount++; else missingDistricts.push(county.id);

  // Nonprofits
  const nonprofits = db.prepare(`
    SELECT COUNT(*) as cnt FROM nonprofit_organizations WHERE county_id = ?
  `).get(county.id).cnt;
  if (nonprofits > 0) nonprofitCount++; else missingNonprofits.push(county.id);

  // Advocates
  const advocates = db.prepare(`
    SELECT COUNT(*) as cnt FROM iep_advocate_counties WHERE county_id = ?
  `).get(county.id).cnt;
  if (advocates > 0) advocateCount++; else missingAdvocates.push(county.id);
}

check(rcCount === 58, `Regional Center county coverage: ${rcCount}/58`, missingRcs.length ? `Missing Regional Center for: ${missingRcs.join(', ')}` : '');
check(selpaCount === 58, `SELPA county coverage: ${selpaCount}/58`, missingSelpas.length ? `Missing SELPA for: ${missingSelpas.join(', ')}` : '');
check(ihssOfficeCount === 58, `IHSS offices: ${ihssOfficeCount}/58`, missingIhss.length ? `Missing IHSS office for: ${missingIhss.join(', ')}` : '');
check(mediCalOfficeCount === 58, `Medi-Cal offices: ${mediCalOfficeCount}/58`, missingMediCal.length ? `Missing Medi-Cal office for: ${missingMediCal.join(', ')}` : '');
check(ccsOfficeCount === 58, `CCS offices: ${ccsOfficeCount}/58`, missingCcs.length ? `Missing CCS office for: ${missingCcs.join(', ')}` : '');
check(districtCount === 58, `School district county coverage: ${districtCount}/58`, missingDistricts.length ? `Missing School District for: ${missingDistricts.join(', ')}` : '');
check(nonprofitCount === 58, `Nonprofit county coverage: ${nonprofitCount}/58`, missingNonprofits.length ? `Missing Nonprofit for: ${missingNonprofits.join(', ')}` : '');
check(advocateCount === 58, `Advocate county coverage: ${advocateCount}/58`, missingAdvocates.length ? `Missing Advocate mapping for: ${missingAdvocates.join(', ')}` : '');

// 3. Core Program Auditing
const corePrograms = [
  'ihss-for-children',
  'regional-centers',
  'early-start',
  'self-determination-program',
  'medi-cal-for-kids-and-teens',
  'california-childrens-services',
  'hearing-aid-coverage',
  'ssi-for-children',
  'calable',
  'iep-special-education',
  'hcba'
];

let programsWithSource = 0;
let programsWithSteps = 0;
let programsWithDocs = 0;
let programsWithAppeals = 0;

const missingSourceProgs = [];
const missingStepsProgs = [];
const missingDocsProgs = [];
const missingAppealsProgs = [];

for (const progId of corePrograms) {
  const prog = db.prepare("SELECT * FROM programs WHERE id = ?").get(progId);
  if (!prog) {
    console.log(`  ${YELLOW}⚠️ Program '${progId}' does not exist in the database (optional or state-scoped)${RESET}`);
    continue;
  }

  // Check official source url and last verified date
  if (prog.official_source_url && prog.last_verified_date) {
    programsWithSource++;
  } else {
    missingSourceProgs.push(progId);
  }

  // Check document requirements
  const docs = db.prepare("SELECT COUNT(*) as cnt FROM program_document_requirements WHERE program_id = ?").get(progId).cnt;
  if (docs > 0) {
    programsWithDocs++;
  } else {
    missingDocsProgs.push(progId);
  }

  // Check application steps
  const steps = db.prepare("SELECT COUNT(*) as cnt FROM program_application_steps WHERE program_id = ?").get(progId).cnt;
  if (steps > 0) {
    programsWithSteps++;
  } else {
    missingStepsProgs.push(progId);
  }

  // Check appeal info
  const appeal = db.prepare("SELECT COUNT(*) as cnt FROM program_appeal_info WHERE program_id = ?").get(progId).cnt;
  if (appeal > 0) {
    programsWithAppeals++;
  } else {
    // Exempt calable and early-start from strict appeals failure
    if (progId !== 'calable' && progId !== 'early-start') {
      missingAppealsProgs.push(progId);
    }
  }
}

const totalProgsChecked = Math.min(corePrograms.length, db.prepare("SELECT COUNT(*) as cnt FROM programs WHERE id IN (" + corePrograms.map(() => '?').join(',') + ")").get(...corePrograms).cnt);

check(programsWithSource === totalProgsChecked, `Core programs with sources: ${programsWithSource}/${totalProgsChecked}`, missingSourceProgs.length ? `Missing source fields: ${missingSourceProgs.join(', ')}` : '');
check(programsWithDocs === totalProgsChecked, `Core programs with document requirements: ${programsWithDocs}/${totalProgsChecked}`, missingDocsProgs.length ? `Missing document requirements: ${missingDocsProgs.join(', ')}` : '');
check(programsWithSteps === totalProgsChecked, `Core programs with application steps: ${programsWithSteps}/${totalProgsChecked}`, missingStepsProgs.length ? `Missing application steps: ${missingStepsProgs.join(', ')}` : '');

// Appeal info check (blunt warning for calable and early-start, but fails on others)
const appealsPassed = missingAppealsProgs.length === 0;
check(appealsPassed, `Core programs with appeal info: ${programsWithAppeals}/${totalProgsChecked}`, missingAppealsProgs.length ? `Missing appeals data for: ${missingAppealsProgs.join(', ')}` : '');

// 4. Source & Verification records existence
const sourcesCount = db.prepare("SELECT COUNT(*) as cnt FROM sources").get().cnt;
check(sourcesCount > 0, `Source records exist (Total: ${sourcesCount})`, `Expected sources table to have records, found ${sourcesCount}`);

const verificationsCount = db.prepare("SELECT COUNT(*) as cnt FROM source_verifications").get().cnt;
check(verificationsCount > 0, `Source verification records exist (Total: ${verificationsCount})`, `Expected source_verifications table to have records, found ${verificationsCount}`);

// 5. Trust and Freshness Fields validation
// Ensure every record in county_offices, school_districts, and nonprofit_organizations has data_origin and verification_status
const tablesToAudit = [
  { name: 'county_offices', label: 'County Offices' },
  { name: 'school_districts', label: 'School Districts' },
  { name: 'nonprofit_organizations', label: 'Nonprofit Organizations' },
  { name: 'state_resource_agencies', label: 'State Resource Agencies' },
  { name: 'regional_education_agencies', label: 'Regional Education Agencies' },
  { name: 'iep_advocates', label: 'IEP Advocates' }
];

let trustAuditPassed = true;
for (const t of tablesToAudit) {
  const missingOrigin = db.prepare(`SELECT COUNT(*) as cnt FROM ${t.name} WHERE data_origin IS NULL`).get().cnt;
  const missingStatus = db.prepare(`SELECT COUNT(*) as cnt FROM ${t.name} WHERE verification_status IS NULL`).get().cnt;
  
  if (missingOrigin > 0 || missingStatus > 0) {
    console.log(`  ${RED}❌ Table '${t.name}' is missing trust metadata! (Missing origin: ${missingOrigin}, Missing status: ${missingStatus})${RESET}`);
    trustAuditPassed = false;
    auditPassed = false;
  } else {
    console.log(`  ${GREEN}✅ Table '${t.name}' trust metadata complete.${RESET}`);
  }
}

console.log(`\n${BOLD}====================================================${RESET}`);
if (auditPassed) {
  console.log(`${GREEN}${BOLD}🎉 AUDIT RESULT: PASS${RESET}`);
  console.log(`${GREEN}California coverage and trust settings are fully hardened!${RESET}`);
} else {
  console.log(`${RED}${BOLD}🚨 AUDIT RESULT: FAIL${RESET}`);
  if (missingReport.length > 0) {
    console.log(`${RED}Failures identified during audit:\n${missingReport.map(r => `  - ${r}`).join('\n')}${RESET}`);
  }
}
console.log(`${BOLD}====================================================${RESET}\n`);

db.close();
process.exit(auditPassed ? 0 : 1);
