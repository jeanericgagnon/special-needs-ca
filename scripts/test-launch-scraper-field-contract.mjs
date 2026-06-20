import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDate = new Date().toISOString().slice(0, 10);

const result = spawnSync(process.execPath, ['src/db/generate_launch_scraper_field_contract.js'], {
  cwd: repoRoot,
  env: {
    ...process.env,
    ABLEFULL_REPO_ROOT: repoRoot,
  },
  encoding: 'utf8',
});

if (result.status !== 0) {
  throw new Error(`launch scraper field contract failed\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
}

const jsonPath = path.join(repoRoot, 'docs', 'generated', `launch-scraper-field-contract-${generatedDate}.json`);
const mdPath = path.join(repoRoot, 'docs', 'generated', `launch-scraper-field-contract-${generatedDate}.md`);

assert.ok(fs.existsSync(jsonPath));
assert.ok(fs.existsSync(mdPath));

const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const markdown = fs.readFileSync(mdPath, 'utf8');

assert.equal(payload.familyCount, 9);
assert.ok(Array.isArray(payload.familyFieldContracts));
assert.ok(payload.familyFieldContracts.every((family) => family.family && family.recordType && family.parserFunction));
assert.ok(payload.familyFieldContracts.every((family) => Array.isArray(family.extractedFields) && family.extractedFields.length > 0));
assert.ok(payload.familyFieldContracts.every((family) => Array.isArray(family.acceptanceRules) && family.acceptanceRules.length > 0));
assert.ok(payload.familyFieldContracts.every((family) => Array.isArray(family.rejectionReasons)));
assert.ok(payload.familyFieldContracts.some((family) => family.family === 'dd_routing' && family.stagingTable === 'staging_scraped_state_resource_agencies'));
assert.ok(payload.familyFieldContracts.some((family) => family.family === 'forms_guides' && family.rejectionReasons.includes('missing_official_download_or_library_url')));
assert.ok(payload.familyFieldContracts.some((family) => family.family === 'knowledge_content' && family.extractedFields.includes('summaryText')));
assert.match(markdown, /# Launch Scraper Field Contract/);
assert.match(markdown, /## dd_routing/);
assert.match(markdown, /staging_scraped_state_resource_agencies/);

console.log('launch scraper field contract tests passed');
