import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch341KansasBourbonFortScottLeafV1 } from './run-batch341-kansas-bourbon-fort-scott-leaf-v1.mjs';

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

const result = generateBatch341KansasBourbonFortScottLeafV1();
const summary = readJson('data/generated/kansas_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/kansas_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/kansas_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/kansas_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/kansas_next_action_queue_v2.jsonl');
const packet = readJson('data/generated/kansas_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const leaves = readJsonl('data/generated/kansas_reviewed_district_owned_special_education_leaves_v1.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const batchSummary = readJson('data/generated/batch341_kansas_bourbon_fort_scott_leaf_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/kansas-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch341-kansas-bourbon-fort-scott-leaf-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 93);
assert.equal(summary.primary_gap_reason, 'current_ksde_directory_roots_and_pdf_url_return_request_rejected_shells_and_exact_submit_replay_is_rejected_while_reviewed_local_district_leaves_cover_only_28_counties');

const gapRow = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(gapRow);
assert.equal(gapRow.family_status, 'blocked_reviewed_local_kansas_district_leaves_expand_to_28_counties_but_current_live_ksde_submit_replay_is_rejected');
assert.match(gapRow.status_reason, /28 counties/i);

const failure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(failure);
assert.equal(failure.failure_code, summary.primary_gap_reason);
assert.match(failure.evidence, /Fort Scott USD 234/i);
assert.match(failure.evidence, /Bourbon now clears/i);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(verified);
assert.equal(verified.blocker_code, summary.primary_gap_reason);
assert.ok(verified.samples.some((sample) => sample.sample_name === 'bourbon district leaf'));
assert.equal(verified.sample_count, 32);

const next = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(next);
assert.equal(next.next_action, 'continue_only_from_saved_district_owned_and_district_linked_local_leads_because_current_live_ksde_state_export_lane_is_not_reproducible');
assert.match(next.evidence, /Bourbon now clears/i);

assert.ok(packet.reviewed_local_leaf_counties.includes('bourbon-ks'));
assert.ok(!packet.unresolved_local_leaf_counties.includes('bourbon-ks'));
assert.equal(packet.current_problem_metrics.authoredExactLeafCount, 28);
assert.equal(packet.current_problem_metrics.reviewedDistrictOwnedLeafCount, 28);

const bourbonLeaf = leaves.find((row) => row.county_id === 'bourbon-ks');
assert.ok(bourbonLeaf);
assert.equal(bourbonLeaf.source_url, 'https://www.usd234.org/page/special-education/');
assert.equal(bourbonLeaf.source_type, 'district_owned_special_education_leaf');

const queue = queueRows.find((row) => row.state === 'kansas');
assert.ok(queue);
assert.equal(queue.primary_gap_reason, summary.primary_gap_reason);

const stateAudit = allStateAudit.states.find((row) => row.stateId === 'kansas');
assert.ok(stateAudit);
assert.equal(stateAudit.packetBatch, 'batch341_kansas_bourbon_fort_scott_leaf_v1');
assert.equal(stateAudit.packetPrimaryGapReason, summary.primary_gap_reason);
assert.equal(stateAudit.familyStatuses.district_or_county_education_routing, 'blocked_reviewed_local_kansas_district_leaves_expand_to_28_counties_but_current_live_ksde_submit_replay_is_rejected');

assert.equal(batchSummary.promoted_county, 'bourbon-ks');
assert.equal(batchSummary.promoted_counties_total, 28);
assert.equal(batchSummary.district_root_status, 200);
assert.equal(batchSummary.district_leaf_status, 200);
assert.equal(batchSummary.district_leaf_title, 'Special Education | FORT SCOTT USD 234');

assert.match(report, /Bourbon now clears/i);
assert.match(handoff, /## Current Focus State: Kansas/);
assert.match(handoff, /Fort Scott USD 234/);
assert.match(handoff, /28\/105 counties/i);
assert.match(allStateReport, /28 of 105 counties/i);
assert.match(batchReport, /Fort Scott USD 234 `Special Education` leaf/i);

console.log('test-batch341-kansas-bourbon-fort-scott-leaf-v1: ok');
