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
  SELECT * FROM staging_scraped_resource_providers 
  WHERE state_id = 'texas' AND review_status = 'pending_review' AND suggested_target_table = 'resource_providers'
`).all();

console.log(`Found ${stagedRecords.length} staged clinic records to promote.`);
let insertedCount = 0;
let updatedCount = 0;
let auditLogged = 0;

try {
  db.transaction(() => {
    for (const s of stagedRecords) {
      const suggestedId = s.suggested_target_id;
      
      // 1. Check for duplicate in production by ID
      const exactDuplicate = db.prepare(`
        SELECT * FROM resource_providers 
        WHERE id = ?
      `).get(suggestedId);
      
      if (exactDuplicate) {
        if (exactDuplicate.data_origin === 'curated_seed' || exactDuplicate.verification_status === 'human_verified') {
          // Protect curated seed / human verified records: do not overwrite their status/origin
          db.prepare(`
            UPDATE resource_providers 
            SET phone = ?, address = ?, last_verified_date = ?, last_scraped_at = ?, confidence_score = ?
            WHERE id = ?
          `).run(s.extracted_phone, s.extracted_address, lastVerifiedDate, s.scraped_at, s.confidence_score, exactDuplicate.id);
          console.log(`  ℹ️ Preserved curated_seed/human_verified record for: ${exactDuplicate.id}.`);
        } else {
          // General update
          db.prepare(`
            UPDATE resource_providers 
            SET name = ?, categories = ?, phone = ?, email = ?, address = ?, 
                source_url = ?, source_type = ?, data_origin = 'hospital_university_directory', 
                verification_status = 'source_listed', last_verified_date = ?, last_scraped_at = ?, 
                confidence_score = ?, evidence_level = ?
            WHERE id = ?
          `).run(
            s.extracted_name, 
            s.categories, 
            s.extracted_phone, 
            s.extracted_email, 
            s.extracted_address, 
            s.source_url, 
            s.source_type, 
            lastVerifiedDate, 
            s.scraped_at, 
            s.confidence_score, 
            s.evidence_level,
            exactDuplicate.id
          );
        }
        updatedCount++;
        
        // Log to promotion audit
        db.prepare(`
          INSERT INTO staging_promotion_audit (staging_table, staging_record_id, target_table, target_record_id, promoted_at, source_url, old_value, new_value, reason)
          VALUES ('staging_scraped_resource_providers', ?, 'resource_providers', ?, ?, ?, ?, ?, 'Updated existing clinic details')
        `).run(s.id, exactDuplicate.id, timestamp, s.source_url, JSON.stringify(exactDuplicate), JSON.stringify(s));
        auditLogged++;
        
      } else {
        // 2. Insert new clinic record
        db.prepare(`
          INSERT INTO resource_providers (
            id, name, categories, county_id, phone, email, address, accepts_medi_cal, 
            regional_center_vendor_ids, source_url, source_type, data_origin, 
            verification_status, last_verified_date, last_scraped_at, confidence_score, evidence_level
          ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, '', ?, ?, 'hospital_university_directory', 'source_listed', ?, ?, ?, ?)
        `).run(
          suggestedId,
          s.extracted_name,
          s.categories,
          s.county_id,
          s.extracted_phone,
          s.extracted_email,
          s.extracted_address,
          s.source_url,
          s.source_type,
          lastVerifiedDate,
          s.scraped_at,
          s.confidence_score,
          s.evidence_level
        );
        insertedCount++;
        
        db.prepare(`
          INSERT INTO staging_promotion_audit (staging_table, staging_record_id, target_table, target_record_id, promoted_at, source_url, old_value, new_value, reason)
          VALUES ('staging_scraped_resource_providers', ?, 'resource_providers', ?, ?, ?, NULL, ?, 'Promoted new hospital/university developmental clinic')
        `).run(s.id, suggestedId, timestamp, s.source_url, JSON.stringify(s));
        auditLogged++;
      }
      
      // 3. Mark staging record as auto_accepted
      db.prepare(`
        UPDATE staging_scraped_resource_providers
        SET review_status = 'auto_accepted'
        WHERE id = ?
      `).run(s.id);
    }
  })();
  console.log(`✓ Staging promotion transaction completed. Inserted: ${insertedCount}, Updated: ${updatedCount}, Audit Logs Written: ${auditLogged}`);
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

console.log('🎉 Texas clinics promotion sequence completed successfully!');
