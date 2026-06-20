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
  fs.mkdirSync(path.join(root, 'data', 'source_targets'), { recursive: true });
  return root;
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
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

const root = makeTempRepo('provider-repair-brief-filter');
fs.mkdirSync(path.join(root, 'data', 'source-acquisition-state'), { recursive: true });

writeJson(path.join(root, 'docs', 'generated', `provider-followup-blocker-registry-${generatedDate}.json`), {
  rows: [
    {
      bucket: 'source_repair',
      followupReason: 'stale_or_invalid_404',
      sourceUrl: 'https://www.chp.edu/our-services/developmental-pediatrics',
      hostname: 'www.chp.edu',
      repeatCount: 3,
      runIds: ['run-1'],
      stateIds: ['pennsylvania'],
      sampleStatusCodes: ['404'],
      savedPaths: ['saved.html'],
    },
    {
      bucket: 'source_repair',
      followupReason: 'stale_or_invalid_404',
      sourceUrl: 'https://www.chop.edu/centers-programs/developmental-and-behavioral-pediatrics',
      hostname: 'www.chop.edu',
      repeatCount: 2,
      runIds: ['run-2'],
      stateIds: ['pennsylvania'],
      sampleStatusCodes: ['404'],
      savedPaths: ['saved2.html'],
    },
    {
      bucket: 'source_repair',
      followupReason: 'stale_or_invalid_404',
      sourceUrl: 'https://www.cookchildrens.org/services/child-development',
      hostname: 'www.cookchildrens.org',
      repeatCount: 2,
      runIds: ['run-3'],
      stateIds: ['pennsylvania'],
      sampleStatusCodes: ['404'],
      savedPaths: ['saved3.html'],
    },
  ],
});

writeJson(path.join(root, 'docs', 'generated', `track-a-blocker-registry-${generatedDate}.json`), {
  blockers: [{ id: 'provider_directory', status: 'critical_gap' }],
});

writeJson(path.join(root, 'docs', 'generated', `provider-source-pack-plan-${generatedDate}.json`), {
  states: [{ stateId: 'pennsylvania', readinessLane: 'author-targets-first' }],
});

writeJson(path.join(root, 'data', 'source_targets', 'pennsylvania.json'), [
  {
    source_name: 'UPMC',
    source_url: 'https://www.chp.edu/our-services/developmental-pediatrics',
    target_table: 'resource_providers',
  },
  {
    source_name: 'CHOP',
    source_url: 'https://www.chop.edu/centers-programs/developmental-and-behavioral-pediatrics',
    target_table: 'resource_providers',
  },
  {
    source_name: 'Cook Children\'s',
    source_url: 'https://www.cookchildrens.org/services/child-development/',
    target_table: 'resource_providers',
  },
]);

writeJson(path.join(root, 'docs', 'generated', `provider-repair-authoring-brief-pennsylvania-${generatedDate}.json`), {
  rows: [
    {
      stateId: 'pennsylvania',
      sourceUrl: 'https://www.chp.edu/our-services/developmental-pediatrics',
    },
  ],
});

writeJson(path.join(root, 'data', 'source-acquisition-state', 'provider-pull-now-resolution-ledger.json'), {
  rows: [
    {
      stateId: 'pennsylvania',
      sourceUrl: 'https://www.cookchildrens.org/services/child-development',
      status: 'deferred_bounded_retry_once',
    },
  ],
});

const output = runNode('src/db/generate_provider_followup_repair_queue.js', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
});

assert.equal(output.totalRows, 1);
const payload = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'generated', `provider-followup-repair-queue-${generatedDate}.json`), 'utf8'));
assert.equal(payload.rows.length, 1);
assert.equal(payload.rows[0].sourceUrl, 'https://www.chop.edu/centers-programs/developmental-and-behavioral-pediatrics');

console.log('provider followup repair queue authoring brief filter tests passed');
