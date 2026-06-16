import Database from 'better-sqlite3';

function checkDb(path) {
  console.log(`Checking integrity of ${path}...`);
  try {
    const db = new Database(path);
    const result = db.prepare("PRAGMA integrity_check").all();
    console.log("  Result:", result);
    db.close();
  } catch (e) {
    console.error(`  Failed to check: ${e.message}`);
  }
}

checkDb('/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/ca_disability_navigator.db');
checkDb('/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/frontend/ca_disability_navigator.db');
