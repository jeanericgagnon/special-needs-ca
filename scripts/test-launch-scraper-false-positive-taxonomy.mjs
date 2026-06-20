import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDate = new Date().toISOString().slice(0, 10);

const result = spawnSync(process.execPath, ['src/db/generate_launch_scraper_false_positive_taxonomy.js'], {
  cwd: repoRoot,
  env: {
    ...process.env,
    ABLEFULL_REPO_ROOT: repoRoot,
  },
  encoding: 'utf8',
});

if (result.status !== 0) {
  throw new Error(`launch scraper false-positive taxonomy failed\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
}

const jsonPath = path.join(repoRoot, 'docs', 'generated', `launch-scraper-false-positive-taxonomy-${generatedDate}.json`);
const mdPath = path.join(repoRoot, 'docs', 'generated', `launch-scraper-false-positive-taxonomy-${generatedDate}.md`);

assert.ok(fs.existsSync(jsonPath));
assert.ok(fs.existsSync(mdPath));

const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const markdown = fs.readFileSync(mdPath, 'utf8');

assert.equal(payload.classCount, 4);
assert.ok(payload.rows.some((row) => row.taxonomyClass === 'blocked_error_shell' && row.appliesToFamilies.includes('education_routing') && row.validatorOutcomes.includes('missing_basic_signal')));
assert.ok(payload.rows.some((row) => row.taxonomyClass === 'generic_program_shell' && row.appliesToFamilies.includes('programs_benefits') && row.validatorOutcomes.includes('missing_action_signal')));
assert.ok(payload.rows.some((row) => row.taxonomyClass === 'contactless_directory_shell' && row.appliesToFamilies.includes('providers_care') && row.queueDisposition === 'repair_first'));
assert.ok(payload.rows.some((row) => row.taxonomyClass === 'thin_or_untrusted_knowledge_shell' && row.examples.some((example) => example.pageTitle === 'Access Denied')));
assert.ok(payload.invariants.some((item) => item.includes('blocked or error shell')));
assert.match(markdown, /# Launch Scraper False-Positive Taxonomy/);
assert.match(markdown, /\| class \| families \| validator outcomes \| queue disposition \| next lane \|/);
assert.match(markdown, /## blocked_error_shell/);

console.log('launch scraper false-positive taxonomy tests passed');
