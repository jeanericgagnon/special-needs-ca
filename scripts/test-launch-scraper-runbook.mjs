import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDate = new Date().toISOString().slice(0, 10);

const result = spawnSync(process.execPath, ['src/db/generate_launch_scraper_runbook.js'], {
  cwd: repoRoot,
  env: {
    ...process.env,
    ABLEFULL_REPO_ROOT: repoRoot,
  },
  encoding: 'utf8',
});

if (result.status !== 0) {
  throw new Error(`launch scraper runbook failed\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
}

const jsonPath = path.join(repoRoot, 'docs', 'generated', `launch-scraper-runbook-${generatedDate}.json`);
const mdPath = path.join(repoRoot, 'docs', 'generated', `launch-scraper-runbook-${generatedDate}.md`);

assert.ok(fs.existsSync(jsonPath));
assert.ok(fs.existsSync(mdPath));

const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const markdown = fs.readFileSync(mdPath, 'utf8');

assert.equal(payload.familyRunbookCount, 9);
assert.ok(Array.isArray(payload.globalPreflight));
assert.ok(payload.globalPreflight.includes('Run npm run audit:launch-scraper-fixture-matrix'));
assert.ok(Array.isArray(payload.familyRunbooks));
assert.ok(payload.familyRunbooks.every((family) => family.family && family.executionMode && family.recommendedRunMode));
assert.ok(payload.familyRunbooks.some((family) => family.family === 'program_waitlists' && family.recommendedRunMode === 'author_first_only'));
assert.ok(payload.familyRunbooks.some((family) => family.family === 'forms_guides' && family.recommendedRunMode === 'fetch_only_first'));
assert.ok(payload.familyRunbooks.some((family) => family.family === 'dd_routing' && family.recommendedRunMode === 'full_lane_when_successful'));
assert.ok(payload.familyRunbooks.some((family) => family.family === 'providers_care' && family.nextIfBlocked.includes('author-first')));
assert.ok(payload.familyRunbooks.every((family) => Array.isArray(family.compactAcceptanceSignals) && family.compactAcceptanceSignals.length > 0));
assert.match(markdown, /# Launch Scraper Runbook/);
assert.match(markdown, /## program_waitlists/);
assert.match(markdown, /recommendedRunMode: author_first_only/);
assert.match(markdown, /commandSet: none until queue\/authoring refresh creates exact ready targets/);

console.log('launch scraper runbook tests passed');
