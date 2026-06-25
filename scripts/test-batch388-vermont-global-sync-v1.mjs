import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch388VermontGlobalSyncV1 } from './run-batch388-vermont-global-sync-v1.mjs';

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

const result = generateBatch388VermontGlobalSyncV1();
const audit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const batchSummary = readJson('data/generated/batch388_vermont_global_sync_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch388-vermont-global-sync-report-v1.md'), 'utf8');

assert.equal(result.complete_count, 40);
assert.equal(result.blocked_count, 10);
assert.equal(result.index_safe_count, 40);
assert.deepEqual(result.incorrectly_index_safe_states, []);

assert.equal(audit.classifications.COMPLETE, 40);
assert.equal(audit.classifications.BLOCKED, 10);
assert.equal(audit.indexSafeCount, 40);
assert.deepEqual(audit.incorrectlyIndexSafeStates, []);

const vt = audit.states.find((row) => row.stateId === 'vermont');
assert.equal(vt.classification, 'COMPLETE');
assert.equal(vt.indexSafe, true);
assert.equal(vt.packetPrimaryGapReason, 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence');
assert.equal(vt.packetRecommendedBatch, 'complete_maintain');
assert.equal(vt.familyStatuses.county_local_disability_resources, 'verified_state_grade');
assert.equal(vt.familyStatuses.district_or_county_education_routing, 'verified_state_grade');

const queueRow = queueRows.find((row) => row.state === 'vermont');
assert.equal(queueRow.classification, 'COMPLETE');
assert.equal(queueRow.index_safe, true);
assert.equal(queueRow.recommended_batch, 'complete_maintain');
assert.equal(queueRow.repair_lane, 'maintain_truth_only');

assert.match(allStateReport, /- COMPLETE: 40/);
assert.match(allStateReport, /- BLOCKED: 10/);
assert.match(allStateReport, /complete states: .*Vermont/);
assert.doesNotMatch(allStateReport, /blocked states: .*Vermont/);
assert.match(allStateReport, /Vermont is now COMPLETE\/index-safe/);
assert.doesNotMatch(allStateReport, /Vermont remains blocked/);

assert.match(handoff, /Vermont/);
assert.doesNotMatch(handoff, /- Vermont: `official_statewide_pages_and_school_directories_remain_live_but_no_current_first_party_county_or_local_service_area_crosswalk_was_found`/);

assert.equal(batchSummary.complete_count, 40);
assert.equal(batchSummary.blocked_count, 10);
assert.equal(batchSummary.index_safe_count, 40);
assert.deepEqual(batchSummary.incorrectly_index_safe_states, []);
assert.match(batchReport, /Integrated the reviewed Vermont completion into the global audit/);

console.log('test-batch388-vermont-global-sync-v1: ok');
