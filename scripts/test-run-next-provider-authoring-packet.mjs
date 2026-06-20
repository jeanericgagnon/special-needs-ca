import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = path.resolve(new URL('..', import.meta.url).pathname);
const generatedDate = new Date().toISOString().slice(0, 10);

function makeTempRepo(name) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), `${name}-`));
  fs.mkdirSync(path.join(root, 'docs', 'generated', 'provider-authoring-state-packets'), { recursive: true });
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

const root = makeTempRepo('run-next-provider-authoring-packet');
writeJson(path.join(root, 'docs', 'generated', `provider-authoring-state-packets-${generatedDate}.json`), {
  packets: [
    { stateId: 'alabama', stateName: 'Alabama', executionPriority: 1, neededConcreteTargets: 1, jsonPath: `docs/generated/provider-authoring-state-packets/provider-authoring-state-packet-alabama-${generatedDate}.json`, markdownPath: `docs/generated/provider-authoring-state-packets/provider-authoring-state-packet-alabama-${generatedDate}.md` },
    { stateId: 'alaska', stateName: 'Alaska', executionPriority: 2, neededConcreteTargets: 1, jsonPath: `docs/generated/provider-authoring-state-packets/provider-authoring-state-packet-alaska-${generatedDate}.json`, markdownPath: `docs/generated/provider-authoring-state-packets/provider-authoring-state-packet-alaska-${generatedDate}.md` },
  ],
});
writeJson(path.join(root, 'docs', 'generated', 'provider-authoring-state-packets', `provider-authoring-state-packet-alabama-${generatedDate}.json`), {
  stateId: 'alabama',
  sourceTargetsPath: 'data/source_targets/alabama.json',
  concreteProviderTargetCount: 2,
  neededConcreteTargets: 1,
  providerTargets: [],
  supportTargets: [],
  nextAction: 'Add one more Alabama target.',
});
writeJson(path.join(root, 'docs', 'generated', 'provider-authoring-state-packets', `provider-authoring-state-packet-alaska-${generatedDate}.json`), {
  stateId: 'alaska',
  sourceTargetsPath: 'data/source_targets/alaska.json',
  concreteProviderTargetCount: 2,
  neededConcreteTargets: 1,
  providerTargets: [],
  supportTargets: [],
  nextAction: 'Add one more Alaska target.',
});
writeJson(path.join(root, 'data', 'source_targets', 'alabama.json'), [
  { state: 'AL', source_name: 'Existing', source_url: 'https://example.org', domain: 'example.org', target_table: 'programs' },
]);
writeJson(path.join(root, 'data', 'source_targets', 'alaska.json'), [
  { state: 'AK', source_name: 'Existing', source_url: 'https://example.org/ak', domain: 'example.org', target_table: 'programs' },
]);
writeJson(path.join(root, 'data', 'provider-authoring-state-workfiles', 'provider-authoring-state-workfile-alabama.json'), {
  candidateProviderTargets: [
    {
      slotNumber: 1,
      sourceName: 'Alabama Provider Ready',
      sourceUrl: 'https://al.example.org/provider',
      domain: 'al.example.org',
      reviewedBy: 'op',
    },
  ],
});

const output = runNode('scripts/run-next-provider-authoring-packet.mjs', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
});
assert.equal(output.mode, 'provider_authoring_packet_next_step');
assert.equal(output.selectedPacket.stateId, 'alaska');
assert.ok(output.commands.includes('npm run audit:provider-authoring-state-packets'));
assert.ok(output.stateWorkfilePath.includes('provider-authoring-state-workfile-alaska.json'));
assert.ok(output.stateWorkfileStatusPath.includes(`provider-authoring-state-workfile-status-alaska-${generatedDate}.json`));

writeJson(path.join(root, 'data', 'provider-authoring-state-workfiles', 'provider-authoring-state-workfile-alaska.json'), {
  candidateProviderTargets: [
    {
      slotNumber: 1,
      sourceName: 'Alaska Provider Ready',
      sourceUrl: 'https://ak.example.org/provider',
      domain: 'ak.example.org',
      reviewedBy: 'op',
    },
  ],
});

const applyReadyOutput = runNode('scripts/run-next-provider-authoring-packet.mjs', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
});
assert.equal(applyReadyOutput.mode, 'provider_authoring_apply_ready_workfiles');
assert.equal(applyReadyOutput.readyStateCount, 2);
assert.ok(applyReadyOutput.commands.includes('node scripts/run-provider-authoring-apply-ready-workfiles.mjs'));

writeJson(path.join(root, 'data', 'source_targets', 'alabama.json'), [
  { state: 'AL', source_name: 'Existing', source_url: 'https://example.org', domain: 'example.org', target_table: 'programs' },
  { state: 'AL', source_name: 'Alabama Provider Ready', source_url: 'https://al.example.org/provider', domain: 'al.example.org', target_table: 'resource_providers' },
]);
writeJson(path.join(root, 'data', 'source_targets', 'alaska.json'), [
  { state: 'AK', source_name: 'Existing', source_url: 'https://example.org/ak', domain: 'example.org', target_table: 'programs' },
  { state: 'AK', source_name: 'Alaska Provider Ready', source_url: 'https://ak.example.org/provider', domain: 'ak.example.org', target_table: 'resource_providers' },
]);

const appliedOutput = runNode('scripts/run-next-provider-authoring-packet.mjs', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
});
assert.equal(appliedOutput.mode, 'provider_authoring_packet_idle');

const refreshRoot = makeTempRepo('run-next-provider-authoring-packet-refresh');
writeJson(path.join(refreshRoot, 'docs', 'generated', `provider-authoring-state-packets-${generatedDate}.json`), {
  packets: [
    { stateId: 'alabama', stateName: 'Alabama', executionPriority: 1, neededConcreteTargets: 0, neededLiveProviderRows: 2, authoringGapClass: 'needs_refresh_or_deeper_targets', jsonPath: `docs/generated/provider-authoring-state-packets/provider-authoring-state-packet-alabama-${generatedDate}.json`, markdownPath: `docs/generated/provider-authoring-state-packets/provider-authoring-state-packet-alabama-${generatedDate}.md` },
  ],
});
writeJson(path.join(refreshRoot, 'docs', 'generated', 'provider-authoring-state-packets', `provider-authoring-state-packet-alabama-${generatedDate}.json`), {
  stateId: 'alabama',
  sourceTargetsPath: 'data/source_targets/alabama.json',
  concreteProviderTargetCount: 3,
  neededConcreteTargets: 0,
  neededLiveProviderRows: 2,
  authoringGapClass: 'needs_refresh_or_deeper_targets',
  providerTargets: [],
  supportTargets: [],
  nextAction: 'Refresh Alabama provider targets.',
});
writeJson(path.join(refreshRoot, 'data', 'source_targets', 'alabama.json'), [
  { state: 'AL', source_name: 'Existing Provider', source_url: 'https://example.org/provider', domain: 'example.org', target_table: 'resource_providers' },
]);
writeJson(path.join(refreshRoot, 'data', 'provider-authoring-state-workfiles', 'provider-authoring-state-workfile-alabama.json'), {
  candidateProviderTargets: [
    {
      slotNumber: 1,
      sourceName: 'Existing Provider',
      sourceUrl: 'https://example.org/provider',
      domain: 'example.org',
      reviewedBy: 'op',
    },
  ],
});

const refreshOutput = runNode('scripts/run-next-provider-authoring-packet.mjs', {
  cwd: refreshRoot,
  env: { ABLEFULL_REPO_ROOT: refreshRoot },
});
assert.equal(refreshOutput.mode, 'provider_authoring_packet_next_step');
assert.equal(refreshOutput.selectedPacket.stateId, 'alabama');
assert.equal(refreshOutput.selectedPacket.neededLiveProviderRows, 2);
assert.equal(refreshOutput.selectedPacket.authoringGapClass, 'needs_refresh_or_deeper_targets');

const idleRoot = makeTempRepo('run-next-provider-authoring-packet-idle');
writeJson(path.join(idleRoot, 'docs', 'generated', `provider-authoring-state-packets-${generatedDate}.json`), {
  packets: [],
});
const idleOutput = runNode('scripts/run-next-provider-authoring-packet.mjs', {
  cwd: idleRoot,
  env: { ABLEFULL_REPO_ROOT: idleRoot },
});
assert.equal(idleOutput.mode, 'provider_authoring_packet_idle');

console.log('run next provider authoring packet tests passed');
