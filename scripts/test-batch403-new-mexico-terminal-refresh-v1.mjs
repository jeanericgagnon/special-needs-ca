import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch403NewMexicoTerminalRefreshV1 } from './run-batch403-new-mexico-terminal-refresh-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  const raw = fs.readFileSync(path.join(repoRoot, relativePath), 'utf8').trim();
  return raw ? raw.split('\n').map((line) => JSON.parse(line)) : [];
}

const result = generateBatch403NewMexicoTerminalRefreshV1();
assert.equal(result.classification, 'BLOCKED');

const summary = readJson('data/generated/new-mexico_california_grade_summary_v2.json');
assert.equal(summary.batch, 'batch403_new_mexico_terminal_refresh_v1');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 83);
assert.equal(summary.primary_gap_reason, 'bounded_2026_06_26_live_recheck_confirms_public_ped_sharepoint_stack_still_lacks_county_or_rec_service_area_contract_and_official_vr_lanes_still_fail_closed');

const gapRows = readJsonl('data/generated/new-mexico_gap_matrix_v2.jsonl');
const districtGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(districtGap.family_status, 'blocked_live_ped_sharepoint_stack_public_and_reviewable_but_still_missing_county_crosswalk_or_rec_service_area_contract');
assert.match(districtGap.status_reason, /Reviewed 2026-06-26/i);
assert.match(districtGap.status_reason, /six public workbook exports still return HTTP 200/i);
assert.match(districtGap.status_reason, /still does not close county-grade local routing/i);

const vrGap = gapRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets');
assert.equal(vrGap.family_status, 'blocked_live_dvr_401_and_dws_request_rejected_with_no_public_successor');
assert.match(vrGap.status_reason, /dvr\.nm\.gov\/services` still return HTTP 401/i);
assert.match(vrGap.status_reason, /Request Rejected/i);

const failureRows = readJsonl('data/generated/new-mexico_failure_ledger_v2.jsonl');
assert.match(JSON.stringify(failureRows), /Reviewed 2026-06-26/);

const verifiedRows = readJsonl('data/generated/new-mexico_verified_sources_v1.jsonl');
assert.match(JSON.stringify(verifiedRows), /Reviewed 2026-06-26/);

const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const queueRow = queueRows.find((row) => row.state === 'new-mexico');
assert.equal(queueRow.primary_gap_reason, 'bounded_2026_06_26_live_recheck_confirms_public_ped_sharepoint_stack_still_lacks_county_or_rec_service_area_contract_and_official_vr_lanes_still_fail_closed');

const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/new-mexico-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /New Mexico remains BLOCKED and not index-safe/i);
assert.match(report, /public PED directory stack is real but still not county-grade/i);

const batchSummary = readJson('data/generated/batch403_new_mexico_terminal_refresh_summary_v1.json');
assert.equal(batchSummary.webed_home_live, true);
assert.equal(batchSummary.webed_list_live, true);
assert.equal(batchSummary.rec_home_live, true);
assert.equal(batchSummary.public_workbooks_live, 6);
assert.equal(batchSummary.dvr_root_401, true);
assert.equal(batchSummary.dws_request_rejected, true);

const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch403-new-mexico-terminal-refresh-report-v1.md'), 'utf8');
assert.match(batchReport, /2026-06-26 live recheck/i);

const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const auditRow = allStateAudit.states.find((row) => row.stateId === 'new-mexico');
assert.equal(auditRow.packetBatch, 'batch403_new_mexico_terminal_refresh_v1');
assert.equal(auditRow.packetPrimaryGapReason, 'bounded_2026_06_26_live_recheck_confirms_public_ped_sharepoint_stack_still_lacks_county_or_rec_service_area_contract_and_official_vr_lanes_still_fail_closed');

const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
assert.match(allStateReport, /New Mexico remains blocked after a 2026-06-26 bounded live recheck/i);

const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
assert.match(handoff, /Current Focus State: New Mexico/);
assert.match(handoff, /- New Mexico: `bounded_2026_06_26_live_recheck_confirms_public_ped_sharepoint_stack_still_lacks_county_or_rec_service_area_contract_and_official_vr_lanes_still_fail_closed`/);

const stateCertification = readJson('data/generated/state-certification/new-mexico.json');
assert.equal(stateCertification.summary.batch, 'batch403_new_mexico_terminal_refresh_v1');
assert.equal(stateCertification.checkedAt, '2026-06-26T00:00:00.000Z');

console.log('test-batch403-new-mexico-terminal-refresh-v1: ok');
