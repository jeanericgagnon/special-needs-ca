import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch198NorthDakotaBlockerPacketsV1 } from './run-batch198-north-dakota-blocker-packets-v1.mjs';

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

const result = generateBatch198NorthDakotaBlockerPacketsV1();
const summary = readJson('data/generated/north-dakota_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/north-dakota_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/north-dakota_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/north-dakota_verified_sources_v1.jsonl');
const educationPacket = readJson('data/generated/north-dakota_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const countyPacket = readJson('data/generated/north-dakota_county_local_disability_resources_local_office_packet_v1.json');
const legalAidPacket = readJson('data/generated/north-dakota_legal_aid_source_family_packet_v1.json');
const batchSummary = readJson('data/generated/batch198_north_dakota_blocker_packets_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/north-dakota-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'generic_or_statewide_evidence_used_where_local_required');

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
const legalGap = gapRows.find((row) => row.family === 'legal_aid');
assert.match(eduGap.status_reason, /state-root-backed district labels/i);
assert.match(countyGap.status_reason, /DOI mirror/i);
assert.match(legalGap.status_reason, /statewide legal-aid/i);

assert.match(failureRows.find((row) => row.family === 'district_or_county_education_routing').evidence, /missing district-owned local leaves/i);
assert.match(failureRows.find((row) => row.family === 'county_local_disability_resources').evidence, /reviewed county-owned Human Service Zone/i);
assert.match(failureRows.find((row) => row.family === 'legal_aid').evidence, /standalone source-family packet/i);

assert.equal(verifiedRows.find((row) => row.family === 'district_or_county_education_routing').family_status, 'legacy_state_grade');
assert.equal(verifiedRows.find((row) => row.family === 'county_local_disability_resources').family_status, 'legacy_state_grade');

assert.equal(educationPacket.current_metrics.reviewedLocalLeaves, 0);
assert.equal(countyPacket.current_metrics.doiBackedSampleRows, 3);
assert.equal(legalAidPacket.current_metrics.reviewedStatewideLegalAidSources, 0);

assert.equal(batchSummary.reviewedLocalLeaves, 0);
assert.equal(batchSummary.doiBackedSampleRows, 3);
assert.equal(batchSummary.reviewedStatewideLegalAidSources, 0);

assert.ok(report.includes('state-root-backed district labels are preserved only as blocker evidence'));
assert.ok(report.includes('DOI mirror rows are preserved only as blocker evidence'));
assert.ok(report.includes('standalone statewide source-family packet'));
assert.ok(lessons.includes('### State-Labeled Local Rows That Resolve To A State Root Still Count As Missing Local Proof'));

console.log('test-batch198-north-dakota-blocker-packets-v1: ok');
