import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

function runScript(scriptPath, extraArgs = []) {
  const result = spawnSync(process.execPath, [scriptPath, ...extraArgs], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
}

runScript(path.join(repoRoot, 'scripts', 'generate-california-next-source-registry-v1.mjs'));
runScript(path.join(repoRoot, 'scripts', 'generate-california-next-source-seed-queue-v1.mjs'));
runScript(path.join(repoRoot, 'scripts', 'run-california-next-source-seed-queue-v1.mjs'), ['--mode=plan-only']);

const auditResult = spawnSync(process.execPath, [path.join(repoRoot, 'scripts', 'run-california-next-source-alignment-audit-v1.mjs')], {
  cwd: repoRoot,
  encoding: 'utf8',
});
assert.equal(auditResult.status, 0, auditResult.stderr || auditResult.stdout);

const jsonPath = path.join(repoRoot, 'data', 'generated', 'california-next-source-alignment-audit-v1.json');
const mdPath = path.join(repoRoot, 'docs', 'generated', 'california-next-source-alignment-audit-v1.md');

assert.equal(fs.existsSync(jsonPath), true);
assert.equal(fs.existsSync(mdPath), true);

const audit = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
assert.equal(audit.status, 'pass');
assert.equal(audit.counts.families, 10);
assert.equal(audit.counts.totalSeedEntries, 18);
assert.equal(audit.counts.seedReadyEntries, 18);
assert.equal(audit.counts.queueRows, 18);
assert.equal(audit.counts.mappedRows, 18);
assert.equal(audit.byFamily.ihss, 2);
assert.equal(audit.byFamily.frcnca, 1);
assert.equal(audit.byFamily.local_nonprofits, 2);
assert.equal(audit.invariants.registrySummaryMatchesDefinitions, true);
assert.equal(audit.invariants.queueRowsMatchSeedReadyCount, true);
assert.equal(audit.invariants.mappedRowsMatchQueueRows, true);
assert.equal(audit.invariants.allQueueFamiliesPresentInRegistry, true);
assert.equal(audit.invariants.allMappedRowsStayNeedsReviewOnIngest, true);
assert.equal(audit.invariants.allMappedRowsCarryExpectedStateAndStatus, true);
assert.deepEqual(audit.failures, []);

const markdown = fs.readFileSync(mdPath, 'utf8');
assert.match(markdown, /California Next-Source Alignment Audit v1/);
assert.match(markdown, /Status: `pass`/);
assert.match(markdown, /## Invariants/);

console.log('california next-source alignment audit tests passed');
