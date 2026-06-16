import Database from 'better-sqlite3';

const mode = process.argv[2] || 'scraped';

const db = new Database('/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/ca_disability_navigator.db');

const suffixes = ['-pa', '-il', '-ga', '-nc'];

db.transaction(() => {
  const stmt = db.prepare("UPDATE county_offices SET data_origin = ? WHERE county_id LIKE ? AND data_origin = ?");
  for (const suf of suffixes) {
    stmt.run(mode === 'scraped' ? 'scraped' : 'curated_seed', `%${suf}`, mode === 'scraped' ? 'curated_seed' : 'scraped');
  }
})();

console.log(`✓ Toggled data_origin of Wave A JFS records to: ${mode}`);

// Verify
const counts = db.prepare("SELECT count(*) as c, data_origin FROM county_offices WHERE (county_id LIKE '%-pa' OR county_id LIKE '%-il' OR county_id LIKE '%-ga' OR county_id LIKE '%-nc') GROUP BY data_origin").all();
console.log("Current statuses:", counts);

db.close();
