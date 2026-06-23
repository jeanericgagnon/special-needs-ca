import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch158IdahoPacketAlignmentV1 } from './run-batch158-idaho-packet-alignment-v1.mjs';

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

const result = generateBatch158IdahoPacketAlignmentV1();
const batchSummary = readJson('data/generated/batch158_idaho_packet_alignment_summary_v1.json');
const educationPacket = readJson('data/generated/idaho_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const countyPacket = readJson('data/generated/idaho_county_local_disability_resources_leaf_authoring_packet_v1.json');
const gapRows = readJsonl('data/generated/idaho_gap_matrix_v2.jsonl');
const verifiedRows = readJsonl('data/generated/idaho_verified_sources_v1.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/idaho-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(batchSummary.education_packet_aligned, true);
assert.equal(batchSummary.county_packet_aligned, true);
assert.equal(batchSummary.county_sample_set_deduped, true);

assert.equal(educationPacket.repair_lane, 'district_owned_leaf_authoring_only');
assert.deepEqual(educationPacket.root_domains_to_review, [
  'district-owned Idaho K-12 domains reached from the official Idaho School Districts directory',
  'do not reopen statewide SDE discovery until a district-owned leaf is attached',
]);

assert.equal(countyPacket.repair_lane, 'exact_office_alignment_then_hold_unmapped_counties');
assert.deepEqual(countyPacket.representative_sources, [
  'https://healthandwelfare.idaho.gov/offices',
  'https://healthandwelfare.idaho.gov/sitemap.xml',
  'https://healthandwelfare.idaho.gov/dhw/caldwell-office',
  'https://healthandwelfare.idaho.gov/offices?page=2',
]);

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(eduGap.status_reason, /district-owned leaf authoring lane only/i);
assert.match(countyGap.status_reason, /exact-office alignment lane only/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.sample_count, 4);
assert.deepEqual(countyVerified.samples.map((sample) => sample.sample_name), [
  'Find a Service Location',
  'Idaho DHW sitemap office-leaf surface',
  'Idaho DHW Caldwell Office',
  'Nampa mention resolves only to SWITC',
]);

assert.ok(report.includes('no longer implies more statewide SDE discovery is useful'));
assert.ok(report.includes('distinct supporting evidence rather than repeated directory samples'));
assert.ok(lessons.includes('### When A Blocked Family Uses Sample Evidence, Keep The Samples Distinct'));

console.log('test-batch158-idaho-packet-alignment-v1: ok');
