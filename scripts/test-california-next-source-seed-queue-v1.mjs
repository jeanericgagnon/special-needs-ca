import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ca-next-source-queue-'));
fs.mkdirSync(path.join(tmp, 'data', 'generated'), { recursive: true });
fs.mkdirSync(path.join(tmp, 'docs', 'generated'), { recursive: true });

let result = spawnSync(process.execPath, [path.join(repoRoot, 'scripts', 'generate-california-next-source-registry-v1.mjs')], {
  cwd: tmp,
  encoding: 'utf8',
});
assert.equal(result.status, 0, result.stderr);

result = spawnSync(process.execPath, [path.join(repoRoot, 'scripts', 'generate-california-next-source-seed-queue-v1.mjs')], {
  cwd: tmp,
  encoding: 'utf8',
});
assert.equal(result.status, 0, result.stderr);

const queuePath = path.join(tmp, 'data', 'generated', 'california-next-source-seed-queue-v1.jsonl');
const summaryPath = path.join(tmp, 'data', 'generated', 'california-next-source-seed-queue-v1.json');
const markdownPath = path.join(tmp, 'docs', 'generated', 'california-next-source-seed-queue-v1.md');

assert.ok(fs.existsSync(queuePath), 'queue jsonl should exist');
assert.ok(fs.existsSync(summaryPath), 'queue summary should exist');
assert.ok(fs.existsSync(markdownPath), 'queue markdown should exist');

const queueRows = fs.readFileSync(queuePath, 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line));
const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));

assert.equal(queueRows.length, 18);
assert.equal(summary.queueRows, 18);
assert.equal(summary.byFamily.ihss, 2);
assert.equal(summary.byFamily.selpa, 2);
assert.equal(summary.byBatchClass.directory_root, 3);
assert.equal(summary.byBatchClass.html, 15);

for (const row of queueRows) {
  assert.equal(row.state, 'california');
  assert.equal(row.displayStatusOnIngest, 'needs_review');
  assert.equal(row.queueLane, 'registry_seed_fetch');
  assert.ok(Array.isArray(row.requiredValidationChecks) && row.requiredValidationChecks.includes('official_domain'));
  assert.ok(row.url.startsWith('https://'));
  assert.ok(row.timeoutMs > 0);
  assert.ok(row.maxBytes >= 3 * 1024 * 1024);
  if (row.batchClass === 'directory_root') {
    assert.equal(row.fetchMode, 'http_fetch_with_same_domain_discovery');
  }
}

const markdown = fs.readFileSync(markdownPath, 'utf8');
assert.match(markdown, /## Seed Jobs/);
assert.match(markdown, /ca_seed_001/);

console.log('california next-source seed queue tests passed');
