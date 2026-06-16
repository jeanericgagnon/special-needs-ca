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
  SELECT * FROM staging_scraped_nonprofit_organizations 
  WHERE county_id LIKE '%-tx' AND review_status = 'pending_review'
`).all();

console.log(`Found ${stagedRecords.length} staged nonprofit records to promote.`);
let insertedCount = 0;
let updatedCount = 0;
let fallbacksDeleted = 0;
let auditLogged = 0;

try {
  db.transaction(() => {
    for (const s of stagedRecords) {
      const suggestedId = s.suggested_target_id;
      
      // 1. Check for exact duplicate in production (same county and name/website)
      const exactDuplicate = db.prepare(`
        SELECT * FROM nonprofit_organizations 
        WHERE county_id = ? AND (name = ? OR website = ?)
      `).get(s.county_id, s.extracted_name, s.extracted_website);
      
      if (exactDuplicate) {
        if (exactDuplicate.data_origin === 'curated_seed' || exactDuplicate.verification_status === 'human_verified') {
          // Protect curated seed / human verified records: do not overwrite their status/origin
          db.prepare(`
            UPDATE nonprofit_organizations 
            SET phone = ?, last_verified_date = ?, last_scraped_at = ?, confidence_score = ?
            WHERE id = ?
          `).run(s.extracted_phone, lastVerifiedDate, s.scraped_at, s.confidence_score, exactDuplicate.id);
          console.log(`  ℹ️ Preserved curated_seed/human_verified record for duplicate: ${exactDuplicate.id}.`);
        } else {
          // General update
          db.prepare(`
            UPDATE nonprofit_organizations 
            SET phone = ?, last_verified_date = ?, last_scraped_at = ?, confidence_score = ?, data_origin = 'trusted_nonprofit_directory', verification_status = 'trusted_nonprofit_listed', evidence_level = ?
            WHERE id = ?
          `).run(s.extracted_phone, lastVerifiedDate, s.scraped_at, s.confidence_score, s.evidence_level, exactDuplicate.id);
        }
        updatedCount++;
        
        // Log to promotion audit
        db.prepare(`
          INSERT INTO staging_promotion_audit (staging_table, staging_record_id, target_table, target_record_id, promoted_at, source_url, old_value, new_value, reason)
          VALUES ('staging_scraped_nonprofit_organizations', ?, 'nonprofit_organizations', ?, ?, ?, ?, ?, 'Updated existing nonprofit details')
        `).run(s.id, exactDuplicate.id, timestamp, s.source_url, JSON.stringify(exactDuplicate), JSON.stringify(s));
        auditLogged++;
        
      } else {
        // 2. Check and delete generic fallback record for this county if it exists
        const fallbackId = `np-${s.county_id}-fallback`;
        const fallbackRecord = db.prepare('SELECT * FROM nonprofit_organizations WHERE id = ?').get(fallbackId);
        
        if (fallbackRecord) {
          db.prepare('DELETE FROM nonprofit_organizations WHERE id = ?').run(fallbackId);
          fallbacksDeleted++;
          
          db.prepare(`
            INSERT INTO staging_promotion_audit (staging_table, staging_record_id, target_table, target_record_id, promoted_at, source_url, old_value, new_value, reason)
            VALUES ('staging_scraped_nonprofit_organizations', ?, 'nonprofit_organizations', ?, ?, ?, ?, NULL, 'Deleted and replaced generic county fallback record')
          `).run(s.id, fallbackId, timestamp, s.source_url, JSON.stringify(fallbackRecord));
          auditLogged++;
        }
        
        // 3. Insert new nonprofit record
        db.prepare(`
          INSERT INTO nonprofit_organizations (
            id, name, county_id, website, phone, focus_condition, 
            source_url, source_type, data_origin, verification_status, 
            last_verified_date, last_scraped_at, confidence_score, evidence_level
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'trusted_nonprofit_directory', 'trusted_nonprofit_listed', ?, ?, ?, ?)
        `).run(
          suggestedId,
          s.extracted_name,
          s.county_id,
          s.extracted_website,
          s.extracted_phone,
          s.focus_condition,
          s.source_url,
          s.source_type, // source_type
          lastVerifiedDate,
          s.scraped_at,
          s.confidence_score,
          s.evidence_level
        );
        insertedCount++;
        
        db.prepare(`
          INSERT INTO staging_promotion_audit (staging_table, staging_record_id, target_table, target_record_id, promoted_at, source_url, old_value, new_value, reason)
          VALUES ('staging_scraped_nonprofit_organizations', ?, 'nonprofit_organizations', ?, ?, ?, NULL, ?, 'Promoted new regional/local nonprofit organization')
        `).run(s.id, suggestedId, timestamp, s.source_url, JSON.stringify(s));
        auditLogged++;
      }
      
      // 4. Mark staging record as auto_accepted
      db.prepare(`
        UPDATE staging_scraped_nonprofit_organizations
        SET review_status = 'auto_accepted'
        WHERE id = ?
      `).run(s.id);
    }
  })();
  console.log(`✓ Staging promotion transaction completed. Inserted: ${insertedCount}, Updated: ${updatedCount}, Fallbacks Deleted: ${fallbacksDeleted}, Audit Logs Written: ${auditLogged}`);
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

console.log('🎉 Texas nonprofit promotion sequence completed successfully!');
