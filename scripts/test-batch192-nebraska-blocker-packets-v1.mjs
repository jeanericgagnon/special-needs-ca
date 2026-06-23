import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch192NebraskaBlockerPacketsV1 } from './run-batch192-nebraska-blocker-packets-v1.mjs';

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

generateBatch192NebraskaBlockerPacketsV1();

const summary = readJson('data/generated/nebraska_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/nebraska_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/nebraska_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/nebraska_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/nebraska_next_action_queue_v2.jsonl');
const educationPacket = readJson('data/generated/nebraska_district_or_county_education_routing_local_contract_packet_v1.json');
const countyPacket = readJson('data/generated/nebraska_county_local_disability_resources_service_area_packet_v1.json');
const batchSummary = readJson('data/generated/batch192_nebraska_blocker_packets_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/nebraska-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.match(byFamily.get('district_or_county_education_routing').status_reason, /SPED Contact List-Directory by Topic/i);
assert.match(byFamily.get('county_local_disability_resources').status_reason, /42 office rows and 37 distinct USER_County values/i);

const eduFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(eduFailure.evidence, /SPED-Calling-Tree-January-2026\.pdf/i);
assert.match(eduFailure.evidence, /ESU 9 Deaf or Hard of Hearing/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(countyFailure.evidence, /county-boundary layer carries only county geometry fields/i);

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(eduVerified.query_basis, /deterministic local-contract blocker packet/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(countyVerified.query_basis, /deterministic service-area blocker packet/i);

assert.equal(nextRows.find((row) => row.family === 'district_or_county_education_routing').next_action, 'hold_blocked_until_live_official_county_to_esu_or_district_contract_is_reviewed');
assert.equal(nextRows.find((row) => row.family === 'county_local_disability_resources').next_action, 'hold_blocked_until_official_service_area_or_full_county_office_contract_is_reviewed');

assert.equal(educationPacket.repair_lane, 'browser_or_cached_capture_only');
assert.equal(educationPacket.current_problem_metrics.countyRowCount, 93);
assert.equal(educationPacket.current_problem_metrics.topicDirectoryPdfLive, true);
assert.equal(educationPacket.current_problem_metrics.reviewedLocalLeafCount, 1);
assert.ok(educationPacket.representative_sources.includes('https://www.education.ne.gov/wp-content/uploads/2025/11/SPED-Calling-Tree-January-2026.pdf'));

assert.equal(countyPacket.repair_lane, 'service_area_contract_audit_only');
assert.equal(countyPacket.current_problem_metrics.countyTotal, 93);
assert.equal(countyPacket.current_problem_metrics.officeLayerRows, 42);
assert.equal(countyPacket.current_problem_metrics.officeLayerDistinctCounties, 37);
assert.equal(countyPacket.current_problem_metrics.countyBoundaryLayerHasAssignmentFields, false);

assert.equal(batchSummary.education_packet_created, true);
assert.equal(batchSummary.county_packet_created, true);
assert.equal(batchSummary.blocker_basis, 'live_sped_topic_directory_plus_open_office_config_packetization');

assert.match(report, /topic directory PDF/i);
assert.match(report, /public office layer only names 37 counties/i);
assert.match(lessons, /State Packetize Open-But-Incomplete Official Apps Once The Exact Layers Are Known/);

console.log('test-batch192-nebraska-blocker-packets-v1: ok');
