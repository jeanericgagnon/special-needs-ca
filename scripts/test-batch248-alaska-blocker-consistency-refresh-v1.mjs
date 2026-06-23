import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch248AlaskaBlockerConsistencyRefreshV1 } from './run-batch248-alaska-blocker-consistency-refresh-v1.mjs';

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

const result = generateBatch248AlaskaBlockerConsistencyRefreshV1();
const summary = readJson('data/generated/alaska_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/alaska_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/alaska_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/alaska_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/alaska_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch248_alaska_blocker_consistency_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/alaska-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch248-alaska-blocker-consistency-refresh-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.primary_gap_reason, 'browser_only_dpa_directory_lacks_borough_mapping_and_dfcs_successor_hub_only_relays_into_challenged_health_host_leaves');

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(gap.family_status, 'blocked_dpa_directory_incomplete_and_dfcs_successor_hub_only_relays_into_challenged_health_host_leaves');
assert.match(gap.status_reason, /dfcs services hub/i);

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(failure.failure_code, 'browser_only_dpa_directory_lacks_borough_mapping_and_dfcs_successor_hub_only_relays_into_challenged_health_host_leaves');
assert.match(failure.evidence, /dfcs services hub/i);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(verified.family_status, 'blocked_dpa_directory_incomplete_and_dfcs_successor_hub_only_relays_into_challenged_health_host_leaves');
assert.equal(verified.sample_count, verified.samples.length);
assert.match(verified.query_basis, /dfcs services hub/i);

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(next.next_action, 'hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_mapping_on_a_reviewable_official_surface_or_replaces_the_dfcs_to_health_host_relay_with_a_reviewable_office_locator');

assert.equal(batchSummary.verified_sample_count, verified.samples.length);
assert.match(report, /DFCS successor hub does not repair that gap/i);
assert.match(batchReport, /Recomputed the verified-source sample count/i);

console.log('test-batch248-alaska-blocker-consistency-refresh-v1: ok');
