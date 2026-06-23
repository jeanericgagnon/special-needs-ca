import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch199OhioBlockerEvidenceRefinementV1 } from './run-batch199-ohio-blocker-evidence-refinement-v1.mjs';

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

const result = generateBatch199OhioBlockerEvidenceRefinementV1();
const summary = readJson('data/generated/ohio_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/ohio_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/ohio_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/ohio_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/ohio_next_action_queue_v2.jsonl');
const districtPacket = readJson('data/generated/ohio_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const countyPacket = readJson('data/generated/ohio_county_local_disability_resources_leaf_authoring_packet_v1.json');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/ohio-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification_after, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'retired_official_county_family_no_live_successor_and_education_inventory_still_root_only');

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
const educationFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(countyFailure.failure_code, 'retired_official_county_family_no_live_successor_verified');
assert.match(countyFailure.evidence, /medicaid\.ohio\.gov\/families-and-individuals\/county-agencies/i);
assert.match(countyFailure.evidence, /ohio\.gov\/residents\/resources\/job-family-services-directory/i);
assert.equal(educationFailure.failure_code, 'education_inventory_still_mostly_root_only_after_bounded_leaf_review');
assert.match(educationFailure.evidence, /Only 4 distinct source URLs/i);
assert.match(educationFailure.evidence, /49 distinct URLs remain generic roots only/i);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(countyGap.status_reason, /Medicaid-host guesses/i);
assert.match(educationGap.status_reason, /covering 8 county rows/i);

assert.equal(districtPacket.current_problem_metrics.distinctLeafishSourceUrlCount, 4);
assert.equal(districtPacket.current_problem_metrics.leafishCountyCoverage, 8);
assert.equal(districtPacket.current_problem_metrics.distinctRootOnlySourceUrlCount, 49);
assert.equal(countyPacket.current_problem_metrics.reviewedOfficialSuccessor404Count, 8);
assert.equal(countyPacket.reviewed_successor_probes.length, 8);

assert.equal(verifiedRows.find((row) => row.family === 'county_local_disability_resources').blocker_code, 'retired_official_county_family_no_live_successor_verified');
assert.equal(verifiedRows.find((row) => row.family === 'district_or_county_education_routing').blocker_code, 'education_inventory_still_mostly_root_only_after_bounded_leaf_review');
assert.equal(nextRows.find((row) => row.family === 'district_or_county_education_routing').next_action, 'hold_blocked_until_more_exact_district_or_esc_leaf_targets_are_authored');
assert.equal(queueRows.find((row) => row.state === 'ohio').primary_gap_reason, 'retired_official_county_family_no_live_successor_and_education_inventory_still_root_only');

assert.ok(report.includes('the guessed Medicaid-host county-agency paths return 404'));
assert.ok(report.includes('only 4 distinct Ohio school-district source URLs on disk preserve path-level leaf signal'));
assert.ok(lessons.includes('### Probe Obvious State Successor Paths Before Reopening A Dead County Directory Family'));

console.log('test-batch199-ohio-blocker-evidence-refinement-v1: ok');
