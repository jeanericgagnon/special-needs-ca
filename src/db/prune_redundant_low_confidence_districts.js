import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');

const db = new Database(dbPath);

const coveredCountyIds = db.prepare(`
  SELECT DISTINCT county_id
  FROM school_districts
  WHERE verification_status IN ('verified', 'official_verified', 'human_verified')
`).all().map((row) => row.county_id);

if (coveredCountyIds.length === 0) {
  console.log('Deleted 0 redundant low-confidence district rows.');
  console.log(JSON.stringify({ deletedByState: {} }, null, 2));
  db.close();
  process.exit(0);
}

const rows = db.prepare(`
  SELECT sd.id, sd.name, sd.county_id, c.state_id, sd.verification_status, sd.data_origin, sd.website, sd.source_url, sd.spec_ed_contact_phone, sd.spec_ed_contact_email
  FROM school_districts sd
  JOIN counties c ON c.id = sd.county_id
  WHERE sd.county_id IN (${coveredCountyIds.map(() => '?').join(',')})
    AND sd.verification_status IN ('source_listed', 'manual_review_required', 'unverified')
`).all(...coveredCountyIds);

function parseHostname(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

function shouldDelete(row) {
  if (row.verification_status === 'unverified') {
    return (
      row.source_url === 'https://educationdata.urban.org' &&
      (row.website || '').startsWith('https://www.google.com/search?q=') &&
      (row.spec_ed_contact_email || '').startsWith('specialeducation@')
    );
  }

  if (row.verification_status === 'manual_review_required') {
    return Boolean(
      row.data_origin === 'scraped' &&
      !row.spec_ed_contact_phone &&
      !row.spec_ed_contact_email &&
      (!row.website || /County School District$/i.test(row.name || ''))
    );
  }

  if (row.verification_status === 'source_listed') {
    const websiteHost = parseHostname(row.website || '');
    const sourceHost = parseHostname(row.source_url || '');
    if (!websiteHost || !sourceHost) return false;

    return (
      row.data_origin === 'official_locator_derived' ||
      websiteHost === sourceHost
    );
  }

  return false;
}

const deleteStmt = db.prepare('DELETE FROM school_districts WHERE id = ?');
const deletedByState = {};
let deleted = 0;

const tx = db.transaction(() => {
  for (const row of rows) {
    if (!shouldDelete(row)) continue;
    deleteStmt.run(row.id);
    deleted += 1;
    deletedByState[row.state_id] = (deletedByState[row.state_id] || 0) + 1;
  }
});

tx();

console.log(`Deleted ${deleted} redundant low-confidence district rows.`);
console.log(JSON.stringify({ deletedByState }, null, 2));

db.close();
