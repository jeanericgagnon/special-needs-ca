import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

const summary = readJson('data/generated/oklahoma_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/oklahoma_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/oklahoma_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/oklahoma_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/oklahoma_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/oklahoma-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const batchSummary = readJson('data/generated/batch325_oklahoma_widget_partiality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch325-oklahoma-widget-partiality-report-v1.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.batch, 'batch325_oklahoma_widget_partiality_v1');
assert.equal(summary.primary_gap_reason, 'live_okdhs_public_county_widget_only_publishes_adair_and_alfalfa_while_kml_still_yields_only_45_benefit_capable_counties_and_no_contract_for_remaining_32');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_okdhs_public_county_widget_partial_and_kml_service_limited');
assert.match(countyGap.status_reason, /only two county entries/);
assert.match(countyGap.status_reason, /Adair and Alfalfa/);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'okdhs_public_county_widget_is_partial_to_adair_and_alfalfa_while_kml_and_child_support_tree_still_do_not_close_remaining_32');
assert.match(countyFailure.evidence, /only contains county entities for Adair and Alfalfa/);
assert.match(countyFailure.evidence, /remaining 32 counties/);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.sample_count, 6);
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'Oklahoma Human Services public widget feed'));
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'Oklahoma Human Services mapconfig2 model'));

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(countyNext.evidence, /Adair and Alfalfa/);

const queueRow = queueRows.find((row) => row.state === 'oklahoma');
assert.equal(queueRow.primary_gap_reason, 'live_okdhs_public_county_widget_only_publishes_adair_and_alfalfa_while_kml_still_yields_only_45_benefit_capable_counties_and_no_contract_for_remaining_32');

const auditRow = allStateAudit.states.find((row) => row.stateId === 'oklahoma');
assert.equal(auditRow.packetBatch, 'batch325_oklahoma_widget_partiality_v1');
assert.equal(auditRow.packetPrimaryGapReason, 'live_okdhs_public_county_widget_only_publishes_adair_and_alfalfa_while_kml_still_yields_only_45_benefit_capable_counties_and_no_contract_for_remaining_32');
assert.equal(auditRow.familyStatuses.county_local_disability_resources, 'blocked_okdhs_public_county_widget_partial_and_kml_service_limited');

assert.match(stateReport, /public county widget only publishes Adair and Alfalfa/);
assert.match(allStateReport, /county widget only publishes Adair and Alfalfa/);
assert.match(handoff, /Current Focus State: Oklahoma/);
assert.match(handoff, /mapconfig2 model/);
assert.match(handoff, /Adair and Alfalfa/);
assert.match(lessons, /Public County Widgets Can Be Much Narrower Than The Backing Map Feed/);

assert.equal(batchSummary.widget_leaf_status, 200);
assert.equal(batchSummary.widget_leaf_final_url, 'https://oklahoma.gov/okdhs/contact-us.html');
assert.equal(batchSummary.widget_feed_county_count, 2);
assert.deepEqual(batchSummary.widget_feed_counties, ['Adair', 'Alfalfa']);
assert.equal(batchSummary.widget_config_county_count, 2);
assert.deepEqual(batchSummary.widget_config_counties, ['Adair', 'Alfalfa']);
assert.equal(batchSummary.remaining_county_gap_count, 32);
assert.ok(batchReport.includes('public county widget itself only publishes Adair and Alfalfa'));

console.log('test-batch325-oklahoma-widget-partiality-v1: ok');
