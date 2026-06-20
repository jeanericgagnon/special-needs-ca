import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDate = new Date().toISOString().slice(0, 10);

const result = spawnSync(process.execPath, ['src/db/generate_launch_scraper_artifact_contract.js'], {
  cwd: repoRoot,
  env: {
    ...process.env,
    ABLEFULL_REPO_ROOT: repoRoot,
  },
  encoding: 'utf8',
});

if (result.status !== 0) {
  throw new Error(`launch scraper artifact contract failed\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
}

const jsonPath = path.join(repoRoot, 'docs', 'generated', `launch-scraper-artifact-contract-${generatedDate}.json`);
const mdPath = path.join(repoRoot, 'docs', 'generated', `launch-scraper-artifact-contract-${generatedDate}.md`);

assert.ok(fs.existsSync(jsonPath));
assert.ok(fs.existsSync(mdPath));

const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const markdown = fs.readFileSync(mdPath, 'utf8');

assert.ok(payload.sampleRunId);
assert.ok(Array.isArray(payload.runDirectoryLayout.requiredTopLevel));
assert.ok(payload.runDirectoryLayout.requiredTopLevel.includes('manifest.json'));
assert.ok(payload.runDirectoryLayout.requiredTopLevel.includes('pages/'));
assert.ok(payload.fetchStage.manifestRequiredFields.includes('selectionGuards'));
assert.ok(payload.fetchStage.manifestRowFields.includes('savedPath'));
assert.ok(payload.followupStage.requiredFiles.includes('followups/followup-summary.json'));
assert.ok(payload.parsedStage.requiredPerFamilyFiles.includes('records.ndjson'));
assert.ok(payload.validatedStage.requiredPerFamilyFiles.includes('accepted.ndjson'));
assert.ok(payload.stagedStage.requiredPerFamilyFiles.includes('promotion-summary.json'));
assert.ok(payload.resumeSafetyContract.guarantees.some((item) => item.includes('runId')));
assert.ok(payload.resumeSafetyContract.knownLimitations.some((item) => item.includes('program_id inference')));
assert.match(markdown, /# Launch Scraper Artifact Contract/);
assert.match(markdown, /## Resume Safety Contract/);
assert.match(markdown, /manifest required fields/);

console.log('launch scraper artifact contract tests passed');
