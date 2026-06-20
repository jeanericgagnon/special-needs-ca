import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = path.resolve(new URL('..', import.meta.url).pathname);

function makeTempRepo(name) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), `${name}-`));
  fs.mkdirSync(path.join(root, 'data', 'source-acquisition-runs', '2026-06-18T00-00-00-000Z', 'followups'), { recursive: true });
  return root;
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

const root = makeTempRepo('parse-empty-bucket');
const output = runNode('scripts/run-source-acquisition-parse.mjs', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
  args: ['--run-id=2026-06-18T00-00-00-000Z', '--family=knowledge_content'],
});

assert.equal(output.runId, '2026-06-18T00-00-00-000Z');
assert.equal(output.familyCount, 0);
assert.deepEqual(output.families, []);

console.log('run source acquisition parse empty bucket tests passed');
