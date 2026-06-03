import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const navigatorDbPath = path.resolve(__dirname, '../../frontend/ca_disability_navigator.db');
const crawlerDbPath = path.resolve(__dirname, '../../frontend/ca_disability_crawler.db');

function auditNavigator() {
  console.log("=== Auditing Navigator Database ===");
  try {
    const db = new Database(navigatorDbPath, { readonly: true });
    
    // Get all tables
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log(`Found ${tables.length} tables in Navigator DB:`);
    
    for (const t of tables) {
      const countResult = db.prepare(`SELECT COUNT(*) as count FROM "${t.name}"`).get();
      console.log(`  - ${t.name}: ${countResult.count} rows`);
    }
    
    // Integrity check
    console.log("\nRunning integrity check...");
    const integrity = db.prepare("PRAGMA integrity_check;").get();
    console.log(`Integrity Check Result: ${integrity['integrity_check']}`);
    
    // Foreign key check
    console.log("\nRunning foreign key check...");
    const fkCheck = db.prepare("PRAGMA foreign_key_check;").all();
    if (fkCheck.length === 0) {
      console.log("Foreign Key Check: Passed (no violations)");
    } else {
      console.log(`Foreign Key Check: Failed (${fkCheck.length} violations found)`);
      console.log(JSON.stringify(fkCheck, null, 2));
    }
    
    db.close();
  } catch (err) {
    console.error("Navigator audit error:", err.message);
  }
}

function auditCrawler() {
  console.log("\n=== Auditing Crawler Database ===");
  try {
    const db = new Database(crawlerDbPath, { readonly: true });
    
    // Get all tables
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log(`Found ${tables.length} tables in Crawler DB:`);
    
    for (const t of tables) {
      const countResult = db.prepare(`SELECT COUNT(*) as count FROM "${t.name}"`).get();
      console.log(`  - ${t.name}: ${countResult.count} rows`);
    }
    
    db.close();
  } catch (err) {
    console.error("Crawler audit error:", err.message);
  }
}

auditNavigator();
auditCrawler();
