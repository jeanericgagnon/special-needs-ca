import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch159MassachusettsBlockerPacketsV1 } from './run-batch159-massachusetts-blocker-packets-v1.mjs';

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

const result = generateBatch159MassachusettsBlockerPacketsV1();
const batchSummary = readJson('data/generated/batch159_massachusetts_blocker_packets_summary_v1.json');
const educationPacket = readJson('data/generated/massachusetts_district_or_county_education_routing_postback_packet_v1.json');
const countyPacket = readJson('data/generated/massachusetts_county_local_disability_resources_host403_packet_v1.json');
const gapRows = readJsonl('data/generated/massachusetts_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/massachusetts_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/massachusetts_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/massachusetts_next_action_queue_v2.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/massachusetts-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(batchSummary.education_packet_created, true);
assert.equal(batchSummary.county_packet_created, true);
assert.equal(batchSummary.education_placeholder_rows, 14);
assert.equal(batchSummary.county_legacy_rows, 8);
assert.equal(batchSummary.county_doi_rows, 7);

assert.equal(educationPacket.repair_lane, 'evidence_only_postback_packet');
assert.equal(educationPacket.current_problem_metrics.statewideFallbackRows, 14);
assert.equal(educationPacket.current_problem_metrics.statewideWebsiteRows, 14);
assert.equal(educationPacket.current_problem_metrics.countyRowCount, 14);
assert.equal(educationPacket.current_problem_metrics.realPostbackResultSurface, true);
assert.equal(educationPacket.current_problem_metrics.countyMappingFieldsPresent, false);

assert.equal(countyPacket.repair_lane, 'browser_or_cached_capture_only');
assert.equal(countyPacket.current_problem_metrics.legacyLocatorRows, 8);
assert.equal(countyPacket.current_problem_metrics.doiMirrorRows, 7);
assert.equal(countyPacket.current_problem_metrics.countyRowCount, 15);
assert.equal(countyPacket.current_problem_metrics.multiOfficeCountyCount, 1);
assert.equal(countyPacket.current_problem_metrics.hostWide403Surfaces, 3);
assert.deepEqual(countyPacket.unresolved_multi_office_counties.map((row) => row.county_id), ['suffolk-ma']);

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(eduGap.status_reason, /evidence-only until an official county-to-district export or filter exists/i);
assert.match(countyGap.status_reason, /browser-or-cached host capture only/i);

const eduFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(eduFailure.evidence, /All 14 Massachusetts county education rows still point at the same statewide DESE fallback/i);
assert.match(countyFailure.evidence, /8 dead legacy storefront placeholders rooted at https:\/\/dhhs\.massachusetts\.gov\/locations and 7 DOI mirror rows/i);

assert.equal(nextRows.find((row) => row.family === 'district_or_county_education_routing').next_action, 'use_massachusetts_dese_postback_packet_and_hold_blocked_until_official_county_to_district_contract_exists');
assert.equal(nextRows.find((row) => row.family === 'county_local_disability_resources').next_action, 'use_massachusetts_dds_host403_packet_for_browser_or_cached_capture_only');

assert.match(verifiedRows.find((row) => row.family === 'district_or_county_education_routing').query_basis, /generated an evidence-only postback packet/i);
assert.match(verifiedRows.find((row) => row.family === 'county_local_disability_resources').query_basis, /generated a host-403 packet/i);

assert.ok(report.includes('explicit postback packet'));
assert.ok(report.includes('explicit host-403 packet'));
assert.ok(lessons.includes('### When A Stateful Directory POST Is Real But Not County-Keyed, Packetize It As Evidence-Only'));

console.log('test-batch159-massachusetts-blocker-packets-v1: ok');
