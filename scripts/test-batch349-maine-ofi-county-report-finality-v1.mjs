import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch349MaineOfiCountyReportFinalityV1 } from './run-batch349-maine-ofi-county-report-finality-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  const raw = fs.readFileSync(path.join(repoRoot, relativePath), 'utf8').trim();
  if (!raw) return [];
  return raw.split('\n').map((line) => JSON.parse(line));
}

const result = generateBatch349MaineOfiCountyReportFinalityV1();
const summary = readJson('data/generated/maine_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/maine_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/maine_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/maine_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/maine_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/maine-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const batchSummary = readJson('data/generated/batch349_maine_ofi_county_report_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch349-maine-ofi-county-report-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.batch, 'batch349_maine_ofi_county_report_finality_v1');
assert.equal(summary.primary_gap_reason, 'official_dhhs_office_stack_and_new_ofi_county_reports_still_expose_no_office_assignment_or_service_area_crosswalk');
assert.equal(summary.familyStatuses.county_local_disability_resources, 'blocked_public_dhhs_office_stack_and_county_reports_without_office_assignment_contract');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_public_dhhs_office_stack_and_county_reports_without_office_assignment_contract');
assert.match(countyGap.status_reason, /OFI Data & Reports page adds real county-structured artifacts/i);
assert.match(countyGap.status_reason, /only preserve TANF\/Food Supplement count columns by county and town/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'official_dhhs_office_stack_and_county_reports_expose_county_counts_but_zero_office_assignment_fields');
assert.match(countyFailure.evidence, /May 2026 Summary Counts By County\.xlsx/i);
assert.match(countyFailure.evidence, /zero office names, zero district-office identifiers/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.sample_count, 7);
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'OFI Data & Reports page'));
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'May 2026 Summary Counts By County And Town workbook'));

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'hold_blocked_until_official_maine_dhhs_or_ofi_surface_exposes_county_to_office_or_service_area_routing');

const queueRow = queueRows.find((row) => row.state === 'maine');
assert.equal(queueRow.primary_gap_reason, 'official_dhhs_office_stack_and_new_ofi_county_reports_still_expose_no_office_assignment_or_service_area_crosswalk');

const auditRow = allStateAudit.states.find((row) => row.stateId === 'maine');
assert.equal(auditRow.packetBatch, 'batch349_maine_ofi_county_report_finality_v1');
assert.equal(auditRow.packetPrimaryGapReason, 'official_dhhs_office_stack_and_new_ofi_county_reports_still_expose_no_office_assignment_or_service_area_crosswalk');
assert.equal(auditRow.familyStatuses.county_local_disability_resources, 'blocked_public_dhhs_office_stack_and_county_reports_without_office_assignment_contract');

assert.match(stateReport, /newly surfaced official OFI county workbooks still contain only program counts/i);
assert.match(allStateReport, /newly surfaced OFI county and county-town workbooks are only TANF\/Food Supplement count reports/i);
assert.match(handoff, /Current Focus State: Maine/);
assert.match(handoff, /OFI Data & Reports page/);
assert.match(handoff, /May 2026 Summary Counts By County And Town\.xlsx/);
assert.match(lessons, /County-Coded Program Reports Still Do Not Prove Local Office Routing/);

assert.equal(batchSummary.ofi_data_reports_page_live, true);
assert.equal(batchSummary.sampled_county_workbook_live, true);
assert.equal(batchSummary.sampled_county_town_workbook_live, true);
assert.equal(batchSummary.sampled_workbooks_have_office_name_field, false);
assert.equal(batchSummary.sampled_workbooks_have_service_area_field, false);
assert.equal(batchSummary.result, 'county_coded_reports_without_office_routing_contract');
assert.match(batchReport, /official OFI Data & Reports lane/i);

console.log('test-batch349-maine-ofi-county-report-finality-v1: ok');
