import fs from 'fs';
import path from 'path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'url';
import { generateBatch184MainePublicSelectorScopeRefinementV1 } from './run-batch184-maine-public-selector-scope-refinement-v1.mjs';

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

generateBatch184MainePublicSelectorScopeRefinementV1();

const summary = readJson('data/generated/maine_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/maine_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/maine_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/maine_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/maine_next_action_queue_v2.jsonl');
const educationPacket = readJson('data/generated/maine_district_or_county_education_routing_manual_export_packet_v1.json');
const batchSummary = readJson('data/generated/batch184_maine_public_selector_scope_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/maine-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.primary_gap_reason, 'public_neo_selector_inventory_is_live_but_result_export_actions_return_500_and_dhhs_office_directory_lacks_county_or_town_mapping');

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(educationGap.status_reason, /public NEO Town selector/i);
assert.match(educationGap.status_reason, /Primary Contacts By Organization selector/i);
assert.match(educationGap.status_reason, /SAU-by-municipality workbook/i);

const educationFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationFailure.failure_code, 'public_selector_inventory_live_but_result_export_actions_return_500');
assert.match(educationFailure.evidence, /Town selector page is live/i);
assert.match(educationFailure.evidence, /Primary Contacts By Organization page is live/i);
assert.match(educationFailure.evidence, /workbook is still downloadable/i);

const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationVerified.blocker_code, 'public_selector_inventory_live_but_result_export_actions_return_500');
assert.equal(educationVerified.sample_count, 4);
assert.ok(educationVerified.samples.find((row) => row.source_url === 'https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town'));
assert.ok(educationVerified.samples.find((row) => row.source_url === 'https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx'));

const educationNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationNext.next_action, 'use_live_town_and_org_selectors_plus_workbook_for_reviewed_browser_capture_or_manual_export');

assert.equal(educationPacket.current_problem_metrics.reviewedTownSelectorLive, true);
assert.equal(educationPacket.current_problem_metrics.reviewedOrgSelectorLive, true);
assert.equal(educationPacket.current_problem_metrics.workbookStillDownloadable, true);
assert.equal(educationPacket.current_problem_metrics.selectorDiscoverySolved, true);

assert.equal(batchSummary.town_selector_live, true);
assert.equal(batchSummary.org_selector_live, true);
assert.equal(batchSummary.result_step_still_blocked, true);
assert.match(report, /selector inventory is now clearly public/i);
assert.match(lessons, /Separate Live Selector Inventory From Broken Result Actions/);

console.log('test-batch184-maine-public-selector-scope-refinement-v1: ok');
