import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch259FloridaLocalOfficesLeafRefinementV1 } from './run-batch259-florida-local-offices-leaf-refinement-v1.mjs';

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

const result = generateBatch259FloridaLocalOfficesLeafRefinementV1();
const summary = readJson('data/generated/florida_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/florida_gap_matrix_v2.jsonl');
const verifiedRows = readJsonl('data/generated/florida_verified_sources_v1.jsonl');
const failureRows = readJsonl('data/generated/florida_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/florida_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch259_florida_local_offices_leaf_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/florida-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_local_offices_leaf_routes_to_partial_family_resource_center_and_myaccess_results_stay_authenticated');

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(gap.family_status, 'blocked_official_local_offices_leaf_points_to_partial_storefront_lane_and_authenticated_only_results');
assert.match(gap.status_reason, /food-cash-and-medical/i);
assert.match(gap.status_reason, /34 of 67 counties/i);
assert.match(gap.status_reason, /HTTP 401/i);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(verified.family_status, 'blocked_official_local_offices_leaf_points_to_partial_storefront_lane_and_authenticated_only_results');
assert.equal(verified.sample_count, 7);
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://www.myflfamilies.com/food-cash-and-medical'));
assert.ok(verified.samples.some((sample) => /Find Local Offices/i.test(sample.evidence_snippet)));
assert.ok(verified.samples.some((sample) => sample.evidence_snippet.includes('circuit-3') || sample.evidence_snippet.includes('circuit-11')));

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(failure.failure_code, 'official_local_offices_leaf_routes_to_partial_family_resource_center_and_myaccess_results_stay_authenticated');
assert.match(failure.evidence, /food-cash-and-medical/i);
assert.match(failure.evidence, /34 county storefront rows/i);
assert.match(failure.evidence, /HTTP 404/i);
assert.match(failure.evidence, /HTTP 401/i);

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(next.next_action, 'hold_county_local_until_first_party_local_offices_lane_is_county_complete_or_anonymous_myaccess_results_exist');

assert.equal(batchSummary.exact_local_offices_leaf_reviewed, true);
assert.equal(batchSummary.family_resource_center_county_rows, 34);
assert.equal(batchSummary.dead_circuit_leaf_samples, 2);
assert.ok(report.includes('food-cash-and-medical'));
assert.ok(report.includes('Find Local Offices'));
assert.ok(lessons.includes('### An Exact Local-Offices Leaf Still Fails If It Only Resolves To A Partial Storefront Lane'));

console.log('test-batch259-florida-local-offices-leaf-refinement-v1: ok');
