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

console.log('⏳ Connecting to databases...');
const db = new Database(dbPath);
const fDb = new Database(frontendDbPath);

// 1. Database schema column migration helper
const addColumn = (targetDb, tableName, columnName, columnType) => {
  try {
    const columns = targetDb.prepare(`PRAGMA table_info(${tableName})`).all().map(c => c.name);
    if (!columns.includes(columnName)) {
      targetDb.prepare(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType}`).run();
      console.log(`  ✓ Column '${columnName}' successfully added to ${tableName}.`);
    }
  } catch (err) {
    console.error(`  ⚠️ Warning migrating column ${columnName} on ${tableName}:`, err.message);
  }
};

console.log('⏳ Running column migrations on primary database...');
addColumn(db, 'program_waitlists', 'estimate_source_url', 'TEXT');
addColumn(db, 'program_waitlists', 'estimate_source_type', 'TEXT');
addColumn(db, 'program_waitlists', 'last_checked_at', 'TEXT');
addColumn(db, 'staging_scraped_waitlists', 'estimate_source_url', 'TEXT');
addColumn(db, 'staging_scraped_waitlists', 'estimate_source_type', 'TEXT');
addColumn(db, 'staging_scraped_waitlists', 'last_checked_at', 'TEXT');
addColumn(db, 'programs', 'program_type', 'TEXT');

console.log('⏳ Running column migrations on frontend database...');
addColumn(fDb, 'program_waitlists', 'estimate_source_url', 'TEXT');
addColumn(fDb, 'program_waitlists', 'estimate_source_type', 'TEXT');
addColumn(fDb, 'program_waitlists', 'last_checked_at', 'TEXT');
addColumn(fDb, 'staging_scraped_waitlists', 'estimate_source_url', 'TEXT');
addColumn(fDb, 'staging_scraped_waitlists', 'estimate_source_type', 'TEXT');
addColumn(fDb, 'staging_scraped_waitlists', 'last_checked_at', 'TEXT');
addColumn(fDb, 'programs', 'program_type', 'TEXT');

// Close frontend database connection to allow sync later
fDb.close();

// 2. Classify and add new programs
console.log('⏳ Registering/Updating Texas programs...');
const programsToInsert = [
  {
    id: 'tx-medicaid',
    name: 'Texas Medicaid & CHIP',
    description: 'Medicaid and CHIP provide healthcare coverage, therapies, and equipment for low-income families and children with disabilities.',
    who_it_is_for: 'Children, pregnant women, and people with disabilities in Texas.',
    who_might_qualify: 'Texas residents meeting HHSC income and disability criteria.',
    official_source_url: 'https://www.hhs.texas.gov/services/health',
    category: 'state',
    program_type: 'medicaid_managed_care'
  },
  {
    id: 'tx-yes',
    name: 'Texas Youth Empowerment Services (YES) Waiver',
    description: 'YES waiver provides community-based services for children with serious emotional disturbances.',
    who_it_is_for: 'Children and youth ages 3-18 with serious emotional disturbances.',
    who_might_qualify: 'Youth meeting HHSC clinical criteria for psychiatric inpatient care.',
    official_source_url: 'https://www.hhs.texas.gov/providers/individual-family-support/youth-empowerment-services-yes',
    category: 'state',
    program_type: 'behavioral_health_waiver'
  },
  {
    id: 'tx-dbmd',
    name: 'Texas Deaf-Blind with Multiple Disabilities (DBMD) Waiver',
    description: 'Provides home and community-based services for people who are deaf-blind and have another disability.',
    who_it_is_for: 'Deaf-blind individuals of all ages with multiple disabilities.',
    who_might_qualify: 'Individuals meeting intermediate care facility level of care.',
    official_source_url: 'https://www.hhs.texas.gov/providers/long-term-care-providers/deaf-blind-multiple-disabilities-dbmd',
    category: 'state',
    program_type: 'medicaid_hcbs_waiver'
  },
  {
    id: 'tx-starplus-hcbs',
    name: 'Texas STAR+PLUS HCBS Waiver',
    description: 'STAR+PLUS HCBS provides long-term service and support in a home or community setting for adults with disabilities.',
    who_it_is_for: 'Adults age 21 or older who meet nursing facility level of care.',
    who_might_qualify: 'Medicaid-eligible adults requiring nursing facility level of care.',
    official_source_url: 'https://www.hhs.texas.gov/providers/health-services-providers/starplus',
    category: 'state',
    program_type: 'medicaid_managed_care_hcbs'
  },
  {
    id: 'tx-twc-vr',
    name: 'Texas Workforce Commission Vocational Rehabilitation (VR)',
    description: 'Helps individuals with disabilities prepare for, find, or retain employment.',
    who_it_is_for: 'Individuals with documented physical or mental disabilities.',
    who_might_qualify: 'Texas residents with disabilities affecting employment.',
    official_source_url: 'https://www.twc.texas.gov/services/vocational-rehabilitation',
    category: 'state',
    program_type: 'vocational_rehabilitation'
  }
];

const updateProgramTypes = [
  { id: 'tx-hcs', type: 'medicaid_hcbs_waiver' },
  { id: 'tx-class', type: 'medicaid_hcbs_waiver' },
  { id: 'tx-txhml', type: 'medicaid_hcbs_waiver' },
  { id: 'tx-mdcp', type: 'medicaid_hcbs_waiver' },
  { id: 'tx-eci', type: 'early_intervention' },
  { id: 'tx-tea-sped', type: 'special_education' },
  { id: 'tx-able', type: 'able_program' }
];

try {
  db.transaction(() => {
    // Insert new programs
    const insertProg = db.prepare(`
      INSERT OR REPLACE INTO programs (
        id, name, description, who_it_is_for, who_might_qualify, 
        official_source_url, category, confidence_score, last_verified_date, state_id, program_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 5.0, ?, 'texas', ?)
    `);
    
    programsToInsert.forEach(p => {
      insertProg.run(p.id, p.name, p.description, p.who_it_is_for, p.who_might_qualify, p.official_source_url, p.category, lastVerifiedDate, p.program_type);
      console.log(`  ✓ Inserted program: ${p.id} (${p.program_type})`);
    });

    // Update existing programs
    const updateProg = db.prepare(`
      UPDATE programs SET program_type = ? WHERE id = ?
    `);
    
    updateProgramTypes.forEach(p => {
      updateProg.run(p.type, p.id);
      console.log(`  ✓ Updated program type for: ${p.id} -> ${p.type}`);
    });
  })();
} catch (err) {
  console.error('❌ Failed to update program classifications:', err.message);
  process.exit(1);
}

// 3. Promote Waitlists & Sources, Retain Forms in Staging
const stagedWaitlists = db.prepare(`
  SELECT * FROM staging_scraped_waitlists WHERE state_id = 'texas' AND review_status = 'pending_review'
`).all();

const stagedSources = db.prepare(`
  SELECT * FROM staging_scraped_sources WHERE state_id = 'texas' AND review_status = 'pending_review'
`).all();

const stagedForms = db.prepare(`
  SELECT * FROM staging_scraped_forms WHERE state_id = 'texas' AND review_status = 'pending_review'
`).all();

console.log(`⏳ Promoting ${stagedWaitlists.length} waitlists, ${stagedSources.length} sources, and retaining ${stagedForms.length} forms in staging...`);

let insertedWaitlists = 0;
let updatedWaitlists = 0;
let insertedSources = 0;
let updatedSources = 0;
let retainedForms = 0;
let auditLogged = 0;

try {
  db.transaction(() => {
    // A. Promote Waitlists
    for (const w of stagedWaitlists) {
      const duplicate = db.prepare('SELECT * FROM program_waitlists WHERE id = ?').get(w.suggested_target_id);
      
      if (duplicate) {
        db.prepare(`
          UPDATE program_waitlists 
          SET name = ?, status = ?, description = ?, estimate_source_url = ?, estimate_source_type = ?, last_checked_at = ?, last_scraped_at = ?
          WHERE id = ?
        `).run(w.name, w.status, w.description, w.estimate_source_url, w.estimate_source_type, w.last_checked_at, w.scraped_at, duplicate.id);
        updatedWaitlists++;
        
        db.prepare(`
          INSERT INTO staging_promotion_audit (staging_table, staging_record_id, target_table, target_record_id, promoted_at, source_url, old_value, new_value, reason)
          VALUES ('staging_scraped_waitlists', ?, 'program_waitlists', ?, ?, ?, ?, ?, 'Updated existing waitlist details')
        `).run(w.id, duplicate.id, timestamp, w.source_url, JSON.stringify(duplicate), JSON.stringify(w));
        auditLogged++;
      } else {
        db.prepare(`
          INSERT INTO program_waitlists (
            id, program_id, name, duration_label, duration_months, status, description, 
            reserve_capacity_notice, legal_deadline, last_scraped_at, 
            estimate_source_url, estimate_source_type, last_checked_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, '', '', ?, ?, ?, ?)
        `).run(
          w.suggested_target_id,
          w.program_id,
          w.name,
          w.duration_label,
          w.duration_months,
          w.status,
          w.description,
          w.scraped_at,
          w.estimate_source_url,
          w.estimate_source_type,
          w.last_checked_at
        );
        insertedWaitlists++;
        
        db.prepare(`
          INSERT INTO staging_promotion_audit (staging_table, staging_record_id, target_table, target_record_id, promoted_at, source_url, old_value, new_value, reason)
          VALUES ('staging_scraped_waitlists', ?, 'program_waitlists', ?, ?, ?, NULL, ?, 'Promoted new program waitlist')
        `).run(w.id, w.suggested_target_id, timestamp, w.source_url, JSON.stringify(w));
        auditLogged++;
      }
      
      db.prepare("UPDATE staging_scraped_waitlists SET review_status = 'auto_accepted' WHERE id = ?").run(w.id);
    }

    // B. Promote Sources
    for (const s of stagedSources) {
      const duplicate = db.prepare('SELECT * FROM sources WHERE id = ?').get(s.suggested_target_id);
      
      if (duplicate) {
        db.prepare(`
          UPDATE sources 
          SET url = ?, type = ?, confidence_rating = ?, source_url = ?, source_type = ?, 
              data_origin = ?, verification_status = ?, last_verified_date = ?, last_scraped_at = ?, confidence_score = ?
          WHERE id = ?
        `).run(s.url, s.type, s.confidence_rating, s.source_url, s.source_type, 'source_listed', 'source_listed', lastVerifiedDate, s.scraped_at, s.confidence_score, duplicate.id);
        updatedSources++;
        
        db.prepare(`
          INSERT INTO staging_promotion_audit (staging_table, staging_record_id, target_table, target_record_id, promoted_at, source_url, old_value, new_value, reason)
          VALUES ('staging_scraped_sources', ?, 'sources', ?, ?, ?, ?, ?, 'Updated existing official source URL')
        `).run(s.id, duplicate.id, timestamp, s.source_url, JSON.stringify(duplicate), JSON.stringify(s));
        auditLogged++;
      } else {
        db.prepare(`
          INSERT INTO sources (
            id, program_id, url, type, confidence_rating, source_url, source_type, 
            data_origin, verification_status, last_verified_date, last_scraped_at, confidence_score
          ) VALUES (?, ?, ?, ?, ?, ?, ?, 'source_listed', 'source_listed', ?, ?, ?)
        `).run(
          s.suggested_target_id,
          s.program_id,
          s.url,
          s.type,
          s.confidence_rating,
          s.source_url,
          s.source_type,
          lastVerifiedDate,
          s.scraped_at,
          s.confidence_score
        );
        insertedSources++;
        
        db.prepare(`
          INSERT INTO staging_promotion_audit (staging_table, staging_record_id, target_table, target_record_id, promoted_at, source_url, old_value, new_value, reason)
          VALUES ('staging_scraped_sources', ?, 'sources', ?, ?, ?, NULL, ?, 'Promoted new official program source link')
        `).run(s.id, s.suggested_target_id, timestamp, s.source_url, JSON.stringify(s));
        auditLogged++;
      }
      
      db.prepare("UPDATE staging_scraped_sources SET review_status = 'auto_accepted' WHERE id = ?").run(s.id);
    }

    // C. Retain Forms in Staging (Mark as accepted, do not write to production)
    for (const f of stagedForms) {
      db.prepare("UPDATE staging_scraped_forms SET review_status = 'auto_accepted' WHERE id = ?").run(f.id);
      retainedForms++;
      
      db.prepare(`
        INSERT INTO staging_promotion_audit (staging_table, staging_record_id, target_table, target_record_id, promoted_at, source_url, old_value, new_value, reason)
        VALUES ('staging_scraped_forms', ?, 'forms', ?, ?, ?, NULL, ?, 'Verified form and retained in staging due to schema gap')
      `).run(f.id, f.suggested_target_id, timestamp, f.source_url, JSON.stringify(f));
      auditLogged++;
    }

  })();
  console.log(`✓ Staging promotion transaction completed.`);
  console.log(`  Waitlists: Inserted ${insertedWaitlists}, Updated ${updatedWaitlists}`);
  console.log(`  Sources:   Inserted ${insertedSources}, Updated ${updatedSources}`);
  console.log(`  Forms:     Retained in Staging: ${retainedForms}`);
  console.log(`  Audit Logs Written: ${auditLogged}`);
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

console.log('🎉 Texas Phase 4 promotion sequence completed successfully!');
