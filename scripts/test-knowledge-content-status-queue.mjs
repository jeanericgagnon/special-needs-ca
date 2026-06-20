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

runNode('src/db/generate_knowledge_content_status_queue.js');
const jsonPath = path.join(repoRoot, 'docs', 'generated', `knowledge-content-status-queue-${generatedDate}.json`);

assert.ok(fs.existsSync(jsonPath));

const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
assert.ok(payload.summary.totalTargets >= 17);
assert.ok(payload.summary.byFinalStatus.duplicate_of_existing_live_article > 0);
assert.ok(Array.isArray(payload.rows));
assert.ok(payload.rows.some((row) => String(row.sourceUrl).includes('cdc.gov/autism/about')));
assert.ok(payload.rows.some((row) => row.finalStatus === 'duplicate_of_existing_live_article'));
assert.ok((payload.summary.byFinalStatus.pending_exact_target || 0) > 0);
assert.ok((payload.summary.byFinalStatus.deferred_blocked_source || 0) >= 2);
assert.equal(payload.summary.byFinalStatus.reviewed_replacement_ready || 0, 0);
assert.ok(payload.rows.some((row) => row.id === 'knowledge-medicaid-epsdt'));
assert.ok(payload.rows.some((row) => row.id === 'knowledge-parent-center-transition-adult'));
assert.ok(payload.rows.some((row) => row.id === 'knowledge-medicaid-application-fair-hearings'));
const deferredRows = payload.rows.filter((row) => row.finalStatus === 'deferred_blocked_source');
assert.ok(deferredRows.length >= 2);
assert.ok(deferredRows.every((row) => Array.isArray(row.nextCommands)));
assert.ok(deferredRows.every((row) => row.entryCommand === 'npm run audit:knowledge-content-status-queue'));
assert.ok(deferredRows.every((row) => row.auditCommand === 'npm run audit:knowledge-content-status-queue'));
assert.ok(
  deferredRows.every((row) => row.nextCommands.includes('npm run audit:knowledge-content-status-queue'))
);
assert.ok(deferredRows.some((row) => row.sourceUrl === 'https://www.ssa.gov/benefits/disability/apply-child.html'));
assert.ok(deferredRows.some((row) => row.sourceUrl === 'https://www.ssa.gov/benefits/disability/qualify.html'));
assert.ok(deferredRows.every((row) => row.reviewedReplacementUrl === ''));

console.log('knowledge content status queue tests passed');
