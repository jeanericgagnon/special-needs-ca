import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch167FloridaRoleFieldZeroMatchV1 } from './run-batch167-florida-role-field-zero-match-v1.mjs';

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

const result = generateBatch167FloridaRoleFieldZeroMatchV1();
const batchSummary = readJson('data/generated/batch167_florida_role_field_zero_match_summary_v1.json');
const summary = readJson('data/generated/florida_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/florida_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/florida_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/florida_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/florida_next_action_queue_v2.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/florida-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.primary_gap_reason, 'public_dcf_contacts_csv_is_county_complete_but_wrong_service_role_and_myaccess_results_remain_authenticated');
assert.equal(batchSummary.public_contacts_csv_row_count, 109);
assert.equal(batchSummary.county_complete_contact_rows, true);
assert.deepEqual(batchSummary.role_field_zero_match_terms, [
  'access',
  'medicaid',
  'snap',
  'tanf',
  'economic self-sufficiency',
  'food assistance',
  'cash assistance',
]);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(countyGap.status_reason, /role-field audit across all 109 public rows still shows zero matches/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(countyFailure.evidence, /role-field audit over all 109 public contacts\.csv rows/i);
assert.match(countyFailure.evidence, /zero matches for ACCESS, Medicaid, SNAP, TANF, economic self-sufficiency, food assistance, and cash assistance/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(countyVerified.query_basis, /role-field keyword audit across the county-complete public CSV/i);
assert.match(countyVerified.blocker_evidence, /wrong service role/i);

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(countyNext.evidence, /zero matches for ACCESS, Medicaid, SNAP, TANF/i);

assert.ok(report.includes('role fields never name ACCESS, Medicaid, SNAP, TANF, economic self-sufficiency, food assistance, or cash assistance'));
assert.ok(lessons.includes('### County-Complete Official CSVs Still Fail If Role Fields Never Name The Required Program'));

console.log('test-batch167-florida-role-field-zero-match-v1: ok');
