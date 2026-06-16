import Database from 'better-sqlite3';

const mode = process.argv[2] || 'scraped';

const db = new Database('/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/ca_disability_navigator.db');
const ids = [
  'off-cuyahoga-oh-medicaid',
  'off-franklin-oh-medicaid',
  'off-hamilton-oh-medicaid',
  'off-lucas-oh-medicaid',
  'off-montgomery-oh-medicaid',
  'off-stark-oh-medicaid',
  'off-summit-oh-medicaid'
];

db.transaction(() => {
  const stmt = db.prepare("UPDATE county_offices SET data_origin = ? WHERE id = ?");
  for (const id of ids) {
    stmt.run(mode === 'scraped' ? 'scraped' : 'curated_seed', id);
  }
})();

console.log(`✓ Set data_origin of 7 JFS records to: ${mode === 'scraped' ? 'scraped' : 'curated_seed'}`);

// Also verify what they are now
const check = db.prepare("SELECT id, data_origin FROM county_offices WHERE id IN (" + ids.map(id => `'${id}'`).join(',') + ")").all();
console.log(check);

db.close();
