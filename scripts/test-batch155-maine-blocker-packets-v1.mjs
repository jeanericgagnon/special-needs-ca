import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch155MaineBlockerPacketsV1 } from './run-batch155-maine-blocker-packets-v1.mjs';

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

const result = generateBatch155MaineBlockerPacketsV1();
const summary = readJson('data/generated/maine_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/maine_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/maine_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/maine_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/maine_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch155_maine_blocker_packets_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/maine-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const educationPacket = readJson('data/generated/maine_district_or_county_education_routing_manual_export_packet_v1.json');
const countyPacket = readJson('data/generated/maine_county_local_disability_resources_mapping_packet_v1.json');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);

assert.equal(educationPacket.family, 'district_or_county_education_routing');
assert.equal(educationPacket.current_problem_metrics.statewideSpecialEdSourceRows, 14);
assert.equal(educationPacket.current_problem_metrics.genericDoeSourceRows, 2);
assert.equal(educationPacket.current_problem_metrics.statewideWebsiteRows, 16);
assert.equal(educationPacket.current_problem_metrics.countyRowCount, 16);
assert.equal(educationPacket.current_problem_metrics.reviewedSelectorRoots, 4);
assert.equal(educationPacket.current_problem_metrics.boundedPostReplayFailures, 3);

assert.equal(countyPacket.family, 'county_local_disability_resources');
assert.equal(countyPacket.current_problem_metrics.doiMirrorRows, 16);
assert.equal(countyPacket.current_problem_metrics.deadLocatorRows, 4);
assert.equal(countyPacket.current_problem_metrics.multiOfficeCountyCount, 3);
assert.deepEqual(countyPacket.unresolved_multi_office_counties.map((row) => row.county_id), [
  'aroostook-me',
  'washington-me',
  'york-me',
]);

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(educationGap.status_reason, /All 16 current county education rows still point at statewide DOE fallbacks/i);
assert.match(countyGap.status_reason, /Sixteen current county-office rows are still DOI mirrors and four still use the dead dhhs\.maine\.gov\/locations/i);

const educationFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(educationFailure.evidence, /Portland Public Schools \(OrgId 364\)/i);
assert.match(countyFailure.evidence, /Aroostook \(Caribou, Fort Kent, Houlton\)/i);

assert.equal(nextRows.find((row) => row.family === 'district_or_county_education_routing').next_action, 'use_maine_education_manual_export_packet_to_capture_reviewed_sau_contacts_and_replace_16_statewide_fallback_rows');
assert.equal(nextRows.find((row) => row.family === 'county_local_disability_resources').next_action, 'use_maine_county_office_mapping_packet_to_resolve_doi_and_dead_locator_rows_or_keep_unmapped_counties_blocked');

assert.match(verifiedRows.find((row) => row.family === 'district_or_county_education_routing').query_basis, /generated a manual-export packet/i);
assert.match(verifiedRows.find((row) => row.family === 'county_local_disability_resources').query_basis, /generated a county-mapping packet/i);

assert.deepEqual(batchSummary.authored_packets, [
  'data/generated/maine_district_or_county_education_routing_manual_export_packet_v1.json',
  'data/generated/maine_county_local_disability_resources_mapping_packet_v1.json',
]);
assert.ok(report.includes('explicit manual-export packet'));
assert.ok(report.includes('deterministic county-office mapping packet'));
assert.ok(lessons.includes('### If A Real Official Form Exposes CSRF And Public IDs But Every Bounded Submit Returns 500, Packetize It As Manual Export'));

console.log('test-batch155-maine-blocker-packets-v1: ok');
