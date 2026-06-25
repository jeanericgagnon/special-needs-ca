import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch382VirginiaGlobalSyncV1 } from './run-batch382-virginia-global-sync-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

const result = generateBatch382VirginiaGlobalSyncV1();
const audit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const batchSummary = readJson('data/generated/batch382_virginia_global_sync_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch382-virginia-global-sync-report-v1.md'), 'utf8');

assert.equal(result.complete_count, 38);
assert.equal(result.blocked_count, 12);
assert.equal(result.index_safe_count, 38);
assert.deepEqual(result.incorrectly_index_safe_states, []);

const va = audit.states.find((row) => row.stateId === 'virginia');
assert.equal(va.classification, 'COMPLETE');
assert.equal(va.indexSafe, true);
assert.equal(va.packetBatch, 'batch374_virginia_independent_reaudit_v1');
assert.equal(va.packetPrimaryGapReason, 'all_critical_families_independently_reaudited_with_live_official_or_browser_reviewed_official_evidence');
assert.equal(va.packetRecommendedBatch, 'complete_maintain');

assert.match(handoff, /Current Focus State: New Hampshire/);

assert.equal(batchSummary.complete_count, 38);
assert.equal(batchSummary.blocked_count, 12);
assert.equal(batchSummary.index_safe_count, 38);
assert.deepEqual(batchSummary.incorrectly_index_safe_states, []);
assert.match(batchReport, /Synced Virginia’s independent re-audit packet metadata into the global audit/);

console.log('test-batch382-virginia-global-sync-v1: ok');
