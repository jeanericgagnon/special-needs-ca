import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch253MaineCountyPacketConsistencyRefreshV1 } from './run-batch253-maine-county-packet-consistency-refresh-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

const result = generateBatch253MaineCountyPacketConsistencyRefreshV1();
const packet = readJson('data/generated/maine_county_local_disability_resources_mapping_packet_v1.json');
const batchSummary = readJson('data/generated/batch253_maine_county_packet_consistency_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/maine-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch253-maine-county-packet-consistency-refresh-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(packet.current_problem_metrics.districtOfficeTownLookupVisible, true);
assert.match(packet.packet_complete_when, /lists office towns but still lacks a county or service-area mapping contract/);
assert.equal(batchSummary.districtOfficeTownLookupVisible, true);
assert.equal(batchSummary.unresolvedMultiOfficeCountyCount, 3);
assert.match(report, /publishes named office towns, but still no county or service-area mapping fields/);
assert.match(batchReport, /district office towns are visible/);

console.log('test-batch253-maine-county-packet-consistency-refresh-v1: ok');
