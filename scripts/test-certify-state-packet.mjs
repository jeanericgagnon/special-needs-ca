import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { certifyStatePacket } from './certify-state-packet.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

async function run() {
  const branch = 'origin/parallel-state-repair-b2';

  const ri = await certifyStatePacket({ state: 'rhode-island', candidateBranch: branch, liveProbe: false });
  assert.equal(ri.result.pass, false);
  assert.ok(ri.result.failures.some((f) => f.code === 'statewide_roster_used_as_local_routing'));
  assert.ok(ri.result.failures.some((f) => f.code === 'provider_address_without_service_area_proof'));
  assert.ok(ri.result.failures.some((f) => f.code === 'missing_explicit_geography_mappings'));

  const wy = await certifyStatePacket({ state: 'wyoming', candidateBranch: branch, liveProbe: false });
  assert.equal(wy.result.pass, false);
  assert.ok(wy.result.failures.some((f) => f.code === 'generic_district_root_used_as_special_ed_routing' || f.code === 'sitemap_only_or_directory_only_leaf_used'));
  assert.ok(wy.result.failures.some((f) => f.code === 'missing_explicit_geography_mappings'));

  const sd = await certifyStatePacket({ state: 'south-dakota', candidateBranch: branch, liveProbe: false });
  assert.equal(sd.result.pass, false);
  assert.ok(sd.result.failures.some((f) => f.code === 'not_completion_candidate'));

  for (const state of ['rhode-island', 'wyoming', 'south-dakota']) {
    const jsonPath = path.join(repoRoot, 'data', 'generated', 'state-certification', `${state}.json`);
    const mdPath = path.join(repoRoot, 'docs', 'generated', `state-certification-${state}.md`);
    assert.ok(fs.existsSync(jsonPath), `${state} JSON certification artifact must exist`);
    assert.ok(fs.existsSync(mdPath), `${state} Markdown certification artifact must exist`);
  }

  console.log('test-certify-state-packet: ok');
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
