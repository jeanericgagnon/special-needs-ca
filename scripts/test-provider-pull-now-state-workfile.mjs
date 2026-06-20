import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = path.resolve(new URL('..', import.meta.url).pathname);
const generatedDate = new Date().toISOString().slice(0, 10);

function makeTempRepo(name) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), `${name}-`));
  fs.mkdirSync(path.join(root, 'docs', 'generated', 'provider-pull-now-state-decision-packets'), { recursive: true });
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

function testStateWorkfileRoundTrip() {
  const root = makeTempRepo('provider-state-workfile');
  writeJson(path.join(root, 'docs', 'generated', 'provider-pull-now-state-decision-packets', `provider-pull-now-state-decision-packet-tennessee-${generatedDate}.json`), {
    stateId: 'tennessee',
    rows: [
      {
        stateId: 'tennessee',
        actionClass: 'author_alternate_first_party_target',
        sourceUrl: 'https://www.dollychildrens.org/',
        hostname: 'www.dollychildrens.org',
        followupReason: 'access_blocked_403',
        repeatCount: 12,
        suggestedDecisionMode: 'needs_manual_research',
        suggestedReason: 'No safe replacement yet.',
        currentDecision: {
          decisionMode: '',
          reviewedSourceName: '',
          reviewedSourceUrl: '',
          retryNotes: '',
          reviewNotes: '',
          reviewedBy: '',
        },
      },
    ],
  });
  writeJson(path.join(root, 'data', 'provider-pull-now-decisions.json'), {
    rows: [
      {
        stateId: 'tennessee',
        actionClass: 'author_alternate_first_party_target',
        sourceUrl: 'https://www.dollychildrens.org/',
        decisionMode: '',
        reviewedSourceName: '',
        reviewedSourceUrl: '',
        retryNotes: '',
        reviewNotes: '',
        reviewedBy: '',
      },
    ],
  });

  const syncOutput = runNode('scripts/sync-provider-pull-now-state-workfile.mjs', {
    cwd: root,
    env: { ABLEFULL_REPO_ROOT: root },
    args: ['--state=tennessee'],
  });
  const workfile = readJson(syncOutput.workfile);
  assert.equal(workfile.summary.unresolvedRows, 1);
  workfile.rows[0].decisionMode = 'needs_manual_research';
  workfile.rows[0].reviewedBy = 'op';
  workfile.rows[0].reviewNotes = 'Still blocked in saved artifacts.';
  writeJson(syncOutput.workfile, workfile);

  const dryRun = runNode('scripts/apply-provider-pull-now-state-workfile.mjs', {
    cwd: root,
    env: { ABLEFULL_REPO_ROOT: root },
    args: ['--state=tennessee'],
  });
  assert.equal(dryRun.updatedRows, 1);
  assert.equal(readJson(path.join(root, 'data', 'provider-pull-now-decisions.json')).rows[0].reviewedBy, '');

  runNode('scripts/apply-provider-pull-now-state-workfile.mjs', {
    cwd: root,
    env: { ABLEFULL_REPO_ROOT: root },
    args: ['--state=tennessee', '--apply'],
  });
  const updated = readJson(path.join(root, 'data', 'provider-pull-now-decisions.json'));
  assert.equal(updated.rows[0].decisionMode, 'needs_manual_research');
  assert.equal(updated.rows[0].reviewedBy, 'op');
}

testStateWorkfileRoundTrip();
console.log('provider pull-now state workfile tests passed');
