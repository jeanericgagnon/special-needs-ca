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
  return root;
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
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

const root = makeTempRepo('provider-repair-batch');

writeJson(path.join(root, 'docs', 'generated', `provider-followup-repair-queue-${generatedDate}.json`), {
  rows: [
    {
      stateId: 'tennessee',
      readinessLane: 'pull-now',
      actionClass: 'replace_domain',
      followupReason: 'dns_lookup_failed',
      sourceUrl: 'https://www.lebonheur.org/',
      hostname: 'www.lebonheur.org',
      repeatCount: 4,
    },
    {
      stateId: 'tennessee',
      readinessLane: 'pull-now',
      actionClass: 'author_alternate_first_party_target',
      followupReason: 'access_blocked_403',
      sourceUrl: 'https://www.dollychildrens.org/',
      hostname: 'www.dollychildrens.org',
      repeatCount: 3,
    },
    {
      stateId: 'florida',
      readinessLane: 'author-targets-first',
      actionClass: 'replace_exact_url',
      followupReason: 'stale_or_invalid_404',
      sourceUrl: 'https://www.nicklauschildrens.org/locations/dan-marino-outpatient-center',
      hostname: 'www.nicklauschildrens.org',
      repeatCount: 5,
    },
  ],
});

writeJson(path.join(root, 'docs', 'generated', `provider-repair-execution-backlog-${generatedDate}.json`), {
  summary: {
    totalRows: 3,
    firstExecutionLane: 'pull-now',
  },
});

writeJson(path.join(root, 'docs', 'generated', `provider-source-pack-plan-${generatedDate}.json`), {
  states: [
    {
      stateId: 'tennessee',
      readinessLane: 'pull-now',
      concreteProviderTargetCount: 6,
      placeholderProviderTargetCount: 0,
      providerTargetCount: 6,
      sourceTargetsPath: 'data/source_targets/tennessee.json',
      nextMove: 'Start first-party pulls from Tennessee concrete targets.',
    },
  ],
});

const output = runNode('src/db/generate_provider_repair_batch_packet.js', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
});

assert.equal(output.readinessLane, 'pull-now');
assert.equal(output.stateId, 'tennessee');
assert.equal(output.selectedRows, 2);

const payload = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'generated', `provider-repair-batch-packet-pull-now-tennessee-${generatedDate}.json`), 'utf8'));
assert.equal(payload.selection.selectionMode, 'first_state_cluster');
assert.equal(payload.summary.selectedRows, 2);
assert.equal(payload.stateContext.stateId, 'tennessee');
assert.equal(payload.selectedRows[0].actionClass, 'replace_domain');
assert.ok(payload.recommendedCommands.includes('npm run audit:provider-source-pack'));

console.log('provider repair batch packet tests passed');
