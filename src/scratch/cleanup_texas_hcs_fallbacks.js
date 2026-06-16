import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');
const frontendDbPath = path.resolve(__dirname, '../../frontend/ca_disability_navigator.db');

const timestamp = new Date().toISOString();

console.log('⏳ Connecting to database...');
const db = new Database(dbPath);

// Find fallbacks to delete
const fallbacksToDelete = db.prepare(`
  SELECT * FROM county_offices 
  WHERE program_id = 'tx-hcs' AND data_origin = 'programmatic_fallback'
`).all();

console.log(`Found ${fallbacksToDelete.length} incorrect HCS county fallback records to clean up.`);

if (fallbacksToDelete.length === 0) {
  console.log('No records to delete. Exiting.');
  db.close();
  process.exit(0);
}

let deletedCount = 0;
let auditLogged = 0;

try {
  db.transaction(() => {
    for (const record of fallbacksToDelete) {
      // 1. Delete from county_offices
      db.prepare('DELETE FROM county_offices WHERE id = ?').run(record.id);
      deletedCount++;

      // 2. Log to staging_promotion_audit
      db.prepare(`
        INSERT INTO staging_promotion_audit (
          staging_table, staging_record_id, target_table, target_record_id, 
          promoted_at, source_url, old_value, new_value, reason
        ) VALUES (
          'county_offices', 0, 'county_offices', ?, 
          ?, ?, ?, NULL, ?
        )
      `).run(
        record.id,
        timestamp,
        record.source_url || 'https://www.hhs.texas.gov',
        JSON.stringify(record),
        'Removed incorrect county-level HCS office fallback. Routing is replaced by regional LIDDA state resource agencies.'
      );
      auditLogged++;
    }
  })();
  
  console.log(`✓ Cleanup transaction succeeded. Deleted: ${deletedCount}, Audit Logs Written: ${auditLogged}`);
} catch (err) {
  console.error('❌ Cleanup transaction failed, rolled back.', err);
  db.close();
  process.exit(1);
} finally {
  db.pragma('wal_checkpoint(TRUNCATE)');
  db.close();
}

// Sync the database to frontend folder
try {
  if (fs.existsSync(frontendDbPath)) {
    fs.unlinkSync(frontendDbPath);
  }
  fs.copyFileSync(dbPath, frontendDbPath);
  console.log(`✓ Synced database to frontend: ${frontendDbPath}`);
} catch (err) {
  console.error('Error syncing frontend database:', err.message);
}

console.log('🎉 Texas HCS routing cleanup completed!');
