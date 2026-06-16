import Database from 'better-sqlite3';

const mode = process.argv[2] || 'scraped';

const db = new Database('/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/ca_disability_navigator.db');
const ids = [
  'ny-ed-boces-nyc',
  'ny-ed-boces-nassau',
  'ny-ed-boces-suffolk',
  'ny-ed-boces-westchester',
  'ny-ed-boces-erie',
  'ny-ed-boces-monroe',
  'ny-ed-boces-onondaga',
  'ny-ed-boces-albany'
];

db.transaction(() => {
  const stmt = db.prepare("UPDATE regional_education_agencies SET data_origin = ? WHERE id = ?");
  for (const id of ids) {
    stmt.run(mode === 'scraped' ? 'scraped' : 'curated_seed', id);
  }
})();

console.log(`✓ Set data_origin of 8 BOCES records to: ${mode === 'scraped' ? 'scraped' : 'curated_seed'}`);

// Also verify what they are now
const check = db.prepare("SELECT id, data_origin FROM regional_education_agencies WHERE id IN (" + ids.map(id => `'${id}'`).join(',') + ")").all();
console.log(check);

db.close();
