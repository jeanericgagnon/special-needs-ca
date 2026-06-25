import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch387NorthDakotaGlobalSyncV1 } from './run-batch387-north-dakota-global-sync-v1.mjs';

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

const result = generateBatch387NorthDakotaGlobalSyncV1();
const audit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const batchSummary = readJson('data/generated/batch387_north_dakota_global_sync_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch387-north-dakota-global-sync-report-v1.md'), 'utf8');

assert.equal(result.complete_count, 39);
assert.equal(result.blocked_count, 11);
assert.equal(result.index_safe_count, 39);
assert.deepEqual(result.incorrectly_index_safe_states, []);

assert.equal(audit.classifications.COMPLETE, 39);
assert.equal(audit.classifications.BLOCKED, 11);
assert.equal(audit.indexSafeCount, 39);
assert.deepEqual(audit.incorrectlyIndexSafeStates, []);

const nd = audit.states.find((row) => row.stateId === 'north-dakota');
assert.equal(nd.classification, 'COMPLETE');
assert.equal(nd.indexSafe, true);
assert.equal(nd.packetPrimaryGapReason, 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence');
assert.equal(nd.packetRecommendedBatch, 'complete_maintain');
assert.equal(nd.familyStatuses.county_local_disability_resources, 'verified_state_grade');
assert.equal(nd.familyStatuses.district_or_county_education_routing, 'verified_state_grade');

const queueRow = queueRows.find((row) => row.state === 'north-dakota');
assert.equal(queueRow.classification, 'COMPLETE');
assert.equal(queueRow.index_safe, true);
assert.equal(queueRow.recommended_batch, 'complete_maintain');
assert.equal(queueRow.repair_lane, 'maintain_truth_only');

assert.match(allStateReport, /- COMPLETE: 39/);
assert.match(allStateReport, /- BLOCKED: 11/);
assert.match(allStateReport, /complete states: .*North Dakota/);
assert.doesNotMatch(allStateReport, /blocked states: .*North Dakota/);
assert.match(allStateReport, /North Dakota is now COMPLETE\/index-safe/);
assert.doesNotMatch(allStateReport, /North Dakota remains blocked/);

assert.match(handoff, /North Dakota/);
assert.doesNotMatch(handoff, /- North Dakota: `public_dpi_surfaces_expose_statewide_special_education_and_district_inventory_but_zero_public_county_or_district_special_education_routing_contract`/);

assert.equal(batchSummary.complete_count, 39);
assert.equal(batchSummary.blocked_count, 11);
assert.equal(batchSummary.index_safe_count, 39);
assert.deepEqual(batchSummary.incorrectly_index_safe_states, []);
assert.match(batchReport, /Integrated the reviewed North Dakota completion into the global audit/);

console.log('test-batch387-north-dakota-global-sync-v1: ok');
