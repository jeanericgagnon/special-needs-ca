import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');
const frontendDbPath = path.resolve(__dirname, '../../frontend/ca_disability_navigator.db');

const timestamp = new Date().toISOString();

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

console.log('⏳ Starting promotion of staged Texas school districts...');

const db = new Database(dbPath);

const records = db.prepare(`
  SELECT * FROM staging_scraped_school_districts 
  WHERE state_id = 'texas' AND (review_status = 'pending_review' OR review_status IS NULL)
`).all();

console.log(`Found ${records.length} staged school districts to audit.`);
let promoted = 0;
let duplicates = 0;

try {
  db.transaction(() => {
    for (const r of records) {
      // 1. Check for exact duplicate in production (curated seed or already explicit)
      const exactDuplicate = db.prepare(`
        SELECT * FROM school_districts 
        WHERE county_id = ? AND (name = ? OR website = ?)
      `).get(r.county_id, r.extracted_name, r.extracted_website);

      // 2. Check for fallback record to delete
      const fallbackRecord = db.prepare(`
        SELECT * FROM school_districts 
        WHERE county_id = ? AND (data_origin = 'programmatic_fallback' OR data_origin = 'generated_county_fallback' OR name LIKE '%County%consolidated%')
      `).get(r.county_id);

      if (exactDuplicate) {
        if (exactDuplicate.data_origin === 'curated_seed') {
          // Keep the curated seed!
          db.prepare(`
            UPDATE staging_scraped_school_districts 
            SET review_status = 'rejected_duplicate', duplicate_candidate_id = ? 
            WHERE id = ?
          `).run(exactDuplicate.id, r.id);
          duplicates++;
        } else {
          // If exact matches exist and is not a seed, update its details
          db.prepare(`
            UPDATE school_districts 
            SET spec_ed_contact_phone = ?, spec_ed_contact_email = ?, website = ?, confidence_score = 0.75, evidence_level = 'official_locator_derived'
            WHERE id = ?
          `).run(r.spec_ed_contact_phone, r.spec_ed_contact_email, r.extracted_website, exactDuplicate.id);

          db.prepare(`
            UPDATE staging_scraped_school_districts 
            SET review_status = 'auto_accepted', suggested_target_id = ? 
            WHERE id = ?
          `).run(exactDuplicate.id, r.id);
          promoted++;
        }
      } else if (fallbackRecord) {
        // Upgrade/Replace the fallback record!
        db.prepare('DELETE FROM school_districts WHERE id = ?').run(fallbackRecord.id);

        const newId = `sd-${slugify(r.extracted_name)}`;
        db.prepare(`
          INSERT INTO school_districts (
            id, county_id, name, spec_ed_contact_phone, spec_ed_contact_email, 
            website, total_enrollment, source_url, source_type, data_origin, 
            verification_status, last_verified_date, confidence_score, evidence_level
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'official_locator_derived', 'source_listed', ?, 0.75, 'official_locator_derived')
        `).run(newId, r.county_id, r.extracted_name, r.spec_ed_contact_phone, r.spec_ed_contact_email, r.extracted_website, r.total_enrollment, r.source_url, r.source_type, timestamp.split('T')[0]);

        // Log to promotion audit log
        db.prepare(`
          INSERT INTO staging_promotion_audit (staging_table, staging_record_id, target_table, target_record_id, promoted_at, source_url, old_value, new_value, reason)
          VALUES ('staging_scraped_school_districts', ?, 'school_districts', ?, ?, ?, ?, ?, 'Upgraded and replaced fallback school district record')
        `).run(r.id, newId, timestamp, r.source_url, JSON.stringify(fallbackRecord), JSON.stringify(r));

        db.prepare(`
          UPDATE staging_scraped_school_districts 
          SET review_status = 'auto_accepted', suggested_target_id = ? 
          WHERE id = ?
        `).run(newId, r.id);
        promoted++;
      } else {
        // No exact match, and no fallback. Just insert as new
        const newId = `sd-${slugify(r.extracted_name)}`;
        db.prepare(`
          INSERT INTO school_districts (
            id, county_id, name, spec_ed_contact_phone, spec_ed_contact_email, 
            website, total_enrollment, source_url, source_type, data_origin, 
            verification_status, last_verified_date, confidence_score, evidence_level
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'official_locator_derived', 'source_listed', ?, 0.75, 'official_locator_derived')
        `).run(newId, r.county_id, r.extracted_name, r.spec_ed_contact_phone, r.spec_ed_contact_email, r.extracted_website, r.total_enrollment, r.source_url, r.source_type, timestamp.split('T')[0]);

        db.prepare(`
          UPDATE staging_scraped_school_districts 
          SET review_status = 'auto_accepted', suggested_target_id = ? 
          WHERE id = ?
        `).run(newId, r.id);
        promoted++;
      }
    }
  })();
  console.log(`✓ Staging transactions succeeded. Promoted: ${promoted}, Duplicates: ${duplicates}`);
} catch (err) {
  console.error('❌ Promotion transaction failed, rolled back.', err);
}

db.close();

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

console.log('🎉 School district promotion sequence completed!');
