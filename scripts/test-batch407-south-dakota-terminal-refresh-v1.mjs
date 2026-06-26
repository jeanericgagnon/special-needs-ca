import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch407SouthDakotaTerminalRefreshV1 } from './run-batch407-south-dakota-terminal-refresh-v1.mjs';

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

const result = generateBatch407SouthDakotaTerminalRefreshV1();
assert.equal(result.classification, 'BLOCKED');

const summary = readJson('data/generated/south-dakota_california_grade_summary_v2.json');
assert.equal(summary.batch, 'batch407_south-dakota_terminal_refresh_v1');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 91);
assert.equal(summary.primary_gap_reason, 'bounded_2026_06_26_live_recheck_confirms_current_dhs_localoffices_path_now_returns_200_but_still_only_a_page_not_found_shell_without_county_or_local_office_contract');

const countyGap = readJsonl('data/generated/south-dakota_gap_matrix_v2.jsonl').find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_localoffices_path_now_200_but_still_page_not_found_shell_and_other_current_dhs_surfaces_statewide_only');
assert.match(countyGap.status_reason, /Reviewed 2026-06-26/i);
assert.match(countyGap.status_reason, /localoffices.*returns HTTP 200/i);
assert.match(countyGap.status_reason, /page-not-found shell/i);
assert.match(countyGap.status_reason, /staff directory still includes statewide rows such as Disability Determination Services and Division of Rehabilitation Services/i);

const failureRows = readJsonl('data/generated/south-dakota_failure_ledger_v2.jsonl');
assert.equal(failureRows[0].failure_code, 'current_dhs_localoffices_path_now_returns_200_shell_but_still_no_public_county_or_local_office_contract');
assert.match(failureRows[0].evidence, /Reviewed 2026-06-26/i);
assert.match(failureRows[0].evidence, /localoffices.*returns HTTP 200/i);
assert.match(failureRows[0].evidence, /page-not-found shell/i);

const verifiedRows = readJsonl('data/generated/south-dakota_verified_sources_v1.jsonl');
const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(verified.blocker_code, 'current_dhs_localoffices_path_now_returns_200_shell_but_still_no_public_county_or_local_office_contract');
assert.match(verified.blocker_evidence, /Reviewed 2026-06-26/i);

const nextRows = readJsonl('data/generated/south-dakota_next_action_queue_v2.jsonl');
assert.equal(nextRows[0].next_action, 'hold_blocked_until_current_dhs_host_exposes_public_county_to_office_or_local_service_contract');

const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const queueRow = queueRows.find((row) => row.state === 'south-dakota');
assert.equal(queueRow.primary_gap_reason, 'bounded_2026_06_26_live_recheck_confirms_current_dhs_localoffices_path_now_returns_200_but_still_only_a_page_not_found_shell_without_county_or_local_office_contract');

const batchSummary = readJson('data/generated/batch407_south-dakota_terminal_refresh_summary_v1.json');
assert.equal(batchSummary.localoffices_200_shell, true);
assert.equal(batchSummary.contact_us_200, true);
assert.equal(batchSummary.staff_directory_200, true);

const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/south-dakota-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /localoffices path is still not a real local-office contract/i);

const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const auditRow = allStateAudit.states.find((row) => row.stateId === 'south-dakota');
assert.equal(auditRow.packetBatch, 'batch407_south-dakota_terminal_refresh_v1');
assert.equal(auditRow.packetPrimaryGapReason, 'bounded_2026_06_26_live_recheck_confirms_current_dhs_localoffices_path_now_returns_200_but_still_only_a_page_not_found_shell_without_county_or_local_office_contract');

const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
assert.match(allStateReport, /South Dakota remains blocked after a 2026-06-26 bounded live recheck/i);

const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
assert.match(handoff, /Current Focus State: South Dakota/);
assert.match(handoff, /- South Dakota: `bounded_2026_06_26_live_recheck_confirms_current_dhs_localoffices_path_now_returns_200_but_still_only_a_page_not_found_shell_without_county_or_local_office_contract`/);

const stateCertification = readJson('data/generated/state-certification/south-dakota.json');
assert.equal(stateCertification.summary.batch, 'batch407_south-dakota_terminal_refresh_v1');
assert.equal(stateCertification.checkedAt, '2026-06-26T00:00:00.000Z');

console.log('test-batch407-south-dakota-terminal-refresh-v1: ok');
