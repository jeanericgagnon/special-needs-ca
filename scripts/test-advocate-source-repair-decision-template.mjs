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

runNode('src/db/generate_advocate_source_repair_decision_template.js');
const jsonPath = path.join(repoRoot, 'docs', 'generated', `advocate-source-repair-decision-template-${generatedDate}.json`);

assert.ok(fs.existsSync(jsonPath));
const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
assert.equal(payload.entryCommand, 'npm run audit:advocate-source-repair-decision-template');
assert.equal(payload.applyCommand, 'npm run fix:advocate-source-repair-decisions -- --apply');
assert.equal(payload.auditCommand, 'npm run audit:advocate-source-repair-queue');
assert.ok(Array.isArray(payload.commands));
assert.ok(payload.commands.includes('npm run fix:advocate-source-repair-decisions -- --apply'));

console.log('advocate source repair decision template tests passed');
