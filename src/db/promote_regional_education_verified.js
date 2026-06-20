import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');

const db = new Database(dbPath);

function parseHostname(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

function isSyntheticEducationGovHost(hostname = '') {
  return /^www\.[a-z-]+-education\.gov$/i.test(hostname);
}

function hasValidUrl(url) {
  return Boolean(parseHostname(url));
}

function isRealRegionalAgency(row) {
  const websiteHost = parseHostname(row.website || '');
  const sourceHost = parseHostname(row.source_url || '');
  if (!websiteHost || !sourceHost) return false;
  if (isSyntheticEducationGovHost(websiteHost) || isSyntheticEducationGovHost(sourceHost)) return false;
  return true;
}

const rows = db.prepare(`
  SELECT id, website, source_url, verification_status
  FROM regional_education_agencies
  WHERE verification_status IN ('source_listed', 'manual_review_required', 'unverified')
`).all();

const promoteStmt = db.prepare(`
  UPDATE regional_education_agencies
  SET verification_status = 'verified',
      last_verified_date = ?,
      last_scraped_at = COALESCE(last_scraped_at, ?)
  WHERE id = ?
`);

const deleteStmt = db.prepare(`
  DELETE FROM regional_education_agencies
  WHERE id = ?
`);

const now = new Date().toISOString();
const today = now.slice(0, 10);

let promoted = 0;
let deletedSynthetic = 0;
const remainingByReason = {};

function note(reason) {
  remainingByReason[reason] = (remainingByReason[reason] || 0) + 1;
}

const tx = db.transaction(() => {
  for (const row of rows) {
    const websiteHost = parseHostname(row.website || '');
    const sourceHost = parseHostname(row.source_url || '');

    if (
      websiteHost &&
      sourceHost &&
      isSyntheticEducationGovHost(websiteHost) &&
      isSyntheticEducationGovHost(sourceHost)
    ) {
      deleteStmt.run(row.id);
      deletedSynthetic += 1;
      continue;
    }

    if (isRealRegionalAgency(row) && hasValidUrl(row.website) && hasValidUrl(row.source_url)) {
      promoteStmt.run(today, now, row.id);
      promoted += 1;
      continue;
    }

    if (!hasValidUrl(row.website) || !hasValidUrl(row.source_url)) note('invalid_url');
    else note('other');
  }
});

tx();

console.log(`Promoted ${promoted} regional education agencies to verified.`);
console.log(`Deleted ${deletedSynthetic} synthetic regional education agencies.`);
console.log(JSON.stringify({ remainingByReason }, null, 2));

db.close();
