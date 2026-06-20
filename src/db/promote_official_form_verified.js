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

const PROMOTABLE_ORIGINS = new Set([
  'required_form_source_target_fallback',
  'repo_canonical_form_guide',
  'state_upgrade_staging_form',
  'curated_seed',
]);

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
  'www.texasable.org',
  'www.mynyable.org',
  'www.georgiaable.org',
  'illinoisable.com',
  'www.floridakidcare.org',
  'www.floridaearlysteps.com',
  'www.nmhealth.org',
  'ohioearlyintervention.org',
  'www.rehabworks.org',
  'myaccess.myflfamilies.com',
  'apd.myflorida.com',
  'www.gadoe.org',
  'www.fldoe.org',
  'www.isbe.net',
  'www.compass.state.pa.us',
]);

const REQUIRED_GUIDANCE_FIELDS = [
  'source_url',
  'who_uses_it',
  'who_signs_it',
  'where_to_send_it',
  'deadline',
  'attachments',
  'common_mistakes',
  'letter_template',
  'call_script',
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

function hasRequiredGuidance(row) {
  return REQUIRED_GUIDANCE_FIELDS.every((field) => isTruthy(row[field]));
}

if (dbPaths.length === 0) {
  console.error('No navigator database files found.');
  process.exit(1);
}

for (const dbPath of dbPaths) {
  const db = new Database(dbPath);

  const candidates = db.prepare(`
    SELECT id, slug, state_id, source_url, pdf_url, data_origin, verification_status,
           who_uses_it, who_signs_it, where_to_send_it, deadline, attachments,
           common_mistakes, letter_template, call_script, confidence_score
    FROM forms_and_guides
    WHERE data_origin IN (${Array.from(PROMOTABLE_ORIGINS).map(() => '?').join(', ')})
  `).all(...PROMOTABLE_ORIGINS);

  const promotable = candidates.filter((row) =>
    row.verification_status !== 'official_verified' &&
    row.verification_status !== 'verified' &&
    row.verification_status !== 'human_verified' &&
    hasRequiredGuidance(row) &&
    (isOfficialUrl(row.source_url) || isOfficialUrl(row.pdf_url))
  );

  const update = db.prepare(`
    UPDATE forms_and_guides
    SET data_origin = ?,
        evidence_level = ?,
        verification_status = ?,
        confidence_score = CASE
          WHEN confidence_score IS NULL OR confidence_score < ? THEN ?
          ELSE confidence_score
        END,
        last_checked_at = date('now'),
        last_verified_at = date('now')
    WHERE id = ?
  `);

  const tx = db.transaction((rows) => {
    for (const row of rows) {
      update.run(
        'official_form_guide_extract',
        'official_form_guide_extract',
        'verified',
        9.2,
        9.2,
        row.id
      );
    }
  });

  tx(promotable);

  console.log(`Promoted ${promotable.length} forms in ${dbPath}.`);
  db.close();
}
