import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch203IdahoReviewedDistrictLeavesV1 } from './run-batch203-idaho-reviewed-district-leaves-v1.mjs';

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

const result = generateBatch203IdahoReviewedDistrictLeavesV1();
const summary = readJson('data/generated/idaho_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/idaho_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/idaho_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/idaho_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/idaho_next_action_queue_v2.jsonl');
const packet = readJson('data/generated/idaho_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const batchSummary = readJson('data/generated/batch203_idaho_reviewed_district_leaves_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/idaho-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(result.index_safe, false);
assert.equal(summary.primary_gap_reason, 'reviewed_idaho_district_leaves_exist_but_county_grade_education_and_dhw_mapping_remain_incomplete');

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'blocked_reviewed_local_district_leaves_exist_but_not_statewide_county_grade');
assert.match(byFamily.get('district_or_county_education_routing').status_reason, /Cassia County School District Special Services/i);
assert.match(byFamily.get('district_or_county_education_routing').status_reason, /Pocatello-Chubbuck School District 25/i);

const failure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(failure.failure_code, 'reviewed_district_special_services_leaves_exist_but_county_grade_mapping_is_still_incomplete');
assert.match(failure.evidence, /cassiaschools\.org\/page\/special-services/i);
assert.match(failure.evidence, /payetteschools\.org\/our-district\/departments\/special-education/i);
assert.match(failure.evidence, /sd25\.us\/departments\/special-services/i);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(verified.family_status, 'blocked_reviewed_local_district_leaves_exist_but_not_statewide_county_grade');
assert.equal(verified.sample_count, 6);
assert.ok(verified.samples.some((sample) => /cassiaschools\.org\/page\/special-services/.test(sample.source_url)));
assert.ok(verified.samples.some((sample) => /payetteschools\.org\/our-district\/departments\/special-education/.test(sample.source_url)));
assert.ok(verified.samples.some((sample) => /sd25\.us\/departments\/special-services/.test(sample.source_url)));

const next = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(next.next_action, 'expand_reviewed_exact_district_special_education_leaves_county_by_county_from_the_official_idaho_root_packet');

assert.equal(packet.repair_lane, 'reviewed_exact_leaf_expansion_from_district_owned_roots');
assert.equal(packet.current_problem_metrics.authoredExactLeafCount, 3);
assert.equal(packet.current_problem_metrics.reviewedExactLeafCount, 3);
assert.equal(packet.reviewed_exact_leaves.length, 3);
assert.ok(packet.reviewed_exact_leaves.some((leaf) => leaf.county_id === 'cassia-id'));
assert.ok(packet.reviewed_exact_leaves.some((leaf) => leaf.county_id === 'payette-id'));
assert.ok(packet.reviewed_exact_leaves.some((leaf) => leaf.county_id === 'bannock-id'));

assert.equal(batchSummary.reviewed_exact_district_leaves, 3);
assert.ok(report.includes('some district-owned special-education or special-services pages are already verified'));
assert.ok(lessons.includes('Promote Exact District Leaves Once A Packet Signal Resolves Cleanly'));

console.log('test-batch203-idaho-reviewed-district-leaves-v1: ok');
