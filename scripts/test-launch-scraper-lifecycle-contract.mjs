import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDate = new Date().toISOString().slice(0, 10);

const result = spawnSync(process.execPath, ['src/db/generate_launch_scraper_lifecycle_contract.js'], {
  cwd: repoRoot,
  env: {
    ...process.env,
    ABLEFULL_REPO_ROOT: repoRoot,
  },
  encoding: 'utf8',
});

if (result.status !== 0) {
  throw new Error(`launch scraper lifecycle contract failed\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
}

const jsonPath = path.join(repoRoot, 'docs', 'generated', `launch-scraper-lifecycle-contract-${generatedDate}.json`);
const mdPath = path.join(repoRoot, 'docs', 'generated', `launch-scraper-lifecycle-contract-${generatedDate}.md`);

assert.ok(fs.existsSync(jsonPath));
assert.ok(fs.existsSync(mdPath));

const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const markdown = fs.readFileSync(mdPath, 'utf8');

assert.equal(payload.familyCount, 9);
assert.ok(Array.isArray(payload.resumeSafetyGuarantees) && payload.resumeSafetyGuarantees.length > 0);
assert.ok(payload.familyLifecycles.every((row) => Array.isArray(row.lifecycleStages) && row.lifecycleStages.length === 7));
assert.ok(payload.familyLifecycles.some((row) => row.family === 'program_waitlists' && row.startQueueClass === 'author_first'));
assert.ok(payload.familyLifecycles.some((row) => row.family === 'dd_routing' && row.startQueueClass === 'ready_target_scrape'));
assert.ok(payload.familyLifecycles.some((row) => row.family === 'knowledge_content' && row.fallbackTransitions.ifRepeatedBlockedSources === 'defer_blocked_source'));
assert.match(markdown, /# Launch Scraper Lifecycle Contract/);
assert.match(markdown, /## program_waitlists/);
assert.match(markdown, /lifecycleStages:/);

console.log('launch scraper lifecycle contract tests passed');
