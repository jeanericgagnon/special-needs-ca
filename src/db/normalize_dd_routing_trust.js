import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');

const db = new Database(dbPath);

const candidates = db.prepare(`
  SELECT id, state_id, name, source_url, intake_phone, data_origin
  FROM state_resource_agencies
  WHERE verification_status IS NULL
`).all();

const safeToPromote = candidates.filter((row) =>
  row.source_url &&
  row.intake_phone &&
  row.data_origin &&
  ['official_locator_derived', 'official_directory_extract'].includes(row.data_origin)
);

const updateStmt = db.prepare(`
  UPDATE state_resource_agencies
  SET verification_status = 'source_listed',
      last_scraped_at = COALESCE(last_scraped_at, ?)
  WHERE id = ?
`);

const now = new Date().toISOString();

const tx = db.transaction(() => {
  for (const row of safeToPromote) {
    updateStmt.run(now, row.id);
  }
});

tx();

const promotedByState = safeToPromote.reduce((acc, row) => {
  acc[row.state_id] = (acc[row.state_id] || 0) + 1;
  return acc;
}, {});

console.log(`Normalized verification_status for ${safeToPromote.length} DD routing rows.`);
console.log(JSON.stringify(promotedByState, null, 2));

db.close();
