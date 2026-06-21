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
assert.ok(priorityV3.some((row) => row.state === 'new-jersey' && row.repair_lane === 'repair_from_state_packet'), 'Non-complete states must use repair_from_state_packet in v3');

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
