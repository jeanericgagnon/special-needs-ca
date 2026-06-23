import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch237IdahoGoodingReviewedDistrictLeafV1 } from './run-batch237-idaho-gooding-reviewed-district-leaf-v1.mjs';

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

const result = generateBatch237IdahoGoodingReviewedDistrictLeafV1();
const summary = readJson('data/generated/idaho_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/idaho_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/idaho_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/idaho_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/idaho_next_action_queue_v2.jsonl');
const packet = readJson('data/generated/idaho_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const batchSummary = readJson('data/generated/batch237_idaho_gooding_reviewed_district_leaf_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/idaho-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch237-idaho-gooding-reviewed-district-leaf-report-v1.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.primary_gap_reason, 'reviewed_idaho_district_leaves_now_cover_11_counties_and_dhw_split_is_explicit_but_county_grade_remains_incomplete');

const gap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(gap.status_reason, /eleven counties/i);
assert.match(gap.status_reason, /Gooding Joint District #231/i);

const failure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(failure.failure_code, 'reviewed_district_special_services_leaves_now_cover_11_counties_but_county_grade_mapping_is_still_incomplete');
assert.match(failure.evidence, /Gooding Joint District #231/i);
assert.match(failure.evidence, /Special Education/);

const next = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(next.failure_code, 'reviewed_district_special_services_leaves_now_cover_11_counties_but_county_grade_mapping_is_still_incomplete');

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(verified.sample_count, 13);
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://gsd231.org/special-education/'));

assert.equal(packet.current_problem_metrics.reviewedExactLeafCount, 11);
assert.equal(packet.current_problem_metrics.authoredExactLeafCount, 11);
assert.ok(packet.reviewed_exact_leaves.some((leaf) => leaf.county_id === 'gooding-id'));
assert.equal(queueRows.find((row) => row.state === 'idaho').primary_gap_reason, 'reviewed_idaho_district_leaves_now_cover_11_counties_and_dhw_split_is_explicit_but_county_grade_remains_incomplete');
assert.equal(batchSummary.reviewed_exact_leaf_count, 11);
assert.match(report, /eleven reviewed district-owned leaves/i);
assert.match(batchReport, /Gooding Joint District #231/i);
assert.match(lessons, /repeated exact `Special Education` nav link/i);

console.log('test-batch237-idaho-gooding-reviewed-district-leaf-v1: ok');
