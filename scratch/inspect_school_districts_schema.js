import Database from 'better-sqlite3';

const db = new Database('/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/ca_disability_navigator.db');
const columns = db.prepare("PRAGMA table_info(school_districts)").all();
console.log("Columns in school_districts:", columns);

const indexes = db.prepare("PRAGMA index_list(school_districts)").all();
console.log("Indexes on school_districts:", indexes);

for (const idx of indexes) {
  const info = db.prepare(`PRAGMA index_info(${idx.name})`).all();
  console.log(`Index Info for ${idx.name}:`, info);
}

// Check how many school districts are currently in Franklin County (Ohio) as a sample
const sample = db.prepare("SELECT count(*) as c FROM school_districts WHERE county_id = 'franklin-oh'").get().c;
console.log(`Franklin County districts count: ${sample}`);

db.close();
