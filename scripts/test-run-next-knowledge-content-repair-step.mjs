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

const root = makeTempRepo('run-next-knowledge-content-repair-step');
writeJson(path.join(root, 'docs', 'generated', `knowledge-content-repair-queue-${generatedDate}.json`), {
  summary: { totalRows: 2 },
  rows: [
    {
      id: 'b',
      sourceName: 'Row B',
      sourceUrl: 'https://example.com/b',
      repairClass: 'official_source_access_blocked',
      lastFollowupReason: 'access_blocked_403',
      followupRunCount: 2,
      recommendedDecisionMode: 'defer_blocked_source',
      entryCommand: 'npm run audit:knowledge-content-repair-decision-template',
      auditCommand: 'npm run audit:knowledge-content-repair-queue',
      commands: [
        'npm run audit:knowledge-content-repair-decision-template',
        'npm run fix:knowledge-content-repair-decisions',
        'npm run audit:knowledge-content-repair-queue',
      ],
    },
    {
      id: 'a',
      sourceName: 'Row A',
      sourceUrl: 'https://example.com/a',
      repairClass: 'official_source_access_blocked',
      lastFollowupReason: 'access_blocked_403',
      followupRunCount: 5,
      recommendedDecisionMode: 'defer_blocked_source',
      entryCommand: 'npm run audit:knowledge-content-repair-decision-template',
      auditCommand: 'npm run audit:knowledge-content-repair-queue',
      commands: [
        'npm run audit:knowledge-content-repair-decision-template',
        'npm run fix:knowledge-content-repair-decisions',
        'npm run audit:knowledge-content-repair-queue',
      ],
    },
  ],
});

const output = runNode('scripts/run-next-knowledge-content-repair-step.mjs', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
});

assert.equal(output.mode, 'knowledge_content_repair_next_step');
assert.equal(output.selectedRow.id, 'a');
assert.equal(output.selectedRow.entryCommand, 'npm run audit:knowledge-content-repair-decision-template');
assert.equal(output.selectedRow.auditCommand, 'npm run audit:knowledge-content-repair-queue');
assert.ok(output.commands.includes('npm run audit:knowledge-content-repair-decision-template'));
assert.ok(output.commands.includes('npm run fix:knowledge-content-repair-decisions'));

const idleRoot = makeTempRepo('run-next-knowledge-content-repair-step-idle');
writeJson(path.join(idleRoot, 'docs', 'generated', `knowledge-content-repair-queue-${generatedDate}.json`), {
  summary: { totalRows: 0 },
  rows: [],
});

const idleOutput = runNode('scripts/run-next-knowledge-content-repair-step.mjs', {
  cwd: idleRoot,
  env: { ABLEFULL_REPO_ROOT: idleRoot },
});

assert.equal(idleOutput.mode, 'knowledge_content_repair_idle');
assert.equal(idleOutput.selectedRow, null);
assert.deepEqual(idleOutput.commands, []);

console.log('run next knowledge content repair step tests passed');
