import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');

const db = new Database(dbPath);

const targets = db.prepare(`
  SELECT id, source_url, website, phone, email
  FROM iep_advocates
  WHERE data_origin = 'curated_seed'
    AND verification_status IN ('verified', 'source_listed', 'official_verified', 'human_verified')
    AND source_url IS NOT NULL
    AND source_url != ''
`).all();

function isSuspiciousSourceUrl(sourceUrl = '') {
  return (
    /^https:\/\/www\.advocate\./.test(sourceUrl) ||
    /^https:\/\/www\.therapy\./.test(sourceUrl) ||
    /^https:\/\/www\.legal\./.test(sourceUrl) ||
    /^https:\/\/www\.pediatrictherapy\./.test(sourceUrl) ||
    /^https:\/\/www\.[a-z]{2}-pa\.org(?:\/|$)/.test(sourceUrl)
  );
}

function lacksDirectPublicContact(row) {
  const phone = row.phone || '';
  const email = row.email || '';
  const website = row.website || '';

  return (!phone || phone.includes('(555)')) && !email && !website;
}

const suspiciousTargets = targets.filter((row) => (
  lacksDirectPublicContact(row) || isSuspiciousSourceUrl(row.source_url || '')
));

const updateStmt = db.prepare(`
  UPDATE iep_advocates
  SET verification_status = 'manual_review_required',
      last_scraped_at = COALESCE(last_scraped_at, ?)
  WHERE id = ?
`);

const now = new Date().toISOString();

const tx = db.transaction(() => {
  for (const row of suspiciousTargets) {
    updateStmt.run(now, row.id);
  }
});

tx();

console.log(`Downgraded ${suspiciousTargets.length} curated-seed advocate/provider rows to manual_review_required.`);

db.close();
