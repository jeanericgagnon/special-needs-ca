import Database from 'better-sqlite3';

const db = new Database('/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/ca_disability_navigator.db');

db.transaction(() => {
  // 1. Update phone numbers from placeholder to official helpline
  const res1 = db.prepare(`
    UPDATE county_offices 
    SET phone = '(844) 640-6446' 
    WHERE county_id LIKE '%-oh' AND phone = '(800) 555-0155'
  `).run();
  console.log(`✓ Updated phone number for ${res1.changes} curated JFS offices.`);

  // 2. Standardize null evidence levels to source_listed
  const res2 = db.prepare(`
    UPDATE county_offices 
    SET evidence_level = 'source_listed' 
    WHERE county_id LIKE '%-oh' AND evidence_level IS NULL
  `).run();
  console.log(`✓ Updated evidence_level for ${res2.changes} curated JFS offices.`);
})();

db.close();
