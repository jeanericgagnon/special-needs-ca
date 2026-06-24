import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { generateBatch329KansasBartonRenoLeavesV1 } from './run-batch329-kansas-barton-reno-leaves-v1.mjs';

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

const result = generateBatch329KansasBartonRenoLeavesV1();
const summary = readJson('data/generated/kansas_california_grade_summary_v2.json');
const gap = readJsonl('data/generated/kansas_gap_matrix_v2.jsonl').find((row) => row.family === 'district_or_county_education_routing');
const failure = readJsonl('data/generated/kansas_failure_ledger_v2.jsonl').find((row) => row.family === 'district_or_county_education_routing');
const verified = readJsonl('data/generated/kansas_verified_sources_v1.jsonl').find((row) => row.family === 'district_or_county_education_routing');
const next = readJsonl('data/generated/kansas_next_action_queue_v2.jsonl').find((row) => row.family === 'district_or_county_education_routing');
const packet = readJson('data/generated/kansas_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const leaves = readJsonl('data/generated/kansas_reviewed_district_owned_special_education_leaves_v1.jsonl');
const queue = readJsonl('data/generated/all_state_priority_queue_v3.jsonl').find((row) => row.state === 'kansas');
const audit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const batchSummary = readJson('data/generated/batch329_kansas_barton_reno_leaves_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch329-kansas-barton-reno-leaves-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'current_ksde_directory_roots_and_pdf_url_return_request_rejected_shells_and_exact_submit_replay_is_rejected_while_reviewed_local_district_leaves_cover_only_20_counties');

assert.equal(packet.current_problem_metrics.reviewedDistrictOwnedLeafCount, 20);
assert.equal(packet.current_problem_metrics.authoredExactLeafCount, 20);
assert.equal(packet.current_problem_metrics.publicExportContractVerified, false);
assert.equal(packet.current_problem_metrics.liveDirectoryRoots, 0);

assert.equal(leaves.length, 20);
assert.ok(leaves.some((row) => row.county_id === 'barton-ks' && row.source_url === 'https://sites.google.com/usd428.net/bartoncountyss/child-find'));
assert.ok(leaves.some((row) => row.county_id === 'reno-ks' && row.source_url === 'https://www.usd308.com/documents/resources/parent-resources/special-education/parental-rights/173274'));
assert.ok(packet.reviewed_local_leaf_counties.includes('barton-ks'));
assert.ok(packet.reviewed_local_leaf_counties.includes('reno-ks'));
assert.ok(!packet.unresolved_local_leaf_counties.includes('barton-ks'));
assert.ok(!packet.unresolved_local_leaf_counties.includes('reno-ks'));

assert.equal(gap.family_status, 'blocked_reviewed_local_kansas_district_leaves_expand_to_20_counties_but_current_live_ksde_submit_replay_is_rejected');
assert.match(gap.status_reason, /20 counties/);
assert.match(gap.status_reason, /Request Rejected/);

assert.equal(failure.failure_code, summary.primary_gap_reason);
assert.match(failure.evidence, /20\/105 counties/);
assert.match(failure.evidence, /Barton/);
assert.match(failure.evidence, /Reno/);

assert.equal(verified.family_status, gap.family_status);
assert.equal(verified.blocker_code, summary.primary_gap_reason);
assert.equal(verified.sample_count, 24);
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://sites.google.com/usd428.net/bartoncountyss/child-find'));
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://www.usd308.com/documents/resources/parent-resources/special-education/parental-rights/173274'));

assert.equal(next.next_action, 'continue_only_from_saved_district_owned_and_district_linked_local_leads_because_current_live_ksde_state_export_lane_is_not_reproducible');
assert.match(next.evidence, /20\/105 counties/);

assert.equal(queue.primary_gap_reason, summary.primary_gap_reason);

const kansasAudit = audit.states.find((row) => row.stateId === 'kansas');
assert.ok(kansasAudit);
assert.equal(kansasAudit.packetBatch, 'batch329_kansas_barton_reno_leaves_v1');
assert.equal(kansasAudit.packetPrimaryGapReason, summary.primary_gap_reason);
assert.equal(kansasAudit.familyStatuses.district_or_county_education_routing, gap.family_status);

assert.match(handoff, /20\/105 counties/);
assert.match(handoff, /Great Bend USD 428 BCSS Child Find/);
assert.match(handoff, /Hutchinson Public Schools Special Education \/ Parental Rights folder/);
assert.match(allStateReport, /reviewed local district leaves now cover 20 counties/i);

assert.equal(batchSummary.reviewed_leaf_count, 20);
assert.deepEqual(batchSummary.new_counties, ['barton-ks', 'reno-ks']);
assert.match(batchReport, /Barton now clears/);
assert.match(batchReport, /Reno now clears/);

const completeCount = audit.states.filter((row) => row.classification === 'COMPLETE').length;
const blockedCount = audit.states.filter((row) => row.classification === 'BLOCKED').length;
assert.equal(completeCount, 26);
assert.equal(blockedCount, 24);

console.log('test-batch329-kansas-barton-reno-leaves-v1: ok');
