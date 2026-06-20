import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDate = new Date().toISOString().slice(0, 10);

function runNode(scriptRelativePath) {
  const scriptPath = path.join(repoRoot, scriptRelativePath);
  const result = spawnSync(process.execPath, [scriptPath], {
    cwd: repoRoot,
    env: {
      ...process.env,
      ABLEFULL_REPO_ROOT: repoRoot,
    },
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    throw new Error(`Script failed: ${scriptRelativePath}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
  }

  return JSON.parse(result.stdout.trim());
}

runNode('src/db/generate_knowledge_content_repair_queue.js');
const jsonPath = path.join(repoRoot, 'docs', 'generated', `knowledge-content-repair-queue-${generatedDate}.json`);
assert.ok(fs.existsSync(jsonPath));
const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
assert.equal(payload.summary.totalRows, payload.rows.length);
assert.ok(payload.summary.totalRows >= 0);
assert.ok(payload.summary.byRepairClass && typeof payload.summary.byRepairClass === 'object');
assert.ok(Array.isArray(payload.rows));
assert.ok(payload.rows.every((row) => Array.isArray(row.commands)));

console.log('knowledge content repair queue tests passed');
