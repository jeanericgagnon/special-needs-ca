import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'ca_disability_navigator.db');
const db = new Database(dbPath);

try {
  db.transaction(() => {
    // Update state_resource_agencies
    const stmt1 = db.prepare(`
      UPDATE state_resource_agencies
      SET evidence_level = 'official_locator_derived'
      WHERE state_id = 'illinois' AND (evidence_level IS NULL OR evidence_level = '')
    `);
    const info1 = stmt1.run();
    console.log(`✓ Updated evidence_level for ${info1.changes} state resource agencies.`);

    // Update regional_education_agencies
    const stmt2 = db.prepare(`
      UPDATE regional_education_agencies
      SET evidence_level = 'official_locator_derived'
      WHERE state_id = 'illinois' AND (evidence_level IS NULL OR evidence_level = '')
    `);
    const info2 = stmt2.run();
    console.log(`✓ Updated evidence_level for ${info2.changes} regional education agencies.`);

    // Update nonprofit_organizations
    const stmt3 = db.prepare(`
      UPDATE nonprofit_organizations
      SET evidence_level = 'source_listed'
      WHERE county_id LIKE '%-il' AND (evidence_level IS NULL OR evidence_level = '')
    `);
    const info3 = stmt3.run();
    console.log(`✓ Updated evidence_level for ${info3.changes} nonprofits.`);
  })();
  console.log('🎉 Evidence levels populated successfully!');
} catch (e) {
  console.error('❌ Transaction failed:', e.message);
  process.exit(1);
} finally {
  db.close();
}
