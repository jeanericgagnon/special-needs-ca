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

const output = runNode('src/db/generate_normalization_gap_queue.js');
const jsonPath = path.join(repoRoot, 'docs', 'generated', `normalization-gap-queue-${generatedDate}.json`);

assert.ok(fs.existsSync(jsonPath));
assert.equal(output.totalRows, 0);

const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
assert.equal(payload.summary.totalRows, 0);
assert.equal(payload.summary.byLane.provider_service_location_gap || 0, 0);
assert.equal(payload.summary.byLane.org_type_semantics_review || 0, 0);
assert.deepEqual(payload.rows, []);

console.log('normalization gap queue tests passed');
