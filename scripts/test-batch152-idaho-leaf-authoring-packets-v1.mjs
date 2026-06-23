import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch152IdahoLeafAuthoringPacketsV1 } from './run-batch152-idaho-leaf-authoring-packets-v1.mjs';

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

const result = generateBatch152IdahoLeafAuthoringPacketsV1();
const summary = readJson('data/generated/idaho_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/idaho_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/idaho_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/idaho_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/idaho_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch152_idaho_leaf_authoring_packets_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/idaho-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const educationPacket = readJson('data/generated/idaho_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const countyPacket = readJson('data/generated/idaho_county_local_disability_resources_leaf_authoring_packet_v1.json');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);

assert.equal(educationPacket.family, 'district_or_county_education_routing');
assert.equal(educationPacket.current_problem_metrics.statewideFallbackRows, 42);
assert.equal(educationPacket.current_problem_metrics.genericRootRows, 2);
assert.equal(educationPacket.current_problem_metrics.officialDistrictLinks, 116);
assert.equal(educationPacket.affected_counties.length, 44);

assert.equal(countyPacket.family, 'county_local_disability_resources');
assert.equal(countyPacket.current_problem_metrics.doiMirrorRows, 18);
assert.equal(countyPacket.current_problem_metrics.legacyLocatorRows, 27);
assert.equal(countyPacket.current_problem_metrics.authoredExactLeafCount, 18);
assert.equal(countyPacket.affected_counties.length, 44);
assert.deepEqual(countyPacket.unresolved_county_splits[0].competing_office_names, [
  'Idaho DHW: Caldwell Office',
  'Idaho DHW: Nampa Office',
]);

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(eduGap.status_reason, /44\/44 current county rows still point at statewide SDE fallbacks/i);
assert.match(countyGap.status_reason, /Eighteen county rows now name-match reviewed official office leaves/i);

const eduFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(eduFailure.evidence, /42 rows use https:\/\/www\.sde\.idaho\.gov\/sped\//i);
assert.match(countyFailure.evidence, /27 county rows still use the dead legacy locator/i);

assert.equal(nextRows.find((row) => row.family === 'district_or_county_education_routing').next_action, 'use_idaho_district_leaf_packet_to_attach_reviewed_district_owned_special_education_or_student_services_leaves');
assert.equal(nextRows.find((row) => row.family === 'county_local_disability_resources').next_action, 'use_idaho_office_leaf_packet_to_replace_doi_rows_and_keep_unmapped_legacy_counties_blocked');

assert.match(verifiedRows.find((row) => row.family === 'district_or_county_education_routing').query_basis, /generated a district-owned leaf authoring packet/i);
assert.match(verifiedRows.find((row) => row.family === 'county_local_disability_resources').query_basis, /generated an office-leaf authoring packet/i);

assert.deepEqual(batchSummary.authored_packets, [
  'data/generated/idaho_district_or_county_education_routing_leaf_authoring_packet_v1.json',
  'data/generated/idaho_county_local_disability_resources_leaf_authoring_packet_v1.json',
]);
assert.ok(report.includes('dedicated Idaho district-owned leaf packet'));
assert.ok(report.includes('dedicated Idaho office-leaf packet'));
assert.ok(lessons.includes('### Turn A Sharpened Blocker Into A Deterministic Packet Before Rechecking The Same Statewide Directory'));

console.log('test-batch152-idaho-leaf-authoring-packets-v1: ok');
