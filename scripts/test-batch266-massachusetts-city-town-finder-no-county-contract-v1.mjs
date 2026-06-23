import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch266MassachusettsCityTownFinderNoCountyContractV1 } from './run-batch266-massachusetts-city-town-finder-no-county-contract-v1.mjs';

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

const result = generateBatch266MassachusettsCityTownFinderNoCountyContractV1();
const summary = readJson('data/generated/massachusetts_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/massachusetts_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/massachusetts_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/massachusetts_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/massachusetts_next_action_queue_v2.jsonl');
const priorityRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const batchSummary = readJson('data/generated/batch266_massachusetts_city_town_finder_no_county_contract_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/massachusetts-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export');
assert.equal(summary.final_blockers[0].failure_code, 'exact_dese_hidden_postback_replay_and_live_city_town_finder_still_do_not_expose_county_grade_local_rows');

const gap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(gap.family_status, 'blocked_exact_dese_hidden_replay_and_city_town_finder_without_county_contract');
assert.match(gap.status_reason, /address\/city\/town based/i);
assert.match(gap.status_reason, /no county label/i);

const failure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(failure.failure_code, 'exact_dese_hidden_postback_replay_and_live_city_town_finder_still_do_not_expose_county_grade_local_rows');
assert.match(failure.evidence, /get_closest_orgs\.aspx/i);
assert.match(failure.evidence, /address, city or town, and distance/i);
assert.match(failure.evidence, /no county selector/i);
assert.match(failure.evidence, /no export or mailing-label lane/i);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(verified.sample_count, 4);
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://profiles.doe.mass.edu/search/get_closest_orgs.aspx'));

const next = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(next.failure_code, 'exact_dese_hidden_postback_replay_and_live_city_town_finder_still_do_not_expose_county_grade_local_rows');
assert.equal(next.next_action, 'hold_massachusetts_education_until_official_county_to_district_contract_or_reviewed_browser_capture_exists');

const queueRow = priorityRows.find((row) => (row.state_name || row.state) === 'Massachusetts');
assert.equal(queueRow.classification, 'BLOCKED');
assert.equal(queueRow.index_safe, false);
assert.equal(queueRow.primary_gap_reason, 'exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export');

assert.equal(batchSummary.school_finder_contract, 'address_city_town_only_no_county_no_export');
assert.match(report, /School Finder is only address\/city\/town based/i);
assert.ok(handoff.includes('## Current Focus State: Massachusetts'));
assert.ok(handoff.includes('exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export'));
assert.ok(lessons.includes('### A Live Official School Finder That Only Accepts Address, City, Or Town Still Does Not Clear County-Grade Routing'));

console.log('test-batch266-massachusetts-city-town-finder-no-county-contract-v1: ok');
