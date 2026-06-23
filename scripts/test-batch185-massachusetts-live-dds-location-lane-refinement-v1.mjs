import fs from 'fs';
import path from 'path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'url';
import { generateBatch185MassachusettsLiveDdsLocationLaneRefinementV1 } from './run-batch185-massachusetts-live-dds-location-lane-refinement-v1.mjs';

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

generateBatch185MassachusettsLiveDdsLocationLaneRefinementV1();

const summary = readJson('data/generated/massachusetts_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/massachusetts_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/massachusetts_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/massachusetts_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/massachusetts_next_action_queue_v2.jsonl');
const countyPacket = readJson('data/generated/massachusetts_county_local_disability_resources_host403_packet_v1.json');
const batchSummary = readJson('data/generated/batch185_massachusetts_live_dds_location_lane_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/massachusetts-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.primary_gap_reason, 'official_dese_hidden_postback_bridge_renders_real_district_rows_but_no_county_contract_and_live_dds_locations_lane_still_lacks_county_export');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_live_dds_locations_and_interactive_map_without_county_contract');
assert.match(countyGap.status_reason, /org page, the org-locations index, and the interactive DDS regional map/i);
assert.match(countyGap.status_reason, /no county column, county export, or machine-readable town list/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'live_dds_locations_and_interactive_map_without_county_contract');
assert.match(countyFailure.evidence, /renders 28 results/i);
assert.match(countyFailure.evidence, /dds-area-offices.*404/i);
assert.match(countyFailure.evidence, /town or city/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.blocker_code, 'live_dds_locations_and_interactive_map_without_county_contract');
assert.equal(countyVerified.sample_count, 4);
assert.ok(countyVerified.samples.find((row) => row.source_url === 'https://www.mass.gov/orgs/department-of-developmental-services/locations'));
assert.ok(countyVerified.samples.find((row) => row.source_url === 'https://www.mass.gov/info-details/interactive-dds-regional-map'));
assert.ok(countyVerified.samples.find((row) => row.source_url === 'https://www.mass.gov/info-details/dds-area-offices' && row.verification_status === 'blocked'));

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'use_live_massachusetts_dds_locations_and_interactive_map_for_browser_or_cached_town_to_office_capture_only');

assert.equal(countyPacket.current_problem_metrics.liveOrgPageAccessible, true);
assert.equal(countyPacket.current_problem_metrics.liveLocationsIndexAccessible, true);
assert.equal(countyPacket.current_problem_metrics.liveInteractiveMapAccessible, true);
assert.equal(countyPacket.current_problem_metrics.staleAreaOfficesPath404, true);
assert.equal(countyPacket.current_problem_metrics.hostWide403Surfaces, 0);
assert.equal(countyPacket.repair_lane, 'browser_or_cached_town_to_office_capture_only');

assert.equal(batchSummary.dds_org_page_live, true);
assert.equal(batchSummary.dds_locations_index_live, true);
assert.equal(batchSummary.dds_interactive_map_live, true);
assert.equal(batchSummary.stale_area_offices_path_404, true);
assert.equal(batchSummary.county_contract_still_missing, true);
assert.match(report, /org page, locations index, and interactive map are live/i);
assert.match(lessons, /Replace Stale 403 Assumptions With Exact Child-Surface Rechecks/);

console.log('test-batch185-massachusetts-live-dds-location-lane-refinement-v1: ok');
