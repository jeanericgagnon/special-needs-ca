import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch246NorthCarolinaQueueSignalRefreshV1 } from './run-batch246-north-carolina-queue-signal-refresh-v1.mjs';

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

const result = generateBatch246NorthCarolinaQueueSignalRefreshV1();
const summary = readJson('data/generated/north-carolina_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/north-carolina_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/north-carolina_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/north-carolina_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/north-carolina_next_action_queue_v2.jsonl');
const educationPacket = readJson('data/generated/north-carolina_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const countyPacket = readJson('data/generated/north-carolina_county_local_disability_resources_local_office_packet_v1.json');
const batchSummary = readJson('data/generated/batch246_north_carolina_queue_signal_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/north-carolina-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'generic_or_statewide_evidence_used_where_local_required');

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(eduGap.status_reason, /4 inventory rows use DB-field agency labels/i);
assert.match(eduGap.status_reason, /49 rows show federal\/state mismatch/i);
assert.match(eduGap.status_reason, /12 generic roots still need exact leaf verification/i);
assert.match(countyGap.status_reason, /DOI mirror/i);
assert.match(countyGap.status_reason, /same weak-signal queue contamination/i);

const eduFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(eduFailure.evidence, /queue-cleanup gap/i);
assert.match(countyFailure.evidence, /queue-cleanup packet/i);

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(eduVerified.query_basis, /shared queue-signal audit/i);
assert.match(countyVerified.query_basis, /shared queue-signal audit/i);

for (const row of nextRows.filter((row) => ['district_or_county_education_routing','county_local_disability_resources'].includes(row.family))) {
  assert.equal(row.evidence, '4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 12 generic roots need leaf verification');
}

assert.equal(educationPacket.current_metrics.dbFieldAgencyRows, 4);
assert.equal(educationPacket.current_metrics.federalStateMismatchRows, 49);
assert.equal(educationPacket.current_metrics.genericRootsNeedingLeafVerification, 12);
assert.equal(educationPacket.shared_queue_contamination_signature, '4_db_field_labels__49_federal_state_mismatches__12_generic_roots');

assert.equal(countyPacket.current_metrics.dbFieldAgencyRows, 4);
assert.equal(countyPacket.current_metrics.federalStateMismatchRows, 49);
assert.equal(countyPacket.current_metrics.genericRootsNeedingLeafVerification, 12);
assert.equal(countyPacket.shared_queue_contamination_signature, '4_db_field_labels__49_federal_state_mismatches__12_generic_roots');

assert.equal(batchSummary.dbFieldAgencyRows, 4);
assert.equal(batchSummary.federalStateMismatchRows, 49);
assert.equal(batchSummary.genericRootsNeedingLeafVerification, 12);
assert.ok(report.includes('queue contamination counts now preserved explicitly'));
assert.ok(lessons.includes('### Shared Weak-Signal Counts Across Two Local Families Usually Mean One Queue-Cleanup Problem'));

console.log('test-batch246-north-carolina-queue-signal-refresh-v1: ok');
