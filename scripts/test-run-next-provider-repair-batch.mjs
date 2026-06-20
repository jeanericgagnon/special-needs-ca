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

const root = makeTempRepo('run-next-provider-repair-batch');
fs.writeFileSync(path.join(root, 'package.json'), `${JSON.stringify({
  name: 'fixture',
  private: true,
  type: 'module',
  scripts: {
    'audit:provider-repair-batch-packet': `node ${JSON.stringify(path.join(repoRoot, 'src', 'db', 'generate_provider_repair_batch_packet.js'))}`,
  },
}, null, 2)}\n`);

writeJson(path.join(root, 'docs', 'generated', `low-token-control-plane-${generatedDate}.json`), {
  lanes: {
    providerRepairBacklog: {
      status: 'needs_followup',
      firstExecutionLane: 'author-targets-first',
      action: {
        blocker: 'provider_followup_repair_backlog_pending',
        nextAction: 'Work the provider repair backlog.',
        nextState: 'texas',
        readinessLane: 'author-targets-first',
      },
    },
  },
});

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
  ],
});

writeJson(path.join(root, 'docs', 'generated', `provider-repair-execution-backlog-${generatedDate}.json`), {
  summary: {
    totalRows: 1,
    firstExecutionLane: 'pull-now',
  },
  firstTwentyRows: [
    {
      stateId: 'tennessee',
      readinessLane: 'pull-now',
      actionClass: 'replace_domain',
      sourceUrl: 'https://www.lebonheur.org/',
    },
  ],
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

const output = runNode('scripts/run-next-provider-repair-batch.mjs', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
});

assert.equal(output.mode, 'review_provider_repair_batch');
assert.ok(output.command.includes('--lane=pull-now --state=tennessee --limit=5'));
assert.equal(output.providerRepairBacklog.nextState, 'tennessee');
assert.equal(output.packet.stateId, 'tennessee');

console.log('run next provider repair batch tests passed');

const idleRoot = makeTempRepo('run-next-provider-repair-batch-idle');
fs.writeFileSync(path.join(idleRoot, 'package.json'), `${JSON.stringify({
  name: 'fixture',
  private: true,
  type: 'module',
  scripts: {
    'audit:provider-repair-batch-packet': `node ${JSON.stringify(path.join(repoRoot, 'src', 'db', 'generate_provider_repair_batch_packet.js'))}`,
  },
}, null, 2)}\n`);

writeJson(path.join(idleRoot, 'docs', 'generated', `low-token-control-plane-${generatedDate}.json`), {
  lanes: {
    providerRepairBacklog: {
      status: 'idle_or_cleared',
      firstExecutionLane: '',
      action: {
        blocker: 'none',
        nextAction: 'Provider repair backlog is clear; no exact provider repair work is queued.',
        recommendedCommands: [],
      },
    },
  },
});

writeJson(path.join(idleRoot, 'docs', 'generated', `provider-followup-repair-queue-${generatedDate}.json`), {
  rows: [],
});

writeJson(path.join(idleRoot, 'docs', 'generated', `provider-repair-execution-backlog-${generatedDate}.json`), {
  summary: {
    totalRows: 0,
    firstExecutionLane: null,
  },
  firstTwentyRows: [],
});

const idleOutput = runNode('scripts/run-next-provider-repair-batch.mjs', {
  cwd: idleRoot,
  env: { ABLEFULL_REPO_ROOT: idleRoot },
});

assert.equal(idleOutput.command, '');
assert.equal(idleOutput.providerRepairBacklog.status, 'idle_or_cleared');
assert.equal(idleOutput.packet, null);

console.log('run next provider repair batch idle tests passed');

const staleRoot = makeTempRepo('run-next-provider-repair-batch-stale-control-plane');
fs.writeFileSync(path.join(staleRoot, 'package.json'), `${JSON.stringify({
  name: 'fixture',
  private: true,
  type: 'module',
  scripts: {
    'audit:provider-repair-batch-packet': `node ${JSON.stringify(path.join(repoRoot, 'src', 'db', 'generate_provider_repair_batch_packet.js'))}`,
  },
}, null, 2)}\n`);

writeJson(path.join(staleRoot, 'docs', 'generated', `low-token-control-plane-${generatedDate}.json`), {
  lanes: {
    providerRepairBacklog: {
      status: 'idle_or_cleared',
      firstExecutionLane: '',
      action: {
        blocker: 'none',
        nextAction: 'Provider repair backlog is clear; no exact provider repair work is queued.',
        recommendedCommands: [],
      },
    },
  },
});

writeJson(path.join(staleRoot, 'docs', 'generated', `provider-followup-repair-queue-${generatedDate}.json`), {
  rows: [
    {
      stateId: 'maryland',
      readinessLane: 'author-targets-first',
      actionClass: 'author_alternate_first_party_target',
      followupReason: 'access_blocked_403',
      sourceUrl: 'https://www.hopkinsmedicine.org/johns-hopkins-childrens-center',
      hostname: 'www.hopkinsmedicine.org',
      repeatCount: 5,
    },
  ],
});

writeJson(path.join(staleRoot, 'docs', 'generated', `provider-repair-execution-backlog-${generatedDate}.json`), {
  summary: {
    totalRows: 1,
    firstExecutionLane: 'author-targets-first',
  },
  firstTwentyRows: [
    {
      stateId: 'maryland',
      readinessLane: 'author-targets-first',
      actionClass: 'author_alternate_first_party_target',
      sourceUrl: 'https://www.hopkinsmedicine.org/johns-hopkins-childrens-center',
    },
  ],
});

writeJson(path.join(staleRoot, 'docs', 'generated', `provider-source-pack-plan-${generatedDate}.json`), {
  states: [
    {
      stateId: 'maryland',
      readinessLane: 'author-targets-first',
      concreteProviderTargetCount: 2,
      placeholderProviderTargetCount: 0,
      providerTargetCount: 2,
      sourceTargetsPath: 'data/source_targets/maryland.json',
      nextMove: 'Author safer alternate first-party targets for Maryland.',
    },
  ],
});

const staleOutput = runNode('scripts/run-next-provider-repair-batch.mjs', {
  cwd: staleRoot,
  env: { ABLEFULL_REPO_ROOT: staleRoot },
});

assert.ok(staleOutput.command.includes('--lane=author-targets-first --state=maryland --limit=5'));
assert.equal(staleOutput.providerRepairBacklog.status, 'needs_followup');
assert.equal(staleOutput.packet.stateId, 'maryland');

console.log('run next provider repair batch stale control-plane tests passed');
