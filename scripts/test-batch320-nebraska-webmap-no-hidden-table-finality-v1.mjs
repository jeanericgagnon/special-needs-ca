import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch320NebraskaWebMapNoHiddenTableFinalityV1 } from './run-batch320-nebraska-webmap-no-hidden-table-finality-v1.mjs';

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

const result = generateBatch320NebraskaWebMapNoHiddenTableFinalityV1();
const summary = readJson('data/generated/nebraska_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/nebraska_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/nebraska_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/nebraska_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/nebraska_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/nebraska-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const batchSummary = readJson('data/generated/batch320_nebraska_webmap_no_hidden_table_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch320-nebraska-webmap-no-hidden-table-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'recovered_public_office_stack_still_has_no_hidden_table_assignment_bridge_and_only_42_offices_for_93_counties');

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(gap);
assert.equal(gap.family_status, 'blocked_republished_public_office_stack_without_hidden_assignment_bridge');
assert.match(gap.status_reason, /two operational layers and zero tables/i);
assert.match(gap.status_reason, /closest-feature office layer/i);

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(failure);
assert.equal(failure.failure_code, summary.primary_gap_reason);
assert.match(failure.evidence, /Public-Assistance-Offices\.aspx/);
assert.match(failure.evidence, /one web map data source/i);
assert.match(failure.evidence, /zero tables/i);
assert.match(failure.evidence, /closest-feature output schema/i);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(verified);
assert.equal(verified.blocker_code, failure.failure_code);
assert.match(verified.blocker_evidence, /two-layer web map, zero tables/i);
assert.equal(verified.sample_count, 7);
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Nebraska public web map has no tables'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Nebraska closest-feature output mirrors office schema'));

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(next);
assert.equal(next.next_action, 'hold_blocked_until_official_service_area_table_county_assignment_artifact_or_new_public_resource_is_published');
assert.match(next.evidence, /zero tables/i);
assert.match(next.evidence, /closest-feature output/i);

const nebraskaQueue = queueRows.find((row) => row.state === 'nebraska');
assert.ok(nebraskaQueue);
assert.equal(nebraskaQueue.primary_gap_reason, summary.primary_gap_reason);

const nebraskaAudit = allStateAudit.states.find((row) => row.stateId === 'nebraska');
assert.ok(nebraskaAudit);
assert.equal(nebraskaAudit.packetBatch, 'batch320_nebraska_webmap_no_hidden_table_finality_v1');
assert.equal(nebraskaAudit.packetPrimaryGapReason, summary.primary_gap_reason);

assert.equal(batchSummary.webmap_operational_layers, 2);
assert.equal(batchSummary.webmap_tables, 0);
assert.equal(batchSummary.closest_feature_output_mirrors_office_schema, true);
assert.equal(batchSummary.office_count, 42);
assert.equal(batchSummary.county_count, 93);
assert.equal(batchSummary.distinct_office_counties, 37);

assert.match(stateReport, /two-layer web map, no tables/i);
assert.match(handoff, /## Current Focus State: Nebraska/);
assert.match(handoff, /zero tables/);
assert.match(handoff, /closest-feature office output/);
assert.match(lessons, /### Closest-Feature Widget Outputs Do Not Create A County Contract/);
assert.match(allStateReport, /closest-feature office output/i);
assert.match(batchReport, /two operational layers and zero tables/i);

const completeCount = allStateAudit.states.filter((row) => row.classification === 'COMPLETE').length;
const blockedCount = allStateAudit.states.filter((row) => row.classification === 'BLOCKED').length;
assert.equal(completeCount, 24);
assert.equal(blockedCount, 26);

console.log('test-batch320-nebraska-webmap-no-hidden-table-finality-v1: ok');
