import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch406MaineTerminalRefreshV1 } from './run-batch406-maine-terminal-refresh-v1.mjs';

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

const result = generateBatch406MaineTerminalRefreshV1();
assert.equal(result.classification, 'BLOCKED');

const summary = readJson('data/generated/maine_california_grade_summary_v2.json');
assert.equal(summary.batch, 'batch406_maine_terminal_refresh_v1');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 91);
assert.equal(summary.primary_gap_reason, 'bounded_2026_06_26_live_recheck_confirms_maine_dhhs_ofi_nav_stack_reports_and_search_surfaces_are_public_but_still_expose_no_county_to_office_or_service_area_contract');
assert.equal(summary.county_local_office_contract_count, 0);
assert.equal(summary.county_local_unmapped_counties, 16);

const countyGap = readJsonl('data/generated/maine_gap_matrix_v2.jsonl').find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_live_dhhs_ofi_nav_stack_reports_and_search_surfaces_public_but_still_not_county_grade');
assert.match(countyGap.status_reason, /Reviewed 2026-06-26/i);
assert.match(countyGap.status_reason, /all still return HTTP 200/i);
assert.match(countyGap.status_reason, /county workbook preserves headers like `COUNTY`/i);
assert.match(countyGap.status_reason, /county-and-town workbook preserves `COUNTY` plus `TOWN`/i);
assert.match(countyGap.status_reason, /District Office Locations page also remains office-address only and does not name counties on-page/i);

const failureRows = readJsonl('data/generated/maine_failure_ledger_v2.jsonl');
assert.equal(failureRows[0].failure_code, 'official_maine_dhhs_ofi_surfaces_still_expose_offices_and_counts_without_county_assignment_contract');
assert.match(failureRows[0].evidence, /Geographic Distribution \/ Overflow PDFs enumerate counties and towns/i);

const verifiedRows = readJsonl('data/generated/maine_verified_sources_v1.jsonl');
const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(verified.blocker_code, 'official_maine_dhhs_ofi_surfaces_still_expose_offices_and_counts_without_county_assignment_contract');
assert.match(verified.blocker_evidence, /Reviewed 2026-06-26/i);

const nextRows = readJsonl('data/generated/maine_next_action_queue_v2.jsonl');
assert.equal(nextRows[0].next_action, 'hold_blocked_until_official_maine_dhhs_ofi_or_maine_search_surface_exposes_county_to_office_or_service_area_routing');

const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const queueRow = queueRows.find((row) => row.state === 'maine');
assert.equal(queueRow.primary_gap_reason, 'bounded_2026_06_26_live_recheck_confirms_maine_dhhs_ofi_nav_stack_reports_and_search_surfaces_are_public_but_still_expose_no_county_to_office_or_service_area_contract');
assert.equal(queueRow.final_blockers[0].office_contract_count, 0);
assert.equal(queueRow.final_blockers[0].unmapped_counties, 16);

const batchSummary = readJson('data/generated/batch406_maine_terminal_refresh_summary_v1.json');
assert.equal(batchSummary.offices_live, true);
assert.equal(batchSummary.ofi_contact_live, true);
assert.equal(batchSummary.ofi_reports_live, true);
assert.equal(batchSummary.maine_search_live, true);
assert.equal(batchSummary.county_grade_office_contract_count, 0);
assert.equal(batchSummary.county_grade_unmapped_count, 16);
assert.equal(batchSummary.office_page_has_no_county_names, true);
assert.equal(batchSummary.geographic_reports_county_town_only, true);
assert.equal(batchSummary.no_office_assignment_terms_in_reports, true);

const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/maine-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /county-to-office or service-area contract/i);
assert.match(report, /county-and-town workbook/i);
assert.match(report, /county-grade office-routing coverage \(0\/16\): no reviewed public county-to-office or service-area assignment contract/i);

const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const auditRow = allStateAudit.states.find((row) => row.stateId === 'maine');
assert.equal(auditRow.packetBatch, 'batch406_maine_terminal_refresh_v1');
assert.equal(auditRow.packetPrimaryGapReason, 'bounded_2026_06_26_live_recheck_confirms_maine_dhhs_ofi_nav_stack_reports_and_search_surfaces_are_public_but_still_expose_no_county_to_office_or_service_area_contract');
assert.equal(auditRow.packetFinalBlockers[0].office_contract_count, 0);
assert.equal(auditRow.packetFinalBlockers[0].unmapped_counties, 16);

const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
assert.match(allStateReport, /Maine remains blocked after a 2026-06-26 bounded live recheck/i);
assert.match(allStateReport, /county\/town PDFs\/XLSX surfaces all remain public/i);

const stateCertification = readJson('data/generated/state-certification/maine.json');
assert.equal(stateCertification.summary.batch, 'batch406_maine_terminal_refresh_v1');
assert.equal(stateCertification.checkedAt, '2026-06-26T00:00:00.000Z');

console.log('test-batch406-maine-terminal-refresh-v1: ok');
