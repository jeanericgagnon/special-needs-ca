import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../ca_disability_navigator.db');

const db = new Database(dbPath);

const corrections = [
  {
    fallbackId: 'off-city-and-county-of-broomfield-co-medicaid-fallback',
    malformedId: 'off-city-andunty-of-broomfield-co-co-medicaid',
    correctId: 'off-city-and-county-of-broomfield-co-medicaid'
  },
  {
    fallbackId: 'off-st-landry-parish-la-medicaid-fallback',
    malformedId: 'off-stndry-parish-la-la-medicaid',
    correctId: 'off-st-landry-parish-la-medicaid'
  },
  {
    fallbackId: 'off-walla-walla-wa-medicaid-fallback',
    malformedId: 'off-wallalla-wa-wa-medicaid',
    correctId: 'off-walla-walla-wa-medicaid'
  }
];

try {
  db.transaction(() => {
    for (const corr of corrections) {
      // 1. Delete fallback
      const delStmt = db.prepare("DELETE FROM county_offices WHERE id = ?");
      const delInfo = delStmt.run(corr.fallbackId);
      console.log(`✓ Deleted fallback: ${corr.fallbackId} (${delInfo.changes} row)`);
      
      // 2. Check if malformed ID exists, and update/rename it to correct ID
      const selectStmt = db.prepare("SELECT * FROM county_offices WHERE id = ?");
      const malformedRow = selectStmt.get(corr.malformedId);
      if (malformedRow) {
        // Since id is primary key, we can update it directly
        const updateStmt = db.prepare("UPDATE county_offices SET id = ? WHERE id = ?");
        updateStmt.run(corr.correctId, corr.malformedId);
        console.log(`✓ Renamed malformed ID: ${corr.malformedId} -> ${corr.correctId}`);
      } else {
        console.log(`⚠️ Malformed ID not found: ${corr.malformedId}`);
      }
    }
  })();
  console.log("🎉 Database corrections completed successfully!");
} catch (e) {
  console.error("❌ Corrections transaction failed:", e.message);
  process.exit(1);
} finally {
  db.close();
}
