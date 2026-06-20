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
const output = runNode('src/db/generate_max_info_program.js');
const jsonPath = path.join(repoRoot, 'docs', 'generated', `max-info-program-${generatedDate}.json`);

assert.ok(fs.existsSync(jsonPath));
assert.equal(output.trackAStatus, 'blocked');
assert.ok(['operational', 'needs_implementation'].includes(output.trackBStatus));

const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
assert.ok(payload.tracks.informationExhaustiveness);
assert.ok(payload.tracks.runtimeOperationalReadiness);
assert.ok(Array.isArray(payload.tracks.runtimeOperationalReadiness.surfaces));
assert.ok(payload.tracks.informationExhaustiveness.blockers.length > 0);
assert.ok(Array.isArray(payload.tracks.informationExhaustiveness.familyClosureOrder));
assert.equal(payload.tracks.informationExhaustiveness.missingFamilyCount, 0);
assert.ok(['burn_down', 'backlog', 'none'].includes(payload.tracks.informationExhaustiveness.focusMode));
if (payload.tracks.informationExhaustiveness.currentFamilyFocus?.id) {
  assert.notEqual(payload.tracks.informationExhaustiveness.currentFamilyFocus.id, 'advocates_legal');
}
assert.equal(payload.tracks.informationExhaustiveness.familyClosureOrder.length, 0);
assert.ok(Array.isArray(payload.tracks.informationExhaustiveness.commandCadence));
assert.ok(!payload.tracks.informationExhaustiveness.blockers.some((blocker) => blocker.id === 'feedback_loops'));
assert.ok(Array.isArray(payload.tracks.informationExhaustiveness.exhaustedBurnDownFamilies));
assert.ok(payload.tracks.informationExhaustiveness.exhaustedBurnDownFamilies.some((family) => family.id === 'advocates_legal'));
assert.ok(payload.inputs.trackABlockerRegistryPath);
assert.equal(payload.tracks.informationExhaustiveness.topLevelCommand, 'npm run run:next-track-a-step');
assert.ok(payload.tracks.informationExhaustiveness.blockers.some((blocker) => blocker.id === 'knowledge_content_depth'));
assert.equal(payload.scopeMode, 'data_only');
assert.equal(payload.tracks.informationExhaustiveness.currentBlockerFocus?.blockerId || null, 'provider_directory');
assert.equal(payload.tracks.informationExhaustiveness.currentFamilyFocus?.id || null, null);
assert.equal(payload.tracks.informationExhaustiveness.focusMode, 'backlog');
assert.ok(payload.tracks.informationExhaustiveness.commandCadence.includes('npm run run:next-track-a-step'));
assert.ok(Array.isArray(payload.nextCommands));
assert.ok(payload.nextCommands.includes('npm run run:next-track-a-step'));
assert.ok(payload.nextActions.includes('Ignore UI, UX, and runtime-product work in this program; this control plane is data-only.'));

console.log('max info program tests passed');
