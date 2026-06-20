import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDate = new Date().toISOString().slice(0, 10);

const result = spawnSync(process.execPath, ['src/db/generate_launch_scraper_queue_governance.js'], {
  cwd: repoRoot,
  env: {
    ...process.env,
    ABLEFULL_REPO_ROOT: repoRoot,
  },
  encoding: 'utf8',
});

if (result.status !== 0) {
  throw new Error(`launch scraper queue governance failed\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
}

const jsonPath = path.join(repoRoot, 'docs', 'generated', `launch-scraper-queue-governance-${generatedDate}.json`);
const mdPath = path.join(repoRoot, 'docs', 'generated', `launch-scraper-queue-governance-${generatedDate}.md`);

assert.ok(fs.existsSync(jsonPath));
assert.ok(fs.existsSync(mdPath));

const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const markdown = fs.readFileSync(mdPath, 'utf8');

assert.ok(Array.isArray(payload.launchNeedClassRules));
assert.ok(payload.launchNeedClassRules.some((rule) => rule.class === 'ready_target_scrape' && rule.allowedNextLanes.includes('repair_first')));
assert.ok(payload.launchNeedClassRules.some((rule) => rule.class === 'author_first' && rule.allowedNextLanes.includes('ready_target_scrape')));
assert.ok(payload.launchNeedClassRules.some((rule) => rule.class === 'do_not_scrape_quarantined' && rule.allowedNextLanes.includes('repair_first')));
assert.ok(Array.isArray(payload.blockedWorkTaxonomy));
assert.ok(payload.blockedWorkTaxonomy.some((item) => item.class === 'fetch_blocked'));
assert.ok(payload.familyBlockedLaneSummary.forms_guides?.nextLane === 'author_first');
assert.ok(payload.familyBlockedLaneSummary.medicaid_hhs_offices?.nextLane === 'repair_first');
assert.ok(payload.invariants.some((item) => item.includes('quarantined URL')));
assert.match(markdown, /# Launch Scraper Queue Governance/);
assert.match(markdown, /## ready_target_scrape/);
assert.match(markdown, /## Blocked Work Taxonomy/);

console.log('launch scraper queue governance tests passed');
