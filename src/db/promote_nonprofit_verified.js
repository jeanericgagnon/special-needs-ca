import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');

const db = new Database(dbPath);

const PROMOTABLE_STATUSES = new Set([
  'source_listed',
  'official',
  'trusted_nonprofit_listed',
  'pending_review',
]);

const SYNTHETIC_SOURCE_HOST_PATTERNS = [
  /^www\.advocate\./i,
  /^www\.therapy\./i,
  /^www\.legal\./i,
  /^www\.pediatrictherapy\./i,
  /^[a-z]{2}-pa\.org$/i,
];

function hasPlaceholderPhone(phone) {
  if (!phone) return false;
  return /\(\s*555\s*\)|\b555-/.test(phone);
}

function hasPlaceholderEmail(email) {
  if (!email) return false;
  return /@example\./i.test(email);
}

function hasValidUrl(url) {
  if (!url) return false;

  try {
    const parsed = new URL(url);
    return !SYNTHETIC_SOURCE_HOST_PATTERNS.some((pattern) => pattern.test(parsed.hostname));
  } catch {
    return false;
  }
}

function hasContactSignal(row) {
  return Boolean(
    (row.phone && row.phone.trim() !== '' && !hasPlaceholderPhone(row.phone)) ||
    (row.email && row.email.trim() !== '' && !hasPlaceholderEmail(row.email)) ||
    (row.website && row.website.trim() !== '')
  );
}

function getPromotedStatus(row) {
  if (row.verification_status === 'official') return 'official_verified';
  if (row.data_origin === 'official_directory_extract') return 'official_verified';
  if ((row.source_type || '').toLowerCase() === 'official') return 'official_verified';
  return 'verified';
}

const candidateRows = db.prepare(`
  SELECT
    n.id,
    c.state_id,
    n.name,
    n.phone,
    n.website,
    n.source_url,
    n.source_type,
    n.data_origin,
    n.verification_status,
    NULL as email
  FROM nonprofit_organizations n
  JOIN counties c ON c.id = n.county_id
  WHERE n.verification_status IN ('source_listed', 'official', 'trusted_nonprofit_listed', 'pending_review')
`).all();

function canPromote(row) {
  if (!PROMOTABLE_STATUSES.has(row.verification_status || '')) return false;
  if (!hasValidUrl(row.source_url) || !hasValidUrl(row.website)) return false;
  if (!hasContactSignal(row)) return false;
  if (!row.name || /https?:\/\//i.test(row.name)) return false;
  return true;
}

const sanitizePhoneStmt = db.prepare(`
  UPDATE nonprofit_organizations
  SET phone = NULL
  WHERE id = ?
`);

const promoteStmt = db.prepare(`
  UPDATE nonprofit_organizations
  SET verification_status = ?,
      last_verified_date = ?,
      last_scraped_at = COALESCE(last_scraped_at, ?)
  WHERE id = ?
`);

const now = new Date().toISOString();
const today = now.slice(0, 10);

let sanitizedPhones = 0;
const promotable = [];
const remainingByReason = {};

function noteRemaining(reason) {
  remainingByReason[reason] = (remainingByReason[reason] || 0) + 1;
}

const tx = db.transaction(() => {
  for (const row of candidateRows) {
    if (hasPlaceholderPhone(row.phone || '')) {
      sanitizePhoneStmt.run(row.id);
      row.phone = null;
      sanitizedPhones += 1;
    }

    if (canPromote(row)) {
      promotable.push(row);
      promoteStmt.run(getPromotedStatus(row), today, now, row.id);
      continue;
    }

    if (!hasValidUrl(row.source_url)) noteRemaining('invalid_source_url');
    else if (!hasValidUrl(row.website)) noteRemaining('invalid_website');
    else if (!hasContactSignal(row)) noteRemaining('missing_contact_signal');
    else if (!row.name || /https?:\/\//i.test(row.name)) noteRemaining('malformed_name');
    else noteRemaining('other');
  }
});

tx();

const promotedByState = promotable.reduce((acc, row) => {
  acc[row.state_id] = (acc[row.state_id] || 0) + 1;
  return acc;
}, {});

const promotedByStatus = promotable.reduce((acc, row) => {
  const key = `${row.verification_status}->${getPromotedStatus(row)}`;
  acc[key] = (acc[key] || 0) + 1;
  return acc;
}, {});

console.log(`Sanitized ${sanitizedPhones} nonprofit placeholder phones.`);
console.log(`Promoted ${promotable.length} nonprofit rows.`);
console.log(JSON.stringify({ promotedByStatus, promotedByState, remainingByReason }, null, 2));

db.close();
