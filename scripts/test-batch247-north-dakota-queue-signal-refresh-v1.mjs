import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch247NorthDakotaQueueSignalRefreshV1 } from './run-batch247-north-dakota-queue-signal-refresh-v1.mjs';

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

const result = generateBatch247NorthDakotaQueueSignalRefreshV1();
const summary = readJson('data/generated/north-dakota_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/north-dakota_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/north-dakota_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/north-dakota_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/north-dakota_next_action_queue_v2.jsonl');
const educationPacket = readJson('data/generated/north-dakota_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const countyPacket = readJson('data/generated/north-dakota_county_local_disability_resources_local_office_packet_v1.json');
const legalAidPacket = readJson('data/generated/north-dakota_legal_aid_source_family_packet_v1.json');
const batchSummary = readJson('data/generated/batch247_north_dakota_queue_signal_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/north-dakota-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
const legalAidGap = gapRows.find((row) => row.family === 'legal_aid');
assert.match(eduGap.status_reason, /4 inventory rows use DB-field agency labels/i);
assert.match(eduGap.status_reason, /49 rows show federal\/state mismatch/i);
assert.match(eduGap.status_reason, /9 generic roots still need exact leaf verification/i);
assert.match(countyGap.status_reason, /DOI mirror/i);
assert.match(countyGap.status_reason, /same upstream weak-signal queue contamination/i);
assert.match(legalAidGap.status_reason, /no reviewed first-party or authoritative statewide artifact on disk/i);

const eduFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
const legalAidFailure = failureRows.find((row) => row.family === 'legal_aid');
assert.match(eduFailure.evidence, /queue-cleanup gap/i);
assert.match(countyFailure.evidence, /queue-cleanup packet/i);
assert.match(legalAidFailure.evidence, /standalone source-family packet/i);

for (const row of nextRows.filter((row) => ['district_or_county_education_routing','county_local_disability_resources'].includes(row.family))) {
  assert.equal(row.evidence, '4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 9 generic roots need leaf verification');
}
assert.equal(nextRows.find((row) => row.family === 'legal_aid').evidence, 'Legal aid has no reviewed first-party or authoritative statewide North Dakota artifact on disk.');

assert.equal(educationPacket.current_metrics.dbFieldAgencyRows, 4);
assert.equal(educationPacket.current_metrics.federalStateMismatchRows, 49);
assert.equal(educationPacket.current_metrics.genericRootsNeedingLeafVerification, 9);
assert.equal(educationPacket.shared_queue_contamination_signature, '4_db_field_labels__49_federal_state_mismatches__9_generic_roots');

assert.equal(countyPacket.current_metrics.dbFieldAgencyRows, 4);
assert.equal(countyPacket.current_metrics.federalStateMismatchRows, 49);
assert.equal(countyPacket.current_metrics.genericRootsNeedingLeafVerification, 9);
assert.equal(countyPacket.shared_queue_contamination_signature, '4_db_field_labels__49_federal_state_mismatches__9_generic_roots');

assert.equal(legalAidPacket.current_metrics.reviewedStatewideSources, 0);
assert.equal(legalAidPacket.current_metrics.authoritativeStatewideSources, 0);
assert.match(legalAidPacket.blocker_basis, /No reviewed first-party or authoritative statewide North Dakota legal-aid artifact/i);

assert.equal(batchSummary.dbFieldAgencyRows, 4);
assert.equal(batchSummary.federalStateMismatchRows, 49);
assert.equal(batchSummary.genericRootsNeedingLeafVerification, 9);
assert.equal(batchSummary.legalAidReviewedStatewideSources, 0);
assert.ok(report.includes('preserved queue contamination counts'));
assert.ok(lessons.includes('### Reuse The Same Queue Signature Across States, But Keep The Generic-Root Count State-Specific'));

console.log('test-batch247-north-dakota-queue-signal-refresh-v1: ok');
