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

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function runNode(scriptRelativePath, { cwd, env = {}, args = [] }) {
  const result = spawnSync(process.execPath, [path.join(repoRoot, scriptRelativePath), ...args], {
    cwd,
    env: {
      ...process.env,
      ...env,
    },
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error(`Script failed: ${scriptRelativePath}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
  }
  return JSON.parse(result.stdout.trim());
}

const root = makeTempRepo('provider-authoring-state-workfile');
writeJson(path.join(root, 'docs', 'generated', 'provider-authoring-state-packets', `provider-authoring-state-packet-alabama-${generatedDate}.json`), {
  stateId: 'alabama',
  stateName: 'Alabama',
  sourceTargetsPath: 'data/source_targets/alabama.json',
  concreteProviderTargetCount: 2,
  neededConcreteTargets: 1,
  providerTargets: [
    { sourceName: "Children's of Alabama", sourceUrl: 'https://www.childrensal.org/', domain: 'childrensal.org', crawlMethod: 'static_fetch', organizationType: 'hospital', notes: '' },
  ],
  supportTargets: [],
});
writeJson(path.join(root, 'data', 'source_targets', 'alabama.json'), [
  {
    state: 'AL',
    source_name: 'Existing Support Source',
    source_url: 'https://example.org/support',
    domain: 'example.org',
    target_table: 'programs',
  },
]);

const syncOutput = runNode('scripts/sync-provider-authoring-state-workfile.mjs', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
  args: ['--state=alabama'],
});
const workfile = readJson(syncOutput.workfile);
assert.equal(workfile.summary.unresolvedCandidateCount, 1);
workfile.candidateProviderTargets[0].sourceName = 'Alabama Pediatric Therapy Center';
workfile.candidateProviderTargets[0].sourceUrl = 'https://therapy.example.org/services';
workfile.candidateProviderTargets[0].domain = 'therapy.example.org';
workfile.candidateProviderTargets[0].organizationType = 'therapy_center';
workfile.candidateProviderTargets[0].reviewedBy = 'op';
writeJson(syncOutput.workfile, workfile);

const dryRun = runNode('scripts/apply-provider-authoring-state-workfile.mjs', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
  args: ['--state=alabama'],
});
assert.equal(dryRun.readyCandidates, 1);
assert.equal(readJson(path.join(root, 'data', 'source_targets', 'alabama.json')).length, 1);

runNode('scripts/apply-provider-authoring-state-workfile.mjs', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
  args: ['--state=alabama', '--apply'],
});
const updated = readJson(path.join(root, 'data', 'source_targets', 'alabama.json'));
assert.equal(updated.length, 2);
assert.equal(updated[1].target_table, 'resource_providers');
assert.equal(updated[1].source_name, 'Alabama Pediatric Therapy Center');
assert.equal(updated[1].state, 'AL');

console.log('provider authoring state workfile tests passed');
