import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');
const db = new Database(dbPath);

console.log('Running staging promotion engine against:', dbPath);

const timestamp = new Date().toISOString();

// Helper to generate a unique string ID
function slugify(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// 1. Promote County Offices
function promoteCountyOffices() {
  const records = db.prepare(`
    SELECT * FROM staging_scraped_county_offices 
    WHERE review_status = 'pending_review' OR review_status IS NULL
  `).all();

  console.log(`Auditing ${records.length} staging county offices...`);
  let promoted = 0;

  for (const r of records) {
    // Check for duplicate in production or any fallback record for this county and program
    const exactDuplicate = db.prepare(`
      SELECT * FROM county_offices 
      WHERE county_id = ? AND program_id = ? AND (phone = ? OR office_name = ?)
    `).get(r.county_id, r.program_id, r.extracted_phone, r.extracted_name);

    const fallbackRecord = db.prepare(`
      SELECT * FROM county_offices 
      WHERE county_id = ? AND program_id = ? AND (data_origin = 'programmatic_fallback' OR verification_status = 'generated_county_fallback' OR data_origin = 'generated_county_fallback')
    `).get(r.county_id, r.program_id);

    const duplicate = exactDuplicate || fallbackRecord;

    if (duplicate) {
      if (duplicate.data_origin === 'programmatic_fallback' || duplicate.data_origin === 'generated_county_fallback') {
        // Upgrade/Replace the fallback record!
        db.prepare('DELETE FROM county_offices WHERE id = ?').run(duplicate.id);

        const newId = slugify(`${r.state_id}-${r.county_id}-${r.extracted_name}`);
        db.prepare(`
          INSERT INTO county_offices (id, county_id, program_id, office_name, address, phone, email, website, source_url, source_type, data_origin, verification_status, last_verified_date, confidence_score)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'scraped_live', 'source_listed', ?, ?)
        `).run(newId, r.county_id, r.program_id, r.extracted_name, r.extracted_address, r.extracted_phone, r.extracted_email, r.extracted_website, r.source_url, r.source_type, timestamp.split('T')[0], r.confidence_score);

        // Audit Trail
        db.prepare(`
          INSERT INTO staging_promotion_audit (staging_table, staging_record_id, target_table, target_record_id, promoted_at, source_url, old_value, new_value, reason)
          VALUES ('staging_scraped_county_offices', ?, 'county_offices', ?, ?, ?, ?, ?, 'Upgraded and replaced programmatic/fallback county office record')
        `).run(r.id, newId, timestamp, r.source_url, JSON.stringify(duplicate), JSON.stringify(r));

        db.prepare("UPDATE staging_scraped_county_offices SET review_status = 'auto_accepted', suggested_target_id = ? WHERE id = ?").run(newId, r.id);
        promoted++;
      } else {
        // Exists and is already explicit, mark duplicate
        db.prepare("UPDATE staging_scraped_county_offices SET review_status = 'rejected_duplicate', duplicate_candidate_id = ? WHERE id = ?").run(duplicate.id, r.id);
      }
    } else {
      // No duplicate, check confidence for auto-promotion
      const isOfficial = r.source_type && r.source_type.startsWith('official');
      if (r.confidence_score >= 0.85 && isOfficial) {
        const newId = slugify(`${r.state_id}-${r.county_id}-${r.extracted_name}`);
        db.prepare(`
          INSERT INTO county_offices (id, county_id, program_id, office_name, address, phone, email, website, source_url, source_type, data_origin, verification_status, last_verified_date, confidence_score)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'scraped_live', 'source_listed', ?, ?)
        `).run(newId, r.county_id, r.program_id, r.extracted_name, r.extracted_address, r.extracted_phone, r.extracted_email, r.extracted_website, r.source_url, r.source_type, timestamp.split('T')[0], r.confidence_score);

        db.prepare(`
          INSERT INTO staging_promotion_audit (staging_table, staging_record_id, target_table, target_record_id, promoted_at, source_url, old_value, new_value, reason)
          VALUES ('staging_scraped_county_offices', ?, 'county_offices', ?, ?, ?, NULL, ?, 'Auto-promoted high confidence official record')
        `).run(r.id, newId, timestamp, r.source_url, JSON.stringify(r));

        db.prepare("UPDATE staging_scraped_county_offices SET review_status = 'auto_accepted', suggested_target_id = ? WHERE id = ?").run(newId, r.id);
        promoted++;
      } else {
        db.prepare("UPDATE staging_scraped_county_offices SET review_status = 'needs_manual_review' WHERE id = ?").run(r.id);
      }
    }
  }
  console.log(`Promoted ${promoted} county offices.`);
}

// 2. Promote School Districts
function promoteSchoolDistricts() {
  const records = db.prepare(`
    SELECT * FROM staging_scraped_school_districts 
    WHERE review_status = 'pending_review' OR review_status IS NULL
  `).all();

  console.log(`Auditing ${records.length} staging school districts...`);
  let promoted = 0;

  for (const r of records) {
    const exactDuplicate = db.prepare(`
      SELECT * FROM school_districts 
      WHERE county_id = ? AND (name = ? OR website = ?)
    `).get(r.county_id, r.extracted_name, r.extracted_website);

    const fallbackRecord = db.prepare(`
      SELECT * FROM school_districts 
      WHERE county_id = ? AND (data_origin = 'programmatic_fallback' OR verification_status = 'generated_county_fallback' OR data_origin = 'generated_county_fallback')
    `).get(r.county_id);

    const duplicate = exactDuplicate || fallbackRecord;

    if (duplicate) {
      if (duplicate.data_origin === 'programmatic_fallback' || duplicate.data_origin === 'generated_county_fallback') {
        db.prepare('DELETE FROM school_districts WHERE id = ?').run(duplicate.id);

        const newId = slugify(`${r.state_id}-${r.county_id}-${r.extracted_name}-sd`);
        db.prepare(`
          INSERT INTO school_districts (id, county_id, name, spec_ed_contact_phone, spec_ed_contact_email, website, total_enrollment, source_url, source_type, data_origin, verification_status, last_verified_date, confidence_score)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'scraped_live', 'source_listed', ?, ?)
        `).run(newId, r.county_id, r.extracted_name, r.spec_ed_contact_phone, r.spec_ed_contact_email, r.extracted_website, r.total_enrollment, r.source_url, r.source_type, timestamp.split('T')[0], r.confidence_score);

        db.prepare(`
          INSERT INTO staging_promotion_audit (staging_table, staging_record_id, target_table, target_record_id, promoted_at, source_url, old_value, new_value, reason)
          VALUES ('staging_scraped_school_districts', ?, 'school_districts', ?, ?, ?, ?, ?, 'Upgraded and replaced fallback school district record')
        `).run(r.id, newId, timestamp, r.source_url, JSON.stringify(duplicate), JSON.stringify(r));

        db.prepare("UPDATE staging_scraped_school_districts SET review_status = 'auto_accepted', suggested_target_id = ? WHERE id = ?").run(newId, r.id);
        promoted++;
      } else {
        db.prepare("UPDATE staging_scraped_school_districts SET review_status = 'rejected_duplicate', duplicate_candidate_id = ? WHERE id = ?").run(duplicate.id, r.id);
      }
    } else {
      const isOfficial = r.source_type && r.source_type.startsWith('official');
      if (r.confidence_score >= 0.85 && isOfficial) {
        const newId = slugify(`${r.state_id}-${r.county_id}-${r.extracted_name}-sd`);
        db.prepare(`
          INSERT INTO school_districts (id, county_id, name, spec_ed_contact_phone, spec_ed_contact_email, website, total_enrollment, source_url, source_type, data_origin, verification_status, last_verified_date, confidence_score)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'scraped_live', 'source_listed', ?, ?)
        `).run(newId, r.county_id, r.extracted_name, r.spec_ed_contact_phone, r.spec_ed_contact_email, r.extracted_website, r.total_enrollment, r.source_url, r.source_type, timestamp.split('T')[0], r.confidence_score);

        db.prepare(`
          INSERT INTO staging_promotion_audit (staging_table, staging_record_id, target_table, target_record_id, promoted_at, source_url, old_value, new_value, reason)
          VALUES ('staging_scraped_school_districts', ?, 'school_districts', ?, ?, ?, NULL, ?, 'Auto-promoted high confidence school district')
        `).run(r.id, newId, timestamp, r.source_url, JSON.stringify(r));

        db.prepare("UPDATE staging_scraped_school_districts SET review_status = 'auto_accepted', suggested_target_id = ? WHERE id = ?").run(newId, r.id);
        promoted++;
      } else {
        db.prepare("UPDATE staging_scraped_school_districts SET review_status = 'needs_manual_review' WHERE id = ?").run(r.id);
      }
    }
  }
  console.log(`Promoted ${promoted} school districts.`);
}

// 3. Promote Nonprofits
function promoteNonprofits() {
  const records = db.prepare(`
    SELECT * FROM staging_scraped_nonprofit_organizations 
    WHERE review_status = 'pending_review' OR review_status IS NULL
  `).all();

  console.log(`Auditing ${records.length} staging nonprofits...`);
  let promoted = 0;

  for (const r of records) {
    const exactDuplicate = db.prepare(`
      SELECT * FROM nonprofit_organizations 
      WHERE county_id = ? AND (name = ? OR website = ?)
    `).get(r.county_id, r.extracted_name, r.extracted_website);

    const fallbackRecord = db.prepare(`
      SELECT * FROM nonprofit_organizations 
      WHERE county_id = ? AND (data_origin = 'programmatic_fallback' OR verification_status = 'generated_county_fallback' OR data_origin = 'generated_county_fallback')
    `).get(r.county_id);

    const duplicate = exactDuplicate || fallbackRecord;

    if (duplicate) {
      if (duplicate.data_origin === 'programmatic_fallback' || duplicate.data_origin === 'generated_county_fallback') {
        db.prepare('DELETE FROM nonprofit_organizations WHERE id = ?').run(duplicate.id);

        const newId = slugify(`${r.state_id}-${r.county_id}-${r.extracted_name}-np`);
        db.prepare(`
          INSERT INTO nonprofit_organizations (id, name, county_id, website, phone, focus_condition, source_url, source_type, data_origin, verification_status, last_verified_date, confidence_score)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'scraped_live', 'source_listed', ?, ?)
        `).run(newId, r.extracted_name, r.county_id, r.extracted_website, r.extracted_phone, r.focus_condition, r.source_url, r.source_type, timestamp.split('T')[0], r.confidence_score);

        db.prepare(`
          INSERT INTO staging_promotion_audit (staging_table, staging_record_id, target_table, target_record_id, promoted_at, source_url, old_value, new_value, reason)
          VALUES ('staging_scraped_nonprofit_organizations', ?, 'nonprofit_organizations', ?, ?, ?, ?, ?, 'Upgraded and replaced fallback nonprofit organization')
        `).run(r.id, newId, timestamp, r.source_url, JSON.stringify(duplicate), JSON.stringify(r));

        db.prepare("UPDATE staging_scraped_nonprofit_organizations SET review_status = 'auto_accepted', suggested_target_id = ? WHERE id = ?").run(newId, r.id);
        promoted++;
      } else {
        db.prepare("UPDATE staging_scraped_nonprofit_organizations SET review_status = 'rejected_duplicate', duplicate_candidate_id = ? WHERE id = ?").run(duplicate.id, r.id);
      }
    } else {
      if (r.confidence_score >= 0.85) {
        const newId = slugify(`${r.state_id}-${r.county_id}-${r.extracted_name}-np`);
        db.prepare(`
          INSERT INTO nonprofit_organizations (id, name, county_id, website, phone, focus_condition, source_url, source_type, data_origin, verification_status, last_verified_date, confidence_score)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'scraped_live', 'source_listed', ?, ?)
        `).run(newId, r.extracted_name, r.county_id, r.extracted_website, r.extracted_phone, r.focus_condition, r.source_url, r.source_type, timestamp.split('T')[0], r.confidence_score);

        db.prepare(`
          INSERT INTO staging_promotion_audit (staging_table, staging_record_id, target_table, target_record_id, promoted_at, source_url, old_value, new_value, reason)
          VALUES ('staging_scraped_nonprofit_organizations', ?, 'nonprofit_organizations', ?, ?, ?, NULL, ?, 'Auto-promoted high confidence nonprofit')
        `).run(r.id, newId, timestamp, r.source_url, JSON.stringify(r));

        db.prepare("UPDATE staging_scraped_nonprofit_organizations SET review_status = 'auto_accepted', suggested_target_id = ? WHERE id = ?").run(newId, r.id);
        promoted++;
      } else {
        db.prepare("UPDATE staging_scraped_nonprofit_organizations SET review_status = 'needs_manual_review' WHERE id = ?").run(r.id);
      }
    }
  }
  console.log(`Promoted ${promoted} nonprofits.`);
}

// 4. Promote IEP Advocates
function promoteIEPAdvocates() {
  const records = db.prepare(`
    SELECT * FROM staging_scraped_iep_advocates 
    WHERE review_status = 'pending_review' OR review_status IS NULL
  `).all();

  console.log(`Auditing ${records.length} staging IEP advocates...`);
  let promoted = 0;

  for (const r of records) {
    const duplicate = db.prepare(`
      SELECT * FROM iep_advocates 
      WHERE name = ? AND (phone = ? OR email = ?)
    `).get(r.extracted_name, r.extracted_phone, r.extracted_email);

    if (duplicate) {
      db.prepare("UPDATE staging_scraped_iep_advocates SET review_status = 'rejected_duplicate', duplicate_candidate_id = ? WHERE id = ?").run(duplicate.id, r.id);
    } else {
      // Providers are NEVER auto-promoted directly without manual oversight! Stricter review rules.
      db.prepare("UPDATE staging_scraped_iep_advocates SET review_status = 'needs_manual_review' WHERE id = ?").run(r.id);
    }
  }
  console.log(`Processed IEP advocates. Promoted: ${promoted} (providers require strict manual review).`);
}

// Run updates
try {
  db.transaction(() => {
    promoteCountyOffices();
    promoteSchoolDistricts();
    promoteNonprofits();
    promoteIEPAdvocates();
  })();
  console.log('✓ Staging promotion transactions completed successfully.');
} catch (err) {
  console.error('Promotion transaction failed, rolled back.', err);
}

db.close();
