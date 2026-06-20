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
    maxBuffer: 1024 * 1024 * 20,
  });

  if (result.status !== 0) {
    throw new Error(`Script failed: ${scriptRelativePath}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
  }

  return JSON.parse(result.stdout.trim());
}

const output = runNode('src/db/generate_scrape_target_universe.js');
const jsonPath = path.join(repoRoot, 'docs', 'generated', `scrape-target-universe-${generatedDate}.json`);
const csvPath = path.join(repoRoot, 'docs', 'generated', `scrape-target-universe-${generatedDate}.csv`);
const mdPath = path.join(repoRoot, 'docs', 'generated', `scrape-target-universe-${generatedDate}.md`);
const launchInventoryPath = path.join(repoRoot, 'docs', 'generated', `launch-scrape-link-inventory-${generatedDate}.json`);

assert.ok(fs.existsSync(jsonPath));
assert.ok(fs.existsSync(csvPath));
assert.ok(fs.existsSync(mdPath));
assert.equal(output.json, jsonPath);

const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const launchInventory = JSON.parse(fs.readFileSync(launchInventoryPath, 'utf8'));

assert.ok(payload.summary.totalUniqueUrls >= launchInventory.summary.totalUniqueUrls);
assert.ok(payload.summary.readyTargetScrapeUrls >= 1);
assert.ok(payload.summary.liveRefreshCandidateUrls >= 1);
assert.ok(payload.summary.stagingRefreshCandidateUrls >= 1);
assert.ok((payload.rows || []).some((row) => row.candidateClass === 'ready_target_scrape'));
assert.ok((payload.rows || []).some((row) => row.candidateClass === 'live_refresh_candidate'));
assert.ok((payload.rows || []).some((row) => row.candidateClass === 'staging_refresh_candidate'));
assert.ok((payload.rows || []).some((row) => row.family === 'nonprofit_support'));
assert.ok((payload.rows || []).some((row) => row.family === 'providers_care'));

console.log('scrape target universe tests passed');
