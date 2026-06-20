import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');

const db = new Database(dbPath);

const DIRECT_PROMOTION_ORIGINS = new Set([
  'official_directory_extract',
  'official_locator_derived',
  'scraped_live',
]);

const OFFICIAL_URL_PATTERNS = [
  /^https:\/\/(?:www\.)?[^/]+\.gov\//i,
  /^https:\/\/(?:www\.)?[^/]+\.ca\.gov\//i,
  /^https:\/\/(?:www\.)?[^/]+county\.ca\.gov\//i,
  /^https:\/\/(?:www\.)?benefitscal\.com\/?$/i,
  /^https:\/\/myaccess\.myflfamilies\.com/i,
  /^https:\/\/(?:www\.)?compass\.state\.pa\.us\/?$/i,
  /^https:\/\/www\.dhs\.state\.il\.us\//i,
  /^https:\/\/www\.health\.ny\.gov\//i,
  /^https:\/\/www\.dhs\.pa\.gov\//i,
  /^https:\/\/hhs\.texas\.gov\//i,
];

function isOfficialLikeUrl(url) {
  return OFFICIAL_URL_PATTERNS.some((pattern) => pattern.test(url || ''));
}

function hasPlaceholderPhone(phone) {
  if (!phone) return false;
  return /\(\s*555\s*\)|\b555-/.test(phone);
}

function hasMalformedOfficeName(name) {
  return !name || /https?:\/\//i.test(name);
}

function hasOfficialWebsiteSignal(row) {
  return isOfficialLikeUrl(row.source_url) || isOfficialLikeUrl(row.website);
}

const sourceListedRows = db.prepare(`
  SELECT
    co.id,
    c.state_id,
    co.program_id,
    co.office_name,
    co.phone,
    co.email,
    co.website,
    co.source_url,
    co.data_origin
  FROM county_offices co
  JOIN counties c ON c.id = co.county_id
  WHERE co.verification_status = 'source_listed'
`).all();

function canPromote(row) {
  if (!row.source_url || !row.website) return false;
  const hasDirectContact = Boolean(
    (row.phone && row.phone.trim() !== '') ||
    (row.email && row.email.trim() !== '')
  );
  if (!hasDirectContact && !hasOfficialWebsiteSignal(row)) return false;
  if (hasPlaceholderPhone(row.phone || '')) return false;
  if (hasMalformedOfficeName(row.office_name)) return false;

  if (DIRECT_PROMOTION_ORIGINS.has(row.data_origin || '')) {
    return true;
  }

  if (isOfficialLikeUrl(row.source_url)) {
    return true;
  }

  return false;
}

const promotable = sourceListedRows.filter(canPromote);

const updateStmt = db.prepare(`
  UPDATE county_offices
  SET verification_status = 'verified',
      last_verified_date = ?,
      last_scraped_at = COALESCE(last_scraped_at, ?)
  WHERE id = ?
`);

const now = new Date().toISOString();
const today = now.slice(0, 10);

const tx = db.transaction(() => {
  for (const row of promotable) {
    updateStmt.run(today, now, row.id);
  }
});

tx();

const promotedByState = promotable.reduce((acc, row) => {
  acc[row.state_id] = (acc[row.state_id] || 0) + 1;
  return acc;
}, {});

const remainingByState = sourceListedRows
  .filter((row) => !canPromote(row))
  .reduce((acc, row) => {
    acc[row.state_id] = (acc[row.state_id] || 0) + 1;
    return acc;
  }, {});

console.log(`Promoted ${promotable.length} office rows from source_listed to verified.`);
console.log(JSON.stringify({ promotedByState, remainingByState }, null, 2));

db.close();
