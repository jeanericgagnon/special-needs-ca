import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch188IdahoCountyContractFinalizationV1 } from './run-batch188-idaho-county-contract-finalization-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

const result = generateBatch188IdahoCountyContractFinalizationV1();
const summary = readJson('data/generated/idaho_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/idaho_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/idaho_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/idaho_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/idaho_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch188_idaho_county_contract_finalization_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/idaho-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(result.index_safe, false);
assert.equal(batchSummary.official_district_links_reviewed, 116);
assert.equal(batchSummary.county_bearing_district_names_visible, 12);
assert.equal(batchSummary.district_directory_has_explicit_county_field, false);
assert.equal(batchSummary.district_directory_has_special_education_field, false);
assert.equal(batchSummary.clean_county_office_leaf_matches, 17);
assert.equal(batchSummary.unresolved_legacy_counties, 27);
assert.equal(batchSummary.office_directory_has_county_field, false);

assert.equal(summary.primary_gap_reason, 'live_official_idaho_directory_pages_exist_but_still_do_not_expose_county_grade_contracts_for_education_or_dhw_office_routing');

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationGap.family_status, 'blocked_live_official_district_directory_without_county_grade_contract');
assert.match(educationGap.status_reason, /116 exact outbound district website links/i);
assert.match(educationGap.status_reason, /zero explicit county fields/i);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_live_office_directory_without_public_county_contract');
assert.match(countyGap.status_reason, /zero county terms or county-served fields/i);
assert.match(countyGap.status_reason, /17 clean county-to-office leaf matches/i);

const educationFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationFailure.failure_code, 'official_district_directory_has_116_links_but_zero_county_or_special_education_fields');
assert.match(educationFailure.evidence, /116 exact outbound district website links/i);
assert.match(educationFailure.evidence, /no explicit county field/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'official_dhw_office_stack_has_zero_county_fields_and_only_17_clean_leaf_matches');
assert.match(countyFailure.evidence, /zero county terms or county-served fields/i);
assert.match(countyFailure.evidence, /17 clean county-to-office leaf matches/i);

const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationVerified.family_status, 'blocked_live_official_district_directory_without_county_grade_contract');
assert.equal(educationVerified.blocker_code, 'official_district_directory_has_116_links_but_zero_county_or_special_education_fields');

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_live_office_directory_without_public_county_contract');
assert.equal(countyVerified.blocker_code, 'official_dhw_office_stack_has_zero_county_fields_and_only_17_clean_leaf_matches');

const educationNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationNext.next_action, 'author_reviewed_district_owned_special_education_or_student_services_leaves_from_existing_idaho_packet');

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'hold_17_clean_office_leaf_matches_and_keep_27_counties_blocked_until_public_county_contract_exists');

assert.match(report, /Education stays blocked because the live official SDE directory is only an authoring surface today/i);
assert.match(report, /County-local stays blocked because the live official DHW office stack is only a partial authoring surface today/i);
assert.ok(lessons.includes('### Zero County Tokens In A Live Official Locator Means The County Contract Is Still Missing'));

console.log('test-batch188-idaho-county-contract-finalization-v1: ok');
