import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch156ArizonaPacketAlignmentV1 } from './run-batch156-arizona-packet-alignment-v1.mjs';

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

const result = generateBatch156ArizonaPacketAlignmentV1();
const batchSummary = readJson('data/generated/batch156_arizona_packet_alignment_summary_v1.json');
const educationPacket = readJson('data/generated/arizona_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const countyPacket = readJson('data/generated/arizona_county_local_disability_resources_leaf_authoring_packet_v1.json');
const gapRows = readJsonl('data/generated/arizona_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/arizona_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/arizona_verified_sources_v1.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/arizona-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(batchSummary.education_packet_aligned, true);
assert.equal(batchSummary.county_packet_aligned, true);
assert.equal(batchSummary.statewide_education_fallback_rows, 15);
assert.equal(batchSummary.county_doi_rows, 14);
assert.equal(batchSummary.county_legacy_rows, 1);

assert.equal(educationPacket.repair_lane, 'district_owned_leaf_authoring_only');
assert.equal(educationPacket.current_problem_metrics.azedHostExhaustedRoots, 8);
assert.equal(educationPacket.current_problem_metrics.genericFallbackCountyRows, 15);
assert.deepEqual(educationPacket.root_domains_to_review, [
  'district-owned Arizona K-12 domains only',
  'do not reopen AZED host discovery until the challenge clears on root, likely replacement leaves, robots.txt, and sitemap.xml',
]);

assert.equal(countyPacket.repair_lane, 'evidence_only_until_county_office_contract_exists');
assert.equal(countyPacket.current_problem_metrics.doiFallbackCountyRows, 14);
assert.equal(countyPacket.current_problem_metrics.genericLegacyRootRows, 1);
assert.equal(countyPacket.current_problem_metrics.desHostExhaustedRoots, 8);
assert.deepEqual(countyPacket.representative_sources, [
  'https://www.azahcccs.gov/members/ALTCSlocations.html',
  'https://www.azahcccs.gov/PlansProviders/Downloads/ALTCS_CountyMap.pdf',
  'https://www.azahcccs.gov/shared/AHCCCScontacts.html',
  'https://www.azahcccs.gov/Members/AlreadyCovered/MemberResources/ALTCS.html',
]);

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(eduGap.status_reason, /only honest next lane is district-owned leaf authoring/i);
assert.match(countyGap.status_reason, /packet should stay evidence-only/i);

const eduFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(eduFailure.evidence, /should not reopen on any more AZED-host sibling guesses/i);
assert.match(countyFailure.evidence, /should stay blocked until an official county-to-office contract appears/i);

assert.match(verifiedRows.find((row) => row.family === 'district_or_county_education_routing').query_basis, /district-owned authoring only/i);
assert.match(verifiedRows.find((row) => row.family === 'county_local_disability_resources').query_basis, /evidence-only AHCCCS surfaces/i);

assert.ok(report.includes('packet now makes that explicit by removing AZED-host sibling guesses'));
assert.ok(report.includes('packet now treats DES as exhausted and AHCCCS as evidence-only'));
assert.ok(lessons.includes('### When A State Packet Is Decision-Complete, Trim Exhausted Guess Roots Out Of The Next Lane'));

console.log('test-batch156-arizona-packet-alignment-v1: ok');
