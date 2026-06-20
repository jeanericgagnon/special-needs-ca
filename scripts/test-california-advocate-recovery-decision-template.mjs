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

runNode('src/db/generate_california_advocate_recovery_decision_template.js');
const queuePath = path.join(repoRoot, 'docs', 'generated', `california-advocate-recovery-queue-${generatedDate}.json`);
const jsonPath = path.join(repoRoot, 'docs', 'generated', `california-advocate-recovery-decision-template-${generatedDate}.json`);
assert.ok(fs.existsSync(jsonPath));
assert.ok(fs.existsSync(queuePath));
const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
assert.equal(payload.entryCommand, 'npm run audit:california-advocate-recovery-decision-template');
assert.equal(payload.applyCommand, 'npm run fix:california-advocate-recovery-decisions -- --apply');
assert.equal(payload.auditCommand, 'npm run audit:california-advocate-recovery');
assert.ok(Array.isArray(payload.commands));
assert.ok(payload.commands.includes('npm run fix:california-advocate-recovery-decisions -- --apply'));
assert.equal(payload.rows.length, (queue.counties || []).length);
if (payload.rows.length > 0) {
  assert.ok(payload.rows.some((row) => row.priorityTier === 'priority'));
}

console.log('California advocate recovery decision template tests passed');
