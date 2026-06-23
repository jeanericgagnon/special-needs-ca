import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch235IdahoTetonReviewedDistrictLeafV1 } from './run-batch235-idaho-teton-reviewed-district-leaf-v1.mjs';

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

const result = generateBatch235IdahoTetonReviewedDistrictLeafV1();
const summary = readJson('data/generated/idaho_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/idaho_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/idaho_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/idaho_verified_sources_v1.jsonl');
const packet = readJson('data/generated/idaho_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const batchSummary = readJson('data/generated/batch235_idaho_teton_reviewed_district_leaf_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/idaho-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.primary_gap_reason, 'reviewed_idaho_district_leaves_now_cover_10_counties_and_dhw_split_is_explicit_but_county_grade_remains_incomplete');

const gap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(gap.status_reason, /ten counties/i);
assert.match(gap.status_reason, /Teton County District #401/i);

const failure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(failure.failure_code, 'reviewed_district_special_services_leaves_now_cover_10_counties_but_county_grade_mapping_is_still_incomplete');
assert.match(failure.evidence, /Teton County District #401/i);
assert.match(failure.evidence, /Special Education/i);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(verified.sample_count, 12);
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://www.tsd401.org/apps/pages/?type=d&uREC_ID=595525&pREC_ID=1147857'));

assert.equal(packet.current_problem_metrics.reviewedExactLeafCount, 10);
assert.equal(packet.current_problem_metrics.authoredExactLeafCount, 10);
assert.ok(packet.reviewed_exact_leaves.some((leaf) => leaf.county_id === 'teton-id'));
assert.equal(queueRows.find((row) => row.state === 'idaho').primary_gap_reason, 'reviewed_idaho_district_leaves_now_cover_10_counties_and_dhw_split_is_explicit_but_county_grade_remains_incomplete');
assert.equal(batchSummary.reviewed_exact_leaf_count, 10);
assert.match(report, /ten reviewed district-owned leaves/i);
assert.match(lessons, /district root exposes an exact `Special Education` anchor/i);

console.log('test-batch235-idaho-teton-reviewed-district-leaf-v1: ok');
