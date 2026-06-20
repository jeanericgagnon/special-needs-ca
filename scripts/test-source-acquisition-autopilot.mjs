import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const result = spawnSync(process.execPath, [
  path.join(repoRoot, 'scripts', 'run-source-acquisition-autopilot.mjs'),
  '--mode=dry-run',
  '--status=ready_js_heavy',
  '--lane=ready_target_scrape',
  '--limit=2',
  '--max-batches=1',
], {
  cwd: repoRoot,
  env: {
    ...process.env,
    ABLEFULL_REPO_ROOT: repoRoot,
  },
  encoding: 'utf8',
  maxBuffer: 1024 * 1024 * 10,
});

if (result.status !== 0) {
  throw new Error(`Autopilot dry-run failed\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
}

const finalJsonMatch = result.stdout.match(/\n(\{[\s\S]*\})\s*$/);
assert.ok(finalJsonMatch, 'expected final JSON summary');

const summary = JSON.parse(finalJsonMatch[1]);
assert.equal(summary.stopReason, 'dry_run_complete');
assert.equal(summary.batches, 1);
assert.ok(summary.summaryPath.endsWith('summary.json'));
assert.ok(summary.reportPath.endsWith('summary.md'));
assert.ok(fs.existsSync(summary.summaryPath));
assert.ok(fs.existsSync(summary.reportPath));

const saved = JSON.parse(fs.readFileSync(summary.summaryPath, 'utf8'));
assert.equal(saved.stopReason, 'dry_run_complete');
assert.equal(saved.batches.length, 1);
assert.equal(saved.batches[0].attempted <= 2, true);
assert.equal(saved.inventory, 'completion-plan');

const universeResult = spawnSync(process.execPath, [
  path.join(repoRoot, 'scripts', 'run-source-acquisition-autopilot.mjs'),
  '--mode=dry-run',
  '--inventory=scrape-target-universe',
  '--status=ready_js_heavy',
  '--lane=ready_target_scrape',
  '--limit=2',
  '--max-batches=1',
], {
  cwd: repoRoot,
  env: {
    ...process.env,
    ABLEFULL_REPO_ROOT: repoRoot,
  },
  encoding: 'utf8',
  maxBuffer: 1024 * 1024 * 10,
});

if (universeResult.status !== 0) {
  throw new Error(`Universe autopilot dry-run failed\nSTDOUT:\n${universeResult.stdout}\nSTDERR:\n${universeResult.stderr}`);
}

const universeJsonMatch = universeResult.stdout.match(/\n(\{[\s\S]*\})\s*$/);
assert.ok(universeJsonMatch, 'expected final JSON summary for universe inventory');
const universeSummary = JSON.parse(universeJsonMatch[1]);
assert.equal(universeSummary.stopReason, 'dry_run_complete');

const universeSaved = JSON.parse(fs.readFileSync(universeSummary.summaryPath, 'utf8'));
assert.equal(universeSaved.inventory, 'scrape-target-universe');
assert.ok(universeSaved.completionPlanPath.endsWith(`scrape-target-universe-queue-${new Date().toISOString().slice(0, 10)}.json`));

console.log('source acquisition autopilot tests passed');
