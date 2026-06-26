import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch405ArizonaTerminalRefreshV1 } from './run-batch405-arizona-terminal-refresh-v1.mjs';

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

const result = generateBatch405ArizonaTerminalRefreshV1();
assert.equal(result.classification, 'BLOCKED');

const summary = readJson('data/generated/arizona_california_grade_summary_v2.json');
assert.equal(summary.batch, 'batch405_arizona_terminal_refresh_v1');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 92);
assert.equal(summary.primary_gap_reason, 'bounded_2026_06_26_live_des_in_page_helper_confirms_only_11_explicit_counties_and_no_literal_greenlee_la_paz_mohave_or_yuma_assignment');

const countyGap = readJsonl('data/generated/arizona_gap_matrix_v2.jsonl').find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_live_des_helper_only_proves_11_explicit_counties_with_no_greenlee_la_paz_mohave_or_yuma_assignment');
assert.match(countyGap.status_reason, /Reviewed 2026-06-26/i);
assert.match(countyGap.status_reason, /public wrapper roots .* still stay challenge-blocked/i);
assert.match(countyGap.status_reason, /LoadSvcDropDown.*xrefSvcCodeJSON.*geoSearchRadius/i);
assert.match(countyGap.status_reason, /only 11 counties overall/i);
assert.match(countyGap.status_reason, /No reviewed live helper result .* Greenlee.*La Paz.*Mohave.*Yuma/i);

const failureRows = readJsonl('data/generated/arizona_failure_ledger_v2.jsonl');
assert.equal(failureRows[0].failure_code, 'official_des_live_helper_exposes_only_11_explicit_counties_and_no_greenlee_la_paz_mohave_or_yuma_county_assignment');
assert.match(failureRows[0].evidence, /Greenlee, La Paz, Mohave, and Yuma counties/i);

const verifiedRows = readJsonl('data/generated/arizona_verified_sources_v1.jsonl');
const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(verified.blocker_code, 'official_des_live_helper_exposes_only_11_explicit_counties_and_no_greenlee_la_paz_mohave_or_yuma_county_assignment');
assert.match(verified.blocker_evidence, /Reviewed 2026-06-26/i);

const nextRows = readJsonl('data/generated/arizona_next_action_queue_v2.jsonl');
assert.equal(nextRows[0].next_action, 'hold_blocked_until_des_or_ahcccs_publish_explicit_county_assignment_for_greenlee_la_paz_mohave_and_yuma_or_new_reviewable_county_to_office_contract');

const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const queueRow = queueRows.find((row) => row.state === 'arizona');
assert.equal(queueRow.primary_gap_reason, 'bounded_2026_06_26_live_des_in_page_helper_confirms_only_11_explicit_counties_and_no_literal_greenlee_la_paz_mohave_or_yuma_assignment');

const batchSummary = readJson('data/generated/batch405_arizona_terminal_refresh_summary_v1.json');
assert.equal(batchSummary.des_wrapper_403, true);
assert.equal(batchSummary.des_salesforce_live, true);
assert.equal(batchSummary.des_explicit_county_total, 11);
assert.equal(batchSummary.altcs_locations_live, true);
assert.equal(batchSummary.altcs_county_map_live_pdf, true);
assert.equal(batchSummary.ahcccs_admin_pdfs_support_letters_only, true);
assert.deepEqual(batchSummary.missing_explicit_counties, ['Greenlee', 'La Paz', 'Mohave', 'Yuma']);

const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/arizona-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /Greenlee, La Paz, Mohave, or Yuma County/i);

const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const auditRow = allStateAudit.states.find((row) => row.stateId === 'arizona');
assert.equal(auditRow.packetBatch, 'batch405_arizona_terminal_refresh_v1');
assert.equal(auditRow.packetPrimaryGapReason, 'bounded_2026_06_26_live_des_in_page_helper_confirms_only_11_explicit_counties_and_no_literal_greenlee_la_paz_mohave_or_yuma_assignment');

const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
assert.match(allStateReport, /Arizona remains blocked after a 2026-06-26 bounded live recheck/i);
assert.match(allStateReport, /Greenlee, La Paz, Mohave, or Yuma County/i);

const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
assert.match(handoff, /Current Focus State: Arizona/);
assert.match(handoff, /- Arizona: `bounded_2026_06_26_live_des_in_page_helper_confirms_only_11_explicit_counties_and_no_literal_greenlee_la_paz_mohave_or_yuma_assignment`/);
assert.match(handoff, /Greenlee, La Paz, Mohave, or Yuma County/i);

const stateCertification = readJson('data/generated/state-certification/arizona.json');
assert.equal(stateCertification.summary.batch, 'batch405_arizona_terminal_refresh_v1');
assert.equal(stateCertification.checkedAt, '2026-06-26T00:00:00.000Z');

console.log('test-batch405-arizona-terminal-refresh-v1: ok');
