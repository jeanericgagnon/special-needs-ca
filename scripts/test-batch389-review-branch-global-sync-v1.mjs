import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch389ReviewBranchGlobalSyncV1 } from './run-batch389-review-branch-global-sync-v1.mjs';

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

const result = generateBatch389ReviewBranchGlobalSyncV1();
const audit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const batchSummary = readJson('data/generated/batch389_review_branch_global_sync_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch389-review-branch-global-sync-report-v1.md'), 'utf8');

assert.equal(result.complete_count, 42);
assert.equal(result.blocked_count, 8);
assert.equal(result.index_safe_count, 42);
assert.deepEqual(result.incorrectly_index_safe_states, []);

assert.equal(audit.classifications.COMPLETE, 42);
assert.equal(audit.classifications.BLOCKED, 8);
assert.equal(audit.indexSafeCount, 42);
assert.deepEqual(audit.incorrectlyIndexSafeStates, []);

for (const [stateId, batch] of [
  ['north-dakota', 'batch383_north_dakota_official_routing_completion_v1'],
  ['rhode-island', 'batch382_rhode_island_official_routing_completion_v1'],
  ['vermont', 'batch386_vermont_ahs_field_services_completion_v1'],
  ['wyoming', 'batch385_wyoming_official_routing_completion_v1'],
]) {
  const row = audit.states.find((entry) => entry.stateId === stateId);
  assert.equal(row.classification, 'COMPLETE');
  assert.equal(row.indexSafe, true);
  assert.equal(row.packetBatch, batch);
  assert.equal(row.packetPrimaryGapReason, 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence');
}

for (const stateId of ['north-dakota', 'rhode-island', 'vermont', 'wyoming']) {
  const queueRow = queueRows.find((row) => row.state === stateId);
  assert.equal(queueRow.classification, 'COMPLETE');
  assert.equal(queueRow.index_safe, true);
  assert.equal(queueRow.recommended_batch, 'complete_maintain');
  assert.equal(queueRow.repair_lane, 'maintain_truth_only');
}

assert.match(allStateReport, /- COMPLETE: 42/);
assert.match(allStateReport, /- BLOCKED: 8/);
assert.match(allStateReport, /complete states: .*North Dakota/);
assert.match(allStateReport, /complete states: .*Rhode Island/);
assert.match(allStateReport, /complete states: .*Vermont/);
assert.match(allStateReport, /complete states: .*Wyoming/);
assert.doesNotMatch(allStateReport, /blocked states: .*North Dakota/);
assert.doesNotMatch(allStateReport, /blocked states: .*Rhode Island/);
assert.doesNotMatch(allStateReport, /blocked states: .*Vermont/);
assert.doesNotMatch(allStateReport, /blocked states: .*Wyoming/);

assert.match(handoff, /North Dakota/);
assert.match(handoff, /Rhode Island/);
assert.match(handoff, /Vermont/);
assert.match(handoff, /Wyoming/);
assert.doesNotMatch(handoff, /- North Dakota: `generic_or_statewide_evidence_used_where_local_required`/);
assert.doesNotMatch(handoff, /- Rhode Island: `generic_or_statewide_evidence_used_where_local_required`/);
assert.doesNotMatch(handoff, /- Vermont: `official_ahs_district_jurisdiction_codes_are_public_but_no_reviewable_public_ahs_office_crosswalk_or_service_area_contract_exists`/);
assert.doesNotMatch(handoff, /- Wyoming: `legacy_or_inventory_only_evidence`/);

assert.equal(batchSummary.complete_count, 42);
assert.equal(batchSummary.blocked_count, 8);
assert.equal(batchSummary.index_safe_count, 42);
assert.deepEqual(batchSummary.incorrectly_index_safe_states, []);
assert.match(batchReport, /Synced the reviewed North Dakota, Rhode Island, Vermont, and Wyoming completion packets/);

console.log('test-batch389-review-branch-global-sync-v1: ok');
