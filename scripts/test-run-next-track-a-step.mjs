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

function runNode(scriptRelativePath, { cwd, env = {} }) {
  const result = spawnSync(process.execPath, [path.join(repoRoot, scriptRelativePath)], {
    cwd,
    env: { ...process.env, ...env },
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error(`Script failed: ${scriptRelativePath}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
  }
  return JSON.parse(result.stdout.trim());
}

const root = makeTempRepo('run-next-track-a-step');
writeJson(path.join(root, 'docs', 'generated', `track-a-burndown-backlog-${generatedDate}.json`), {
  backlog: [
    {
      blockerId: 'advocate_directory_depth',
      queueArtifact: 'docs/generated/advocate-depth-queue.json',
      queueCount: 10,
      critical: false,
      helperMode: 'advocate_depth_next_step',
      helperActionable: true,
      nextAction: 'advocate',
      entryCommand: 'npm run run:next-advocate-depth-step',
      auditCommand: 'npm run audit:advocate-depth-queue',
      commands: [
        'npm run run:next-advocate-depth-step',
        'npm run audit:advocate-depth-queue',
      ],
      executionPriority: 2,
    },
    {
      blockerId: 'knowledge_content_depth',
      queueArtifact: 'docs/generated/knowledge-content-status-queue.json',
      queueCount: 2,
      critical: true,
      helperMode: 'knowledge_content_next_step',
      helperActionable: true,
      nextAction: 'knowledge',
      entryCommand: 'npm run run:next-knowledge-content-step',
      auditCommand: 'npm run audit:knowledge-content-status-queue',
      commands: [
        'npm run run:next-knowledge-content-step',
        'npm run audit:knowledge-content-status-queue',
      ],
      executionPriority: 1,
    },
  ],
});

const output = runNode('scripts/run-next-track-a-step.mjs', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
});
assert.equal(output.mode, 'track_a_next_step');
assert.equal(output.selectedBlocker.blockerId, 'knowledge_content_depth');
assert.equal(output.selectedBlocker.entryCommand, 'npm run run:next-knowledge-content-step');
assert.equal(output.selectedBlocker.auditCommand, 'npm run audit:knowledge-content-status-queue');
assert.equal(output.selectedBlocker.helperMode, 'knowledge_content_next_step');
assert.equal(output.selectedBlocker.helperActionable, true);
assert.ok(output.commands.includes('npm run run:next-knowledge-content-step'));
assert.ok(output.commands.includes('npm run audit:knowledge-content-status-queue'));
assert.ok(output.commands.includes('npm run audit:track-a-burndown-backlog'));

const idleRoot = makeTempRepo('run-next-track-a-step-idle');
writeJson(path.join(idleRoot, 'docs', 'generated', `track-a-burndown-backlog-${generatedDate}.json`), {
  backlog: [],
});
const idleOutput = runNode('scripts/run-next-track-a-step.mjs', {
  cwd: idleRoot,
  env: { ABLEFULL_REPO_ROOT: idleRoot },
});
assert.equal(idleOutput.mode, 'track_a_idle');
assert.equal(idleOutput.selectedBlocker, null);
assert.deepEqual(idleOutput.commands, []);

const skipIdleRoot = makeTempRepo('run-next-track-a-step-skip-idle');
writeJson(path.join(skipIdleRoot, 'docs', 'generated', `track-a-burndown-backlog-${generatedDate}.json`), {
  backlog: [
    {
      blockerId: 'provider_directory',
      queueArtifact: 'docs/generated/provider-followup-repair-queue.json',
      queueCount: 0,
      critical: true,
      helperMode: 'provider_depth_idle',
      helperActionable: false,
      nextAction: 'provider idle',
      entryCommand: 'npm run run:next-provider-depth-step',
      auditCommand: 'npm run audit:source-acquisition-completion-plan',
      commands: [
        'npm run run:next-provider-depth-step',
        'npm run audit:source-acquisition-completion-plan',
      ],
      executionPriority: 2,
    },
    {
      blockerId: 'knowledge_content_depth',
      queueArtifact: 'docs/generated/knowledge-content-status-queue.json',
      queueCount: 1,
      critical: true,
      helperMode: 'knowledge_content_next_step',
      helperActionable: true,
      nextAction: 'knowledge active',
      entryCommand: 'npm run run:next-knowledge-content-step',
      auditCommand: 'npm run audit:knowledge-content-status-queue',
      commands: [
        'npm run run:next-knowledge-content-step',
        'npm run audit:knowledge-content-status-queue',
      ],
      executionPriority: 1,
    },
  ],
});
const skipIdleOutput = runNode('scripts/run-next-track-a-step.mjs', {
  cwd: skipIdleRoot,
  env: { ABLEFULL_REPO_ROOT: skipIdleRoot },
});
assert.equal(skipIdleOutput.mode, 'track_a_next_step');
assert.equal(skipIdleOutput.selectedBlocker.blockerId, 'knowledge_content_depth');

const skipExhaustedRoot = makeTempRepo('run-next-track-a-step-skip-exhausted');
writeJson(path.join(skipExhaustedRoot, 'docs', 'generated', `track-a-burndown-backlog-${generatedDate}.json`), {
  backlog: [
    {
      blockerId: 'provider_directory',
      queueArtifact: 'docs/generated/provider-authoring-backlog.json',
      queueCount: 0,
      critical: true,
      helperMode: 'provider_depth_idle',
      helperActionable: false,
      nextAction: 'provider exhausted',
      entryCommand: 'npm run run:next-provider-depth-step',
      auditCommand: 'npm run audit:source-acquisition-completion-plan',
      commands: [
        'npm run run:next-provider-depth-step',
        'npm run audit:source-acquisition-completion-plan',
      ],
      executionPriority: 2,
    },
    {
      blockerId: 'knowledge_content_depth',
      queueArtifact: 'docs/generated/knowledge-content-status-queue.json',
      queueCount: 0,
      critical: true,
      helperMode: 'knowledge_content_authoring_next_step',
      helperActionable: true,
      nextAction: 'knowledge authoring',
      entryCommand: 'npm run run:next-knowledge-content-step',
      auditCommand: 'npm run audit:knowledge-content-status-queue',
      commands: [
        'npm run run:next-knowledge-content-step',
        'npm run audit:knowledge-content-status-queue',
      ],
      executionPriority: 1,
    },
  ],
});
const skipExhaustedOutput = runNode('scripts/run-next-track-a-step.mjs', {
  cwd: skipExhaustedRoot,
  env: { ABLEFULL_REPO_ROOT: skipExhaustedRoot },
});
assert.equal(skipExhaustedOutput.mode, 'track_a_next_step');
assert.equal(skipExhaustedOutput.selectedBlocker.blockerId, 'knowledge_content_depth');

console.log('run next track a step tests passed');
