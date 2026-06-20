import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDate = new Date().toISOString().slice(0, 10);

const result = spawnSync(process.execPath, ['src/db/generate_launch_scrape_link_inventory.js'], {
  cwd: repoRoot,
  env: {
    ...process.env,
    ABLEFULL_REPO_ROOT: repoRoot,
  },
  encoding: 'utf8',
});

if (result.status !== 0) {
  throw new Error(`launch scrape link inventory failed\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
}

const jsonPath = path.join(repoRoot, 'docs', 'generated', `launch-scrape-link-inventory-${generatedDate}.json`);
const csvPath = path.join(repoRoot, 'docs', 'generated', `launch-scrape-link-inventory-${generatedDate}.csv`);
const mdPath = path.join(repoRoot, 'docs', 'generated', `launch-scrape-link-inventory-${generatedDate}.md`);

assert.ok(fs.existsSync(jsonPath));
assert.ok(fs.existsSync(csvPath));
assert.ok(fs.existsSync(mdPath));

const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const markdown = fs.readFileSync(mdPath, 'utf8');

assert.ok(payload.summary.launchCriticalUniqueUrls > 0);
assert.ok(payload.summary.readyTargetScrapeUrls > 0);
assert.ok(payload.summary.authorFirstUrls > 0);
assert.ok(payload.summary.repairFirstUrls > 0);
assert.ok(Array.isArray(payload.rows));
assert.equal(payload.summary.launchCriticalUniqueUrls, payload.rows.filter((row) => payload.launchFamilies.includes(row.family)).length);
assert.ok(payload.rows.every((row) => row.url && row.domain && row.family && row.launchNeedClass && Array.isArray(row.sourceArtifacts)));
assert.ok(payload.rows.some((row) => row.family === 'providers_care' && row.launchNeedClass === 'author_first'));
assert.ok(payload.rows.some((row) => row.family === 'forms_guides' && row.launchNeedClass === 'do_not_scrape_quarantined'));
assert.ok(payload.rows.some((row) => row.family === 'knowledge_content' && row.launchNeedClass === 'defer_blocked_source'));
assert.ok(!payload.rows.some((row) => row.launchNeedClass === 'ready_target_scrape' && /dhhs\.[a-z-]+\.gov/i.test(row.url)));
assert.match(markdown, /# Launch Scrape Link Inventory/);
assert.match(markdown, /## Highest Priority Ready URLs/);

console.log('launch scrape link inventory tests passed');
