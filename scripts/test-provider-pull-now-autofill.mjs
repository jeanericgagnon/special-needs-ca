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

const root = makeTempRepo('provider-pull-now-autofill');
writeJson(path.join(root, 'data', 'provider-pull-now-decisions.json'), {
  rows: [
    {
      stateId: 'indiana',
      actionClass: 'manual_review_or_replace',
      sourceUrl: 'https://www.rileychildrens.org/contact-and-locations/riley-hospital-for-children-at-iu-health',
      decisionMode: '',
      reviewedBy: '',
    },
    {
      stateId: 'indiana',
      actionClass: 'bounded_retry_then_replace',
      sourceUrl: 'https://www.rileychildrens.org/',
      decisionMode: '',
      reviewedBy: '',
    },
  ],
});
writeJson(path.join(root, 'docs', 'generated', `provider-source-pack-plan-${generatedDate}.json`), {
  states: [
    {
      stateId: 'indiana',
      concreteProviderTargets: [
        {
          source_name: "Riley Children's Health",
          source_url: 'https://www.rileychildrens.org',
        },
      ],
    },
  ],
});

const dryRun = runNode('scripts/autofill-provider-pull-now-decisions.mjs', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
});
assert.equal(dryRun.summary.autofilledRows, 1);
assert.equal(dryRun.summary.skippedByReason.retry_rows_not_autofilled, 1);

const applied = runNode('scripts/autofill-provider-pull-now-decisions.mjs', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
  args: ['--apply'],
});
assert.equal(applied.summary.autofilledRows, 1);

const updated = readJson(path.join(root, 'data', 'provider-pull-now-decisions.json'));
assert.equal(updated.rows[0].decisionMode, 'replace_with_reviewed_first_party_target');
assert.equal(updated.rows[0].reviewedSourceUrl, 'https://www.rileychildrens.org/');
assert.equal(updated.rows[1].decisionMode, '');

console.log('provider pull-now autofill tests passed');
