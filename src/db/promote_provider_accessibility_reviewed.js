import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPath = process.env.DB_PATH || path.join(repoRoot, 'ca_disability_navigator.db');
const frontendDbPath = process.env.FRONTEND_DB_PATH || path.join(repoRoot, 'frontend', 'ca_disability_navigator.db');

const db = new Database(dbPath);

const BOOLEAN_FIELDS = new Set([
  'interpreter_available',
  'asl_available',
  'wheelchair_accessible',
  'virtual_services',
  'in_person_services',
  'home_visits',
  'transportation_help',
]);
const NEXT_STEP_TYPES = new Set([
  'call',
  'email',
  'apply_online',
  'referral',
  'schedule',
  'walk_in',
  'download_form',
  'contact_form',
  'see_instructions',
  'unknown',
]);

const URL_FIELDS = new Set(['application_url', 'referral_url']);
const TEXT_FIELDS = new Set(['accessibility_notes', 'requirements']);
const MERGE_FIELDS = new Set(['languages']);

function hasText(value) {
  return typeof value === 'string' ? value.trim().length > 0 : value !== null && value !== undefined;
}

function isValidUrl(url) {
  if (!hasText(url)) return false;
  try {
    const parsed = new URL(String(url).trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function parseCsv(value) {
  if (!hasText(value)) return [];
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeLanguageToken(token) {
  const value = String(token || '').trim();
  if (!value) return null;
  const lower = value.toLowerCase();
  if (lower === 'english') return 'English';
  if (lower === 'spanish' || lower === 'espanol' || lower === 'español') return 'Spanish';
  if (lower === 'asl') return 'ASL';
  return value;
}

function extractLanguages(raw) {
  const values = new Set();
  for (const token of parseCsv(raw)) {
    const normalized = normalizeLanguageToken(token);
    if (normalized) values.add(normalized);
  }

  const text = String(raw || '');
  if (/\benglish\b/i.test(text)) values.add('English');
  if (/\bspanish\b|\bespanol\b|\bespañol\b/i.test(text)) values.add('Spanish');
  if (/\basl\b/i.test(text)) values.add('ASL');

  return [...values].sort((a, b) => a.localeCompare(b));
}

function parsePositiveBoolean(value) {
  const normalized = String(value || '').trim().toLowerCase();
  if (!normalized) return null;
  if (['1', 'true', 'yes', 'y', 'available', 'supported'].includes(normalized)) return 1;
  if (['0', 'false', 'no', 'n', 'not available', 'unsupported'].includes(normalized)) return 0;
  return null;
}

const reviewedRows = db.prepare(`
  SELECT par.id,
         par.provider_id,
         par.clue_field,
         par.clue_value,
         par.clue_text,
         par.clue_page_url,
         par.review_notes,
         par.clue_status,
         par.reviewed_at,
         rp.languages,
         rp.accessibility_notes,
         rp.requirements,
         rp.application_url,
         rp.referral_url,
         rp.next_step_type,
         rp.interpreter_available,
         rp.asl_available,
         rp.wheelchair_accessible,
         rp.virtual_services,
         rp.in_person_services,
         rp.home_visits,
         rp.transportation_help,
         rp.checked_at
  FROM provider_accessibility_pull_results par
  JOIN resource_providers rp ON rp.id = par.provider_id
  WHERE par.clue_status = 'reviewed'
  ORDER BY par.provider_id, par.clue_field, par.id
`).all();

const markPromoted = db.prepare(`
  UPDATE provider_accessibility_pull_results
  SET clue_status = 'promoted',
      promotion_target_column = COALESCE(promotion_target_column, clue_field),
      promoted_at = ?,
      updated_at = ?
  WHERE id = ?
`);

const setCheckedAtOnly = db.prepare(`
  UPDATE resource_providers
  SET checked_at = COALESCE(checked_at, ?)
  WHERE id = ?
`);

function updateSingleField(field, value, checkedAt, providerId) {
  const stmt = db.prepare(`
    UPDATE resource_providers
    SET ${field} = ?,
        checked_at = COALESCE(checked_at, ?)
    WHERE id = ?
  `);
  stmt.run(value, checkedAt, providerId);
}

const now = new Date().toISOString();
const summary = {
  reviewedRows: reviewedRows.length,
  promotedRows: 0,
  promotedByField: {},
  skippedByReason: {},
};

function note(reason) {
  summary.skippedByReason[reason] = (summary.skippedByReason[reason] || 0) + 1;
}

function notePromoted(field) {
  summary.promotedRows += 1;
  summary.promotedByField[field] = (summary.promotedByField[field] || 0) + 1;
}

const tx = db.transaction(() => {
  for (const row of reviewedRows) {
    const field = String(row.clue_field || '').trim();
    const clueValue = hasText(row.clue_value) ? String(row.clue_value).trim() : '';
    const clueText = hasText(row.clue_text) ? String(row.clue_text).trim() : '';
    const evidenceText = clueValue || clueText;

    if (!hasText(row.clue_page_url)) {
      note('missing_clue_page_url');
      continue;
    }

    if (!hasText(evidenceText) && !URL_FIELDS.has(field)) {
      note('missing_evidence_value');
      continue;
    }

    if (MERGE_FIELDS.has(field)) {
      const merged = new Set(parseCsv(row.languages));
      for (const language of extractLanguages(evidenceText)) {
        merged.add(language);
      }
      if (merged.size === 0) {
        note('unparseable_languages');
        continue;
      }

      const nextValue = [...merged].sort((a, b) => a.localeCompare(b)).join(', ');
      if (nextValue !== String(row.languages || '').trim()) {
        updateSingleField('languages', nextValue, now, row.provider_id);
      } else {
        setCheckedAtOnly.run(now, row.provider_id);
      }
      markPromoted.run(now, now, row.id);
      notePromoted(field);
      continue;
    }

    if (BOOLEAN_FIELDS.has(field)) {
      const parsed = parsePositiveBoolean(evidenceText);
      if (parsed !== 1) {
        note(parsed === 0 ? 'negative_boolean_not_promoted' : 'unparseable_boolean');
        continue;
      }

      if (row[field] !== 1) {
        updateSingleField(field, 1, now, row.provider_id);
      } else {
        setCheckedAtOnly.run(now, row.provider_id);
      }
      markPromoted.run(now, now, row.id);
      notePromoted(field);
      continue;
    }

    if (field === 'next_step_type') {
      if (!NEXT_STEP_TYPES.has(clueValue)) {
        note('invalid_next_step_type');
        continue;
      }
      if (hasText(row.next_step_type) && row.next_step_type !== clueValue) {
        note('conflicting_next_step_type');
        continue;
      }

      if (row.next_step_type !== clueValue) {
        updateSingleField('next_step_type', clueValue, now, row.provider_id);
      } else {
        setCheckedAtOnly.run(now, row.provider_id);
      }
      markPromoted.run(now, now, row.id);
      notePromoted(field);
      continue;
    }

    if (URL_FIELDS.has(field)) {
      if (!isValidUrl(clueValue)) {
        note('invalid_url_value');
        continue;
      }
      if (hasText(row[field]) && row[field] !== clueValue) {
        note('conflicting_existing_url');
        continue;
      }

      if (row[field] !== clueValue) {
        updateSingleField(field, clueValue, now, row.provider_id);
      } else {
        setCheckedAtOnly.run(now, row.provider_id);
      }
      markPromoted.run(now, now, row.id);
      notePromoted(field);
      continue;
    }

    if (TEXT_FIELDS.has(field)) {
      if (!hasText(evidenceText)) {
        note('missing_text_value');
        continue;
      }
      if (hasText(row[field]) && String(row[field]).trim() !== evidenceText) {
        note('conflicting_existing_text');
        continue;
      }

      if (String(row[field] || '').trim() !== evidenceText) {
        updateSingleField(field, evidenceText, now, row.provider_id);
      } else {
        setCheckedAtOnly.run(now, row.provider_id);
      }
      markPromoted.run(now, now, row.id);
      notePromoted(field);
      continue;
    }

    note('unsupported_field');
  }
});

tx();
db.pragma('wal_checkpoint(TRUNCATE)');
db.close();

if (frontendDbPath && fs.existsSync(frontendDbPath)) {
  fs.copyFileSync(dbPath, frontendDbPath);
}

console.log(`Promoted ${summary.promotedRows} reviewed provider accessibility clues.`);
console.log(JSON.stringify(summary, null, 2));
