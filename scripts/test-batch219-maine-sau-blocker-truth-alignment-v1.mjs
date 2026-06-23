import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch219MaineSauBlockerTruthAlignmentV1 } from './run-batch219-maine-sau-blocker-truth-alignment-v1.mjs';

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

const result = generateBatch219MaineSauBlockerTruthAlignmentV1();
const summary = readJson('data/generated/maine_california_grade_summary_v2.json');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const gapRows = readJsonl('data/generated/maine_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/maine_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/maine_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/maine_next_action_queue_v2.jsonl');
const packet = readJson('data/generated/maine_district_or_county_education_routing_manual_export_packet_v1.json');
const batchSummary = readJson('data/generated/batch219_maine_sau_blocker_truth_alignment_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/maine-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.primary_gap_reason, 'public_maine_sau_selectors_and_workbook_are_live_but_raw_export_replay_still_500_and_dhhs_office_html_has_no_county_contract');
assert.equal(summary.familyStatuses.district_or_county_education_routing, 'blocked_live_public_sau_selectors_and_workbook_but_raw_export_replay_still_500');
assert.equal(queueRows.find((row) => row.state === 'maine').primary_gap_reason, 'public_maine_sau_selectors_and_workbook_are_live_but_raw_export_replay_still_500_and_dhhs_office_html_has_no_county_contract');

const gap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(gap.family_status, 'blocked_live_public_sau_selectors_and_workbook_but_raw_export_replay_still_500');
assert.match(gap.status_reason, /Town selector is public/i);
assert.match(gap.status_reason, /HTTP 500/i);

const failure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(failure.failure_code, 'public_maine_sau_selectors_are_live_but_raw_export_replay_still_500_and_county_grade_contacts_remain_unmaterialized');
assert.match(failure.evidence, /OrgIds such as `42` for Bangor Public Schools/i);
assert.match(failure.evidence, /HTTP 500 or shell-only HTML/i);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(verified.family_status, 'blocked_live_public_sau_selectors_and_workbook_but_raw_export_replay_still_500');
assert.equal(verified.sample_count, 4);
assert.ok(verified.samples.some((sample) => /raw replay.*HTTP 500/i.test(sample.evidence_snippet)));

const next = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(next.next_action, 'use_reviewed_browser_capture_or_district_owned_leaves_to_materialize_county_grade_contacts_because_raw_sau_export_replay_still_500s');

assert.equal(packet.current_problem_metrics.publicExportMaterializedInRawLane, false);
assert.equal(batchSummary.raw_export_materialized, false);
assert.ok(report.includes('the raw postback lane remains unstable in bounded replay'));
assert.ok(lessons.includes('### Public Selectors And Mapping Workbooks Are Not Enough If The Export Postback Still Fails'));

console.log('test-batch219-maine-sau-blocker-truth-alignment-v1: ok');
