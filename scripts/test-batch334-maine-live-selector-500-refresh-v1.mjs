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
assert.equal(summary.primary_gap_reason, 'official_maine_contact_and_superintendent_selectors_are_live_but_current_bangor_materialization_posts_still_return_same_500_shell_plus_dhhs_office_html_has_no_county_contract');

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationGap.family_status, 'blocked_live_contact_and_superintendent_selectors_but_current_materialization_posts_still_return_same_500_shell');
assert.match(educationGap.status_reason, /Primary Contacts By Organization selector, the Superintendent by SAU selector, the Superintendent by Town selector, and the official SAU workbook/i);
assert.match(educationGap.status_reason, /all return the same generic NEO Contact Search HTTP 500 error shell/i);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_district_office_locations_with_towns_but_without_county_crosswalk');

const educationFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationFailure.failure_code, 'official_contact_and_superintendent_selectors_are_live_but_current_bangor_materialization_posts_still_return_same_500_shell');
assert.ok(educationFailure.evidence.includes('NEO Contact Search [ v2.0.0.0 - A2 ]'));
assert.ok(educationFailure.evidence.includes('NEO Contact Search [ v2.0.0.0 - A4 ]'));
assert.ok(educationFailure.evidence.includes('anti-forgery token, the `OrgId` selector, and the `SAUs[*]` field family'));
assert.match(educationFailure.evidence, /all returned the same/i);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(verified.family_status, 'blocked_live_contact_and_superintendent_selectors_but_current_materialization_posts_still_return_same_500_shell');
assert.equal(verified.sample_count, 6);
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU' && sample.verification_status === 'verified'));
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/SAU' && sample.verification_status === 'verified'));
assert.ok(verified.samples.some((sample) => /Bangor search post/i.test(sample.sample_name) && sample.verification_status === 'blocked'));
assert.ok(verified.samples.some((sample) => /superintendent materialization posts/i.test(sample.sample_name) && sample.verification_status === 'blocked'));

const next = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(next.next_action, 'preserve_manual_export_or_browser_capture_lane_until_any_live_first_party_maine_education_rows_materialize');

const queueRow = queueRows.find((row) => row.state === 'maine');
assert.equal(queueRow.primary_gap_reason, 'official_maine_contact_and_superintendent_selectors_are_live_but_current_bangor_materialization_posts_still_return_same_500_shell_plus_dhhs_office_html_has_no_county_contract');

const allStateRow = allStateAudit.states.find((row) => row.stateId === 'maine');
assert.equal(allStateRow.packetBatch, 'batch334_maine_live_selector_500_refresh_v1');
assert.equal(allStateRow.packetPrimaryGapReason, 'official_maine_contact_and_superintendent_selectors_are_live_but_current_bangor_materialization_posts_still_return_same_500_shell_plus_dhhs_office_html_has_no_county_contract');
assert.equal(allStateRow.familyStatuses.district_or_county_education_routing, 'blocked_live_contact_and_superintendent_selectors_but_current_materialization_posts_still_return_same_500_shell');

assert.equal(batchSummary.selector_live, true);
assert.equal(batchSummary.superintendent_sau_live, true);
assert.equal(batchSummary.town_selector_live, true);
assert.equal(batchSummary.workbook_live, true);
assert.equal(batchSummary.search_post_status, 500);
assert.equal(batchSummary.export_post_status, 500);
assert.equal(batchSummary.superintendent_post_status, 500);

assert.ok(stateReport.includes('current Bangor materialization submits across those first-party lanes still return the same HTTP 500 error shell'));
assert.match(allStateReport, /Maine remains blocked on a broader public-but-unmaterialized DOE lane/i);
assert.ok(handoff.includes('## Current Focus State: Maine'));
assert.ok(handoff.includes('official_maine_contact_and_superintendent_selectors_are_live_but_current_bangor_materialization_posts_still_return_same_500_shell_plus_dhhs_office_html_has_no_county_contract'));
assert.ok(lessons.includes('### Multiple Live Official Selector Lanes Can Still Collapse Into One App-Side 500 Blocker'));

console.log('test-batch334-maine-live-selector-500-refresh-v1: ok');
