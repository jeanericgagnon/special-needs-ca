import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch139FloridaSampleBundleBlockerRefreshV1 } from './run-batch139-florida-sample-bundle-blocker-refresh-v1.mjs';

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

const result = generateBatch139FloridaSampleBundleBlockerRefreshV1();
const summary = readJson('data/generated/florida_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/florida_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/florida_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/florida_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/florida_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch139_florida_sample_bundle_blocker_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/florida-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_myaccess_bundle_exposes_sample_rows_and_two_county_admin_stub_not_public_statewide_contract');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');

assert.match(countyGap.status_reason, /tiny Broward\/Dade admin stub/i);
assert.match(countyGap.status_reason, /BigOrganization10/i);
assert.match(countyGap.status_reason, /Second Harvest/i);

assert.equal(countyFailure.failure_code, 'official_myaccess_bundle_exposes_sample_rows_and_two_county_admin_stub_not_public_statewide_contract');
assert.match(countyFailure.evidence, /main\.d43b0959\.js/i);
assert.match(countyFailure.evidence, /orgFullName=\"BigOrganization10\"/i);
assert.match(countyFailure.evidence, /locationName=\"Second Harvest\"/i);
assert.match(countyFailure.evidence, /Broward\/Dade admin stub/i);

assert.equal(countyVerified.blocker_code, 'official_myaccess_bundle_exposes_sample_rows_and_two_county_admin_stub_not_public_statewide_contract');
assert.match(countyVerified.query_basis, /public main bundle sample rows/i);

assert.equal(countyNext.failure_code, 'official_myaccess_bundle_exposes_sample_rows_and_two_county_admin_stub_not_public_statewide_contract');
assert.match(countyNext.next_action, /documented_anonymous_search_contract_exists_beyond_sample_bundle_rows/i);

assert.equal(batchSummary.counties_cleared_via_csv, 34);
assert.equal(batchSummary.counties_still_missing_public_contract, 33);
assert.equal(batchSummary.bundle_signal, 'two_county_admin_stub_plus_sample_internal_rows');
assert.deepEqual(batchSummary.main_bundle_county_names, ['Broward', 'Dade']);
assert.deepEqual(batchSummary.sample_rows_seen, ['BigOrganization10', 'Second Harvest', 'Tallahassee', 'Baker']);

assert.ok(report.includes('two-county Broward/Dade admin stub plus obvious sample/internal rows'));
assert.ok(lessons.includes('Public Bundles With Tiny County Stubs And Sample Rows Still Fail The County-Grade Gate'));

console.log('test-batch139-florida-sample-bundle-blocker-refresh-v1: ok');
