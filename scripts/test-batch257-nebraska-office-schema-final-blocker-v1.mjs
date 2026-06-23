import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch257NebraskaOfficeSchemaFinalBlockerV1 } from './run-batch257-nebraska-office-schema-final-blocker-v1.mjs';

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

const result = generateBatch257NebraskaOfficeSchemaFinalBlockerV1();
const summary = readJson('data/generated/nebraska_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/nebraska_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/nebraska_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/nebraska_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/nebraska_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const packet = readJson('data/generated/nebraska_county_local_disability_resources_service_area_packet_v1.json');
const batchSummary = readJson('data/generated/batch257_nebraska_office_schema_final_blocker_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/nebraska-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_public_office_service_root_has_no_tables_and_office_schema_has_no_service_area_fields');

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(gap.family_status, 'blocked_public_office_service_root_without_assignment_contract');
assert.match(gap.status_reason, /tables: \[\]/i);
assert.match(gap.status_reason, /no service-area, assigned-counties, region, or coverage fields/i);

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(failure.failure_code, 'official_public_office_service_root_has_no_tables_no_relationships_and_only_37_distinct_counties');
assert.match(failure.evidence, /FeatureServer\?f=pjson/);
assert.match(failure.evidence, /tables: \[\]/);
assert.match(failure.evidence, /USER_Address_1, USER_City, USER_County/);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(verified.family_status, 'blocked_public_office_service_root_without_assignment_contract');
assert.equal(verified.sample_count, 4);
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Nebraska FeatureServer root'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Nebraska office feature layer schema'));

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(next.next_action, 'hold_blocked_until_official_service_area_table_or_county_assignment_artifact_exists');

const queue = queueRows.find((row) => row.state === 'nebraska');
assert.equal(queue.status, 'BLOCKED');
assert.equal(queue.primary_gap_reason, 'official_public_office_service_root_has_no_tables_and_office_schema_has_no_service_area_fields');

assert.equal(packet.current_problem_metrics.serviceRootTablesPresent, false);
assert.equal(packet.current_problem_metrics.officeLayerHasServiceAreaFields, false);
assert.equal(packet.current_problem_metrics.officeLayerHasMultiCountyValues, false);
assert.equal(packet.current_problem_metrics.distinctOfficeCounties, 37);

assert.equal(batchSummary.service_root_tables_present, false);
assert.equal(batchSummary.office_schema_has_service_area_fields, false);
assert.equal(batchSummary.office_layer_has_multi_county_values, false);
assert.ok(report.includes('county_local_disability_resources is now final-blocked more tightly'));
assert.ok(lessons.includes('### A Public FeatureServer With Tables Empty And Contact-Only Schema Is A Final Local-Office Blocker'));

console.log('test-batch257-nebraska-office-schema-final-blocker-v1: ok');
