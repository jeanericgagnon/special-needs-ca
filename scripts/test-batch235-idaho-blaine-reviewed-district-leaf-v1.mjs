import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch235IdahoBlaineReviewedDistrictLeafV1 } from './run-batch235-idaho-blaine-reviewed-district-leaf-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relPath), 'utf8'));
}

function readJsonl(relPath) {
  return fs.readFileSync(path.join(repoRoot, relPath), 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

generateBatch235IdahoBlaineReviewedDistrictLeafV1();

const summary = readJson('data/generated/idaho_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/idaho_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/idaho_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/idaho_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/idaho_verified_sources_v1.jsonl');
const packet = readJson('data/generated/idaho_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const queue = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const batchSummary = readJson('data/generated/batch235_idaho_blaine_reviewed_district_leaf_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/idaho-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch235-idaho-blaine-reviewed-district-leaf-report-v1.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationGap.family_status, 'blocked_reviewed_local_district_leaves_exist_but_not_statewide_county_grade');
assert.match(educationGap.status_reason, /nine counties/i);
assert.match(educationGap.status_reason, /Blaine County District #61 Special Education/i);

const educationFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationFailure.failure_code, 'reviewed_district_special_services_leaves_exist_but_county_grade_mapping_is_still_incomplete');
assert.match(educationFailure.evidence, /blaineschools\.org\/teaching-and-learning\/teaching-learning\/educational-programs found direct district-owned links/i);
assert.match(educationFailure.evidence, /blaineschools\.org\/fs\/pages\/2147/i);
assert.match(educationFailure.evidence, /procedural-safeguards text/i);

const educationNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationNext.next_action, 'expand_reviewed_exact_district_special_education_leaves_county_by_county_from_the_official_idaho_root_packet');

const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationVerified.sample_count, 11);
assert.ok(educationVerified.samples.some((sample) => sample.sample_name === 'Blaine County District #61 reviewed district leaf'));
assert.ok(educationVerified.samples.some((sample) => /teaching-and-learning\/teaching-learning\/educational-programs\/special-education/.test(sample.final_url || '')));
assert.ok(!educationVerified.samples.some((sample) => sample.sample_name === 'Blaine County support-services signal only'));

assert.equal(packet.current_problem_metrics.reviewedExactLeafCount, 9);
assert.ok(packet.reviewed_exact_leaves.some((row) => row.county_id === 'blaine-id' && /special-education/.test(row.exact_leaf_url)));

const idQueue = queue.find((row) => row.state === 'idaho');
assert.equal(idQueue.classification, 'BLOCKED');
assert.equal(idQueue.index_safe, false);

assert.equal(batchSummary.promoted_county, 'blaine-id');
assert.equal(batchSummary.reviewed_exact_leaf_count, 9);

assert.match(report, /Blaine is no longer signal-only/i);
assert.match(batchReport, /promoted_county: blaine-id/i);

console.log('test-batch235-idaho-blaine-reviewed-district-leaf-v1: ok');
