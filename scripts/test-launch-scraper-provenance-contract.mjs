import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDate = new Date().toISOString().slice(0, 10);

const result = spawnSync(process.execPath, ['src/db/generate_launch_scraper_provenance_contract.js'], {
  cwd: repoRoot,
  env: {
    ...process.env,
    ABLEFULL_REPO_ROOT: repoRoot,
  },
  encoding: 'utf8',
});

if (result.status !== 0) {
  throw new Error(`launch scraper provenance contract failed\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
}

const jsonPath = path.join(repoRoot, 'docs', 'generated', `launch-scraper-provenance-contract-${generatedDate}.json`);
const mdPath = path.join(repoRoot, 'docs', 'generated', `launch-scraper-provenance-contract-${generatedDate}.md`);

assert.ok(fs.existsSync(jsonPath));
assert.ok(fs.existsSync(mdPath));

const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const markdown = fs.readFileSync(mdPath, 'utf8');

assert.equal(payload.familyCount, 9);
assert.ok(payload.commonFlow.fetchStageFields.includes('sourceUrl'));
assert.ok(payload.commonFlow.parsedStageFields.includes('savedPath'));
assert.ok(payload.commonFlow.validatedStageFields.includes('validationReasons'));
assert.ok(payload.commonFlow.stagedCommonFields.includes('source_url'));
assert.ok(payload.familyContracts.some((family) => family.family === 'forms_guides' && family.truthFieldsThatMustSurvive.includes('familyExtraction.officialDownloadUrl')));
assert.ok(payload.familyContracts.some((family) => family.family === 'knowledge_content' && family.stageSpecificFields.includes('canonical_url')));
assert.ok(payload.familyContracts.some((family) => family.family === 'program_waitlists' && family.stagingTable === 'staging_scraped_waitlists' && family.stageSpecificFields.includes('program_id')));
assert.ok(payload.invariants.some((item) => item.includes('Every launch family now has a direct staging-table mapping')));
assert.match(markdown, /# Launch Scraper Provenance Contract/);
assert.match(markdown, /## forms_guides/);
assert.match(markdown, /validatedStageFields/);

console.log('launch scraper provenance contract tests passed');
