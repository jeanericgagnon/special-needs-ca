import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPath = process.env.DB_PATH || path.join(repoRoot, 'ca_disability_navigator.db');
const frontendDbPath = process.env.FRONTEND_DB_PATH || path.join(repoRoot, 'frontend', 'ca_disability_navigator.db');
const defaultInputPath = process.env.INPUT_PATH || path.join(repoRoot, 'data', 'provider-accessibility-review-decisions.json');

const ALLOWED_DECISIONS = new Set(['reviewed', 'rejected']);

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

function parseCsvLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
      continue;
    }
    current += char;
  }

  values.push(current);
  return values;
}

function parseCsvRows(raw) {
  const lines = String(raw)
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .filter((line) => line.trim().length > 0);

  if (lines.length === 0) return [];

  const headers = parseCsvLine(lines[0]).map((value) => value.trim());
  return lines.slice(1).map((line) => {
    const cells = parseCsvLine(line);
    const row = {};
    for (let index = 0; index < headers.length; index += 1) {
      row[headers[index]] = cells[index] ?? '';
    }
    return row;
  });
}

if (!fs.existsSync(defaultInputPath)) {
  console.log(JSON.stringify({
    message: 'No provider accessibility review decision file found; nothing to apply.',
    expectedPath: defaultInputPath,
    applied: 0,
    skipped: 0,
  }, null, 2));
  process.exit(0);
}

const raw = fs.readFileSync(defaultInputPath, 'utf8');
const isCsvInput = defaultInputPath.toLowerCase().endsWith('.csv');
const parsed = isCsvInput ? null : JSON.parse(raw);
const rows = isCsvInput
  ? parseCsvRows(raw)
  : (Array.isArray(parsed) ? parsed : parsed.rows);

if (!Array.isArray(rows)) {
  throw new Error(`Expected an array of review decision rows in ${defaultInputPath}`);
}

const db = new Database(dbPath);

const getExisting = db.prepare(`
  SELECT id, clue_status
  FROM provider_accessibility_pull_results
  WHERE id = ?
`);

const applyDecision = db.prepare(`
  UPDATE provider_accessibility_pull_results
  SET clue_status = ?,
      clue_page_url = ?,
      clue_value = ?,
      clue_text = ?,
      review_notes = ?,
      reviewed_by = ?,
      reviewed_at = ?,
      updated_at = ?
  WHERE id = ?
`);

const now = new Date().toISOString();
const summary = {
  inputPath: defaultInputPath,
  inputFormat: isCsvInput ? 'csv' : 'json',
  inputRows: rows.length,
  applied: 0,
  appliedByDecision: {},
  skippedByReason: {},
};

function note(reason) {
  summary.skippedByReason[reason] = (summary.skippedByReason[reason] || 0) + 1;
}

function noteApplied(decision) {
  summary.applied += 1;
  summary.appliedByDecision[decision] = (summary.appliedByDecision[decision] || 0) + 1;
}

const tx = db.transaction(() => {
  for (const row of rows) {
    const id = hasText(row?.id) ? String(row.id).trim() : '';
    const decision = hasText(row?.decision) ? String(row.decision).trim().toLowerCase() : '';
    const cluePageUrl = hasText(row?.clue_page_url) ? String(row.clue_page_url).trim() : '';
    const clueValue = hasText(row?.clue_value) ? String(row.clue_value).trim() : '';
    const clueText = hasText(row?.clue_text) ? String(row.clue_text).trim() : '';
    const reviewNotes = hasText(row?.review_notes) ? String(row.review_notes).trim() : '';
    const reviewedBy = hasText(row?.reviewed_by) ? String(row.reviewed_by).trim() : '';

    if (!id) {
      note('missing_id');
      continue;
    }

    if (!ALLOWED_DECISIONS.has(decision)) {
      note('invalid_decision');
      continue;
    }

    const existing = getExisting.get(id);
    if (!existing) {
      note('missing_queue_row');
      continue;
    }

    if (!['queued', 'reviewed'].includes(String(existing.clue_status || ''))) {
      note('non_mutable_existing_status');
      continue;
    }

    if (!reviewedBy) {
      note('missing_reviewed_by');
      continue;
    }

    if (decision === 'reviewed') {
      if (!isValidUrl(cluePageUrl)) {
        note('missing_or_invalid_clue_page_url');
        continue;
      }
      if (!clueValue && !clueText) {
        note('missing_reviewed_evidence');
        continue;
      }
    }

    if (decision === 'rejected' && !reviewNotes) {
      note('missing_rejection_notes');
      continue;
    }

    applyDecision.run(
      decision,
      cluePageUrl || null,
      clueValue || null,
      clueText || null,
      reviewNotes || null,
      reviewedBy,
      now,
      now,
      id,
    );
    noteApplied(decision);
  }
});

tx();
db.pragma('wal_checkpoint(TRUNCATE)');
db.close();

if (frontendDbPath && fs.existsSync(frontendDbPath)) {
  fs.copyFileSync(dbPath, frontendDbPath);
}

console.log(JSON.stringify(summary, null, 2));
