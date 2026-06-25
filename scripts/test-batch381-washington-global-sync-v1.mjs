import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch381WashingtonGlobalSyncV1 } from './run-batch381-washington-global-sync-v1.mjs';

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

const result = generateBatch381WashingtonGlobalSyncV1();
const audit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const batchSummary = readJson('data/generated/batch381_washington_global_sync_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch381-washington-global-sync-report-v1.md'), 'utf8');

assert.equal(result.complete_count, 38);
assert.equal(result.blocked_count, 12);
assert.equal(result.index_safe_count, 38);
assert.deepEqual(result.incorrectly_index_safe_states, []);

assert.equal(audit.classifications.COMPLETE, 38);
assert.equal(audit.classifications.BLOCKED, 12);
assert.equal(audit.indexSafeCount, 38);
assert.deepEqual(audit.incorrectlyIndexSafeStates, []);

const wa = audit.states.find((row) => row.stateId === 'washington');
assert.equal(wa.classification, 'COMPLETE');
assert.equal(wa.indexSafe, true);
assert.equal(wa.packetBatch, 'batch378_washington_ddcs_dvr_completion_v1');
assert.equal(wa.packetPrimaryGapReason, 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence');
assert.equal(wa.packetRecommendedBatch, 'complete_maintain');

const queueRow = queueRows.find((row) => row.state === 'washington');
assert.equal(queueRow.classification, 'COMPLETE');
assert.equal(queueRow.index_safe, true);
assert.equal(queueRow.recommended_batch, 'complete_maintain');
assert.equal(queueRow.repair_lane, 'maintain_truth_only');

assert.match(handoff, /Current Focus State: New Hampshire/);
assert.match(handoff, /Washington/);
assert.doesNotMatch(handoff, /- Washington: `official_dshs_local_offices_are_public_but_reviewed_pages_do_not_preserve_a_county_to_office_or_service_area_contract`/);

assert.match(allStateReport, /- COMPLETE: 38/);
assert.match(allStateReport, /- BLOCKED: 12/);
assert.match(allStateReport, /Washington is now COMPLETE\/index-safe/);
assert.match(allStateReport, /complete states: .*Washington/);
assert.doesNotMatch(allStateReport, /blocked states: .*Washington/);

assert.equal(batchSummary.complete_count, 38);
assert.equal(batchSummary.blocked_count, 12);
assert.equal(batchSummary.index_safe_count, 38);
assert.deepEqual(batchSummary.incorrectly_index_safe_states, []);
assert.match(batchReport, /Integrated the safe Washington-only parallel-state commit/);

console.log('test-batch381-washington-global-sync-v1: ok');
