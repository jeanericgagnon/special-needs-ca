import Database from 'better-sqlite3';

const db = new Database('/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/ca_disability_navigator.db');
try {
  const columns = db.prepare("PRAGMA table_info(staging_scraped_regional_education_agencies)").all();
  const hasPhone = columns.some(c => c.name === 'extracted_phone');
  if (!hasPhone) {
    console.log("Adding column 'extracted_phone' to staging_scraped_regional_education_agencies...");
    db.prepare("ALTER TABLE staging_scraped_regional_education_agencies ADD COLUMN extracted_phone TEXT").run();
    console.log("Column added successfully!");
  } else {
    console.log("Column 'extracted_phone' already exists.");
  }
} catch (e) {
  console.error("Error altering table:", e.message);
}
db.close();
