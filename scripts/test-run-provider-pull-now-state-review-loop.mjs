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

function seedPackage(root) {
  fs.writeFileSync(path.join(root, 'package.json'), `${JSON.stringify({
    name: 'fixture',
    private: true,
    type: 'module',
    scripts: {
      'fix:provider-pull-now-state-workfile': `node ${JSON.stringify(path.join(repoRoot, 'scripts', 'sync-provider-pull-now-state-workfile.mjs'))}`,
      'audit:provider-pull-now-state-workfile-status': `node ${JSON.stringify(path.join(repoRoot, 'src', 'db', 'generate_provider_pull_now_state_workfile_status.js'))}`,
      'audit:provider-pull-now-state-workfile-validation': `node ${JSON.stringify(path.join(repoRoot, 'src', 'db', 'generate_provider_pull_now_state_workfile_validation.js'))}`,
      'audit:provider-pull-now-state-review-loop': `node ${JSON.stringify(path.join(repoRoot, 'src', 'db', 'generate_provider_pull_now_state_review_loop.js'))}`,
    },
  }, null, 2)}\n`);
}

const root = makeTempRepo('run-provider-state-review-loop');
seedPackage(root);
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
writeJson(path.join(root, 'docs', 'generated', 'provider-pull-now-state-packets', `provider-pull-now-state-packet-tennessee-${generatedDate}.json`), {
  stateId: 'tennessee',
  unresolvedRows: 1,
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

const output = runNode('scripts/run-provider-pull-now-state-review-loop.mjs', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
  args: ['--state=tennessee'],
});
assert.equal(output.stateId, 'tennessee');
assert.equal(output.summary.unresolvedRows, 1);
assert.equal(output.summary.mergeReady, true);
assert.ok(output.reviewLoopPath.includes('provider-pull-now-state-review-loop-tennessee-'));
assert.equal(output.syncedWorkfile, true);

const existingWorkfilePath = path.join(root, 'data', 'provider-pull-now-state-workfiles', 'provider-pull-now-state-workfile-tennessee.json');
const existingWorkfile = readJson(existingWorkfilePath);
existingWorkfile.rows[0].decisionMode = 'needs_manual_research';
existingWorkfile.rows[0].reviewedBy = 'op';
writeJson(existingWorkfilePath, existingWorkfile);

const outputNoResync = runNode('scripts/run-provider-pull-now-state-review-loop.mjs', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
  args: ['--state=tennessee'],
});
assert.equal(outputNoResync.syncedWorkfile, false);

console.log('run provider pull-now state review loop tests passed');
