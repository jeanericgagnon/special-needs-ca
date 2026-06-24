import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch327NebraskaConfigResourceFinalityV1 } from './run-batch327-nebraska-config-resource-finality-v1.mjs';

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

const result = generateBatch327NebraskaConfigResourceFinalityV1();
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
const batchSummary = readJson('data/generated/batch327_nebraska_config_resource_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch327-nebraska-config-resource-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'public_nebraska_office_config_still_only_references_one_web_map_and_a_closest_feature_output_while_the_feature_service_stops_at_42_offices_for_93_counties');

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(gap);
assert.equal(gap.family_status, 'blocked_public_config_confirms_no_county_assignment_datasource');
assert.match(gap.status_reason, /config\/config\.json/i);
assert.match(gap.status_reason, /closest feature/i);

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(failure);
assert.equal(failure.failure_code, summary.primary_gap_reason);
assert.match(failure.evidence, /config\/config\.json/i);
assert.match(failure.evidence, /closest feature/i);
assert.match(failure.evidence, /42 office rows against 93 county rows/i);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(verified);
assert.equal(verified.blocker_code, failure.failure_code);
assert.match(verified.blocker_evidence, /closest-feature output/i);
assert.equal(verified.sample_count, 6);
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Nebraska ExperienceBuilder resource config'));

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(next);
assert.equal(next.next_action, 'hold_blocked_until_official_service_area_table_county_assignment_artifact_or_new_public_resource_is_published');
assert.match(next.evidence, /closest-feature output/i);

const neQueue = queueRows.find((row) => row.state === 'nebraska');
assert.ok(neQueue);
assert.equal(neQueue.primary_gap_reason, summary.primary_gap_reason);

const neAudit = allStateAudit.states.find((row) => row.stateId === 'nebraska');
assert.ok(neAudit);
assert.equal(neAudit.packetBatch, 'batch327_nebraska_config_resource_finality_v1');
assert.equal(neAudit.packetPrimaryGapReason, summary.primary_gap_reason);

assert.equal(batchSummary.webmap_operational_layers, 2);
assert.equal(batchSummary.webmap_tables, 0);
assert.equal(batchSummary.config_references_single_webmap, true);
assert.equal(batchSummary.config_references_closest_feature_only, true);
assert.equal(batchSummary.office_count, 42);
assert.equal(batchSummary.county_count, 93);
assert.equal(batchSummary.distinct_office_counties, 37);

assert.match(stateReport, /public ExperienceBuilder resource config/i);
assert.match(handoff, /## Current Focus State: Nebraska/);
assert.match(handoff, /config\/config\.json/i);
assert.match(lessons, /### Public ExperienceBuilder Configs Can Prove The Missing Datasource/);
assert.match(allStateReport, /public ExperienceBuilder config itself/i);
assert.match(batchReport, /one web map item, one `closest feature` output layer/i);

const completeCount = allStateAudit.states.filter((row) => row.classification === 'COMPLETE').length;
const blockedCount = allStateAudit.states.filter((row) => row.classification === 'BLOCKED').length;
assert.equal(completeCount, 26);
assert.equal(blockedCount, 24);

console.log('test-batch327-nebraska-config-resource-finality-v1: ok');
