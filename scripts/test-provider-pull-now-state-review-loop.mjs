import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = path.resolve(new URL('..', import.meta.url).pathname);
const generatedDate = new Date().toISOString().slice(0, 10);

function makeTempRepo(name) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), `${name}-`));
  fs.mkdirSync(path.join(root, 'docs', 'generated', 'provider-pull-now-state-packets'), { recursive: true });
  fs.mkdirSync(path.join(root, 'docs', 'generated', 'provider-pull-now-state-decision-packets'), { recursive: true });
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

const root = makeTempRepo('provider-state-review-loop');
writeJson(path.join(root, 'docs', 'generated', 'provider-pull-now-state-packets', `provider-pull-now-state-packet-tennessee-${generatedDate}.json`), {
  unresolvedRows: 6,
});
writeJson(path.join(root, 'docs', 'generated', 'provider-pull-now-state-decision-packets', `provider-pull-now-state-decision-packet-tennessee-${generatedDate}.json`), {
  summary: { unresolvedRows: 6 },
});
writeJson(path.join(root, 'docs', 'generated', `provider-pull-now-state-workfile-status-tennessee-${generatedDate}.json`), {
  summary: { unresolvedRows: 5, completionPercent: 16.7 },
});
writeJson(path.join(root, 'docs', 'generated', `provider-pull-now-state-workfile-validation-tennessee-${generatedDate}.json`), {
  summary: { issueRows: 1, mergeReady: false },
});

const output = runNode('src/db/generate_provider_pull_now_state_review_loop.js', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
  args: ['--state=tennessee'],
});
assert.equal(output.summary.statePacketUnresolvedRows, 6);
assert.equal(output.summary.workfileUnresolvedRows, 5);
assert.equal(output.summary.validationIssueRows, 1);

const payload = readJson(path.join(root, 'docs', 'generated', `provider-pull-now-state-review-loop-tennessee-${generatedDate}.json`));
assert.equal(payload.commands.workfileMerge.includes('--state=tennessee --apply'), true);
assert.equal(payload.summary.mergeReady, false);

const unresolvedRoot = makeTempRepo('provider-state-review-loop-unresolved');
writeJson(path.join(unresolvedRoot, 'docs', 'generated', 'provider-pull-now-state-packets', `provider-pull-now-state-packet-tennessee-${generatedDate}.json`), {
  unresolvedRows: 6,
});
writeJson(path.join(unresolvedRoot, 'docs', 'generated', 'provider-pull-now-state-decision-packets', `provider-pull-now-state-decision-packet-tennessee-${generatedDate}.json`), {
  summary: { unresolvedRows: 6 },
});
writeJson(path.join(unresolvedRoot, 'docs', 'generated', `provider-pull-now-state-workfile-status-tennessee-${generatedDate}.json`), {
  summary: { unresolvedRows: 6, completionPercent: 0 },
});
writeJson(path.join(unresolvedRoot, 'docs', 'generated', `provider-pull-now-state-workfile-validation-tennessee-${generatedDate}.json`), {
  summary: { issueRows: 0, mergeReady: true },
});
const unresolvedOutput = runNode('src/db/generate_provider_pull_now_state_review_loop.js', {
  cwd: unresolvedRoot,
  env: { ABLEFULL_REPO_ROOT: unresolvedRoot },
  args: ['--state=tennessee'],
});
assert.equal(unresolvedOutput.summary.mergeReady, false);

console.log('provider pull-now state review loop tests passed');
