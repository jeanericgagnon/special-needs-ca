import Database from 'better-sqlite3';

const db = new Database('/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/ca_disability_navigator.db');
try {
  const columns = db.prepare("PRAGMA table_info(staging_scraped_school_districts)").all();
  console.log("Table: staging_scraped_school_districts");
  columns.forEach(col => console.log(`  - ${col.name} (${col.type})`));
} catch (e) {
  console.error(e.message);
}
db.close();
