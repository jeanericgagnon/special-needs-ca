import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch353NewMexicoEducationHostFinalityV1 } from './run-batch353-new-mexico-education-host-finality-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

const result = generateBatch353NewMexicoEducationHostFinalityV1();
const summary = readJson('data/generated/new-mexico_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/new-mexico_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/new-mexico_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/new-mexico_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/new-mexico_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const packet = readJson('data/generated/new-mexico_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const batchSummary = readJson('data/generated/batch353_new_mexico_education_host_finality_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/new-mexico-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.batch, 'batch353_new_mexico_education_host_finality_v1');
assert.equal(summary.primary_gap_reason, 'current_ped_host_timeouts_plus_dead_legacy_education_host_leave_zero_local_education_leaves_and_hca_four_county_remainder_persists');

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduGap.family_status, 'blocked_exact_district_or_county_leafs_unverified');
assert.match(eduGap.status_reason, /education\.new-mexico\.gov/i);
assert.match(eduGap.status_reason, /fail DNS resolution/i);
assert.match(eduGap.status_reason, /timed out after 25 seconds/i);
assert.match(eduGap.status_reason, /timed out after 15 seconds/i);

const eduFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduFailure.failure_code, 'current_ped_host_timeouts_and_legacy_education_host_unresolvable_without_local_leafs');
assert.match(eduFailure.evidence, /zero district-owned, county-grade, or regional local education leaves on disk/i);

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduVerified.sample_count, 5);
assert.equal(eduVerified.samples[3].source_type, 'legacy_official_host_dns_failure');
assert.match(eduVerified.samples[3].evidence_snippet, /unresolvable/i);
assert.match(eduVerified.samples[4].evidence_snippet, /zero district-owned/i);

const eduNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduNext.next_action, 'author_county_or_district_exact_targets');
assert.equal(eduNext.failure_code, 'current_ped_host_timeouts_and_legacy_education_host_unresolvable_without_local_leafs');

const queueRow = queueRows.find((row) => row.state === 'new-mexico');
assert.equal(queueRow.primary_gap_reason, 'current_ped_host_timeouts_plus_dead_legacy_education_host_leave_zero_local_education_leaves_and_hca_four_county_remainder_persists');

assert.equal(packet.current_metrics.legacyEducationHostUnresolvable, true);
assert.equal(packet.current_metrics.currentPedSearchTimedOut15s, true);
assert.equal(packet.bounded_live_probe_result.outcome, 'current_host_timeouts_plus_legacy_host_dns_failures');

const allStateNm = allStateAudit.states.find((row) => row.stateId === 'new-mexico');
assert.equal(allStateNm.packetBatch, 'batch353_new_mexico_education_host_finality_v1');
assert.equal(allStateNm.packetPrimaryGapReason, 'current_ped_host_timeouts_plus_dead_legacy_education_host_leave_zero_local_education_leaves_and_hca_four_county_remainder_persists');

assert.equal(batchSummary.legacy_education_host_unresolvable, true);
assert.equal(batchSummary.current_ped_search_timed_out_15s, true);
assert.equal(batchSummary.district_owned_leaves_on_disk, 0);

assert.ok(report.includes('legacy `education.new-mexico.gov` host family is now explicitly retired'));
assert.ok(allStateReport.includes('New Mexico remains blocked because both official state-host education families now fail closed'));
assert.ok(handoff.includes('## Current Focus State: New Mexico'));
assert.ok(handoff.includes('education.new-mexico.gov'));
assert.ok(lessons.includes('### Retire Dead Legacy State Hosts Once The Current Replacement Also Fails Closed'));

console.log('test-batch353-new-mexico-education-host-finality-v1: ok');
