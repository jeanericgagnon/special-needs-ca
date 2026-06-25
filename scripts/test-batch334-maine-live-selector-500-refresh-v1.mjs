import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch334MaineLiveSelector500RefreshV1 } from './run-batch334-maine-live-selector-500-refresh-v1.mjs';

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

const result = generateBatch334MaineLiveSelector500RefreshV1();
const summary = readJson('data/generated/maine_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/maine_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/maine_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/maine_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/maine_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const batchSummary = readJson('data/generated/batch334_maine_live_selector_500_refresh_summary_v1.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/maine-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.primary_gap_reason, 'live_maine_neo_superintendent_selectors_now_materialize_local_rows_but_dhhs_office_html_still_has_no_county_contract');
assert.equal(summary.completeness_pct, 91);
assert.equal(summary.strong_critical_families, 11);
assert.equal(summary.weak_critical_families, 1);

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationGap.family_status, 'verified_current_official_neo_superintendent_selectors');
assert.match(educationGap.status_reason, /Superintendent by SAU selector and the Superintendent by Town selector both remained publicly reachable/i);
assert.match(educationGap.status_reason, /bounded Bangor submits on both routes materialized real local superintendent rows/i);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_district_office_locations_with_towns_but_without_county_crosswalk');

const educationFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationFailure, undefined);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(verified.family_status, 'verified_current_official_neo_superintendent_selectors');
assert.equal(verified.sample_count, 4);
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/SAU' && sample.verification_status === 'verified'));
assert.ok(verified.samples.some((sample) => /Bangor superintendent row via SAU selector/i.test(sample.sample_name) && sample.verification_status === 'verified'));
assert.ok(verified.samples.some((sample) => /Bangor superintendent row via Town selector/i.test(sample.sample_name) && sample.verification_status === 'verified'));
assert.equal(verified.blocker_code, null);

const next = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(next, undefined);

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'find_official_county_or_service_area_crosswalk_for_named_dhhs_office_towns_or_keep_maine_counties_blocked');

const queueRow = queueRows.find((row) => row.state === 'maine');
assert.equal(queueRow.primary_gap_reason, 'live_maine_neo_superintendent_selectors_now_materialize_local_rows_but_dhhs_office_html_still_has_no_county_contract');
assert.equal(queueRow.completeness_pct, 91);
assert.equal(queueRow.weak_critical_families, 1);

const allStateRow = allStateAudit.states.find((row) => row.stateId === 'maine');
assert.equal(allStateRow.packetBatch, 'batch334_maine_live_selector_500_refresh_v1');
assert.equal(allStateRow.packetPrimaryGapReason, 'live_maine_neo_superintendent_selectors_now_materialize_local_rows_but_dhhs_office_html_still_has_no_county_contract');
assert.equal(allStateRow.familyStatuses.district_or_county_education_routing, 'verified_current_official_neo_superintendent_selectors');
assert.equal(allStateRow.strongCriticalFamilies, 11);
assert.equal(allStateRow.weakCriticalFamilies, 1);
assert.equal(allStateRow.completenessPct, 91);

assert.equal(batchSummary.selector_live, true);
assert.equal(batchSummary.superintendent_sau_live, true);
assert.equal(batchSummary.town_selector_live, true);
assert.equal(batchSummary.workbook_live, true);
assert.equal(batchSummary.contact_search_post_status, 200);
assert.equal(batchSummary.contact_export_post_status, 200);
assert.equal(batchSummary.contact_error_shell, true);
assert.equal(batchSummary.superintendent_sau_post_status, 200);
assert.equal(batchSummary.superintendent_town_post_status, 200);
assert.equal(batchSummary.superintendent_materialized, true);

assert.ok(stateReport.includes('Education now clears from the live official Superintendent-by-SAU and Superintendent-by-Town selectors'));
assert.match(allStateReport, /Maine now clears education from the live NEO superintendent selectors/i);
assert.ok(handoff.includes('## Current Focus State: Maine'));
assert.ok(handoff.includes('live_maine_neo_superintendent_selectors_now_materialize_local_rows_but_dhhs_office_html_still_has_no_county_contract'));
assert.ok(lessons.includes('### One Recovered Official Selector Can Clear A Family Even If A Sibling Selector Still Errors'));

console.log('test-batch334-maine-live-selector-500-refresh-v1: ok');
