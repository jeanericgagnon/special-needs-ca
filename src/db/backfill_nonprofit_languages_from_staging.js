import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');
const frontendDbPath = path.join(repoRoot, 'frontend', 'ca_disability_navigator.db');

const db = new Database(dbPath);

function extractLanguages(rawText) {
  const text = String(rawText || '').toLowerCase();
  const languages = new Set();

  if (/\benglish\b/i.test(text)) {
    languages.add('English');
  }

  if (/\bspanish\b|\bespanol\b/i.test(text)) {
    languages.add('Spanish');
  }

  return Array.from(languages);
}

function parseLanguages(value) {
  if (!value) return [];
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

const selectCandidates = db.prepare(`
  SELECT suggested_target_id, raw_text_excerpt
  FROM staging_scraped_nonprofit_organizations
  WHERE suggested_target_id IS NOT NULL
    AND TRIM(suggested_target_id) <> ''
`);

const getExisting = db.prepare(`
  SELECT id, languages
  FROM nonprofit_organizations
  WHERE id = ?
`);

const updateLanguages = db.prepare(`
  UPDATE nonprofit_organizations
  SET languages = ?
  WHERE id = ?
`);

const tx = db.transaction(() => {
  const candidateMap = new Map();

  for (const row of selectCandidates.all()) {
    const languages = extractLanguages(row.raw_text_excerpt);
    if (!languages.length) continue;

    const existing = candidateMap.get(row.suggested_target_id) || new Set();
    for (const language of languages) {
      existing.add(language);
    }
    candidateMap.set(row.suggested_target_id, existing);
  }

  let candidateTargets = 0;
  let updatedRows = 0;
  let missingTargets = 0;
  let unchangedRows = 0;

  for (const [targetId, languageSet] of candidateMap.entries()) {
    candidateTargets += 1;
    const target = getExisting.get(targetId);

    if (!target) {
      missingTargets += 1;
      continue;
    }

    const merged = new Set(parseLanguages(target.languages));
    for (const language of languageSet) {
      merged.add(language);
    }
    const normalized = Array.from(merged).sort((a, b) => a.localeCompare(b)).join(', ');
    if (!normalized) continue;
    if (normalized === String(target.languages || '').trim()) {
      unchangedRows += 1;
      continue;
    }

    updateLanguages.run(normalized, targetId);
    updatedRows += 1;
  }

  return {
    candidateTargets,
    updatedRows,
    missingTargets,
    unchangedRows,
  };
});

const result = tx();
db.pragma('wal_checkpoint(TRUNCATE)');
db.close();

if (fs.existsSync(frontendDbPath)) {
  fs.copyFileSync(dbPath, frontendDbPath);
}

console.log(JSON.stringify({
  message: 'Backfilled nonprofit languages from explicit staging language cues',
  ...result,
}, null, 2));
