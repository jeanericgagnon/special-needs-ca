import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch197NorthCarolinaBlockerPacketsV1 } from './run-batch197-north-carolina-blocker-packets-v1.mjs';

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

const result = generateBatch197NorthCarolinaBlockerPacketsV1();
const summary = readJson('data/generated/north-carolina_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/north-carolina_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/north-carolina_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/north-carolina_verified_sources_v1.jsonl');
const educationPacket = readJson('data/generated/north-carolina_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const countyPacket = readJson('data/generated/north-carolina_county_local_disability_resources_local_office_packet_v1.json');
const sourceFamilyPacket = readJson('data/generated/north-carolina_statewide_support_source_family_packet_v1.json');
const batchSummary = readJson('data/generated/batch197_north_carolina_blocker_packets_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/north-carolina-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'generic_or_statewide_evidence_used_where_local_required');

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
const ptiGap = gapRows.find((row) => row.family === 'parent_training_information_center');
assert.match(eduGap.status_reason, /Charlotte-Mecklenburg/i);
assert.match(countyGap.status_reason, /DOI mirror/i);
assert.match(ptiGap.status_reason, /homepage PTI navigation alone is not designation proof/i);

assert.match(failureRows.find((row) => row.family === 'district_or_county_education_routing').evidence, /exact district-leaf authoring gap/i);
assert.match(failureRows.find((row) => row.family === 'county_local_disability_resources').evidence, /county-owned local office replacement packet/i);
assert.match(failureRows.find((row) => row.family === 'protection_and_advocacy').evidence, /statewide North Carolina PTI designation/i);

assert.equal(verifiedRows.find((row) => row.family === 'district_or_county_education_routing').family_status, 'legacy_state_grade');
assert.equal(verifiedRows.find((row) => row.family === 'county_local_disability_resources').family_status, 'legacy_state_grade');
assert.equal(verifiedRows.find((row) => row.family === 'parent_training_information_center').family_status, 'inventory_only');

assert.equal(educationPacket.current_metrics.reviewedDistrictOwnedLeaves, 1);
assert.equal(countyPacket.current_metrics.doiBackedSampleRows, 3);
assert.deepEqual(sourceFamilyPacket.missing_families, ['protection_and_advocacy', 'legal_aid']);
assert.equal(sourceFamilyPacket.weak_family, 'parent_training_information_center');

assert.equal(batchSummary.reviewedDistrictOwnedLeaves, 1);
assert.equal(batchSummary.doiBackedSampleRows, 3);
assert.equal(batchSummary.statewideSupportFamiliesStillBlocked, 3);

assert.ok(report.includes('Charlotte-Mecklenburg is the only reviewed local anchor'));
assert.ok(report.includes('DOI mirror rows are preserved only as blocker evidence'));
assert.ok(report.includes('PTI navigation alone is not designation proof'));
assert.ok(lessons.includes('### PTI Navigation Alone Is Not Statewide PTI Designation Proof'));

console.log('test-batch197-north-carolina-blocker-packets-v1: ok');
