import fs from 'fs';
import path from 'path';
import assert from 'assert/strict';
import { fileURLToPath } from 'url';
import { generateBatch18FailureClassRepairStatesV1 } from './run-batch18-failure-class-repair-states-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

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

generateBatch18FailureClassRepairStatesV1();

const expectedStates = ['california', 'pennsylvania', 'florida', 'georgia', 'ohio'];
const batchSummary = readJson('data/generated/batch18_failure_class_repair_states_summary_v1.json');
const batchQueue = readJsonl('data/generated/batch18_failure_class_repair_queue_v1.jsonl');
const batchReport = fs.readFileSync(path.join(docsGeneratedDir, 'batch18-failure-class-repair-states-report-v1.md'), 'utf8');
const txV10 = readJson('data/generated/tx_verification_summary_v10.json');

assert.deepEqual(batchSummary.cohort_states.map((row) => row.state), expectedStates, 'Batch 18 must cover the first five non-COMPLETE states from v3 order');
assert.equal(batchSummary.generated_all_state_v4, false, 'Batch 18 must not claim an all-state v4 refresh without state changes');
assert.equal(batchSummary.complete_states.length, 0, 'Batch 18 must not promote any state complete');
assert.equal(batchSummary.texas_preserved_complete, true, 'Texas must remain complete while Batch 18 runs');
assert.equal(txV10.v10.pass_counties, 254, 'Texas v10 must remain 254 PASS');
assert.equal(txV10.index_safe, true, 'Texas must remain index-safe');

for (const stateId of expectedStates) {
  const summary = readJson(`data/generated/${stateId}_repair_manifest_v1.json`);
  const queue = readJsonl(`data/generated/${stateId}_repair_family_queue_v1.jsonl`);
  const report = fs.readFileSync(path.join(docsGeneratedDir, `${stateId}-batch18-failure-class-repair-report-v1.md`), 'utf8');

  assert.equal(summary.state, stateId, `Repair manifest state mismatch for ${stateId}`);
  assert.equal(summary.ready_for_completion_claim, false, `${stateId} must not be marked ready for completion`);
  assert.ok(queue.length > 0, `${stateId} repair queue must not be empty`);
  assert.ok(queue.every((row) => row.repair_lane), `${stateId} repair queue must classify every row into a repair lane`);
  assert.ok(queue.every((row) => row.truth_risk === 'high' || row.truth_risk === 'medium'), `${stateId} repair queue must assign truth risk`);
  assert.ok(report.includes('Completion decision'), `${stateId} repair report must include completion decision`);
}

assert.ok(batchQueue.some((row) => row.repair_lane === 'county_district_leaf_repair'), 'Batch 18 queue must include county/district leaf repair work');
assert.ok(batchQueue.some((row) => row.repair_lane === 'statewide_family_repair'), 'Batch 18 queue must include statewide family repair work');
assert.ok(batchQueue.some((row) => row.repair_lane === 'launch_gate_hold'), 'Batch 18 queue must include launch-gate hold rows for legacy-index states');
assert.ok(batchReport.includes('texas_preserved_complete: true'), 'Batch 18 report must preserve Texas complete truth');
assert.ok(batchReport.includes('shared failure-class repair cohort'), 'Batch 18 report must describe the cohort repair rule');

console.log(JSON.stringify({
  ok: true,
  cohortStates: batchSummary.cohort_states.map((row) => row.state),
  repairLaneCounts: batchSummary.repair_lane_counts,
}, null, 2));
