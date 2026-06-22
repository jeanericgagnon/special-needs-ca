import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch145FloridaAccountmanagement401RefinementV1 } from './run-batch145-florida-accountmanagement-401-refinement-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relPath), 'utf8'));
}

function readJsonl(relPath) {
  return fs.readFileSync(path.join(repoRoot, relPath), 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

generateBatch145FloridaAccountmanagement401RefinementV1();

const summary = readJson('data/generated/florida_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/florida_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/florida_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/florida_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/florida_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch145_florida_accountmanagement_401_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/florida-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch145-florida-accountmanagement-401-refinement-report-v1.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'myaccess_accountmanagement_endpoints_exist_but_require_authentication_for_county_results');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_public_csv_partial_authenticated_county_contract');
assert.match(countyGap.status_reason, /accountmanagement endpoints are not anonymous public contracts/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'myaccess_accountmanagement_endpoints_exist_but_require_authentication_for_county_results');
assert.match(countyFailure.evidence, /partnerApproverServices=\/accountmanagement/i);
assert.match(countyFailure.evidence, /HTTP 401/i);
assert.match(countyFailure.evidence, /getZipCountyDetails/i);
assert.match(countyFailure.evidence, /communityPartnerSearch/i);

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'hold_county_local_until_first_party_anonymous_county_dataset_or_public_office_contract_covers_remaining_33_counties');

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_public_csv_partial_authenticated_county_contract');
assert.ok(countyVerified.samples.some((sample) => sample.source_url === 'https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails'));
assert.ok(countyVerified.samples.some((sample) => sample.source_url === 'https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch'));
assert.ok(countyVerified.samples.some((sample) => sample.source_type === 'official_authenticated_api_contract'));

assert.deepEqual(batchSummary.authenticatedAccountmanagementEndpoints, [
  '/accountmanagement/getZipCountyDetails',
  '/accountmanagement/communityPartnerSearch',
]);
assert.equal(batchSummary.anonymousProbeStatus, 401);

assert.match(report, /401 Unauthorized/i);
assert.match(batchReport, /not public anonymous county-result lanes/i);

console.log('test-batch145-florida-accountmanagement-401-refinement-v1: ok');
