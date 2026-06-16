import Database from 'better-sqlite3';

const mode = process.argv[2] || 'scraped';

const db = new Database('/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/ca_disability_navigator.db');
const ids = [
  'oh-ed-esc-franklin',
  'oh-ed-esc-cuyahoga',
  'oh-ed-esc-hamilton',
  'oh-ed-esc-summit',
  'oh-ed-esc-montgomery',
  'oh-ed-esc-lucas',
  'oh-ed-esc-stark'
];

db.transaction(() => {
  const stmt = db.prepare("UPDATE regional_education_agencies SET data_origin = ? WHERE id = ?");
  for (const id of ids) {
    stmt.run(mode === 'scraped' ? 'scraped' : 'curated_seed', id);
  }
})();

console.log(`✓ Set data_origin of 7 ESC records to: ${mode === 'scraped' ? 'scraped' : 'curated_seed'}`);

// Also verify what they are now
const check = db.prepare("SELECT id, data_origin FROM regional_education_agencies WHERE id IN (" + ids.map(id => `'${id}'`).join(',') + ")").all();
console.log(check);

db.close();
