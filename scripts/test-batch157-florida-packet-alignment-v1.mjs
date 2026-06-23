import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch157FloridaPacketAlignmentV1 } from './run-batch157-florida-packet-alignment-v1.mjs';

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

const result = generateBatch157FloridaPacketAlignmentV1();
const batchSummary = readJson('data/generated/batch157_florida_packet_alignment_summary_v1.json');
const countyPacket = readJson('data/generated/florida_county_local_disability_resources_leaf_authoring_packet_v1.json');
const gapRows = readJsonl('data/generated/florida_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/florida_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/florida_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/florida_next_action_queue_v2.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/florida-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(batchSummary.county_packet_aligned, true);
assert.equal(batchSummary.public_county_rows, 34);
assert.equal(batchSummary.missing_counties, 33);
assert.equal(batchSummary.staging_source_listed_rows, 61);

assert.equal(countyPacket.repair_lane, 'evidence_only_until_anonymous_public_county_contract_exists');
assert.equal(countyPacket.current_problem_metrics.publicCountyCoverageRows, 34);
assert.equal(countyPacket.current_problem_metrics.missingCountyCount, 33);
assert.equal(countyPacket.current_problem_metrics.authenticatedCountyEndpoints, 2);
assert.equal(countyPacket.current_problem_metrics.stagingCommunityPartnerRows, 25);
assert.equal(countyPacket.current_problem_metrics.stagingStorefrontRows, 13);
assert.equal(countyPacket.current_problem_metrics.stagingKioskRows, 11);
assert.equal(countyPacket.current_problem_metrics.stagingServiceCenterRows, 8);
assert.deepEqual(countyPacket.root_domains_to_review, [
  'reviewable anonymous public Florida DCF or MyACCESS county contracts only',
  'do not reuse source_listed partner, kiosk, storefront, or hub rows from staging_dcf_access_offices.json as county authoring seeds',
]);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(countyGap.status_reason, /packet should stay evidence-only/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(countyFailure.evidence, /25 community partners, 13 storefronts, 11 kiosks, 8 DCF service centers/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(countyVerified.query_basis, /anonymous-public-contract evidence only/i);

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'hold_county_local_until_first_party_anonymous_county_dataset_or_public_office_contract_covers_remaining_33_counties');

assert.ok(report.includes('source-listed MyACCESS partner, kiosk, storefront, hub, and portal material'));
assert.ok(report.includes('not by recycling the source-listed staging rows as local authoring seeds'));
assert.ok(lessons.includes('### Once A County Packet Depends On Authenticated Results, Stop Treating Source-Listed Partner Rows As Authoring Seeds'));

console.log('test-batch157-florida-packet-alignment-v1: ok');
