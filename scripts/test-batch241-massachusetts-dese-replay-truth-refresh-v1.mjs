import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch241MassachusettsDeseReplayTruthRefreshV1 } from './run-batch241-massachusetts-dese-replay-truth-refresh-v1.mjs';

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

const result = generateBatch241MassachusettsDeseReplayTruthRefreshV1();
const summary = readJson('data/generated/massachusetts_california_grade_summary_v2.json');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const gapRows = readJsonl('data/generated/massachusetts_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/massachusetts_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/massachusetts_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/massachusetts_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch241_massachusetts_dese_replay_truth_refresh_summary_v1.json');
const educationPacket = readJson('data/generated/massachusetts_district_or_county_education_routing_postback_packet_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/massachusetts-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch241-massachusetts-dese-replay-truth-refresh-report-v1.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.primary_gap_reason, 'exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_dds_locations_lane_still_lacks_county_export');
assert.equal(queueRows.find((row) => row.state === 'massachusetts').primary_gap_reason, 'exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_dds_locations_lane_still_lacks_county_export');
assert.equal(summary.familyStatuses.district_or_county_education_routing, 'blocked_exact_dese_hidden_replay_without_materialized_local_rows');

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationGap.family_status, 'blocked_exact_dese_hidden_replay_without_materialized_local_rows');
assert.match(educationGap.status_reason, /no longer materializes district rows/i);
assert.match(educationGap.status_reason, /zero superintendent fields/i);

const educationFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationFailure.failure_code, 'exact_dese_hidden_postback_replay_returns_search_shell_without_local_rows');
assert.match(educationFailure.evidence, /three hidden fields/i);
assert.match(educationFailure.evidence, /zero `superintendent`/i);
assert.equal(educationFailure.next_action, 'hold_massachusetts_education_until_official_county_to_district_contract_or_reviewed_browser_capture_exists');

const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationVerified.family_status, 'blocked_exact_dese_hidden_replay_without_materialized_local_rows');
assert.equal(educationVerified.blocker_code, 'exact_dese_hidden_postback_replay_returns_search_shell_without_local_rows');

const educationNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationNext.next_action, 'hold_massachusetts_education_until_official_county_to_district_contract_or_reviewed_browser_capture_exists');

assert.equal(educationPacket.current_problem_metrics.realPostbackResultSurface, false);
assert.equal(educationPacket.current_problem_metrics.countyMappingFieldsPresent, false);
assert.ok(educationPacket.root_domains_to_review.some((line) => /do not assume the hidden bridge still materializes district rows/i.test(line)));
assert.match(educationPacket.packet_complete_when, /reviewed browser\/cached capture/i);

assert.equal(batchSummary.hidden_bridge_still_exists, true);
assert.equal(batchSummary.hidden_bridge_replay_materializes_local_rows, false);
assert.ok(report.includes('fresh exact replay now only returns the generic search shell'));
assert.ok(batchReport.includes('hidden-field replay now returns only the generic `Profiles Search` shell'));
assert.ok(lessons.includes('### Hidden-Field Bridges Need Fresh Replay Proof Before They Count As Results'));

console.log('test-batch241-massachusetts-dese-replay-truth-refresh-v1: ok');
