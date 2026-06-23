import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch290NebraskaLiveFinalitySyncV1 } from './run-batch290-nebraska-live-finality-sync-v1.mjs';

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

const result = generateBatch290NebraskaLiveFinalitySyncV1();
assert.equal(result.classification, 'BLOCKED');
assert.equal(result.index_safe, false);
assert.equal(result.office_layer_rows, 42);
assert.equal(result.distinct_office_counties, 37);
assert.equal(result.datasource_registry_only_has_locator_outputs, true);

const summary = readJson('data/generated/nebraska_california_grade_summary_v2.json');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_public_office_service_root_has_no_tables_and_office_schema_has_no_service_area_fields');
assert.equal(summary.final_blockers[0].failure_code, 'official_public_office_service_root_has_no_tables_no_relationships_and_datasource_registry_only_materializes_locator_outputs');
assert.match(summary.final_blockers[0].evidence, /42 office points/i);
assert.match(summary.final_blockers[0].evidence, /37 office counties|37 distinct `USER_County` values/i);

const packet = readJson('data/generated/nebraska_county_local_disability_resources_service_area_packet_v1.json');
assert.equal(packet.current_problem_metrics.officeLayerRows, 42);
assert.equal(packet.current_problem_metrics.officeLayerDistinctCounties, 37);
assert.equal(packet.current_problem_metrics.officeLayerRelationshipsPresent, false);
assert.equal(packet.current_problem_metrics.countyLayerRelationshipsPresent, false);

const gapRows = readJsonl('data/generated/nebraska_gap_matrix_v2.jsonl');
const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_public_office_service_root_without_assignment_contract');
assert.match(countyGap.status_reason, /42 office points/i);
assert.match(countyGap.status_reason, /37 distinct `USER_County` values/i);

const failureRows = readJsonl('data/generated/nebraska_failure_ledger_v2.jsonl');
const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'official_public_office_service_root_has_no_tables_no_relationships_and_datasource_registry_only_materializes_locator_outputs');
assert.match(countyFailure.evidence, /ArcGIS World Geocoding Service/i);

const verifiedRows = readJsonl('data/generated/nebraska_verified_sources_v1.jsonl');
const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_public_office_service_root_without_assignment_contract');
assert.ok(countyVerified.samples.some((sample) => sample.sample_name === 'Nebraska ExperienceBuilder datasource registry'));
assert.ok(countyVerified.samples.some((sample) => sample.sample_name === 'Nebraska office layer schema'));
assert.ok(countyVerified.samples.some((sample) => sample.sample_name === 'Nebraska county boundary layer schema'));
assert.ok(countyVerified.samples.some((sample) => sample.sample_name === 'Nebraska distinct office counties query'));

const nextRows = readJsonl('data/generated/nebraska_next_action_queue_v2.jsonl');
const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'hold_blocked_until_official_service_area_table_or_county_assignment_artifact_exists');
assert.match(countyNext.evidence, /37 office counties|37 distinct `USER_County` values/i);

const audit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const nebraskaAudit = audit.states.find((row) => row.stateId === 'nebraska');
assert.equal(nebraskaAudit.classification, 'BLOCKED');
assert.equal(nebraskaAudit.indexSafe, false);
assert.equal(nebraskaAudit.packetPrimaryGapReason, 'official_public_office_service_root_has_no_tables_and_office_schema_has_no_service_area_fields');

const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const queue = queueRows.find((row) => row.state === 'nebraska');
assert.equal(queue.classification, 'BLOCKED');
assert.equal(queue.index_safe, false);
assert.equal(queue.primary_gap_reason, 'official_public_office_service_root_has_no_tables_and_office_schema_has_no_service_area_fields');

const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/nebraska-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /42 office points, county boundaries, and locator outputs/i);

const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
assert.match(handoff, /## Current Focus State: Nebraska/);
assert.doesNotMatch(handoff, /## Current Focus State: Kansas/);
assert.match(handoff, /42 office points/i);
assert.match(handoff, /37 distinct `USER_County` values/i);
assert.match(handoff, /## Next State Order After Nebraska/);

const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
assert.match(allStateReport, /Nebraska remains blocked because the official county-local office stack still exposes no public county-to-office assignment contract beyond locator outputs/);

const batchSummary = readJson('data/generated/batch290_nebraska_live_finality_sync_summary_v1.json');
assert.equal(batchSummary.office_layer_rows, 42);
assert.equal(batchSummary.distinct_office_counties, 37);

const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch290-nebraska-live-finality-sync-report-v1.md'), 'utf8');
assert.match(batchReport, /37 distinct `USER_County` values/i);

console.log('test-batch290-nebraska-live-finality-sync-v1: ok');
