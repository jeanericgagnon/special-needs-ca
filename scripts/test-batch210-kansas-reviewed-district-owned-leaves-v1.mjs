import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch210KansasReviewedDistrictOwnedLeavesV1 } from './run-batch210-kansas-reviewed-district-owned-leaves-v1.mjs';

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

const result = generateBatch210KansasReviewedDistrictOwnedLeavesV1();
const summary = readJson('data/generated/kansas_california_grade_summary_v2.json');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const gapRows = readJsonl('data/generated/kansas_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/kansas_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/kansas_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/kansas_next_action_queue_v2.jsonl');
const packet = readJson('data/generated/kansas_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const leaves = readJsonl('data/generated/kansas_reviewed_district_owned_special_education_leaves_v1.jsonl');
const batchSummary = readJson('data/generated/batch210_kansas_reviewed_district_owned_leaves_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/kansas-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(result.reviewedLeafCount, 3);
assert.equal(summary.primary_gap_reason, 'reviewed_kansas_district_owned_leaves_exist_but_full_county_grade_coverage_is_incomplete');
assert.equal(queueRows.find((row) => row.state === 'kansas').primary_gap_reason, 'reviewed_kansas_district_owned_leaves_exist_but_full_county_grade_coverage_is_incomplete');

const gap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(gap.family_status, 'blocked_reviewed_district_owned_leaves_exist_but_not_statewide_county_grade');

const failure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(failure.failure_code, 'reviewed_district_owned_special_education_leaves_exist_but_kansas_county_grade_coverage_is_still_incomplete');
assert.match(failure.evidence, /atchison-ks/);
assert.match(failure.evidence, /butler-ks/);
assert.match(failure.evidence, /shawnee-ks/);
assert.match(failure.evidence, /There was a problem/);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(verified.sample_count, 5);
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://www.usd385.org/departments/special-education'));
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://www.usd409.net/page/special-education-services/'));
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://www.topekapublicschools.net/departments/special_education'));

const next = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(next.next_action, 'expand_reviewed_kansas_district_owned_special_education_leaves_from_public_export_backed_inventory');

assert.equal(packet.current_problem_metrics.authoredExactLeafCount, 3);
assert.deepEqual(packet.reviewed_local_leaf_counties, ['atchison-ks', 'butler-ks', 'shawnee-ks']);
assert.equal(leaves.length, 3);
assert.equal(batchSummary.reviewed_leaf_count, 3);
assert.ok(report.includes('reviewed district-owned leaves now exist for a real county subset'));
assert.ok(lessons.includes('### If The Public All-District Export Errors, Fall Back To District-Scoped Exports'));

console.log('test-batch210-kansas-reviewed-district-owned-leaves-v1: ok');
