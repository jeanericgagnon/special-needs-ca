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

function hasPlaceholderEmail(email) {
  if (!email) return false;
  return /@example\./i.test(email);
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

function looksLikeMalformedOfficeName(name = '') {
  return (
    !name ||
    /https?:\/\//i.test(name) ||
    /\(\d+\)/.test(name) ||
    /-near/i.test(name) ||
    /-nw/i.test(name) ||
    /warehouse/i.test(name) ||
    /donaghey plaza/i.test(name)
  );
}

function hasPublicContactSignal(row) {
  return Boolean(
    (row.phone && row.phone.trim() !== '' && !hasPlaceholderPhone(row.phone)) ||
    (row.email && row.email.trim() !== '' && !hasPlaceholderEmail(row.email)) ||
    (row.website && row.website.trim() !== '')
  );
}

function canPromoteManual(row) {
  return (
    row.verification_status === 'manual_review_required' &&
    row.data_origin === 'scraped' &&
    hasValidUrl(row.source_url) &&
    hasValidUrl(row.website) &&
    hasPublicContactSignal(row) &&
    !looksLikeMalformedOfficeName(row.office_name)
  );
}

function canPromoteArchivedOffice(row) {
  return (
    row.verification_status === 'unverified' &&
    row.data_origin === 'scraped' &&
    row.source_url === 'https://doi.org/10.7910/DVN/AVRHMI' &&
    hasValidUrl(row.website) &&
    hasPublicContactSignal(row) &&
    !looksLikeMalformedOfficeName(row.office_name)
  );
}

function shouldDeleteArchivedOffice(row) {
  return (
    row.verification_status === 'unverified' &&
    row.data_origin === 'scraped' &&
    row.source_url === 'https://doi.org/10.7910/DVN/AVRHMI' &&
    looksLikeMalformedOfficeName(row.office_name)
  );
}

const rows = db.prepare(`
  SELECT id, office_name, phone, email, website, source_url, data_origin, verification_status
  FROM county_offices
  WHERE verification_status IN ('manual_review_required', 'unverified')
`).all();

const updateStmt = db.prepare(`
  UPDATE county_offices
  SET verification_status = 'verified',
      last_verified_date = ?,
      last_scraped_at = COALESCE(last_scraped_at, ?)
  WHERE id = ?
`);

const deleteStmt = db.prepare(`
  DELETE FROM county_offices
  WHERE id = ?
`);

const now = new Date().toISOString();
const today = now.slice(0, 10);

let promotedManual = 0;
let promotedArchived = 0;
let deletedMalformed = 0;
const remainingByReason = {};

function note(reason) {
  remainingByReason[reason] = (remainingByReason[reason] || 0) + 1;
}

const tx = db.transaction(() => {
  for (const row of rows) {
    if (canPromoteManual(row)) {
      updateStmt.run(today, now, row.id);
      promotedManual += 1;
      continue;
    }

    if (canPromoteArchivedOffice(row)) {
      updateStmt.run(today, now, row.id);
      promotedArchived += 1;
      continue;
    }

    if (shouldDeleteArchivedOffice(row)) {
      deleteStmt.run(row.id);
      deletedMalformed += 1;
      continue;
    }

    if (!hasValidUrl(row.source_url)) note('invalid_source_url');
    else if (!hasValidUrl(row.website)) note('invalid_website');
    else if (!hasPublicContactSignal(row)) note('missing_contact_signal');
    else if (looksLikeMalformedOfficeName(row.office_name)) note('malformed_name');
    else note('other');
  }
});

tx();

console.log(`Promoted ${promotedManual} manual-review office rows to verified.`);
console.log(`Promoted ${promotedArchived} archived scraped office rows to verified.`);
console.log(`Deleted ${deletedMalformed} malformed archived office rows.`);
console.log(JSON.stringify({ remainingByReason }, null, 2));

db.close();
