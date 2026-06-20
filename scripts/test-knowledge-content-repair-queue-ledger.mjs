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
  return root;
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
}

function runNode(scriptRelativePath, cwd) {
  const result = spawnSync(process.execPath, [path.join(repoRoot, scriptRelativePath)], {
    cwd,
    env: {
      ...process.env,
      ABLEFULL_REPO_ROOT: cwd,
    },
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error(`Script failed: ${scriptRelativePath}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
  }
  return JSON.parse(result.stdout.trim());
}

const root = makeTempRepo('knowledge-repair-queue-ledger');

writeJson(path.join(root, 'docs', 'generated', `knowledge-content-status-queue-${generatedDate}.json`), {
  rows: [
    {
      id: 'knowledge-idea-child-find',
      sourceName: 'IDEA Child Find',
      sourceUrl: 'https://sites.ed.gov/idea/regs/b/d/300.111',
      domain: 'sites.ed.gov',
      whyNeeded: 'Needed for launch guidance.',
      finalStatus: 'fetch_blocked',
      lastFollowupReason: 'stale_or_invalid_404',
      latestFollowupRunId: '2026-06-19T02-33-19-909Z',
      followupRunCount: 4,
    },
  ],
});

writeJson(path.join(root, 'data', 'source-acquisition-state', 'knowledge-content-repair-ledger.json'), {
  rows: [
    {
      id: 'knowledge-idea-child-find',
      status: 'skipped_unresolved',
      decisionMode: 'skip_unresolved',
      sourceUrl: 'https://sites.ed.gov/idea/regs/b/d/300.111',
    },
  ],
});

runNode('src/db/generate_knowledge_content_repair_queue.js', root);

const payload = JSON.parse(
  fs.readFileSync(path.join(root, 'docs', 'generated', `knowledge-content-repair-queue-${generatedDate}.json`), 'utf8')
);

assert.equal(payload.summary.totalRows, 1);
assert.equal(payload.rows[0].id, 'knowledge-idea-child-find');
assert.equal(payload.rows[0].recommendedDecisionMode, 'defer_blocked_source');
assert.equal(payload.rows[0].repairClass, 'official_source_stale_or_removed');

console.log('knowledge content repair queue ledger tests passed');
