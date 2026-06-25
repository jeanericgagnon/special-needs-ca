import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch347KansasReviewedDistrictNonmatchFreezeV1 } from './run-batch347-kansas-reviewed-district-nonmatch-freeze-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, filePath), 'utf8'));
}

function readJsonl(filePath) {
  return fs.readFileSync(path.join(repoRoot, filePath), 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

const result = generateBatch347KansasReviewedDistrictNonmatchFreezeV1();
const summary = readJson('data/generated/kansas_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/kansas_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/kansas_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/kansas_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/kansas_next_action_queue_v2.jsonl');
const packet = readJson('data/generated/kansas_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/kansas-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const batchSummary = readJson('data/generated/batch347_kansas_reviewed_district_nonmatch_freeze_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch347-kansas-reviewed-district-nonmatch-freeze-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 93);
assert.equal(summary.batch, 'batch347_kansas_reviewed_district_nonmatch_freeze_v1');
assert.equal(summary.primary_gap_reason, 'current_ksde_directory_roots_and_pdf_url_return_request_rejected_shells_and_exact_submit_replay_is_rejected_while_reviewed_local_district_leaves_cover_only_30_counties');
assert.match(summary.final_blockers[0].evidence, /Chase County USD 284/);
assert.match(summary.final_blockers[0].evidence, /Woodson USD 366/);
assert.match(summary.final_blockers[0].evidence, /Chanute USD 413/);

const gapRow = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(gapRow);
assert.equal(gapRow.family_status, 'blocked_reviewed_local_kansas_district_leaves_expand_to_30_counties_but_current_live_ksde_submit_replay_is_rejected');
assert.match(gapRow.status_reason, /Chase County USD 284/);
assert.match(gapRow.status_reason, /Woodson USD 366/);
assert.match(gapRow.status_reason, /Blue Comets Connect/);

const failure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(failure);
assert.equal(failure.failure_code, summary.primary_gap_reason);
assert.match(failure.evidence, /explicit 404 pages/);
assert.match(failure.evidence, /false-positive class/);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(verified);
assert.equal(verified.blocker_code, summary.primary_gap_reason);
assert.match(verified.blocker_evidence, /Chase County USD 284/);
assert.match(verified.blocker_evidence, /Woodson USD 366/);
assert.match(verified.blocker_evidence, /Chanute USD 413/);

const next = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(next);
assert.equal(next.next_action, 'continue_only_from_saved_district_owned_and_district_linked_local_leads_because_current_live_ksde_state_export_lane_is_not_reproducible');
assert.match(next.evidence, /generic app shell/);

assert.equal(packet.current_problem_metrics.authoredExactLeafCount, 30);
assert.equal(packet.current_problem_metrics.reviewedDistrictOwnedLeafCount, 30);
assert.match(packet.packet_complete_when, /false-positive app shell/);

const queue = queueRows.find((row) => row.state === 'kansas');
assert.ok(queue);
assert.equal(queue.primary_gap_reason, summary.primary_gap_reason);

const stateAudit = allStateAudit.states.find((row) => row.stateId === 'kansas');
assert.ok(stateAudit);
assert.equal(stateAudit.packetBatch, 'batch347_kansas_reviewed_district_nonmatch_freeze_v1');
assert.equal(stateAudit.packetPrimaryGapReason, summary.primary_gap_reason);

assert.equal(batchSummary.chase_sitemap_status, 200);
assert.equal(batchSummary.chase_special_slug_status, 404);
assert.equal(batchSummary.woodson_sitemap_status, 200);
assert.equal(batchSummary.woodson_special_slug_status, 404);
assert.equal(batchSummary.chanute_special_slug_status, 200);
assert.equal(batchSummary.chanute_special_slug_title, 'Blue Comets Connect');

assert.match(report, /Chase County USD 284 now freezes/);
assert.match(report, /Woodson USD 366 now freezes/);
assert.match(report, /Chanute USD 413 now freezes/);
assert.match(handoff, /## Current Focus State: Kansas/);
assert.match(handoff, /Chase County USD 284/);
assert.match(handoff, /Woodson USD 366/);
assert.match(handoff, /Chanute USD 413/);
assert.match(allStateReport, /false-positive district app shell/);
assert.match(lessons, /App Shell 200s And Sitemap-Backed 404s Still Fail Closed/);
assert.match(batchReport, /No new Kansas county clears in this pass/);

console.log('test-batch347-kansas-reviewed-district-nonmatch-freeze-v1: ok');
