import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch223NebraskaOfficeRelationshipAuditV1 } from './run-batch223-nebraska-office-relationship-audit-v1.mjs';

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

const result = generateBatch223NebraskaOfficeRelationshipAuditV1();
const summary = readJson('data/generated/nebraska_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/nebraska_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/nebraska_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/nebraska_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/nebraska_next_action_queue_v2.jsonl');
const packet = readJson('data/generated/nebraska_county_local_disability_resources_service_area_packet_v1.json');
const batchSummary = readJson('data/generated/batch223_nebraska_office_relationship_audit_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/nebraska-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(gap.family_status, 'blocked_public_office_layers_without_service_area_relationships');
assert.match(gap.status_reason, /two public layers/i);
assert.match(gap.status_reason, /no relationships/i);

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(failure.failure_code, 'official_public_office_app_has_only_two_public_layers_and_no_service_area_relationships');
assert.match(failure.evidence, /FeatureServer\/0/i);
assert.match(failure.evidence, /for offices and \/1 for counties/i);
assert.match(failure.evidence, /relationships` is an empty array/i);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(verified.family_status, 'blocked_public_office_layers_without_service_area_relationships');
assert.equal(verified.sample_count, 3);
assert.ok(verified.samples.some((sample) => /office feature layer/i.test(sample.sample_name)));

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(next.next_action, 'hold_blocked_until_official_service_area_or_county_assignment_contract_exists');

assert.equal(packet.current_problem_metrics.officeLayerRelationshipsPresent, false);
assert.equal(packet.current_problem_metrics.countyLayerRelationshipsPresent, false);
assert.equal(packet.current_problem_metrics.publicOfficeCount, 42);
assert.equal(packet.current_problem_metrics.publicCountyCount, 93);

assert.equal(batchSummary.office_layer_relationships_present, false);
assert.equal(batchSummary.county_layer_relationships_present, false);
assert.ok(report.includes('neither layer has relationships or related tables'));
assert.ok(lessons.includes('### No Relationships Means No Hidden Service-Area Bridge'));
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);

console.log('test-batch223-nebraska-office-relationship-audit-v1: ok');
