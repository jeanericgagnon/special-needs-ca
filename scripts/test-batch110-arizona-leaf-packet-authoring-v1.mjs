import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch110ArizonaLeafPacketAuthoringV1 } from './run-batch110-arizona-leaf-packet-authoring-v1.mjs';

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

const result = generateBatch110ArizonaLeafPacketAuthoringV1();
const summary = readJson('data/generated/arizona_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/arizona_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/arizona_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/arizona_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch110_arizona_leaf_packet_authoring_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/arizona-california-grade-audit-report-v2.md'), 'utf8');
const eduPacket = readJson('data/generated/arizona_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const countyPacket = readJson('data/generated/arizona_county_local_disability_resources_leaf_authoring_packet_v1.json');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.primary_gap_reason, 'official_roots_challenged_and_local_leaf_packets_authored_but_unverified');
assert.equal(eduPacket.family, 'district_or_county_education_routing');
assert.equal(eduPacket.affected_counties.length, 15);
assert.equal(countyPacket.family, 'county_local_disability_resources');
assert.equal(countyPacket.affected_counties.length, 15);

assert.match(gapRows.find((row) => row.family === 'district_or_county_education_routing').status_reason, /authoring packet now exists on disk/i);
assert.match(gapRows.find((row) => row.family === 'county_local_disability_resources').status_reason, /authoring packet now exists on disk/i);
assert.equal(nextRows.find((row) => row.family === 'district_or_county_education_routing').next_action, 'use_authored_arizona_education_leaf_packet_to_collect_district_owned_leaves');
assert.equal(nextRows.find((row) => row.family === 'county_local_disability_resources').next_action, 'use_authored_arizona_county_local_packet_to_collect_county_specific_office_leaves');
assert.equal(failureRows.find((row) => row.family === 'district_or_county_education_routing').next_action, 'use_authored_arizona_education_leaf_packet_to_collect_district_owned_leaves');
assert.equal(failureRows.find((row) => row.family === 'county_local_disability_resources').next_action, 'use_authored_arizona_county_local_packet_to_collect_county_specific_office_leaves');

assert.deepEqual(batchSummary.authored_packets, [
  'data/generated/arizona_district_or_county_education_routing_leaf_authoring_packet_v1.json',
  'data/generated/arizona_county_local_disability_resources_leaf_authoring_packet_v1.json',
]);
assert.ok(report.includes('both blocked families have deterministic Arizona leaf authoring packets on disk'));

console.log('test-batch110-arizona-leaf-packet-authoring-v1: ok');
