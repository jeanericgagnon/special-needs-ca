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

runNode('src/db/generate_track_a_blocker_registry.js');
runNode('src/db/generate_max_info_program.js');
const output = runNode('src/db/generate_track_a_finish_loop.js');
const jsonPath = path.join(repoRoot, 'docs', 'generated', `track-a-finish-loop-${generatedDate}.json`);

assert.ok(fs.existsSync(jsonPath));

const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
assert.ok(['burn_down', 'backlog', 'none'].includes(payload.focusMode));
assert.equal(payload.currentFamilyFocus?.id || null, output.currentFamily);
assert.equal(payload.currentBlockerFocus?.blockerId || null, output.currentBlocker);
if (payload.currentFamilyFocus?.id) {
  assert.notEqual(payload.currentFamilyFocus.id, 'advocates_legal');
}
assert.equal(output.queueSize, payload.familyQueue.length);
assert.equal(payload.familyQueue.length, 0);
assert.equal(payload.topLevelCommand, 'npm run run:next-track-a-step');
assert.ok(payload.commandCadence.includes('npm run run:next-track-a-step'));
assert.ok(Array.isArray(payload.activeBlockers));
assert.ok(payload.activeBlockers.some((blocker) => blocker.id === 'knowledge_content_depth'));
assert.equal(payload.currentBlockerFocus?.blockerId || null, null);
assert.equal(payload.focusMode, 'none');

console.log('track a finish loop tests passed');
