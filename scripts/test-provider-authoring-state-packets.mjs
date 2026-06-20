import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = path.resolve(new URL('..', import.meta.url).pathname);
const generatedDate = new Date().toISOString().slice(0, 10);

function makeTempRepo(name) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), `${name}-`));
  fs.mkdirSync(path.join(root, 'docs', 'generated'), { recursive: true });
  fs.mkdirSync(path.join(root, 'data', 'source_targets'), { recursive: true });
  return root;
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
}

function runNode(scriptRelativePath, { cwd, env = {} }) {
  const result = spawnSync(process.execPath, [path.join(repoRoot, scriptRelativePath)], {
    cwd,
    env: { ...process.env, ...env },
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error(`Script failed: ${scriptRelativePath}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
  }
  return JSON.parse(result.stdout.trim());
}

const root = makeTempRepo('provider-authoring-state-packets');
writeJson(path.join(root, 'docs', 'generated', `provider-authoring-backlog-${generatedDate}.json`), {
  rows: [
    {
      executionPriority: 1,
      stateId: 'alabama',
      stateName: 'Alabama',
      sourceTargetsPath: 'data/source_targets/alabama.json',
      publicSafeProviders: 1,
      totalProviderRows: 1,
      providerTruthScore: 100,
      concreteProviderTargetCount: 2,
      placeholderProviderTargetCount: 0,
      directoryProviderTargetCount: 0,
      neededConcreteTargets: 1,
      neededLiveProviderRows: 2,
      authoringGapClass: 'missing_concrete_targets',
      nextAction: 'add 1',
    },
  ],
});
writeJson(path.join(root, 'data', 'source_targets', 'alabama.json'), [
  { target_table: 'resource_providers', source_name: 'Childrens', source_url: 'https://child.org', domain: 'child.org', crawl_method: 'static_fetch' },
  { target_table: 'nonprofit_organizations', source_name: 'Arc', source_url: 'https://arc.org', domain: 'arc.org' },
]);

const output = runNode('src/db/generate_provider_authoring_state_packets.js', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
});
assert.equal(output.statePacketCount, 1);
const index = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'generated', `provider-authoring-state-packets-${generatedDate}.json`), 'utf8'));
assert.equal(index.summary.firstState, 'alabama');
const packet = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'generated', 'provider-authoring-state-packets', `provider-authoring-state-packet-alabama-${generatedDate}.json`), 'utf8'));
assert.equal(packet.providerTargets.length, 1);
assert.equal(packet.supportTargets.length, 1);
assert.equal(packet.neededLiveProviderRows, 2);
assert.equal(packet.authoringGapClass, 'missing_concrete_targets');
assert.equal(index.packets[0].neededLiveProviderRows, 2);
assert.equal(index.packets[0].authoringGapClass, 'missing_concrete_targets');

console.log('provider authoring state packets tests passed');
