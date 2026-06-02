import Database from 'better-sqlite3';
import path from 'path';

// Define DB Paths relative to next.js execution (working directory is usually the root of frontend/)
const crawlerDbPath = path.resolve(process.cwd(), 'ca_disability_crawler.db');
const navigatorDbPath = path.resolve(process.cwd(), 'ca_disability_navigator.db');

// Instantiate DB handles
const crawlerDb = new Database(crawlerDbPath, { readonly: true });
const navigatorDb = new Database(navigatorDbPath);

// Enable Foreign Key support in SQLite
navigatorDb.pragma('foreign_keys = ON');

// Initialize database schema tables if they don't exist
function runMigrations() {
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
  console.log('⚡ SQLite Database migrations completed successfully!');
}

runMigrations();

// Database interfaces
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


