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

const root = makeTempRepo('apply-california-advocate-recovery');
writeJson(path.join(root, 'docs', 'generated', `california-advocate-recovery-queue-${generatedDate}.json`), {
  counties: [
    { countyId: 'alameda', countyName: 'Alameda County' },
  ],
});
writeJson(path.join(root, 'docs', 'generated', `california-advocate-recovery-decision-template-${generatedDate}.json`), {
  entryCommand: 'npm run audit:california-advocate-recovery-decision-template',
  applyCommand: 'npm run fix:california-advocate-recovery-decisions -- --apply',
  auditCommand: 'npm run audit:california-advocate-recovery',
  commands: [
    'npm run audit:california-advocate-recovery-decision-template',
    'npm run fix:california-advocate-recovery-decisions -- --apply',
    'npm run audit:california-advocate-recovery',
  ],
  rows: [
    {
      countyId: 'alameda',
      decisionMode: 'defer_county_until_real_source',
      reviewedBy: 'tester',
      reviewedSourceName: '',
      reviewedSourceUrl: '',
      reviewNotes: 'Synthetic-only county',
    },
  ],
});

const dryRun = runNode('scripts/apply-california-advocate-recovery-decisions.mjs', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
});
assert.equal(dryRun.summary.deferredCounties, 1);
assert.equal(fs.existsSync(path.join(root, 'data', 'source-acquisition-state', 'california-advocate-recovery-ledger.json')), false);

const apply = runNode('scripts/apply-california-advocate-recovery-decisions.mjs', {
  cwd: root,
  env: { ABLEFULL_REPO_ROOT: root },
  args: ['--apply'],
});
assert.equal(apply.summary.deferredCounties, 1);
const ledger = readJson(path.join(root, 'data', 'source-acquisition-state', 'california-advocate-recovery-ledger.json'));
assert.equal(ledger.rows[0].status, 'deferred_county_until_real_source');

console.log('apply California advocate recovery decisions tests passed');
