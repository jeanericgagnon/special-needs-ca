import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = path.resolve(new URL('..', import.meta.url).pathname);

function makeTempRepo(name) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), `${name}-`));
  fs.mkdirSync(path.join(root, 'data', 'provider-pull-now-state-workfiles'), { recursive: true });
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

const root = makeTempRepo('provider-state-workfile-autofill');
const workfilePath = path.join(root, 'data', 'provider-pull-now-state-workfiles', 'provider-pull-now-state-workfile-tennessee.json');
writeJson(workfilePath, {
  rows: [
    {
      stateId: 'tennessee',
      sourceUrl: 'https://www.dollychildrens.org/',
      suggestedDecisionMode: 'needs_manual_research',
      suggestedReason: 'No safe replacement yet.',
      decisionMode: '',
      reviewNotes: '',
      reviewedBy: '',
    },
    {
      stateId: 'tennessee',
      sourceUrl: 'https://www.rileychildrens.org/',
      suggestedDecisionMode: 'bounded_retry_once',
      decisionMode: '',
      reviewNotes: '',
      reviewedBy: '',
    },
  ],
});

const dryRun = runNode('scripts/autofill-provider-pull-now-state-workfile.mjs', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
  args: ['--state=tennessee'],
});
assert.equal(dryRun.summary.autofilledRows, 2);

const before = readJson(workfilePath);
assert.equal(before.rows[0].reviewedBy, '');

const applied = runNode('scripts/autofill-provider-pull-now-state-workfile.mjs', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
  args: ['--state=tennessee', '--apply'],
});
assert.equal(applied.summary.autofilledRows, 2);
const after = readJson(workfilePath);
assert.equal(after.rows[0].decisionMode, 'needs_manual_research');
assert.equal(after.rows[0].reviewedBy, 'autofill:provider-pull-now-state-workfile');
assert.equal(after.rows[1].decisionMode, 'bounded_retry_once');
assert.equal(after.rows[1].retryNotes, '');

console.log('autofill provider pull-now state workfile tests passed');
