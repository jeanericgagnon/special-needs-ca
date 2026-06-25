import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch335KansasLabetteTricountyLeafV1 } from './run-batch335-kansas-labette-tricounty-leaf-v1.mjs';

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

const result = generateBatch335KansasLabetteTricountyLeafV1();
const summary = readJson('data/generated/kansas_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/kansas_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/kansas_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/kansas_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/kansas_next_action_queue_v2.jsonl');
const packet = readJson('data/generated/kansas_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const leaves = readJsonl('data/generated/kansas_reviewed_district_owned_special_education_leaves_v1.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const batchSummary = readJson('data/generated/batch335_kansas_labette_tricounty_leaf_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/kansas-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch335-kansas-labette-tricounty-leaf-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'current_ksde_directory_roots_and_pdf_url_return_request_rejected_shells_and_exact_submit_replay_is_rejected_while_reviewed_local_district_leaves_cover_only_24_counties');

const gapRow = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(gapRow);
assert.equal(gapRow.family_status, 'blocked_reviewed_local_kansas_district_leaves_expand_to_24_counties_but_current_live_ksde_submit_replay_is_rejected');
assert.match(gapRow.status_reason, /24 counties/i);

const failure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(failure);
assert.equal(failure.failure_code, summary.primary_gap_reason);
assert.match(failure.evidence, /Parsons District Schools USD 503/i);
assert.match(failure.evidence, /Tri-County Special Education Cooperative \| Parsons District Schools/i);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(verified);
assert.equal(verified.blocker_code, summary.primary_gap_reason);
assert.ok(verified.samples.some((sample) => sample.sample_name === 'labette district leaf'));
assert.equal(verified.sample_count, 28);

const next = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(next);
assert.equal(next.next_action, 'continue_only_from_saved_district_owned_and_district_linked_local_leads_because_current_live_ksde_state_export_lane_is_not_reproducible');
assert.match(next.evidence, /Labette now clears/i);

assert.ok(packet.reviewed_local_leaf_counties.includes('labette-ks'));
assert.ok(!packet.unresolved_local_leaf_counties.includes('labette-ks'));
assert.equal(packet.current_problem_metrics.authoredExactLeafCount, 24);
assert.equal(packet.current_problem_metrics.reviewedDistrictOwnedLeafCount, 24);

const labetteLeaf = leaves.find((row) => row.county_id === 'labette-ks');
assert.ok(labetteLeaf);
assert.equal(labetteLeaf.source_url, 'https://www.usd503.org/page/tri-county-special-education-cooperative/');
assert.equal(labetteLeaf.source_type, 'district_owned_special_education_cooperative_leaf');

const queue = queueRows.find((row) => row.state === 'kansas');
assert.ok(queue);
assert.equal(queue.primary_gap_reason, summary.primary_gap_reason);

const stateAudit = allStateAudit.states.find((row) => row.stateId === 'kansas');
assert.ok(stateAudit);
assert.equal(stateAudit.packetBatch, 'batch335_kansas_labette_tricounty_leaf_v1');
assert.equal(stateAudit.packetPrimaryGapReason, summary.primary_gap_reason);

assert.equal(batchSummary.promoted_county, 'labette-ks');
assert.equal(batchSummary.promoted_counties_total, 24);
assert.equal(batchSummary.district_sitemap_status, 200);
assert.equal(batchSummary.district_leaf_status, 200);
assert.equal(batchSummary.district_leaf_title, 'Tri-County Special Education Cooperative | Parsons District Schools');
assert.equal(batchSummary.district_leaf_h1, 'Tri-County Special Education');

assert.match(report, /Labette now clears/i);
assert.match(handoff, /## Current Focus State: Kansas/);
assert.match(handoff, /Parsons District Schools USD 503/);
assert.match(lessons, /### District Sitemaps Can Surface Exact Cooperative Leaves Even When State Export Roots Stay Rejected/);
assert.match(allStateReport, /24 of 105 counties/i);
assert.match(batchReport, /Tri-County Special Education Cooperative \| Parsons District Schools/i);

console.log('test-batch335-kansas-labette-tricounty-leaf-v1: ok');
