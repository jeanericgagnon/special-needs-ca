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

const root = makeTempRepo('provider-pull-now-progress');
writeJson(path.join(root, 'data', 'provider-pull-now-decisions.json'), {
  rows: [
    { stateId: 'tennessee', actionClass: 'replace_domain', sourceUrl: 'https://www.lebonheur.org/', repeatCount: 2, decisionMode: '', reviewedBy: '' },
    { stateId: 'indiana', actionClass: 'bounded_retry_then_replace', sourceUrl: 'https://www.rileychildrens.org/', repeatCount: 7, decisionMode: 'bounded_retry_once', reviewedBy: 'codex' },
  ],
});
writeJson(path.join(root, 'docs', 'generated', `provider-pull-now-decision-template-${generatedDate}.json`), {
  rows: [{}, {}],
});
writeJson(path.join(root, 'docs', 'generated', `provider-pull-now-manual-fill-queue-${generatedDate}.json`), {
  summary: { unresolvedRows: 1 },
  rows: [{ stateId: 'tennessee' }],
});

const output = runNode('src/db/generate_provider_pull_now_decision_progress.js', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
});
assert.equal(output.unresolvedRows, 1);
assert.equal(output.completionPercent, 50);

const payload = readJson(path.join(root, 'docs', 'generated', `provider-pull-now-decision-progress-${generatedDate}.json`));
assert.equal(payload.summary.filledRows, 1);
assert.equal(payload.summary.unresolvedRows, 1);
assert.equal(payload.summary.byState.tennessee, 1);

console.log('provider pull-now decision progress tests passed');
