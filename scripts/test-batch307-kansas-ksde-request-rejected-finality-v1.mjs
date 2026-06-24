import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch307KansasKsdeRequestRejectedFinalityV1 } from './run-batch307-kansas-ksde-request-rejected-finality-v1.mjs';

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

const result = generateBatch307KansasKsdeRequestRejectedFinalityV1();
const summary = readJson('data/generated/kansas_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/kansas_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/kansas_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/kansas_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/kansas_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const batchSummary = readJson('data/generated/batch307_kansas_ksde_request_rejected_finality_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/kansas-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_ksde_directory_export_roots_now_return_request_rejected_shells_while_reviewed_district_owned_leaves_cover_16_counties_but_county_grade_is_still_incomplete');

const gap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(gap);
assert.equal(gap.family_status, 'blocked_reviewed_district_owned_and_coop_leads_but_live_ksde_export_roots_now_request_rejected');
assert.match(gap.status_reason, /Request Rejected/);

const failure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(failure);
assert.equal(failure.failure_code, summary.primary_gap_reason);
assert.match(failure.evidence, /Directory_Rpts\/default\.aspx/);
assert.match(failure.evidence, /The requested URL was rejected/);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(verified);
assert.equal(verified.blocker_code, summary.primary_gap_reason);
assert.match(verified.blocker_evidence, /Request Rejected/);

const next = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(next);
assert.equal(next.next_action, 'continue_only_from_saved_export_backed_district_leads_and_reviewed_district_owned_domains_not_from_live_ksde_root_retries');

const queue = queueRows.find((row) => row.state === 'kansas');
assert.ok(queue);
assert.equal(queue.primary_gap_reason, summary.primary_gap_reason);

assert.equal(batchSummary.rejected_shell_title, 'Request Rejected');
assert.equal(batchSummary.reviewed_local_counties, 16);
assert.equal(batchSummary.rejected_state_roots.length, 3);

assert.match(report, /Request Rejected/);
assert.match(handoff, /## Current Focus State: Kansas/);
assert.match(handoff, /saved export-backed district leads/i);
assert.match(allStateReport, /Kansas now has a tighter state-root stop signal/i);

console.log('test-batch307-kansas-ksde-request-rejected-finality-v1: ok');
