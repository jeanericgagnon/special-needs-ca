import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch316KansasLiveExportRecoveryV1 } from './run-batch316-kansas-live-export-recovery-v1.mjs';

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

const result = generateBatch316KansasLiveExportRecoveryV1();
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
const batchSummary = readJson('data/generated/batch316_kansas_live_export_recovery_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch316-kansas-live-export-recovery-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'live_ksde_directory_root_and_public_export_contract_recovered_but_reviewed_local_district_leaves_still_cover_only_16_counties');

const gap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(gap);
assert.equal(gap.family_status, 'blocked_live_ksde_export_contract_recovered_but_reviewed_local_district_leaves_still_incomplete');
assert.match(gap.status_reason, /__VIEWSTATE.*__VIEWSTATEGENERATOR.*__EVENTVALIDATION/i);
assert.match(gap.status_reason, /real public PDF/i);

const failure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(failure);
assert.equal(failure.failure_code, summary.primary_gap_reason);
assert.match(failure.evidence, /content-type: application\/pdf/i);
assert.match(failure.evidence, /content-type: application\/vnd\.ms-excel/i);
assert.match(failure.evidence, /Abilene \/ Dickinson/i);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(verified);
assert.equal(verified.blocker_code, failure.failure_code);
assert.match(verified.blocker_evidence, /cover only 16 counties/i);
assert.ok(verified.samples.some((sample) => sample.sample_name === 'KSDE Directory Reports root recovered'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Kansas Educational Directory PDF recovered'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Abilene USD 435 public export workbook recovered'));

const next = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(next);
assert.equal(next.next_action, 'resume_only_from_live_public_export_backed_district_inventory_and_saved_district_owned_domains_to_expand_reviewed_local_education_leaves');

const kansasQueue = queueRows.find((row) => row.state === 'kansas');
assert.ok(kansasQueue);
assert.equal(kansasQueue.primary_gap_reason, summary.primary_gap_reason);

const kansasAudit = allStateAudit.states.find((row) => row.stateId === 'kansas');
assert.ok(kansasAudit);
assert.equal(kansasAudit.packetBatch, 'batch316_kansas_live_export_recovery_v1');
assert.equal(kansasAudit.packetPrimaryGapReason, summary.primary_gap_reason);

assert.equal(batchSummary.ksde_directory_reports_status, 200);
assert.equal(batchSummary.ksde_directories_status, 200);
assert.equal(batchSummary.ksde_pdf_status, 200);
assert.equal(batchSummary.has_viewstate, true);
assert.equal(batchSummary.has_viewstategenerator, true);
assert.equal(batchSummary.has_eventvalidation, true);
assert.equal(batchSummary.export_content_type, 'application/vnd.ms-excel');
assert.equal(batchSummary.export_file_type, 'CDFV2 Microsoft Excel');
assert.equal(batchSummary.export_title, 'SCHOOL DISTRICT SUPERINTENDENTS AND BOARD PRESIDENTS');
assert.equal(batchSummary.reviewed_local_leaf_counties, 16);

assert.match(stateReport, /live official KSDE export lane has recovered/i);
assert.match(handoff, /## Current Focus State: Kansas/);
assert.match(handoff, /Directory Reports app again returns a real `Directory.xls` workbook/i);
assert.match(lessons, /### Recheck Rejected State Export Roots Before Freezing Them As Final/);
assert.match(allStateReport, /Kansas now has a recovered state export lane/i);
assert.match(batchReport, /real Excel workbook/i);

const completeCount = allStateAudit.states.filter((row) => row.classification === 'COMPLETE').length;
const blockedCount = allStateAudit.states.filter((row) => row.classification === 'BLOCKED').length;
assert.equal(completeCount, 24);
assert.equal(blockedCount, 26);

console.log('test-batch316-kansas-live-export-recovery-v1: ok');
