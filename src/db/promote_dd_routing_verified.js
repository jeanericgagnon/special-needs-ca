import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');

const db = new Database(dbPath);

const OFFICIAL_ORIGIN_SET = new Set(['official_directory_extract', 'official_locator_derived']);
const OFFICIAL_URL_PATTERNS = [
  /^https:\/\/(?:www\.)?[^/]+\.gov\//i,
  /^https:\/\/(?:www\.)?nj\.gov\//i,
  /^https:\/\/(?:www\.)?apd\.myflorida\.com\//i,
  /^https:\/\/(?:www\.)?floridaearlysteps\.com/i,
];

function hasPlaceholderPhone(phone) {
  if (!phone) return false;
  return /\(\s*555\s*\)|\b555-/.test(phone);
}

function isOfficialLikeUrl(url) {
  return OFFICIAL_URL_PATTERNS.some((pattern) => pattern.test(url || ''));
}

const sourceListedRows = db.prepare(`
  SELECT id, state_id, agency_type, name, source_url, website, intake_phone, data_origin
  FROM state_resource_agencies
  WHERE verification_status = 'source_listed'
`).all();

const groupMetrics = new Map();

for (const row of sourceListedRows) {
  const key = `${row.state_id}::${row.agency_type}::${row.source_url || ''}`;
  const current = groupMetrics.get(key) || { total: 0, phones: new Set() };
  current.total += 1;
  if (row.intake_phone && !hasPlaceholderPhone(row.intake_phone)) {
    current.phones.add(row.intake_phone.trim());
  }
  groupMetrics.set(key, current);
}

function hasDistinctLocalSignal(row) {
  const key = `${row.state_id}::${row.agency_type}::${row.source_url || ''}`;
  const group = groupMetrics.get(key);
  if (!group) return false;
  if (group.total <= 10) return group.phones.size >= 1;
  return (group.phones.size / group.total) >= 0.5;
}

function canPromote(row) {
  if (!row.source_url || !row.website || !row.intake_phone) return false;
  if (hasPlaceholderPhone(row.intake_phone)) return false;

  if (OFFICIAL_ORIGIN_SET.has(row.data_origin || '')) {
    return true;
  }

  if (isOfficialLikeUrl(row.source_url) && hasDistinctLocalSignal(row)) {
    return true;
  }

  if (row.source_url === row.website && hasDistinctLocalSignal(row)) {
    return true;
  }

  return false;
}

const promotable = sourceListedRows.filter(canPromote);

const updateStmt = db.prepare(`
  UPDATE state_resource_agencies
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

console.log(`Promoted ${promotable.length} DD routing rows from source_listed to verified.`);
console.log(JSON.stringify({ promotedByState, remainingByState }, null, 2));

db.close();
