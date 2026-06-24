import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { generateBatch326KansasSubmitReplayFinalityV1 } from './run-batch326-kansas-submit-replay-finality-v1.mjs';

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

const result = generateBatch326KansasSubmitReplayFinalityV1();
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
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const batchSummary = readJson('data/generated/batch326_kansas_submit_replay_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch326-kansas-submit-replay-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'current_ksde_directory_roots_and_pdf_url_return_request_rejected_shells_and_exact_submit_replay_is_rejected_while_reviewed_local_district_leaves_cover_only_18_counties');

assert.equal(packet.current_problem_metrics.reviewedDistrictOwnedLeafCount, 18);
assert.equal(packet.current_problem_metrics.authoredExactLeafCount, 18);
assert.equal(packet.current_problem_metrics.publicExportContractVerified, false);
assert.equal(packet.current_problem_metrics.liveDirectoryRoots, 0);

assert.equal(leaves.length, 18);
assert.ok(packet.reviewed_local_leaf_counties.includes('doniphan-ks'));
assert.ok(packet.reviewed_local_leaf_counties.includes('nemaha-ks'));
assert.ok(packet.unresolved_local_leaf_counties.includes('allen-ks'));

assert.equal(gap.family_status, 'blocked_reviewed_local_kansas_district_leaves_expand_to_18_counties_but_current_live_ksde_submit_replay_is_rejected');
assert.match(gap.status_reason, /Request Rejected/);
assert.match(gap.status_reason, /18 counties/);

assert.equal(failure.failure_code, summary.primary_gap_reason);
assert.match(failure.evidence, /ddDistricts=D0435/);
assert.match(failure.evidence, /18\/105 counties/);
assert.match(failure.evidence, /Request Rejected/);

assert.equal(verified.family_status, gap.family_status);
assert.equal(verified.blocker_code, summary.primary_gap_reason);
assert.equal(verified.sample_count, 22);
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Exact district-scoped Directory Reports submit replay rejected'));
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://www.usd111.org/o/dwes/page/special-education/'));
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://www.usd115.org/o/mnesc/page/early-childhood/'));

assert.equal(next.next_action, 'continue_only_from_saved_district_owned_and_district_linked_local_leads_because_current_live_ksde_state_export_lane_is_not_reproducible');
assert.match(next.evidence, /Request Rejected/);

assert.equal(queue.primary_gap_reason, summary.primary_gap_reason);

const kansasAudit = audit.states.find((row) => row.stateId === 'kansas');
assert.ok(kansasAudit);
assert.equal(kansasAudit.packetBatch, 'batch326_kansas_submit_replay_finality_v1');
assert.equal(kansasAudit.packetPrimaryGapReason, summary.primary_gap_reason);

assert.match(handoff, /## Current Focus State: Kansas/);
assert.match(handoff, /current Kansas educational-directory PDF URL now each return HTTP 200 only as the same `Request Rejected` shell/i);
assert.match(lessons, /### Recovered State Roots Still Fail Closed If The Exact Public Submit Replay Reverts To Request Rejected/);
assert.match(allStateReport, /Kansas now has a stricter live state-root stop signal again/i);

assert.equal(batchSummary.reviewed_leaf_count, 18);
assert.equal(batchSummary.rejected_root_title, 'Request Rejected');
assert.match(batchReport, /exact district-scoped submit replay/i);

const completeCount = audit.states.filter((row) => row.classification === 'COMPLETE').length;
const blockedCount = audit.states.filter((row) => row.classification === 'BLOCKED').length;
assert.equal(completeCount, 26);
assert.equal(blockedCount, 24);

console.log('test-batch326-kansas-submit-replay-finality-v1: ok');
