import Database from 'better-sqlite3';

const mode = process.argv[2] || 'scraped';

const db = new Database('/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/ca_disability_navigator.db');
const ids = [
  'ny-ddro-nyc',
  'ny-ddro-longisland',
  'ny-ddro-hudson',
  'ny-ddro-western',
  'ny-ddro-fingerlakes',
  'ny-ddro-central',
  'ny-ddro-capital'
];

db.transaction(() => {
  const stmt = db.prepare("UPDATE state_resource_agencies SET data_origin = ? WHERE id = ?");
  for (const id of ids) {
    stmt.run(mode === 'scraped' ? 'scraped' : 'curated_seed', id);
  }
})();

console.log(`✓ Set data_origin of 7 DDRO records to: ${mode === 'scraped' ? 'scraped' : 'curated_seed'}`);

// Also verify what they are now
const check = db.prepare("SELECT id, data_origin FROM state_resource_agencies WHERE id IN (" + ids.map(id => `'${id}'`).join(',') + ")").all();
console.log(check);

db.close();
