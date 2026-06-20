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

function runNode(scriptRelativePath, { cwd, env = {} }) {
  const result = spawnSync(process.execPath, [path.join(repoRoot, scriptRelativePath)], {
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

const root = makeTempRepo('provider-pull-now-sync');
writeJson(path.join(root, 'docs', 'generated', `provider-pull-now-decision-template-${generatedDate}.json`), {
  rows: [
    { stateId: 'tennessee', sourceUrl: 'https://www.lebonheur.org/', decisionMode: '', reviewedBy: '' },
    { stateId: 'indiana', sourceUrl: 'https://www.rileychildrens.org/', decisionMode: '', reviewedBy: '' },
  ],
});

const output = runNode('scripts/sync-provider-pull-now-decision-file.mjs', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
});

assert.equal(output.templateRows, 2);
assert.equal(output.action, 'created');

const active = readJson(path.join(root, 'data', 'provider-pull-now-decisions.json'));
assert.equal(active.rows.length, 2);

console.log('provider pull-now decision sync tests passed');
