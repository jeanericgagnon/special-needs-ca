import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import Database from 'better-sqlite3';

const repoRoot = process.cwd();
const sourceDbPath = path.join(repoRoot, 'frontend', 'ca_disability_navigator.db');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ablefull-provider-acc-'));
const tempDbPath = path.join(tempRoot, 'ca_disability_navigator.db');
const tempFrontendDbPath = path.join(tempRoot, 'frontend-ca_disability_navigator.db');
const tempOutputDir = path.join(tempRoot, 'generated');
const tempJsonInputPath = path.join(tempRoot, 'provider-accessibility-review-decisions.json');
const tempCsvInputPath = path.join(tempRoot, 'provider-accessibility-review-decisions.csv');

fs.copyFileSync(sourceDbPath, tempDbPath);
fs.copyFileSync(sourceDbPath, tempFrontendDbPath);
fs.mkdirSync(tempOutputDir, { recursive: true });

const baseEnv = {
  ...process.env,
  DB_PATH: tempDbPath,
  FRONTEND_DB_PATH: tempFrontendDbPath,
  OUTPUT_DIR: tempOutputDir,
  GENERATED_DATE: '2099-01-01',
};

function runScript(relativePath, extraEnv = {}) {
  execFileSync('node', [relativePath], {
    cwd: repoRoot,
    env: { ...baseEnv, ...extraEnv },
    stdio: 'pipe',
  });
}

runScript('src/db/generate_provider_accessibility_review_decision_template.js');

const db = new Database(tempDbPath);

const targetRow = db.prepare(`
  SELECT id, provider_id, clue_field
  FROM provider_accessibility_pull_results
  WHERE clue_status = 'queued'
    AND clue_field = 'languages'
  ORDER BY id
  LIMIT 1
`).get();

if (!targetRow) {
  throw new Error('Expected at least one queued languages review row in temp DB');
}

const rejectedRowTarget = db.prepare(`
  SELECT id, provider_id, clue_field
  FROM provider_accessibility_pull_results
  WHERE clue_status = 'queued'
    AND clue_field = 'accessibility_notes'
    AND id <> ?
  ORDER BY id
  LIMIT 1
`).get(targetRow.id);

if (!rejectedRowTarget) {
  throw new Error('Expected at least one queued accessibility_notes review row in temp DB');
}

const initialProvider = db.prepare(`
  SELECT languages
  FROM resource_providers
  WHERE id = ?
`).get(targetRow.provider_id);

fs.writeFileSync(tempJsonInputPath, `${JSON.stringify([
  {
    id: targetRow.id,
    decision: 'reviewed',
    clue_page_url: 'https://example.org/accessibility',
    clue_value: 'English, Spanish',
    clue_text: 'Interpreter services available in English and Spanish.',
    review_notes: 'Confirmed on official accessibility page.',
    reviewed_by: 'codex-test',
  },
], null, 2)}\n`);

runScript('src/db/apply_provider_accessibility_review_decisions.js', {
  INPUT_PATH: tempJsonInputPath,
});

const reviewedRow = db.prepare(`
  SELECT clue_status, clue_page_url, clue_value, reviewed_by
  FROM provider_accessibility_pull_results
  WHERE id = ?
`).get(targetRow.id);

if (reviewedRow.clue_status !== 'reviewed') {
  throw new Error(`Expected row ${targetRow.id} to become reviewed`);
}
if (reviewedRow.reviewed_by !== 'codex-test') {
  throw new Error(`Expected row ${targetRow.id} reviewed_by to be codex-test`);
}

fs.writeFileSync(tempCsvInputPath, [
  'id,decision,clue_page_url,clue_value,clue_text,review_notes,reviewed_by',
  `${rejectedRowTarget.id},rejected,,,,Rejected after checking first-party page; clue did not apply,codex-test-csv`,
].join('\n'));

runScript('src/db/apply_provider_accessibility_review_decisions.js', {
  INPUT_PATH: tempCsvInputPath,
});

const rejectedRow = db.prepare(`
  SELECT clue_status, review_notes, reviewed_by
  FROM provider_accessibility_pull_results
  WHERE id = ?
`).get(rejectedRowTarget.id);

if (rejectedRow.clue_status !== 'rejected') {
  throw new Error(`Expected row ${rejectedRowTarget.id} to become rejected`);
}
if (rejectedRow.reviewed_by !== 'codex-test-csv') {
  throw new Error(`Expected row ${rejectedRowTarget.id} reviewed_by to be codex-test-csv`);
}

runScript('src/db/promote_provider_accessibility_reviewed.js');

const promotedRow = db.prepare(`
  SELECT clue_status, promoted_at
  FROM provider_accessibility_pull_results
  WHERE id = ?
`).get(targetRow.id);

if (promotedRow.clue_status !== 'promoted') {
  throw new Error(`Expected row ${targetRow.id} to become promoted`);
}
if (!promotedRow.promoted_at) {
  throw new Error(`Expected row ${targetRow.id} to have promoted_at`);
}

const rejectedRowAfterPromotion = db.prepare(`
  SELECT clue_status
  FROM provider_accessibility_pull_results
  WHERE id = ?
`).get(rejectedRowTarget.id);

if (rejectedRowAfterPromotion.clue_status !== 'rejected') {
  throw new Error(`Expected rejected row ${rejectedRowTarget.id} to remain rejected after promotion`);
}

const finalProvider = db.prepare(`
  SELECT languages, checked_at
  FROM resource_providers
  WHERE id = ?
`).get(targetRow.provider_id);

db.close();

if (!finalProvider.languages || !finalProvider.languages.includes('English') || !finalProvider.languages.includes('Spanish')) {
  throw new Error(`Expected provider ${targetRow.provider_id} languages to include English and Spanish`);
}
if (!finalProvider.checkedAt && !finalProvider.checked_at) {
  throw new Error(`Expected provider ${targetRow.provider_id} checked_at to be set`);
}

const templateJsonPath = path.join(tempOutputDir, 'provider-accessibility-review-decision-template-2099-01-01.json');
const templateCsvPath = path.join(tempOutputDir, 'provider-accessibility-review-decision-template-2099-01-01.csv');
if (!fs.existsSync(templateJsonPath) || !fs.existsSync(templateCsvPath)) {
  throw new Error('Expected review decision template artifacts to be created');
}
const templateJson = JSON.parse(fs.readFileSync(templateJsonPath, 'utf8'));
if (templateJson.entryCommand !== 'npm run audit:provider-accessibility-review-decision-template') {
  throw new Error('Expected provider accessibility review template to expose entryCommand');
}
if (templateJson.applyCommand !== 'npm run fix:provider-accessibility-apply-review-decisions') {
  throw new Error('Expected provider accessibility review template to expose applyCommand');
}
if (templateJson.promoteCommand !== 'npm run fix:provider-accessibility-promote-reviewed') {
  throw new Error('Expected provider accessibility review template to expose promoteCommand');
}

console.log(JSON.stringify({
  message: 'Provider accessibility workflow test passed',
  tempRoot,
  testedReviewedRowId: targetRow.id,
  testedRejectedRowId: rejectedRowTarget.id,
  providerId: targetRow.provider_id,
  initialLanguages: initialProvider?.languages || null,
  finalLanguages: finalProvider.languages,
}, null, 2));
