import fs from 'fs';
import path from 'path';
import assert from 'assert/strict';
import { fileURLToPath } from 'url';
import { generateAllStateCaliforniaGradeAuditV3 } from './run-all-state-california-grade-audit-v3.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
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

generateAllStateCaliforniaGradeAuditV3();

const auditV3 = readJson('data/generated/all_state_california_grade_audit_v3.json');
const priorityV3 = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const texasSummary = readJson('data/generated/texas_california_grade_summary_v2.json');
const texasGap = readJsonl('data/generated/texas_gap_matrix_v2.jsonl');
const texasFailures = readJsonl('data/generated/texas_failure_ledger_v2.jsonl');
const texasVerified = readJsonl('data/generated/texas_verified_sources_v1.jsonl');
const texasNext = readJsonl('data/generated/texas_next_action_queue_v2.jsonl');
const reportV3 = fs.readFileSync(path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'), 'utf8');
const planV3 = fs.readFileSync(path.join(docsGeneratedDir, 'all-state-priority-plan-v3.md'), 'utf8');
const texasReport = fs.readFileSync(path.join(docsGeneratedDir, 'texas-california-grade-audit-report-v2.md'), 'utf8');
const pennsylvaniaGap = readJsonl('data/generated/pennsylvania_gap_matrix_v2.jsonl');

assert.equal(auditV3.stateCount, 50, 'v3 must still cover all 50 states');
assert.equal(auditV3.packetCoverageCount, 50, 'v3 must confirm packet coverage for all 50 states');
assert.deepEqual(auditV3.packetMissingStates, [], 'v3 must have no missing state packets');

const texas = auditV3.states.find((state) => state.stateId === 'texas');
assert.ok(texas, 'Texas must exist in v3');
assert.equal(texas.classification, 'COMPLETE', 'Texas must remain COMPLETE in v3');
assert.equal(texas.indexSafe, true, 'Texas must remain index-safe in v3');

assert.equal(texasSummary.classification, 'COMPLETE', 'Texas packet summary must be complete');
assert.equal(texasSummary.index_safe, true, 'Texas packet summary must be index-safe');
assert.equal(texasFailures.length, 0, 'Texas packet failure ledger must be empty');
assert.ok(texasGap.length > 0, 'Texas packet gap matrix must be present');
assert.ok(texasVerified.length > 0, 'Texas packet verified sources must be present');
assert.equal(texasNext.length, 1, 'Texas packet next-action queue must have a single maintenance row');

assert.equal(priorityV3.length, 50, 'v3 priority queue must still cover all 50 states');
assert.ok(priorityV3.every((row) => row.state_packet_generated === true), 'Every v3 priority row must confirm packet generation');
assert.ok(priorityV3.some((row) => row.state === 'texas' && row.repair_lane === 'maintain_truth_only'), 'Texas must move to maintain_truth_only in v3');
assert.ok(priorityV3.some((row) => row.state === 'new-jersey' && row.repair_lane === 'maintain_truth_only'), 'New Jersey must move to maintain_truth_only once it becomes COMPLETE');

const packetSummaries = fs.readdirSync(path.join(repoRoot, 'data', 'generated'))
  .filter((file) => file.endsWith('_california_grade_summary_v2.json'))
  .map((file) => readJson(path.join('data', 'generated', file)));
const auditStateById = new Map(auditV3.states.map((row) => [row.stateId, row]));
const priorityStateById = new Map(priorityV3.map((row) => [row.state, row]));
for (const summary of packetSummaries) {
  const auditState = auditStateById.get(summary.state);
  const priorityState = priorityStateById.get(summary.state);
  assert.ok(auditState, `Audit v3 must include packet state ${summary.state}`);
  assert.ok(priorityState, `Priority v3 must include packet state ${summary.state}`);
  assert.equal(auditState.classification, summary.classification, `${summary.state} audit classification must match packet summary`);
  assert.equal(auditState.indexSafe, summary.index_safe, `${summary.state} audit index_safe must match packet summary`);
  assert.equal(auditState.incorrectlyIndexSafe, summary.incorrectly_index_safe, `${summary.state} audit incorrectlyIndexSafe must match packet summary`);
  assert.equal(auditState.completenessPct, summary.completeness_pct, `${summary.state} audit completeness_pct must match packet summary`);
  assert.equal(auditState.strongCriticalFamilies, summary.strong_critical_families, `${summary.state} audit strong critical count must match packet summary`);
  assert.equal(auditState.weakCriticalFamilies, summary.weak_critical_families, `${summary.state} audit weak critical count must match packet summary`);
  assert.equal(auditState.missingCriticalFamilies, summary.missing_critical_families, `${summary.state} audit missing critical count must match packet summary`);
  assert.equal(auditState.packetPrimaryGapReason, summary.primary_gap_reason, `${summary.state} audit primary gap reason must match packet summary`);

  assert.equal(priorityState.classification, summary.classification, `${summary.state} priority classification must match packet summary`);
  assert.equal(priorityState.index_safe, summary.index_safe, `${summary.state} priority index_safe must match packet summary`);
  assert.equal(priorityState.completeness_pct, summary.completeness_pct, `${summary.state} priority completeness_pct must match packet summary`);
  assert.equal(priorityState.missing_critical_families, summary.missing_critical_families, `${summary.state} priority missing critical count must match packet summary`);
  assert.equal(priorityState.weak_critical_families, summary.weak_critical_families, `${summary.state} priority weak critical count must match packet summary`);
  assert.equal(priorityState.primary_gap_reason, summary.primary_gap_reason, `${summary.state} priority primary gap reason must match packet summary`);
  assert.equal(priorityState.recommended_batch, summary.recommended_batch, `${summary.state} priority recommended_batch must match packet summary`);
}

const derivedIncorrectlyIndexSafeStates = auditV3.states.filter((state) => state.incorrectlyIndexSafe).map((state) => state.stateId);
assert.deepEqual(
  auditV3.incorrectlyIndexSafeStates,
  derivedIncorrectlyIndexSafeStates,
  'Top-level incorrectlyIndexSafeStates must be recomputed from v3 packet-backed state rows',
);
assert.equal(
  auditV3.incorrectlyIndexSafeStates.includes('pennsylvania'),
  readJson('data/generated/pennsylvania_california_grade_summary_v2.json').incorrectly_index_safe,
  'Pennsylvania top-level incorrectly-index-safe status must match its packet summary',
);

const pennsylvania = auditV3.states.find((state) => state.stateId === 'pennsylvania');
assert.ok(pennsylvania, 'Pennsylvania must exist in v3');
const pennsylvaniaGapStatusByFamily = new Map(pennsylvaniaGap.map((row) => [row.family, row.family_status]));
for (const [family, familyStatus] of pennsylvaniaGapStatusByFamily.entries()) {
  assert.equal(
    pennsylvania.familyStatuses[family],
    familyStatus,
    `Pennsylvania family status for ${family} must match the refreshed packet gap matrix`,
  );
}

assert.ok(reportV3.includes('packet_coverage_count: 50'), 'v3 report must state full packet coverage');
assert.ok(reportV3.includes('packet_missing_states: none'), 'v3 report must state no missing packet states');
assert.ok(planV3.includes('Stop expanding packet coverage.'), 'v3 plan must move to repair-from-packets mode');
assert.ok(texasReport.includes('Texas remains COMPLETE and index-safe'), 'Texas packet report must preserve Texas complete truth');

console.log(JSON.stringify({
  ok: true,
  packetCoverageCount: auditV3.packetCoverageCount,
  texasClassification: texas.classification,
  indexSafeCount: auditV3.indexSafeCount,
}, null, 2));
