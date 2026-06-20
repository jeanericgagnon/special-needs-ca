import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDate = new Date().toISOString().slice(0, 10);
const docsDir = path.join(repoRoot, 'docs', 'generated');
const queuePath = path.join(docsDir, `scrape-target-universe-queue-${generatedDate}.json`);

const result = spawnSync(process.execPath, [
  path.join(repoRoot, 'src', 'db', 'generate_scrape_target_universe_queue.js'),
], {
  cwd: repoRoot,
  env: {
    ...process.env,
    ABLEFULL_REPO_ROOT: repoRoot,
  },
  encoding: 'utf8',
  maxBuffer: 1024 * 1024 * 10,
});

if (result.status !== 0) {
  throw new Error(`scrape target universe queue generation failed\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
}

assert.ok(fs.existsSync(queuePath), 'expected queue artifact to exist');
const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
assert.ok(Array.isArray(queue.combinedReadyRows), 'expected combinedReadyRows');
assert.ok(queue.combinedReadyRows.length > 0, 'expected runnable universe rows');
assert.ok(queue.combinedReadyRows.every((row) => row.executionLane === 'ready_target_scrape'));
assert.ok(queue.combinedReadyRows.every((row) => row.sourceUrl));
assert.equal(queue.summary.combinedReadyUniqueRows, queue.combinedReadyRows.length);

console.log('scrape target universe queue tests passed');
