import fs from 'fs';
import path from 'path';
import assert from 'assert/strict';
import { fileURLToPath } from 'url';
import { generateBatch19CountyDistrictLeafAuthoringV1 } from './run-batch19-county-district-leaf-authoring-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

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

generateBatch19CountyDistrictLeafAuthoringV1();

const expectedStates = ['california', 'pennsylvania', 'florida', 'georgia', 'ohio'];
const summary = readJson('data/generated/batch19_county_district_leaf_authoring_summary_v1.json');
const queue = readJsonl('data/generated/batch19_county_district_leaf_authoring_queue_v1.jsonl');
const report = fs.readFileSync(path.join(docsGeneratedDir, 'batch19-county-district-leaf-authoring-report-v1.md'), 'utf8');
const txV10 = readJson('data/generated/tx_verification_summary_v10.json');

assert.deepEqual(summary.states.map((row) => row.state), expectedStates, 'Batch 19 must cover the Batch 18 county/district cohort states');
assert.equal(summary.texas_preserved_complete, true, 'Texas must remain preserved in Batch 19');
assert.equal(txV10.v10.pass_counties, 254, 'Texas v10 must still be 254 PASS');
assert.equal(txV10.index_safe, true, 'Texas must remain index-safe');

assert.ok(queue.length > 0, 'Batch 19 queue must not be empty');
assert.ok(queue.every((row) => row.repair_lane === 'county_district_leaf_repair'), 'Batch 19 queue must only include county/district leaf packets');
assert.ok(queue.every((row) => Array.isArray(row.exact_target_goals) && row.exact_target_goals.length > 0), 'Each packet must include exact target goals');
assert.ok(queue.every((row) => Array.isArray(row.root_domains_to_review)), 'Each packet must include root domains to review');
assert.ok(queue.some((row) => row.family === 'district_or_county_education_routing'), 'Batch 19 must include district/county education routing packets');
assert.ok(queue.some((row) => row.family === 'county_local_disability_resources'), 'Batch 19 must include county/local disability resource packets');

for (const stateId of expectedStates) {
  const packets = queue.filter((row) => row.state === stateId);
  assert.ok(packets.length > 0, `${stateId} must have at least one leaf authoring packet`);
  for (const packet of packets) {
    const filePath = path.join(repoRoot, 'data', 'generated', `${stateId}_${packet.family}_leaf_authoring_packet_v1.json`);
    assert.equal(fs.existsSync(filePath), true, `Packet file must exist for ${stateId} ${packet.family}`);
    const statePacket = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    assert.equal(statePacket.state, stateId, `Packet state mismatch for ${stateId} ${packet.family}`);
    assert.ok(statePacket.current_problem_metrics.genericRootCount >= 0, `Packet metrics missing for ${stateId} ${packet.family}`);
  }
}

assert.ok(report.includes('Texas remains COMPLETE/index-safe'), 'Batch 19 report must preserve Texas truth');
assert.ok(report.includes('reviewed root domains'), 'Batch 19 report must describe the root-domain authoring behavior');

console.log(JSON.stringify({
  ok: true,
  states: summary.states.map((row) => row.state),
  familyCounts: summary.familyCounts,
}, null, 2));
