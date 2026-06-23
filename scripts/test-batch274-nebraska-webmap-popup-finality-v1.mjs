import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch274NebraskaWebmapPopupFinalityV1 } from './run-batch274-nebraska-webmap-popup-finality-v1.mjs';

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

const result = generateBatch274NebraskaWebmapPopupFinalityV1();
const summary = readJson('data/generated/nebraska_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/nebraska_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/nebraska_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/nebraska_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/nebraska_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const packet = readJson('data/generated/nebraska_county_local_disability_resources_service_area_packet_v1.json');
const batchSummary = readJson('data/generated/batch274_nebraska_webmap_popup_finality_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/nebraska-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_public_office_service_root_has_no_tables_and_office_schema_has_no_service_area_fields');

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(gap.family_status, 'blocked_public_office_service_root_without_assignment_contract');
assert.match(gap.status_reason, /referenced public web map item/i);
assert.match(gap.status_reason, /office popup only renders office address, phone\/toll-free\/hours\/scanning fields/i);

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(failure.failure_code, 'official_public_office_service_root_has_no_tables_no_relationships_and_webmap_popup_only_materializes_contact_fields');
assert.match(failure.evidence, /4bdbf8e8703743b0b2ff290f98737825\/data\?f=json/);
assert.match(failure.evidence, /County Boundary/);
assert.match(failure.evidence, /Google Maps directions/);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(verified.family_status, 'blocked_public_office_service_root_without_assignment_contract');
assert.equal(verified.sample_count, 6);
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Nebraska referenced web map popup config'));

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(next.next_action, 'hold_blocked_until_official_service_area_table_or_county_assignment_artifact_exists');

const queue = queueRows.find((row) => row.state === 'nebraska');
assert.equal(queue.status, 'BLOCKED');
assert.equal(queue.primary_gap_reason, 'official_public_office_service_root_has_no_tables_and_office_schema_has_no_service_area_fields');

assert.equal(packet.current_problem_metrics.webMapPopupHasCountyAssignmentFields, false);
assert.equal(packet.current_problem_metrics.countyPopupOnlyShowsBoundaryFields, true);
assert.equal(packet.current_problem_metrics.officePopupOnlyShowsContactFields, true);
assert.equal(packet.current_problem_metrics.officePopupExpressionsAreAddressAndEditMetadataOnly, true);

assert.equal(batchSummary.webmap_popup_has_county_assignment_fields, false);
assert.equal(batchSummary.office_popup_only_shows_contact_fields, true);
assert.ok(report.includes('public FeatureServer root, county layer, and office popup configuration still expose no county-to-office assignment contract'));
assert.ok(handoff.includes('## Current Focus State: Nebraska'));
assert.ok(handoff.includes('Referenced public web map data JSON'));
assert.ok(lessons.includes('### Popup Templates That Only Render Contact Cards Do Not Create A Hidden County Contract'));

console.log('test-batch274-nebraska-webmap-popup-finality-v1: ok');
