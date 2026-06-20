import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');

const db = new Database(dbPath);

function hasPlaceholderPhone(phone) {
  if (!phone) return false;
  return /\(\s*555\s*\)|\b555-/.test(phone);
}

function hasValidUrl(url) {
  if (!url) return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function hasPublicContactSignal(row) {
  return Boolean(
    (row.intake_phone && row.intake_phone.trim() !== '' && !hasPlaceholderPhone(row.intake_phone)) ||
    (row.website && row.website.trim() !== '')
  );
}

function hasReasonableName(name = '') {
  return Boolean(name) && !/https?:\/\//i.test(name);
}

const rows = db.prepare(`
  SELECT id, name, agency_type, intake_phone, website, source_url, data_origin, verification_status
  FROM state_resource_agencies
  WHERE verification_status IN ('source_listed', 'manual_review_required')
`).all();

function canPromote(row) {
  return (
    hasValidUrl(row.source_url) &&
    hasValidUrl(row.website) &&
    hasPublicContactSignal(row) &&
    hasReasonableName(row.name)
  );
}

const updateStmt = db.prepare(`
  UPDATE state_resource_agencies
  SET verification_status = 'verified',
      last_verified_date = ?,
      last_scraped_at = COALESCE(last_scraped_at, ?)
  WHERE id = ?
`);

const now = new Date().toISOString();
const today = now.slice(0, 10);

let promoted = 0;
const remainingByReason = {};

function note(reason) {
  remainingByReason[reason] = (remainingByReason[reason] || 0) + 1;
}

const tx = db.transaction(() => {
  for (const row of rows) {
    if (canPromote(row)) {
      updateStmt.run(today, now, row.id);
      promoted += 1;
      continue;
    }

    if (!hasValidUrl(row.source_url)) note('invalid_source_url');
    else if (!hasValidUrl(row.website)) note('invalid_website');
    else if (!hasPublicContactSignal(row)) note('missing_contact_signal');
    else if (!hasReasonableName(row.name)) note('malformed_name');
    else note('other');
  }
});

tx();

console.log(`Promoted ${promoted} DD routing rows to verified.`);
console.log(JSON.stringify({ remainingByReason }, null, 2));

db.close();
