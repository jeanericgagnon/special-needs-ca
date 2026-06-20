import fs from 'fs';
import path from 'path';
import assert from 'assert/strict';
import { execFileSync } from 'child_process';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const generatorPath = path.join(repoRoot, 'src', 'db', 'generate_state_source_pack_v2.js');
const validatorPath = path.join(repoRoot, 'scripts', 'validate-state-source-pack-v2.mjs');

function run(args = [], env = {}) {
  return execFileSync(process.execPath, args, {
    cwd: repoRoot,
    env: { ...process.env, ...env },
    stdio: 'pipe',
  }).toString('utf8');
}

function readJsonl(relativePath) {
  const filePath = path.join(repoRoot, relativePath);
  return fs.readFileSync(filePath, 'utf8').split('\n').map((line) => line.trim()).filter(Boolean).map((line) => JSON.parse(line));
}

run([generatorPath, '--states=illinois,new-hampshire,new-mexico,nebraska,mississippi']);
run([validatorPath]);

const verifiedRows = readJsonl('data/generated/verified_state_source_pack_v2.jsonl');
const candidateRows = readJsonl('data/generated/state_source_candidates_v2.jsonl');
const blockedRows = readJsonl('data/generated/state_source_blocked_v2.jsonl');
const unresolvedRows = readJsonl('data/generated/state_source_unresolved_v2.jsonl');
const federalRows = readJsonl('data/generated/global_federal_source_pack_v1.jsonl');
const semanticRows = readJsonl('data/generated/state_source_semantic_failures_v2.jsonl');

assert.ok(verifiedRows.every((row) => row.status === 'verified_target'), 'Only verified rows may enter the v2 scraper pack');
assert.ok(federalRows.every((row) => row.authority === 'official_federal'), 'Federal pack must contain only official_federal rows');
assert.equal(new Set(federalRows.map((row) => row.url)).size, federalRows.length, 'Federal URLs must not be duplicated');

assert.ok(
  semanticRows.some((row) => String(row.review_reason || '').includes('federal_source_not_allowed_for_state_specific_role')),
  'Federal explainers miscast as state-specific roles should be semantically rejected',
);
assert.ok(
  semanticRows.some((row) => String(row.review_reason || '').includes('generic_root_cannot_satisfy_leaf_role')),
  'Generic roots must not satisfy critical leaf roles',
);
assert.ok(
  semanticRows.some((row) => String(row.review_reason || '').includes('agency_name_is_db_field')),
  'Database field names must be rejected as agencies',
);
assert.ok(
  !verifiedRows.some((row) => /state_resource_agencies\.website|forms_and_guides\.source_url/i.test(String(row.agency || ''))),
  'DB field-name agency strings cannot survive into verified rows',
);
assert.ok(
  !verifiedRows.some((row) => /cdc\.gov|sites\.ed\.gov/.test(new URL(row.final_url || row.url).hostname) && row.state !== ''),
  'State-specific verified rows must not be federal CDC/IDEA pages',
);
assert.ok(unresolvedRows.length > 0, 'Unresolved critical roles must stay explicit');
assert.ok(candidateRows.every((row) => row.status !== 'verified_target'), 'Candidates cannot count as complete');
assert.ok(blockedRows.every((row) => row.blocker_class), 'Blocked rows must carry a blocker class');

console.log(JSON.stringify({
  ok: true,
  verifiedRows: verifiedRows.length,
  candidateRows: candidateRows.length,
  blockedRows: blockedRows.length,
  unresolvedRows: unresolvedRows.length,
  federalRows: federalRows.length,
}, null, 2));
