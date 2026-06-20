import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');

const db = new Database(dbPath);

const DIRECT_PROMOTION_ORIGINS = new Set([
  'curated_seed',
  'official_directory_extract',
]);

function hasPlaceholderPhone(phone) {
  if (!phone) return false;
  return /\(\s*555\s*\)|\b555-/.test(phone);
}

function hasPlaceholderEmail(email) {
  if (!email) return false;
  return /@example\./i.test(email);
}

function hasMalformedDistrictName(name) {
  return !name || /https?:\/\//i.test(name);
}

function parseHostname(url = '') {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

function isGenericStatewideEducationHost(hostname = '') {
  return new Set([
    'education.ohio.gov',
    'www.gadoe.org',
    'edu.wyoming.gov',
    'www.fldoe.org',
    'txschools.gov',
    'www.spedtex.org',
    'data.nysed.gov',
  ]).has(hostname);
}

function isGoogleHost(hostname = '') {
  return hostname.includes('google.com');
}

const sourceListedRows = db.prepare(`
  SELECT
    sd.id,
    c.state_id,
    sd.name,
    sd.website,
    sd.spec_ed_contact_email,
    sd.spec_ed_contact_phone,
    sd.source_url,
    sd.data_origin
  FROM school_districts sd
  JOIN counties c ON c.id = sd.county_id
  WHERE sd.verification_status = 'source_listed'
`).all();

function hasDirectContact(row) {
  return Boolean(
    (row.spec_ed_contact_phone && row.spec_ed_contact_phone.trim() !== '' && !hasPlaceholderPhone(row.spec_ed_contact_phone)) ||
    (row.spec_ed_contact_email && row.spec_ed_contact_email.trim() !== '' && !hasPlaceholderEmail(row.spec_ed_contact_email))
  );
}

function canPromote(row) {
  if (!row.source_url || !row.website) return false;
  if (!hasDirectContact(row)) return false;
  if (hasMalformedDistrictName(row.name)) return false;

  if (DIRECT_PROMOTION_ORIGINS.has(row.data_origin || '')) {
    return true;
  }

  if (row.data_origin !== 'scraped') return false;

  const websiteHost = parseHostname(row.website);
  const sourceHost = parseHostname(row.source_url);
  if (!websiteHost || !sourceHost) return false;
  if (websiteHost !== sourceHost) return false;
  if (isGoogleHost(websiteHost) || isGenericStatewideEducationHost(websiteHost)) return false;

  return true;
}

const promotable = sourceListedRows.filter(canPromote);

const updateStmt = db.prepare(`
  UPDATE school_districts
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

const remainingByOrigin = sourceListedRows
  .filter((row) => !canPromote(row))
  .reduce((acc, row) => {
    acc[row.data_origin] = (acc[row.data_origin] || 0) + 1;
    return acc;
  }, {});

console.log(`Promoted ${promotable.length} education rows from source_listed to verified.`);
console.log(JSON.stringify({ promotedByState, remainingByOrigin }, null, 2));

db.close();
