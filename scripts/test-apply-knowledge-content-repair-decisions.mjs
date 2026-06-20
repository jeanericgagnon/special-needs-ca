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
  fs.mkdirSync(path.join(root, 'data', 'source-acquisition-state'), { recursive: true });
  fs.mkdirSync(path.join(root, 'data', 'source_packs'), { recursive: true });
  return root;
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
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

const root = makeTempRepo('apply-knowledge-content-repair');
writeJson(path.join(root, 'docs', 'generated', `knowledge-content-repair-queue-${generatedDate}.json`), {
  rows: [
    {
      id: 'knowledge-ssa-apply-child-disability',
      sourceName: 'SSA Apply for Child Disability Benefits',
      sourceUrl: 'https://www.ssa.gov/benefits/disability/apply-child.html',
    },
  ],
});
writeJson(path.join(root, 'docs', 'generated', `knowledge-content-repair-decision-template-${generatedDate}.json`), {
  entryCommand: 'npm run audit:knowledge-content-repair-decision-template',
  applyCommand: 'npm run fix:knowledge-content-repair-decisions -- --apply',
  auditCommand: 'npm run audit:knowledge-content-repair-queue',
  commands: [
    'npm run audit:knowledge-content-repair-decision-template',
    'npm run fix:knowledge-content-repair-decisions -- --apply',
    'npm run audit:knowledge-content-repair-queue',
  ],
  rows: [
    {
      id: 'knowledge-ssa-apply-child-disability',
      sourceUrl: 'https://www.ssa.gov/benefits/disability/apply-child.html',
      decisionMode: 'defer_blocked_source',
      reviewedBy: 'tester',
      reviewedSourceName: '',
      reviewedSourceUrl: '',
      reviewNotes: '403 blocked',
    },
  ],
});

const dryRun = runNode('scripts/apply-knowledge-content-repair-decisions.mjs', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
});
assert.equal(dryRun.summary.deferredRows, 1);
assert.equal(fs.existsSync(path.join(root, 'data', 'source-acquisition-state', 'knowledge-content-repair-ledger.json')), false);

const apply = runNode('scripts/apply-knowledge-content-repair-decisions.mjs', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
  args: ['--apply'],
});
assert.equal(apply.summary.deferredRows, 1);
const ledger = readJson(path.join(root, 'data', 'source-acquisition-state', 'knowledge-content-repair-ledger.json'));
assert.equal(ledger.rows[0].status, 'deferred_blocked_source');

console.log('apply knowledge content repair decisions tests passed');
