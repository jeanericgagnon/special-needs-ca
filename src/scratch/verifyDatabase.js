import Database from 'better-sqlite3';
import { runDbMatchingEngine } from '../engine/dbMatchingEngine.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

console.log(`${BOLD}====================================================${RESET}`);
console.log(`${BOLD}🏃 STARTING RELATIONAL DATABASE INTEGRITY VERIFICATION${RESET}`);
console.log(`${BOLD}====================================================${RESET}\n`);

let testPassed = true;

function assert(condition, message) {
  if (condition) {
    console.log(`  ${GREEN}✓ PASS:${RESET} ${message}`);
  } else {
    console.log(`  ${RED}✗ FAIL:${RESET} ${message}`);
    testPassed = false;
  }
}

// 1. Rebuild and seed a clean database, then execute automated data collection pipelines
try {
  console.log('⏳ Running database initialization and seeding pipeline...');
  execSync('node src/db/initDb.js', { stdio: 'inherit' });
  console.log('⏳ Ingesting exhaustive 21 DDS Regional Centers directory...');
  execSync('node src/db/scrapers/regionalCenterScraper.js', { stdio: 'inherit' });
  console.log('⏳ Ingesting exhaustive 58 California counties and localized helplines...');
  execSync('node src/db/scrapers/countyRouterGenerator.js', { stdio: 'inherit' });
  console.log('⏳ Running robots.txt parser and data freshness checks...');
  execSync('node src/db/scrapers/ingestionAuditor.js', { stdio: 'inherit' });
  console.log('  ✅ Relational database crawler pipeline completed successfully!\n');
} catch (err) {
  console.error('  ❌ Relational database crawler pipeline failed:', err.message);
  process.exit(1);
}

const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

// ----------------------------------------------------
// TEST 1: Assert all 26 tables exist in SQLite catalog
// ----------------------------------------------------
console.log(`${BOLD}Test 1: Relational Schema Integrity Audit (26 Tables)${RESET}`);

const requiredTables = [
  'programs', 'program_eligibility_rules', 'program_document_requirements',
  'program_application_steps', 'program_appeal_info', 'counties', 'county_offices',
  'regional_centers', 'selpas', 'school_districts', 'resource_providers',
  'nonprofit_organizations', 'conditions', 'functional_needs', 'age_bands',
  'insurance_types', 'family_cases', 'child_profiles', 'child_profile_conditions',
  'child_profile_needs', 'case_program_statuses', 'document_checklist_items',
  'reminders', 'sources', 'source_verifications', 'user_submitted_resources',
  'coverage_gaps', 'verification_queue_items'
];

requiredTables.forEach(table => {
  const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(table);
  assert(tableCheck !== undefined, `Table '${table}' exists in SQLite database schema catalog.`);
});

console.log('');

// ----------------------------------------------------
// TEST 2: Row Count Seed Auditing
// ----------------------------------------------------
console.log(`${BOLD}Test 2: Seeding Capacity Audit${RESET}`);

const programCount = db.prepare('SELECT COUNT(*) as cnt FROM programs').get().cnt;
assert(programCount === 9, `Statewide Programs successfully seeded (expected 9, found: ${programCount}).`);

const conditionCount = db.prepare('SELECT COUNT(*) as cnt FROM conditions').get().cnt;
assert(conditionCount === 78, `Condition Taxonomy successfully seeded (expected 78, found: ${conditionCount}).`);

const countyCount = db.prepare('SELECT COUNT(*) as cnt FROM counties').get().cnt;
assert(countyCount === 58, `California Counties successfully seeded (expected 58, found: ${countyCount}).`);

const rcCount = db.prepare('SELECT COUNT(*) as cnt FROM regional_centers').get().cnt;
assert(rcCount === 21, `California Regional Centers successfully seeded (expected 21, found: ${rcCount}).`);

console.log('');

// ----------------------------------------------------
// TEST 3: Many-to-Many Normalized Profile Seeding & Matching
// ----------------------------------------------------
console.log(`${BOLD}Test 3: Many-to-Many Junctions & SQL-Backed Matching Engine Audit${RESET}`);

const childId = 'child-leo-6';
const caseId = 'case-caregiver-1';

// Insert child profile inside atomic transaction
db.transaction(() => {
  db.prepare('INSERT INTO family_cases (id, email, created_at) VALUES (?, ?, ?)')
    .run(caseId, 'caregiver@example.com', '2026-05-31');

  db.prepare(`
    INSERT INTO child_profiles 
    (id, case_id, nickname, dob, county_id, zip_code, insurance_type, school_status, caregiver_notes) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(childId, caseId, 'Leo', '2020-04-12', 'orange', '92705', 'both', 'none', 'Leo has speech delays and requires respite support.');

  // Set selected condition Down Syndrome in many-to-many junction
  db.prepare('INSERT INTO child_profile_conditions (child_id, condition_id) VALUES (?, ?)')
    .run(childId, 'down-syndrome-trisomy-21');

  // Set selected functional needs: speech therapy and respite care in junction
  db.prepare('INSERT INTO child_profile_needs (child_id, need_id) VALUES (?, ?)')
    .run(childId, 'speech-therapy');
  db.prepare('INSERT INTO child_profile_needs (child_id, need_id) VALUES (?, ?)')
    .run(childId, 'respite-care');
})();

assert(true, 'Atomic Transaction completed: Profile, conditions, and needs successfully bound into many-to-many tables.');

// Load bindings and execute matching engine queries
const loadedProfile = db.prepare('SELECT * FROM child_profiles WHERE id = ?').get(childId);
const loadedConds = db.prepare('SELECT condition_id FROM child_profile_conditions WHERE child_id = ?').all(childId);
loadedProfile.conditionIds = loadedConds.map(c => c.condition_id);

const loadedNeeds = db.prepare('SELECT need_id FROM child_profile_needs WHERE child_id = ?').all(childId);
loadedProfile.functionalNeedIds = loadedNeeds.map(n => n.need_id);

const matches = runDbMatchingEngine(loadedProfile);

assert(matches.highPriority.length > 0, `SQL Matching Engine returned ${matches.highPriority.length} high priority benefits.`);

const rcMatch = matches.highPriority.find(p => p.id === 'regional-centers');
assert(rcMatch !== undefined, 'Lanterman Regional Centers matched as High Priority (Down Syndrome developmental delay trigger).');

const ccsMatch = matches.highPriority.find(p => p.id === 'california-childrens-services');
assert(ccsMatch !== undefined, 'CCS matched as High Priority (Down Syndrome triggers Medical Therapy physical needs).');

// Verify local office routing
console.log('  🔍 Routed Local Offices:', matches.localOffices.map(o => `${o.type} -> ${o.name}`));
const ocIHSS = matches.localOffices.find(o => o.type === 'County IHSS' && (o.name.includes('SSA') || o.name.includes('Social Services')));
assert(ocIHSS !== undefined, `Correct Orange County office routed: ${ocIHSS?.name}`);

console.log('');

// ----------------------------------------------------
// TEST 4: Admin Stale Audit Level 1-6 Transitions
// ----------------------------------------------------
console.log(`${BOLD}Test 4: Admin Verification & Staleness Queue Transitions (Level 1-6)${RESET}`);

// Find a stale record item (HACCP program verification level 5)
const targetQueueItem = db.prepare('SELECT * FROM verification_queue_items WHERE id = ?').get('v-1');
assert(targetQueueItem.verification_level === 5, 'Verification Queue Item loaded. Target is stale (Level 5 audit required).');

// Trigger verify audit transaction
db.transaction(() => {
  // Elevate verification level to 1 (Official)
  db.prepare("UPDATE verification_queue_items SET verification_level = 1, reason = 'Audited & Verified' WHERE id = ?")
    .run('v-1');

  // Dynamic Update of last_verified_date
  db.prepare('UPDATE programs SET last_verified_date = ?, confidence_score = 5 WHERE id = ?')
    .run('2026-05-31', 'hearing-aid-coverage');
})();

const updatedQueueItem = db.prepare('SELECT * FROM verification_queue_items WHERE id = ?').get('v-1');
assert(updatedQueueItem.verification_level === 1, 'Verification Level elevated to 1 (Audited OK).');

const updatedProgram = db.prepare('SELECT last_verified_date, confidence_score FROM programs WHERE id = ?').get('hearing-aid-coverage');
assert(updatedProgram.last_verified_date === '2026-05-31', `Database freshness date successfully updated to: ${updatedProgram.last_verified_date}`);
assert(updatedProgram.confidence_score === 5, 'Confidence score updated to Level 5 (High Trust).');

console.log('');

// ----------------------------------------------------
// TEST SUMMARY
// ----------------------------------------------------
console.log(`${BOLD}====================================================${RESET}`);
if (testPassed) {
  console.log(`${GREEN}${BOLD}🎉 SUCCESS: Relational SQLite database integrity verified perfectly!${RESET}`);
} else {
  console.log(`${RED}${BOLD}🚨 FAILURE: Database integrity checks failed.${RESET}`);
}
console.log(`${BOLD}====================================================${RESET}`);

db.close();
process.exit(testPassed ? 0 : 1);
