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

const root = makeTempRepo('run-next-normalization-step');
writeJson(path.join(root, 'docs', 'generated', `normalization-gap-queue-${generatedDate}.json`), {
  summary: { blockerStatus: 'partial' },
  rows: [
    {
      lane: 'org_type_semantics_review',
      subjectType: 'organization_type',
      subjectId: 'nonprofit',
      organizationType: 'nonprofit',
      currentRows: 10,
      normalizedRows: 10,
      missingRows: 0,
      nextAction: 'Preserve semantics.',
      entryCommand: 'npm run fix:normalize-nonprofit-areas',
      auditCommand: 'npm run audit:normalization-gap-queue',
      commands: [
        'npm run fix:normalize-nonprofit-areas',
        'npm run audit:normalization-gap-queue',
      ],
    },
    {
      lane: 'provider_service_location_gap',
      subjectType: 'state_cluster',
      subjectId: 'nebraska',
      organizationType: 'provider_org',
      currentRows: 3,
      normalizedRows: 1,
      missingRows: 2,
      nextAction: 'Backfill locations.',
      entryCommand: 'npm run fix:normalize-provider-locations',
      auditCommand: 'npm run audit:normalization-gap-queue',
      commands: [
        'npm run fix:normalize-provider-locations',
        'npm run audit:normalization-gap-queue',
      ],
    },
  ],
});

const output = runNode('scripts/run-next-normalization-step.mjs', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
});
assert.equal(output.mode, 'normalization_next_step');
assert.equal(output.selectedRow.lane, 'provider_service_location_gap');
assert.equal(output.selectedRow.entryCommand, 'npm run fix:normalize-provider-locations');
assert.equal(output.selectedRow.auditCommand, 'npm run audit:normalization-gap-queue');
assert.ok(output.commands.includes('npm run fix:normalize-provider-locations'));

const semanticsRoot = makeTempRepo('run-next-normalization-step-semantics');
writeJson(path.join(semanticsRoot, 'docs', 'generated', `normalization-gap-queue-${generatedDate}.json`), {
  summary: { blockerStatus: 'partial' },
  rows: [
    {
      lane: 'org_type_semantics_review',
      subjectType: 'organization_type',
      subjectId: 'advocacy_org',
      organizationType: 'advocacy_org',
      currentRows: 5,
      normalizedRows: 5,
      missingRows: 0,
      nextAction: 'Preserve semantics.',
      entryCommand: 'npm run fix:normalize-advocate-areas',
      auditCommand: 'npm run audit:normalization-gap-queue',
      commands: [
        'npm run fix:normalize-advocate-areas',
        'npm run audit:normalization-gap-queue',
      ],
    },
  ],
});
const semanticsOutput = runNode('scripts/run-next-normalization-step.mjs', {
  cwd: semanticsRoot,
  env: { ABLEFULL_REPO_ROOT: semanticsRoot },
});
assert.ok(semanticsOutput.commands.includes('npm run fix:normalize-advocate-areas'));

const idleRoot = makeTempRepo('run-next-normalization-step-idle');
writeJson(path.join(idleRoot, 'docs', 'generated', `normalization-gap-queue-${generatedDate}.json`), {
  summary: { blockerStatus: 'partial' },
  rows: [],
});
const idleOutput = runNode('scripts/run-next-normalization-step.mjs', {
  cwd: idleRoot,
  env: { ABLEFULL_REPO_ROOT: idleRoot },
});
assert.equal(idleOutput.mode, 'normalization_idle');
assert.equal(idleOutput.selectedRow, null);
assert.deepEqual(idleOutput.commands, []);

console.log('run next normalization step tests passed');
