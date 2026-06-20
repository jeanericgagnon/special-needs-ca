import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import assert from 'assert/strict';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

function run(command, args) {
  return execFileSync(command, args, {
    cwd: repoRoot,
    stdio: 'pipe',
  }).toString('utf8');
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readNdjson(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

run(process.execPath, ['src/db/generate_state_source_pack_v1.js']);
run(process.execPath, ['scripts/validate-state-source-pack-v1.mjs']);

const taxonomy = readJson('data/generated/state_source_taxonomy_v1.json');
const packRows = readNdjson('data/generated/all_states_source_pack_v1.jsonl');
const gaps = readNdjson('data/generated/state_source_pack_gaps_v1.jsonl');
const methodology = fs.readFileSync(path.join(repoRoot, 'docs/generated/state-source-pack-methodology-v1.md'), 'utf8');

assert.equal((taxonomy.workflowCategories || []).length, 7);
assert.ok(packRows.length > 1000, `Expected >1000 rows, received ${packRows.length}`);
assert.ok(gaps.length > 0, 'Expected some gap rows');
assert.ok(methodology.includes('Top 10 States To Manually Repair First'));

const californiaRows = packRows.filter((row) => row.state_abbr === 'CA');
assert.ok(californiaRows.some((row) => row.status === 'verified_target'), 'Expected California to retain verified targets');

const blockedFakeDomains = new Set(
  readJson('data/source_packs/official_state_domain_repairs.json').rows.map((row) => String(row.fakeDomain || '').replace(/^www\./, '').toLowerCase()).filter(Boolean)
);
assert.ok(!packRows.some((row) => blockedFakeDomains.has(row.normalized_domain) && row.status === 'verified_target'), 'Fake scaffold domains must not be promoted as verified targets');

const alabamaDd = packRows.filter((row) => row.state === 'Alabama' && row.workflow_category === 'dd_system');
assert.ok(alabamaDd.length >= 1, 'Expected Alabama to have at least one DD-system target');

console.log(JSON.stringify({
  ok: true,
  rows: packRows.length,
  californiaVerified: californiaRows.filter((row) => row.status === 'verified_target').length,
  alabamaDdTargets: alabamaDd.length,
  gaps: gaps.length,
}, null, 2));
