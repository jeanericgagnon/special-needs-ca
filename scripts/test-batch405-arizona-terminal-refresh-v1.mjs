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
assert.equal(summary.primary_gap_reason, 'bounded_2026_06_26_live_recheck_confirms_des_wrapper_still_403_salesforce_locator_still_live_and_no_public_greenlee_county_assignment_on_des_or_ahcccs');

const countyGap = readJsonl('data/generated/arizona_gap_matrix_v2.jsonl').find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_des_salesforce_locator_still_exposes_only_greenlee_locality_zip_coverage_without_explicit_greenlee_county_assignment');
assert.match(countyGap.status_reason, /Reviewed 2026-06-26/i);
assert.match(countyGap.status_reason, /office-locator.*HTTP 403/i);
assert.match(countyGap.status_reason, /Salesforce-hosted DES office-locator app.*HTTP 200/i);
assert.match(countyGap.status_reason, /ALTCS_CountyMap\.pdf.*HTTP 200 HTML stale shells/i);

const failureRows = readJsonl('data/generated/arizona_failure_ledger_v2.jsonl');
assert.equal(failureRows[0].failure_code, 'official_des_locator_still_lacks_explicit_greenlee_assignment_while_live_salesforce_and_ahcccs_fallbacks_remain_non_closing');
assert.match(failureRows[0].evidence, /Greenlee County itself to a DES or AHCCCS office/i);

const verifiedRows = readJsonl('data/generated/arizona_verified_sources_v1.jsonl');
const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(verified.blocker_code, 'official_des_locator_still_lacks_explicit_greenlee_assignment_while_live_salesforce_and_ahcccs_fallbacks_remain_non_closing');
assert.match(verified.blocker_evidence, /Reviewed 2026-06-26/i);

const nextRows = readJsonl('data/generated/arizona_next_action_queue_v2.jsonl');
assert.equal(nextRows[0].next_action, 'hold_blocked_until_des_or_ahcccs_publish_explicit_greenlee_county_assignment_or_reviewable_county_to_office_contract');

const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const queueRow = queueRows.find((row) => row.state === 'arizona');
assert.equal(queueRow.primary_gap_reason, 'bounded_2026_06_26_live_recheck_confirms_des_wrapper_still_403_salesforce_locator_still_live_and_no_public_greenlee_county_assignment_on_des_or_ahcccs');

const batchSummary = readJson('data/generated/batch405_arizona_terminal_refresh_summary_v1.json');
assert.equal(batchSummary.des_wrapper_403, true);
assert.equal(batchSummary.des_salesforce_live, true);
assert.equal(batchSummary.altcs_locations_live, true);
assert.equal(batchSummary.altcs_county_map_stale_html, true);
assert.equal(batchSummary.ahcccs_contacts_stale_html, true);

const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/arizona-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /Greenlee County to an office/i);

const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const auditRow = allStateAudit.states.find((row) => row.stateId === 'arizona');
assert.equal(auditRow.packetBatch, 'batch405_arizona_terminal_refresh_v1');
assert.equal(auditRow.packetPrimaryGapReason, 'bounded_2026_06_26_live_recheck_confirms_des_wrapper_still_403_salesforce_locator_still_live_and_no_public_greenlee_county_assignment_on_des_or_ahcccs');

const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
assert.match(allStateReport, /Arizona remains blocked after a 2026-06-26 bounded live recheck/i);

const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
assert.match(handoff, /Current Focus State: Arizona/);
assert.match(handoff, /- Arizona: `bounded_2026_06_26_live_recheck_confirms_des_wrapper_still_403_salesforce_locator_still_live_and_no_public_greenlee_county_assignment_on_des_or_ahcccs`/);

const stateCertification = readJson('data/generated/state-certification/arizona.json');
assert.equal(stateCertification.summary.batch, 'batch405_arizona_terminal_refresh_v1');
assert.equal(stateCertification.checkedAt, '2026-06-26T00:00:00.000Z');

console.log('test-batch405-arizona-terminal-refresh-v1: ok');
