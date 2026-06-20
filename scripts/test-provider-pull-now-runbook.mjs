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
runNode('src/db/generate_provider_repair_execution_backlog.js');
const output = runNode('src/db/generate_provider_pull_now_runbook.js');
const jsonPath = path.join(repoRoot, 'docs', 'generated', `provider-pull-now-runbook-${generatedDate}.json`);

assert.ok(fs.existsSync(jsonPath));
assert.ok(output.pullNowRowCount > 0);

const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
assert.equal(payload.summary.pullNowRowCount, 22);
assert.equal(payload.summary.firstActionClass, 'replace_domain');
assert.ok(Array.isArray(payload.slices));
assert.equal(payload.slices[0]?.actionClass, 'replace_domain');
assert.ok(payload.slices.some((slice) => slice.actionClass === 'author_alternate_first_party_target'));
assert.ok(Array.isArray(payload.stateSlices));
assert.equal(payload.stateSlices[0]?.stateId, 'tennessee');
assert.ok(payload.preflight.includes('Do not expand beyond pull-now rows in this cycle.'));

console.log('provider pull-now runbook tests passed');
