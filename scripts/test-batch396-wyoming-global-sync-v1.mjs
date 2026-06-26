import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch396WyomingGlobalSyncV1 } from './run-batch396-wyoming-global-sync-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  const raw = fs.readFileSync(path.join(repoRoot, relativePath), 'utf8').trim();
  return raw ? raw.split('\n').map((line) => JSON.parse(line)) : [];
}

const result = generateBatch396WyomingGlobalSyncV1();
assert.equal(result.complete_count, 43);
assert.equal(result.blocked_count, 7);
assert.equal(result.index_safe_count, 43);
assert.deepEqual(result.incorrectly_index_safe_states, []);

const audit = readJson('data/generated/all_state_california_grade_audit_v3.json');
assert.equal(audit.classifications.COMPLETE, 43);
assert.equal(audit.classifications.BLOCKED, 7);
assert.equal(audit.indexSafeCount, 43);
assert.deepEqual(audit.incorrectlyIndexSafeStates, []);

const wy = audit.states.find((row) => row.stateId === 'wyoming');
assert.equal(wy.classification, 'COMPLETE');
assert.equal(wy.indexSafe, true);
assert.equal(wy.completenessPct, 100);
assert.equal(wy.packetBatch, 'batch395_wyoming_wde_special_ed_directory_completion_v1');
assert.equal(wy.packetPrimaryGapReason, 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence');
assert.equal(wy.packetRecommendedBatch, 'complete_maintain');
assert.equal(wy.familyStatuses.district_or_county_education_routing, 'verified_county_grade');

const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const wyQueue = queueRows.find((row) => row.state === 'wyoming');
assert.equal(wyQueue.classification, 'COMPLETE');
assert.equal(wyQueue.index_safe, true);
assert.equal(wyQueue.completeness_pct, 100);
assert.equal(wyQueue.recommended_batch, 'complete_maintain');
assert.equal(wyQueue.repair_lane, 'maintain_truth_only');

const verifiedRows = readJsonl('data/generated/wyoming_verified_sources_v1.jsonl');
const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationVerified.sample_count, 23);
assert.match(educationVerified.query_basis, /all 23 counties/i);
assert.match(JSON.stringify(educationVerified.samples), /Special Education Director/);

const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
assert.match(allStateReport, /- COMPLETE: 43/);
assert.match(allStateReport, /- BLOCKED: 7/);
assert.match(allStateReport, /complete states: .*Wyoming/);
assert.doesNotMatch(allStateReport, /blocked states: .*Wyoming/);
assert.match(allStateReport, /Wyoming is now COMPLETE\/index-safe/);

const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
assert.match(handoff, /## Current Complete States/);
assert.match(handoff, /Wyoming/);
assert.doesNotMatch(handoff, /- Wyoming: `/);
assert.doesNotMatch(handoff, /- Rhode Island: `generic_or_statewide_evidence_used_where_local_required`/);
assert.doesNotMatch(handoff, /- Massachusetts: `official_dese_export_plus_census_county_subdivision_crosswalk_clears_education_and_reviewed_dds_locality_capture_covers_13_of_14_counties_but_suffolk_remains_unresolved`/);

const batchSummary = readJson('data/generated/batch396_wyoming_global_sync_summary_v1.json');
assert.equal(batchSummary.complete_count, 43);
assert.equal(batchSummary.blocked_count, 7);
assert.equal(batchSummary.index_safe_count, 43);
assert.deepEqual(batchSummary.incorrectly_index_safe_states, []);

const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch396-wyoming-global-sync-report-v1.md'), 'utf8');
assert.match(batchReport, /Integrated the reviewed Wyoming completion/);

console.log('test-batch396-wyoming-global-sync-v1: ok');
