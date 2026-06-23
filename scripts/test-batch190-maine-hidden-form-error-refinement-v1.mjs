import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch190MaineHiddenFormErrorRefinementV1 } from './run-batch190-maine-hidden-form-error-refinement-v1.mjs';

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

const result = generateBatch190MaineHiddenFormErrorRefinementV1();
const summary = readJson('data/generated/maine_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/maine_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/maine_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/maine_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/maine_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch190_maine_hidden_form_error_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/maine-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(batchSummary.hidden_form_replay_changes_500_to_error_shell, true);
assert.equal(batchSummary.dhhs_office_page_has_county_fields, false);
assert.equal(batchSummary.dhhs_office_page_has_town_fields, false);
assert.equal(batchSummary.dhhs_office_page_has_service_area_fields, false);

assert.equal(summary.primary_gap_reason, 'public_maine_selectors_and_workbook_are_live_but_full_hidden_form_post_still_errors_and_dhhs_office_html_has_no_county_contract');

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationGap.family_status, 'blocked_live_public_org_selector_with_hidden_form_error_shell');
assert.match(educationGap.status_reason, /full hidden `SAUs\[\*\]` inputs/i);
assert.match(educationGap.status_reason, /generic official `Error\.` shell/i);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_district_office_locations_without_county_town_or_service_area_fields');
assert.match(countyGap.status_reason, /zero county terms/i);
assert.match(countyGap.status_reason, /zero town terms/i);

const educationFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationFailure.failure_code, 'live_orgid_inventory_and_workbook_exist_but_full_hidden_form_post_returns_generic_error_shell');
assert.match(educationFailure.evidence, /full hidden SAU fields/i);
assert.match(educationFailure.evidence, /generic `Error\.` shell/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'official_dhhs_office_page_has_zero_county_town_or_service_area_fields');
assert.match(countyFailure.evidence, /zero county terms/i);
assert.match(countyFailure.evidence, /zero town terms/i);

const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationVerified.family_status, 'blocked_live_public_org_selector_with_hidden_form_error_shell');
assert.equal(educationVerified.blocker_code, 'live_orgid_inventory_and_workbook_exist_but_full_hidden_form_post_returns_generic_error_shell');

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_district_office_locations_without_county_town_or_service_area_fields');
assert.equal(countyVerified.blocker_code, 'official_dhhs_office_page_has_zero_county_town_or_service_area_fields');

const educationNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationNext.next_action, 'use_live_orgids_and_workbook_for_reviewed_browser_capture_now_that_hidden_form_replay_is_understood');

assert.match(report, /fully hydrated official form still collapses to a generic error shell/i);
assert.match(report, /official DHHS office page remains office-grade only/i);
assert.ok(lessons.includes('### Retry ASP.NET Search Forms Once With Their Hidden Collections Before Calling The Workflow Broken'));

console.log('test-batch190-maine-hidden-form-error-refinement-v1: ok');
