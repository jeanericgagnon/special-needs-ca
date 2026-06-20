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

const root = makeTempRepo('run-next-advocate-depth-step');
writeJson(path.join(root, 'docs', 'generated', `advocate-depth-queue-${generatedDate}.json`), {
  summary: {
    totalRows: 2,
    blockerStatus: 'meaningful_but_not_exhaustive',
  },
  rows: [
    {
      lane: 'california_truth_recovery',
      subjectType: 'county',
      subjectId: 'los-angeles',
      stateId: 'california',
      priority: 2,
      rowCount: 10,
      reason: 'county_loses_all_public_safe_advocates',
      sourceUrl: '',
      nextAction: 'Recover at least one truth-safe advocate source for this county before broad advocate expansion.',
      entryCommand: 'npm run audit:california-advocate-recovery-decision-template',
      auditCommand: 'npm run audit:california-advocate-recovery',
      commands: [
        'npm run audit:california-advocate-recovery-decision-template',
        'npm run audit:california-advocate-recovery',
      ],
    },
    {
      lane: 'repeated_source_repair',
      subjectType: 'source_url',
      subjectId: 'example.org',
      stateId: 'california',
      priority: 1,
      rowCount: 1,
      reason: 'dns_lookup_failed',
      sourceUrl: 'https://example.org',
      nextAction: 'Replace this stale advocate domain with a current first-party source instead of retrying.',
      entryCommand: 'npm run run:next-advocate-source-repair-step',
      auditCommand: 'npm run audit:advocate-source-repair-queue',
      commands: [
        'npm run audit:advocate-source-repair-queue',
        'npm run run:next-advocate-source-repair-step',
      ],
    },
  ],
});

const output = runNode('scripts/run-next-advocate-depth-step.mjs', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
});

assert.equal(output.mode, 'advocate_depth_next_step');
assert.equal(output.selectedRow.lane, 'california_truth_recovery');
assert.equal(output.selectedRow.entryCommand, 'npm run audit:california-advocate-recovery-decision-template');
assert.equal(output.selectedRow.auditCommand, 'npm run audit:california-advocate-recovery');
assert.ok(output.commands.includes('npm run audit:california-advocate-recovery-decision-template'));

const repairRoot = makeTempRepo('run-next-advocate-depth-step-repair');
writeJson(path.join(repairRoot, 'docs', 'generated', `advocate-depth-queue-${generatedDate}.json`), {
  summary: {
    totalRows: 1,
    blockerStatus: 'meaningful_but_not_exhaustive',
  },
  rows: [
    {
      lane: 'repeated_source_repair',
      subjectType: 'source_url',
      subjectId: 'example.org',
      stateId: 'california',
      priority: 3,
      rowCount: 1,
      reason: 'dns_lookup_failed',
      sourceUrl: 'https://example.org',
      nextAction: 'Replace this stale advocate domain with a current first-party source instead of retrying.',
      entryCommand: 'npm run run:next-advocate-source-repair-step',
      auditCommand: 'npm run audit:advocate-source-repair-queue',
      commands: [
        'npm run audit:advocate-source-repair-queue',
        'npm run run:next-advocate-source-repair-step',
      ],
    },
  ],
});
const repairOutput = runNode('scripts/run-next-advocate-depth-step.mjs', {
  cwd: repairRoot,
  env: { ABLEFULL_REPO_ROOT: repairRoot },
});
assert.equal(repairOutput.selectedRow.lane, 'repeated_source_repair');
assert.ok(repairOutput.commands.includes('npm run run:next-advocate-source-repair-step'));

const idleRoot = makeTempRepo('run-next-advocate-depth-step-idle');
writeJson(path.join(idleRoot, 'docs', 'generated', `advocate-depth-queue-${generatedDate}.json`), {
  summary: {
    totalRows: 0,
    blockerStatus: 'meaningful_but_not_exhaustive',
  },
  rows: [],
});

const idleOutput = runNode('scripts/run-next-advocate-depth-step.mjs', {
  cwd: idleRoot,
  env: { ABLEFULL_REPO_ROOT: idleRoot },
});

assert.equal(idleOutput.mode, 'advocate_depth_idle');
assert.equal(idleOutput.selectedRow, null);
assert.deepEqual(idleOutput.commands, []);

console.log('run next advocate depth step tests passed');
