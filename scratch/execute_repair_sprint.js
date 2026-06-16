import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../ca_disability_navigator.db');

console.log("==========================================");
console.log("🛠️ RUNNING NATIONAL INTEGRITY REPAIR SPRINT");
console.log("==========================================\n");

const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

try {
  db.transaction(() => {
    // ----------------------------------------------------
    // PHASE 1: Ohio School Districts Mock Contacts Scrub
    // ----------------------------------------------------
    console.log("Scrubbing Ohio mock school districts...");
    const ohioMockDistricts = db.prepare(`
      SELECT id FROM school_districts 
      WHERE county_id LIKE '%-oh' AND (spec_ed_contact_phone LIKE '%555%' OR website LIKE '%example.com%' OR website LIKE '%temp.com%')
    `).all();
    
    console.log(`  - Found ${ohioMockDistricts.length} mock districts in Ohio.`);
    const updateOhDistrict = db.prepare(`
      UPDATE school_districts 
      SET spec_ed_contact_phone = '', 
          spec_ed_contact_email = '', 
          website = 'https://education.ohio.gov/', 
          source_url = 'https://education.ohio.gov/', 
          verification_status = 'manual_review_required' 
      WHERE id = ?
    `);
    
    let ohUpdated = 0;
    for (const d of ohioMockDistricts) {
      updateOhDistrict.run(d.id);
      ohUpdated++;
    }
    console.log(`  - Successfully cleared and downgraded ${ohUpdated} Ohio districts.\n`);

    // ----------------------------------------------------
    // PHASE 2: New York County Offices Mock Contacts Scrub
    // ----------------------------------------------------
    console.log("Scrubbing New York mock county offices...");
    const nyMockOffices = db.prepare(`
      SELECT id FROM county_offices 
      WHERE county_id LIKE '%-ny' AND (phone LIKE '%555%' OR website LIKE '%example.com%' OR website LIKE '%temp.com%' OR website = 'https://www.state.gov/medicaid/new-york')
    `).all();
    
    console.log(`  - Found ${nyMockOffices.length} mock county offices in New York.`);
    const updateNyOffice = db.prepare(`
      UPDATE county_offices 
      SET phone = '', 
          email = '', 
          website = 'https://www.health.ny.gov/health_care/medicaid/ldss.htm', 
          source_url = 'https://www.health.ny.gov/health_care/medicaid/ldss.htm', 
          verification_status = 'manual_review_required' 
      WHERE id = ?
    `);
    
    let nyOfficesUpdated = 0;
    for (const o of nyMockOffices) {
      updateNyOffice.run(o.id);
      nyOfficesUpdated++;
    }
    console.log(`  - Successfully cleared and downgraded ${nyOfficesUpdated} New York offices.\n`);

    // ----------------------------------------------------
    // PHASE 3: New York School Districts Mock Contacts Scrub
    // ----------------------------------------------------
    console.log("Scrubbing New York mock school districts...");
    const nyMockDistricts = db.prepare(`
      SELECT id FROM school_districts 
      WHERE county_id LIKE '%-ny' AND (spec_ed_contact_phone LIKE '%555%' OR website LIKE '%example.com%' OR website LIKE '%temp.com%')
    `).all();
    
    console.log(`  - Found ${nyMockDistricts.length} mock school districts in New York.`);
    const updateNyDistrict = db.prepare(`
      UPDATE school_districts 
      SET spec_ed_contact_phone = '', 
          spec_ed_contact_email = '', 
          website = 'https://www.nysed.gov/special-education', 
          source_url = 'https://www.nysed.gov/special-education', 
          verification_status = 'manual_review_required' 
      WHERE id = ?
    `);
    
    let nyDistrictsUpdated = 0;
    for (const d of nyMockDistricts) {
      updateNyDistrict.run(d.id);
      nyDistrictsUpdated++;
    }
    console.log(`  - Successfully cleared and downgraded ${nyDistrictsUpdated} New York school districts.\n`);

    // ----------------------------------------------------
    // PHASE 4: 41 Upgraded States Mock Seeds Scrub (exactly 2 per state)
    // ----------------------------------------------------
    console.log("Scrubbing mock seeds in other upgraded states...");
    const otherMockDistricts = db.prepare(`
      SELECT sd.id, sd.county_id 
      FROM school_districts sd
      JOIN counties c ON sd.county_id = c.id
      WHERE c.state_id NOT IN ('california', 'new-york', 'ohio') 
        AND (sd.spec_ed_contact_phone LIKE '%555%' OR sd.website LIKE '%school-districts.edu%' OR sd.website LIKE '%example.com%')
    `).all();
    
    console.log(`  - Found ${otherMockDistricts.length} mock seed districts across other states.`);
    
    const findStateDirectoryUrl = db.prepare(`
      SELECT website 
      FROM school_districts 
      WHERE county_id LIKE ? 
        AND website IS NOT NULL 
        AND website != '' 
        AND website NOT LIKE '%school-districts.edu%' 
        AND website NOT LIKE '%example.com%'
      LIMIT 1
    `);
    
    const updateOtherDistrict = db.prepare(`
      UPDATE school_districts 
      SET spec_ed_contact_phone = '', 
          spec_ed_contact_email = '', 
          website = ?, 
          source_url = ?, 
          verification_status = 'manual_review_required' 
      WHERE id = ?
    `);
    
    let otherUpdated = 0;
    for (const d of otherMockDistricts) {
      // Find state code
      const parts = d.county_id.split('-');
      const stateCode = parts[parts.length - 1]; // e.g. al, ak
      
      // Look up official state board URL
      const fallbackUrlRow = findStateDirectoryUrl.get(`%-${stateCode}`);
      const officialUrl = fallbackUrlRow ? fallbackUrlRow.website : `https://www.state.gov/education`; // safe default if somehow not found
      
      updateOtherDistrict.run(officialUrl, officialUrl, d.id);
      otherUpdated++;
    }
    console.log(`  - Successfully cleared and downgraded ${otherUpdated} seed districts.\n`);

    // ----------------------------------------------------
    // PHASE 5: Delete Empty/Generic Nonprofits (84 records)
    // ----------------------------------------------------
    console.log("Deleting generic empty nonprofit templates...");
    const deleteNonprofits = db.prepare(`
      DELETE FROM nonprofit_organizations 
      WHERE name LIKE '%Special Needs Support Network%'
    `);
    
    const info = deleteNonprofits.run();
    console.log(`  - Successfully deleted ${info.changes} empty nonprofit template records.\n`);
    
    console.log("🎉 All database integrity repairs completed successfully.");
  })();
} catch (e) {
  console.error("❌ Error running repair sprint transaction:", e.message);
  process.exit(1);
} finally {
  db.close();
}
