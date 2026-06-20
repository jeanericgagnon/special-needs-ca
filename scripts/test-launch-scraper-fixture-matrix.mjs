import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDate = new Date().toISOString().slice(0, 10);

const result = spawnSync(process.execPath, ['src/db/generate_launch_scraper_fixture_matrix.js'], {
  cwd: repoRoot,
  env: {
    ...process.env,
    ABLEFULL_REPO_ROOT: repoRoot,
  },
  encoding: 'utf8',
});

if (result.status !== 0) {
  throw new Error(`launch scraper fixture matrix failed\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
}

const jsonPath = path.join(repoRoot, 'docs', 'generated', `launch-scraper-fixture-matrix-${generatedDate}.json`);
const mdPath = path.join(repoRoot, 'docs', 'generated', `launch-scraper-fixture-matrix-${generatedDate}.md`);

assert.ok(fs.existsSync(jsonPath));
assert.ok(fs.existsSync(mdPath));

const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const markdown = fs.readFileSync(mdPath, 'utf8');

assert.equal(payload.familyCount, 9);
assert.ok(Array.isArray(payload.familyFixtureMatrix));
assert.ok(payload.familyFixtureMatrix.every((family) => family.family && family.recordType && family.parserFunction));
assert.ok(payload.familyFixtureMatrix.every((family) => family.positiveFixture?.minimumPageSignals?.length > 0));
assert.ok(payload.familyFixtureMatrix.every((family) => Array.isArray(family.negativeFixtures) && family.negativeFixtures.length > 0));
assert.ok(payload.familyFixtureMatrix.some((family) => family.family === 'forms_guides' && family.negativeFixtures.some((fixture) => fixture.expectedRejectionReasons.includes('forms_requires_official_source'))));
assert.ok(payload.familyFixtureMatrix.some((family) => family.family === 'knowledge_content' && family.positiveFixture.expectedAcceptedFields.includes('summaryText')));
assert.ok(payload.familyFixtureMatrix.some((family) => family.family === 'program_waitlists' && family.stagingTable === 'staging_scraped_waitlists'));
assert.match(markdown, /# Launch Scraper Fixture Matrix/);
assert.match(markdown, /## providers_care/);
assert.match(markdown, /expectedRejectionReasons: missing_provider_contact_signal/);

console.log('launch scraper fixture matrix tests passed');
