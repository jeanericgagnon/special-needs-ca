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

const root = makeTempRepo('run-next-advocate-source-repair-step');
writeJson(path.join(root, 'docs', 'generated', `advocate-source-repair-queue-${generatedDate}.json`), {
  rows: [
    {
      repairKey: 'a',
      sourceUrl: 'https://a.example',
      hostname: 'a.example',
      followupReason: 'dns_lookup_failed',
      repeatCount: 2,
      recommendedDecisionMode: 'replace_with_reviewed_first_party_target',
      entryCommand: 'npm run audit:advocate-source-repair-decision-template',
      auditCommand: 'npm run audit:advocate-source-repair-queue',
      commands: [
        'npm run audit:advocate-source-repair-decision-template',
        'npm run fix:advocate-source-repair-decisions',
        'npm run audit:advocate-source-repair-queue',
      ],
    },
    {
      repairKey: 'b',
      sourceUrl: 'https://b.example',
      hostname: 'b.example',
      followupReason: 'network_timeout',
      repeatCount: 5,
      recommendedDecisionMode: 'bounded_retry_once',
      entryCommand: 'npm run audit:advocate-source-repair-decision-template',
      auditCommand: 'npm run audit:advocate-source-repair-queue',
      commands: [
        'npm run audit:advocate-source-repair-decision-template',
        'npm run fix:advocate-source-repair-decisions',
        'npm run audit:advocate-source-repair-queue',
      ],
    },
  ],
});

const output = runNode('scripts/run-next-advocate-source-repair-step.mjs', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
});
assert.equal(output.mode, 'advocate_source_repair_next_step');
assert.equal(output.selectedRow.repairKey, 'b');
assert.equal(output.selectedRow.entryCommand, 'npm run audit:advocate-source-repair-decision-template');
assert.equal(output.selectedRow.auditCommand, 'npm run audit:advocate-source-repair-queue');
assert.ok(output.commands.includes('npm run audit:advocate-source-repair-decision-template'));
assert.ok(output.commands.includes('npm run fix:advocate-source-repair-decisions'));

const idleRoot = makeTempRepo('run-next-advocate-source-repair-step-idle');
writeJson(path.join(idleRoot, 'docs', 'generated', `advocate-source-repair-queue-${generatedDate}.json`), {
  rows: [],
});
const idleOutput = runNode('scripts/run-next-advocate-source-repair-step.mjs', {
  cwd: idleRoot,
  env: { ABLEFULL_REPO_ROOT: idleRoot },
});
assert.equal(idleOutput.mode, 'advocate_source_repair_idle');
assert.equal(idleOutput.selectedRow, null);

console.log('run next advocate source repair step tests passed');
