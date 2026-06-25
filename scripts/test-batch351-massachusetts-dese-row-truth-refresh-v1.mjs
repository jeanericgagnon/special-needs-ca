import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch351MassachusettsDeseRowTruthRefreshV1 } from './run-batch351-massachusetts-dese-row-truth-refresh-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  const raw = fs.readFileSync(path.join(repoRoot, relativePath), 'utf8').trim();
  if (!raw) return [];
  return raw.split('\n').map((line) => JSON.parse(line));
}

const result = generateBatch351MassachusettsDeseRowTruthRefreshV1();
const summary = readJson('data/generated/massachusetts_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/massachusetts_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/massachusetts_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/massachusetts_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/massachusetts_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const educationPacket = readJson('data/generated/massachusetts_district_or_county_education_routing_postback_packet_v1.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/massachusetts-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const batchSummary = readJson('data/generated/batch351_massachusetts_dese_row_truth_refresh_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch351-massachusetts-dese-row-truth-refresh-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.batch, 'batch351_massachusetts_dese_row_truth_refresh_v1');
assert.equal(summary.primary_gap_reason, 'exact_dese_hidden_postback_replay_materializes_district_rows_but_zero_county_contract_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export');
assert.equal(summary.recommended_batch, 'hold_for_county_keyed_contract_or_reviewed_capture');
assert.equal(summary.familyStatuses.district_or_county_education_routing, 'blocked_exact_dese_replay_renders_rows_but_zero_county_contract');

const gap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(gap.family_status, 'blocked_exact_dese_replay_renders_rows_but_zero_county_contract');
assert.match(gap.status_reason, /still materializes real DESE district rows/i);
assert.match(gap.status_reason, /zero county filter/i);

const failure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(failure.failure_code, 'exact_dese_hidden_postback_replay_renders_real_district_rows_but_zero_county_fields_or_export');
assert.match(failure.evidence, /hundreds of `superintendent` and `grades served` occurrences/i);
assert.match(failure.evidence, /only `county` occurrences are inside district names/i);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(verified.family_status, 'blocked_exact_dese_replay_renders_rows_but_zero_county_contract');
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://profiles.doe.mass.edu/search/get_closest_orgs.aspx'));

const next = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(next.next_action, 'hold_massachusetts_education_until_official_county_to_district_contract_or_reviewed_county_keyed_capture_exists');

const queueRow = queueRows.find((row) => row.state === 'massachusetts');
assert.equal(queueRow.primary_gap_reason, 'exact_dese_hidden_postback_replay_materializes_district_rows_but_zero_county_contract_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export');
assert.equal(queueRow.repair_lane, 'blocked_until_county_keyed_contract_or_reviewed_capture');

const auditRow = allStateAudit.states.find((row) => row.stateId === 'massachusetts');
assert.equal(auditRow.packetBatch, 'batch351_massachusetts_dese_row_truth_refresh_v1');
assert.equal(auditRow.packetPrimaryGapReason, 'exact_dese_hidden_postback_replay_materializes_district_rows_but_zero_county_contract_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export');
assert.equal(auditRow.familyStatuses.district_or_county_education_routing, 'blocked_exact_dese_replay_renders_rows_but_zero_county_contract');

assert.equal(educationPacket.current_problem_metrics.realPostbackResultSurface, true);
assert.equal(educationPacket.current_problem_metrics.countyMappingFieldsPresent, false);

assert.match(stateReport, /hidden DESE replay still renders real district rows/i);
assert.match(allStateReport, /Massachusetts remains blocked on a corrected DESE truth model/i);
assert.match(handoff, /Current Focus State: Massachusetts/);
assert.match(handoff, /search_link\.aspx/);
assert.match(handoff, /Next State Order After Massachusetts/);
assert.match(lessons, /A Generic-Titled ASP.NET Result Surface Can Still Contain Real Rows/);

assert.equal(batchSummary.hidden_replay_renders_real_rows, true);
assert.equal(batchSummary.rendered_result_has_county_fields, false);
assert.equal(batchSummary.result, 'real_dese_rows_without_county_contract');
assert.match(batchReport, /still materializes real DESE district rows/i);

console.log('test-batch351-massachusetts-dese-row-truth-refresh-v1: ok');
