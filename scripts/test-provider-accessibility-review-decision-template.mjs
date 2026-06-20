import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const repoRoot = path.resolve(new URL('..', import.meta.url).pathname);
const sourceDbPath = path.join(repoRoot, 'frontend', 'ca_disability_navigator.db');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ablefull-provider-review-template-'));
const tempDbPath = path.join(tempRoot, 'ca_disability_navigator.db');
const tempOutputDir = path.join(tempRoot, 'generated');

fs.copyFileSync(sourceDbPath, tempDbPath);
fs.mkdirSync(tempOutputDir, { recursive: true });

execFileSync('node', ['src/db/generate_provider_accessibility_review_decision_template.js'], {
  cwd: repoRoot,
  env: {
    ...process.env,
    DB_PATH: tempDbPath,
    OUTPUT_DIR: tempOutputDir,
    GENERATED_DATE: '2099-01-01',
  },
  stdio: 'pipe',
});

const templateJsonPath = path.join(tempOutputDir, 'provider-accessibility-review-decision-template-2099-01-01.json');
assert.ok(fs.existsSync(templateJsonPath));

const template = JSON.parse(fs.readFileSync(templateJsonPath, 'utf8'));
assert.equal(template.entryCommand, 'npm run audit:provider-accessibility-review-decision-template');
assert.equal(template.applyCommand, 'npm run fix:provider-accessibility-apply-review-decisions');
assert.equal(template.promoteCommand, 'npm run fix:provider-accessibility-promote-reviewed');
assert.equal(template.auditCommand, 'npm run audit:directory-foundation-enrichment-queue');
assert.ok(Array.isArray(template.commands));
assert.ok(template.commands.includes('npm run fix:provider-accessibility-apply-review-decisions'));

console.log('provider accessibility review decision template tests passed');
