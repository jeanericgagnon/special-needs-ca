import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDate = new Date().toISOString().slice(0, 10);

const result = spawnSync(process.execPath, ['src/db/generate_launch_scraper_queue_false_positive_risk.js'], {
  cwd: repoRoot,
  env: {
    ...process.env,
    ABLEFULL_REPO_ROOT: repoRoot,
  },
  encoding: 'utf8',
});

if (result.status !== 0) {
  throw new Error(`launch scraper queue false-positive risk failed\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
}

const jsonPath = path.join(repoRoot, 'docs', 'generated', `launch-scraper-queue-false-positive-risk-${generatedDate}.json`);
const mdPath = path.join(repoRoot, 'docs', 'generated', `launch-scraper-queue-false-positive-risk-${generatedDate}.md`);

assert.ok(fs.existsSync(jsonPath));
assert.ok(fs.existsSync(mdPath));

const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const markdown = fs.readFileSync(mdPath, 'utf8');

assert.ok(Array.isArray(payload.riskRows));
assert.ok(payload.summary.rowCount > 0);
assert.ok(payload.queueSafety.liveRefreshCandidateRows > 0);
assert.ok(payload.queueSafety.placeholderLiveRefreshRows > 0);
assert.equal(payload.queueSafety.placeholderReadyRows, 0);
assert.equal(payload.queueSafety.safeToSpendReadyScrapeVolume, true);
assert.equal(payload.queueSafety.safeToSpendLiveRefreshVolume, false);
assert.ok(payload.riskRows.some((row) => row.riskClass === 'live_refresh_placeholder_domain' && row.family === 'dd_routing' && row.stateId === 'alabama' && row.url === 'https://dhhs.alabama.gov/dd'));
assert.ok(payload.riskRows.some((row) => row.riskClass === 'quarantined_placeholder_domain' && row.family === 'forms_guides'));
assert.match(markdown, /# Launch Scraper Queue False-Positive Risk/);
assert.match(markdown, /## Queue Safety/);
assert.match(markdown, /## Highest Risk Queue Rows/);

console.log('launch scraper queue false-positive risk tests passed');
