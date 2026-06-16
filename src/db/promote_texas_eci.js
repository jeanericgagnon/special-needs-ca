import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');
const frontendDbPath = path.resolve(__dirname, '../../frontend/ca_disability_navigator.db');

const timestamp = new Date().toISOString();
const lastVerifiedDate = timestamp.split('T')[0];

console.log('⏳ Connecting to database...');
const db = new Database(dbPath);

const stagedRecords = db.prepare(`
  SELECT * FROM staging_scraped_state_resource_agencies 
  WHERE state_id = 'texas' AND agency_type = 'eci' AND review_status = 'pending_review'
`).all();

console.log(`Found ${stagedRecords.length} staged ECI records to promote.`);
let insertedCount = 0;
let updatedCount = 0;
let mappingsCreated = 0;
let auditLogged = 0;

try {
  db.transaction(() => {
    for (const s of stagedRecords) {
      const eciId = s.suggested_target_id;
      
      // Extract address from extraction_notes
      let address = '';
      if (s.extraction_notes && s.extraction_notes.startsWith('Address: ')) {
        address = s.extraction_notes.substring(9).split('. ')[0];
      }
      
      // Fetch the existing production record
      const prodRecord = db.prepare('SELECT * FROM state_resource_agencies WHERE id = ?').get(eciId);
      
      if (prodRecord) {
        // Protect curated_seed or human_verified records if they exist and are different
        if (prodRecord.data_origin === 'curated_seed' || prodRecord.verification_status === 'human_verified') {
          console.log(`  ℹ️ Preserving curated_seed/human_verified record for: ${eciId}. Skipping origin overwrite.`);
          
          db.prepare(`
            UPDATE state_resource_agencies 
            SET website = ?, intake_phone = ?, agency_intake_contact = ?, early_intervention_contact = ?, confidence_score = ?, evidence_level = ?, last_verified_date = ?, office_locations = ?
            WHERE id = ?
          `).run(s.extracted_website, s.extracted_phone, s.extracted_phone, s.extracted_phone, s.confidence_score, s.evidence_level, lastVerifiedDate, address, eciId);
        } else {
          db.prepare(`
            UPDATE state_resource_agencies 
            SET website = ?, intake_phone = ?, agency_intake_contact = ?, early_intervention_contact = ?, confidence_score = ?, evidence_level = ?, data_origin = ?, verification_status = ?, last_verified_date = ?, office_locations = ?, counties_served = ?, catchment_boundaries = ?
            WHERE id = ?
          `).run(
            s.extracted_website,
            s.extracted_phone,
            s.extracted_phone,
            s.extracted_phone,
            s.confidence_score,
            s.evidence_level,
            s.source_type, // data_origin
            'source_listed', // verification_status
            lastVerifiedDate,
            address,
            s.counties_served,
            s.catchment_boundaries,
            eciId
          );
        }
        updatedCount++;
        
        // Log to promotion audit
        db.prepare(`
          INSERT INTO staging_promotion_audit (staging_table, staging_record_id, target_table, target_record_id, promoted_at, source_url, old_value, new_value, reason)
          VALUES ('staging_scraped_state_resource_agencies', ?, 'state_resource_agencies', ?, ?, ?, ?, ?, ?)
        `).run(
          s.id,
          eciId,
          timestamp,
          s.source_url,
          JSON.stringify(prodRecord),
          JSON.stringify(s),
          'Updated existing Texas ECI contractor record details.'
        );
        auditLogged++;
      } else {
        // Insert new record
        db.prepare(`
          INSERT INTO state_resource_agencies (
            id, state_id, agency_type, name, counties_served, catchment_boundaries,
            website, intake_phone, early_intervention_contact, agency_intake_contact,
            eligibility_info_page, services_page, appeals_info, office_locations, languages, last_verified_date,
            source_urls, source_url, source_type, data_origin, verification_status, confidence_score, evidence_level
          ) VALUES (?, 'texas', 'eci', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'English,Spanish', ?, ?, ?, 'official', ?, 'source_listed', ?, ?)
        `).run(
          eciId,
          s.extracted_name,
          s.counties_served,
          s.catchment_boundaries,
          s.extracted_website,
          s.extracted_phone,
          s.extracted_phone, // early_intervention_contact
          s.extracted_phone, // agency_intake_contact
          s.eligibility_info_page,
          s.services_page,
          s.appeals_info,
          address,
          lastVerifiedDate,
          s.source_url, // source_urls
          s.source_url, // source_url
          s.source_type, // data_origin
          s.confidence_score,
          s.evidence_level
        );
        insertedCount++;
        
        db.prepare(`
          INSERT INTO staging_promotion_audit (staging_table, staging_record_id, target_table, target_record_id, promoted_at, source_url, old_value, new_value, reason)
          VALUES ('staging_scraped_state_resource_agencies', ?, 'state_resource_agencies', ?, ?, ?, NULL, ?, ?)
        `).run(
          s.id,
          eciId,
          timestamp,
          s.source_url,
          JSON.stringify(s),
          'Inserted new Texas ECI contractor record.'
        );
        auditLogged++;
      }
      
      // Populate regional_center_counties mappings
      // First clean up existing mappings for this ECI program
      db.prepare('DELETE FROM regional_center_counties WHERE regional_center_id = ?').run(eciId);
      
      // Insert new mappings
      const counties = s.counties_served.split(',').map(c => c.trim());
      const insertMapping = db.prepare('INSERT INTO regional_center_counties (regional_center_id, county_id) VALUES (?, ?)');
      counties.forEach(c => {
        insertMapping.run(eciId, c);
        mappingsCreated++;
      });
      
      // Mark staging record as auto_accepted
      db.prepare(`
        UPDATE staging_scraped_state_resource_agencies
        SET review_status = 'auto_accepted'
        WHERE id = ?
      `).run(s.id);
    }
  })();
  console.log(`✓ Staging transactions succeeded. Inserted: ${insertedCount}, Updated: ${updatedCount}, Mappings Created: ${mappingsCreated}, Audit Logs Written: ${auditLogged}`);
} catch (err) {
  console.error('❌ Promotion transaction failed, rolled back.', err);
  process.exit(1);
} finally {
  db.pragma('wal_checkpoint(TRUNCATE)');
  db.close();
}

// Sync the database to frontend folder
try {
  if (fs.existsSync(frontendDbPath)) {
    fs.unlinkSync(frontendDbPath);
  }
  fs.copyFileSync(dbPath, frontendDbPath);
  console.log(`✓ Synced database to frontend: ${frontendDbPath}`);
} catch (err) {
  console.error('Error syncing frontend database:', err.message);
  process.exit(1);
}

console.log('🎉 Texas ECI promotion sequence completed successfully!');
