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
  fs.mkdirSync(path.join(root, 'data', 'source-acquisition-state'), { recursive: true });
  return root;
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
}

function runNode(scriptRelativePath, { cwd, env = {}, args = [] }) {
  const result = spawnSync(process.execPath, [path.join(repoRoot, scriptRelativePath), ...args], {
    cwd,
    env: { ...process.env, ...env },
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error(`Script failed: ${scriptRelativePath}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
  }
  return JSON.parse(result.stdout.trim());
}

const root = makeTempRepo('provider-authoring-ledger');
writeJson(path.join(root, 'docs', 'generated', `provider-buildout-priority-plan-${generatedDate}.json`), {
  lanes: {
    remediation: [],
    validation: [
      { stateId: 'alabama', stateName: 'Alabama', countyCount: 67, publicSafeProviders: 1, totalProviderRows: 1, providerTruthScore: 100, publicSafeNonprofits: 500, advocatePublicSafeCount: 20 },
      { stateId: 'alaska', stateName: 'Alaska', countyCount: 10, publicSafeProviders: 1, totalProviderRows: 1, providerTruthScore: 100, publicSafeNonprofits: 200, advocatePublicSafeCount: 10 },
    ],
  },
});
writeJson(path.join(root, 'docs', 'generated', `provider-source-pack-plan-${generatedDate}.json`), { states: [] });
writeJson(path.join(root, 'data', 'source_targets', 'alabama.json'), []);
writeJson(path.join(root, 'data', 'source_targets', 'alaska.json'), []);

let output = runNode('src/db/generate_provider_authoring_backlog.js', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
});
assert.equal(output.summary.firstState, 'alabama');

runNode('scripts/mark-provider-authoring-state-complete.mjs', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
  args: ['--state=alabama'],
});

output = runNode('src/db/generate_provider_authoring_backlog.js', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
});
assert.equal(output.summary.firstState, 'alaska');
assert.equal(output.summary.completedStatesExcluded, 1);

console.log('provider authoring ledger tests passed');
