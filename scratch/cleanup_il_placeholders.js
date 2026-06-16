import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'ca_disability_navigator.db');
const db = new Database(dbPath);

try {
  db.transaction(() => {
    // 1. Delete the 10 duplicate pilot community centers
    const deleteOffices = db.prepare("DELETE FROM county_offices WHERE id LIKE 'off-%-il-medicaid'");
    const info1 = deleteOffices.run();
    console.log(`✓ Deleted ${info1.changes} duplicate curated community offices.`);

    // 2. Delete the 7 duplicate local nonprofits with mock contact numbers
    const deleteNonprofits = db.prepare("DELETE FROM nonprofit_organizations WHERE id LIKE 'np-local-%-il'");
    const info2 = deleteNonprofits.run();
    console.log(`✓ Deleted ${info2.changes} placeholder local nonprofits.`);

    // 3. Update the 89 placeholder school districts
    const updateDistricts = db.prepare(`
      UPDATE school_districts
      SET spec_ed_contact_phone = '',
          spec_ed_contact_email = NULL,
          website = 'https://www.isbe.net/Pages/Special-Education-Programs.aspx',
          source_url = 'https://www.isbe.net/Pages/Special-Education-Programs.aspx',
          verification_status = 'manual_review_required'
      WHERE county_id LIKE '%-il' AND spec_ed_contact_phone LIKE '%555-%'
    `);
    const info3 = updateDistricts.run();
    console.log(`✓ Downgraded and cleaned contact info for ${info3.changes} placeholder school districts.`);
  })();
  console.log('🎉 Database cleanup completed and committed successfully!');
} catch (e) {
  console.error('❌ Transaction failed:', e.message);
  process.exit(1);
} finally {
  db.close();
}
