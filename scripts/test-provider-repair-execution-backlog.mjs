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
const output = runNode('src/db/generate_provider_repair_execution_backlog.js');
const jsonPath = path.join(repoRoot, 'docs', 'generated', `provider-repair-execution-backlog-${generatedDate}.json`);

assert.ok(fs.existsSync(jsonPath));
assert.ok(output.totalRows >= 0);

const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
assert.ok(payload.summary.totalRows >= 0);
assert.equal(payload.summary.totalRows, output.totalRows);
assert.equal(payload.summary.firstExecutionLane, payload.firstTwentyRows[0]?.readinessLane || null);
assert.ok(Array.isArray(payload.laneSummary));
assert.ok(payload.laneSummary.some((lane) => lane.lane === 'pull-now'));
assert.ok(Array.isArray(payload.stateSummary));
if (payload.stateSummary.length > 0) {
  assert.ok(payload.stateSummary[0]?.stateId);
}
assert.ok(Array.isArray(payload.hostSummary));
if (payload.hostSummary.length > 0) {
  assert.ok(payload.hostSummary.some((host) => host.hostname));
}
assert.ok(Array.isArray(payload.firstTwentyRows));
assert.ok(payload.firstTwentyRows.length >= 0);
assert.ok(payload.commandCadence.some((command) => command.includes('audit:provider-repair-execution-backlog')));

console.log('provider repair execution backlog tests passed');
