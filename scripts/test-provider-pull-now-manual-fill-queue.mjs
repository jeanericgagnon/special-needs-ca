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

const root = makeTempRepo('provider-pull-now-manual-fill');
writeJson(path.join(root, 'data', 'provider-pull-now-decisions.json'), {
  rows: [
    {
      stateId: 'tennessee',
      actionClass: 'replace_domain',
      followupReason: 'dns_lookup_failed',
      sourceUrl: 'https://www.lebonheur.org/',
      hostname: 'www.lebonheur.org',
      repeatCount: 2,
      decisionMode: '',
    },
    {
      stateId: 'indiana',
      actionClass: 'bounded_retry_then_replace',
      followupReason: 'network_timeout',
      sourceUrl: 'https://www.rileychildrens.org/',
      hostname: 'www.rileychildrens.org',
      repeatCount: 7,
      decisionMode: '',
    },
  ],
});
writeJson(path.join(root, 'docs', 'generated', `provider-source-pack-plan-${generatedDate}.json`), {
  states: [
    {
      stateId: 'tennessee',
      concreteProviderTargets: [
        {
          source_name: "Le Bonheur Children's Hospital",
          source_url: 'https://www.lebonheur.org',
          priority: 1,
        },
      ],
    },
    {
      stateId: 'indiana',
      concreteProviderTargets: [
        {
          source_name: "Riley Children's Health",
          source_url: 'https://www.rileychildrens.org',
          priority: 1,
        },
      ],
    },
  ],
});

const output = runNode('src/db/generate_provider_pull_now_manual_fill_queue.js', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
});
assert.equal(output.unresolvedRows, 2);

const payload = readJson(path.join(root, 'docs', 'generated', `provider-pull-now-manual-fill-queue-${generatedDate}.json`));
assert.equal(payload.summary.unresolvedRows, 2);
assert.equal(payload.rows[0].decisionHint, 'bounded_retry_once');
const replacementCandidateRow = payload.rows.find((row) => row.stateId === 'tennessee');
assert.ok(replacementCandidateRow);
assert.equal(replacementCandidateRow.sameDomainCandidateCount, 1);
assert.equal(replacementCandidateRow.topConcreteTargets[0]?.sourceName, "Le Bonheur Children's Hospital");

console.log('provider pull-now manual fill queue tests passed');
