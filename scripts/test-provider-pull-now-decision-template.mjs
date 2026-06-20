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

runNode('src/db/generate_provider_followup_blocker_registry.js');
runNode('src/db/generate_provider_followup_repair_queue.js');
runNode('src/db/generate_provider_pull_now_runbook.js');
const output = runNode('src/db/generate_provider_pull_now_decision_template.js');
const jsonPath = path.join(repoRoot, 'docs', 'generated', `provider-pull-now-decision-template-${generatedDate}.json`);

assert.ok(fs.existsSync(jsonPath));
assert.equal(output.rows, 22);
assert.equal(output.firstActionClass, 'replace_domain');

const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
assert.equal(payload.summary.pullNowRowCount, 22);
assert.ok(Array.isArray(payload.rows));
assert.equal(payload.rows.length, 22);
assert.ok(payload.instructions.allowedDecisionModes.includes('replace_with_reviewed_first_party_target'));
assert.ok(payload.rows.some((row) => row.actionClass === 'replace_domain'));
assert.ok(payload.rows.some((row) => row.actionClass === 'bounded_retry_then_replace'));

console.log('provider pull-now decision template tests passed');
