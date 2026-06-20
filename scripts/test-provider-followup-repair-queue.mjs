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
const output = runNode('src/db/generate_provider_followup_repair_queue.js');
const jsonPath = path.join(repoRoot, 'docs', 'generated', `provider-followup-repair-queue-${generatedDate}.json`);

assert.ok(fs.existsSync(jsonPath));
assert.ok(output.totalRows >= 0);

const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
assert.ok(payload.summary.totalRows >= 0);
assert.ok(payload.summary.distinctSourceUrls >= 0);
assert.ok(Array.isArray(payload.rows));
if (payload.rows.length > 0) {
  assert.ok(payload.rows.some((row) => row.actionClass === 'replace_exact_url') || payload.rows.some((row) => row.actionClass === 'author_alternate_first_party_target'));
}
assert.ok(!payload.rows.some((row) =>
  row.stateId === 'louisiana' &&
  ['https://www.lsuhs.edu/', 'https://www.manningchildrens.org/', 'https://www.ochsner.org/'].includes(row.sourceUrl)
));

console.log('provider followup repair queue tests passed');
