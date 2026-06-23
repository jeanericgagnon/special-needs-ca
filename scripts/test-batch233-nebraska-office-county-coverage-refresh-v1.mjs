import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch233NebraskaOfficeCountyCoverageRefreshV1 } from './run-batch233-nebraska-office-county-coverage-refresh-v1.mjs';

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

const result = generateBatch233NebraskaOfficeCountyCoverageRefreshV1();
const summary = readJson('data/generated/nebraska_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/nebraska_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/nebraska_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/nebraska_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/nebraska_next_action_queue_v2.jsonl');
const packet = readJson('data/generated/nebraska_county_local_disability_resources_service_area_packet_v1.json');
const batchSummary = readJson('data/generated/batch233_nebraska_office_county_coverage_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/nebraska-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(gap.status_reason, /37 distinct USER_County values/i);
assert.match(gap.status_reason, /93 counties/i);

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(failure.failure_code, 'official_public_office_app_has_only_two_public_layers_and_37_distinct_office_counties');
assert.match(failure.evidence, /37 distinct office counties/i);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(verified.blocker_code, 'official_public_office_app_has_only_two_public_layers_and_37_distinct_office_counties');
assert.ok(verified.samples.some((sample) => /distinct county coverage/i.test(sample.sample_name)));

assert.equal(packet.current_problem_metrics.distinctOfficeCounties, 37);
assert.equal(batchSummary.distinct_office_counties, 37);
assert.match(report, /37 distinct USER_County values/i);
assert.equal(summary.classification, 'BLOCKED');
assert.equal(nextRows.find((row) => row.family === 'county_local_disability_resources').next_action, 'hold_blocked_until_official_service_area_or_county_assignment_contract_exists');

console.log('test-batch233-nebraska-office-county-coverage-refresh-v1: ok');
