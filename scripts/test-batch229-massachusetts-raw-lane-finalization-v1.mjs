import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch229MassachusettsRawLaneFinalizationV1 } from './run-batch229-massachusetts-raw-lane-finalization-v1.mjs';

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

const result = generateBatch229MassachusettsRawLaneFinalizationV1();
const summary = readJson('data/generated/massachusetts_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/massachusetts_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/massachusetts_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/massachusetts_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/massachusetts_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch229_massachusetts_raw_lane_finalization_summary_v1.json');
const countyPacket = readJson('data/generated/massachusetts_county_local_disability_resources_town_routing_packet_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/massachusetts-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch229-massachusetts-raw-lane-finalization-report-v1.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(batchSummary.dese_rendered_result_has_zero_county_occurrences, true);
assert.equal(batchSummary.dds_locations_raw_fetch_403, true);
assert.equal(batchSummary.dds_interactive_map_raw_fetch_403, true);

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationGap.family_status, 'blocked_official_dese_postback_results_without_county_mapping');
assert.match(educationGap.status_reason, /zero county occurrences/i);
assert.match(educationGap.status_reason, /no county column/i);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_live_dds_browser_lane_without_raw_county_contract');
assert.match(countyGap.status_reason, /raw checks.*403/i);
assert.match(countyGap.status_reason, /no machine-readable county crosswalk/i);

const educationFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationFailure.failure_code, 'official_dese_postback_results_have_zero_county_fields_in_rendered_html');
assert.match(educationFailure.evidence, /zero county occurrences/i);
assert.equal(educationFailure.next_action, 'hold_massachusetts_education_until_official_county_to_district_contract_exists');

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'live_dds_browser_lane_exists_but_exact_raw_pages_403_and_no_county_crosswalk_exists');
assert.match(countyFailure.evidence, /returned HTTP 403/i);
assert.equal(countyFailure.next_action, 'hold_massachusetts_dds_until_county_crosswalk_or_reviewed_browser_capture_exists');

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_live_dds_browser_lane_without_raw_county_contract');
assert.equal(countyVerified.blocker_code, 'live_dds_browser_lane_exists_but_exact_raw_pages_403_and_no_county_crosswalk_exists');

assert.ok(countyPacket.root_domains_to_review[0].includes('exact raw pages are source-final for low-token mode'));
assert.ok(report.includes('exact raw fetches still 403'));
assert.ok(batchReport.includes('both exact raw fetches return HTTP 403'));
assert.ok(lessons.includes('### Browser-Readable State Pages Can Still Be Raw-Fetch Final'));

console.log('test-batch229-massachusetts-raw-lane-finalization-v1: ok');
