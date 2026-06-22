import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch139FloridaMainBundleSampleDataRefreshV1 } from './run-batch139-florida-main-bundle-sample-data-refresh-v1.mjs';

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

const result = generateBatch139FloridaMainBundleSampleDataRefreshV1();
const summary = readJson('data/generated/florida_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/florida_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/florida_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/florida_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/florida_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch139_florida_main_bundle_sample_data_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/florida-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'public_myaccess_bundle_contains_sample_rows_and_two_county_admin_stub_not_statewide_contract');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');

assert.match(countyGap.status_reason, /34\/67 counties/i);
assert.match(countyGap.status_reason, /Broward\/Dade admin map/i);
assert.match(countyGap.status_reason, /BigOrganization10/i);
assert.match(countyGap.status_reason, /Second Harvest/i);

assert.equal(countyFailure.failure_code, 'public_myaccess_bundle_contains_sample_rows_and_two_county_admin_stub_not_statewide_contract');
assert.match(countyFailure.evidence, /Broward and Dade/i);
assert.match(countyFailure.evidence, /BigOrganization10/i);
assert.match(countyFailure.evidence, /Second Harvest/i);
assert.match(countyFailure.evidence, /remaining 33 counties/i);

assert.equal(countyVerified.blocker_code, 'public_myaccess_bundle_contains_sample_rows_and_two_county_admin_stub_not_statewide_contract');
assert.match(countyVerified.query_basis, /main bundle/i);
assert.ok(countyVerified.samples.some((sample) => sample.source_url === 'https://myaccess.myflfamilies.com/static/js/main.d43b0959.js'));
assert.ok(countyVerified.samples.some((sample) => /Broward and Dade/.test(sample.evidence_snippet)));
assert.ok(countyVerified.samples.some((sample) => /BigOrganization10/.test(sample.evidence_snippet)));

assert.equal(countyNext.failure_code, 'public_myaccess_bundle_contains_sample_rows_and_two_county_admin_stub_not_statewide_contract');
assert.match(countyNext.next_action, /documented_anonymous_search_contract/i);

assert.equal(batchSummary.counties_cleared_via_csv, 34);
assert.equal(batchSummary.counties_still_missing_public_contract, 33);
assert.equal(batchSummary.bundle_sample_county_rows, 2);
assert.deepEqual(batchSummary.bundle_sample_counties, ['Broward', 'Dade']);
assert.deepEqual(batchSummary.sample_row_markers, ['BigOrganization10', 'Second Harvest']);

assert.ok(report.includes('tiny Broward/Dade admin stub plus obvious sample/internal rows'));
assert.ok(lessons.includes('Public Bundles With Tiny County Stubs And Sample Rows Do Not Count As County Contracts'));

console.log('test-batch139-florida-main-bundle-sample-data-refresh-v1: ok');
