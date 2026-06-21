import fs from 'fs';
import path from 'path';
import assert from 'assert/strict';
import { fileURLToPath } from 'url';
import { generateBatch2RepairBlockedStatesV1 } from './run-batch2-repair-blocked-states-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  const filePath = path.join(repoRoot, relativePath);
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

generateBatch2RepairBlockedStatesV1();

const batchSummary = readJson('data/generated/batch2_repair_blocked_states_summary_v1.json');
const auditV2 = readJson('data/generated/all_state_california_grade_audit_v2.json');
const txV10 = readJson('data/generated/tx_verification_summary_v10.json');
const batchReport = fs.readFileSync(path.join(docsGeneratedDir, 'batch2-repair-blocked-states-report-v1.md'), 'utf8');

assert.deepEqual(batchSummary.states.map((row) => row.state), ['georgia', 'ohio', 'new-york'], 'Batch 2 must cover Georgia, Ohio, and New York in order');
assert.equal(batchSummary.generated_all_state_v3, false, 'Batch 2 must not generate all-state v3 unless a state actually becomes complete');
assert.equal(batchSummary.complete_states.length, 0, 'No Batch 2 state should be promoted complete from current evidence');
assert.equal(batchSummary.texas_preserved_complete, true, 'Texas must remain COMPLETE/index_safe while Batch 2 runs');

const texas = auditV2.states.find((row) => row.stateId === 'texas');
assert.ok(texas, 'Texas must still exist in v2');
assert.equal(texas.classification, 'COMPLETE', 'Batch 1 must preserve Texas COMPLETE');
assert.equal(texas.indexSafe, true, 'Batch 1 must preserve Texas index_safe');
assert.equal(txV10.v10.pass_counties, 254, 'Texas v10 must remain 254 PASS');
assert.equal(txV10.index_safe, true, 'Texas v10 must remain index-safe');

for (const stateId of ['georgia', 'ohio', 'new-york']) {
  const summary = readJson(`data/generated/${stateId}_california_grade_summary_v2.json`);
  const gaps = readJsonl(`data/generated/${stateId}_gap_matrix_v2.jsonl`);
  const failures = readJsonl(`data/generated/${stateId}_failure_ledger_v2.jsonl`);
  const verifiedSources = readJsonl(`data/generated/${stateId}_verified_sources_v1.jsonl`);
  const nextActions = readJsonl(`data/generated/${stateId}_next_action_queue_v2.jsonl`);
  const report = fs.readFileSync(path.join(docsGeneratedDir, `${stateId}-california-grade-audit-report-v2.md`), 'utf8');
  const stateAudit = auditV2.states.find((row) => row.stateId === stateId);

  assert.ok(stateAudit, `State must exist in all-state v2: ${stateId}`);
  assert.equal(summary.state, stateId, `Summary state mismatch for ${stateId}`);
  assert.equal(summary.classification, stateAudit.classification, `Summary classification mismatch for ${stateId}`);
  assert.equal(summary.index_safe, false, `${stateId} should remain non-index-safe under current evidence`);
  assert.equal(gaps.length, Object.keys(stateAudit.familyStatuses).length, `${stateId} gap matrix should include every family`);
  assert.equal(verifiedSources.length, Object.keys(stateAudit.familyStatuses).length, `${stateId} verified source ledger should include every family`);
  assert.equal(failures.length > 0, true, `${stateId} must have failure ledger rows`);
  assert.equal(nextActions.length, failures.length, `${stateId} next actions should be one-per-failure`);
  assert.ok(report.includes(`classification: ${stateAudit.classification}`), `${stateId} report must show classification`);
  assert.ok(report.includes('Completion decision'), `${stateId} report must include completion decision`);
}

assert.ok(batchReport.includes('generated_all_state_v3: false'), 'Batch 2 report must explicitly say all-state v3 was not generated');
assert.ok(batchReport.includes('texas_preserved_complete: true'), 'Batch 2 report must explicitly preserve Texas complete truth');

console.log(JSON.stringify({
  ok: true,
  states: batchSummary.states,
  generatedAllStateV3: batchSummary.generated_all_state_v3,
  texasPreserved: batchSummary.texas_preserved_complete,
}, null, 2));
