import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../ca_disability_navigator.db');

const db = new Database(dbPath);

const wave1States = [
  'delaware', 'hawaii', 'rhode-island', 'connecticut', 'new-hampshire',
  'vermont', 'massachusetts', 'arizona', 'maine', 'nevada', 'alaska'
];

try {
  db.transaction(() => {
    let totalDeleted = 0;
    for (const stateId of wave1States) {
      const stateRecord = db.prepare("SELECT code FROM states WHERE id = ?").get(stateId);
      const suffix = `-${stateRecord.code.toLowerCase()}`;
      
      const stmt = db.prepare(`
        DELETE FROM county_offices 
        WHERE county_id LIKE ? 
          AND (data_origin = 'programmatic_fallback' OR id LIKE '%-fallback')
      `);
      const info = stmt.run(`%${suffix}`);
      totalDeleted += info.changes;
      console.log(`✓ Deleted ${info.changes} fallback county offices for ${stateId.toUpperCase()}`);
    }
    console.log(`🎉 Total deleted fallback offices across Wave 1: ${totalDeleted}`);
  })();
} catch (e) {
  console.error("❌ Cleanup transaction failed:", e.message);
  process.exit(1);
} finally {
  db.close();
}
