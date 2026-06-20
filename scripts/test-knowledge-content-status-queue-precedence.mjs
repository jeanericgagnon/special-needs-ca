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
  fs.mkdirSync(path.join(root, 'data', 'source-acquisition-runs'), { recursive: true });
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

const root = makeTempRepo('knowledge-status-precedence');

writeJson(path.join(root, 'docs', 'generated', `authored-missing-source-targets-${generatedDate}.json`), {
  targets: [
    {
      id: 'knowledge-idea-child-find',
      gapFamily: 'knowledge_content',
      sourceName: 'IDEA Child Find',
      sourceUrl: 'https://sites.ed.gov/idea/regs/b/d/300.111',
      domain: 'sites.ed.gov',
      sourceFamily: 'official_knowledge_source',
      expectedExtractionFields: 'child_find_duties',
      whyNeeded: 'Needed for knowledge guidance.',
      authoredAt: generatedDate,
    },
  ],
});

writeJson(path.join(root, 'docs', 'generated', `track-a-blocker-registry-${generatedDate}.json`), {
  blockers: [
    {
      id: 'knowledge_content_depth',
      status: 'critical_gap',
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

writeJson(
  path.join(root, 'data', 'source-acquisition-runs', '2026-06-19T00-00-00-000Z', 'followups', 'blocked-failures.json'),
  [
    {
      gapFamily: 'knowledge_content',
      sourceUrl: 'https://sites.ed.gov/idea/regs/b/d/300.111',
      followupReason: 'sandbox_network_disabled',
    },
  ]
);

writeJson(
  path.join(root, 'data', 'source-acquisition-runs', '2026-06-19T00-10-00-000Z', 'followups', 'source-repair.json'),
  [
    {
      gapFamily: 'knowledge_content',
      sourceUrl: 'https://sites.ed.gov/idea/regs/b/d/300.111',
      followupReason: 'stale_or_invalid_404',
    },
  ]
);

runNode('src/db/generate_knowledge_content_status_queue.js', root);

const payload = JSON.parse(
  fs.readFileSync(path.join(root, 'docs', 'generated', `knowledge-content-status-queue-${generatedDate}.json`), 'utf8')
);
const row = payload.rows.find((item) => item.id === 'knowledge-idea-child-find');

assert.ok(row);
assert.equal(row.lastFollowupReason, 'stale_or_invalid_404');
assert.equal(row.finalStatus, 'fetch_blocked');
assert.ok(row.nextCommands.includes('npm run audit:knowledge-content-repair-queue'));

console.log('knowledge content status queue precedence tests passed');
