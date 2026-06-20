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

const TABLES = ['resource_providers', 'nonprofit_organizations', 'iep_advocates'];

function updateUnknown(table) {
  return db.prepare(`
    UPDATE ${table}
    SET availability_status = 'unknown'
    WHERE checked_at IS NOT NULL
      AND TRIM(checked_at) <> ''
      AND source_url IS NOT NULL
      AND TRIM(source_url) <> ''
      AND verification_status IN ('official_verified','verified','human_verified','source_listed')
      AND (availability_status IS NULL OR TRIM(availability_status) = '')
      AND (waitlist_status IS NULL OR TRIM(waitlist_status) = '')
      AND (capacity_notes IS NULL OR TRIM(capacity_notes) = '')
      AND (funding_status IS NULL OR TRIM(funding_status) = '')
      AND accepting_new_clients IS NULL
  `).run().changes;
}

const tx = db.transaction(() => {
  const changes = Object.fromEntries(TABLES.map((table) => [table, updateUnknown(table)]));
  return changes;
});

const result = tx();
db.pragma('wal_checkpoint(TRUNCATE)');
db.close();

if (fs.existsSync(frontendDbPath)) {
  fs.copyFileSync(dbPath, frontendDbPath);
}

console.log(JSON.stringify({
  message: 'Backfilled explicit unknown availability for checked trusted directory rows',
  ...result,
}, null, 2));
