import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDate = new Date().toISOString().slice(0, 10);

const result = spawnSync(process.execPath, ['src/db/generate_launch_scraper_readiness_board.js'], {
  cwd: repoRoot,
  env: {
    ...process.env,
    ABLEFULL_REPO_ROOT: repoRoot,
  },
  encoding: 'utf8',
});

if (result.status !== 0) {
  throw new Error(`launch scraper readiness board failed\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
}

const jsonPath = path.join(repoRoot, 'docs', 'generated', `launch-scraper-readiness-board-${generatedDate}.json`);
const mdPath = path.join(repoRoot, 'docs', 'generated', `launch-scraper-readiness-board-${generatedDate}.md`);

assert.ok(fs.existsSync(jsonPath));
assert.ok(fs.existsSync(mdPath));

const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const markdown = fs.readFileSync(mdPath, 'utf8');

assert.equal(payload.rows.length, 9);
assert.ok(payload.rows.some((row) => row.family === 'program_waitlists' && row.topSpecGap === 'no_ready_target_scrape_queue'));
assert.ok(payload.rows.some((row) => row.family === 'education_routing' && row.topSpecGap === '' && row.fixtureCoverageClass === 'accepted_and_rejected'));
assert.ok(payload.rows.some((row) => row.family === 'knowledge_content' && row.topSpecGap === '' && row.fixtureCoverageClass === 'accepted_and_rejected'));
assert.ok(payload.summary.fullySpecifiedReady >= 8);
assert.match(markdown, /# Launch Scraper Readiness Board/);
assert.match(markdown, /\| family \| readiness class \| ready \| author \| repair \| fixture coverage \| stage supported \| top spec gap \|/);
assert.match(markdown, /## program_waitlists/);

console.log('launch scraper readiness board tests passed');
