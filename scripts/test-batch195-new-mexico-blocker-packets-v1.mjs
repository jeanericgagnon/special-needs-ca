import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch195NewMexicoBlockerPacketsV1 } from './run-batch195-new-mexico-blocker-packets-v1.mjs';

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

const result = generateBatch195NewMexicoBlockerPacketsV1();
const summary = readJson('data/generated/new-mexico_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/new-mexico_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/new-mexico_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/new-mexico_verified_sources_v1.jsonl');
const educationPacket = readJson('data/generated/new-mexico_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const countyPacket = readJson('data/generated/new-mexico_county_local_disability_resources_hca_archive_packet_v1.json');
const vrPacket = readJson('data/generated/new-mexico_vocational_rehabilitation_host_packet_v1.json');
const batchSummary = readJson('data/generated/batch195_new_mexico_blocker_packets_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/new-mexico-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'district_and_county_local_leaf_proof_still_missing_after_statewide_and_fit_regional_repairs');

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduGap.family_status, 'blocked_exact_district_or_county_leafs_unverified');
assert.match(eduGap.status_reason, /wrong-role `https:\/\/www\.nmhealth\.org\/about\/ddsd` cross-role leak/i);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_live_hca_field_office_archive_partial_county_contract');
assert.match(countyGap.status_reason, /county-specific office posts across page 1 and page 2/i);

const vrGap = gapRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets');
assert.equal(vrGap.family_status, 'blocked_official_dvr_root_unauthorized_without_reviewed_alternate');
assert.match(vrGap.status_reason, /no reviewed alternate VR domain/i);

assert.match(failureRows.find((row) => row.family === 'district_or_county_education_routing').evidence, /missing local leaf authoring/i);
assert.match(failureRows.find((row) => row.family === 'county_local_disability_resources').evidence, /county-complete 33-county office map/i);
assert.match(failureRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets').evidence, /no reviewed alternate VR domain/i);

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduVerified.sample_count, 3);
assert.match(eduVerified.samples[2].source_url, /nmhealth\.org\/about\/ddsd/);
assert.match(eduVerified.samples[2].evidence_snippet, /leaked into the PED education queue/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.sample_count, 2);
assert.match(countyVerified.samples[0].evidence_snippet, /Bernalillo County NW/i);
assert.match(countyVerified.samples[1].evidence_snippet, /Chaves County, Curry County, and Dona Ana/i);

const vrVerified = verifiedRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets');
assert.equal(vrVerified.sample_count, 2);
assert.match(vrVerified.samples[1].evidence_snippet, /no reviewed alternate VR domain/i);

assert.equal(educationPacket.current_metrics.districtOwnedLeavesOnDisk, 0);
assert.equal(educationPacket.current_metrics.wrongRoleCrossHostCandidates, 1);
assert.equal(countyPacket.current_metrics.countyTotal, 33);
assert.equal(countyPacket.current_metrics.explicitlyNamedCountyLeavesSeen, 7);
assert.equal(vrPacket.current_metrics.officialDvrRoot401, true);
assert.equal(vrPacket.current_metrics.reviewedAlternateVrDomains, 0);
assert.deepEqual(vrPacket.unresolved_roles, ['vocational_rehabilitation', 'pre_ets']);

assert.equal(batchSummary.educationPacketWritten, true);
assert.equal(batchSummary.countyPacketWritten, true);
assert.equal(batchSummary.vrPacketWritten, true);
assert.equal(batchSummary.districtOwnedLeavesOnDisk, 0);
assert.equal(batchSummary.countyCompleteMapOnDisk, false);
assert.equal(batchSummary.reviewedAlternateVrDomains, 0);

assert.ok(report.includes('`district_or_county_education_routing` now has a leaf-authoring packet'));
assert.ok(report.includes('wrong-role `nmhealth.org/about/ddsd` candidate'));
assert.ok(report.includes('full 33-county HCA office contract'));
assert.ok(report.includes('401 DVR host plus zero reviewed alternate official roots'));
assert.ok(lessons.includes('### Low-Token State Queues That Leak Cross-Role Domains Need Packet Repair Before More Fetches'));

console.log('test-batch195-new-mexico-blocker-packets-v1: ok');
