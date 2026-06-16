import Database from 'better-sqlite3';

const db = new Database('/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/ca_disability_navigator.db');
const columns = db.prepare("PRAGMA table_info(staging_scraped_regional_education_agencies)").all();
console.log("NOT NULL columns in staging_scraped_regional_education_agencies:");
columns.forEach(col => {
  if (col.notnull) {
    console.log(`  - ${col.name} (${col.type})`);
  }
});
db.close();
