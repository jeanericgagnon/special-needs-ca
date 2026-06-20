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

  const stdout = result.stdout.trim();
  if (!stdout) return null;
  const jsonStart = stdout.indexOf('{');
  if (jsonStart === -1) return { ok: true };
  return JSON.parse(stdout.slice(jsonStart));
}

runNode('src/db/generate_directory_accessibility_audit.js');
runNode('src/db/generate_directory_accessibility_candidate_audit.js');
runNode('src/db/generate_provider_accessibility_enrichment_plan.js');
const output = runNode('src/db/generate_directory_foundation_enrichment_queue.js');
const jsonPath = path.join(repoRoot, 'docs', 'generated', `directory-foundation-enrichment-queue-${generatedDate}.json`);

assert.ok(fs.existsSync(jsonPath));
assert.ok(output.totalRows >= 0);

const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
assert.ok(Array.isArray(payload.rows));
assert.equal(payload.summary.nonprofitCandidateRows || 0, 0);
assert.equal(payload.summary.providerCandidateRows || 0, 0);
assert.ok(!payload.rows.some((row) => row.targetTable === 'nonprofit_organizations'));
assert.ok(!payload.rows.some((row) => row.lane === 'advocate_gap_summary' && Number(row.missingSignalRows || 0) === 0));
if (payload.summary.totalRows === 0) {
  assert.deepEqual(payload.summary.byLane || {}, {});
  assert.deepEqual(payload.summary.byTargetTable || {}, {});
  assert.equal(payload.rows.length, 0);
} else {
  assert.ok(payload.summary.totalRows > 0);
  assert.ok((payload.summary.byLane.provider_source_pull || 0) > 0 || (payload.summary.byLane.provider_gap_cluster || 0) > 0);
  assert.ok(payload.rows.some((row) => row.targetTable === 'resource_providers'));
}

console.log('directory foundation enrichment queue tests passed');
