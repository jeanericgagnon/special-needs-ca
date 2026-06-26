import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch398MaineOfiReportsFinalityV1 } from './run-batch398-maine-ofi-reports-finality-v1.mjs';

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

const result = generateBatch398MaineOfiReportsFinalityV1();
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
const batchSummary = readJson('data/generated/batch398_maine_ofi_reports_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch398-maine-ofi-reports-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.batch, 'batch398_maine_ofi_reports_finality_v1');
assert.equal(summary.primary_gap_reason, 'official_dhhs_nav_stack_maine_search_and_ofi_reports_still_expose_office_addresses_labels_or_counts_but_no_county_or_service_area_contract');
assert.equal(summary.familyStatuses.county_local_disability_resources, 'blocked_public_dhhs_nav_stack_state_search_and_reports_without_county_to_office_or_service_area_assignment_contract');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_public_dhhs_nav_stack_state_search_and_reports_without_county_to_office_or_service_area_assignment_contract');
assert.match(countyGap.status_reason, /OFI Data & Reports lane/i);
assert.match(countyGap.status_reason, /counts-only/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'official_dhhs_nav_stack_maine_search_and_ofi_reports_confirm_office_addresses_or_counts_but_zero_county_assignment_fields');
assert.match(countyFailure.evidence, /ofi\/about-us\/data-reports/i);
assert.match(countyFailure.evidence, /Geographic Distribution/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.sample_count, 16);
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'Maine OFI Data & Reports page'));
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'Maine OFI Geographic Distribution PDF (counts only)'));
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'Maine OFI Geographic Overflow PDF (counts only)'));
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'Official Maine Search: Aroostook district office dhhs'));
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'Official Maine Search: county district office ofi'));
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'Maine DHHS contact navigation stack'));

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'hold_blocked_until_official_maine_dhhs_ofi_or_maine_search_surface_exposes_county_to_office_or_service_area_routing');

const queueRow = queueRows.find((row) => row.state === 'maine');
assert.equal(queueRow.primary_gap_reason, 'official_dhhs_nav_stack_maine_search_and_ofi_reports_still_expose_office_addresses_labels_or_counts_but_no_county_or_service_area_contract');

const auditRow = allStateAudit.states.find((row) => row.stateId === 'maine');
assert.equal(auditRow.packetBatch, 'batch398_maine_ofi_reports_finality_v1');
assert.equal(auditRow.packetPrimaryGapReason, 'official_dhhs_nav_stack_maine_search_and_ofi_reports_still_expose_office_addresses_labels_or_counts_but_no_county_or_service_area_contract');
assert.equal(auditRow.familyStatuses.county_local_disability_resources, 'blocked_public_dhhs_nav_stack_state_search_and_reports_without_county_to_office_or_service_area_assignment_contract');

assert.match(stateReport, /live OFI reports lane still prove office locations, office labels, or county-count reporting/i);
assert.match(allStateReport, /OFI-reports finality check/i);
assert.match(handoff, /Current Focus State: Maine/);
assert.match(handoff, /Geographic Distribution/i);
assert.match(handoff, /Official Maine Search: county district office ofi/);
assert.match(handoff, /1\. Idaho/);
assert.match(lessons, /Live County-Count Reports Still Do Not Prove Office Routing/);

assert.equal(batchSummary.official_maine_search_live, true);
assert.equal(batchSummary.official_maine_search_county_queries_with_role_results, 0);
assert.equal(batchSummary.ofi_data_reports_page_live, true);
assert.equal(batchSummary.reviewed_geographic_distribution_pdf_counts_only, true);
assert.equal(batchSummary.reviewed_geographic_overflow_pdf_counts_only, true);
assert.equal(batchSummary.ofi_reports_with_office_assignment_contract, 0);
assert.equal(batchSummary.county_crosswalk_found, false);
assert.equal(batchSummary.result, 'official_nav_stack_search_and_reports_expose_addresses_labels_or_counts_without_county_routing_contract');
assert.match(batchReport, /OFI Data & Reports page/i);

console.log('test-batch398-maine-ofi-reports-finality-v1: ok');
