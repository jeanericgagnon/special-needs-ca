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

const SYNTHETIC_SOURCE_HOST_PATTERNS = [
  /^www\.advocate\./i,
  /^www\.therapy\./i,
  /^www\.legal\./i,
  /^www\.pediatrictherapy\./i,
  /^www\.[a-z]{2}-pa\.org$/i,
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

function parseHostname(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

function hasValidUrl(url) {
  const hostname = parseHostname(url);
  if (!hostname) return false;
  return !SYNTHETIC_SOURCE_HOST_PATTERNS.some((pattern) => pattern.test(hostname));
}

function hasContactSignal(row) {
  return Boolean(
    (row.phone && row.phone.trim() !== '' && !hasPlaceholderPhone(row.phone)) ||
    (row.email && row.email.trim() !== '' && !hasPlaceholderEmail(row.email)) ||
    (row.website && row.website.trim() !== '')
  );
}

function hasDirectContactSignal(row) {
  return Boolean(
    (row.phone && row.phone.trim() !== '' && !hasPlaceholderPhone(row.phone)) ||
    (row.email && row.email.trim() !== '' && !hasPlaceholderEmail(row.email))
  );
}

function isSyntheticManualReviewRow(row) {
  if (row.verification_status !== 'manual_review_required') return false;
  if (!['curated_seed', 'programmatic_generator'].includes(row.data_origin || '')) return false;

  const host = parseHostname(row.source_url || '');
  const unsupportedFlags = String(row.unsupported_claim_flags || '');
  const website = String(row.website || '').trim();

  if (
    row.data_origin === 'programmatic_generator' &&
    unsupportedFlags.includes('likely_synthetic_advocate_profile') &&
    website === 'https://www.cde.ca.gov/sp/se/' &&
    !hasDirectContactSignal(row)
  ) {
    return true;
  }

  if (row.data_origin === 'curated_seed') {
    if (!host) return true;
    if (!hasContactSignal(row)) return true;
  }

  return Boolean(host) && SYNTHETIC_SOURCE_HOST_PATTERNS.some((pattern) => pattern.test(host));
}

function getPromotedStatus(row) {
  if ((row.source_type || '').toLowerCase() === 'official') return 'official_verified';
  return 'verified';
}

const candidateRows = db.prepare(`
  SELECT
    ia.id,
    ia.name,
    ia.phone,
    ia.email,
    ia.website,
    ia.source_url,
    ia.source_type,
    ia.data_origin,
    ia.verification_status,
    ia.unsupported_claim_flags
  FROM iep_advocates ia
  WHERE ia.verification_status IN ('source_listed', 'manual_review_required')
`).all();

function canPromote(row) {
  if (row.verification_status !== 'source_listed') return false;
  if (!hasValidUrl(row.source_url) || !hasValidUrl(row.website)) return false;
  if (!hasContactSignal(row)) return false;
  if (!row.name || /https?:\/\//i.test(row.name)) return false;
  return true;
}

const promoteStmt = db.prepare(`
  UPDATE iep_advocates
  SET verification_status = ?,
      last_verified_date = ?,
      last_verified_at = ?,
      last_scraped_at = COALESCE(last_scraped_at, ?)
  WHERE id = ?
`);

const deleteStmt = db.prepare(`
  DELETE FROM iep_advocates
  WHERE id = ?
`);

const now = new Date().toISOString();
const today = now.slice(0, 10);

const promoted = [];
const deleted = [];
const remainingByReason = {};

function noteRemaining(reason) {
  remainingByReason[reason] = (remainingByReason[reason] || 0) + 1;
}

const tx = db.transaction(() => {
  for (const row of candidateRows) {
    if (isSyntheticManualReviewRow(row)) {
      deleteStmt.run(row.id);
      deleted.push(row);
      continue;
    }

    if (row.verification_status === 'source_listed' && (!hasValidUrl(row.source_url) || !hasValidUrl(row.website))) {
      deleteStmt.run(row.id);
      deleted.push(row);
      continue;
    }

    if (canPromote(row)) {
      promoteStmt.run(getPromotedStatus(row), today, now, now, row.id);
      promoted.push(row);
      continue;
    }

    if (row.verification_status === 'manual_review_required') noteRemaining('manual_review_retained');
    else if (!hasValidUrl(row.source_url)) noteRemaining('invalid_source_url');
    else if (!hasValidUrl(row.website)) noteRemaining('invalid_website');
    else if (!hasContactSignal(row)) noteRemaining('missing_contact_signal');
    else if (!row.name || /https?:\/\//i.test(row.name)) noteRemaining('malformed_name');
    else noteRemaining('other');
  }
});

tx();

const promotedByStatus = promoted.reduce((acc, row) => {
  const key = `${row.verification_status}->${getPromotedStatus(row)}`;
  acc[key] = (acc[key] || 0) + 1;
  return acc;
}, {});

console.log(`Promoted ${promoted.length} advocate/provider rows.`);
console.log(`Deleted ${deleted.length} synthetic advocate/provider rows.`);
console.log(JSON.stringify({ promotedByStatus, remainingByReason }, null, 2));

db.pragma('wal_checkpoint(TRUNCATE)');
db.close();

if (fs.existsSync(frontendDbPath)) {
  fs.copyFileSync(dbPath, frontendDbPath);
}
