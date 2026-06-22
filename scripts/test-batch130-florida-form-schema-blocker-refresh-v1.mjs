import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch130FloridaFormSchemaBlockerRefreshV1 } from './run-batch130-florida-form-schema-blocker-refresh-v1.mjs';

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

const result = generateBatch130FloridaFormSchemaBlockerRefreshV1();
const summary = readJson('data/generated/florida_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/florida_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/florida_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/florida_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/florida_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch130_florida_form_schema_blocker_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/florida-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');

assert.match(countyGap.status_reason, /34\/67 counties/i);
assert.match(countyGap.status_reason, /blank form-schema fields like id\/locationName\/phoneNumber\/streetAddress/i);
assert.match(countyFailure.evidence, /officeMapping=\/dataexchangeproxy/i);
assert.match(countyFailure.evidence, /blank location template/i);
assert.match(countyFailure.evidence, /remaining 33 counties/i);
assert.match(countyVerified.query_basis, /form-schema bundle/i);
assert.match(countyNext.evidence, /county form controls and a blank location template/i);

assert.equal(batchSummary.counties_cleared_via_csv, 34);
assert.equal(batchSummary.counties_still_missing_public_contract, 33);
assert.equal(batchSummary.shell_bytes, 5165);
assert.equal(batchSummary.bundle_signal, 'county_form_controls_plus_blank_location_template');

assert.ok(report.includes('the reviewed JS bundle exposes form-schema fields instead of a downloadable or queryable county-office dataset'));

console.log('test-batch130-florida-form-schema-blocker-refresh-v1: ok');
