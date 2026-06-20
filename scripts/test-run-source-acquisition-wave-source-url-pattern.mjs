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

function runWave(cwd, args = []) {
  const result = spawnSync(process.execPath, [path.join(repoRoot, 'scripts', 'run-source-acquisition-wave.mjs'), ...args], {
    cwd,
    env: {
      ...process.env,
      ABLEFULL_REPO_ROOT: cwd,
    },
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error(`wave failed\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
  }
  return JSON.parse(result.stdout.trim());
}

const root = makeTempRepo('source-url-pattern');
writeJson(path.join(root, 'docs', 'generated', `source-acquisition-completion-plan-${generatedDate}.json`), {
  combinedReadyRows: [
    {
      stateId: 'national',
      sourceUrl: 'https://www.cdc.gov/cerebral-palsy/about/index.html',
      targetTable: 'knowledge_articles',
      gapFamily: 'knowledge_content',
      ledgerStatus: 'ready_lightweight',
      sourceQueue: 'authored_missing_family',
      executionLane: 'ready_target_scrape',
      executionPriority: 1,
      familyPriority: 60,
    },
  ],
  queueWaves: [],
});

const output = runWave(root, [
  '--mode=dry-run',
  '--lane=ready_target_scrape',
  '--gap=knowledge_content',
  '--limit=1',
  '--source-url-pattern=https://www.cdc.gov/cerebral-palsy/about',
]);

assert.equal(output.selectedCount, 1);

const retryableRoot = makeTempRepo('source-url-pattern-knowledge-retryable');
writeJson(path.join(retryableRoot, 'docs', 'generated', `source-acquisition-completion-plan-${generatedDate}.json`), {
  combinedReadyRows: [
    {
      id: 'knowledge-retryable',
      stateId: 'national',
      sourceUrl: 'https://sites.ed.gov/idea/regs/b/d/300.111',
      targetTable: 'knowledge_articles',
      gapFamily: 'knowledge_content',
      ledgerStatus: 'ready_lightweight',
      sourceQueue: 'authored_missing_family',
      executionLane: 'ready_target_scrape',
      executionPriority: 1,
      familyPriority: 60,
    },
  ],
  queueWaves: [],
});
writeJson(path.join(retryableRoot, 'docs', 'generated', `knowledge-content-status-queue-${generatedDate}.json`), {
  rows: [
    {
      id: 'knowledge-retryable',
      sourceUrl: 'https://sites.ed.gov/idea/regs/b/d/300.111',
      finalStatus: 'deferred_unresolved',
      lastFollowupReason: 'sandbox_network_disabled',
    },
  ],
});
writeJson(path.join(retryableRoot, 'data', 'source-acquisition-runs', '2026-06-19T00-00-00-000Z', 'followups', 'blocked-failures.json'), [
  {
    gapFamily: 'knowledge_content',
    sourceUrl: 'https://sites.ed.gov/idea/regs/b/d/300.111',
    followupReason: 'sandbox_network_disabled',
  },
  {
    gapFamily: 'knowledge_content',
    sourceUrl: 'https://sites.ed.gov/idea/regs/b/d/300.111',
    followupReason: 'sandbox_network_disabled',
  },
]);

const retryableOutput = runWave(retryableRoot, [
  '--mode=dry-run',
  '--lane=ready_target_scrape',
  '--gap=knowledge_content',
  '--limit=1',
  '--source-url-pattern=https://sites.ed.gov/idea/regs/b/d/300.111',
]);

assert.equal(retryableOutput.selectedCount, 1);
console.log('run source acquisition wave source-url-pattern tests passed');
