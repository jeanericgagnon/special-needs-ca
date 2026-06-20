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
  fs.mkdirSync(path.join(root, 'data', 'source-acquisition-runs'), { recursive: true });
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

const root = makeTempRepo('run-next-knowledge-content-step');
writeJson(path.join(root, 'docs', 'generated', `knowledge-content-status-queue-${generatedDate}.json`), {
  summary: {
    totalTargets: 3,
    blockerStatus: 'critical_gap',
  },
  rows: [
    {
      sourceName: 'CDC Autism About',
      sourceUrl: 'https://www.cdc.gov/autism/about/index.html',
      finalStatus: 'accepted_not_promoted',
      nextAction: 'Review staging and promotion state if this accepted knowledge target still needs a live article.',
      entryCommand: 'npm run run:source-acquisition-stage -- --run-id=<accepted-run-id> --family=knowledge_content --mode=dry-run',
      auditCommand: 'npm run run:source-acquisition-promote -- --run-id=<accepted-run-id> --family=knowledge_content --mode=dry-run',
    },
    {
      sourceName: 'SSA Child Disability',
      sourceUrl: 'https://www.ssa.gov/benefits/disability/apply-child.html',
      finalStatus: 'duplicate_of_existing_live_article',
      nextAction: 'No-op.',
    },
  ],
});

fs.mkdirSync(path.join(root, 'data', 'source-acquisition-runs', '2026-06-18T00-00-00-000Z', 'validated', 'knowledge_content'), { recursive: true });
fs.writeFileSync(
  path.join(root, 'data', 'source-acquisition-runs', '2026-06-18T00-00-00-000Z', 'validated', 'knowledge_content', 'accepted.ndjson'),
  `${JSON.stringify({ sourceUrl: 'https://www.cdc.gov/autism/about/index.html' })}\n`,
);

const output = runNode('scripts/run-next-knowledge-content-step.mjs', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
});

assert.equal(output.mode, 'knowledge_content_next_step');
assert.equal(output.selectedTarget.sourceUrl, 'https://www.cdc.gov/autism/about/index.html');
assert.equal(output.selectedTarget.latestAcceptedRunId, '2026-06-18T00-00-00-000Z');
assert.ok(output.selectedTarget.entryCommand?.includes('<accepted-run-id>'));
assert.ok(output.commands[0].includes('--run-id=2026-06-18T00-00-00-000Z'));

const idleRoot = makeTempRepo('run-next-knowledge-content-step-idle');
writeJson(path.join(idleRoot, 'docs', 'generated', `knowledge-content-status-queue-${generatedDate}.json`), {
  summary: {
    totalTargets: 3,
    blockerStatus: 'critical_gap',
  },
  rows: [
    {
      sourceName: 'A',
      sourceUrl: 'https://example.com/a',
      finalStatus: 'duplicate_of_existing_live_article',
    },
    {
      sourceName: 'B',
      sourceUrl: 'https://example.com/b',
      finalStatus: 'promoted_live',
    },
    {
      sourceName: 'C',
      sourceUrl: 'https://example.com/c',
      finalStatus: 'deferred_blocked_source',
    },
  ],
});
writeJson(path.join(idleRoot, 'docs', 'generated', `missing-source-families-${generatedDate}.json`), {
  families: [],
});

const idleOutput = runNode('scripts/run-next-knowledge-content-step.mjs', {
  cwd: idleRoot,
  env: { ABLEFULL_REPO_ROOT: idleRoot },
});

assert.equal(idleOutput.mode, 'knowledge_content_idle');
assert.equal(idleOutput.selectedTarget, null);
assert.deepEqual(idleOutput.commands, []);

const authoringRoot = makeTempRepo('run-next-knowledge-content-step-authoring');
writeJson(path.join(authoringRoot, 'docs', 'generated', `knowledge-content-status-queue-${generatedDate}.json`), {
  summary: {
    totalTargets: 3,
    blockerStatus: 'critical_gap',
  },
  rows: [
    {
      sourceName: 'A',
      sourceUrl: 'https://example.com/a',
      finalStatus: 'duplicate_of_existing_live_article',
    },
    {
      sourceName: 'B',
      sourceUrl: 'https://example.com/b',
      finalStatus: 'promoted_live',
    },
    {
      sourceName: 'C',
      sourceUrl: 'https://example.com/c',
      finalStatus: 'deferred_blocked_source',
    },
  ],
});
writeJson(path.join(authoringRoot, 'docs', 'generated', `missing-source-families-${generatedDate}.json`), {
  families: [
    {
      id: 'knowledge_content_sources',
      label: 'Knowledge article source families',
      reason: 'Need more official knowledge source packs.',
    },
  ],
});

const authoringOutput = runNode('scripts/run-next-knowledge-content-step.mjs', {
  cwd: authoringRoot,
  env: { ABLEFULL_REPO_ROOT: authoringRoot },
});

assert.equal(authoringOutput.mode, 'knowledge_content_authoring_next_step');
assert.equal(authoringOutput.selectedTarget.scope, 'knowledge_source_pack_authoring');
assert.ok(authoringOutput.commands.includes('npm run audit:authored-missing-source-targets'));
assert.ok(authoringOutput.commands.includes('npm run audit:source-acquisition-completion-plan'));

const unresolvedRoot = makeTempRepo('run-next-knowledge-content-step-unresolved');
writeJson(path.join(unresolvedRoot, 'docs', 'generated', `knowledge-content-status-queue-${generatedDate}.json`), {
  summary: {
    totalTargets: 7,
    blockerStatus: 'critical_gap',
    byFinalStatus: {
      deferred_unresolved: 2,
      promoted_live: 2,
      duplicate_of_existing_live_article: 3,
    },
  },
  rows: [
    {
      sourceName: 'A',
      sourceUrl: 'https://example.com/a',
      finalStatus: 'deferred_unresolved',
    },
    {
      sourceName: 'B',
      sourceUrl: 'https://example.com/b',
      finalStatus: 'promoted_live',
    },
  ],
});
writeJson(path.join(unresolvedRoot, 'docs', 'generated', `missing-source-families-${generatedDate}.json`), {
  families: [],
});

const unresolvedOutput = runNode('scripts/run-next-knowledge-content-step.mjs', {
  cwd: unresolvedRoot,
  env: { ABLEFULL_REPO_ROOT: unresolvedRoot },
});

assert.equal(unresolvedOutput.mode, 'knowledge_content_authoring_next_step');
assert.equal(unresolvedOutput.selectedTarget.scope, 'knowledge_source_pack_authoring');

const sandboxRetryRoot = makeTempRepo('run-next-knowledge-content-step-sandbox-retry');
writeJson(path.join(sandboxRetryRoot, 'docs', 'generated', `knowledge-content-status-queue-${generatedDate}.json`), {
  summary: {
    totalTargets: 1,
    blockerStatus: 'critical_gap',
    byFinalStatus: {
      deferred_unresolved: 1,
    },
  },
  rows: [
    {
      sourceName: 'IDEA Child Find',
      sourceUrl: 'https://sites.ed.gov/idea/regs/b/d/300.111',
      finalStatus: 'deferred_unresolved',
      lastFollowupReason: 'sandbox_network_disabled',
      nextAction: 'Retry exact target outside sandbox.',
    },
  ],
});
writeJson(path.join(sandboxRetryRoot, 'docs', 'generated', `source-acquisition-completion-plan-${generatedDate}.json`), {
  combinedReadyRows: [],
});

const sandboxRetryOutput = runNode('scripts/run-next-knowledge-content-step.mjs', {
  cwd: sandboxRetryRoot,
  env: { ABLEFULL_REPO_ROOT: sandboxRetryRoot },
});

assert.equal(sandboxRetryOutput.mode, 'knowledge_content_authoring_next_step');
assert.equal(sandboxRetryOutput.selectedTarget.scope, 'knowledge_source_pack_authoring');
assert.ok(sandboxRetryOutput.commands.includes('npm run audit:source-acquisition-completion-plan'));

const blockedRoot = makeTempRepo('run-next-knowledge-content-step-blocked');
writeJson(path.join(blockedRoot, 'docs', 'generated', `knowledge-content-status-queue-${generatedDate}.json`), {
  summary: {
    totalTargets: 1,
    blockerStatus: 'critical_gap',
  },
  rows: [
    {
      sourceName: 'SSA Child Disability',
      sourceUrl: 'https://www.ssa.gov/benefits/disability/qualify.html',
      finalStatus: 'fetch_blocked',
      nextAction: 'Repair exact target.',
      entryCommand: 'npm run audit:knowledge-content-repair-queue',
      auditCommand: 'npm run run:next-knowledge-content-repair-step',
      nextCommands: [
        'npm run audit:knowledge-content-repair-queue',
        'npm run run:next-knowledge-content-repair-step',
      ],
    },
  ],
});

const blockedOutput = runNode('scripts/run-next-knowledge-content-step.mjs', {
  cwd: blockedRoot,
  env: { ABLEFULL_REPO_ROOT: blockedRoot },
});

assert.equal(blockedOutput.mode, 'knowledge_content_next_step');
assert.equal(blockedOutput.selectedTarget.finalStatus, 'fetch_blocked');
assert.ok(blockedOutput.commands.includes('npm run run:next-knowledge-content-repair-step'));

const pendingRoot = makeTempRepo('run-next-knowledge-content-step-pending');
writeJson(path.join(pendingRoot, 'docs', 'generated', `knowledge-content-status-queue-${generatedDate}.json`), {
  summary: {
    totalTargets: 1,
    blockerStatus: 'critical_gap',
    byFinalStatus: {
      pending_exact_target: 1,
    },
  },
  rows: [
    {
      sourceName: 'IDEA Mediation',
      sourceUrl: 'https://sites.ed.gov/idea/regs/b/e/300.506',
      finalStatus: 'pending_exact_target',
      nextAction: 'Fetch the exact knowledge target.',
    },
  ],
});
writeJson(path.join(pendingRoot, 'docs', 'generated', `source-acquisition-completion-plan-${generatedDate}.json`), {
  combinedReadyRows: [],
});

const pendingOutput = runNode('scripts/run-next-knowledge-content-step.mjs', {
  cwd: pendingRoot,
  env: { ABLEFULL_REPO_ROOT: pendingRoot },
});

assert.equal(pendingOutput.mode, 'knowledge_content_authoring_next_step');
assert.equal(pendingOutput.selectedTarget.scope, 'knowledge_source_pack_authoring');
assert.ok(pendingOutput.commands.includes('npm run audit:source-acquisition-completion-plan'));

console.log('run next knowledge content step tests passed');
