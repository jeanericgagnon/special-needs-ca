import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = path.resolve(new URL('..', import.meta.url).pathname);
const generatedDate = new Date().toISOString().slice(0, 10);

function makeTempRepo(name) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), `${name}-`));
  fs.mkdirSync(path.join(root, 'data', 'provider-authoring-state-workfiles'), { recursive: true });
  fs.mkdirSync(path.join(root, 'docs', 'generated'), { recursive: true });
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

const root = makeTempRepo('provider-authoring-state-workfile-status');
writeJson(path.join(root, 'data', 'provider-authoring-state-workfiles', 'provider-authoring-state-workfile-alabama.json'), {
  stateId: 'alabama',
  summary: {
    neededConcreteTargets: 2,
  },
  candidateProviderTargets: [
    { slotNumber: 1, sourceName: 'A', sourceUrl: 'https://a.example.org', domain: 'a.example.org', reviewedBy: 'op', organizationType: 'hospital' },
    { slotNumber: 2, sourceName: '', sourceUrl: '', domain: '', reviewedBy: '', organizationType: '' },
  ],
});

const output = runNode('src/db/generate_provider_authoring_state_workfile_status.js', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
  args: ['--state=alabama'],
});
const payload = readJson(path.join(root, 'docs', 'generated', `provider-authoring-state-workfile-status-alabama-${generatedDate}.json`));
assert.equal(output.unresolvedCandidateCount, 1);
assert.equal(payload.summary.readyCandidateCount, 1);
assert.equal(payload.summary.completionPercent, 50);

console.log('provider authoring state workfile status tests passed');
