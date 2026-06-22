import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch116ArizonaZeroLeafPacketRefinementV1 } from './run-batch116-arizona-zero-leaf-packet-refinement-v1.mjs';

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

const result = generateBatch116ArizonaZeroLeafPacketRefinementV1();
const summary = readJson('data/generated/arizona_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/arizona_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/arizona_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/arizona_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/arizona_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch116_arizona_zero_leaf_packet_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/arizona-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.primary_gap_reason, 'challenged_official_roots_and_zero_exact_leaf_targets_in_authoring_packets');

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(eduGap.family_status, 'blocked_zero_exact_leaf_packet');
assert.equal(countyGap.family_status, 'blocked_zero_exact_leaf_packet');
assert.match(eduGap.status_reason, /0 exact district-owned leaves/i);
assert.match(countyGap.status_reason, /0 exact county-specific or regional office leaves/i);

const eduFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(eduFailure.failure_code, 'education_packet_scaffold_only_zero_exact_district_leaves');
assert.equal(countyFailure.failure_code, 'county_office_packet_scaffold_only_zero_exact_office_leaves');
assert.equal(eduFailure.next_action, 'author_exact_district_owned_special_education_leaves_before_reopening_arizona_education');
assert.equal(countyFailure.next_action, 'author_exact_county_or_regional_des_office_leaves_before_reopening_arizona_county_local');

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(eduVerified.family_status, 'blocked_zero_exact_leaf_packet');
assert.equal(countyVerified.family_status, 'blocked_zero_exact_leaf_packet');
assert.match(eduVerified.blocker_evidence, /authoredExactLeafCount=0/i);
assert.match(countyVerified.blocker_evidence, /authoredExactLeafCount=0/i);

assert.equal(nextRows.find((row) => row.family === 'district_or_county_education_routing').next_action, 'author_exact_district_owned_special_education_leaves_before_reopening_arizona_education');
assert.equal(nextRows.find((row) => row.family === 'county_local_disability_resources').next_action, 'author_exact_county_or_regional_des_office_leaves_before_reopening_arizona_county_local');

assert.equal(batchSummary.packet_metrics.educationAuthoredExactLeafCount, 0);
assert.equal(batchSummary.packet_metrics.countyAuthoredExactLeafCount, 0);
assert.ok(report.includes('both authored leaf packets still contain zero exact local targets'));
assert.ok(lessons.includes('### Packet Scaffolds Do Not Count As Runnable Exact-Leaf Queues'));

console.log('test-batch116-arizona-zero-leaf-packet-refinement-v1: ok');
