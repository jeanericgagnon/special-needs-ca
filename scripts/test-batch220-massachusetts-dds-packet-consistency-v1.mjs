import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch220MassachusettsDdsPacketConsistencyV1 } from './run-batch220-massachusetts-dds-packet-consistency-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

const result = generateBatch220MassachusettsDdsPacketConsistencyV1();
const townPacket = readJson('data/generated/massachusetts_county_local_disability_resources_town_routing_packet_v1.json');
const hostPacket = readJson('data/generated/massachusetts_county_local_disability_resources_host403_packet_v1.json');
const summary = readJson('data/generated/batch220_massachusetts_dds_packet_consistency_summary_v1.json');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

for (const packet of [townPacket, hostPacket]) {
  assert.ok(/live Mass\.gov DDS org, locations, and interactive-map surfaces are public/i.test(packet.purpose));
  assert.equal(packet.current_problem_metrics.hostWide403Surfaces, 0);
  assert.ok(/old host-wide 403 assumption is retired/i.test(packet.root_domains_to_review[0]));
}

assert.equal(result.retired_stale_host403_wording, true);
assert.equal(summary.retired_stale_host403_wording, true);
assert.ok(lessons.includes('### Retire Stale Blocker Labels Inside The Packet Once The Live Surface Recovers'));

console.log('test-batch220-massachusetts-dds-packet-consistency-v1: ok');
