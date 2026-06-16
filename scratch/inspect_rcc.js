import Database from 'better-sqlite3';

const db = new Database('/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/ca_disability_navigator.db');
try {
  const columns = db.prepare("PRAGMA table_info(regional_center_counties)").all();
  console.log("Table: regional_center_counties");
  columns.forEach(col => console.log(`  - ${col.name} (${col.type})`));
} catch (e) {
  console.error(e.message);
}
db.close();
