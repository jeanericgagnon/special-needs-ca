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

const root = makeTempRepo('run-next-provider-authoring-step');
writeJson(path.join(root, 'docs', 'generated', `provider-authoring-backlog-${generatedDate}.json`), {
  rows: [
    { executionPriority: 2, stateId: 'alaska', stateName: 'Alaska', sourceTargetsExists: true, sourceTargetsPath: 'data/source_targets/alaska.json', concreteProviderTargetCount: 2, neededConcreteTargets: 1, nextAction: 'alaska' },
    { executionPriority: 1, stateId: 'alabama', stateName: 'Alabama', sourceTargetsExists: true, sourceTargetsPath: 'data/source_targets/alabama.json', concreteProviderTargetCount: 1, neededConcreteTargets: 2, nextAction: 'alabama' },
  ],
});
const output = runNode('scripts/run-next-provider-authoring-step.mjs', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
});
assert.equal(output.mode, 'provider_authoring_next_step');
assert.equal(output.selectedState.stateId, 'alabama');
assert.ok(output.commands.includes('npm run audit:provider-authoring-backlog'));
assert.ok(output.commands.includes('npm run audit:provider-authoring-state-packets'));
assert.ok(output.commands.includes('npm run run:next-provider-authoring-packet'));

const idleRoot = makeTempRepo('run-next-provider-authoring-step-idle');
writeJson(path.join(idleRoot, 'docs', 'generated', `provider-authoring-backlog-${generatedDate}.json`), {
  rows: [],
});
const idleOutput = runNode('scripts/run-next-provider-authoring-step.mjs', {
  cwd: idleRoot,
  env: { ABLEFULL_REPO_ROOT: idleRoot },
});
assert.equal(idleOutput.mode, 'provider_authoring_idle');

console.log('run next provider authoring step tests passed');
