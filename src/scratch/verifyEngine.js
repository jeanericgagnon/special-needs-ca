import { runMatchingEngine, calculateAge } from '../engine/matchingEngine.js';
import { conditions, programs, counties, regionalCenters } from '../data/seedData.js';

// ANSI terminal color helpers
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

console.log(`${BOLD}====================================================${RESET}`);
console.log(`${BOLD}🏃 STARTING AUTO-TEST: CALIFORNIAN DISABILITY MATCHING ENGINE${RESET}`);
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

// ----------------------------------------------------
// TEST CASE 1: Verify Condition Taxonomy Structure
// ----------------------------------------------------
console.log(`${BOLD}Test Case 1: Database Condition Taxonomy Verification${RESET}`);
assert(conditions.length >= 4, `Taxonomy must contain at least 4 conditions. Found: ${conditions.length}`);

conditions.forEach(cond => {
  assert(cond.id !== undefined, `Condition '${cond.name}' has valid ID slug.`);
  assert(cond.aliases && cond.aliases.length >= 0, `Condition '${cond.name}' has aliases.`);
  assert(cond.parentFriendlyExplanation && cond.parentFriendlyExplanation.length > 30, `Condition '${cond.name}' has parent-friendly details.`);
  assert(cond.categoryMappings !== undefined, `Condition '${cond.name}' has system relevance maps.`);
  assert(cond.commonFunctionalNeeds.length > 0, `Condition '${cond.name}' maps to functional needs.`);
  assert(cond.commonProgramIds.length > 0, `Condition '${cond.name}' maps to core programs.`);
});

console.log('');

// ----------------------------------------------------
// TEST CASE 2: Age Band Milestones Calculation
// ----------------------------------------------------
console.log(`${BOLD}Test Case 2: Age Milestone Calculation Verification${RESET}`);
// Simulating child born 6 years ago
const sixYearsAgo = new Date();
sixYearsAgo.setFullYear(sixYearsAgo.getFullYear() - 6);
const dobString = sixYearsAgo.toISOString().split('T')[0];

const ageCalc = calculateAge(dobString);
assert(ageCalc.years === 6, `Age calculation asserts child is exactly 6 years old (calculated: ${ageCalc.years}).`);

console.log('');

// ----------------------------------------------------
// TEST CASE 3: Rule Matches & Matching Engine Output
// ----------------------------------------------------
console.log(`${BOLD}Test Case 3: Complete Matching Rules Engine Audit${RESET}`);

// Target User Profile: Down syndrome, age 6, Orange County, speech delay, respite care, toilets, Medi-Cal, no RC connection
const testProfile = {
  nickname: 'Leo',
  dob: dobString,
  countyId: 'orange',
  zipCode: '92705',
  conditionIds: ['down-syndrome-trisomy-21'],
  suspectedConditionIds: [],
  functionalNeedIds: ['speech-therapy', 'respite-care', 'diapers-incontinence-supplies', 'iep-evaluation'],
  insuranceType: 'both', // Medi-Cal primary + Private secondary
  schoolStatus: 'none', // Not enrolled yet
  currentServiceIds: [] // No active RC or Early Start yet
};

const matches = runMatchingEngine(testProfile);

// Assertions on program recommendations
assert(matches.highPriority.length > 0, `Engine returned ${matches.highPriority.length} high priority recommendations.`);

// Check for IEP Match
const iepMatch = matches.highPriority.find(p => p.id === 'iep-special-education');
assert(iepMatch !== undefined, 'IEP Special Education successfully matched as High Priority (School age 3-22 + Down Syndrome + Speech Therapy).');
if (iepMatch) {
  assert(iepMatch.whyMatched.includes('school age') && iepMatch.whyMatched.includes('Down Syndrome'), 'IEP match has customized diagnostic rationale.');
}

// Check for IHSS Match
const ihssMatch = matches.highPriority.find(p => p.id === 'ihss-for-children');
assert(ihssMatch !== undefined, 'IHSS for Children matched as High Priority (Down Syndrome + Incontinence Briefs + Medi-Cal active).');

// Check for Regional Center Match
const rcMatch = matches.highPriority.find(p => p.id === 'regional-centers');
assert(rcMatch !== undefined, 'Regional Centers matched as High Priority (Age >= 3 + Down Syndrome developmental delay category).');

// Check for California Children\'s Services (CCS) Match
const ccsMatch = matches.highPriority.find(p => p.id === 'california-childrens-services');
assert(ccsMatch !== undefined, 'California Children\'s Services matched as High Priority (Down Syndrome + Speech/Physical need).');

// Check for SSI for Children Match
const ssiMatch = matches.highPriority.find(p => p.id === 'ssi-for-children');
assert(ssiMatch !== undefined, 'SSI for Children matched as High Priority (Down Syndrome automatically meets medical impairment listings).');

// Check for CalABLE Match
const ableMatch = matches.highPriority.find(p => p.id === 'calable');
assert(ableMatch !== undefined, 'CalABLE savings matched as High Priority (Onset prior to 26 years).');

console.log('');

// ----------------------------------------------------
// TEST CASE 4: County Routing & Local Directory Mappings
// ----------------------------------------------------
console.log(`${BOLD}Test Case 4: County Routing & Directory Mappings Verification${RESET}`);

assert(matches.localOffices.length > 0, `Local Offices lists populated with ${matches.localOffices.length} offices.`);

// Verify Orange County offices are returned
const ocMediCal = matches.localOffices.find(o => o.type === 'County Medi-Cal' && o.name.includes('SSA'));
assert(ocMediCal !== undefined, `Correct Orange County Medi-Cal office routed: ${ocMediCal?.name}`);

const ocIHSS = matches.localOffices.find(o => o.type === 'County IHSS' && o.name.includes('SSA'));
assert(ocIHSS !== undefined, `Correct Orange County IHSS office routed: ${ocIHSS?.name}`);

const ocCCS = matches.localOffices.find(o => o.type === 'County CCS Office' && o.name.includes('Health Care Agency'));
assert(ocCCS !== undefined, `Correct Orange County CCS office routed: ${ocCCS?.name}`);

console.log('');

// ----------------------------------------------------
// TEST SUMMARY
// ----------------------------------------------------
console.log(`${BOLD}====================================================${RESET}`);
if (testPassed) {
  console.log(`${GREEN}${BOLD}🎉 SUCCESS: All database & matching rules test checks passed perfectly!${RESET}`);
} else {
  console.log(`${RED}${BOLD}🚨 FAILURE: Some automated matching check validations failed.${RESET}`);
}
console.log(`${BOLD}====================================================${RESET}`);

process.exit(testPassed ? 0 : 1);
