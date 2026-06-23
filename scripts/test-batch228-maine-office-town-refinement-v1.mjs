import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch228MaineOfficeTownRefinementV1 } from './run-batch228-maine-office-town-refinement-v1.mjs';

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

const result = generateBatch228MaineOfficeTownRefinementV1();
const summary = readJson('data/generated/maine_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/maine_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/maine_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/maine_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/maine_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch228_maine_office_town_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/maine-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch228-maine-office-town-refinement-report-v1.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(batchSummary.dhhs_office_page_has_county_fields, false);
assert.equal(batchSummary.dhhs_office_page_has_town_fields, true);
assert.equal(batchSummary.dhhs_office_page_has_service_area_fields, false);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_district_office_locations_with_towns_but_without_county_crosswalk');
assert.match(countyGap.status_reason, /lists named office towns/i);
assert.match(countyGap.status_reason, /zero county names/i);
assert.doesNotMatch(countyGap.status_reason, /zero town terms/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'official_dhhs_office_page_lists_office_towns_but_has_no_county_or_service_area_crosswalk');
assert.match(countyFailure.evidence, /Bangor, Biddeford, Calais, Caribou, Ellsworth, Machias, Portland, and Skowhegan/i);
assert.match(countyFailure.evidence, /zero county names/i);
assert.match(countyFailure.evidence, /zero service-area fields/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_district_office_locations_with_towns_but_without_county_crosswalk');
assert.equal(countyVerified.blocker_code, 'official_dhhs_office_page_lists_office_towns_but_has_no_county_or_service_area_crosswalk');
assert.equal(countyVerified.query_basis, 'Reviewed the live official DHHS district office page and bounded locality-field presence, distinguishing office-town text from county/service-area mapping.');
assert.match(countyVerified.samples[0].evidence_snippet, /Bangor, Biddeford, Calais, Caribou, Ellsworth, Machias, Portland, and Skowhegan/i);
assert.match(countyVerified.samples[0].evidence_snippet, /never assigns counties or service areas/i);

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'find_official_county_or_service_area_crosswalk_for_named_dhhs_office_towns_or_keep_maine_counties_blocked');

assert.match(report, /official DHHS office page does list real office towns and map links/i);
assert.match(batchReport, /preserves real office towns, addresses, phones, emails, and map links/i);
assert.ok(lessons.includes('### Office-Town Text Is Not The Same As County Coverage'));

console.log('test-batch228-maine-office-town-refinement-v1: ok');
