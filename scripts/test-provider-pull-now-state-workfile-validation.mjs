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

const root = makeTempRepo('provider-state-workfile-validation');
writeJson(path.join(root, 'data', 'provider-pull-now-state-workfiles', 'provider-pull-now-state-workfile-tennessee.json'), {
  rows: [
    {
      stateId: 'tennessee',
      actionClass: 'replace_domain',
      sourceUrl: 'https://www.lebonheur.org/',
      decisionMode: 'replace_with_reviewed_first_party_target',
      reviewedSourceName: '',
      reviewedSourceUrl: '',
      reviewedBy: 'op',
    },
    {
      stateId: 'tennessee',
      actionClass: 'bounded_retry_then_replace',
      sourceUrl: 'https://www.rileychildrens.org/',
      decisionMode: 'bounded_retry_once',
      reviewedBy: 'op',
    },
  ],
});

const output = runNode('src/db/generate_provider_pull_now_state_workfile_validation.js', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
  args: ['--state=tennessee'],
});
assert.equal(output.summary.mergeReady, false);
assert.equal(output.summary.issueRows, 1);

const payload = readJson(path.join(root, 'docs', 'generated', `provider-pull-now-state-workfile-validation-tennessee-${generatedDate}.json`));
assert.equal(payload.issues[0].rowIssues.includes('missing_reviewed_source_name'), true);
assert.equal(payload.issues[0].rowIssues.includes('missing_reviewed_source_url'), true);

const unresolvedRoot = makeTempRepo('provider-state-workfile-validation-unresolved');
writeJson(path.join(unresolvedRoot, 'data', 'provider-pull-now-state-workfiles', 'provider-pull-now-state-workfile-tennessee.json'), {
  rows: [
    {
      stateId: 'tennessee',
      actionClass: 'replace_domain',
      sourceUrl: 'https://www.lebonheur.org/',
      decisionMode: '',
      reviewedSourceName: '',
      reviewedSourceUrl: '',
      reviewedBy: '',
    },
  ],
});
const unresolvedOutput = runNode('src/db/generate_provider_pull_now_state_workfile_validation.js', {
  cwd: unresolvedRoot,
  env: { ABLEFULL_REPO_ROOT: unresolvedRoot },
  args: ['--state=tennessee'],
});
assert.equal(unresolvedOutput.summary.unresolvedRows, 1);
assert.equal(unresolvedOutput.summary.mergeReady, false);

console.log('provider pull-now state workfile validation tests passed');
