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
  fs.mkdirSync(path.join(root, 'data'), { recursive: true });
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
    env: { ...process.env, ...env },
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error(`Script failed: ${scriptRelativePath}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
  }
  return JSON.parse(result.stdout.trim());
}

const root = makeTempRepo('prune-provider-pull-now-decisions');
writeJson(path.join(root, 'docs', 'generated', `provider-pull-now-decision-template-${generatedDate}.json`), {
  rows: [
    { stateId: 'indiana', sourceUrl: 'https://www.rileychildrens.org/' },
  ],
});
writeJson(path.join(root, 'data', 'provider-pull-now-decisions.json'), {
  rows: [
    { stateId: 'indiana', sourceUrl: 'https://www.rileychildrens.org/', decisionMode: 'bounded_retry_once', reviewedBy: 'tester' },
    { stateId: 'stale', sourceUrl: 'https://example.com/stale', decisionMode: 'needs_manual_research', reviewedBy: 'tester' },
  ],
});

const dryRun = runNode('scripts/prune-provider-pull-now-decisions.mjs', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
});
assert.equal(dryRun.keptRows, 1);
assert.equal(dryRun.prunedRows, 1);
assert.equal(readJson(path.join(root, 'data', 'provider-pull-now-decisions.json')).rows.length, 2);

const applyRun = runNode('scripts/prune-provider-pull-now-decisions.mjs', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
  args: ['--apply'],
});
assert.equal(applyRun.keptRows, 1);
assert.equal(applyRun.prunedRows, 1);
assert.equal(readJson(path.join(root, 'data', 'provider-pull-now-decisions.json')).rows.length, 1);

console.log('prune provider pull-now decisions tests passed');
