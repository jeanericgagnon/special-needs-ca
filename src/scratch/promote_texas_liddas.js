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
  WHERE state_id = 'texas' AND agency_type = 'lidda' AND review_status = 'pending_review'
`).all();

console.log(`Found ${stagedRecords.length} staged LIDDA records to promote.`);
let updatedCount = 0;
let auditLogged = 0;

try {
  db.transaction(() => {
    for (const s of stagedRecords) {
      const liddaId = s.suggested_target_id;
      
      // Fetch the existing production record
      const prodRecord = db.prepare('SELECT * FROM state_resource_agencies WHERE id = ?').get(liddaId);
      
      if (prodRecord) {
        // Protect curated_seed or human_verified records if they exist and are different
        if (prodRecord.data_origin === 'curated_seed' || prodRecord.verification_status === 'human_verified') {
          console.log(`  ℹ️ Preserving curated_seed/human_verified record for: ${liddaId}. Skipping origin overwrite.`);
          
          // Update details but keep original origin
          db.prepare(`
            UPDATE state_resource_agencies 
            SET website = ?, intake_phone = ?, agency_intake_contact = ?, confidence_score = ?, evidence_level = ?, last_verified_date = ?
            WHERE id = ?
          `).run(s.extracted_website, s.extracted_phone, s.extracted_phone, s.confidence_score, s.evidence_level, lastVerifiedDate, liddaId);
        } else {
          // General update
          db.prepare(`
            UPDATE state_resource_agencies 
            SET website = ?, intake_phone = ?, agency_intake_contact = ?, confidence_score = ?, evidence_level = ?, data_origin = ?, verification_status = ?, last_verified_date = ?
            WHERE id = ?
          `).run(
            s.extracted_website,
            s.extracted_phone,
            s.extracted_phone,
            s.confidence_score,
            s.evidence_level,
            s.source_type, // 'official_locator_derived'
            s.verification_status, // 'source_listed'
            lastVerifiedDate,
            liddaId
          );
        }

        // Log to promotion audit
        db.prepare(`
          INSERT INTO staging_promotion_audit (staging_table, staging_record_id, target_table, target_record_id, promoted_at, source_url, old_value, new_value, reason)
          VALUES ('staging_scraped_state_resource_agencies', ?, 'state_resource_agencies', ?, ?, ?, ?, ?, ?)
        `).run(
          s.id,
          liddaId,
          timestamp,
          s.source_url,
          JSON.stringify(prodRecord),
          JSON.stringify(s),
          'Updated LIDDA placeholder website and phone number with verified local contact info.'
        );
        auditLogged++;

        // Mark staging record as accepted
        db.prepare(`
          UPDATE staging_scraped_state_resource_agencies
          SET review_status = 'auto_accepted'
          WHERE id = ?
        `).run(s.id);
        
        updatedCount++;
      } else {
        console.warn(`  ⚠️ Warning: Mapped production LIDDA with ID '${liddaId}' not found. Ingesting as new...`);
        // Insert new record if it somehow doesn't exist
        db.prepare(`
          INSERT INTO state_resource_agencies (
            id, state_id, agency_type, name, counties_served, catchment_boundaries,
            website, intake_phone, early_intervention_contact, agency_intake_contact,
            eligibility_info_page, services_page, appeals_info, last_verified_date,
            source_url, source_type, data_origin, verification_status, confidence_score, evidence_level
          ) VALUES (?, 'texas', 'lidda', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'official', ?, ?, ?, ?)
        `).run(
          liddaId,
          s.extracted_name,
          s.counties_served,
          s.catchment_boundaries,
          s.extracted_website,
          s.extracted_phone,
          s.early_intervention_contact,
          s.extracted_phone,
          s.eligibility_info_page,
          s.services_page,
          s.appeals_info,
          lastVerifiedDate,
          s.source_url,
          s.source_type,
          s.verification_status,
          s.confidence_score,
          s.evidence_level
        );

        db.prepare(`
          UPDATE staging_scraped_state_resource_agencies
          SET review_status = 'auto_accepted'
          WHERE id = ?
        `).run(s.id);
        updatedCount++;
      }
    }
  })();
  console.log(`✓ Staging transactions succeeded. Promoted/Updated: ${updatedCount}, Audit Logs Written: ${auditLogged}`);
} catch (err) {
  console.error('❌ Promotion transaction failed, rolled back.', err);
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
}

console.log('🎉 Texas LIDDA contact details promotion sequence completed!');
