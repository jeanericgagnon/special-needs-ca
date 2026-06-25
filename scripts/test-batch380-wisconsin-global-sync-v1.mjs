import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch380WisconsinGlobalSyncV1 } from './run-batch380-wisconsin-global-sync-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  const raw = fs.readFileSync(path.join(repoRoot, relativePath), 'utf8').trim();
  if (!raw) return [];
  return raw.split('\n').map((line) => JSON.parse(line));
}

const result = generateBatch380WisconsinGlobalSyncV1();
const audit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const batchSummary = readJson('data/generated/batch380_wisconsin_global_sync_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch380-wisconsin-global-sync-report-v1.md'), 'utf8');

assert.equal(result.complete_count, 37);
assert.equal(result.blocked_count, 13);
assert.equal(result.index_safe_count, 37);
assert.deepEqual(result.incorrectly_index_safe_states, []);

assert.equal(audit.classifications.COMPLETE, 37);
assert.equal(audit.classifications.BLOCKED, 13);
assert.equal(audit.indexSafeCount, 37);
assert.deepEqual(audit.incorrectlyIndexSafeStates, []);

const wi = audit.states.find((row) => row.stateId === 'wisconsin');
assert.equal(wi.classification, 'COMPLETE');
assert.equal(wi.indexSafe, true);
assert.equal(wi.packetBatch, 'batch379_wisconsin_dpi_directory_completion_v1');
assert.equal(wi.packetPrimaryGapReason, 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence');
assert.equal(wi.packetRecommendedBatch, 'complete_maintain');

const queueRow = queueRows.find((row) => row.state === 'wisconsin');
assert.equal(queueRow.classification, 'COMPLETE');
assert.equal(queueRow.index_safe, true);
assert.equal(queueRow.recommended_batch, 'complete_maintain');
assert.equal(queueRow.repair_lane, 'maintain_truth_only');

assert.match(handoff, /Current Focus State: New Hampshire/);
assert.match(handoff, /Wisconsin/);
assert.doesNotMatch(handoff, /- Wisconsin: `generic_or_statewide_evidence_used_where_local_required`/);

assert.match(allStateReport, /- COMPLETE: 37/);
assert.match(allStateReport, /- BLOCKED: 13/);
assert.match(allStateReport, /Wisconsin is now COMPLETE\/index-safe/);
assert.match(allStateReport, /complete states: .*Wisconsin/);
assert.doesNotMatch(allStateReport, /blocked states: .*Wisconsin/);

assert.equal(batchSummary.complete_count, 37);
assert.equal(batchSummary.blocked_count, 13);
assert.equal(batchSummary.index_safe_count, 37);
assert.deepEqual(batchSummary.incorrectly_index_safe_states, []);
assert.match(batchReport, /Integrated the safe Wisconsin-only parallel-state commit/);

console.log('test-batch380-wisconsin-global-sync-v1: ok');
