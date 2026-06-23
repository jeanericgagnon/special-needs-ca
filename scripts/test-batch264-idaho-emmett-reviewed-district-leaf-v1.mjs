import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch264IdahoEmmettReviewedDistrictLeafV1 } from './run-batch264-idaho-emmett-reviewed-district-leaf-v1.mjs';

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

const result = generateBatch264IdahoEmmettReviewedDistrictLeafV1();
const summary = readJson('data/generated/idaho_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/idaho_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/idaho_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/idaho_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/idaho_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch264_idaho_emmett_reviewed_district_leaf_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/idaho-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'reviewed_idaho_district_leaves_now_cover_12_counties_and_dhw_split_is_explicit_but_county_grade_remains_incomplete');
assert.equal(summary.final_blockers[0].failure_code, 'reviewed_district_special_services_leaves_now_cover_12_counties_but_county_grade_mapping_is_still_incomplete');

const gap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(gap.status_reason, /twelve counties/i);
assert.match(gap.status_reason, /Emmett Independent School District/i);

const failure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(failure.failure_code, 'reviewed_district_special_services_leaves_now_cover_12_counties_but_county_grade_mapping_is_still_incomplete');
assert.match(failure.evidence, /Emmett School District #221/i);
assert.match(failure.evidence, /Special Education - Emmett Independent School District/i);
assert.match(failure.evidence, /procedural-safeguards text/i);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(verified.sample_count, 14);
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://www.emmettschools.org/departments/special-education'));

const next = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(next.failure_code, 'reviewed_district_special_services_leaves_now_cover_12_counties_but_county_grade_mapping_is_still_incomplete');
assert.equal(next.next_action, 'expand_reviewed_exact_district_special_education_leaves_county_by_county_from_the_official_idaho_root_packet');

assert.equal(batchSummary.reviewed_exact_leaf_count, 12);
assert.equal(batchSummary.new_county, 'gem-id');
assert.match(report, /reviewed count to twelve counties/i);
assert.ok(handoff.includes('## Current Focus State: Idaho'));
assert.ok(handoff.includes('reviewed_idaho_district_leaves_now_cover_12_counties_and_dhw_split_is_explicit_but_county_grade_remains_incomplete'));

console.log('test-batch264-idaho-emmett-reviewed-district-leaf-v1: ok');
