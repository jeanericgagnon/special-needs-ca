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

const OFFICIAL_HOST_PATTERNS = [
  /\.gov$/i,
  /\.mil$/i,
  /\.us$/i,
  /\.state\.[a-z]{2}\.us$/i,
];

const OFFICIAL_HOST_ALLOWLIST = new Set([
  'www.ablenrc.org',
  'www.ableunited.com',
  'www.stableaccount.com',
  'www.mynyable.org',
  'www.georgiaable.org',
  'illinoisable.com',
  'www.floridakidcare.org',
  'www.floridaearlysteps.com',
  'www.stepupforstudents.org',
  'www.fdlrs.org',
  'www.rehabworks.org',
  'ohioearlyintervention.org',
  'www.isbe.net',
  'www.gadoe.org',
  'www.fldoe.org',
  'www.nmhealth.org',
  'www.hsd.state.nm.us',
  'www.compass.state.pa.us',
  'apd.myflorida.com',
  'ahca.myflorida.com',
  'myaccess.myflfamilies.com',
]);

const REQUIRED_FIELDS = [
  'name',
  'description',
  'who_it_is_for',
  'who_might_qualify',
  'last_verified_date',
];

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

function isOfficialUrl(urlValue) {
  const hostname = parseHostname(urlValue);
  if (!hostname) return false;
  if (OFFICIAL_HOST_ALLOWLIST.has(hostname)) return true;
  return OFFICIAL_HOST_PATTERNS.some((pattern) => pattern.test(hostname));
}

function hasRequiredProgramFields(row) {
  return REQUIRED_FIELDS.every((field) => isTruthy(row[field]));
}

if (dbPaths.length === 0) {
  console.error('No navigator database files found.');
  process.exit(1);
}

for (const dbPath of dbPaths) {
  const db = new Database(dbPath);

  const candidates = db.prepare(`
    SELECT id, name, description, who_it_is_for, who_might_qualify,
           official_source_url, source_url, verification_status, data_origin,
           confidence_score, last_verified_date
    FROM programs
    WHERE verification_status = 'source_listed' OR verification_status IS NULL OR TRIM(verification_status) = ''
  `).all();

  const promotable = candidates.filter((row) =>
    hasRequiredProgramFields(row) &&
    (isOfficialUrl(row.official_source_url) || isOfficialUrl(row.source_url))
  );

  const update = db.prepare(`
    UPDATE programs
    SET source_url = COALESCE(source_url, official_source_url),
        data_origin = COALESCE(data_origin, 'official_program_extract'),
        verification_status = 'verified',
        confidence_score = CASE
          WHEN confidence_score IS NULL OR confidence_score < ? THEN ?
          ELSE confidence_score
        END
    WHERE id = ?
  `);

  const tx = db.transaction((rows) => {
    for (const row of rows) {
      update.run(9.2, 9.2, row.id);
    }
  });

  tx(promotable);
  console.log(`Promoted ${promotable.length} programs in ${dbPath}.`);
  db.close();
}
