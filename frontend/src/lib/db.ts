import Database from 'better-sqlite3';
import path from 'path';

// Define DB Paths relative to next.js execution (working directory is usually the root of frontend/)
const crawlerDbPath = path.resolve(process.cwd(), 'ca_disability_crawler.db');
const navigatorDbPath = path.resolve(process.cwd(), 'ca_disability_navigator.db');

// Instantiate DB handles
const isVercel = process.env.VERCEL === '1';
const crawlerDb = new Database(crawlerDbPath, { readonly: true });
const navigatorDb = new Database(navigatorDbPath, { readonly: isVercel });

// Enable Foreign Key support in SQLite if not read-only
if (!isVercel) {
  navigatorDb.pragma('foreign_keys = ON');
}

// Initialize database schema tables if they don't exist
function runMigrations() {
  if (isVercel) return;
  navigatorDb.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    INSERT OR IGNORE INTO program_eligibility_rules 
      (id, program_id, min_age_years, max_age_years, required_condition, required_need, insurance_status, school_status, trigger_reason)
    VALUES 
      ('rule-haccp-1', 'hearing-aid-coverage', 0, 21, 'hearing-loss', 'hearing-aids', 'any', 'any', 'Hearing loss and private insurance device exclusions trigger the California HACCP waiver program to fund fitting and audiology device costs.'),
      ('rule-haccp-2', 'hearing-aid-coverage', 0, 21, 'hearing-loss', null, 'any', 'any', 'Documented hearing loss triggers potential coverage under the California HACCP waiver for pediatric hearing services.');
  `);

  // Create iep_advocates table
  navigatorDb.exec(`
    CREATE TABLE IF NOT EXISTS iep_advocates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      credentials TEXT NOT NULL,
      experience_years INTEGER NOT NULL,
      price_rate TEXT NOT NULL,
      counties_served TEXT NOT NULL,
      languages_spoken TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      website TEXT NOT NULL
    );
  `);

  // Create community_suggestions table
  navigatorDb.exec(`
    CREATE TABLE IF NOT EXISTS community_suggestions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      suggestion_type TEXT NOT NULL,
      target_id TEXT,
      submitter_name TEXT NOT NULL,
      submitter_email TEXT NOT NULL,
      details TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL
    );
  `);

  // Add school_districts columns if they do not exist
  const tableInfo = navigatorDb.prepare("PRAGMA table_info(school_districts)").all() as { name: string }[];
  const columnNames = tableInfo.map(col => col.name);
  if (!columnNames.includes('total_enrollment')) {
    navigatorDb.exec("ALTER TABLE school_districts ADD COLUMN total_enrollment INTEGER;");
  }
  if (!columnNames.includes('special_ed_pct')) {
    navigatorDb.exec("ALTER TABLE school_districts ADD COLUMN special_ed_pct REAL;");
  }
  if (!columnNames.includes('inclusion_rate_pct')) {
    navigatorDb.exec("ALTER TABLE school_districts ADD COLUMN inclusion_rate_pct REAL;");
  }
  if (!columnNames.includes('self_contained_rate_pct')) {
    navigatorDb.exec("ALTER TABLE school_districts ADD COLUMN self_contained_rate_pct REAL;");
  }

  // Seed school_districts if empty
  const countDistricts = navigatorDb.prepare("SELECT COUNT(*) as count FROM school_districts").get() as { count: number };
  if (countDistricts.count === 0) {
    const insertDistrict = navigatorDb.prepare(`
      INSERT INTO school_districts (id, county_id, name, spec_ed_contact_phone, spec_ed_contact_email, website, total_enrollment, special_ed_pct, inclusion_rate_pct, self_contained_rate_pct)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const seedDistricts = [
      ['sd-la-usd', 'los-angeles', 'Los Angeles Unified School District (LAUSD)', '(213) 241-6701', 'sp-ed-parent@lausd.net', 'https://achieve.lausd.net/sped', 540000, 14.5, 58.2, 28.5],
      ['sd-lb-usd', 'los-angeles', 'Long Beach Unified School District', '(562) 997-8000', 'sped-info@lbschools.net', 'https://www.lbschools.net', 68000, 12.8, 61.5, 22.0],
      ['sd-irvine-usd', 'orange', 'Irvine Unified School District (IUSD)', '(949) 936-5000', 'specialed@iusd.org', 'https://iusd.org', 36000, 9.8, 74.5, 15.2],
      ['sd-santa-ana-usd', 'orange', 'Santa Ana Unified School District (SAUSD)', '(714) 558-5832', 'specialed@sausd.us', 'https://sausd.us', 43000, 13.2, 52.1, 31.8],
      ['sd-sf-usd', 'san-francisco', 'San Francisco Unified School District (SFUSD)', '(415) 241-6000', 'sped@sfusd.edu', 'https://sfusd.edu', 49000, 12.5, 60.8, 24.5],
      ['sd-oakland-usd', 'alameda', 'Oakland Unified School District (OUSD)', '(510) 879-8000', 'spedinfo@ousd.org', 'https://ousd.org', 34000, 15.1, 54.3, 29.8],
      ['sd-sd-usd', 'san-diego', 'San Diego Unified School District', '(619) 725-8000', 'speced@sandi.net', 'https://sandiegounified.org', 95000, 13.0, 63.4, 20.6],
      ['sd-sj-usd', 'santa-clara', 'San Jose Unified School District', '(408) 535-6000', 'specialed@sjusd.org', 'https://sjusd.org', 28000, 11.5, 65.0, 19.5],
      ['sd-sac-usd', 'sacramento', 'Sacramento City Unified School District', '(916) 643-9000', 'sped@scusd.edu', 'https://scusd.edu', 38000, 15.4, 51.2, 32.4]
    ];

    const seedTx = navigatorDb.transaction(() => {
      for (const row of seedDistricts) {
        insertDistrict.run(...row);
      }
    });
    seedTx();
    console.log('⚡ Seeded California School Districts LRE Inclusion statistics.');
  }

  // Seed iep_advocates if empty
  const countAdvocates = navigatorDb.prepare("SELECT COUNT(*) as count FROM iep_advocates").get() as { count: number };
  if (countAdvocates.count === 0) {
    const insertAdvocate = navigatorDb.prepare(`
      INSERT INTO iep_advocates (id, name, credentials, experience_years, price_rate, counties_served, languages_spoken, phone, email, website)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const seedAdvocates = [
      ['adv-sarah', 'Sarah Jenkins, M.S.Ed.', 'Board Certified Advocate (COPAA), Former Special Ed Teacher', 15, '$150 / hour', 'los-angeles,orange', 'English', '(310) 555-0142', 'sarah@calspedadvocacy.com', 'https://calspedadvocacy.com'],
      ['adv-marisol', 'Marisol Torres', 'Bilingual IEP Consultant, Parent Advocate Coach', 10, '$120 / hour', 'los-angeles,orange,san-diego', 'English, Spanish', '(714) 555-0189', 'marisol@iep-ayuda.org', 'https://iep-ayuda.org'],
      ['adv-david', 'David Chen', 'Special Ed Law Advocate, JD (Non-practicing)', 12, '$195 / hour', 'san-francisco,alameda,santa-clara', 'English, Cantonese', '(415) 555-0211', 'dchen@bayareaiep.com', 'https://bayareaiep.com'],
      ['adv-elena', 'Elena Rostova', 'DDS/Regional Center & IEP Specialist', 8, '$110 / hour', 'sacramento,placer', 'English, Russian', '(916) 555-0273', 'elena@sacramentopedadvocate.com', 'https://sacramentopedadvocate.com'],
      ['adv-katelyn', 'Katelyn Vance, BCBA', 'Behavior Specialist, Educational Advocate', 9, '$140 / hour', 'san-diego,riverside', 'English', '(619) 555-0304', 'kvance@sandiegoiep.com', 'https://sandiegoiep.com']
    ];

    const seedTx = navigatorDb.transaction(() => {
      for (const row of seedAdvocates) {
        insertAdvocate.run(...row);
      }
    });
    seedTx();
    console.log('⚡ Seeded California IEP Special Education Advocates.');
  }

  // Create program_waitlists table
  navigatorDb.exec(`
    CREATE TABLE IF NOT EXISTS program_waitlists (
      id TEXT PRIMARY KEY,
      program_id TEXT NOT NULL,
      name TEXT NOT NULL,
      duration_label TEXT NOT NULL,
      duration_months REAL NOT NULL,
      status TEXT NOT NULL,
      description TEXT NOT NULL,
      reserve_capacity_notice TEXT,
      legal_deadline TEXT,
      last_scraped_at TEXT NOT NULL
    );
  `);

  // Seed program_waitlists if empty
  const countWaitlists = navigatorDb.prepare("SELECT COUNT(*) as count FROM program_waitlists").get() as { count: number };
  if (countWaitlists.count === 0) {
    const insertWaitlist = navigatorDb.prepare(`
      INSERT INTO program_waitlists (id, program_id, name, duration_label, duration_months, status, description, reserve_capacity_notice, legal_deadline, last_scraped_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const seedWaitlists = [
      [
        'wl-hcba',
        'hcba',
        'Home and Community-Based Alternatives (HCBA) Waiver',
        '1.5 to 2+ Years Wait',
        24,
        'critical',
        'California capped enrollment for the HCBA Waiver in July 2023. Newly submitted applications face significant wait times unless reserve capacity criteria apply.',
        'Priority intake applies to applicants under age 21 (under EPSDT rules), those transitioning from similar waivers, or those residing in health facilities for 60+ days.',
        'None (Capped waiver slots)',
        new Date().toISOString()
      ],
      [
        'wl-rc',
        'regional-centers',
        'Regional Center Lanterman Act Intake',
        '45 Days Max',
        1.5,
        'standard',
        'Initial intake and assessment to determine eligibility under the Lanterman Act (Autism, Cerebral Palsy, Intellectual Disability, Epilepsy, Fifth Category).',
        null,
        'Statutory 45-day assessment limit (Welfare & Institutions Code § 4646)',
        new Date().toISOString()
      ],
      [
        'wl-ihss',
        'ihss',
        'In-Home Supportive Services (IHSS) Processing',
        '30 Days from Medical Form',
        1,
        'standard',
        'County social workers conduct an in-home assessment of personal care and protective safety supervision needs once the SOC 873 medical form is submitted.',
        null,
        '30-day regulatory processing limit after receiving completed medical certification',
        new Date().toISOString()
      ],
      [
        'wl-ssi',
        'ssi',
        'SSI Childhood Disability Determination',
        '3 to 5 Months',
        5,
        'moderate',
        'Social Security Administration reviews household financial records and coordinates with State Disability Determination Services (DDS) to evaluate clinical eligibility.',
        null,
        'No strict statutory limit, but standard initial reviews average 120 days',
        new Date().toISOString()
      ],
      [
        'wl-ccs',
        'ccs',
        'California Children\'s Services (CCS) Medical Therapy Program',
        '30 to 45 Days',
        1.5,
        'standard',
        'CCS review of complex physical disabilities (Cerebral Palsy, Spina Bifida) for school-based physical/occupational therapies inside Medical Therapy Units.',
        null,
        '30 days for medical eligibility determination from completed application',
        new Date().toISOString()
      ]
    ];

    const seedTx = navigatorDb.transaction(() => {
      for (const row of seedWaitlists) {
        insertWaitlist.run(...row);
      }
    });
    seedTx();
    console.log('⚡ Seeded Dynamic California Program Waitlists metadata.');
  }

  // Create child_iep_accommodations table
  navigatorDb.exec(`
    CREATE TABLE IF NOT EXISTS child_iep_accommodations (
      id TEXT PRIMARY KEY,
      child_id TEXT NOT NULL,
      accommodation_id TEXT NOT NULL,
      FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE
    );
  `);

  // Create child_iep_goals table
  navigatorDb.exec(`
    CREATE TABLE IF NOT EXISTS child_iep_goals (
      id TEXT PRIMARY KEY,
      child_id TEXT NOT NULL,
      goal_template_id TEXT NOT NULL,
      custom_text TEXT NOT NULL,
      tokens_json TEXT,
      FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE
    );
  `);

  // Create child_respite_assessments table
  navigatorDb.exec(`
    CREATE TABLE IF NOT EXISTS child_respite_assessments (
      child_id TEXT PRIMARY KEY,
      safety_score INTEGER NOT NULL,
      sleep_score INTEGER NOT NULL,
      medical_score INTEGER NOT NULL,
      behavior_score INTEGER NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE
    );
  `);

  console.log('⚡ SQLite Database migrations completed successfully!');
}

runMigrations();

// Database interfaces
export interface ProgramWaitlist {
  id: string;
  program_id: string;
  name: string;
  duration_label: string;
  duration_months: number;
  status: 'critical' | 'moderate' | 'standard' | 'priority';
  description: string;
  reserve_capacity_notice: string | null;
  legal_deadline: string | null;
  last_scraped_at: string;
}

export interface IepAdvocate {
  id: string;
  name: string;
  credentials: string;
  experience_years: number;
  price_rate: string;
  counties_served: string;
  languages_spoken: string;
  phone: string;
  email: string;
  website: string;
}

export interface Program {
  id: number | string;
  source_url: string;
  program_name: string;
  target_demographic: string;
  age_limit_min: number;
  age_limit_max: number;
  income_limit: string;
  diagnosis_required: string; // JSON array string
  county_specific: string;
}

export interface County {
  id: string;
  name: string;
  website: string;
}

export interface TaxonomyCondition {
  id: string;
  name: string;
  aliases: string;
  parent_friendly_explanation: string;
  regional_center_relevance: number;
  iep_relevance: number;
  ccs_relevance: number;
  ssi_relevance: number;
  cal_able_relevance: number;
  age_specific_notes: string;
  source_url: string;
}

export interface FunctionalNeed {
  id: string;
  name: string;
  category: string;
  description: string;
  program_triggers: string;
}

export interface ChildProfile {
  id: string;
  case_id: string;
  nickname: string;
  dob: string;
  county_id: string;
  zip_code: string;
  insurance_type: string;
  school_status: string;
  language_preference: string;
  caregiver_notes: string;
  conditionIds?: string[];
  functionalNeedIds?: string[];
}

export interface ProgramStatus {
  child_id: string;
  program_id: string;
  status: string;
  updated_at: string;
}

export interface ChecklistItem {
  id: string;
  child_id: string;
  document_name: string;
  is_collected: number;
  program_id: string | null;
  file_mock_url: string | null;
}

export interface Reminder {
  id: string;
  child_id: string;
  program_id: string | null;
  title: string;
  due_date: string;
  is_completed: number;
}

// ----------------------------------------------------
// 1. Core Scraped Benefits Rules Engine
// ----------------------------------------------------

export function getProgramsByCriteria(age: number, diagnosis: string): Program[] {
  const stmt = crawlerDb.prepare(`
    SELECT * FROM structured_programs 
    WHERE 
      (age_limit_min IS NULL OR age_limit_min <= ?) AND
      (age_limit_max IS NULL OR age_limit_max >= ?) AND
      (
        diagnosis_required LIKE ? OR 
        diagnosis_required LIKE '%Disability%' OR 
        diagnosis_required LIKE '%13 IDEA Categories%'
      )
    GROUP BY program_name
    ORDER BY id ASC
    LIMIT 20
  `);
  
  const results = stmt.all(age, age, `%${diagnosis}%`);
  return results as Program[];
}

// Get all programs for a specific diagnosis without age limit, for SEO landing pages
export function getProgramsForDiagnosis(diagnosis: string): Program[] {
  const stmt = crawlerDb.prepare(`
    SELECT * FROM structured_programs 
    WHERE 
      diagnosis_required LIKE ? OR 
      diagnosis_required LIKE '%Disability%' OR 
      diagnosis_required LIKE '%13 IDEA Categories%'
    GROUP BY program_name
    ORDER BY id ASC
  `);
  
  const results = stmt.all(`%${diagnosis}%`);
  return results as Program[];
}

export interface User {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export function getUserByEmail(email: string): User | undefined {
  return navigatorDb.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase()) as User | undefined;
}

export function createUser(id: string, email: string, passwordHash: string) {
  navigatorDb.transaction(() => {
    // 1. Create credential user record
    navigatorDb.prepare(`
      INSERT INTO users (id, email, password_hash, created_at)
      VALUES (?, ?, ?, ?)
    `).run(id, email.toLowerCase(), passwordHash, new Date().toISOString());

    // 2. Add structural family case record mapped to user id
    navigatorDb.prepare(`
      INSERT INTO family_cases (id, email, created_at)
      VALUES (?, ?, ?)
    `).run(id, email.toLowerCase(), new Date().toISOString().split('T')[0]);
  })();
}

// ----------------------------------------------------
// 3. Child Profiles & Taxonomy Queries
// ----------------------------------------------------

export function getCounties(): County[] {
  return navigatorDb.prepare('SELECT * FROM counties ORDER BY name ASC').all() as County[];
}

export function getTaxonomyConditions(): TaxonomyCondition[] {
  return navigatorDb.prepare('SELECT * FROM conditions ORDER BY name ASC').all() as TaxonomyCondition[];
}

export function getFunctionalNeeds(): FunctionalNeed[] {
  return navigatorDb.prepare('SELECT * FROM functional_needs ORDER BY name ASC').all() as FunctionalNeed[];
}

export function getChildrenByUserId(userId: string): ChildProfile[] {
  const children = navigatorDb.prepare('SELECT * FROM child_profiles WHERE case_id = ?').all(userId) as ChildProfile[];
  
  for (const child of children) {
    const conds = navigatorDb.prepare('SELECT condition_id FROM child_profile_conditions WHERE child_id = ?').all(child.id) as { condition_id: string }[];
    child.conditionIds = conds.map(c => c.condition_id);

    const needs = navigatorDb.prepare('SELECT need_id FROM child_profile_needs WHERE child_id = ?').all(child.id) as { need_id: string }[];
    child.functionalNeedIds = needs.map(n => n.need_id);
  }
  return children;
}

export function createChildProfile(child: Omit<ChildProfile, 'case_id' | 'language_preference'>, userId: string) {
  navigatorDb.transaction(() => {
    // 1. Insert profile
    navigatorDb.prepare(`
      INSERT INTO child_profiles (id, case_id, nickname, dob, county_id, zip_code, insurance_type, school_status, caregiver_notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      child.id,
      userId,
      child.nickname,
      child.dob,
      child.county_id,
      child.zip_code,
      child.insurance_type,
      child.school_status,
      child.caregiver_notes
    );

    // 2. Map conditions
    if (child.conditionIds && child.conditionIds.length > 0) {
      const insCond = navigatorDb.prepare(`
        INSERT OR IGNORE INTO conditions 
        (id, name, aliases, parent_friendly_explanation, regional_center_relevance, iep_relevance, ccs_relevance, ssi_relevance, cal_able_relevance, age_specific_notes, source_url, last_verified_date)
        VALUES (?, ?, '', 'Custom diagnosis added by caregiver.', 1, 1, 1, 1, 1, 'Check general milestone guidelines.', 'User Added', ?)
      `);
      const stmt = navigatorDb.prepare('INSERT INTO child_profile_conditions (child_id, condition_id) VALUES (?, ?)');
      for (const condId of child.conditionIds) {
        const friendlyName = condId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        insCond.run(condId, friendlyName, new Date().toISOString().split('T')[0]);
        stmt.run(child.id, condId);
      }
    }

    // 3. Map functional needs
    if (child.functionalNeedIds && child.functionalNeedIds.length > 0) {
      const stmt = navigatorDb.prepare('INSERT INTO child_profile_needs (child_id, need_id) VALUES (?, ?)');
      for (const needId of child.functionalNeedIds) {
        stmt.run(child.id, needId);
      }
    }
  })();
}

export function updateChildProfile(child: Omit<ChildProfile, 'case_id' | 'language_preference'>) {
  navigatorDb.transaction(() => {
    // 1. Update basic details
    navigatorDb.prepare(`
      UPDATE child_profiles
      SET nickname = ?, dob = ?, county_id = ?, zip_code = ?, insurance_type = ?, school_status = ?, caregiver_notes = ?
      WHERE id = ?
    `).run(
      child.nickname,
      child.dob,
      child.county_id,
      child.zip_code,
      child.insurance_type,
      child.school_status,
      child.caregiver_notes,
      child.id
    );

    // 2. Clear old condition & needs maps
    navigatorDb.prepare('DELETE FROM child_profile_conditions WHERE child_id = ?').run(child.id);
    navigatorDb.prepare('DELETE FROM child_profile_needs WHERE child_id = ?').run(child.id);

    // 3. Map new conditions
    if (child.conditionIds && child.conditionIds.length > 0) {
      const insCond = navigatorDb.prepare(`
        INSERT OR IGNORE INTO conditions 
        (id, name, aliases, parent_friendly_explanation, regional_center_relevance, iep_relevance, ccs_relevance, ssi_relevance, cal_able_relevance, age_specific_notes, source_url, last_verified_date)
        VALUES (?, ?, '', 'Custom diagnosis added by caregiver.', 1, 1, 1, 1, 1, 'Check general milestone guidelines.', 'User Added', ?)
      `);
      const stmt = navigatorDb.prepare('INSERT INTO child_profile_conditions (child_id, condition_id) VALUES (?, ?)');
      for (const condId of child.conditionIds) {
        const friendlyName = condId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        insCond.run(condId, friendlyName, new Date().toISOString().split('T')[0]);
        stmt.run(child.id, condId);
      }
    }

    // 4. Map new functional needs
    if (child.functionalNeedIds && child.functionalNeedIds.length > 0) {
      const stmt = navigatorDb.prepare('INSERT INTO child_profile_needs (child_id, need_id) VALUES (?, ?)');
      for (const needId of child.functionalNeedIds) {
        stmt.run(child.id, needId);
      }
    }
  })();
}

export function deleteChildProfile(childId: string) {
  navigatorDb.prepare('DELETE FROM child_profiles WHERE id = ?').run(childId);
}

// ----------------------------------------------------
// 4. Saved Programs & Checklists
// ----------------------------------------------------

export function getSavedProgramStatuses(childId: string): ProgramStatus[] {
  return navigatorDb.prepare('SELECT * FROM case_program_statuses WHERE child_id = ?').all(childId) as ProgramStatus[];
}

export function saveProgramStatus(childId: string, programId: string, status: string) {
  const id = `status-${childId}-${programId}`;
  navigatorDb.prepare(`
    INSERT INTO case_program_statuses (id, child_id, program_id, status, updated_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(child_id, program_id) DO UPDATE SET status = ?, updated_at = ?
  `).run(id, childId, programId, status, new Date().toISOString().split('T')[0], status, new Date().toISOString().split('T')[0]);
}

export function unsaveProgram(childId: string, programId: string) {
  navigatorDb.transaction(() => {
    navigatorDb.prepare('DELETE FROM case_program_statuses WHERE child_id = ? AND program_id = ?').run(childId, programId);
    navigatorDb.prepare('DELETE FROM document_checklist_items WHERE child_id = ? AND program_id = ?').run(childId, programId);
  })();
}

export function getChecklistItems(childId: string): ChecklistItem[] {
  return navigatorDb.prepare('SELECT * FROM document_checklist_items WHERE child_id = ?').all(childId) as ChecklistItem[];
}

export function setChecklistItemCollected(childId: string, docName: string, isCollected: boolean, programId: string) {
  const id = `check-${childId}-${programId}-${docName.replace(/\s+/g, '-').toLowerCase()}`;
  const isCollVal = isCollected ? 1 : 0;
  navigatorDb.prepare(`
    INSERT INTO document_checklist_items (id, child_id, document_name, is_collected, program_id)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET is_collected = ?
  `).run(id, childId, docName, isCollVal, programId, isCollVal);
}

// ----------------------------------------------------
// 5. Reminders Queries
// ----------------------------------------------------

export function getReminders(childId: string): Reminder[] {
  return navigatorDb.prepare('SELECT * FROM reminders WHERE child_id = ? ORDER BY due_date ASC').all(childId) as Reminder[];
}

export function createReminder(reminder: Reminder) {
  navigatorDb.prepare(`
    INSERT INTO reminders (id, child_id, program_id, title, due_date, is_completed)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    reminder.id,
    reminder.child_id,
    reminder.program_id,
    reminder.title,
    reminder.due_date,
    reminder.is_completed
  );
}

export function toggleReminderCompleted(reminderId: string, isCompleted: boolean) {
  const isCompVal = isCompleted ? 1 : 0;
  navigatorDb.prepare('UPDATE reminders SET is_completed = ? WHERE id = ?').run(isCompVal, reminderId);
}

export function deleteReminder(reminderId: string) {
  navigatorDb.prepare('DELETE FROM reminders WHERE id = ?').run(reminderId);
}

// ----------------------------------------------------
// 6. Relational Routing Details (SEO & Local Dashboard)
// ----------------------------------------------------

export function getCountyDetails(countyId: string) {
  const county = navigatorDb.prepare('SELECT * FROM counties WHERE id = ?').get(countyId) as County | undefined;
  if (!county) return undefined;

  const offices = navigatorDb.prepare('SELECT * FROM county_offices WHERE county_id = ?').all(countyId) as any[];
  const districts = navigatorDb.prepare('SELECT * FROM school_districts WHERE county_id = ?').all(countyId) as any[];
  const nonprofits = navigatorDb.prepare('SELECT * FROM nonprofit_organizations WHERE county_id = ?').all(countyId) as any[];

  // Get matching Regional Centers
  // Since regional centers store a comma-separated list of county slugs in counties_served,
  // we can use a query with LIKE
  const rcs = navigatorDb.prepare('SELECT * FROM regional_centers WHERE counties_served LIKE ?').all(`%${countyId}%`) as any[];

  return {
    ...county,
    countyOffices: offices,
    schoolDistricts: districts,
    localOrganizations: nonprofits,
    regionalCenters: rcs
  };
}

export function getProgramDocumentRequirements(programId: string) {
  return navigatorDb.prepare('SELECT * FROM program_document_requirements WHERE program_id = ?').all(programId) as any[];
}

export function getProgramApplicationSteps(programId: string) {
  return navigatorDb.prepare('SELECT * FROM program_application_steps WHERE program_id = ? ORDER BY step_number ASC').all(programId) as any[];
}

export function getProgramAppealInfo(programId: string) {
  return navigatorDb.prepare('SELECT * FROM program_appeal_info WHERE program_id = ?').get(programId) as any;
}

export function getMatchedCorePrograms(age: number, conditionIds: string[], needIds: string[]): any[] {
  let querySql = `
    SELECT r.*, p.name, p.description, p.who_it_is_for, p.who_might_qualify, p.official_source_url, p.category, p.last_verified_date
    FROM program_eligibility_rules r
    JOIN programs p ON r.program_id = p.id
    WHERE ? >= r.min_age_years AND ? <= r.max_age_years
  `;
  
  const params: any[] = [age, age];

  if (conditionIds.length > 0) {
    const placeholders = conditionIds.map(() => '?').join(',');
    querySql += ` AND (r.required_condition IS NULL OR r.required_condition IN (${placeholders}))`;
    params.push(...conditionIds);
  } else {
    querySql += ` AND r.required_condition IS NULL`;
  }

  if (needIds.length > 0) {
    const placeholders = needIds.map(() => '?').join(',');
    querySql += ` AND (r.required_need IS NULL OR r.required_need IN (${placeholders}))`;
    params.push(...needIds);
  } else {
    querySql += ` AND r.required_need IS NULL`;
  }

  // Deduplicate on program name/id
  querySql += ` GROUP BY p.id`;

  try {
    const matchedRules = navigatorDb.prepare(querySql).all(...params) as any[];
    
    // Enrich with document requirements, steps, and appeal info
    return matchedRules.map(rule => {
      const docs = getProgramDocumentRequirements(rule.program_id);
      const steps = getProgramApplicationSteps(rule.program_id);
      const appeal = getProgramAppealInfo(rule.program_id);
      
      return {
        id: rule.program_id,
        name: rule.name,
        description: rule.description,
        who_it_is_for: rule.who_it_is_for,
        who_might_qualify: rule.who_might_qualify,
        official_source_url: rule.official_source_url,
        category: rule.category,
        last_verified_date: rule.last_verified_date,
        trigger_reason: rule.trigger_reason,
        documentRequirements: docs,
        applicationSteps: steps,
        appealInfo: appeal || null
      };
    });
  } catch (err) {
    console.error('Failed to match core programs:', err);
    return [];
  }
}

export function getProgramsByKeywords(age: number, diagnosis: string, keywords: string[]): Program[] {
  let querySql = `
    SELECT * FROM structured_programs 
    WHERE 
      (age_limit_min IS NULL OR age_limit_min <= ?) AND
      (age_limit_max IS NULL OR age_limit_max >= ?) AND
      (
        diagnosis_required LIKE ? OR 
        diagnosis_required LIKE '%Disability%' OR 
        diagnosis_required LIKE '%13 IDEA Categories%'
      )
  `;
  const params: any[] = [age, age, `%${diagnosis}%`];

  if (keywords.length > 0) {
    querySql += ' AND (';
    const orClauses = keywords.map(() => `target_demographic LIKE ? OR program_name LIKE ? OR diagnosis_required LIKE ?`).join(' OR ');
    querySql += orClauses + ')';
    keywords.forEach(kw => {
      params.push(`%${kw}%`, `%${kw}%`, `%${kw}%`);
    });
  }

  querySql += ` GROUP BY program_name ORDER BY id ASC LIMIT 20`;

  try {
    return crawlerDb.prepare(querySql).all(...params) as Program[];
  } catch (err) {
    console.error('Failed to search crawler programs by keywords:', err);
    return [];
  }
}

export function getIepAdvocates(countyId?: string): IepAdvocate[] {
  try {
    if (countyId) {
      return navigatorDb.prepare('SELECT * FROM iep_advocates WHERE counties_served LIKE ?').all(`%${countyId}%`) as IepAdvocate[];
    }
    return navigatorDb.prepare('SELECT * FROM iep_advocates').all() as IepAdvocate[];
  } catch (err) {
    console.error('Failed to query IEP advocates:', err);
    return [];
  }
}

export function getProgramWaitlists(): ProgramWaitlist[] {
  try {
    return navigatorDb.prepare('SELECT * FROM program_waitlists').all() as ProgramWaitlist[];
  } catch (err) {
    console.error('Failed to query program waitlists:', err);
    return [];
  }
}

export function updateWaitlistStatus(
  programId: string,
  durationLabel: string,
  durationMonths: number,
  status: 'critical' | 'moderate' | 'standard' | 'priority',
  description: string
): boolean {
  if (process.env.VERCEL === '1') {
    console.log(`⚠️ Database is read-only on Vercel. Skipping waitlist update on disk for ${programId}.`);
    return false;
  }
  try {
    const stmt = navigatorDb.prepare(`
      UPDATE program_waitlists 
      SET duration_label = ?, duration_months = ?, status = ?, description = ?, last_scraped_at = ?
      WHERE program_id = ?
    `);
    const info = stmt.run(durationLabel, durationMonths, status, description, new Date().toISOString(), programId);
    return info.changes > 0;
  } catch (err) {
    console.error(`Failed to update waitlist for ${programId}:`, err);
    return false;
  }
}

export interface CommunitySuggestion {
  id?: number;
  suggestion_type: string;
  target_id: string | null;
  submitter_name: string;
  submitter_email: string;
  details: string;
  status?: string;
  created_at?: string;
}

export function submitCommunitySuggestion(suggestion: CommunitySuggestion): boolean {
  if (process.env.VERCEL === '1') {
    console.log(`⚠️ Database is read-only on Vercel. Simulating suggestion submit.`);
    return true;
  }
  try {
    const stmt = navigatorDb.prepare(`
      INSERT INTO community_suggestions (suggestion_type, target_id, submitter_name, submitter_email, details, status, created_at)
      VALUES (?, ?, ?, ?, ?, 'pending', ?)
    `);
    const info = stmt.run(
      suggestion.suggestion_type,
      suggestion.target_id,
      suggestion.submitter_name,
      suggestion.submitter_email,
      suggestion.details,
      new Date().toISOString()
    );
    return info.changes > 0;
  } catch (err) {
    console.error('Failed to submit community suggestion:', err);
    return false;
  }
}

export interface ChildIepData {
  accommodations: string[];
  goals: {
    id: string;
    goal_template_id: string;
    custom_text: string;
    tokens_json: string;
  }[];
}

export interface ChildRespiteData {
  child_id: string;
  safety_score: number;
  sleep_score: number;
  medical_score: number;
  behavior_score: number;
  updated_at: string;
}

export function getChildIepData(childId: string): ChildIepData {
  try {
    const accs = navigatorDb.prepare('SELECT accommodation_id FROM child_iep_accommodations WHERE child_id = ?').all(childId) as { accommodation_id: string }[];
    const goals = navigatorDb.prepare('SELECT id, goal_template_id, custom_text, tokens_json FROM child_iep_goals WHERE child_id = ?').all(childId) as any[];
    return {
      accommodations: accs.map(a => a.accommodation_id),
      goals: goals.map(g => ({
        id: g.id,
        goal_template_id: g.goal_template_id,
        custom_text: g.custom_text,
        tokens_json: g.tokens_json
      }))
    };
  } catch (err) {
    console.error('Failed to get child IEP data:', err);
    return { accommodations: [], goals: [] };
  }
}

export function saveChildIepData(childId: string, accommodations: string[], goals: { templateId: string; text: string; tokens: Record<string, string> }[]): boolean {
  if (process.env.VERCEL === '1') {
    console.log(`⚠️ Database is read-only on Vercel. Simulating save child IEP data.`);
    return true;
  }
  try {
    navigatorDb.transaction(() => {
      // 1. Clear old accommodations & goals
      navigatorDb.prepare('DELETE FROM child_iep_accommodations WHERE child_id = ?').run(childId);
      navigatorDb.prepare('DELETE FROM child_iep_goals WHERE child_id = ?').run(childId);

      // 2. Insert new accommodations
      const insertAcc = navigatorDb.prepare('INSERT INTO child_iep_accommodations (id, child_id, accommodation_id) VALUES (?, ?, ?)');
      accommodations.forEach(accId => {
        const id = `iep-acc-${childId}-${accId}`;
        insertAcc.run(id, childId, accId);
      });

      // 3. Insert new goals
      const insertGoal = navigatorDb.prepare('INSERT INTO child_iep_goals (id, child_id, goal_template_id, custom_text, tokens_json) VALUES (?, ?, ?, ?, ?)');
      goals.forEach(goal => {
        const id = `iep-goal-${childId}-${goal.templateId}`;
        insertGoal.run(id, childId, goal.templateId, goal.text, JSON.stringify(goal.tokens));
      });
    })();
    return true;
  } catch (err) {
    console.error('Failed to save child IEP data:', err);
    return false;
  }
}

export function getChildRespiteData(childId: string): ChildRespiteData | null {
  try {
    const data = navigatorDb.prepare('SELECT * FROM child_respite_assessments WHERE child_id = ?').get(childId) as ChildRespiteData | undefined;
    return data || null;
  } catch (err) {
    console.error('Failed to get child respite data:', err);
    return null;
  }
}

export function saveChildRespiteData(childId: string, scores: { safety: number; sleep: number; medical: number; behavior: number }): boolean {
  if (process.env.VERCEL === '1') {
    console.log(`⚠️ Database is read-only on Vercel. Simulating save child respite data.`);
    return true;
  }
  try {
    const stmt = navigatorDb.prepare(`
      INSERT INTO child_respite_assessments (child_id, safety_score, sleep_score, medical_score, behavior_score, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(child_id) DO UPDATE SET
        safety_score = excluded.safety_score,
        sleep_score = excluded.sleep_score,
        medical_score = excluded.medical_score,
        behavior_score = excluded.behavior_score,
        updated_at = excluded.updated_at
    `);
    stmt.run(childId, scores.safety, scores.sleep, scores.medical, scores.behavior, new Date().toISOString());
    return true;
  } catch (err) {
    console.error('Failed to save child respite data:', err);
    return false;
  }
}


