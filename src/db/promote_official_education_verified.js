import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPaths = [
  path.join(repoRoot, 'ca_disability_navigator.db'),
  path.join(repoRoot, 'frontend', 'ca_disability_navigator.db'),
].filter((dbPath) => fs.existsSync(dbPath));

const MIN_PROMOTION_CONFIDENCE = 4;
const PROMOTABLE_SOURCE_TYPES = new Set([
  'official',
  'official_directory',
]);

const SPECIAL_HOSTS = new Set([
  'www.education.pa.gov',
  'www.fdlrs.org',
  'www.fdlrsmicco.org',
]);

function isTruthy(value) {
  return value !== null && value !== undefined && String(value).trim() !== '';
}

function parseHostname(urlValue) {
  if (!isTruthy(urlValue)) return null;
  try {
    return new URL(String(urlValue)).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function isSpecialOfficialEducationHost(row) {
  const hostnames = [parseHostname(row.source_url), parseHostname(row.website)].filter(Boolean);
  return hostnames.some((hostname) =>
    SPECIAL_HOSTS.has(hostname) ||
    hostname.endsWith('coe.org') ||
    hostname.endsWith('selpa.org') ||
    hostname.endsWith('selpa.net')
  );
}

if (dbPaths.length === 0) {
  console.error('No navigator database files found.');
  process.exit(1);
}

for (const dbPath of dbPaths) {
  const db = new Database(dbPath);

  const candidates = db.prepare(`
    SELECT id, source_type, source_url, website, data_origin, verification_status, confidence_score
    FROM school_districts
    WHERE data_origin = 'regional_education_fallback'
      AND verification_status IN ('verified', 'official_verified')
  `).all();

  const promotable = candidates.filter((row) =>
    PROMOTABLE_SOURCE_TYPES.has(row.source_type || '') &&
    (
      Number(row.confidence_score || 0) >= MIN_PROMOTION_CONFIDENCE ||
      isSpecialOfficialEducationHost(row)
    ) &&
    (isTruthy(row.source_url) || isTruthy(row.website))
  );

  const update = db.prepare(`
    UPDATE school_districts
    SET data_origin = 'official_directory_extract',
        evidence_level = 'official_directory_extract',
        confidence_score = CASE
          WHEN confidence_score IS NULL OR confidence_score < ? THEN ?
          ELSE confidence_score
        END,
        last_verified_date = COALESCE(last_verified_date, date('now'))
    WHERE id = ?
  `);

  const tx = db.transaction((rows) => {
    for (const row of rows) {
      update.run(4, 4, row.id);
    }
  });

  tx(promotable);
  console.log(`Promoted ${promotable.length} education rows in ${dbPath}.`);
  db.close();
}
