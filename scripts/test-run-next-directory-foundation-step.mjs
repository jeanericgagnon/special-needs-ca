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

const root = makeTempRepo('run-next-directory-foundation-step');
writeJson(path.join(root, 'docs', 'generated', `directory-foundation-enrichment-queue-${generatedDate}.json`), {
  summary: {
    totalRows: 3,
    blockerStatus: 'partial',
  },
  rows: [
    {
      lane: 'nonprofit_candidate_review',
      targetTable: 'nonprofit_organizations',
      subjectId: 'np-1',
      subjectLabel: 'Nonprofit One',
      priority: 2,
      sourceUrl: 'https://example.org/np',
      nextAction: 'Review nonprofit clues.',
      entryCommand: 'npm run run:nonprofit-accessibility-lightweight-batch -- --mode=dry-run --limit=1',
      auditCommand: 'npm run audit:directory-foundation-enrichment-queue',
      commands: [
        'npm run audit:directory-accessibility-candidates',
        'npm run run:nonprofit-accessibility-lightweight-batch -- --mode=dry-run --limit=1',
        'npm run audit:directory-foundation-enrichment-queue',
      ],
    },
    {
      lane: 'provider_candidate_review',
      targetTable: 'resource_providers',
      subjectId: 'rp-1',
      subjectLabel: 'Provider One',
      priority: 1,
      sourceUrl: 'https://example.org/provider',
      nextAction: 'Review provider clues.',
      entryCommand: 'npm run fix:provider-accessibility-review-queue',
      auditCommand: 'npm run audit:directory-foundation-enrichment-queue',
      commands: [
        'npm run fix:provider-accessibility-review-queue',
        'npm run audit:provider-accessibility-review-decision-template',
        'npm run fix:provider-accessibility-apply-review-decisions',
        'npm run fix:provider-accessibility-promote-reviewed',
        'npm run audit:directory-foundation-enrichment-queue',
      ],
    },
    {
      lane: 'advocate_gap_summary',
      targetTable: 'iep_advocates',
      subjectId: 'iep_advocates',
      subjectLabel: 'IEP Advocates',
      priority: 0,
      nextAction: 'Keep blocker visible.',
      entryCommand: 'npm run audit:directory-accessibility',
      auditCommand: 'npm run audit:directory-foundation-enrichment-queue',
      commands: [
        'npm run audit:directory-accessibility',
        'npm run audit:directory-foundation-enrichment-queue',
      ],
    },
  ],
});

const output = runNode('scripts/run-next-directory-foundation-step.mjs', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
});

assert.equal(output.mode, 'directory_foundation_next_step');
assert.equal(output.selectedRow.lane, 'provider_candidate_review');
assert.equal(output.selectedRow.entryCommand, 'npm run fix:provider-accessibility-review-queue');
assert.equal(output.selectedRow.auditCommand, 'npm run audit:directory-foundation-enrichment-queue');
assert.ok(output.commands.includes('npm run fix:provider-accessibility-review-queue'));
assert.ok(output.commands.includes('npm run fix:provider-accessibility-apply-review-decisions'));
assert.ok(output.commands.includes('npm run fix:provider-accessibility-promote-reviewed'));

const idleRoot = makeTempRepo('run-next-directory-foundation-step-idle');
writeJson(path.join(idleRoot, 'docs', 'generated', `directory-foundation-enrichment-queue-${generatedDate}.json`), {
  summary: {
    totalRows: 0,
    blockerStatus: 'partial',
  },
  rows: [],
});

const idleOutput = runNode('scripts/run-next-directory-foundation-step.mjs', {
  cwd: idleRoot,
  env: { ABLEFULL_REPO_ROOT: idleRoot },
});

assert.equal(idleOutput.mode, 'directory_foundation_idle');
assert.equal(idleOutput.selectedRow, null);
assert.deepEqual(idleOutput.commands, []);

console.log('run next directory foundation step tests passed');
