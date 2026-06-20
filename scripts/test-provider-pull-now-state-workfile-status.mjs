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

const root = makeTempRepo('provider-state-workfile-status');
writeJson(path.join(root, 'data', 'provider-pull-now-state-workfiles', 'provider-pull-now-state-workfile-tennessee.json'), {
  rows: [
    {
      stateId: 'tennessee',
      actionClass: 'author_alternate_first_party_target',
      sourceUrl: 'https://www.dollychildrens.org/',
      suggestedDecisionMode: 'needs_manual_research',
      repeatCount: 12,
      decisionMode: '',
      reviewedBy: '',
    },
    {
      stateId: 'tennessee',
      actionClass: 'replace_domain',
      sourceUrl: 'https://www.lebonheur.org/',
      suggestedDecisionMode: 'needs_manual_research',
      repeatCount: 2,
      decisionMode: 'needs_manual_research',
      reviewedBy: 'op',
    },
  ],
});

const output = runNode('src/db/generate_provider_pull_now_state_workfile_status.js', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
  args: ['--state=tennessee'],
});
assert.equal(output.unresolvedRows, 1);
assert.equal(output.completionPercent, 50);

const payload = readJson(path.join(root, 'docs', 'generated', `provider-pull-now-state-workfile-status-tennessee-${generatedDate}.json`));
assert.equal(payload.summary.filledRows, 1);
assert.equal(payload.summary.unresolvedRows, 1);
assert.equal(payload.summary.byActionClass.author_alternate_first_party_target, 1);

console.log('provider pull-now state workfile status tests passed');
