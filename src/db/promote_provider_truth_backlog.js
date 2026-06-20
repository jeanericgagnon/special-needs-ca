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

const PROMOTABLE_STATUSES = new Set(['pending_review']);
const PROMOTABLE_SOURCE_TYPES = new Set([
  'official_directory',
  'hospital_website',
  'state_website',
  'hospital_university_directory',
]);
const PROMOTABLE_CATEGORY_TOKENS = new Set([
  'developmental_pediatrics',
  'developmental_clinic',
  'autism_clinic',
  'diagnostic_center',
  'card_center',
]);
const SYNTHETIC_SOURCE_HOST_PATTERNS = [
  /^www\.advocate\./i,
  /^www\.therapy\./i,
  /^www\.legal\./i,
  /^www\.pediatrictherapy\./i,
  /^[a-z]{2}-pa\.org$/i,
];

function parseCsv(value) {
  if (!value) return [];
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

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
    (row.next_step_url && row.next_step_url.trim() !== '')
  );
}

function hasPromotableCategory(row) {
  return parseCsv(row.categories).some((token) => PROMOTABLE_CATEGORY_TOKENS.has(token));
}

function hasOfficialLikeSource(row) {
  return PROMOTABLE_SOURCE_TYPES.has((row.source_type || '').trim());
}

function isMalformedName(name) {
  return !name || /https?:\/\//i.test(name);
}

function canPromote(row) {
  if (!PROMOTABLE_STATUSES.has(row.verification_status || '')) return false;
  if (!hasOfficialLikeSource(row)) return false;
  if (!hasPromotableCategory(row)) return false;
  if (!hasValidUrl(row.source_url)) return false;
  if (!hasContactSignal(row)) return false;
  if (row.manual_review_required === 1) return false;
  if (row.unsupported_claim_flags && String(row.unsupported_claim_flags).trim() !== '') return false;
  if (isMalformedName(row.name)) return false;
  return true;
}

const candidateRows = db.prepare(`
  SELECT
    rp.id,
    c.state_id,
    rp.name,
    rp.categories,
    rp.phone,
    rp.email,
    rp.source_url,
    rp.source_type,
    rp.data_origin,
    rp.verification_status,
    rp.manual_review_required,
    rp.unsupported_claim_flags,
    rp.next_step_url
  FROM resource_providers rp
  JOIN counties c ON c.id = rp.county_id
  WHERE rp.verification_status = 'pending_review'
`).all();

const promoteStmt = db.prepare(`
  UPDATE resource_providers
  SET verification_status = 'source_listed',
      last_verified_date = ?,
      last_scraped_at = COALESCE(last_scraped_at, ?),
      checked_at = COALESCE(checked_at, ?)
  WHERE id = ?
`);

const now = new Date().toISOString();
const today = now.slice(0, 10);

const promotable = [];
const remainingByReason = {};

function noteRemaining(reason) {
  remainingByReason[reason] = (remainingByReason[reason] || 0) + 1;
}

const tx = db.transaction(() => {
  for (const row of candidateRows) {
    if (canPromote(row)) {
      promoteStmt.run(today, now, now, row.id);
      promotable.push(row);
      continue;
    }

    if (!hasOfficialLikeSource(row)) noteRemaining('non_official_source_type');
    else if (!hasPromotableCategory(row)) noteRemaining('non_promotable_category');
    else if (!hasValidUrl(row.source_url)) noteRemaining('invalid_source_url');
    else if (!hasContactSignal(row)) noteRemaining('missing_contact_signal');
    else if (row.manual_review_required === 1) noteRemaining('manual_review_required');
    else if (row.unsupported_claim_flags && String(row.unsupported_claim_flags).trim() !== '') noteRemaining('unsupported_claim_flags');
    else if (isMalformedName(row.name)) noteRemaining('malformed_name');
    else noteRemaining('other');
  }
});

tx();

db.pragma('wal_checkpoint(TRUNCATE)');
db.close();

if (fs.existsSync(frontendDbPath)) {
  fs.copyFileSync(dbPath, frontendDbPath);
}

const promotedByState = promotable.reduce((acc, row) => {
  acc[row.state_id] = (acc[row.state_id] || 0) + 1;
  return acc;
}, {});

console.log(`Promoted ${promotable.length} provider rows from pending_review to source_listed.`);
console.log(JSON.stringify({ promotedByState, remainingByReason }, null, 2));
