import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch263MaineWorkbookMappingOnlyRefinementV1 } from './run-batch263-maine-workbook-mapping-only-refinement-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

const result = generateBatch263MaineWorkbookMappingOnlyRefinementV1();
const summary = readJson('data/generated/maine_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/maine_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/maine_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/maine_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/maine_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch263_maine_workbook_mapping_only_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/maine-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_maine_workbook_is_stable_mapping_only_and_contact_materialization_lane_still_500_plus_dhhs_office_html_has_no_county_contract');
assert.equal(summary.final_blockers[0].failure_code, 'official_workbook_is_mapping_only_and_search_export_contact_lane_still_500');

const gap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(gap.family_status, 'blocked_workbook_proves_mapping_only_but_contact_materialization_lane_still_500');
assert.match(gap.status_reason, /Municipality, TownCode, GEOCode, OrganizationId, and OrganizationName/i);
assert.match(gap.status_reason, /does not preserve county-grade contact routing fields/i);

const failure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(failure.failure_code, 'official_workbook_is_mapping_only_and_search_export_contact_lane_still_500');
assert.match(failure.evidence, /ByMunicipality_IncludingEUT/i);
assert.match(failure.evidence, /BySAU_IncludingEUT/i);
assert.match(failure.evidence, /SAUs Only & Charters/i);
assert.match(failure.evidence, /No workbook table preserves county names, superintendent contacts, special-education contacts, phones, emails, or district routing rows/i);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(verified.family_status, 'blocked_workbook_proves_mapping_only_but_contact_materialization_lane_still_500');
assert.equal(verified.blocker_code, 'official_workbook_is_mapping_only_and_search_export_contact_lane_still_500');
assert.match(verified.query_basis, /workbook table headers/i);

const next = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(next.failure_code, 'official_workbook_is_mapping_only_and_search_export_contact_lane_still_500');
assert.equal(next.next_action, 'preserve_manual_export_or_browser_capture_lane_until_first_party_contact_rows_materialize');

assert.equal(batchSummary.workbook_live, true);
assert.equal(batchSummary.workbook_mapping_only_headers_confirmed, true);
assert.equal(batchSummary.contact_materialization_lane_still_500, true);
assert.ok(report.includes('the workbook only proves municipality-to-organization mapping and not county-grade contact routing'));
assert.ok(handoff.includes('## Current Focus State: Maine'));
assert.ok(handoff.includes('official_maine_workbook_is_stable_mapping_only_and_contact_materialization_lane_still_500_plus_dhhs_office_html_has_no_county_contract'));
assert.ok(lessons.includes('### A Stable Official Mapping Workbook Still Does Not Clear County-Grade Routing If It Lacks Contact Fields'));

console.log('test-batch263-maine-workbook-mapping-only-refinement-v1: ok');
