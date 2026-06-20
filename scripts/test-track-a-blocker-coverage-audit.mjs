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

const output = runNode('src/db/generate_track_a_blocker_coverage_audit.js');
const jsonPath = path.join(repoRoot, 'docs', 'generated', `track-a-blocker-coverage-audit-${generatedDate}.json`);

assert.ok(fs.existsSync(jsonPath));

const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
assert.equal(payload.summary.missingSourceFamilyCount, 0);
assert.equal(payload.summary.stillNeedToAuthorCount, 0);
assert.equal(payload.summary.unknownBlockerCount, 0);
assert.ok(payload.summary.blockerCount >= 5);
assert.ok(payload.blockerRows.every((row) => row.coveredByRegistry));
assert.equal(payload.summary.blockerRowsWithCommands, payload.summary.blockerCount);
assert.ok(payload.blockerRows.every((row) => row.hasEntryCommand));
assert.ok(payload.blockerRows.every((row) => row.hasAuditCommand));
assert.ok(payload.blockerRows.every((row) => row.hasCommands));

console.log('track a blocker coverage audit tests passed');
