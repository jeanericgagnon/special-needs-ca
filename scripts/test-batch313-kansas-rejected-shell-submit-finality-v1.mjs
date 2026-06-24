import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch313KansasRejectedShellSubmitFinalityV1 } from './run-batch313-kansas-rejected-shell-submit-finality-v1.mjs';

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

const result = generateBatch313KansasRejectedShellSubmitFinalityV1();
const summary = readJson('data/generated/kansas_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/kansas_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/kansas_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/kansas_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/kansas_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/kansas-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const batchSummary = readJson('data/generated/batch313_kansas_rejected_shell_submit_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch313-kansas-rejected-shell-submit-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_ksde_directory_and_pdf_roots_now_only_serve_request_rejected_shells_and_the_directory_reports_root_exposes_no_hidden_submit_fields_while_reviewed_district_owned_leaves_cover_16_counties');

const gap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(gap);
assert.equal(gap.family_status, 'blocked_reviewed_district_owned_and_coop_leads_but_live_ksde_roots_now_only_expose_rejected_shell_without_submit_contract');
assert.match(gap.status_reason, /no `__VIEWSTATE`, `__VIEWSTATEGENERATOR`, or `__EVENTVALIDATION` fields/i);

const failure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(failure);
assert.equal(failure.failure_code, 'official_ksde_directory_and_pdf_roots_now_only_serve_request_rejected_shells_and_the_directory_reports_root_exposes_no_hidden_submit_fields_while_reviewed_district_owned_leaves_cover_16_counties');
assert.match(failure.evidence, /Request Rejected/);
assert.match(failure.evidence, /__VIEWSTATE/);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(verified);
assert.equal(verified.blocker_code, failure.failure_code);
assert.match(verified.blocker_evidence, /no `__VIEWSTATE`, `__VIEWSTATEGENERATOR`, or `__EVENTVALIDATION` fields/i);

const next = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(next);
assert.equal(next.next_action, 'continue_only_from_saved_export_backed_district_leads_and_reviewed_district_owned_domains_because_live_ksde_submit_contract_is_not_present_in_raw_lane');

const kansasQueue = queueRows.find((row) => row.state === 'kansas');
assert.ok(kansasQueue);
assert.equal(kansasQueue.primary_gap_reason, summary.primary_gap_reason);

const kansasAudit = allStateAudit.states.find((row) => row.stateId === 'kansas');
assert.ok(kansasAudit);
assert.equal(kansasAudit.packetBatch, 'batch313_kansas_rejected_shell_submit_finality_v1');
assert.equal(kansasAudit.packetPrimaryGapReason, summary.primary_gap_reason);

assert.equal(batchSummary.ksde_directory_reports_status, 200);
assert.equal(batchSummary.ksde_directories_status, 200);
assert.equal(batchSummary.ksde_pdf_status, 200);
assert.equal(batchSummary.rejected_shell, true);
assert.equal(batchSummary.has_viewstate, false);
assert.equal(batchSummary.has_viewstategenerator, false);
assert.equal(batchSummary.has_eventvalidation, false);
assert.equal(batchSummary.reviewed_local_leaf_counties, 16);

assert.match(stateReport, /no longer exposes the hidden ASP\.NET fields needed to replay the old district-scoped public submit contract/i);
assert.match(handoff, /## Current Focus State: Kansas/);
assert.match(handoff, /no `__VIEWSTATE`, `__VIEWSTATEGENERATOR`, or `__EVENTVALIDATION` fields/i);
assert.match(lessons, /### A Rejected ASP.NET Shell Without Hidden Fields Means The Public Submit Contract Is Gone/);
assert.match(allStateReport, /Kansas now has a tighter state-root stop signal:.*no hidden ASP\.NET submit fields/i);
assert.match(batchReport, /hidden ASP\.NET form fields are gone/i);

const completeCount = allStateAudit.states.filter((row) => row.classification === 'COMPLETE').length;
const blockedCount = allStateAudit.states.filter((row) => row.classification === 'BLOCKED').length;
assert.equal(completeCount, 24);
assert.equal(blockedCount, 26);

console.log('test-batch313-kansas-rejected-shell-submit-finality-v1: ok');
