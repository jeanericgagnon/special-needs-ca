import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDate = new Date().toISOString().slice(0, 10);

const result = spawnSync(process.execPath, ['src/db/generate_launch_scraper_contract.js'], {
  cwd: repoRoot,
  env: {
    ...process.env,
    ABLEFULL_REPO_ROOT: repoRoot,
  },
  encoding: 'utf8',
});

if (result.status !== 0) {
  throw new Error(`launch scraper contract failed\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
}

const jsonPath = path.join(repoRoot, 'docs', 'generated', `launch-scraper-contract-${generatedDate}.json`);
const mdPath = path.join(repoRoot, 'docs', 'generated', `launch-scraper-contract-${generatedDate}.md`);

assert.ok(fs.existsSync(jsonPath));
assert.ok(fs.existsSync(mdPath));

const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const markdown = fs.readFileSync(mdPath, 'utf8');

assert.equal(payload.fetchContract.requestTimeoutMs, 15000);
assert.equal(payload.fetchContract.bodyTimeoutMs, 15000);
assert.equal(payload.fetchContract.retryCount, 2);
assert.ok(Array.isArray(payload.launchFamilyOrder));
assert.equal(payload.launchFamilyOrder.length, 9);
assert.ok(Array.isArray(payload.familyContracts));
assert.equal(payload.familyContracts.length, 9);
assert.ok(payload.familyContracts.every((family) => family.family && family.currentCounts && family.executionMode));
assert.ok(payload.familyContracts.some((family) => family.family === 'dd_routing' && family.currentCounts.readyTargetScrape === 12));
assert.ok(payload.familyContracts.some((family) => family.family === 'forms_guides' && family.currentCounts.readyTargetScrape === 220));
assert.ok(payload.familyContracts.some((family) => family.family === 'medicaid_hhs_offices' && family.currentCounts.readyTargetScrape === 131));
assert.ok(payload.familyContracts.some((family) => family.currentCounts.repairFirst > 0));
assert.ok(payload.familyContracts.some((family) => family.family === 'knowledge_content' && family.currentCounts.deferredBlockedSource > 0));
assert.match(markdown, /# Launch Scraper Contract/);
assert.match(markdown, /## Fetch Contract/);
assert.match(markdown, /## dd_routing/);
assert.match(markdown, /ready_lightweight dry-run/);

console.log('launch scraper contract tests passed');
