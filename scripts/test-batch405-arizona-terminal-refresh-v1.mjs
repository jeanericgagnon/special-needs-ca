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
assert.equal(summary.primary_gap_reason, 'bounded_2026_06_26_live_des_salesforce_remoting_confirms_explicit_county_fields_for_la_paz_mohave_and_yuma_and_greenlee_zip_served_localities_but_still_no_greenlee_county_assignment');
assert.deepEqual(summary.county_local_explicit_covered_counties, ['Apache', 'Cochise', 'Coconino', 'Gila', 'Graham', 'La Paz', 'Maricopa', 'Mohave', 'Navajo', 'Pima', 'Pinal', 'Santa Cruz', 'Yavapai', 'Yuma']);
assert.equal(summary.county_local_explicit_covered_count, 14);
assert.deepEqual(summary.county_local_unsupported_counties, ['Greenlee']);
assert.equal(summary.county_local_unsupported_count, 1);

const countyGap = readJsonl('data/generated/arizona_gap_matrix_v2.jsonl').find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_live_des_remoting_proves_greenlee_zip_served_localities_but_still_lacks_explicit_greenlee_county_assignment');
assert.match(countyGap.status_reason, /Reviewed 2026-06-26/i);
assert.match(countyGap.status_reason, /Cloudflare `Just a moment\.\.\.` shell/i);
assert.match(countyGap.status_reason, /EOLEmbedController\.getEOLOfficeData/i);
assert.match(countyGap.status_reason, /La Paz`, `Mohave`, and `Yuma` now each appear as literal office `county` values/i);
assert.match(countyGap.status_reason, /Greenlee still does not appear as an explicit office `county` value/i);
assert.match(countyGap.status_reason, /zipCodesServed` values `85533`, `85534`, and `85540`/i);
assert.match(countyGap.status_reason, /Clifton, Arizona 85533.*Duncan, Arizona 85534.*Morenci, AZ 85540/i);

const failureRows = readJsonl('data/generated/arizona_failure_ledger_v2.jsonl');
assert.equal(failureRows[0].failure_code, 'official_des_live_remoting_proves_greenlee_zip_served_localities_but_still_lacks_explicit_greenlee_county_assignment');
assert.match(failureRows[0].evidence, /Arizona therefore still lacks reviewed public official office-routing proof for Greenlee County/i);
assert.match(failureRows[0].evidence, /Greenlee now has explicit locality ZIP service-area evidence/i);

const verifiedRows = readJsonl('data/generated/arizona_verified_sources_v1.jsonl');
const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(verified.blocker_code, 'official_des_live_remoting_proves_greenlee_zip_served_localities_but_still_lacks_explicit_greenlee_county_assignment');
assert.match(verified.blocker_evidence, /Reviewed 2026-06-26/i);

const nextRows = readJsonl('data/generated/arizona_next_action_queue_v2.jsonl');
assert.equal(nextRows[0].next_action, 'hold_blocked_until_des_or_ahcccs_publish_explicit_greenlee_county_assignment_or_new_reviewable_county_to_office_contract');

const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const queueRow = queueRows.find((row) => row.state === 'arizona');
assert.equal(queueRow.primary_gap_reason, 'bounded_2026_06_26_live_des_salesforce_remoting_confirms_explicit_county_fields_for_la_paz_mohave_and_yuma_and_greenlee_zip_served_localities_but_still_no_greenlee_county_assignment');
assert.deepEqual(queueRow.final_blockers[0].covered_counties, ['Apache', 'Cochise', 'Coconino', 'Gila', 'Graham', 'La Paz', 'Maricopa', 'Mohave', 'Navajo', 'Pima', 'Pinal', 'Santa Cruz', 'Yavapai', 'Yuma']);
assert.deepEqual(queueRow.final_blockers[0].unsupported_counties, ['Greenlee']);

const batchSummary = readJson('data/generated/batch405_arizona_terminal_refresh_summary_v1.json');
assert.equal(batchSummary.des_wrapper_403, true);
assert.equal(batchSummary.des_wrapper_roots_browser_readable, false);
assert.equal(batchSummary.des_wrapper_shell_only, true);
assert.equal(batchSummary.des_salesforce_live, true);
assert.equal(batchSummary.des_explicit_county_total, 14);
assert.deepEqual(batchSummary.covered_explicit_counties, ['Apache', 'Cochise', 'Coconino', 'Gila', 'Graham', 'La Paz', 'Maricopa', 'Mohave', 'Navajo', 'Pima', 'Pinal', 'Santa Cruz', 'Yavapai', 'Yuma']);
assert.equal(batchSummary.altcs_locations_live, true);
assert.equal(batchSummary.altcs_county_map_live_pdf, true);
assert.equal(batchSummary.ahcccs_admin_pdfs_support_letters_only, true);
assert.deepEqual(batchSummary.missing_explicit_counties, ['Greenlee']);
assert.deepEqual(batchSummary.des_remoting_confirms_counties, ['La Paz', 'Mohave', 'Yuma']);
assert.deepEqual(batchSummary.greenlee_zip_served_values, ['85533', '85534', '85540']);

const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/arizona-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /Greenlee County alone still lacks a reviewed public official county-literal assignment/i);
assert.match(report, /Greenlee locality ZIP service-area values/i);
assert.match(report, /explicitly covered counties \(14\/15\): Apache, Cochise, Coconino, Gila, Graham, La Paz, Maricopa, Mohave, Navajo, Pima, Pinal, Santa Cruz, Yavapai, and Yuma/i);
assert.match(report, /unsupported counties \(1\/15\): Greenlee/i);

const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const auditRow = allStateAudit.states.find((row) => row.stateId === 'arizona');
assert.equal(auditRow.packetBatch, 'batch405_arizona_terminal_refresh_v1');
assert.equal(auditRow.packetPrimaryGapReason, 'bounded_2026_06_26_live_des_salesforce_remoting_confirms_explicit_county_fields_for_la_paz_mohave_and_yuma_and_greenlee_zip_served_localities_but_still_no_greenlee_county_assignment');
assert.deepEqual(auditRow.packetFinalBlockers[0].covered_counties, ['Apache', 'Cochise', 'Coconino', 'Gila', 'Graham', 'La Paz', 'Maricopa', 'Mohave', 'Navajo', 'Pima', 'Pinal', 'Santa Cruz', 'Yavapai', 'Yuma']);
assert.deepEqual(auditRow.packetFinalBlockers[0].unsupported_counties, ['Greenlee']);

const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
assert.match(allStateReport, /Arizona remains blocked after a 2026-06-26 bounded live recheck/i);
assert.match(allStateReport, /Greenlee County alone still lacks reviewed public official office-routing proof/i);
assert.match(allStateReport, /Cloudflare `Just a moment\.\.\.` shell/i);
const stateCertification = readJson('data/generated/state-certification/arizona.json');
assert.equal(stateCertification.summary.batch, 'batch405_arizona_terminal_refresh_v1');
assert.equal(stateCertification.checkedAt, '2026-06-26T00:00:00.000Z');

console.log('test-batch405-arizona-terminal-refresh-v1: ok');
