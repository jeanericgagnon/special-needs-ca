/* eslint-disable @typescript-eslint/no-explicit-any */
import Database from 'better-sqlite3';
import { Pool, PoolClient } from 'pg';
import { AsyncLocalStorage } from 'async_hooks';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { DIAGNOSES_DETAILS } from './diagnoses';
import {
  getDirectoryFieldCoverage,
  hasDirectoryAccessibilitySignal,
  hasDirectoryAvailabilitySignal,
  hasDirectoryClaimGroundworkSignal,
  hasDirectoryNextStepSignal,
} from './directoryFoundation';

// Helper to locate DB file dynamically in serverless environments
function findDbPath(dbName: string): string {
  const paths = [
    path.resolve(process.cwd(), dbName),
    path.resolve(process.cwd(), 'frontend', dbName),
  ];
  for (const p of paths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return path.resolve(process.cwd(), dbName); // fallback
}

// Define DB Paths relative to next.js execution
const crawlerDbPath = findDbPath('ca_disability_crawler.db');
const navigatorDbPath = findDbPath('ca_disability_navigator.db');

// Instantiate DB handles lazily using proxies to prevent Next.js build-time lockouts
const isVercel = process.env.VERCEL === '1';

// Enforce standard key length of 32 bytes for AES-256-CBC
const ENCRYPTION_KEY = process.env.DB_ENCRYPTION_KEY || 'ca-special-needs-navigator-key-dev-32';
if (!process.env.DB_ENCRYPTION_KEY && process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE !== 'phase-production-build') {
  throw new Error('CRITICAL CONFIGURATION ERROR: DB_ENCRYPTION_KEY environment variable is not defined. Failing closed.');
}
const IV_LENGTH = 16;

// PostgreSQL Connection setup
const usePg = !!process.env.DATABASE_URL;
let pgPoolInstance: Pool | null = null;
const txStorage = new AsyncLocalStorage<PoolClient>();

function getPgPool() {
  if (!pgPoolInstance && usePg) {
    pgPoolInstance = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
    });
  }
  return pgPoolInstance;
}

let pgInitialized = false;
let pgInitPromise: Promise<void> | null = null;

async function ensurePgInit() {
  if (!usePg) return;
  if (pgInitialized) return;
  if (pgInitPromise) return pgInitPromise;

  pgInitPromise = (async () => {
    try {
      console.log('🚀 Initializing PostgreSQL connection & running schema checks...');
      const pool = getPgPool()!;
      await runPgMigrations(pool);
      await syncSqliteToPg(pool);
      pgInitialized = true;
      console.log('✅ PostgreSQL initialization and sync complete.');
    } catch (err) {
      console.error('❌ Failed to initialize PostgreSQL database:', err);
      pgInitPromise = null;
      throw err;
    }
  })();

  return pgInitPromise;
}

function convertSqlForPg(sql: string): string {
  let index = 1;
  return sql.replace(/\?/g, () => `${index++}`);
}

class CustomStatement {
  constructor(private sql: string, private dbName: 'crawler' | 'navigator') {}

  async executePg(params: any[]): Promise<any> {
    const client = txStorage.getStore() || getPgPool()!;
    const pgSql = convertSqlForPg(this.sql);
    return await client.query(pgSql, params);
  }

  async all(...params: any[]): Promise<any[]> {
    if (usePg) {
      await ensurePgInit();
      const res = await this.executePg(params);
      return res.rows;
    } else {
      const db = this.dbName === 'crawler' ? ensureCrawlerDb() : ensureNavigatorDb();
      return db.prepare(this.sql).all(...params);
    }
  }

  async get(...params: any[]): Promise<any | undefined> {
    if (usePg) {
      await ensurePgInit();
      const res = await this.executePg(params);
      return res.rows[0];
    } else {
      const db = this.dbName === 'crawler' ? ensureCrawlerDb() : ensureNavigatorDb();
      return db.prepare(this.sql).get(...params);
    }
  }

  async run(...params: any[]): Promise<any> {
    if (usePg) {
      await ensurePgInit();
      const res = await this.executePg(params);
      return {
        changes: res.rowCount,
        lastInsertRowid: null
      };
    } else {
      const db = this.dbName === 'crawler' ? ensureCrawlerDb() : ensureNavigatorDb();
      return db.prepare(this.sql).run(...params);
    }
  }
}


function encrypt(text: string | null | undefined): string {
  if (!text) return '';
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(ENCRYPTION_KEY.padEnd(32).substring(0, 32)),
      iv
    );
    let encrypted = cipher.update(text, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  } catch (e) {
    console.error('Encryption failed:', e);
    return text;
  }
}

function decrypt(text: string | null | undefined): string {
  if (!text) return '';
  if (!text.includes(':')) return text; // Backward-compatible with plain text
  try {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(ENCRYPTION_KEY.padEnd(32).substring(0, 32)),
      iv
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
  } catch (e) {
    console.error('Decryption failed, falling back to original text:', e);
    return text;
  }
}

let crawlerDbInstance: Database.Database | null = null;
let navigatorDbInstance: Database.Database | null = null;
let migrationsRun = false;

function ensureCrawlerDb() {
  if (!crawlerDbInstance) {
    crawlerDbInstance = new Database(crawlerDbPath, { readonly: true, timeout: 5000 });
    try {
      crawlerDbInstance.pragma('journal_mode = WAL');
    } catch {
      // Ignore if readonly connection cannot enable WAL
    }
  }
  return crawlerDbInstance;
}

function ensureNavigatorDb() {
  if (!navigatorDbInstance) {
    const readonly = isVercel;
    navigatorDbInstance = new Database(navigatorDbPath, { readonly, timeout: 5000 });
    try {
      navigatorDbInstance.pragma('journal_mode = WAL');
    } catch {
      // Ignore if readonly connection cannot enable WAL
    }
    if (!readonly) {
      navigatorDbInstance.pragma('foreign_keys = ON');
      if (!migrationsRun) {
        migrationsRun = true;
        runMigrations(navigatorDbInstance);
      }
    }
  }
  return navigatorDbInstance;
}

export const crawlerDb = new Proxy({} as any, {
  get(target, prop) {
    if (prop === 'prepare') {
      return (sql: string) => new CustomStatement(sql, 'crawler');
    }
    const db = ensureCrawlerDb();
    const val = (db as any)[prop];
    return typeof val === 'function' ? val.bind(db) : val;
  }
});

export const navigatorDb = new Proxy({} as any, {
  get(target, prop) {
    if (prop === 'prepare') {
      return (sql: string) => new CustomStatement(sql, 'navigator');
    }
    if (prop === 'transaction') {
      return (fn: (...args: any[]) => any) => {
        return async (...args: any[]) => {
          if (usePg) {
            await ensurePgInit();
            const pool = getPgPool()!;
            const client = await pool.connect();
            try {
              await client.query('BEGIN');
              const result = await txStorage.run(client, async () => {
                return await fn(...args);
              });
              await client.query('COMMIT');
              return result;
            } catch (e) {
              await client.query('ROLLBACK');
              throw e;
            } finally {
              client.release();
            }
          } else {
            const db = ensureNavigatorDb();
            try {
              const txn = db.transaction(fn);
              return txn(...args);
            } catch (e: any) {
              if (e && e.message && e.message.includes('cannot return a promise')) {
                db.prepare('BEGIN').run();
                try {
                  const result = await fn(...args);
                  db.prepare('COMMIT').run();
                  return result;
                } catch (err) {
                  db.prepare('ROLLBACK').run();
                  throw err;
                }
              } else {
                throw e;
              }
            }
          }
        };
      };
    }
    const db = ensureNavigatorDb();
    const val = (db as any)[prop];
    return typeof val === 'function' ? val.bind(db) : val;
  }
});

async function runPgMigrations(pool: Pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS family_cases (
      id TEXT PRIMARY KEY,
      email TEXT,
      created_at TEXT
    );
    CREATE TABLE IF NOT EXISTS states (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT NOT NULL UNIQUE
    );
    CREATE TABLE IF NOT EXISTS counties (
      id TEXT PRIMARY KEY,
      state_id TEXT NOT NULL REFERENCES states(id),
      name TEXT NOT NULL,
      website TEXT NOT NULL,
      ihss_wage_rate REAL,
      medi_cal_plans TEXT
    );
    ALTER TABLE counties ADD COLUMN IF NOT EXISTS state_id TEXT REFERENCES states(id);
    CREATE TABLE IF NOT EXISTS conditions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      aliases TEXT,
      parent_friendly_explanation TEXT,
      regional_center_relevance INTEGER,
      iep_relevance INTEGER,
      ccs_relevance INTEGER,
      ssi_relevance INTEGER,
      cal_able_relevance INTEGER,
      age_specific_notes TEXT,
      source_url TEXT,
      last_verified_date TEXT
    );
    CREATE TABLE IF NOT EXISTS functional_needs (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT,
      description TEXT,
      program_triggers TEXT
    );
    CREATE TABLE IF NOT EXISTS programs (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      who_it_is_for TEXT,
      who_might_qualify TEXT,
      official_source_url TEXT,
      category TEXT,
      last_verified_date TEXT,
      state_id TEXT REFERENCES states(id)
    );
    ALTER TABLE programs ADD COLUMN IF NOT EXISTS state_id TEXT REFERENCES states(id);
    CREATE TABLE IF NOT EXISTS program_eligibility_rules (
      id TEXT PRIMARY KEY,
      program_id TEXT NOT NULL,
      min_age_years REAL,
      max_age_years REAL,
      required_condition TEXT,
      required_need TEXT,
      insurance_status TEXT,
      school_status TEXT,
      trigger_reason TEXT
    );
    CREATE TABLE IF NOT EXISTS program_document_requirements (
      id TEXT PRIMARY KEY,
      program_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      is_mandatory INTEGER
    );
    CREATE TABLE IF NOT EXISTS program_application_steps (
      id TEXT PRIMARY KEY,
      program_id TEXT NOT NULL,
      step_number INTEGER,
      title TEXT NOT NULL,
      action_description TEXT NOT NULL,
      apply_url_or_contact TEXT
    );
    CREATE TABLE IF NOT EXISTS program_appeal_info (
      program_id TEXT PRIMARY KEY,
      deadline_days TEXT,
      appeal_steps TEXT,
      denial_reasons TEXT,
      appeal_form_name TEXT,
      official_appeal_source_url TEXT
    );
    CREATE TABLE IF NOT EXISTS county_offices (
      id TEXT PRIMARY KEY,
      county_id TEXT NOT NULL,
      program_id TEXT NOT NULL,
      office_name TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      website TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS state_resource_agencies (
      id TEXT PRIMARY KEY,
      state_id TEXT NOT NULL REFERENCES states(id),
      agency_type TEXT NOT NULL,
      name TEXT NOT NULL,
      website TEXT NOT NULL,
      counties_served TEXT NOT NULL,
      catchment_boundaries TEXT,
      intake_phone TEXT NOT NULL,
      early_intervention_contact TEXT,
      agency_intake_contact TEXT,
      eligibility_info_page TEXT,
      services_page TEXT,
      appeals_info TEXT,
      frc_relationship TEXT,
      office_locations TEXT,
      languages TEXT,
      last_verified_date TEXT,
      source_urls TEXT,
      service_area_description TEXT
    );
    CREATE TABLE IF NOT EXISTS regional_education_agencies (
      id TEXT PRIMARY KEY,
      state_id TEXT NOT NULL REFERENCES states(id),
      agency_type TEXT NOT NULL,
      name TEXT NOT NULL,
      counties_served TEXT NOT NULL,
      website TEXT NOT NULL
    );
    CREATE OR REPLACE VIEW regional_centers AS
    SELECT 
      id,
      state_id,
      agency_type,
      name,
      counties_served,
      catchment_boundaries,
      website,
      intake_phone,
      early_intervention_contact AS early_start_contact,
      agency_intake_contact AS lanterman_intake_contact,
      eligibility_info_page,
      services_page,
      appeals_info,
      frc_relationship,
      office_locations,
      languages,
      last_verified_date,
      source_urls,
      source_url,
      source_type,
      data_origin,
      verification_status,
      last_scraped_at,
      confidence_score
    FROM state_resource_agencies;

    CREATE OR REPLACE VIEW selpas AS
    SELECT
      id,
      name,
      counties_served,
      website,
      source_url,
      source_type,
      data_origin,
      verification_status,
      last_verified_date,
      last_scraped_at,
      confidence_score
    FROM regional_education_agencies;

    CREATE TABLE IF NOT EXISTS school_districts (
      id TEXT PRIMARY KEY,
      county_id TEXT NOT NULL,
      name TEXT NOT NULL,
      spec_ed_contact_phone TEXT,
      spec_ed_contact_email TEXT,
      website TEXT,
      total_enrollment INTEGER,
      special_ed_pct REAL,
      inclusion_rate_pct REAL,
      self_contained_rate_pct REAL
    );
    CREATE TABLE IF NOT EXISTS resource_providers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      categories TEXT,
      county_id TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      address TEXT,
      accepts_medi_cal INTEGER,
      regional_center_vendor_ids TEXT,
      service_tags TEXT,
      serving_tags TEXT,
      availability_status TEXT,
      accepting_new_clients INTEGER,
      waitlist_status TEXT,
      capacity_notes TEXT,
      funding_status TEXT,
      checked_at TEXT,
      source_name TEXT,
      source_last_updated TEXT,
      next_step_type TEXT,
      next_step_label TEXT,
      next_step_url TEXT,
      next_step_phone TEXT,
      next_step_email TEXT,
      next_step_instructions TEXT,
      requirements TEXT,
      application_url TEXT,
      referral_url TEXT,
      walk_in_available INTEGER,
      appointment_required INTEGER,
      languages TEXT,
      interpreter_available INTEGER,
      asl_available INTEGER,
      wheelchair_accessible INTEGER,
      virtual_services INTEGER,
      in_person_services INTEGER,
      home_visits INTEGER,
      transportation_help INTEGER,
      accessibility_notes TEXT,
      accessibility_evidence_level TEXT,
      accessibility_source_address TEXT,
      manual_review_required INTEGER DEFAULT 0,
      data_quality_notes TEXT,
      unsupported_claim_flags TEXT,
      claim_status TEXT,
      claimed_by TEXT,
      verified_affiliation INTEGER DEFAULT 0,
      claim_email TEXT,
      source_url TEXT,
      source_type TEXT,
      data_origin TEXT,
      verification_status TEXT,
      last_verified_at TEXT,
      last_verified_date TEXT,
      last_scraped_at TEXT,
      confidence_score REAL
    );
    CREATE TABLE IF NOT EXISTS nonprofit_organizations (
      id TEXT PRIMARY KEY,
      county_id TEXT NOT NULL,
      name TEXT NOT NULL,
      website TEXT NOT NULL,
      phone TEXT NOT NULL,
      focus_condition TEXT NOT NULL,
      service_tags TEXT,
      serving_tags TEXT,
      availability_status TEXT,
      accepting_new_clients INTEGER,
      waitlist_status TEXT,
      capacity_notes TEXT,
      funding_status TEXT,
      checked_at TEXT,
      source_name TEXT,
      source_last_updated TEXT,
      next_step_type TEXT,
      next_step_label TEXT,
      next_step_url TEXT,
      next_step_phone TEXT,
      next_step_email TEXT,
      next_step_instructions TEXT,
      requirements TEXT,
      application_url TEXT,
      referral_url TEXT,
      walk_in_available INTEGER,
      appointment_required INTEGER,
      languages TEXT,
      interpreter_available INTEGER,
      asl_available INTEGER,
      wheelchair_accessible INTEGER,
      virtual_services INTEGER,
      in_person_services INTEGER,
      home_visits INTEGER,
      transportation_help INTEGER,
      accessibility_notes TEXT,
      manual_review_required INTEGER DEFAULT 0,
      data_quality_notes TEXT,
      unsupported_claim_flags TEXT,
      claim_status TEXT,
      claimed_by TEXT,
      verified_affiliation INTEGER DEFAULT 0,
      claim_email TEXT,
      source_url TEXT,
      source_type TEXT,
      data_origin TEXT,
      verification_status TEXT,
      last_verified_at TEXT,
      last_verified_date TEXT,
      last_scraped_at TEXT,
      confidence_score REAL
    );
    CREATE TABLE IF NOT EXISTS sources (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      url TEXT,
      type TEXT
    );
    CREATE TABLE IF NOT EXISTS source_verifications (
      id TEXT PRIMARY KEY,
      source_id TEXT NOT NULL,
      verified_at TEXT NOT NULL,
      status TEXT NOT NULL
    );
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
      website TEXT NOT NULL,
      specialties TEXT,
      regional_center_vendorized INTEGER DEFAULT 0,
      organization_affiliation TEXT,
      description TEXT,
      service_tags TEXT,
      serving_tags TEXT,
      availability_status TEXT,
      accepting_new_clients INTEGER,
      waitlist_status TEXT,
      capacity_notes TEXT,
      funding_status TEXT,
      checked_at TEXT,
      source_name TEXT,
      source_last_updated TEXT,
      next_step_type TEXT,
      next_step_label TEXT,
      next_step_url TEXT,
      next_step_phone TEXT,
      next_step_email TEXT,
      next_step_instructions TEXT,
      requirements TEXT,
      application_url TEXT,
      referral_url TEXT,
      walk_in_available INTEGER,
      appointment_required INTEGER,
      interpreter_available INTEGER,
      asl_available INTEGER,
      wheelchair_accessible INTEGER,
      virtual_services INTEGER,
      in_person_services INTEGER,
      home_visits INTEGER,
      transportation_help INTEGER,
      accessibility_notes TEXT,
      manual_review_required INTEGER DEFAULT 0,
      data_quality_notes TEXT,
      unsupported_claim_flags TEXT,
      claim_status TEXT,
      claimed_by TEXT,
      verified_affiliation INTEGER DEFAULT 0,
      claim_email TEXT,
      verification_status TEXT DEFAULT 'unverified',
      source_url TEXT,
      source_type TEXT,
      last_scraped_at TEXT,
      last_verified_at TEXT
    );
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified';
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS source_url TEXT;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS source_type TEXT;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS last_scraped_at TEXT;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS last_verified_at TEXT;

    ALTER TABLE county_offices ADD COLUMN IF NOT EXISTS source_url TEXT;
    ALTER TABLE county_offices ADD COLUMN IF NOT EXISTS source_type TEXT;
    ALTER TABLE county_offices ADD COLUMN IF NOT EXISTS data_origin TEXT;
    ALTER TABLE county_offices ADD COLUMN IF NOT EXISTS verification_status TEXT;
    ALTER TABLE county_offices ADD COLUMN IF NOT EXISTS last_verified_date TEXT;
    ALTER TABLE county_offices ADD COLUMN IF NOT EXISTS last_scraped_at TEXT;
    ALTER TABLE county_offices ADD COLUMN IF NOT EXISTS confidence_score REAL;

    ALTER TABLE school_districts ADD COLUMN IF NOT EXISTS source_url TEXT;
    ALTER TABLE school_districts ADD COLUMN IF NOT EXISTS source_type TEXT;
    ALTER TABLE school_districts ADD COLUMN IF NOT EXISTS data_origin TEXT;
    ALTER TABLE school_districts ADD COLUMN IF NOT EXISTS verification_status TEXT;
    ALTER TABLE school_districts ADD COLUMN IF NOT EXISTS last_verified_date TEXT;
    ALTER TABLE school_districts ADD COLUMN IF NOT EXISTS last_scraped_at TEXT;
    ALTER TABLE school_districts ADD COLUMN IF NOT EXISTS confidence_score REAL;

    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS source_url TEXT;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS source_type TEXT;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS data_origin TEXT;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS verification_status TEXT;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS last_verified_at TEXT;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS last_verified_date TEXT;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS last_scraped_at TEXT;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS confidence_score REAL;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS service_tags TEXT;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS serving_tags TEXT;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS availability_status TEXT;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS accepting_new_clients INTEGER;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS waitlist_status TEXT;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS capacity_notes TEXT;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS funding_status TEXT;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS checked_at TEXT;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS source_name TEXT;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS source_last_updated TEXT;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS next_step_type TEXT;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS next_step_label TEXT;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS next_step_url TEXT;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS next_step_phone TEXT;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS next_step_email TEXT;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS next_step_instructions TEXT;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS requirements TEXT;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS application_url TEXT;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS referral_url TEXT;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS walk_in_available INTEGER;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS appointment_required INTEGER;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS languages TEXT;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS interpreter_available INTEGER;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS asl_available INTEGER;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS wheelchair_accessible INTEGER;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS virtual_services INTEGER;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS in_person_services INTEGER;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS home_visits INTEGER;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS transportation_help INTEGER;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS accessibility_notes TEXT;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS accessibility_evidence_level TEXT;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS accessibility_source_address TEXT;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS manual_review_required INTEGER DEFAULT 0;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS data_quality_notes TEXT;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS unsupported_claim_flags TEXT;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS claim_status TEXT;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS claimed_by TEXT;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS verified_affiliation INTEGER DEFAULT 0;
    ALTER TABLE nonprofit_organizations ADD COLUMN IF NOT EXISTS claim_email TEXT;

    ALTER TABLE regional_education_agencies ADD COLUMN IF NOT EXISTS source_url TEXT;
    ALTER TABLE regional_education_agencies ADD COLUMN IF NOT EXISTS source_type TEXT;
    ALTER TABLE regional_education_agencies ADD COLUMN IF NOT EXISTS data_origin TEXT;
    ALTER TABLE regional_education_agencies ADD COLUMN IF NOT EXISTS verification_status TEXT;
    ALTER TABLE regional_education_agencies ADD COLUMN IF NOT EXISTS last_verified_date TEXT;
    ALTER TABLE regional_education_agencies ADD COLUMN IF NOT EXISTS last_scraped_at TEXT;
    ALTER TABLE regional_education_agencies ADD COLUMN IF NOT EXISTS confidence_score REAL;

    ALTER TABLE state_resource_agencies ADD COLUMN IF NOT EXISTS source_url TEXT;
    ALTER TABLE state_resource_agencies ADD COLUMN IF NOT EXISTS source_type TEXT;
    ALTER TABLE state_resource_agencies ADD COLUMN IF NOT EXISTS data_origin TEXT;
    ALTER TABLE state_resource_agencies ADD COLUMN IF NOT EXISTS verification_status TEXT;
    ALTER TABLE state_resource_agencies ADD COLUMN IF NOT EXISTS last_scraped_at TEXT;
    ALTER TABLE state_resource_agencies ADD COLUMN IF NOT EXISTS confidence_score REAL;

    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS data_origin TEXT;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS last_verified_date TEXT;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS confidence_score REAL;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS service_tags TEXT;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS serving_tags TEXT;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS availability_status TEXT;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS accepting_new_clients INTEGER;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS waitlist_status TEXT;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS capacity_notes TEXT;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS funding_status TEXT;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS checked_at TEXT;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS source_name TEXT;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS source_last_updated TEXT;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS next_step_type TEXT;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS next_step_label TEXT;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS next_step_url TEXT;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS next_step_phone TEXT;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS next_step_email TEXT;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS next_step_instructions TEXT;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS requirements TEXT;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS application_url TEXT;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS referral_url TEXT;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS walk_in_available INTEGER;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS appointment_required INTEGER;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS interpreter_available INTEGER;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS asl_available INTEGER;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS wheelchair_accessible INTEGER;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS virtual_services INTEGER;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS in_person_services INTEGER;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS home_visits INTEGER;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS transportation_help INTEGER;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS accessibility_notes TEXT;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS manual_review_required INTEGER DEFAULT 0;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS data_quality_notes TEXT;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS unsupported_claim_flags TEXT;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS claim_status TEXT;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS claimed_by TEXT;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS verified_affiliation INTEGER DEFAULT 0;
    ALTER TABLE iep_advocates ADD COLUMN IF NOT EXISTS claim_email TEXT;

    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS source_url TEXT;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS source_type TEXT;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS data_origin TEXT;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS verification_status TEXT;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS last_verified_at TEXT;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS last_verified_date TEXT;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS last_scraped_at TEXT;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS confidence_score REAL;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS service_tags TEXT;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS serving_tags TEXT;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS availability_status TEXT;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS accepting_new_clients INTEGER;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS waitlist_status TEXT;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS capacity_notes TEXT;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS funding_status TEXT;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS checked_at TEXT;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS source_name TEXT;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS source_last_updated TEXT;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS next_step_type TEXT;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS next_step_label TEXT;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS next_step_url TEXT;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS next_step_phone TEXT;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS next_step_email TEXT;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS next_step_instructions TEXT;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS requirements TEXT;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS application_url TEXT;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS referral_url TEXT;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS walk_in_available INTEGER;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS appointment_required INTEGER;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS languages TEXT;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS interpreter_available INTEGER;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS asl_available INTEGER;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS wheelchair_accessible INTEGER;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS virtual_services INTEGER;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS in_person_services INTEGER;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS home_visits INTEGER;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS transportation_help INTEGER;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS accessibility_notes TEXT;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS manual_review_required INTEGER DEFAULT 0;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS data_quality_notes TEXT;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS unsupported_claim_flags TEXT;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS claim_status TEXT;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS claimed_by TEXT;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS verified_affiliation INTEGER DEFAULT 0;
    ALTER TABLE resource_providers ADD COLUMN IF NOT EXISTS claim_email TEXT;

    ALTER TABLE programs ADD COLUMN IF NOT EXISTS source_url TEXT;
    ALTER TABLE programs ADD COLUMN IF NOT EXISTS source_type TEXT;
    ALTER TABLE programs ADD COLUMN IF NOT EXISTS data_origin TEXT;
    ALTER TABLE programs ADD COLUMN IF NOT EXISTS verification_status TEXT;
    ALTER TABLE programs ADD COLUMN IF NOT EXISTS last_scraped_at TEXT;
    ALTER TABLE programs ADD COLUMN IF NOT EXISTS confidence_score REAL;

    ALTER TABLE sources ADD COLUMN IF NOT EXISTS source_url TEXT;
    ALTER TABLE sources ADD COLUMN IF NOT EXISTS source_type TEXT;
    ALTER TABLE sources ADD COLUMN IF NOT EXISTS data_origin TEXT;
    ALTER TABLE sources ADD COLUMN IF NOT EXISTS verification_status TEXT;
    ALTER TABLE sources ADD COLUMN IF NOT EXISTS last_verified_date TEXT;
    ALTER TABLE sources ADD COLUMN IF NOT EXISTS last_scraped_at TEXT;
    ALTER TABLE sources ADD COLUMN IF NOT EXISTS confidence_score REAL;

    ALTER TABLE source_verifications ADD COLUMN IF NOT EXISTS source_url TEXT;
    ALTER TABLE source_verifications ADD COLUMN IF NOT EXISTS source_type TEXT;
    ALTER TABLE source_verifications ADD COLUMN IF NOT EXISTS data_origin TEXT;
    ALTER TABLE source_verifications ADD COLUMN IF NOT EXISTS verification_status TEXT;
    ALTER TABLE source_verifications ADD COLUMN IF NOT EXISTS last_verified_date TEXT;
    ALTER TABLE source_verifications ADD COLUMN IF NOT EXISTS last_scraped_at TEXT;
    ALTER TABLE source_verifications ADD COLUMN IF NOT EXISTS confidence_score REAL;
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
    CREATE TABLE IF NOT EXISTS regional_center_counties (
      regional_center_id TEXT,
      county_id TEXT,
      PRIMARY KEY (regional_center_id, county_id)
    );
    CREATE TABLE IF NOT EXISTS selpa_counties (
      selpa_id TEXT,
      county_id TEXT,
      PRIMARY KEY (selpa_id, county_id)
    );
    CREATE TABLE IF NOT EXISTS iep_advocate_counties (
      iep_advocate_id TEXT,
      county_id TEXT,
      PRIMARY KEY (iep_advocate_id, county_id)
    );
    CREATE TABLE IF NOT EXISTS structured_programs (
      id SERIAL PRIMARY KEY,
      source_url TEXT,
      program_name TEXT NOT NULL,
      target_demographic TEXT,
      age_limit_min REAL,
      age_limit_max REAL,
      income_limit TEXT,
      diagnosis_required TEXT,
      county_specific TEXT
    );
    CREATE TABLE IF NOT EXISTS organizations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      organization_type TEXT NOT NULL,
      parent_organization_id TEXT,
      website TEXT,
      intake_phone TEXT,
      intake_email TEXT,
      source_url TEXT,
      source_type TEXT,
      data_origin TEXT,
      verification_status TEXT,
      last_verified_date TEXT,
      last_scraped_at TEXT,
      confidence_score REAL,
      notes TEXT
    );
    CREATE TABLE IF NOT EXISTS organization_program_links (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      program_id TEXT,
      listing_type TEXT NOT NULL,
      title TEXT NOT NULL,
      intake_model TEXT,
      service_summary TEXT,
      eligibility_summary TEXT,
      source_url TEXT,
      source_type TEXT,
      data_origin TEXT,
      verification_status TEXT,
      last_verified_date TEXT,
      last_scraped_at TEXT,
      confidence_score REAL
    );
    CREATE TABLE IF NOT EXISTS service_locations (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      location_name TEXT NOT NULL,
      location_type TEXT NOT NULL,
      address TEXT,
      city TEXT,
      state_id TEXT,
      postal_code TEXT,
      county_id TEXT,
      phone TEXT,
      email TEXT,
      website TEXT,
      appointment_url TEXT,
      hours_text TEXT,
      source_url TEXT,
      source_type TEXT,
      data_origin TEXT,
      verification_status TEXT,
      last_verified_date TEXT,
      last_scraped_at TEXT,
      confidence_score REAL
    );
    CREATE TABLE IF NOT EXISTS office_locations (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      office_name TEXT NOT NULL,
      office_type TEXT NOT NULL,
      address TEXT,
      city TEXT,
      state_id TEXT,
      postal_code TEXT,
      county_id TEXT,
      intake_phone TEXT,
      intake_email TEXT,
      website TEXT,
      hours_text TEXT,
      source_url TEXT,
      source_type TEXT,
      data_origin TEXT,
      verification_status TEXT,
      last_verified_date TEXT,
      last_scraped_at TEXT,
      confidence_score REAL
    );
    CREATE TABLE IF NOT EXISTS virtual_service_areas (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      program_link_id TEXT,
      area_type TEXT NOT NULL,
      area_name TEXT NOT NULL,
      state_id TEXT,
      coverage_notes TEXT,
      intake_model TEXT,
      source_url TEXT,
      source_type TEXT,
      data_origin TEXT,
      verification_status TEXT,
      last_verified_date TEXT,
      last_scraped_at TEXT,
      confidence_score REAL
    );
    CREATE TABLE IF NOT EXISTS virtual_service_area_counties (
      virtual_service_area_id TEXT,
      county_id TEXT,
      PRIMARY KEY (virtual_service_area_id, county_id)
    );
    CREATE TABLE IF NOT EXISTS child_profiles (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL,
      nickname TEXT NOT NULL,
      dob TEXT NOT NULL,
      county_id TEXT NOT NULL,
      zip_code TEXT,
      insurance_type TEXT,
      school_status TEXT,
      language_preference TEXT,
      caregiver_notes TEXT
    );
    CREATE TABLE IF NOT EXISTS child_profile_conditions (
      child_id TEXT NOT NULL,
      condition_id TEXT NOT NULL,
      PRIMARY KEY (child_id, condition_id)
    );
    CREATE TABLE IF NOT EXISTS child_profile_needs (
      child_id TEXT NOT NULL,
      need_id TEXT NOT NULL,
      PRIMARY KEY (child_id, need_id)
    );
    CREATE TABLE IF NOT EXISTS case_program_statuses (
      child_id TEXT NOT NULL,
      program_id TEXT NOT NULL,
      status TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (child_id, program_id)
    );
    CREATE TABLE IF NOT EXISTS document_checklist_items (
      id TEXT PRIMARY KEY,
      child_id TEXT NOT NULL,
      document_name TEXT NOT NULL,
      is_collected INTEGER NOT NULL,
      program_id TEXT,
      file_mock_url TEXT
    );
    CREATE TABLE IF NOT EXISTS reminders (
      id TEXT PRIMARY KEY,
      child_id TEXT NOT NULL,
      program_id TEXT,
      title TEXT NOT NULL,
      due_date TEXT NOT NULL,
      is_completed INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS child_iep_accommodations (
      id TEXT PRIMARY KEY,
      child_id TEXT NOT NULL,
      accommodation_id TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS child_iep_goals (
      id TEXT PRIMARY KEY,
      child_id TEXT NOT NULL,
      goal_template_id TEXT NOT NULL,
      custom_text TEXT NOT NULL,
      tokens_json TEXT
    );
    CREATE TABLE IF NOT EXISTS child_respite_assessments (
      child_id TEXT PRIMARY KEY,
      safety_score INTEGER NOT NULL,
      sleep_score INTEGER NOT NULL,
      medical_score INTEGER NOT NULL,
      behavior_score INTEGER NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS child_waivers (
      id TEXT PRIMARY KEY,
      child_id TEXT NOT NULL,
      waiver_type TEXT NOT NULL,
      document_name TEXT NOT NULL,
      file_path TEXT,
      effective_date TEXT,
      expiration_date TEXT,
      authorized_hours REAL,
      parsed_content TEXT,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS directory_reviews (
      id SERIAL PRIMARY KEY,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      entity_name TEXT NOT NULL,
      county_id TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT NOT NULL,
      reviewer_label TEXT NOT NULL DEFAULT 'Parent',
      experience_type TEXT,
      helpful_count INTEGER DEFAULT 0,
      user_id TEXT,
      created_at TEXT NOT NULL
    );
    ALTER TABLE directory_reviews ADD COLUMN IF NOT EXISTS user_id TEXT;
    CREATE TABLE IF NOT EXISTS safety_incidents (
      id TEXT PRIMARY KEY,
      child_id TEXT NOT NULL,
      time TEXT NOT NULL,
      category TEXT NOT NULL,
      risk_level TEXT NOT NULL,
      details TEXT NOT NULL,
      intervention TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS parent_declarations (
      child_id TEXT PRIMARY KEY,
      declaration_text TEXT,
      doctor_name TEXT
    );
    CREATE TABLE IF NOT EXISTS caregiver_profiles (
      user_id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT,
      phone TEXT,
      address TEXT
    );
    CREATE TABLE IF NOT EXISTS child_transition_tasks (
      child_id TEXT,
      task_id TEXT,
      PRIMARY KEY (child_id, task_id)
    );
    CREATE TABLE IF NOT EXISTS caregiver_selfcare_logs (
      child_id TEXT PRIMARY KEY,
      mon INTEGER DEFAULT 0,
      tue INTEGER DEFAULT 0,
      wed INTEGER DEFAULT 0,
      thu INTEGER DEFAULT 0,
      fri INTEGER DEFAULT 0,
      sat INTEGER DEFAULT 0,
      sun INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS child_coordinators (
      child_id TEXT PRIMARY KEY,
      coordinator_name TEXT
    );
    CREATE TABLE IF NOT EXISTS community_suggestions (
      id SERIAL PRIMARY KEY,
      suggestion_type TEXT NOT NULL,
      target_id TEXT,
      submitter_name TEXT NOT NULL,
      submitter_email TEXT NOT NULL,
      details TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS caregiver_financial_profiles (
      child_id TEXT PRIMARY KEY,
      savings REAL DEFAULT 0,
      funding_source TEXT,
      expected_balance TEXT,
      spending_timeline TEXT,
      is_rc_client INTEGER DEFAULT 0,
      has_diagnosis INTEGER DEFAULT 0,
      major_limitations INTEGER DEFAULT 0,
      has_medical_needs INTEGER DEFAULT 0,
      child_medi_cal INTEGER DEFAULT 0,
      family_size INTEGER DEFAULT 3,
      gross_income REAL DEFAULT 0,
      rc_children INTEGER DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS child_waitlist_items (
      id TEXT PRIMARY KEY,
      child_id TEXT NOT NULL,
      provider_name TEXT NOT NULL,
      service_category TEXT NOT NULL,
      date_joined TEXT,
      position TEXT,
      contact_phone TEXT,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'waiting'
    );
    CREATE TABLE IF NOT EXISTS child_iep_prep_data (
      child_id TEXT PRIMARY KEY,
      strengths TEXT,
      academic_concerns TEXT,
      speech_concerns TEXT,
      sensory_concerns TEXT,
      motor_concerns TEXT,
      social_concerns TEXT,
      requested_services TEXT,
      parent_vision TEXT
    );
    CREATE TABLE IF NOT EXISTS ihss_overtime_schedules (
      child_id TEXT PRIMARY KEY,
      feeding_rank INTEGER DEFAULT 1,
      bowel_rank INTEGER DEFAULT 1,
      bathing_rank INTEGER DEFAULT 1,
      dressing_rank INTEGER DEFAULT 1,
      ambulation_rank INTEGER DEFAULT 1,
      has_paramedical INTEGER DEFAULT 0,
      paramedical_hours REAL DEFAULT 0,
      paramedical_desc TEXT,
      requires_supervision INTEGER DEFAULT 1,
      ihss_wage REAL DEFAULT 18.00,
      recipient_count INTEGER DEFAULT 1,
      monthly_hours_1 REAL DEFAULT 120,
      monthly_hours_2 REAL DEFAULT 80,
      monthly_hours_3 REAL DEFAULT 0,
      weekly_travel_hours REAL DEFAULT 0,
      schedule_grid_json TEXT
    );
    CREATE TABLE IF NOT EXISTS child_sdp_budgets (
      child_id TEXT PRIMARY KEY,
      pos_spend REAL DEFAULT 15000,
      one_time_deductions REAL DEFAULT 0,
      fms_model TEXT DEFAULT 'bill-payer',
      allocated_community REAL DEFAULT 5000,
      allocated_respite REAL DEFAULT 5000,
      allocated_therapies REAL DEFAULT 3000,
      allocated_equipment REAL DEFAULT 2000,
      unmet_needs_json TEXT
    );
    CREATE TABLE IF NOT EXISTS knowledge_articles (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      title_es TEXT NOT NULL,
      subtitle_es TEXT NOT NULL,
      read_time TEXT NOT NULL,
      read_time_es TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      color TEXT NOT NULL,
      steps_json TEXT NOT NULL,
      steps_json_es TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS child_clinical_documents (
      id TEXT PRIMARY KEY,
      child_id TEXT NOT NULL,
      file_name TEXT NOT NULL,
      document_type TEXT NOT NULL,
      parsed_data_json TEXT NOT NULL,
      uploaded_at TEXT NOT NULL,
      status TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS consultation_threads (
      id TEXT PRIMARY KEY,
      child_id TEXT NOT NULL,
      advocate_id TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS consultation_messages (
      id TEXT PRIMARY KEY,
      thread_id TEXT NOT NULL,
      sender_role TEXT NOT NULL,
      message_text TEXT NOT NULL,
      attachments_json TEXT,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS shared_portal_tokens (
      id TEXT PRIMARY KEY,
      child_id TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      access_scope TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS legal_decisions (
      id TEXT PRIMARY KEY,
      state TEXT NOT NULL,
      case_name TEXT NOT NULL,
      case_number TEXT,
      decision_date TEXT,
      summary TEXT,
      document_url TEXT,
      body_text TEXT,
      source TEXT,
      scraped_at TEXT,
      school_district_id TEXT REFERENCES school_districts(id),
      outcome TEXT
    );
  `);
}

async function syncSqliteToPg(pool: Pool) {
  console.log('🔄 Syncing SQLite database to PostgreSQL...');
  const tables = [
    { name: 'users', crawler: false },
    { name: 'family_cases', crawler: false },
    { name: 'counties', crawler: false },
    { name: 'knowledge_articles', crawler: false },
    { name: 'conditions', crawler: false },
    { name: 'functional_needs', crawler: false },
    { name: 'programs', crawler: false },
    { name: 'program_eligibility_rules', crawler: false },
    { name: 'program_document_requirements', crawler: false },
    { name: 'program_application_steps', crawler: false },
    { name: 'program_appeal_info', crawler: false },
    { name: 'county_offices', crawler: false },
    { name: 'regional_centers', crawler: false },
    { name: 'selpas', crawler: false },
    { name: 'school_districts', crawler: false },
    { name: 'legal_decisions', crawler: false },
    { name: 'resource_providers', crawler: false },
    { name: 'nonprofit_organizations', crawler: false },
    { name: 'sources', crawler: false },
    { name: 'source_verifications', crawler: false },
    { name: 'iep_advocates', crawler: false },
    { name: 'program_waitlists', crawler: false },
    { name: 'regional_center_counties', crawler: false },
    { name: 'selpa_counties', crawler: false },
    { name: 'iep_advocate_counties', crawler: false },
    { name: 'organizations', crawler: false },
    { name: 'organization_program_links', crawler: false },
    { name: 'service_locations', crawler: false },
    { name: 'office_locations', crawler: false },
    { name: 'virtual_service_areas', crawler: false },
    { name: 'virtual_service_area_counties', crawler: false },
    { name: 'structured_programs', crawler: true },
    { name: 'child_clinical_documents', crawler: false },
    { name: 'consultation_threads', crawler: false },
    { name: 'consultation_messages', crawler: false },
    { name: 'shared_portal_tokens', crawler: false }
  ];

  for (const table of tables) {
    try {
      const pgCountRes = await pool.query(`SELECT COUNT(*) as count FROM ${table.name}`).catch(() => null);
      if (pgCountRes && parseInt(pgCountRes.rows[0].count) > 0) {
        console.log(`Table ${table.name} already contains data in PostgreSQL. Skipping sync.`);
        continue;
      }

      const sqliteDb = table.crawler ? ensureCrawlerDb() : ensureNavigatorDb();
      const rows = sqliteDb.prepare(`SELECT * FROM ${table.name}`).all() as any[];
      if (rows.length === 0) continue;

      console.log(`Syncing table ${table.name} (${rows.length} rows)...`);
      const cols = Object.keys(rows[0] as object);
      const colStr = cols.join(', ');

      const chunkSize = 200;
      for (let i = 0; i < rows.length; i += chunkSize) {
        const chunk = rows.slice(i, i + chunkSize);
        let valuesStr = '';
        const params: any[] = [];
        let paramIndex = 1;

        for (const row of chunk as any[]) {
          const valPlaceholders = cols.map(() => `$${paramIndex++}`).join(', ');
          valuesStr += (valuesStr ? ', ' : '') + `(${valPlaceholders})`;
          cols.forEach(col => params.push((row as any)[col]));
        }

        await pool.query(
          `INSERT INTO ${table.name} (${colStr}) VALUES ${valuesStr} ON CONFLICT DO NOTHING`,
          params
        );
      }
    } catch (err) {
      console.error(`Failed to sync table ${table.name}:`, (err as Error).message);
    }
  }
}

// Initialize database schema tables if they don't exist (run dynamically on first database access)
function runMigrations(db: Database.Database) {
  if (isVercel && !usePg) return;
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    INSERT OR IGNORE INTO program_eligibility_rules 
      (id, program_id, min_age_years, max_age_years, required_condition, required_need, insurance_status, school_status, trigger_reason)
    VALUES 
      ('rule-haccp-1', 'hearing-aid-coverage', 0, 21, 'hearing-loss-deafness', 'hearing-aids', 'any', 'any', 'Hearing loss and private insurance device exclusions trigger the California HACCP waiver program to fund fitting and audiology device costs.'),
      ('rule-haccp-2', 'hearing-aid-coverage', 0, 21, 'hearing-loss-deafness', null, 'any', 'any', 'Documented hearing loss triggers potential coverage under the California HACCP waiver for pediatric hearing services.');
  `);

  // Create iep_advocates table
  db.exec(`
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
      website TEXT NOT NULL,
      description TEXT,
      verification_status TEXT DEFAULT 'unverified',
      source_url TEXT,
      source_type TEXT,
      last_scraped_at TEXT,
      last_verified_at TEXT
    );
  `);

  // Add iep_advocates columns if they do not exist
  const advocateTableInfo = db.prepare("PRAGMA table_info(iep_advocates)").all() as { name: string }[];
  const advocateColumnNames = advocateTableInfo.map(col => col.name);
  if (!advocateColumnNames.includes('specialties')) {
    db.exec("ALTER TABLE iep_advocates ADD COLUMN specialties TEXT;");
  }
  if (!advocateColumnNames.includes('regional_center_vendorized')) {
    db.exec("ALTER TABLE iep_advocates ADD COLUMN regional_center_vendorized INTEGER DEFAULT 0;");
  }
  if (!advocateColumnNames.includes('organization_affiliation')) {
    db.exec("ALTER TABLE iep_advocates ADD COLUMN organization_affiliation TEXT;");
  }
  if (!advocateColumnNames.includes('description')) {
    db.exec("ALTER TABLE iep_advocates ADD COLUMN description TEXT;");
  }
  if (!advocateColumnNames.includes('verification_status')) {
    db.exec("ALTER TABLE iep_advocates ADD COLUMN verification_status TEXT DEFAULT 'unverified';");
  }
  if (!advocateColumnNames.includes('source_url')) {
    db.exec("ALTER TABLE iep_advocates ADD COLUMN source_url TEXT;");
  }
  if (!advocateColumnNames.includes('source_type')) {
    db.exec("ALTER TABLE iep_advocates ADD COLUMN source_type TEXT;");
  }
  if (!advocateColumnNames.includes('last_scraped_at')) {
    db.exec("ALTER TABLE iep_advocates ADD COLUMN last_scraped_at TEXT;");
  }
  if (!advocateColumnNames.includes('last_verified_at')) {
    db.exec("ALTER TABLE iep_advocates ADD COLUMN last_verified_at TEXT;");
  }

  // Create community_suggestions table
  db.exec(`
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
  const tableInfo = db.prepare("PRAGMA table_info(school_districts)").all() as { name: string }[];
  const columnNames = tableInfo.map(col => col.name);
  if (!columnNames.includes('total_enrollment')) {
    db.exec("ALTER TABLE school_districts ADD COLUMN total_enrollment INTEGER;");
  }
  if (!columnNames.includes('special_ed_pct')) {
    db.exec("ALTER TABLE school_districts ADD COLUMN special_ed_pct REAL;");
  }
  if (!columnNames.includes('inclusion_rate_pct')) {
    db.exec("ALTER TABLE school_districts ADD COLUMN inclusion_rate_pct REAL;");
  }
  if (!columnNames.includes('self_contained_rate_pct')) {
    db.exec("ALTER TABLE school_districts ADD COLUMN self_contained_rate_pct REAL;");
  }

  // Seed school_districts if empty
  const countDistricts = db.prepare("SELECT COUNT(*) as count FROM school_districts").get() as { count: number };
  if (countDistricts.count === 0) {
    const insertDistrict = db.prepare(`
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

    const seedTx = db.transaction(() => {
      for (const row of seedDistricts) {
        insertDistrict.run(...row);
      }
    });
    seedTx();
    console.log('⚡ Seeded California School Districts LRE Inclusion statistics.');
  }

  // Seed iep_advocates if empty
  const countAdvocates = db.prepare("SELECT COUNT(*) as count FROM iep_advocates").get() as { count: number };
  if (countAdvocates.count === 0) {
    const insertAdvocate = db.prepare("INSERT INTO iep_advocates (id, name, credentials, experience_years, price_rate, counties_served, languages_spoken, phone, email, website, verification_status, source_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'verified', 'seed')");

    const seedAdvocates = [
      ['adv-sarah', 'Sarah Jenkins, M.S.Ed.', 'Board Certified Advocate (COPAA), Former Special Ed Teacher', 15, '$150 / hour', 'los-angeles,orange', 'English', '(310) 492-0142', 'sarah@calspedadvocacy.com', 'https://calspedadvocacy.com'],
      ['adv-marisol', 'Marisol Torres', 'Bilingual IEP Consultant, Parent Advocate Coach', 10, '$120 / hour', 'los-angeles,orange,san-diego', 'English, Spanish', '(714) 843-0189', 'marisol@iep-ayuda.org', 'https://iep-ayuda.org'],
      ['adv-david', 'David Chen', 'Special Ed Law Advocate, JD (Non-practicing)', 12, '$195 / hour', 'san-francisco,alameda,santa-clara', 'English, Cantonese', '(415) 629-0211', 'dchen@bayareaiep.com', 'https://bayareaiep.com'],
      ['adv-elena', 'Elena Rostova', 'DDS/Regional Center & IEP Specialist', 8, '$110 / hour', 'sacramento,placer', 'English, Russian', '(916) 438-0273', 'elena@sacramentopedadvocate.com', 'https://elena@sacramentopedadvocate.com'],
      ['adv-katelyn', 'Katelyn Vance, BCBA', 'Behavior Specialist, Educational Advocate', 9, '$140 / hour', 'san-diego,riverside', 'English', '(619) 398-0304', 'kvance@sandiegoiep.com', 'https://bayareaiep.com']
    ];

    const seedTx = db.transaction(() => {
      for (const row of seedAdvocates) {
        insertAdvocate.run(...row);
      }
    });
    seedTx();
    console.log('⚡ Seeded California IEP Special Education Advocates.');
  }

  // Create program_waitlists table
  db.exec(`
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
    CREATE TABLE IF NOT EXISTS organizations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      organization_type TEXT NOT NULL,
      parent_organization_id TEXT,
      website TEXT,
      intake_phone TEXT,
      intake_email TEXT,
      source_url TEXT,
      source_type TEXT,
      data_origin TEXT,
      verification_status TEXT,
      last_verified_date TEXT,
      last_scraped_at TEXT,
      confidence_score REAL,
      notes TEXT
    );
    CREATE TABLE IF NOT EXISTS organization_program_links (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      program_id TEXT,
      listing_type TEXT NOT NULL,
      title TEXT NOT NULL,
      intake_model TEXT,
      service_summary TEXT,
      eligibility_summary TEXT,
      source_url TEXT,
      source_type TEXT,
      data_origin TEXT,
      verification_status TEXT,
      last_verified_date TEXT,
      last_scraped_at TEXT,
      confidence_score REAL
    );
    CREATE TABLE IF NOT EXISTS service_locations (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      location_name TEXT NOT NULL,
      location_type TEXT NOT NULL,
      address TEXT,
      city TEXT,
      state_id TEXT,
      postal_code TEXT,
      county_id TEXT,
      phone TEXT,
      email TEXT,
      website TEXT,
      appointment_url TEXT,
      hours_text TEXT,
      source_url TEXT,
      source_type TEXT,
      data_origin TEXT,
      verification_status TEXT,
      last_verified_date TEXT,
      last_scraped_at TEXT,
      confidence_score REAL
    );
    CREATE TABLE IF NOT EXISTS office_locations (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      office_name TEXT NOT NULL,
      office_type TEXT NOT NULL,
      address TEXT,
      city TEXT,
      state_id TEXT,
      postal_code TEXT,
      county_id TEXT,
      intake_phone TEXT,
      intake_email TEXT,
      website TEXT,
      hours_text TEXT,
      source_url TEXT,
      source_type TEXT,
      data_origin TEXT,
      verification_status TEXT,
      last_verified_date TEXT,
      last_scraped_at TEXT,
      confidence_score REAL
    );
    CREATE TABLE IF NOT EXISTS virtual_service_areas (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      program_link_id TEXT,
      area_type TEXT NOT NULL,
      area_name TEXT NOT NULL,
      state_id TEXT,
      coverage_notes TEXT,
      intake_model TEXT,
      source_url TEXT,
      source_type TEXT,
      data_origin TEXT,
      verification_status TEXT,
      last_verified_date TEXT,
      last_scraped_at TEXT,
      confidence_score REAL
    );
    CREATE TABLE IF NOT EXISTS virtual_service_area_counties (
      virtual_service_area_id TEXT,
      county_id TEXT,
      PRIMARY KEY (virtual_service_area_id, county_id)
    );
  `);

  // Seed program_waitlists if empty
  const countWaitlists = db.prepare("SELECT COUNT(*) as count FROM program_waitlists").get() as { count: number };
  if (countWaitlists.count === 0) {
    const insertWaitlist = db.prepare(`
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

    const seedTx = db.transaction(() => {
      for (const row of seedWaitlists) {
        insertWaitlist.run(...row);
      }
    });
    seedTx();
    console.log('⚡ Seeded Dynamic California Program Waitlists metadata.');
  }

  // Create child_iep_accommodations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS child_iep_accommodations (
      id TEXT PRIMARY KEY,
      child_id TEXT NOT NULL,
      accommodation_id TEXT NOT NULL,
      FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE
    );
  `);

  // Create child_iep_goals table
  db.exec(`
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
  db.exec(`
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

  // Create regional_education_agencies table and selpas view
  db.exec(`
    CREATE TABLE IF NOT EXISTS regional_education_agencies (
      id TEXT PRIMARY KEY,
      state_id TEXT NOT NULL REFERENCES states(id),
      agency_type TEXT NOT NULL,
      name TEXT NOT NULL,
      counties_served TEXT NOT NULL,
      website TEXT NOT NULL
    );

    CREATE VIEW IF NOT EXISTS selpas AS
    SELECT id, name, counties_served, website, source_url, source_type, data_origin, verification_status, last_verified_date, last_scraped_at, confidence_score
    FROM regional_education_agencies;
  `);

  // Seed regional_education_agencies if empty
  const countAgencies = db.prepare("SELECT COUNT(*) as count FROM regional_education_agencies WHERE agency_type = 'selpa'").get() as { count: number };
  if (countAgencies.count === 0) {
    const insertAgency = db.prepare(`
      INSERT INTO regional_education_agencies (id, state_id, agency_type, name, counties_served, website)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const seedSelpas = [
      ['selpa-la', 'california', 'selpa', 'Los Angeles Unified SELPA', 'los-angeles', 'https://achieve.lausd.net/Page/1669'],
      ['selpa-orange', 'california', 'selpa', 'Orange County SELPA', 'orange', 'https://ocde.us/SpecialEducation/Pages/SELPA.aspx'],
      ['selpa-sf', 'california', 'selpa', 'San Francisco Unified SELPA', 'san-francisco', 'https://www.sfusd.edu/special-education/selpa'],
      ['selpa-sd', 'california', 'selpa', 'San Diego Unified SELPA', 'san-diego', 'https://sandiegounified.org/selpa'],
      ['selpa-alameda', 'california', 'selpa', 'Alameda County SELPA', 'alameda', 'https://www.acoe.org/selpa'],
      ['selpa-santa-clara', 'california', 'selpa', 'Santa Clara County SELPA', 'santa-clara', 'https://www.sccoe.org/selpa'],
      ['selpa-sacramento', 'california', 'selpa', 'Sacramento County SELPA', 'sacramento', 'https://www.scoe.net/selpa']
    ];

    const seedTx = db.transaction(() => {
      for (const row of seedSelpas) {
        insertAgency.run(...row);
      }
    });
    seedTx();
    console.log('⚡ Seeded California SELPAs local plan areas into regional_education_agencies.');
  }

  // Seed/Sync conditions and program rules if count is not 78
  const countConditions = db.prepare("SELECT COUNT(*) as count FROM conditions").get() as { count: number };
  if (countConditions.count !== 78) {
    console.log(`⚡ Conditions count is ${countConditions.count}, expected 78. Re-seeding taxonomy conditions & eligibility rules...`);
    
    const seedCondTx = db.transaction(() => {
      // 1. Clear old conditions and rules associated with conditions
      db.prepare("DELETE FROM child_profile_conditions").run();
      db.prepare("DELETE FROM conditions").run();
      db.prepare("DELETE FROM program_eligibility_rules WHERE required_condition IS NOT NULL").run();

      // 2. Insert all 78 conditions
      const insertCond = db.prepare(`
        INSERT INTO conditions 
        (id, name, aliases, parent_friendly_explanation, regional_center_relevance, iep_relevance, ccs_relevance, ssi_relevance, cal_able_relevance, age_specific_notes, source_url, last_verified_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const insertRule = db.prepare(`
        INSERT OR IGNORE INTO program_eligibility_rules 
        (id, program_id, min_age_years, max_age_years, required_condition, required_need, insurance_status, school_status, trigger_reason)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const cond of DIAGNOSES_DETAILS) {
        insertCond.run(
          cond.id,
          cond.name,
          cond.aliases,
          cond.parent_friendly_explanation,
          cond.regional_center_relevance,
          cond.iep_relevance,
          cond.ccs_relevance,
          cond.ssi_relevance,
          cond.cal_able_relevance,
          cond.age_specific_notes,
          cond.source_url,
          cond.last_verified_date
        );

        // Generate rules dynamically for this condition!
        // A. Regional Center (Lanterman) rule if rc relevant
        if (cond.regional_center_relevance === 1) {
          insertRule.run(
            `rule-rc-${cond.id}`,
            'regional-centers',
            3.0,
            120.0,
            cond.id,
            null,
            'any',
            'any',
            `${cond.name} is a qualifying condition (or associated developmental delay category) under the Lanterman Act for California Regional Centers.`
          );
        }

        // B. CCS rule if ccs relevant
        if (cond.ccs_relevance === 1) {
          insertRule.run(
            `rule-ccs-${cond.id}`,
            'california-childrens-services',
            0.0,
            21.0,
            cond.id,
            null,
            'any',
            'any',
            `${cond.name} is medically eligible for CCS specialized physician care and school-based Medical Therapy Program (MTP) physical/occupational therapies.`
          );
        }

        // C. SSI rule if ssi relevant
        if (cond.ssi_relevance === 1) {
          const reason = cond.id === 'down-syndrome-trisomy-21'
            ? 'Down Syndrome automatically satisfies the childhood disability medical listing (Listing 110.06) for cash benefits.'
            : `Assessments for ${cond.name} check for marked and severe functional limitations under childhood SSI guidelines.`;
          
          insertRule.run(
            `rule-ssi-${cond.id}`,
            'ssi-for-children',
            0.0,
            18.0,
            cond.id,
            null,
            'any',
            'any',
            reason
          );
        }

        // D. CalABLE rule if cal_able relevant
        if (cond.cal_able_relevance === 1) {
          insertRule.run(
            `rule-able-${cond.id}`,
            'calable',
            0.0,
            120.0,
            cond.id,
            null,
            'any',
            'any',
            `Disability onset of ${cond.name} before age 26 qualifies for a tax-advantaged CalABLE savings account.`
          );
        }

        // E. Early Start rule if RC/CCS/Speech relevant and under age 3
        if (cond.regional_center_relevance === 1 || cond.ccs_relevance === 1 || cond.id.includes('speech-and-language-delay') || cond.id.includes('apraxia')) {
          insertRule.run(
            `rule-es-${cond.id}`,
            'early-start',
            0.0,
            3.0,
            cond.id,
            null,
            'any',
            'any',
            `Child is under age 3 and has an established high-risk condition (${cond.name}); Early Start intervention is highly recommended.`
          );
        }
      }
    });
    seedCondTx();
    console.log(`⚡ Seeded 78 Taxonomy Conditions & eligibility rules in SQLite.`);
  }

  // Create directory_reviews table for county directory community review system
  db.exec(`
    CREATE TABLE IF NOT EXISTS directory_reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      entity_name TEXT NOT NULL,
      county_id TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
      comment TEXT NOT NULL,
      reviewer_label TEXT NOT NULL DEFAULT 'Parent',
      experience_type TEXT,
      helpful_count INTEGER DEFAULT 0,
      user_id TEXT,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_directory_reviews_entity ON directory_reviews(entity_type, entity_id);
    CREATE INDEX IF NOT EXISTS idx_directory_reviews_county ON directory_reviews(county_id);
  `);

  // Add directory_reviews user_id column if it doesn't exist
  const reviewsTableInfo = db.prepare("PRAGMA table_info(directory_reviews)").all() as { name: string }[];
  const reviewsColumnNames = reviewsTableInfo.map(col => col.name);
  if (!reviewsColumnNames.includes('user_id')) {
    db.exec("ALTER TABLE directory_reviews ADD COLUMN user_id TEXT;");
  }

  // Create regional_center_counties junction table
  db.exec(`
    CREATE TABLE IF NOT EXISTS regional_center_counties (
      regional_center_id TEXT,
      county_id TEXT,
      PRIMARY KEY (regional_center_id, county_id),
      FOREIGN KEY (regional_center_id) REFERENCES state_resource_agencies(id) ON DELETE CASCADE,
      FOREIGN KEY (county_id) REFERENCES counties(id) ON DELETE CASCADE
    );
  `);

  // Create selpa_counties junction table
  db.exec(`
    CREATE TABLE IF NOT EXISTS selpa_counties (
      selpa_id TEXT,
      county_id TEXT,
      PRIMARY KEY (selpa_id, county_id),
      FOREIGN KEY (selpa_id) REFERENCES regional_education_agencies(id) ON DELETE CASCADE,
      FOREIGN KEY (county_id) REFERENCES counties(id) ON DELETE CASCADE
    );
  `);

  // Create iep_advocate_counties junction table
  db.exec(`
    CREATE TABLE IF NOT EXISTS iep_advocate_counties (
      iep_advocate_id TEXT,
      county_id TEXT,
      PRIMARY KEY (iep_advocate_id, county_id),
      FOREIGN KEY (iep_advocate_id) REFERENCES iep_advocates(id) ON DELETE CASCADE,
      FOREIGN KEY (county_id) REFERENCES counties(id) ON DELETE CASCADE
    );
  `);

  // Create safety_incidents table
  db.exec(`
    CREATE TABLE IF NOT EXISTS safety_incidents (
      id TEXT PRIMARY KEY,
      child_id TEXT NOT NULL,
      time TEXT NOT NULL,
      category TEXT NOT NULL,
      risk_level TEXT NOT NULL,
      details TEXT NOT NULL,
      intervention TEXT NOT NULL,
      FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE
    );
  `);

  // Create parent_declarations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS parent_declarations (
      child_id TEXT PRIMARY KEY,
      declaration_text TEXT,
      doctor_name TEXT,
      FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE
    );
  `);

  // Create caregiver_profiles table
  db.exec(`
    CREATE TABLE IF NOT EXISTS caregiver_profiles (
      user_id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT,
      phone TEXT,
      address TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Create child_transition_tasks table
  db.exec(`
    CREATE TABLE IF NOT EXISTS child_transition_tasks (
      child_id TEXT,
      task_id TEXT,
      PRIMARY KEY (child_id, task_id),
      FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE
    );
  `);

  // Create caregiver_selfcare_logs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS caregiver_selfcare_logs (
      child_id TEXT PRIMARY KEY,
      mon INTEGER DEFAULT 0,
      tue INTEGER DEFAULT 0,
      wed INTEGER DEFAULT 0,
      thu INTEGER DEFAULT 0,
      fri INTEGER DEFAULT 0,
      sat INTEGER DEFAULT 0,
      sun INTEGER DEFAULT 0,
      FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE
    );
  `);

  // Create child_coordinators table
  db.exec(`
    CREATE TABLE IF NOT EXISTS child_coordinators (
      child_id TEXT PRIMARY KEY,
      coordinator_name TEXT,
      FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE
    );
  `);

  // Migrate existing regional_centers counties_served to regional_center_counties
  const rcCount = db.prepare("SELECT COUNT(*) as count FROM regional_center_counties").get() as { count: number };
  if (rcCount.count === 0) {
    const rcs = db.prepare("SELECT id, counties_served FROM regional_centers").all() as { id: string, counties_served: string }[];
    const insertRcCounty = db.prepare("INSERT OR IGNORE INTO regional_center_counties (regional_center_id, county_id) VALUES (?, ?)");
    db.transaction(() => {
      for (const rc of rcs) {
        if (!rc.counties_served) continue;
        const counties = rc.counties_served.split(',').map(c => c.trim()).filter(Boolean);
        for (const c of counties) {
          insertRcCounty.run(rc.id, c);
        }
      }
    })();
  }

  // Migrate existing selpas counties_served to selpa_counties
  const selpaCount = db.prepare("SELECT COUNT(*) as count FROM selpa_counties").get() as { count: number };
  if (selpaCount.count === 0) {
    const selpas = db.prepare("SELECT id, counties_served FROM selpas").all() as { id: string, counties_served: string }[];
    const insertSelpaCounty = db.prepare("INSERT OR IGNORE INTO selpa_counties (selpa_id, county_id) VALUES (?, ?)");
    db.transaction(() => {
      for (const selpa of selpas) {
        if (!selpa.counties_served) continue;
        const counties = selpa.counties_served.split(',').map(c => c.trim()).filter(Boolean);
        for (const c of counties) {
          insertSelpaCounty.run(selpa.id, c);
        }
      }
    })();
  }

  // Migrate existing iep_advocates counties_served to iep_advocate_counties
  const advocateCount = db.prepare("SELECT COUNT(*) as count FROM iep_advocate_counties").get() as { count: number };
  if (advocateCount.count === 0) {
    const advocates = db.prepare("SELECT id, counties_served FROM iep_advocates").all() as { id: string, counties_served: string }[];
    const insertAdvocateCounty = db.prepare("INSERT OR IGNORE INTO iep_advocate_counties (iep_advocate_id, county_id) VALUES (?, ?)");
    db.transaction(() => {
      for (const adv of advocates) {
        if (!adv.counties_served) continue;
        const counties = adv.counties_served.split(',').map(c => c.trim()).filter(Boolean);
        for (const c of counties) {
          insertAdvocateCounty.run(adv.id, c);
        }
      }
    })();
  }

  
  // Create caregiver_financial_profiles table
  db.exec(`
    CREATE TABLE IF NOT EXISTS caregiver_financial_profiles (
      child_id TEXT PRIMARY KEY,
      savings REAL DEFAULT 0,
      funding_source TEXT,
      expected_balance TEXT,
      spending_timeline TEXT,
      is_rc_client INTEGER DEFAULT 0,
      has_diagnosis INTEGER DEFAULT 0,
      major_limitations INTEGER DEFAULT 0,
      has_medical_needs INTEGER DEFAULT 0,
      child_medi_cal INTEGER DEFAULT 0,
      family_size INTEGER DEFAULT 3,
      gross_income REAL DEFAULT 0,
      rc_children INTEGER DEFAULT 1,
      FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE
    );
  `);

  // Create child_waitlist_items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS child_waitlist_items (
      id TEXT PRIMARY KEY,
      child_id TEXT NOT NULL,
      provider_name TEXT NOT NULL,
      service_category TEXT NOT NULL,
      date_joined TEXT,
      position TEXT,
      contact_phone TEXT,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'waiting',
      FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE
    );
  `);

  // Create child_iep_prep_data table
  db.exec(`
    CREATE TABLE IF NOT EXISTS child_iep_prep_data (
      child_id TEXT PRIMARY KEY,
      strengths TEXT,
      academic_concerns TEXT,
      speech_concerns TEXT,
      sensory_concerns TEXT,
      motor_concerns TEXT,
      social_concerns TEXT,
      requested_services TEXT,
      parent_vision TEXT,
      FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE
    );
  `);

  // Create ihss_overtime_schedules table
  db.exec(`
    CREATE TABLE IF NOT EXISTS ihss_overtime_schedules (
      child_id TEXT PRIMARY KEY,
      feeding_rank INTEGER DEFAULT 1,
      bowel_rank INTEGER DEFAULT 1,
      bathing_rank INTEGER DEFAULT 1,
      dressing_rank INTEGER DEFAULT 1,
      ambulation_rank INTEGER DEFAULT 1,
      has_paramedical INTEGER DEFAULT 0,
      paramedical_hours REAL DEFAULT 0,
      paramedical_desc TEXT,
      requires_supervision INTEGER DEFAULT 1,
      ihss_wage REAL DEFAULT 18.00,
      recipient_count INTEGER DEFAULT 1,
      monthly_hours_1 REAL DEFAULT 120,
      monthly_hours_2 REAL DEFAULT 80,
      monthly_hours_3 REAL DEFAULT 0,
      weekly_travel_hours REAL DEFAULT 0,
      schedule_grid_json TEXT,
      FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS child_sdp_budgets (
      child_id TEXT PRIMARY KEY,
      pos_spend REAL DEFAULT 15000,
      one_time_deductions REAL DEFAULT 0,
      fms_model TEXT DEFAULT 'bill-payer',
      allocated_community REAL DEFAULT 5000,
      allocated_respite REAL DEFAULT 5000,
      allocated_therapies REAL DEFAULT 3000,
      allocated_equipment REAL DEFAULT 2000,
      unmet_needs_json TEXT,
      FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS knowledge_articles (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      title_es TEXT NOT NULL,
      subtitle_es TEXT NOT NULL,
      read_time TEXT NOT NULL,
      read_time_es TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      color TEXT NOT NULL,
      steps_json TEXT NOT NULL,
      steps_json_es TEXT NOT NULL
    );
  `);

  // Seed knowledge_articles if empty
  const countArticles = db.prepare("SELECT COUNT(*) as count FROM knowledge_articles").get() as { count: number };
  if (countArticles.count === 0) {
    const insertArticle = db.prepare(`
      INSERT INTO knowledge_articles (id, category, title, subtitle, title_es, subtitle_es, read_time, read_time_es, difficulty, color, steps_json, steps_json_es)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const seedArticles = [
      [
        'rc-intake',
        'Regional Center',
        'Preparing for Regional Center Intake',
        'How to navigate your first Lanterman Act intake meeting and maximize your child\'s eligibility assessment',
        'Preparación para la Admisión al Centro Regional',
        'Cómo navegar su primera reunión de admisión bajo la Ley Lanterman y maximizar la evaluación de elegibilidad de su hijo',
        '8 min read',
        '8 min de lectura',
        'Beginner',
        '#6366f1',
        JSON.stringify([
          {
            title: 'Understand what Regional Centers can fund',
            content: 'California\'s 21 Regional Centers are funded under the Lanterman Developmental Disabilities Services Act. They coordinate and pay for services for individuals with autism, cerebral palsy, intellectual disability, epilepsy, and "fifth category" (disabling conditions similar to intellectual disability that originate before age 18). Services include respite care, speech/OT/PT therapy, behavior intervention, adaptive equipment, transportation, and day programs.',
            tip: 'Regional Centers are the payor of LAST RESORT — this means they will try to redirect you to Medi-Cal, private insurance, or your school district first. You must exhaust those options (or show they don\'t apply) before the RC will fund services.',
            citation: 'California Welfare & Institutions Code § 4512'
          },
          {
            title: 'Gather your intake documentation BEFORE the appointment',
            content: 'Come prepared with: (1) Child\'s birth certificate and Social Security card, (2) Most recent diagnostic report from a licensed psychologist or physician (must name the qualifying diagnosis), (3) Medical records showing functional limitations, (4) Any prior IEP or school evaluation reports, (5) Immunization and medical history records.',
            warning: 'A diagnosis alone is not sufficient. The RC evaluates FUNCTIONAL LIMITATIONS in areas like communication, self-care, mobility, and self-direction. Document specific examples of daily living challenges.'
          },
          {
            title: 'Know your statutory rights before the meeting',
            content: 'Under the Lanterman Act, the RC must: (1) Initiate intake within 15 days of your request, (2) Complete eligibility determination within 120 days, (3) Provide an interpreter at no cost if you are not English-proficient, (4) Give you a written Notice of Action (NOA) for any denial with your appeal rights.',
            citation: 'California Welfare & Institutions Code § 4642(a)'
          },
          {
            title: 'What happens at the intake meeting',
            content: 'You will meet with an intake coordinator who reviews documentation and completes a standardized assessment (often the Vineland Adaptive Behavior Scales or similar). They assess your child across 7 areas: self-care, receptive and expressive language, learning, mobility, self-direction, capacity for independent living, and economic self-sufficiency. Be specific and concrete — describe your child\'s WORST days, not average days.',
            tip: 'Bring a written narrative (1-2 pages) describing your child\'s daily functioning challenges. This becomes part of the permanent file and forces the coordinator to address your specific concerns.'
          },
          {
            title: 'If they deny eligibility — your appeal rights',
            content: 'You have 30 days to request a Fair Hearing from the Office of Administrative Hearings (OAH) if you disagree with the eligibility denial or any service decision. You may also request a State Mediation (informal, faster) as an alternative. During an appeal, your current services cannot be reduced until the hearing is resolved ("Aid Paid Pending" protection).',
            warning: 'Missing the 30-day appeal window means you must restart the intake process. Track the date on your Notice of Action carefully.',
            citation: 'California Welfare & Institutions Code § 4710.5'
          },
          {
            title: 'After approval: Your Individual Program Plan (IPP)',
            content: 'Once eligible, the RC must develop an Individual Program Plan (IPP) with you within 60 days of eligibility. The IPP documents your child\'s goals and what services the RC will fund. You are a REQUIRED member of the IPP team — the RC cannot finalize an IPP without your input. Request a copy in writing after every meeting.',
            tip: 'Request that your IPP be reviewed at least annually or any time your child\'s needs change significantly. There is no limit to how often you can request an IPP review.'
          }
        ]),
        JSON.stringify([
          {
            title: 'Comprender lo que los Centros Regionales pueden financiar',
            content: 'Los 21 Centros Regionales de California están financiados bajo la Ley de Servicios para Personas con Discapacidades del Desarrollo Lanterman. Coordinan y pagan servicios para personas con autismo, parálisis cerebral, discapacidad intelectual, epilepsia y la "quinta categoría" (condiciones discapacitantes similares a la discapacidad intelectual que se originan antes de los 18 años). Los servicios incluyen cuidado de relevo (respite), terapias de lenguaje/OT/PT, intervención conductual, equipo adaptativo, transporte y programas diurnos.',
            tip: 'Los Centros Regionales son el pagador de ÚLTIMO RECURSO; esto significa que intentarán redirigirlo primero a Medi-Cal, seguro privado o su distrito escolar. Debe agotar esas opciones antes de que el Centro Regional financie los servicios.',
            citation: 'Código de Bienestar e Instituciones de California § 4512'
          },
          {
            title: 'Reunir su documentación de admisión ANTES de la cita',
            content: 'Venga preparado con: (1) Acta de nacimiento y tarjeta de Seguro Social del niño, (2) Informe de diagnóstico más reciente de un psicólogo o médico certificado (debe nombrar el diagnóstico calificado), (3) Registros médicos que muestren limitaciones funcionales, (4) Informes previos de IEP o evaluaciones escolares, (5) Registros de vacunación e historial médico.',
            warning: 'Un diagnóstico por sí solo no es suficiente. El Centro Regional evalúa las LIMITACIONES FUNCIONALES en áreas como comunicación, cuidado personal, movilidad y autodirección. Documente ejemplos específicos de desafíos de la vida diaria.'
          },
          {
            title: 'Conocer sus derechos legales antes de la reunión',
            content: 'Bajo la Ley Lanterman, el Centro Regional debe: (1) Iniciar la admisión dentro de los 15 días de su solicitud, (2) Completar la determinación de elegibilidad dentro de los 120 días, (3) Proporcionar un intérprete sin costo si no domina el inglés, (4) Entregarle un Aviso de Acción (NOA) por escrito para cualquier denegación con sus derechos de apelación.',
            citation: 'Código de Bienestar e Instituciones de California § 4642(a)'
          },
          {
            title: 'Qué sucede en la reunión de admisión',
            content: 'Se reunirá con un coordinador de admisión que revisará la documentación y completará una evaluación estandarizada (a menudo las Escalas de Conducta Adaptativa Vineland o similar). Evalúan a su hijo en 7 áreas: cuidado personal, lenguaje receptivo y expresivo, aprendizaje, movilidad, autodirección, capacidad para la vida independiente y autosuficiencia económica. Sea específico y concreto: describa los PEORES días de su hijo, no los días promedio.',
            tip: 'Traiga una narrativa escrita (1-2 páginas) que describa los desafíos de funcionamiento diario de su hijo. Esto se convierte en parte del expediente permanente y obliga al coordinador a abordar sus preocupaciones específicas.'
          },
          {
            title: 'Si le niegan la elegibilidad: sus derechos de apelación',
            content: 'Tiene 30 días para solicitar una Audiencia Imparcial ante la Oficina de Audiencias Administrativas (OAH) si no está de acuerdo con la denegación de elegibilidad o cualquier decisión de servicio. También puede solicitar una Mediación Estatal (informal, más rápida) como alternativa. Durante una apelación, sus servicios actuales no pueden reducirse hasta que se resuelva la audiencia (protección de "Ayuda Pagada Pendiente").',
            warning: 'Perder el plazo de apelación de 30 días significa que debe reiniciar el proceso de admisión. Realice un seguimiento cuidadoso de la fecha en su Aviso de Acción.',
            citation: 'Código de Bienestar e Instituciones de California § 4710.5'
          },
          {
            title: 'Después de la aprobación: Su Plan de Programa Individual (IPP)',
            content: 'Una vez elegible, el Centro Regional debe desarrollar un Plan de Programa Individual (IPP) con usted dentro de los 60 días de la elegibilidad. El IPP documenta las metas de su hijo y qué servicios financiará el Centro Regional. Usted es un miembro REQUERIDO del equipo del IPP; el Centro Regional no puede finalizar un IPP sin su opinión. Solicite una copia por escrito después de cada reunión.',
            tip: 'Solicite que su IPP se revise al menos anualmente o en cualquier momento en que las necesidades de su hijo cambien significativamente. No hay límite en la frecuencia con la que puede solicitar una revisión del IPP.'
          }
        ])
      ],
      [
        'iep-meeting',
        'IEP',
        'Mastering the IEP Process',
        'How to prepare for IEP meetings, exercise your rights as an equal team member, and push back on inadequate placements',
        'Dominar el Proceso del IEP',
        'Cómo prepararse para las reuniones del IEP, ejercer sus derechos como miembro igualitario del equipo y rechazar colocaciones inadecuadas',
        '10 min read',
        '10 min de lectura',
        'Intermediate',
        '#0ea5e9',
        JSON.stringify([
          {
            title: 'Your rights as an IEP team member',
            content: 'Under the Individuals with Disabilities Education Act (IDEA) and California Education Code, you are an EQUAL team member with every right to: disagree with assessments, propose different placements or goals, bring any individual to the meeting (advocate, therapist, friend), record the meeting (with 24-hour written notice in California), and reject any part of the IEP in writing.',
            tip: 'The school district CANNOT hold an IEP meeting or finalize an IEP without you. You have the absolute right to reschedule if the meeting time is inconvenient.',
            citation: 'IDEA 20 U.S.C. § 1414(d); California Ed Code § 56341'
          },
          {
            title: 'Prepare your parent statement in writing before the meeting',
            content: 'Write a 1-2 page "Parent\'s Concerns and Vision" statement before each IEP meeting. Include: specific skill deficits you observe at home, safety concerns, social/emotional needs, your vision for your child\'s long-term independence, and any services you are requesting. Hand a copy to each team member at the start of the meeting and request it be attached to the IEP.',
            tip: 'This statement becomes part of the official IEP record. It forces the team to formally respond to your concerns and creates documentation if you need to appeal later.'
          },
          {
            title: 'Understanding Least Restrictive Environment (LRE)',
            content: 'California and federal law require that children receive special education in the Least Restrictive Environment — meaning as much time as possible alongside non-disabled peers. Schools frequently push for more restrictive settings (self-contained classrooms) because they are cheaper. You have the right to demand a continuum of placement options be considered and documented.',
            warning: 'If the district recommends a more restrictive placement than you believe is appropriate, ask them to document in the IEP: (1) why inclusion with supports cannot meet your child\'s needs, and (2) what supplementary aids and services were considered.',
            citation: 'IDEA 20 U.S.C. § 1412(a)(5); California Ed Code § 56364'
          },
          {
            title: 'Requesting independent evaluations',
            content: 'If you disagree with the district\'s assessment, you have the right to request an Independent Educational Evaluation (IEE) at the district\'s expense. The district must either fund the IEE or file for a due process hearing to prove their own evaluation was appropriate. Common IEEs include: psychoeducational assessments, speech/language evaluations, OT/PT evaluations, and FBA (Functional Behavior Assessments).',
            citation: 'California Ed Code § 56329; 34 CFR § 300.502'
          },
          {
            title: 'When to disagree and how to document it',
            content: 'NEVER sign an IEP you disagree with under pressure. You may: (1) Sign only the attendance page (not consent), (2) Write "Parent does not consent" on the IEP before signing, (3) Submit a written disagreement letter within 5 school days, (4) Request a 30-day extension to review with an advocate. If you sign the IEP, you legally agree to the placement — districts know this and use meeting time pressure as a tactic.',
            warning: 'Signing the IEP in the meeting under pressure is the #1 mistake parents make. Take the document home. You have time.'
          },
          {
            title: 'Escalation: Filing a complaint or due process',
            content: 'Two formal escalation paths exist: (1) California Department of Education (CDE) Compliance Complaint — free to file, resolved within 60 days, covers procedural violations like missed timelines or failure to implement the IEP. (2) Office of Administrative Hearings (OAH) Due Process — formal legal hearing, can result in compensatory services or placement changes. Due process is expensive ($10,000–$40,000) unless you have an advocate or nonprofit legal representation.',
            tip: 'File a CDE compliance complaint FIRST for procedural violations. It\'s free, fast, and often resolves issues without needing due process.',
            citation: 'California Ed Code § 56501'
          }
        ]),
        JSON.stringify([
          {
            title: 'Sus derechos como miembro del equipo del IEP',
            content: 'Bajo la Ley de Educación para Personas con Discapacidades (IDEA) y el Código de Educación de California, usted es un miembro IGUALITARIO del equipo con derecho a: no estar de acuerdo con las evaluaciones, proponer colocaciones o metas diferentes, traer a cualquier persona a la reunión (defensor, terapeuta, amigo), grabar la reunión (con aviso por escrito de 24 horas en California) y rechazar cualquier parte del IEP por escrito.',
            tip: 'El distrito escolar NO PUEDE celebrar una reunión del IEP ni finalizar un IEP sin usted. Tiene el derecho absoluto de reprogramar si la hora de la reunión es inconveniente.',
            citation: 'IDEA 20 U.S.C. § 1414(d); Código de Educación de California § 56341'
          },
          {
            title: 'Preparar su declaración de los padres por escrito antes de la reunión',
            content: 'Escriba una declaración de 1 a 2 páginas de "Preocupaciones y Visión de los Padres" antes de cada reunión del IEP. Incluya: déficits de habilidades específicos que observa en el hogar, preocupaciones de seguridad, necesidades sociales/emocionales, su visión para la independencia a largo plazo de su hijo y cualquier servicio que esté solicitando. Entregue una copia a cada miembro del equipo al comienzo de la reunión y solicite que se adjunte al IEP.',
            tip: 'Esta declaración se convierte en parte del registro oficial del IEP. Obliga al equipo a responder formalmente a sus preocupaciones y crea documentación si necesita apelar más adelante.'
          },
          {
            title: 'Comprender el Entorno Menos Restrictivo (LRE)',
            content: 'La ley de California y la ley federal requieren que los niños reciban educación especial en el Entorno Menos Restrictivo, lo que significa el mayor tiempo posible junto a sus compañeros sin discapacidades. Las escuelas con frecuencia presionan por entornos más restrictivos (aulas especiales) porque son menos costosos para ellas. Tiene derecho a exigir que se considere y documente una continuidad de opciones de colocación.',
            warning: 'Si el distrito recomienda una colocación más restrictiva de lo que considera apropiado, pídales que documenten en el IEP: (1) por qué la inclusión con apoyos no puede satisfacer las necesidades de su hijo, y (2) qué ayudas y servicios suplementarios se consideraron.',
            citation: 'IDEA 20 U.S.C. § 1412(a)(5); Código de Ed de California § 56364'
          },
          {
            title: 'Solicitar evaluaciones independientes',
            content: 'Si no está de acuerdo con la evaluación del distrito, tiene derecho a solicitar una Evaluación Educativa Independiente (IEE) a expensas del distrito. El distrito debe financiar la IEE o presentar una solicitud de audiencia de debido proceso para demostrar que su propia evaluación fue apropiada. Las IEE comunes incluyen: evaluaciones psicoeducativas, evaluaciones del habla/lenguaje, evaluaciones de terapia ocupacional/física y FBA (Evaluaciones de Comportamiento Funcional).',
            citation: 'Código de Educación de California § 56329; 34 CFR § 300.502'
          },
          {
            title: 'Cuándo no estar de acuerdo y cómo documentarlo',
            content: 'NUNCA firme un IEP con el que no esté de acuerdo bajo presión. Puede: (1) Firmar solo la página de asistencia (no el consentimiento), (2) Escribir "El padre no da su consentimiento" en el IEP antes de firmar, (3) Enviar una carta de desacuerdo por escrito dentro de los 5 días escolares, (4) Solicitar una extensión de 30 días para revisar con un defensor. Si firma el IEP, acepta legalmente la colocación; los distritos saben esto y usan la presión del tiempo como táctica.',
            warning: 'Firmar el IEP en la reunión bajo presión es el error número 1 que cometen los padres. Lleve el documento a casa. Tiene tiempo.'
          },
          {
            title: 'Escalada: Presentar una queja o debido proceso',
            content: 'Existen dos caminos formales de escalada: (1) Queja de Cumplimiento del Departamento de Educación de California (CDE): gratuita, se resuelve dentro de los 60 días, cubre violaciones de procedimiento como incumplimiento de plazos o falta de implementación del IEP. (2) Audiencia de Debido Proceso de la OAH: audiencia legal formal que puede resultar en servicios compensatorios o cambios de colocación. El debido proceso es costoso ($10,000–$40,000) a menos que tenga un defensor o representación legal sin fines de lucro.',
            tip: 'Presente una queja de cumplimiento ante el CDE PRIMERO para violaciones de procedimiento. Es gratuita, rápida y a menudo resuelve los problemas sin necesidad de debido proceso.',
            citation: 'Código de Ed de California § 56501'
          }
        ])
      ],
      [
        'ihss-apply',
        'IHSS',
        'Applying for IHSS Protective Supervision',
        'How to secure paid parent caregiver hours for children with severe behavioral or safety impairments under IHSS',
        'Solicitar Supervisión Proactiva de IHSS',
        'Cómo asegurar horas remuneradas para padres cuidadores de niños con discapacidades cognitivas o de comportamiento graves bajo IHSS',
        '9 min read',
        '9 min de lectura',
        'Intermediate',
        '#10b981',
        JSON.stringify([
          {
            title: 'What Protective Supervision actually means',
            content: 'IHSS Protective Supervision (PS) pays a designated caregiver (including a parent) to provide continuous oversight to prevent injury for individuals who "are mentally impaired and cannot call for help or recognize danger." This is distinct from general personal care. For children with autism or intellectual disability, the key standard is that the child is "unable to direct their own care" due to cognitive impairment — not just a physical disability.',
            citation: 'California Welfare & Institutions Code § 12300(b); CDSS MPP § 30-756.17'
          },
          {
            title: 'What documentation you need',
            content: 'To qualify for Protective Supervision, your child\'s physician must complete the SOC 873 medical certification form. Beyond the SOC 873, you should also gather: (1) A physician\'s letter explicitly describing the child\'s inability to recognize and avoid danger, (2) Behavior therapy records noting elopement, self-injury, PICA, or aggression incidents, (3) School incident reports and IEP safety plans, (4) Your own written safety log documenting specific dangerous incidents with dates and times.',
            tip: 'Generic doctor notes saying "child has autism" are insufficient. The documentation must specifically describe HOW the child cannot recognize danger and what specific safety risks require 24/7 supervision.'
          },
          {
            title: 'What "unable to direct care" really means for the county',
            content: 'County social workers often apply the PS standard incorrectly, denying benefits by claiming the child "can ask for help" or "shows some awareness." To meet the standard, your documentation must show the child CANNOT: consistently recognize dangerous situations (traffic, strangers, heights), understand consequences of self-injurious behavior, summon help reliably, or self-regulate to prevent injury.',
            warning: 'Social workers sometimes frame elopement or self-harm as "behavioral problems" rather than safety supervision needs. Push back by emphasizing COGNITIVE inability to recognize danger — not behavior management.'
          },
          {
            title: 'The county assessment home visit',
            content: 'A county social worker will visit your home for an assessment. During this visit: (1) Do NOT tidy up or hide safety equipment — let the social worker see the real environment (door alarms, cabinet locks, window guards). (2) Describe your child\'s behavior on their WORST days, not typical days. (3) Have your documentation packet ready to hand over. (4) If possible, have your child present so the worker observes their functioning directly.',
            tip: 'Ask the social worker to document everything they observe during the home visit. If they don\'t write it down, it doesn\'t count.'
          },
          {
            title: 'If you receive a Notice of Action (NOA) denial or reduction',
            content: 'You have two critical deadlines: (1) FILE APPEAL WITHIN 10 DAYS to maintain "Aid Paid Pending" — this means your CURRENT hours stay active while the appeal is processed. (2) FILE APPEAL WITHIN 90 DAYS if you do not need Aid Paid Pending protection. Missing the 10-day window means you lose existing hours immediately while you wait for the hearing.',
            warning: 'The 10-day rule for Aid Paid Pending is the most commonly missed deadline in IHSS appeals. Mark the NOA date on a calendar the day you receive it.',
            citation: 'California Welfare & Institutions Code § 10950; CDSS MPP § 22-072'
          },
          {
            title: 'Preparing for the State Fair Hearing',
            content: 'At the OAH hearing, an Administrative Law Judge (ALJ) reviews evidence. Key strategies: (1) Bring objective, third-party evidence — medical records, therapy notes, school incident logs, behavioral assessments. The ALJ heavily discounts parent testimony alone. (2) Have your treating physician or behavior therapist provide a letter or, ideally, testimony. (3) Bring a printout of your IHSS Behavior Log (generated through this platform) as your incident evidence.',
            tip: 'Request all county records about your child\'s case before the hearing (Public Records Act request). You are entitled to see what the county submitted as evidence and can challenge inaccuracies.'
          }
        ]),
        JSON.stringify([
          {
            title: 'Qué significa realmente la Supervisión Proactiva',
            content: 'La Supervisión Proactiva (Protective Supervision - PS) de IHSS paga a un cuidador designado (incluido un padre) para proporcionar supervisión continua para evitar lesiones a personas que "tienen un deterioro mental y no pueden pedir ayuda o reconocer el peligro". Esto es diferente del cuidado personal general. Para niños con autismo o discapacidad intelectual, el estándar clave es que el niño es "incapaz de dirigir su propio cuidado" debido a un deterioro cognitivo, no solo una discapacidad física.',
            citation: 'Código de Bienestar e Instituciones de California § 12300(b); CDSS MPP § 30-756.17'
          },
          {
            title: 'Qué documentación necesita',
            content: 'Para calificar para la Supervisión Proactiva, el médico de su hijo debe completar el formulario de certificación médica SOC 873. Más allá del SOC 873, debe reunir: (1) Una carta del médico que describa explícitamente la incapacidad del niño para reconocer y evitar el peligro, (2) Registros de terapia de comportamiento que indiquen incidentes de fuga (elopement), autolesión, PICA o agresión, (3) Informes de incidentes escolares y planes de seguridad del IEP, (4) Su propio registro de seguridad por escrito que documente incidentes peligrosos específicos con fechas y horas.',
            tip: 'Las notas médicas genéricas que dicen "el niño tiene autismo" son insuficientes. La documentación debe describir específicamente CÓMO el niño no puede reconocer el peligro y qué riesgos específicos de seguridad requieren supervisión las 24 horas, los 7 días de la semana.'
          },
          {
            title: 'Qué significa realmente "incapaz de dirigir el cuidado" para el condado',
            content: 'Los trabajadores sociales del condado a menudo aplican incorrectamente el estándar de PS, denegando los beneficios al afirmar que el niño "puede pedir ayuda" o "muestra cierta conciencia". Para cumplir con el estándar, su documentación debe mostrar que el niño NO PUEDE: reconocer consistentemente situaciones peligrosas (tráfico, extraños, alturas), comprender las consecuencias del comportamiento autolesivo, pedir ayuda de manera confiable o autorregularse para evitar lesiones.',
            warning: 'Los trabajadores sociales a veces enmarcan la fuga o la autolesión como "problemas de comportamiento" en lugar de necesidades de supervisión de seguridad. Presione enfatizando la incapacidad COGNITIVA para reconocer el peligro, no el manejo del comportamiento.'
          },
          {
            title: 'La visita domiciliaria de evaluación del condado',
            content: 'Un trabajador social del condado visitará su hogar para una evaluación. Durante esta visita: (1) NO ordene ni esconda el equipo de seguridad; deje que el trabajador social vea el entorno real (alarmas de puertas, cerraduras de gabinetes, protectores de ventanas). (2) Describa el comportamiento de su hijo en sus PEORES días, no en los días típicos. (3) Tenga su paquete de documentación listo para entregar. (4) Si es posible, tenga a su hijo presente para que el trabajador observe su funcionamiento directamente.',
            tip: 'Pídale al trabajador social que documente todo lo que observe durante la visita domiciliaria. Si no lo escriben, no cuenta.'
          },
          {
            title: 'Si recibe una denegación o reducción por Aviso de Acción (NOA)',
            content: 'Tiene dos plazos críticos: (1) PRESENTE LA APELACIÓN DENTRO DE LOS 10 DÍAS para mantener la "Ayuda Pagada Pendiente" (Aid Paid Pending): esto significa que sus horas ACTUALES permanecen activas mientras se procesa la apelación. (2) PRESENTE LA APELACIÓN DENTRO DE LOS 90 DÍAS si no necesita la protección de Ayuda Pagada Pendiente. Perder el plazo de 10 días significa que pierde las horas existentes de inmediato mientras espera la audiencia.',
            warning: 'La regla de los 10 días para la Ayuda Pagada Pendiente es el plazo que más se pierde en las apelaciones de IHSS. Marque la fecha del NOA en un calendario el día que lo reciba.',
            citation: 'Código de Bienestar e Instituciones de California § 10950; CDSS MPP § 22-072'
          },
          {
            title: 'Preparación para la Audiencia Imparcial del Estado',
            content: 'En la audiencia de la OAH, un Juez de Derecho Administrativo (ALJ) revisa la evidencia. Estrategias clave: (1) Traiga evidencia objetiva de terceros: registros médicos, notas de terapia, registros de incidentes escolares, evaluaciones de comportamiento. El juez descuenta en gran medida el testimonio de los padres por sí solo. (2) Pida a su médico tratante o terapeuta de comportamiento que proporcione una carta o, idealmente, testimonio. (3) Traiga una copia impresa de su Registro de Comportamiento de IHSS.',
            tip: 'Solicite todos los registros del condado sobre el caso de su hijo antes de la audiencia (solicitud bajo la Ley de Registros Públicos). Tiene derecho a ver lo que el condado presentó como evidencia y puede impugnar las inexactitudes.'
          }
        ])
      ],
      [
        'appeals-guide',
        'Appeals',
        'Filing a State Fair Hearing Appeal',
        'Step-by-step guide to contesting IHSS, Regional Center, and Medi-Cal denials at the Office of Administrative Hearings',
        'Presentar una Apelación de Audiencia Imparcial',
        'Guía paso a paso para impugnar denegaciones de IHSS, Centro Regional y Medi-Cal ante la Oficina de Audiencias Administrativas',
        '7 min read',
        '7 min de lectura',
        'Advanced',
        '#f59e0b',
        JSON.stringify([
          {
            title: 'When to file and which agency to contact',
            content: 'State Fair Hearings are adjudicated by the California Office of Administrative Hearings (OAH) for IHSS and Medi-Cal cases, and by the Office of Administrative Hearings as well for Regional Center disputes. For IEP/school disputes, the same OAH handles "due process" hearings under the Education Code. You can request a hearing by calling 1-800-952-5253 or filing online at cdss.ca.gov/fair-hearings.',
            citation: 'California Welfare & Institutions Code § 10950; California Ed Code § 56501'
          },
          {
            title: 'The most critical deadlines',
            content: 'IHSS/Medi-Cal: 90 days from the NOA date to file a Fair Hearing. 10 days for Aid Paid Pending protection. Regional Center: 30 days from the written Notice of Action. IEP Due Process: 2 years from the date you knew or should have known about the violation (with exceptions for active concealment). California CDE Complaint: 1 year from the violation.',
            warning: 'These deadlines are ABSOLUTE — courts have upheld dismissals for hearings filed even 1 day late. Confirm the exact date on your Notice of Action and calculate your deadline immediately.'
          },
          {
            title: 'Preparing your evidence packet',
            content: 'Organize your evidence into a tabbed binder: Tab 1 — The denial Notice of Action. Tab 2 — Medical records and physician letters specifically addressing the eligibility criteria. Tab 3 — Therapy records (ABA, speech, OT). Tab 4 — Behavior logs and incident reports. Tab 5 — School records (IEPs, assessments, incident reports). Tab 6 — Any written communications with the agency. Provide 3 copies: one for yourself, one for the ALJ, one for the opposing agency representative.',
            tip: 'Ask your treating providers to write letters that use the EXACT statutory language from the relevant code section. A physician who writes "this child requires 24-hour protective supervision as defined under Welfare & Institutions Code § 12300(b)" is far more persuasive than one who writes "the child needs constant supervision."'
          },
          {
            title: 'At the hearing',
            content: 'You will appear before an Administrative Law Judge (ALJ) either in person or by phone/video. The hearing follows a semi-formal process: opening statements, county presents their case, you cross-examine their witness, you present your evidence, county cross-examines. You may represent yourself (pro per) or have an advocate or attorney. Non-attorney representatives are allowed at Fair Hearings.',
            tip: 'Request a Spanish or other-language interpreter in advance if needed — this is your right at no cost.'
          },
          {
            title: 'After the decision',
            content: 'The ALJ issues a proposed decision, which the agency Director must adopt, reject, or modify within 35 days (IHSS/Medi-Cal) or 30 days (Regional Center). If you win, services must be restored retroactively. If you lose, you may appeal to the Superior Court (writ of mandamus) within 90 days of the final agency decision. Free legal help is available through: Disability Rights California (1-800-776-5746), Regional Center Client Rights Advocates, COPAA member attorneys.',
            citation: 'California Welfare & Institutions Code § 10960; Government Code § 11517'
          }
        ]),
        JSON.stringify([
          {
            title: 'Cuándo presentar y a qué agencia contactar',
            content: 'Las Audiencias Imparciales del Estado son adjudicadas por la Oficina de Audiencias Administrativas (OAH) de California para casos de IHSS y Medi-Cal, y también por la OAH para disputas del Centro Regional. Para disputas de IEP/escolares, la misma OAH maneja las audiencias de "debido proceso" bajo el Código de Educación. Puede solicitar una audiencia llamando al 1-800-952-5253 o presentando su solicitud en línea en cdss.ca.gov/fair-hearings.',
            citation: 'Código de Bienestar e Instituciones de California § 10950; Código de Ed de California § 56501'
          },
          {
            title: 'Los plazos más críticos',
            content: 'IHSS/Medi-Cal: 90 días desde la fecha del NOA para presentar una Audiencia Imparcial. 10 días para la protección de Ayuda Pagada Pendiente. Centro Regional: 30 días desde el Aviso de Acción por escrito. Debido Proceso del IEP: 2 años a partir de la fecha en que conoció o debería haber conocido la violación (con excepciones por ocultamiento activo). Queja del CDE de California: 1 año desde la violación.',
            warning: 'Estos plazos son ABSOLUTOS: los tribunales han confirmado las desestimaciones de audiencias presentadas incluso 1 día tarde. Confirme la fecha exacta en su Aviso de Acción y calcule su plazo de inmediato.'
          },
          {
            title: 'Preparar su paquete de pruebas',
            content: 'Organice sus pruebas en una carpeta con pestañas: Pestaña 1 — El Aviso de Acción de denegación. Pestaña 2 — Registros médicos y cartas del médico que aborden específicamente los criterios de elegibilidad. Pestaña 3 — Registros de terapia (ABA, habla, OT). Pestaña 4 — Registros de comportamiento e informes de incidentes. Pestaña 5 — Registros escolares (IEP, evaluaciones, informes de incidentes). Proporcione 3 copias: una para usted, otra para el juez y otra para el representante de la agencia opositora.',
            tip: 'Pida a sus proveedores tratantes que escriban cartas que utilicen el lenguaje legal EXACTO de la sección del código correspondiente. Un médico que escribe "este niño requiere supervisión de seguridad las 24 horas como se define en el Código de Bienestar e Instituciones § 12300(b)" es mucho más persuasivo que uno que escribe "el niño necesita supervisión constante".'
          },
          {
            title: 'Durante la audiencia',
            content: 'Aparecerá ante un Juez de Derecho Administrativo (ALJ) en persona o por teléfono/video. La audiencia sigue un proceso semi-formal: declaraciones de apertura, el condado presenta su caso, usted interroga a su testigo, usted presenta sus pruebas y el condado realiza el contrainterrogatorio. Puede representarse a sí mismo (pro per) o contar con un defensor o abogado. Se permiten representantes que no sean abogados en las Audiencias Imparciales.',
            tip: 'Solicite un intérprete de español u otro idioma con anticipación si es necesario: este es su derecho sin costo alguno.'
          },
          {
            title: 'Después de la decisión',
            content: 'El juez emite una decisión propuesta, que el director de la agencia debe adoptar, rechazar o modificar dentro de los 35 días (IHSS/Medi-Cal) o 30 días (Centro Regional). Si gana, los servicios deben restablecerse retroactivamente. Si pierde, puede apelar ante el Tribunal Superior (orden de mandato) dentro de los 90 días de la decisión final de la agencia. Hay ayuda legal gratuita disponible a través de: Disability Rights California (1-800-776-5746) y defensores de derechos del cliente de los Centros Regionales.',
            citation: 'Código de Bienestar e Instituciones de California § 10960; Código de Gobierno § 11517'
          }
        ])
      ],
      [
        'self-determination',
        'SDP',
        'Transitioning to Self-Determination Program',
        'Understanding the SDP spending plan, FMS selection, and avoiding the common pitfalls of the transition',
        'Transición al Programa de Autodeterminación',
        'Comprender el plan de gastos del SDP, la selección de FMS y cómo evitar los errores comunes de la transición',
        '8 min read',
        '8 min de lectura',
        'Advanced',
        '#8b5cf6',
        JSON.stringify([
          {
            title: 'What the Self-Determination Program (SDP) is',
            content: 'SDP allows Regional Center consumers (or their families) to control an individualized budget and directly hire their own service providers, instead of working through RC-vendorized agencies. This gives enormous flexibility to hire bilingual providers, set specific schedules, and access less common supports. The program is overseen by the Dept. of Developmental Services and managed locally by each Regional Center.',
            citation: 'California Welfare & Institutions Code § 4685.8'
          },
          {
            title: 'The Individual Budget calculation',
            content: 'Your SDP budget is based on your current "Purchase of Service" (POS) spending from the Regional Center, adjusted by a statewide formula. You cannot receive more than a calculated maximum, but you can allocate the budget across any approved service categories differently than your current plan. Hire a Financial Management Service (FMS) first — they will help you create the Spending Plan before your budget is finalized.',
            tip: 'Your RC coordinator may present the budget as fixed. You can challenge the calculation. Request the worksheet that shows how your budget was computed and compare it against your historical POS spending.'
          },
          {
            title: 'Choosing a Financial Management Service (FMS)',
            content: 'The FMS acts as your fiscal employer — they handle background checks, payroll, billing to the RC, and compliance for the workers you hire. California has multiple DDS-approved FMS providers. Compare them on: (1) How quickly they process new hire paperwork, (2) How quickly they pay workers (delays cause provider turnover), (3) Whether they have bilingual staff, (4) Their track record with the RC in your catchment.',
            warning: 'Slow FMS processing is the #1 cause of SDP service gaps. Workers can quit if paychecks are delayed. Interview your FMS on their average time-to-first-paycheck before signing.'
          },
          {
            title: 'Writing your Spending Plan',
            content: 'Your Spending Plan must allocate your budget across service categories: respite, behavior services, community-based supports, personal care, transportation, etc. Each category needs: a service description, number of hours/units, cost per unit, and total cost. The plan must align with your child\'s IPP goals. An Independent Facilitator (IF) can help you write the plan — this is an RC-funded role.',
            tip: 'Build a 5-10% unallocated reserve for unexpected needs. The SDP allows you to reallocate funds between categories during the year with RC approval.'
          },
          {
            title: 'Avoiding the transition service gap',
            content: 'The most dangerous moment in SDP is the transition date — when RC-vendorized services stop and your self-hired providers must be fully credentialed through the FMS. Providers who are not fully cleared on day 1 cannot legally provide (or be paid for) services. Start the FMS onboarding process 60-90 days before your SDP start date. Do not finalize a start date until all key providers are cleared.',
            warning: 'Never agree to a SDP start date until your FMS confirms all providers are cleared. The Regional Center may pressure you to "go live" before providers are ready.'
          }
        ]),
        JSON.stringify([
          {
            title: 'Qué es el Programa de Autodeterminación (SDP)',
            content: 'El SDP permite a los consumidores del Centro Regional (o a sus familias) controlar un presupuesto individualizado y contratar directamente a sus propios proveedores de servicios, en lugar de trabajar a través de agencias vendidas por el Centro Regional. Esto brinda una flexibilidad enorme para contratar proveedores bilingües, establecer horarios específicos y acceder a apoyos menos comunes. El programa es supervisado por el Dept. de Servicios del Desarrollo (DDS) y administrado localmente por cada Centro Regional.',
            citation: 'Código de Bienestar e Instituciones de California § 4685.8'
          },
          {
            title: 'El cálculo del Presupuesto Individual',
            content: 'Su presupuesto del SDP se basa en su gasto actual de "Compra de Servicios" (POS) del Centro Regional, ajustado por una fórmula estatal. No puede recibir más de un máximo del presupuesto calculado, pero puede asignar el presupuesto a categorías diferentes.',
            tip: 'Su coordinador del Centro Regional puede presentar el presupuesto como fijo. Puede impugnar el cálculo. Solicite la hoja de trabajo que muestra cómo se calculó su presupuesto y compárela con su gasto POS histórico.'
          },
          {
            title: 'Elegir un Servicio de Gestión Financiera (FMS)',
            content: 'El FMS actúa como su empleador fiscal: maneja las verificaciones de antecedentes, la nómina, la facturación al Centro Regional y el cumplimiento de los trabajadores que contrata. California tiene múltiples proveedores de FMS aprobados por el DDS. Compárelos en: (1) Qué tan rápido procesan el papeleo de las nuevas contrataciones, (2) Qué tan rápido pagan a los trabajadores, (3) Si tienen personal bilingüe, (4) Su historial con el Centro Regional en su área.',
            warning: 'El procesamiento lento del FMS es la causa número 1 de las brechas en el servicio del SDP. Los trabajadores pueden renunciar si los cheques de pago se retrasan. Entreviste a su FMS sobre su tiempo promedio para el primer cheque de pago antes de firmar.'
          },
          {
            title: 'Redactar su Plan de Gastos',
            content: 'Su Plan de Gastos debe asignar su presupuesto a las categorías de servicio: respiro, servicios de comportamiento, apoyos basados en la comunidad, cuidado personal, transporte, etc. Cada categoría necesita: una descripción del servicio, número de horas/unidades, costo por unidad y costo total. El plan debe alinearse con las metas del IPP de su hijo. Un Facilitador Independiente (IF) puede ayudarle a redactar el plan (este es un rol financiado por el Centro Regional).',
            tip: 'Construya una reserva no asignada del 5-10% para necesidades inesperadas. El SDP le permite reasignar fondos entre categorías durante el año con la aprobación del Centro Regional.'
          },
          {
            title: 'Evitar la brecha de servicio de transición',
            content: 'El momento más crítico en el SDP es la fecha de transición, cuando se detienen los servicios vendidos por el Centro Regional y sus proveedores contratados por usted mismo deben estar completamente acreditados a través del FMS. Los proveedores que no estén completamente autorizados el día 1 no pueden prestar servicios legalmente. Comience el proceso de incorporación del FMS de 60 a 90 días antes de su fecha de inicio del SDP.',
            warning: 'Nunca acepte una fecha de inicio del SDP hasta que su FMS confirme que todos los proveedores están autorizados. El Centro Regional puede presionarle para "comenzar en vivo" antes de que los proveedores estén listo.'
          }
        ])
      ]
    ];

    const seedTx = db.transaction(() => {
      for (const row of seedArticles) {
        insertArticle.run(...row);
      }
    });
    seedTx();
    console.log('⚡ Seeded Knowledge Base Articles into local database.');
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS child_clinical_documents (
      id TEXT PRIMARY KEY,
      child_id TEXT NOT NULL,
      file_name TEXT NOT NULL,
      document_type TEXT NOT NULL,
      parsed_data_json TEXT NOT NULL,
      uploaded_at TEXT NOT NULL,
      status TEXT NOT NULL,
      FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS consultation_threads (
      id TEXT PRIMARY KEY,
      child_id TEXT NOT NULL,
      advocate_id TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE,
      FOREIGN KEY (advocate_id) REFERENCES iep_advocates(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS consultation_messages (
      id TEXT PRIMARY KEY,
      thread_id TEXT NOT NULL,
      sender_role TEXT NOT NULL,
      message_text TEXT NOT NULL,
      attachments_json TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (thread_id) REFERENCES consultation_threads(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS shared_portal_tokens (
      id TEXT PRIMARY KEY,
      child_id TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      access_scope TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE
    );
  `);

  // Dynamic SQLite Trust/Source Column Migrations
  const targetTables = [
    'county_offices',
    'school_districts',
    'nonprofit_organizations',
    'regional_education_agencies',
    'state_resource_agencies',
    'iep_advocates',
    'resource_providers',
    'programs',
    'sources',
    'source_verifications'
  ];

  const trustColsToAdd = [
    { name: 'source_url', type: 'TEXT' },
    { name: 'source_type', type: 'TEXT' },
    { name: 'data_origin', type: 'TEXT' },
    { name: 'verification_status', type: 'TEXT' },
    { name: 'last_verified_date', type: 'TEXT' },
    { name: 'last_scraped_at', type: 'TEXT' },
    { name: 'confidence_score', type: 'REAL' }
  ];

  for (const tbl of targetTables) {
    try {
      const tblInfo = db.prepare(`PRAGMA table_info(${tbl})`).all() as { name: string }[];
      const colNames = tblInfo.map(col => col.name);
      for (const c of trustColsToAdd) {
        if (!colNames.includes(c.name)) {
          db.exec(`ALTER TABLE ${tbl} ADD COLUMN ${c.name} ${c.type};`);
        }
      }
    } catch (e) {
      console.warn(`⚠️ Warning: Failed to run trust migration on SQLite table '${tbl}':`, (e as Error).message);
    }
  }

  // Create legal_decisions table if not exists in SQLite
  db.exec(`
    CREATE TABLE IF NOT EXISTS legal_decisions (
      id TEXT PRIMARY KEY,
      state TEXT NOT NULL,
      case_name TEXT NOT NULL,
      case_number TEXT,
      decision_date TEXT,
      summary TEXT,
      document_url TEXT,
      body_text TEXT,
      source TEXT,
      scraped_at TEXT,
      school_district_id TEXT REFERENCES school_districts(id),
      outcome TEXT
    );
  `);

  console.log('⚡ SQLite Database migrations completed successfully!');
}

// Database interfaces
export interface Selpa {
  id: string;
  name: string;
  counties_served: string;
  website: string;
  source_url?: string | null;
  source_type?: string | null;
  data_origin?: string | null;
  verification_status?: string | null;
  last_verified_at?: string | null;
  last_verified_date?: string | null;
  last_scraped_at?: string | null;
  confidence_score?: number | null;
}

export interface CountyOffice {
  id: string;
  county_id: string;
  program_id: string;
  office_name: string;
  address: string;
  phone: string;
  email: string | null;
  website: string;
  source_url?: string | null;
  source_type?: string | null;
  data_origin?: string | null;
  verification_status?: string | null;
  last_verified_at?: string | null;
  last_verified_date?: string | null;
  last_scraped_at?: string | null;
  confidence_score?: number | null;
}

export interface SchoolDistrict {
  id: string;
  county_id: string;
  name: string;
  spec_ed_contact_phone?: string;
  spec_ed_contact_email?: string;
  website?: string;
  total_enrollment?: number;
  special_ed_pct?: number;
  inclusion_rate_pct?: number;
  self_contained_rate_pct?: number;
  source_url?: string | null;
  source_type?: string | null;
  data_origin?: string | null;
  verification_status?: string | null;
  last_verified_date?: string | null;
  last_scraped_at?: string | null;
  confidence_score?: number | null;
  totalCases?: number;
  parentWins?: number;
  districtWins?: number;
  unknownWins?: number;
}

export interface NonprofitOrganization {
  id: string;
  county_id: string;
  name: string;
  website: string;
  phone: string;
  focus_condition: string;
  service_tags?: string | null;
  serving_tags?: string | null;
  availability_status?: string | null;
  accepting_new_clients?: number | null;
  waitlist_status?: string | null;
  capacity_notes?: string | null;
  funding_status?: string | null;
  checked_at?: string | null;
  source_name?: string | null;
  source_last_updated?: string | null;
  next_step_type?: string | null;
  next_step_label?: string | null;
  next_step_url?: string | null;
  next_step_phone?: string | null;
  next_step_email?: string | null;
  next_step_instructions?: string | null;
  requirements?: string | null;
  application_url?: string | null;
  referral_url?: string | null;
  walk_in_available?: number | null;
  appointment_required?: number | null;
  languages?: string | null;
  interpreter_available?: number | null;
  asl_available?: number | null;
  wheelchair_accessible?: number | null;
  virtual_services?: number | null;
  in_person_services?: number | null;
  home_visits?: number | null;
  transportation_help?: number | null;
  accessibility_notes?: string | null;
  manual_review_required?: number | null;
  data_quality_notes?: string | null;
  unsupported_claim_flags?: string | null;
  claim_status?: string | null;
  claimed_by?: string | null;
  verified_affiliation?: number | null;
  claim_email?: string | null;
  source_url?: string | null;
  source_type?: string | null;
  data_origin?: string | null;
  verification_status?: string | null;
  last_verified_date?: string | null;
  last_scraped_at?: string | null;
  confidence_score?: number | null;
}

export interface RegionalCenter {
  id: string;
  state_id?: string | null;
  agency_type?: string | null;
  name: string;
  website: string;
  counties_served: string;
  catchment_boundaries: string;
  intake_phone: string;
  early_start_contact: string;
  lanterman_intake_contact: string;
  eligibility_info_page: string;
  services_page: string;
  appeals_info: string;
  frc_relationship: string;
  office_locations: string;
  languages: string;
  last_verified_date: string;
  source_urls: string;
  service_area_description?: string | null;
  source_url?: string | null;
  source_type?: string | null;
  data_origin?: string | null;
  verification_status?: string | null;
  last_scraped_at?: string | null;
  confidence_score?: number | null;
}

export interface DirectoryReview {
  id: number;
  entity_type: string;
  entity_id: string;
  entity_name: string;
  county_id: string;
  rating: number;
  comment: string;
  reviewer_label: string;
  experience_type: string | null;
  helpful_count: number;
  created_at: string;
}

export interface ResourceProvider {
  id: string;
  name: string;
  categories: string;
  county_id: string;
  phone: string;
  email: string | null;
  address: string;
  accepts_medi_cal: number;
  regional_center_vendor_ids: string | null;
  service_tags?: string | null;
  serving_tags?: string | null;
  availability_status?: string | null;
  accepting_new_clients?: number | null;
  waitlist_status?: string | null;
  capacity_notes?: string | null;
  funding_status?: string | null;
  checked_at?: string | null;
  source_name?: string | null;
  source_last_updated?: string | null;
  next_step_type?: string | null;
  next_step_label?: string | null;
  next_step_url?: string | null;
  next_step_phone?: string | null;
  next_step_email?: string | null;
  next_step_instructions?: string | null;
  requirements?: string | null;
  application_url?: string | null;
  referral_url?: string | null;
  walk_in_available?: number | null;
  appointment_required?: number | null;
  languages?: string | null;
  interpreter_available?: number | null;
  asl_available?: number | null;
  wheelchair_accessible?: number | null;
  virtual_services?: number | null;
  in_person_services?: number | null;
  home_visits?: number | null;
  transportation_help?: number | null;
  accessibility_notes?: string | null;
  manual_review_required?: number | null;
  data_quality_notes?: string | null;
  unsupported_claim_flags?: string | null;
  claim_status?: string | null;
  claimed_by?: string | null;
  verified_affiliation?: number | null;
  claim_email?: string | null;
  source_url?: string | null;
  source_type?: string | null;
  data_origin?: string | null;
  verification_status?: string | null;
  last_verified_date?: string | null;
  last_scraped_at?: string | null;
  confidence_score?: number | null;
}

export interface ProgramDocumentRequirement {
  id: string;
  program_id: string;
  name: string;
  description: string;
  is_mandatory: number;
}

export interface ProgramApplicationStep {
  id: string;
  program_id: string;
  step_number: number;
  title: string;
  action_description: string;
  apply_url_or_contact?: string | null;
}

export interface ProgramAppealInfo {
  program_id: string;
  deadline_days: string;
  appeal_steps: string;
  denial_reasons: string;
  appeal_form_name: string;
  official_appeal_source_url: string;
}

export interface CoreProgramMatch {
  id: string;
  name: string;
  description: string;
  who_it_is_for: string | null;
  who_might_qualify: string | null;
  official_source_url: string | null;
  category: string | null;
  last_verified_date: string | null;
  trigger_reason: string | null;
  documentRequirements: ProgramDocumentRequirement[];
  applicationSteps: ProgramApplicationStep[];
  appealInfo: ProgramAppealInfo | null;
  source_url?: string | null;
  source_type?: string | null;
  data_origin?: string | null;
  verification_status?: string | null;
  last_scraped_at?: string | null;
  confidence_score?: number | null;
}

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
  specialties?: string | null;
  regional_center_vendorized?: number;
  organization_affiliation?: string | null;
  description?: string | null;
  service_tags?: string | null;
  serving_tags?: string | null;
  availability_status?: string | null;
  accepting_new_clients?: number | null;
  waitlist_status?: string | null;
  capacity_notes?: string | null;
  funding_status?: string | null;
  checked_at?: string | null;
  source_name?: string | null;
  source_last_updated?: string | null;
  next_step_type?: string | null;
  next_step_label?: string | null;
  next_step_url?: string | null;
  next_step_phone?: string | null;
  next_step_email?: string | null;
  next_step_instructions?: string | null;
  requirements?: string | null;
  application_url?: string | null;
  referral_url?: string | null;
  walk_in_available?: number | null;
  appointment_required?: number | null;
  interpreter_available?: number | null;
  asl_available?: number | null;
  wheelchair_accessible?: number | null;
  virtual_services?: number | null;
  in_person_services?: number | null;
  home_visits?: number | null;
  transportation_help?: number | null;
  accessibility_notes?: string | null;
  manual_review_required?: number | null;
  data_quality_notes?: string | null;
  unsupported_claim_flags?: string | null;
  claim_status?: string | null;
  claimed_by?: string | null;
  verified_affiliation?: number | null;
  claim_email?: string | null;
  verification_status?: string | null;
  source_url?: string | null;
  source_type?: string | null;
  last_scraped_at?: string | null;
  last_verified_at?: string | null;
  data_origin?: string | null;
  last_verified_date?: string | null;
  confidence_score?: number | null;
}

export interface Program {
  id: number | string;
  source_url: string;
  official_source_url?: string | null;
  program_name: string;
  target_demographic: string;
  age_limit_min: number;
  age_limit_max: number;
  income_limit: string;
  diagnosis_required: string; // JSON array string
  county_specific: string;
  state_id?: string | null;
  source_type?: string | null;
  data_origin?: string | null;
  verification_status?: string | null;
  last_verified_date?: string | null;
  last_scraped_at?: string | null;
  confidence_score?: number | null;
}

export interface County {
  id: string;
  name: string;
  website: string;
  ihss_wage_rate?: number;
  medi_cal_plans?: string;
  state_id?: string;
}

export interface ChildWaiver {
  id: string;
  child_id: string;
  waiver_type: string;
  document_name: string;
  file_path?: string | null;
  effective_date?: string | null;
  expiration_date?: string | null;
  authorized_hours?: number | null;
  parsed_content?: string | null;
  created_at: string;
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

export async function getProgramsByCriteria(age: number, diagnosis: string): Promise<Program[]> {
  const stmt = await crawlerDb.prepare(`
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
export async function getProgramsForDiagnosis(diagnosis: string): Promise<Program[]> {
  const stmt = await crawlerDb.prepare(`
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

export async function getAllPrograms(): Promise<Program[]> {
  try {
    const stmt = await crawlerDb.prepare(`
      SELECT * FROM structured_programs 
      GROUP BY program_name
      ORDER BY id ASC
    `);
    return stmt.all() as Program[];
  } catch (err) {
    console.error('Failed to get all programs:', err);
    return [];
  }
}

export async function getProgramBySlug(slug: string): Promise<Program | null> {
  try {
    // 1. Look up in the navigator DB first
    const programRow = await navigatorDb.prepare(`
      SELECT * FROM programs 
      WHERE LOWER(id) = ? OR LOWER(name) = ?
    `).get(slug.toLowerCase(), slug.toLowerCase().replace(/-/g, ' '));

    if (programRow) {
      // Look up its eligibility rules to extract age range
      const rules = await navigatorDb.prepare(`
        SELECT MIN(min_age_years) as min_age, MAX(max_age_years) as max_age
        FROM program_eligibility_rules
        WHERE program_id = ?
      `).get(programRow.id);

      const ageLimitMin = rules && rules.min_age !== null ? Number(rules.min_age) : 0;
      const ageLimitMax = rules && rules.max_age !== null ? Number(rules.max_age) : 21;

      return {
        id: programRow.id,
        source_url: programRow.official_source_url || '',
        official_source_url: programRow.official_source_url,
        program_name: programRow.name,
        target_demographic: programRow.who_it_is_for || '',
        age_limit_min: ageLimitMin,
        age_limit_max: ageLimitMax,
        income_limit: 'Medi-Cal standard / None',
        diagnosis_required: programRow.who_might_qualify || '',
        county_specific: 'Statewide',
        state_id: programRow.state_id,
        last_verified_date: programRow.last_verified_date,
        confidence_score: Number(programRow.confidence_score || 5.0) // QA-ALLOW
      } as Program;
    }
  } catch (err) {
    console.error('Error looking up program in navigatorDb:', err);
  }

  // 2. Fall back to structured_programs from the crawler database
  const all = await getAllPrograms();
  const found = all.find(p => {
    if (String(p.id) === slug) return true;
    const pSlug = p.program_name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    return pSlug === slug;
  });
  return found || null;
}


export interface User {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  return await navigatorDb.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase()) as User | undefined;
}

export async function createUser(id: string, email: string, passwordHash: string) {
  if (isVercel && !usePg) return;
  await navigatorDb.transaction(async () => {
    // 1. Create credential user record
    await navigatorDb.prepare(`
      INSERT INTO users (id, email, password_hash, created_at)
      VALUES (?, ?, ?, ?)
    `).run(id, email.toLowerCase(), passwordHash, new Date().toISOString());

    // 2. Add structural family case record mapped to user id
    await navigatorDb.prepare(`
      INSERT INTO family_cases (id, email, created_at)
      VALUES (?, ?, ?)
    `).run(id, email.toLowerCase(), new Date().toISOString().split('T')[0]);
  })();
}

// ----------------------------------------------------
// 3. Child Profiles & Taxonomy Queries
// ----------------------------------------------------

export interface State {
  id: string;
  name: string;
  code: string;
}

export async function getStateByIdOrCode(stateIdOrCode: string): Promise<State | undefined> {
  try {
    const clean = stateIdOrCode.toLowerCase();
    return await navigatorDb.prepare(`
      SELECT * FROM states WHERE LOWER(id) = ? OR LOWER(code) = ?
    `).get(clean, clean) as State | undefined;
  } catch (err) {
    console.error('Failed to query state:', err);
    return undefined;
  }
}

export async function getAllStates(): Promise<State[]> {
  try {
    return await navigatorDb.prepare('SELECT * FROM states ORDER BY name ASC').all() as State[];
  } catch (err) {
    console.error('Failed to query states:', err);
    return [];
  }
}

export async function getCounties(stateIdOrCode?: string): Promise<County[]> {
  try {
    if (stateIdOrCode) {
      const clean = stateIdOrCode.toLowerCase();
      return await navigatorDb.prepare(`
        SELECT c.* FROM counties c
        JOIN states s ON c.state_id = s.id
        WHERE LOWER(s.id) = ? OR LOWER(s.code) = ?
        ORDER BY c.name ASC
      `).all(clean, clean) as County[];
    }
    return await navigatorDb.prepare('SELECT * FROM counties ORDER BY name ASC').all() as County[];
  } catch (err) {
    console.error('Failed to query counties:', err);
    return [];
  }
}

export async function getTaxonomyConditions(): Promise<TaxonomyCondition[]> {
  return await navigatorDb.prepare('SELECT * FROM conditions ORDER BY name ASC').all() as TaxonomyCondition[];
}

export async function getFunctionalNeeds(): Promise<FunctionalNeed[]> {
  return await navigatorDb.prepare('SELECT * FROM functional_needs ORDER BY name ASC').all() as FunctionalNeed[];
}

export async function getChildrenByUserId(userId: string): Promise<ChildProfile[]> {
  const children = await navigatorDb.prepare('SELECT * FROM child_profiles WHERE case_id = ?').all(userId) as ChildProfile[];
  
  for (const child of children) {
    child.nickname = decrypt(child.nickname);
    child.dob = decrypt(child.dob);
    child.zip_code = decrypt(child.zip_code);
    child.caregiver_notes = decrypt(child.caregiver_notes);

    const conds = await navigatorDb.prepare('SELECT condition_id FROM child_profile_conditions WHERE child_id = ?').all(child.id) as { condition_id: string }[];
    child.conditionIds = conds.map(c => c.condition_id);

    const needs = await navigatorDb.prepare('SELECT need_id FROM child_profile_needs WHERE child_id = ?').all(child.id) as { need_id: string }[];
    child.functionalNeedIds = needs.map(n => n.need_id);
  }
  return children;
}

export async function verifyChildOwnership(childId: string, userId: string): Promise<boolean> {
  try {
    const row = await navigatorDb.prepare('SELECT 1 FROM child_profiles WHERE id = ? AND case_id = ?').get(childId, userId);
    return !!row;
  } catch (err) {
    console.error('Failed to verify child ownership:', err);
    return false;
  }
}

export async function getChildProfile(childId: string): Promise<ChildProfile | null> {
  try {
    const child = await navigatorDb.prepare('SELECT * FROM child_profiles WHERE id = ?').get(childId) as ChildProfile | undefined;
    if (!child) return null;
    
    child.nickname = decrypt(child.nickname);
    child.dob = decrypt(child.dob);
    child.zip_code = decrypt(child.zip_code);
    child.caregiver_notes = decrypt(child.caregiver_notes);

    const conds = await navigatorDb.prepare('SELECT condition_id FROM child_profile_conditions WHERE child_id = ?').all(child.id) as { condition_id: string }[];
    child.conditionIds = conds.map(c => c.condition_id);

    const needs = await navigatorDb.prepare('SELECT need_id FROM child_profile_needs WHERE child_id = ?').all(child.id) as { need_id: string }[];
    child.functionalNeedIds = needs.map(n => n.need_id);
    
    return child;
  } catch (err) {
    console.error('Failed to get child profile:', err);
    return null;
  }
}

export async function getChildIdByReminder(reminderId: string): Promise<string | null> {
  try {
    const row = await navigatorDb.prepare('SELECT child_id FROM reminders WHERE id = ?').get(reminderId) as { child_id: string } | undefined;
    return row ? row.child_id : null;
  } catch {
    return null;
  }
}

export async function getChildIdByWaiver(waiverId: string): Promise<string | null> {
  try {
    const row = await navigatorDb.prepare('SELECT child_id FROM child_waivers WHERE id = ?').get(waiverId) as { child_id: string } | undefined;
    return row ? row.child_id : null;
  } catch {
    return null;
  }
}

export async function getChildIdBySafetyIncident(incidentId: string): Promise<string | null> {
  try {
    const row = await navigatorDb.prepare('SELECT child_id FROM safety_incidents WHERE id = ?').get(incidentId) as { child_id: string } | undefined;
    return row ? row.child_id : null;
  } catch {
    return null;
  }
}

export async function createChildProfile(child: Omit<ChildProfile, 'case_id' | 'language_preference'>, userId: string) {
  if (isVercel && !usePg) return;
  await navigatorDb.transaction(async () => {
    // 1. Insert profile
    await navigatorDb.prepare(`
      INSERT INTO child_profiles (id, case_id, nickname, dob, county_id, zip_code, insurance_type, school_status, caregiver_notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      child.id,
      userId,
      encrypt(child.nickname),
      encrypt(child.dob),
      child.county_id,
      encrypt(child.zip_code),
      child.insurance_type,
      child.school_status,
      encrypt(child.caregiver_notes)
    );

    // 2. Map conditions
    if (child.conditionIds && child.conditionIds.length > 0) {
      const insCond = await navigatorDb.prepare(`
        INSERT OR IGNORE INTO conditions 
        (id, name, aliases, parent_friendly_explanation, regional_center_relevance, iep_relevance, ccs_relevance, ssi_relevance, cal_able_relevance, age_specific_notes, source_url, last_verified_date)
        VALUES (?, ?, '', 'Custom diagnosis added by caregiver.', 1, 1, 1, 1, 1, 'Check general milestone guidelines.', 'User Added', ?)
      `);
      const stmt = await navigatorDb.prepare('INSERT INTO child_profile_conditions (child_id, condition_id) VALUES (?, ?)');
      for (const condId of child.conditionIds) {
        const friendlyName = condId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        insCond.run(condId, friendlyName, new Date().toISOString().split('T')[0]);
        stmt.run(child.id, condId);
      }
    }

    // 3. Map functional needs
    if (child.functionalNeedIds && child.functionalNeedIds.length > 0) {
      const stmt = await navigatorDb.prepare('INSERT INTO child_profile_needs (child_id, need_id) VALUES (?, ?)');
      for (const needId of child.functionalNeedIds) {
        stmt.run(child.id, needId);
      }
    }
  })();
}

export async function updateChildProfile(child: Omit<ChildProfile, 'case_id' | 'language_preference'>) {
  if (isVercel && !usePg) return;
  await navigatorDb.transaction(async () => {
    // 1. Update basic details
    await navigatorDb.prepare(`
      UPDATE child_profiles
      SET nickname = ?, dob = ?, county_id = ?, zip_code = ?, insurance_type = ?, school_status = ?, caregiver_notes = ?
      WHERE id = ?
    `).run(
      encrypt(child.nickname),
      encrypt(child.dob),
      child.county_id,
      encrypt(child.zip_code),
      child.insurance_type,
      child.school_status,
      encrypt(child.caregiver_notes),
      child.id
    );

    // 2. Clear old condition & needs maps
    await navigatorDb.prepare('DELETE FROM child_profile_conditions WHERE child_id = ?').run(child.id);
    await navigatorDb.prepare('DELETE FROM child_profile_needs WHERE child_id = ?').run(child.id);

    // 3. Map new conditions
    if (child.conditionIds && child.conditionIds.length > 0) {
      const insCond = await navigatorDb.prepare(`
        INSERT OR IGNORE INTO conditions 
        (id, name, aliases, parent_friendly_explanation, regional_center_relevance, iep_relevance, ccs_relevance, ssi_relevance, cal_able_relevance, age_specific_notes, source_url, last_verified_date)
        VALUES (?, ?, '', 'Custom diagnosis added by caregiver.', 1, 1, 1, 1, 1, 'Check general milestone guidelines.', 'User Added', ?)
      `);
      const stmt = await navigatorDb.prepare('INSERT INTO child_profile_conditions (child_id, condition_id) VALUES (?, ?)');
      for (const condId of child.conditionIds) {
        const friendlyName = condId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        insCond.run(condId, friendlyName, new Date().toISOString().split('T')[0]);
        stmt.run(child.id, condId);
      }
    }

    // 4. Map new functional needs
    if (child.functionalNeedIds && child.functionalNeedIds.length > 0) {
      const stmt = await navigatorDb.prepare('INSERT INTO child_profile_needs (child_id, need_id) VALUES (?, ?)');
      for (const needId of child.functionalNeedIds) {
        stmt.run(child.id, needId);
      }
    }
  })();
}

export async function deleteChildProfile(childId: string) {
  if (isVercel && !usePg) return;
  await navigatorDb.prepare('DELETE FROM child_profiles WHERE id = ?').run(childId);
}

// ----------------------------------------------------
// 4. Saved Programs & Checklists
// ----------------------------------------------------

export async function getSavedProgramStatuses(childId: string): Promise<ProgramStatus[]> {
  return await navigatorDb.prepare('SELECT * FROM case_program_statuses WHERE child_id = ?').all(childId) as ProgramStatus[];
}

export async function saveProgramStatus(childId: string, programId: string, status: string) {
  const id = `status-${childId}-${programId}`;
  await navigatorDb.prepare(`
    INSERT INTO case_program_statuses (id, child_id, program_id, status, updated_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(child_id, program_id) DO UPDATE SET status = ?, updated_at = ?
  `).run(id, childId, programId, status, new Date().toISOString().split('T')[0], status, new Date().toISOString().split('T')[0]);
}

export async function unsaveProgram(childId: string, programId: string) {
  await navigatorDb.transaction(async () => {
    await navigatorDb.prepare('DELETE FROM case_program_statuses WHERE child_id = ? AND program_id = ?').run(childId, programId);
    await navigatorDb.prepare('DELETE FROM document_checklist_items WHERE child_id = ? AND program_id = ?').run(childId, programId);
  })();
}

export async function getChecklistItems(childId: string): Promise<ChecklistItem[]> {
  return await navigatorDb.prepare('SELECT * FROM document_checklist_items WHERE child_id = ?').all(childId) as ChecklistItem[];
}

export async function setChecklistItemCollected(childId: string, docName: string, isCollected: boolean, programId: string) {
  const id = `check-${childId}-${programId}-${docName.replace(/\s+/g, '-').toLowerCase()}`;
  const isCollVal = isCollected ? 1 : 0;
  await navigatorDb.prepare(`
    INSERT INTO document_checklist_items (id, child_id, document_name, is_collected, program_id)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET is_collected = ?
  `).run(id, childId, docName, isCollVal, programId, isCollVal);
}

// ----------------------------------------------------
// 5. Reminders Queries
// ----------------------------------------------------

export async function getReminders(childId: string): Promise<Reminder[]> {
  return await navigatorDb.prepare('SELECT * FROM reminders WHERE child_id = ? ORDER BY due_date ASC').all(childId) as Reminder[];
}

export async function createReminder(reminder: Reminder) {
  await navigatorDb.prepare(`
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

export async function toggleReminderCompleted(reminderId: string, isCompleted: boolean) {
  const isCompVal = isCompleted ? 1 : 0;
  await navigatorDb.prepare('UPDATE reminders SET is_completed = ? WHERE id = ?').run(isCompVal, reminderId);
}

export async function deleteReminder(reminderId: string) {
  await navigatorDb.prepare('DELETE FROM reminders WHERE id = ?').run(reminderId);
}

// ----------------------------------------------------
// 5.5. Child Waiver Vault Queries
// ----------------------------------------------------

export async function getChildWaivers(childId: string): Promise<ChildWaiver[]> {
  return await navigatorDb.prepare('SELECT * FROM child_waivers WHERE child_id = ? ORDER BY created_at DESC').all(childId) as ChildWaiver[];
}

export async function saveChildWaiver(waiver: ChildWaiver) {
  await navigatorDb.prepare(`
    INSERT INTO child_waivers (id, child_id, waiver_type, document_name, file_path, effective_date, expiration_date, authorized_hours, parsed_content, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      waiver_type = excluded.waiver_type,
      document_name = excluded.document_name,
      file_path = excluded.file_path,
      effective_date = excluded.effective_date,
      expiration_date = excluded.expiration_date,
      authorized_hours = excluded.authorized_hours,
      parsed_content = excluded.parsed_content
  `).run(
    waiver.id,
    waiver.child_id,
    waiver.waiver_type,
    waiver.document_name,
    waiver.file_path,
    waiver.effective_date,
    waiver.expiration_date,
    waiver.authorized_hours,
    waiver.parsed_content,
    waiver.created_at
  );
}

export async function deleteChildWaiver(waiverId: string) {
  await navigatorDb.prepare('DELETE FROM child_waivers WHERE id = ?').run(waiverId);
}

// ----------------------------------------------------
// 6. Relational Routing Details (SEO & Local Dashboard)
// ----------------------------------------------------

export async function getCountyDetails(countyId: string) {
  const county = await navigatorDb.prepare('SELECT * FROM counties WHERE id = ?').get(countyId) as County | undefined;
  if (!county) return undefined;

  const offices = await navigatorDb.prepare('SELECT * FROM county_offices WHERE county_id = ?').all(countyId) as CountyOffice[];
  const districts = await navigatorDb.prepare(`
    SELECT sd.*, 
      COUNT(ld.id) as totalCases,
      SUM(CASE WHEN ld.outcome = 'parent_win' THEN 1 ELSE 0 END) as parentWins,
      SUM(CASE WHEN ld.outcome = 'district_win' THEN 1 ELSE 0 END) as districtWins,
      SUM(CASE WHEN ld.outcome NOT IN ('parent_win', 'district_win') OR ld.outcome IS NULL THEN 1 ELSE 0 END) as unknownWins
    FROM school_districts sd
    LEFT JOIN legal_decisions ld ON sd.id = ld.school_district_id
    WHERE sd.county_id = ?
    GROUP BY sd.id
  `).all(countyId) as SchoolDistrict[];
  const nonprofits = await navigatorDb.prepare('SELECT * FROM nonprofit_organizations WHERE county_id = ?').all(countyId) as NonprofitOrganization[];

  // Get matching Regional Centers using junction table
  const rcs = await navigatorDb.prepare(`
    SELECT rc.* FROM regional_centers rc
    JOIN regional_center_counties rcc ON rc.id = rcc.regional_center_id
    WHERE rcc.county_id = ?
  `).all(countyId) as RegionalCenter[];

  // Get matching SELPAs using junction table
  const countySelpas = await navigatorDb.prepare(`
    SELECT s.* FROM selpas s
    JOIN selpa_counties sc ON s.id = sc.selpa_id
    WHERE sc.county_id = ?
  `).all(countyId) as Selpa[];

  return {
    ...county,
    countyOffices: offices,
    schoolDistricts: districts,
    localOrganizations: nonprofits,
    regionalCenters: rcs,
    selpas: countySelpas
  };
}

export async function getSelpasByCounty(countyId: string): Promise<Selpa[]> {
  try {
    return await navigatorDb.prepare(`
      SELECT s.* FROM selpas s
      JOIN selpa_counties sc ON s.id = sc.selpa_id
      WHERE sc.county_id = ?
    `).all(countyId) as Selpa[];
  } catch (err) {
    console.error('Failed to query SELPAs:', err);
    return [];
  }
}

export async function getProgramDocumentRequirements(programId: string): Promise<ProgramDocumentRequirement[]> {
  return await navigatorDb.prepare('SELECT * FROM program_document_requirements WHERE program_id = ?').all(programId) as ProgramDocumentRequirement[];
}

export async function getProgramApplicationSteps(programId: string): Promise<ProgramApplicationStep[]> {
  return await navigatorDb.prepare('SELECT * FROM program_application_steps WHERE program_id = ? ORDER BY step_number ASC').all(programId) as ProgramApplicationStep[];
}

export async function getProgramAppealInfo(programId: string): Promise<ProgramAppealInfo | undefined> {
  return await navigatorDb.prepare('SELECT * FROM program_appeal_info WHERE program_id = ?').get(programId) as ProgramAppealInfo | undefined;
}

export async function getMatchedCorePrograms(age: number, conditionIds: string[], needIds: string[]): Promise<CoreProgramMatch[]> {
  let querySql = `
    SELECT r.*, p.name, p.description, p.who_it_is_for, p.who_might_qualify, p.official_source_url, p.category, p.last_verified_date
    FROM program_eligibility_rules r
    JOIN programs p ON r.program_id = p.id
    WHERE ? >= r.min_age_years AND ? <= r.max_age_years
  `;
  
  const params: (string | number)[] = [age, age];

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
    const matchedRules = await navigatorDb.prepare(querySql).all(...params) as {
      program_id: string;
      name: string;
      description: string;
      who_it_is_for: string | null;
      who_might_qualify: string | null;
      official_source_url: string | null;
      category: string | null;
      last_verified_date: string | null;
      trigger_reason: string | null;
    }[];
    
    // Enrich with document requirements, steps, and appeal info
    const enriched = await Promise.all(matchedRules.map(async (rule) => {
      const [docs, steps, appeal] = await Promise.all([
        getProgramDocumentRequirements(rule.program_id),
        getProgramApplicationSteps(rule.program_id),
        getProgramAppealInfo(rule.program_id)
      ]);

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
    }));
    return enriched;
  } catch (err) {
    console.error('Failed to match core programs:', err);
    return [];
  }
}

export async function getProgramsByKeywords(age: number, diagnosis: string, keywords: string[]): Promise<Program[]> {
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
  const params: (string | number)[] = [age, age, `%${diagnosis}%`];

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
    return await crawlerDb.prepare(querySql).all(...params) as Program[];
  } catch (err) {
    console.error('Failed to search crawler programs by keywords:', err);
    return [];
  }
}

export async function getIepAdvocates(countyId?: string, stateId?: string): Promise<IepAdvocate[]> {
  try {
    if (countyId) {
      return await navigatorDb.prepare(`
        SELECT a.* FROM iep_advocates a
        JOIN iep_advocate_counties ac ON a.id = ac.iep_advocate_id
        WHERE ac.county_id = ?
      `).all(countyId) as IepAdvocate[];
    }
    if (stateId) {
      return await navigatorDb.prepare(`
        SELECT DISTINCT a.* FROM iep_advocates a
        JOIN iep_advocate_counties ac ON a.id = ac.iep_advocate_id
        JOIN counties c ON ac.county_id = c.id
        WHERE c.state_id = ?
      `).all(stateId) as IepAdvocate[];
    }
    return await navigatorDb.prepare('SELECT * FROM iep_advocates').all() as IepAdvocate[];
  } catch (err) {
    console.error('Failed to query IEP advocates:', err);
    return [];
  }
}

export async function getProgramWaitlists(): Promise<ProgramWaitlist[]> {
  try {
    return await navigatorDb.prepare('SELECT * FROM program_waitlists').all() as ProgramWaitlist[];
  } catch (err) {
    console.error('Failed to query program waitlists:', err);
    return [];
  }
}

export async function updateWaitlistStatus(
  programId: string,
  durationLabel: string,
  durationMonths: number,
  status: 'critical' | 'moderate' | 'standard' | 'priority',
  description: string
): Promise<boolean> {
  if (isVercel && !usePg) {
    console.log(`⚠️ Database is read-only on Vercel. Skipping waitlist update on disk for ${programId}.`);
    return false;
  }
  try {
    const updateTx = await navigatorDb.transaction(async () => {
      const stmt = await navigatorDb.prepare(`
        UPDATE program_waitlists 
        SET duration_label = ?, duration_months = ?, status = ?, description = ?, last_scraped_at = ?
        WHERE program_id = ?
      `);
      const info = stmt.run(durationLabel, durationMonths, status, description, new Date().toISOString(), programId);
      return info.changes > 0;
    });
    return updateTx();
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

export async function submitCommunitySuggestion(suggestion: CommunitySuggestion): Promise<boolean> {
  if (isVercel && !usePg) {
    console.log(`⚠️ Database is read-only on Vercel. Simulating suggestion submit.`);
    return true;
  }
  try {
    const submitTx = await navigatorDb.transaction(async () => {
      const stmt = await navigatorDb.prepare(`
        INSERT INTO community_suggestions (suggestion_type, target_id, submitter_name, submitter_email, details, status, created_at)
        VALUES (?, ?, ?, ?, ?, 'pending', ?)
      `);
      const info = await stmt.run(
        suggestion.suggestion_type,
        suggestion.target_id,
        suggestion.submitter_name,
        suggestion.submitter_email,
        suggestion.details,
        new Date().toISOString()
      );
      return info.changes > 0;
    });
    return submitTx();
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

export async function getChildIepData(childId: string): Promise<ChildIepData> {
  try {
    const accs = await navigatorDb.prepare('SELECT accommodation_id FROM child_iep_accommodations WHERE child_id = ?').all(childId) as { accommodation_id: string }[];
    const goals = await navigatorDb.prepare('SELECT id, goal_template_id, custom_text, tokens_json FROM child_iep_goals WHERE child_id = ?').all(childId) as { id: string; goal_template_id: string; custom_text: string; tokens_json: string }[];
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

export async function saveChildIepData(childId: string, accommodations: string[], goals: { templateId: string; text: string; tokens: Record<string, string> }[]): Promise<boolean> {
  if (isVercel && !usePg) {
    console.log(`⚠️ Database is read-only on Vercel. Simulating save child IEP data.`);
    return true;
  }
  try {
    await navigatorDb.transaction(async () => {
      // 1. Clear old accommodations & goals
      await navigatorDb.prepare('DELETE FROM child_iep_accommodations WHERE child_id = ?').run(childId);
      await navigatorDb.prepare('DELETE FROM child_iep_goals WHERE child_id = ?').run(childId);

      // 2. Insert new accommodations
      const insertAcc = await navigatorDb.prepare('INSERT INTO child_iep_accommodations (id, child_id, accommodation_id) VALUES (?, ?, ?)');
      accommodations.forEach(accId => {
        const id = `iep-acc-${childId}-${accId}`;
        insertAcc.run(id, childId, accId);
      });

      // 3. Insert new goals
      const insertGoal = await navigatorDb.prepare('INSERT INTO child_iep_goals (id, child_id, goal_template_id, custom_text, tokens_json) VALUES (?, ?, ?, ?, ?)');
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

export async function getChildRespiteData(childId: string): Promise<ChildRespiteData | null> {
  try {
    const data = await navigatorDb.prepare('SELECT * FROM child_respite_assessments WHERE child_id = ?').get(childId) as ChildRespiteData | undefined;
    return data || null;
  } catch (err) {
    console.error('Failed to get child respite data:', err);
    return null;
  }
}

export async function saveChildRespiteData(childId: string, scores: { safety: number; sleep: number; medical: number; behavior: number }): Promise<boolean> {
  if (isVercel && !usePg) {
    console.log(`⚠️ Database is read-only on Vercel. Simulating save child respite data.`);
    return true;
  }
  try {
    const saveRespiteTx = await navigatorDb.transaction(async () => {
      const stmt = await navigatorDb.prepare(`
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
    });
    return saveRespiteTx();
  } catch (err) {
    console.error('Failed to save child respite data:', err);
    return false;
  }
}

export async function getSchoolDistrictBySlug(slug: string): Promise<SchoolDistrict | undefined> {
  try {
    const districts = await navigatorDb.prepare('SELECT * FROM school_districts').all() as SchoolDistrict[];
    return districts.find(d => {
      const s = d.name.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
      return s === slug || d.id === slug;
    });
  } catch {
    console.error('Failed to get school district by slug:');
    return undefined;
  }
}

export async function getLocalProviders(countyId: string): Promise<ResourceProvider[]> {
  try {
    return await navigatorDb.prepare('SELECT * FROM resource_providers WHERE county_id = ?').all(countyId) as ResourceProvider[];
  } catch {
    console.error('Failed to query local resource providers:');
    return [];
  }
}

export interface DirectoryFoundationSnapshot {
  totals: {
    providers: number;
    nonprofits: number;
    advocates: number;
  };
  structuredCoverage: {
    availability: number;
    nextSteps: number;
    tags: number;
    accessibility: number;
    claimGroundwork: number;
  };
  trustFlags: {
    manualReviewRequired: number;
    unsupportedClaimsFlagged: number;
    recordsMissingSourceUrl: number;
    trustedRowsMissingAccessibility: number;
  };
  samples: {
    providers: ResourceProvider[];
    nonprofits: NonprofitOrganization[];
    advocates: IepAdvocate[];
  };
}

export async function getDirectoryFoundationSnapshot(): Promise<DirectoryFoundationSnapshot> {
  try {
    const providersAll = await navigatorDb.prepare(`
      SELECT resource_providers.*, counties.state_id
      FROM resource_providers
      LEFT JOIN counties ON counties.id = resource_providers.county_id
    `).all() as Array<ResourceProvider & { state_id?: string | null }>;
    const nonprofitsAll = await navigatorDb.prepare(`
      SELECT nonprofit_organizations.*, counties.state_id
      FROM nonprofit_organizations
      LEFT JOIN counties ON counties.id = nonprofit_organizations.county_id
    `).all() as Array<NonprofitOrganization & { state_id?: string | null }>;
    const advocatesAll = await navigatorDb.prepare('SELECT * FROM iep_advocates').all() as IepAdvocate[];

    const summarize = (rows: Array<Record<string, any>>, languageField: 'languages' | 'languages_spoken' = 'languages') => {
      return rows.reduce((acc, row) => {
        const hasSourceUrl = typeof row.source_url === 'string' && row.source_url.trim().length > 0;
        const trustedPublic = Boolean(
          hasSourceUrl &&
          row.verification_status &&
          ['official_verified', 'verified', 'human_verified', 'source_listed'].includes(row.verification_status)
        );
        if (hasDirectoryAvailabilitySignal(row)) {
          acc.availability += 1;
        }
        if (hasDirectoryNextStepSignal(row)) {
          acc.nextSteps += 1;
        }
        if (row.service_tags || row.serving_tags) acc.tags += 1;
        const hasAccessibility = hasDirectoryAccessibilitySignal({
          ...row,
          languages_spoken: languageField === 'languages_spoken' ? row[languageField] : row.languages_spoken,
        });
        if (hasAccessibility) {
          acc.accessibility += 1;
        }
        if (trustedPublic && !hasAccessibility) acc.trustedRowsMissingAccessibility += 1;
        if (hasDirectoryClaimGroundworkSignal(row)) acc.claimGroundwork += 1;
        if (row.manual_review_required === 1) acc.manualReviewRequired += 1;
        if (typeof row.unsupported_claim_flags === 'string' && row.unsupported_claim_flags.trim()) acc.unsupportedClaims += 1;
        if (!hasSourceUrl) acc.missingSourceUrl += 1;
        return acc;
      }, {
        availability: 0,
        nextSteps: 0,
        tags: 0,
        accessibility: 0,
        claimGroundwork: 0,
        manualReviewRequired: 0,
        unsupportedClaims: 0,
        missingSourceUrl: 0,
        trustedRowsMissingAccessibility: 0,
      });
    };

    const providerSummary = summarize(providersAll);
    const nonprofitSummary = summarize(nonprofitsAll);
    const advocateSummary = summarize(advocatesAll, 'languages_spoken');

    const isPublicSample = (row: { source_url?: string | null; verification_status?: string | null }) =>
      Boolean(
        row.source_url &&
        row.source_url.trim() &&
        row.verification_status &&
        ['official_verified', 'verified', 'human_verified', 'source_listed'].includes(row.verification_status)
      );

    const getStructuredRichnessScore = (row: Record<string, any>, languageField: 'languages' | 'languages_spoken' = 'languages') => {
      const coverage = getDirectoryFieldCoverage({
        ...row,
        languages_spoken: languageField === 'languages_spoken' ? row[languageField] : row.languages_spoken,
      });

      return [
        coverage.hasAvailability,
        coverage.hasNextStep,
        coverage.hasTags,
        coverage.hasAccessibility,
        coverage.hasClaimGroundwork,
      ].filter(Boolean).length;
    };

    const byFreshness = (a: { last_verified_date?: string | null; last_verified_at?: string | null; checked_at?: string | null; last_scraped_at?: string | null }, b: { last_verified_date?: string | null; last_verified_at?: string | null; checked_at?: string | null; last_scraped_at?: string | null }) => {
      const aStamp = a.last_verified_date || a.last_verified_at || a.checked_at || a.last_scraped_at || '';
      const bStamp = b.last_verified_date || b.last_verified_at || b.checked_at || b.last_scraped_at || '';
      return bStamp.localeCompare(aStamp);
    };

    const byCoverageThenFreshness = (languageField: 'languages' | 'languages_spoken' = 'languages') => (a: Record<string, any>, b: Record<string, any>) => {
      const scoreDiff = getStructuredRichnessScore(b, languageField) - getStructuredRichnessScore(a, languageField);
      if (scoreDiff !== 0) return scoreDiff;
      const accessibilityDiff =
        Number(hasDirectoryAccessibilitySignal({
          ...b,
          languages_spoken: languageField === 'languages_spoken' ? b[languageField] : b.languages_spoken,
        })) -
        Number(hasDirectoryAccessibilitySignal({
          ...a,
          languages_spoken: languageField === 'languages_spoken' ? a[languageField] : a.languages_spoken,
        }));
      if (accessibilityDiff !== 0) return accessibilityDiff;
      return byFreshness(a, b);
    };

    const getStateKey = (row: Record<string, any>) => {
      if (typeof row.state_id === 'string' && row.state_id.trim()) {
        return row.state_id.trim().toLowerCase();
      }
      if (typeof row.county_id === 'string' && row.county_id.includes('-')) {
        const countySegments = row.county_id.toLowerCase().split('-').filter(Boolean);
        const tail = countySegments[countySegments.length - 1];
        if (tail && tail.length === 2) return tail;
      }
      if (typeof row.id === 'string') {
        const segments = row.id.toLowerCase().split('-').filter(Boolean);
        if (segments[0] && segments[0].length === 2) return segments[0];
        if (segments[1] && segments[1].length === 2) return segments[1];
      }
      return null;
    };

    const getHostKey = (url?: string | null) => {
      if (!url || !url.trim()) return null;
      try {
        return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
      } catch {
        return null;
      }
    };

    const getFamilyKey = (row: Record<string, any>) => {
      const normalizedName = String(row.name || '')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (normalizedName.startsWith('the arc of ') || normalizedName.startsWith('arc of ') || normalizedName === 'the arc') {
        return 'umbrella:the-arc';
      }
      if (normalizedName.startsWith('parent to parent') || normalizedName.startsWith('p2p')) {
        return 'umbrella:parent-to-parent';
      }
      if (normalizedName.startsWith('disability rights ')) {
        return 'umbrella:disability-rights';
      }
      if (normalizedName.startsWith('autism society')) {
        return 'umbrella:autism-society';
      }

      const hostKey = getHostKey(row.source_url) || getHostKey(row.website);
      if (hostKey) return hostKey;

      const reducedName = normalizedName
        .replace(/\b(the|of|for|and|center|services|support|special|education|disability|developmental|children|child|hospital)\b/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      return reducedName.split(' ').slice(0, 3).join(' ') || String(row.id || '');
    };

    const selectDiverseSamples = <T extends Record<string, any>>(
      rows: T[],
      languageField: 'languages' | 'languages_spoken' = 'languages'
    ): T[] => {
      const sorted = [...rows].sort(byCoverageThenFreshness(languageField));
      const selected: T[] = [];
      const selectedIds = new Set<string>();

      const familySeen = new Set<string>();
      const stateSeen = new Set<string>();

      const passes = [
        (row: Record<string, any>) => {
          const familyKey = getFamilyKey(row);
          const stateKey = getStateKey(row);
          return !familySeen.has(familyKey) && (!stateKey || !stateSeen.has(stateKey));
        },
        (row: Record<string, any>) => {
          const familyKey = getFamilyKey(row);
          return !familySeen.has(familyKey);
        },
        () => true,
      ];

      for (const allowRow of passes) {
        for (const row of sorted) {
          if (selected.length >= 3) break;
          if (selectedIds.has(row.id) || !allowRow(row)) continue;
          selected.push(row);
          selectedIds.add(row.id);
          familySeen.add(getFamilyKey(row));
          const stateKey = getStateKey(row);
          if (stateKey) stateSeen.add(stateKey);
        }
        if (selected.length >= 3) break;
      }

      return selected;
    };

    const providers = selectDiverseSamples(providersAll.filter(isPublicSample));
    const nonprofits = selectDiverseSamples(nonprofitsAll.filter(isPublicSample));
    const advocates = selectDiverseSamples(advocatesAll.filter(isPublicSample), 'languages_spoken');

    return {
      totals: {
        providers: providersAll.length,
        nonprofits: nonprofitsAll.length,
        advocates: advocatesAll.length,
      },
      structuredCoverage: {
        availability: Number(providerSummary.availability + nonprofitSummary.availability + advocateSummary.availability),
        nextSteps: Number(providerSummary.nextSteps + nonprofitSummary.nextSteps + advocateSummary.nextSteps),
        tags: Number((providerSummary.tags || 0) + (nonprofitSummary.tags || 0) + (advocateSummary.tags || 0)),
        accessibility: Number(providerSummary.accessibility + nonprofitSummary.accessibility + advocateSummary.accessibility),
        claimGroundwork: Number(providerSummary.claimGroundwork + nonprofitSummary.claimGroundwork + advocateSummary.claimGroundwork),
      },
      trustFlags: {
        manualReviewRequired: Number(providerSummary.manualReviewRequired + nonprofitSummary.manualReviewRequired + advocateSummary.manualReviewRequired),
        unsupportedClaimsFlagged: Number(providerSummary.unsupportedClaims + nonprofitSummary.unsupportedClaims + advocateSummary.unsupportedClaims),
        recordsMissingSourceUrl: Number(providerSummary.missingSourceUrl + nonprofitSummary.missingSourceUrl + advocateSummary.missingSourceUrl),
        trustedRowsMissingAccessibility: Number(providerSummary.trustedRowsMissingAccessibility + nonprofitSummary.trustedRowsMissingAccessibility + advocateSummary.trustedRowsMissingAccessibility),
      },
      samples: {
        providers,
        nonprofits,
        advocates,
      },
    };
  } catch (err) {
    console.error('Failed to build directory foundation snapshot:', err);
    return {
      totals: { providers: 0, nonprofits: 0, advocates: 0 },
      structuredCoverage: { availability: 0, nextSteps: 0, tags: 0, accessibility: 0, claimGroundwork: 0 },
      trustFlags: { manualReviewRequired: 0, unsupportedClaimsFlagged: 0, recordsMissingSourceUrl: 0, trustedRowsMissingAccessibility: 0 },
      samples: { providers: [], nonprofits: [], advocates: [] },
    };
  }
}

// ----------------------------------------------------
// 7. Child Safety Logs & Parent Declarations Persistence
// ----------------------------------------------------

export interface SafetyIncident {
  id: string;
  child_id: string;
  time: string;
  category: string;
  risk_level: string;
  details: string;
  intervention: string;
}

export interface ParentDeclaration {
  child_id: string;
  declaration_text: string;
  doctor_name: string;
}

export async function getSafetyIncidents(childId: string): Promise<SafetyIncident[]> {
  try {
    const list = await navigatorDb.prepare('SELECT * FROM safety_incidents WHERE child_id = ? ORDER BY id DESC').all(childId) as SafetyIncident[];
    return list.map(inc => ({
      ...inc,
      time: decrypt(inc.time),
      details: decrypt(inc.details),
      intervention: decrypt(inc.intervention)
    }));
  } catch (err) {
    console.error('Failed to get safety incidents:', err);
    return [];
  }
}

export async function saveSafetyIncident(incident: SafetyIncident): Promise<boolean> {
  if (isVercel && !usePg) return true;
  try {
    const stmt = await navigatorDb.prepare(`
      INSERT INTO safety_incidents (id, child_id, time, category, risk_level, details, intervention)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        time = excluded.time,
        category = excluded.category,
        risk_level = excluded.risk_level,
        details = excluded.details,
        intervention = excluded.intervention
    `);
    stmt.run(
      incident.id,
      incident.child_id,
      encrypt(incident.time),
      incident.category,
      incident.risk_level,
      encrypt(incident.details),
      encrypt(incident.intervention)
    );
    return true;
  } catch (err) {
    console.error('Failed to save safety incident:', err);
    return false;
  }
}

export async function deleteSafetyIncident(id: string): Promise<boolean> {
  if (isVercel && !usePg) return true;
  try {
    await navigatorDb.prepare('DELETE FROM safety_incidents WHERE id = ?').run(id);
    return true;
  } catch (err) {
    console.error('Failed to delete safety incident:', err);
    return false;
  }
}

export async function getParentDeclaration(childId: string): Promise<ParentDeclaration | null> {
  try {
    const data = await navigatorDb.prepare('SELECT * FROM parent_declarations WHERE child_id = ?').get(childId) as ParentDeclaration | undefined;
    if (!data) return null;
    return {
      child_id: data.child_id,
      declaration_text: decrypt(data.declaration_text),
      doctor_name: decrypt(data.doctor_name)
    };
  } catch (err) {
    console.error('Failed to get parent declaration:', err);
    return null;
  }
}

export async function saveParentDeclaration(childId: string, text: string, doctorName: string): Promise<boolean> {
  if (isVercel && !usePg) return true;
  try {
    const stmt = await navigatorDb.prepare(`
      INSERT INTO parent_declarations (child_id, declaration_text, doctor_name)
      VALUES (?, ?, ?)
      ON CONFLICT(child_id) DO UPDATE SET
        declaration_text = excluded.declaration_text,
        doctor_name = excluded.doctor_name
    `);
    stmt.run(childId, encrypt(text), encrypt(doctorName));
    return true;
  } catch (err) {
    console.error('Failed to save parent declaration:', err);
    return false;
  }
}

export interface CaregiverProfile {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export async function getCaregiverProfile(userId: string): Promise<CaregiverProfile | null> {
  try {
    const data = await navigatorDb.prepare('SELECT * FROM caregiver_profiles WHERE user_id = ?').get(userId) as CaregiverProfile | undefined;
    if (!data) return null;
    return {
      user_id: data.user_id,
      name: decrypt(data.name),
      email: decrypt(data.email),
      phone: decrypt(data.phone),
      address: decrypt(data.address)
    };
  } catch (err) {
    console.error('Failed to get caregiver profile:', err);
    return null;
  }
}

export async function saveCaregiverProfile(userId: string, name: string, email: string, phone: string, address: string): Promise<boolean> {
  if (isVercel && !usePg) return true;
  try {
    const stmt = await navigatorDb.prepare(`
      INSERT INTO caregiver_profiles (user_id, name, email, phone, address)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        name = excluded.name,
        email = excluded.email,
        phone = excluded.phone,
        address = excluded.address
    `);
    stmt.run(userId, encrypt(name), encrypt(email), encrypt(phone), encrypt(address));
    return true;
  } catch (err) {
    console.error('Failed to save caregiver profile:', err);
    return false;
  }
}

export async function getChildTransitionTasks(childId: string): Promise<string[]> {
  try {
    const list = await navigatorDb.prepare('SELECT task_id FROM child_transition_tasks WHERE child_id = ?').all(childId) as { task_id: string }[];
    return list.map(item => item.task_id);
  } catch (err) {
    console.error('Failed to get child transition tasks:', err);
    return [];
  }
}

export async function toggleTransitionTask(childId: string, taskId: string, isCompleted: boolean): Promise<boolean> {
  if (isVercel && !usePg) return true;
  try {
    if (isCompleted) {
      await navigatorDb.prepare('INSERT OR IGNORE INTO child_transition_tasks (child_id, task_id) VALUES (?, ?)').run(childId, taskId);
    } else {
      await navigatorDb.prepare('DELETE FROM child_transition_tasks WHERE child_id = ? AND task_id = ?').run(childId, taskId);
    }
    return true;
  } catch (err) {
    console.error('Failed to toggle transition task:', err);
    return false;
  }
}

export async function getSelfCareLog(childId: string): Promise<Record<string, boolean>> {
  const defaultVal = { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false };
  try {
    const data = await navigatorDb.prepare('SELECT * FROM caregiver_selfcare_logs WHERE child_id = ?').get(childId) as {
      mon: number;
      tue: number;
      wed: number;
      thu: number;
      fri: number;
      sat: number;
      sun: number;
    } | undefined;
    if (!data) return defaultVal;
    return {
      Mon: data.mon === 1,
      Tue: data.tue === 1,
      Wed: data.wed === 1,
      Thu: data.thu === 1,
      Fri: data.fri === 1,
      Sat: data.sat === 1,
      Sun: data.sun === 1
    };
  } catch (err) {
    console.error('Failed to get self care log:', err);
    return defaultVal;
  }
}

export async function saveSelfCareLog(childId: string, days: Record<string, boolean>): Promise<boolean> {
  if (isVercel && !usePg) return true;
  try {
    const stmt = await navigatorDb.prepare(`
      INSERT INTO caregiver_selfcare_logs (child_id, mon, tue, wed, thu, fri, sat, sun)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(child_id) DO UPDATE SET
        mon = excluded.mon,
        tue = excluded.tue,
        wed = excluded.wed,
        thu = excluded.thu,
        fri = excluded.fri,
        sat = excluded.sat,
        sun = excluded.sun
    `);
    stmt.run(
      childId,
      days.Mon ? 1 : 0,
      days.Tue ? 1 : 0,
      days.Wed ? 1 : 0,
      days.Thu ? 1 : 0,
      days.Fri ? 1 : 0,
      days.Sat ? 1 : 0,
      days.Sun ? 1 : 0
    );
    return true;
  } catch (err) {
    console.error('Failed to save self care log:', err);
    return false;
  }
}

export async function getChildCoordinator(childId: string): Promise<string> {
  try {
    const data = await navigatorDb.prepare('SELECT coordinator_name FROM child_coordinators WHERE child_id = ?').get(childId) as { coordinator_name: string } | undefined;
    return data ? decrypt(data.coordinator_name) : '';
  } catch (err) {
    console.error('Failed to get child coordinator:', err);
    return '';
  }
}

export async function saveChildCoordinator(childId: string, coordinatorName: string): Promise<boolean> {
  if (isVercel && !usePg) return true;
  try {
    const stmt = await navigatorDb.prepare(`
      INSERT INTO child_coordinators (child_id, coordinator_name)
      VALUES (?, ?)
      ON CONFLICT(child_id) DO UPDATE SET coordinator_name = excluded.coordinator_name
    `);
    stmt.run(childId, encrypt(coordinatorName));
    return true;
  } catch (err) {
    console.error('Failed to save child coordinator:', err);
    return false;
  }
}

// ----------------------------------------------------
// 8. Caregiver Financial Profiles, Waitlists, IEP Prep & Overtime Schedules
// ----------------------------------------------------

export interface CaregiverFinancialProfile {
  child_id: string;
  savings: number;
  funding_source: string;
  expected_balance: string;
  spending_timeline: string;
  is_rc_client: number;
  has_diagnosis: number;
  major_limitations: number;
  has_medical_needs: number;
  child_medi_cal: number;
  family_size: number;
  gross_income: number;
  rc_children: number;
}

export async function getCaregiverFinancialProfile(childId: string): Promise<CaregiverFinancialProfile | null> {
  try {
    const res = await navigatorDb.prepare('SELECT * FROM caregiver_financial_profiles WHERE child_id = ?').get(childId) as CaregiverFinancialProfile | undefined;
    return res || null;
  } catch (err) {
    console.error('Failed to get caregiver financial profile:', err);
    return null;
  }
}

export async function saveCaregiverFinancialProfile(profile: CaregiverFinancialProfile): Promise<boolean> {
  if (isVercel && !usePg) return true;
  try {
    const stmt = await navigatorDb.prepare(`
      INSERT INTO caregiver_financial_profiles (
        child_id, savings, funding_source, expected_balance, spending_timeline,
        is_rc_client, has_diagnosis, major_limitations, has_medical_needs,
        child_medi_cal, family_size, gross_income, rc_children
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(child_id) DO UPDATE SET
        savings = excluded.savings,
        funding_source = excluded.funding_source,
        expected_balance = excluded.expected_balance,
        spending_timeline = excluded.spending_timeline,
        is_rc_client = excluded.is_rc_client,
        has_diagnosis = excluded.has_diagnosis,
        major_limitations = excluded.major_limitations,
        has_medical_needs = excluded.has_medical_needs,
        child_medi_cal = excluded.child_medi_cal,
        family_size = excluded.family_size,
        gross_income = excluded.gross_income,
        rc_children = excluded.rc_children
    `);
    await stmt.run(
      profile.child_id,
      profile.savings,
      profile.funding_source,
      profile.expected_balance,
      profile.spending_timeline,
      profile.is_rc_client,
      profile.has_diagnosis,
      profile.major_limitations,
      profile.has_medical_needs,
      profile.child_medi_cal,
      profile.family_size,
      profile.gross_income,
      profile.rc_children
    );
    return true;
  } catch (err) {
    console.error('Failed to save caregiver financial profile:', err);
    return false;
  }
}

export interface WaitlistItem {
  id: string;
  child_id: string;
  provider_name: string;
  service_category: string;
  date_joined: string;
  position: string;
  contact_phone: string;
  notes: string;
  status: string;
}

export async function getChildWaitlistItems(childId: string): Promise<WaitlistItem[]> {
  try {
    return await navigatorDb.prepare('SELECT * FROM child_waitlist_items WHERE child_id = ? ORDER BY id DESC').all(childId) as WaitlistItem[];
  } catch (err) {
    console.error('Failed to get child waitlist items:', err);
    return [];
  }
}

export async function saveChildWaitlistItem(item: WaitlistItem): Promise<boolean> {
  if (isVercel && !usePg) return true;
  try {
    const stmt = await navigatorDb.prepare(`
      INSERT INTO child_waitlist_items (id, child_id, provider_name, service_category, date_joined, position, contact_phone, notes, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        provider_name = excluded.provider_name,
        service_category = excluded.service_category,
        date_joined = excluded.date_joined,
        position = excluded.position,
        contact_phone = excluded.contact_phone,
        notes = excluded.notes,
        status = excluded.status
    `);
    await stmt.run(
      item.id,
      item.child_id,
      item.provider_name,
      item.service_category,
      item.date_joined,
      item.position,
      item.contact_phone,
      item.notes,
      item.status
    );
    return true;
  } catch (err) {
    console.error('Failed to save child waitlist item:', err);
    return false;
  }
}

export async function deleteChildWaitlistItem(id: string): Promise<boolean> {
  if (isVercel && !usePg) return true;
  try {
    await navigatorDb.prepare('DELETE FROM child_waitlist_items WHERE id = ?').run(id);
    return true;
  } catch (err) {
    console.error('Failed to delete child waitlist item:', err);
    return false;
  }
}

export interface ChildIepPrepData {
  child_id: string;
  strengths: string;
  academic_concerns: string;
  speech_concerns: string;
  sensory_concerns: string;
  motor_concerns: string;
  social_concerns: string;
  requested_services: string;
  parent_vision: string;
}

export async function getChildIepPrepData(childId: string): Promise<ChildIepPrepData | null> {
  try {
    const res = await navigatorDb.prepare('SELECT * FROM child_iep_prep_data WHERE child_id = ?').get(childId) as ChildIepPrepData | undefined;
    return res || null;
  } catch (err) {
    console.error('Failed to get IEP prep data:', err);
    return null;
  }
}

export async function saveChildIepPrepData(data: ChildIepPrepData): Promise<boolean> {
  if (isVercel && !usePg) return true;
  try {
    const stmt = await navigatorDb.prepare(`
      INSERT INTO child_iep_prep_data (
        child_id, strengths, academic_concerns, speech_concerns,
        sensory_concerns, motor_concerns, social_concerns, requested_services, parent_vision
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(child_id) DO UPDATE SET
        strengths = excluded.strengths,
        academic_concerns = excluded.academic_concerns,
        speech_concerns = excluded.speech_concerns,
        sensory_concerns = excluded.sensory_concerns,
        motor_concerns = excluded.motor_concerns,
        social_concerns = excluded.social_concerns,
        requested_services = excluded.requested_services,
        parent_vision = excluded.parent_vision
    `);
    await stmt.run(
      data.child_id,
      data.strengths,
      data.academic_concerns,
      data.speech_concerns,
      data.sensory_concerns,
      data.motor_concerns,
      data.social_concerns,
      data.requested_services,
      data.parent_vision
    );
    return true;
  } catch (err) {
    console.error('Failed to save IEP prep data:', err);
    return false;
  }
}

export interface IhssOvertimeSchedule {
  child_id: string;
  feeding_rank: number;
  bowel_rank: number;
  bathing_rank: number;
  dressing_rank: number;
  ambulation_rank: number;
  has_paramedical: number;
  paramedical_hours: number;
  paramedical_desc: string;
  requires_supervision: number;
  ihss_wage: number;
  recipient_count: number;
  monthly_hours_1: number;
  monthly_hours_2: number;
  monthly_hours_3: number;
  weekly_travel_hours: number;
  schedule_grid_json: string;
}

export async function getIhssOvertimeSchedule(childId: string): Promise<IhssOvertimeSchedule | null> {
  try {
    const res = await navigatorDb.prepare('SELECT * FROM ihss_overtime_schedules WHERE child_id = ?').get(childId) as IhssOvertimeSchedule | undefined;
    return res || null;
  } catch (err) {
    console.error('Failed to get IHSS overtime schedule:', err);
    return null;
  }
}

export async function saveIhssOvertimeSchedule(schedule: IhssOvertimeSchedule): Promise<boolean> {
  if (isVercel && !usePg) return true;
  try {
    const stmt = await navigatorDb.prepare(`
      INSERT INTO ihss_overtime_schedules (
        child_id, feeding_rank, bowel_rank, bathing_rank, dressing_rank, ambulation_rank,
        has_paramedical, paramedical_hours, paramedical_desc, requires_supervision, ihss_wage,
        recipient_count, monthly_hours_1, monthly_hours_2, monthly_hours_3, weekly_travel_hours, schedule_grid_json
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(child_id) DO UPDATE SET
        feeding_rank = excluded.feeding_rank,
        bowel_rank = excluded.bowel_rank,
        bathing_rank = excluded.bathing_rank,
        dressing_rank = excluded.dressing_rank,
        ambulation_rank = excluded.ambulation_rank,
        has_paramedical = excluded.has_paramedical,
        paramedical_hours = excluded.paramedical_hours,
        paramedical_desc = excluded.paramedical_desc,
        requires_supervision = excluded.requires_supervision,
        ihss_wage = excluded.ihss_wage,
        recipient_count = excluded.recipient_count,
        monthly_hours_1 = excluded.monthly_hours_1,
        monthly_hours_2 = excluded.monthly_hours_2,
        monthly_hours_3 = excluded.monthly_hours_3,
        weekly_travel_hours = excluded.weekly_travel_hours,
        schedule_grid_json = excluded.schedule_grid_json
    `);
    await stmt.run(
      schedule.child_id,
      schedule.feeding_rank,
      schedule.bowel_rank,
      schedule.bathing_rank,
      schedule.dressing_rank,
      schedule.ambulation_rank,
      schedule.has_paramedical,
      schedule.paramedical_hours,
      schedule.paramedical_desc,
      schedule.requires_supervision,
      schedule.ihss_wage,
      schedule.recipient_count,
      schedule.monthly_hours_1,
      schedule.monthly_hours_2,
      schedule.monthly_hours_3,
      schedule.weekly_travel_hours,
      schedule.schedule_grid_json
    );
    return true;
  } catch (err) {
    console.error('Failed to save IHSS overtime schedule:', err);
    return false;
  }
}

export interface ChildSdpBudget {
  child_id: string;
  pos_spend: number;
  one_time_deductions: number;
  fms_model: string;
  allocated_community: number;
  allocated_respite: number;
  allocated_therapies: number;
  allocated_equipment: number;
  unmet_needs_json: string;
}

export async function getChildSdpBudget(childId: string): Promise<ChildSdpBudget | null> {
  try {
    const res = await navigatorDb.prepare('SELECT * FROM child_sdp_budgets WHERE child_id = ?').get(childId) as ChildSdpBudget | undefined;
    return res || null;
  } catch (err) {
    console.error('Failed to get child SDP budget:', err);
    return null;
  }
}

export async function saveChildSdpBudget(budget: ChildSdpBudget): Promise<boolean> {
  if (isVercel && !usePg) return true;
  try {
    const stmt = await navigatorDb.prepare(`
      INSERT INTO child_sdp_budgets (
        child_id, pos_spend, one_time_deductions, fms_model,
        allocated_community, allocated_respite, allocated_therapies, allocated_equipment, unmet_needs_json
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(child_id) DO UPDATE SET
        pos_spend = excluded.pos_spend,
        one_time_deductions = excluded.one_time_deductions,
        fms_model = excluded.fms_model,
        allocated_community = excluded.allocated_community,
        allocated_respite = excluded.allocated_respite,
        allocated_therapies = excluded.allocated_therapies,
        allocated_equipment = excluded.allocated_equipment,
        unmet_needs_json = excluded.unmet_needs_json
    `);
    await stmt.run(
      budget.child_id,
      budget.pos_spend,
      budget.one_time_deductions,
      budget.fms_model,
      budget.allocated_community,
      budget.allocated_respite,
      budget.allocated_therapies,
      budget.allocated_equipment,
      budget.unmet_needs_json
    );
    return true;
  } catch (err) {
    console.error('Failed to save child SDP budget:', err);
    return false;
  }
}

export interface KnowledgeArticle {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  title_es: string;
  subtitle_es: string;
  read_time: string;
  read_time_es: string;
  difficulty: string;
  color: string;
  steps_json: string;
  steps_json_es: string;
}

export async function getKnowledgeArticles(): Promise<KnowledgeArticle[]> {
  try {
    return await navigatorDb.prepare('SELECT * FROM knowledge_articles').all() as KnowledgeArticle[];
  } catch (err) {
    console.error('Failed to get knowledge articles:', err);
    return [];
  }
}

export async function searchKnowledgeArticles(query: string): Promise<KnowledgeArticle[]> {
  try {
    if (!query.trim()) {
      return await getKnowledgeArticles();
    }
    const searchTerm = `%${query.trim()}%`;
    return await navigatorDb.prepare(`
      SELECT * FROM knowledge_articles 
      WHERE title LIKE ? OR subtitle LIKE ? 
         OR title_es LIKE ? OR subtitle_es LIKE ? 
         OR steps_json LIKE ? OR steps_json_es LIKE ?
    `).all(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm) as KnowledgeArticle[];
  } catch (err) {
    console.error('Failed to search knowledge articles:', err);
    return [];
  }
}

// Helper sitemap fetch districts
export async function getSchoolDistrictsForSitemap(): Promise<SchoolDistrict[]> {
  try {
    return await navigatorDb.prepare(`
      SELECT *
      FROM school_districts
      WHERE (spec_ed_contact_phone IS NOT NULL AND TRIM(spec_ed_contact_phone) != '')
         OR inclusion_rate_pct IS NOT NULL
    `).all() as SchoolDistrict[];
  } catch {
    return [];
  }
}

// Dynamic reviews database functions
export async function getReviews(entityId?: string | null, entityType?: string | null, countyId?: string | null): Promise<DirectoryReview[]> {
  try {
    if (entityId && entityType) {
      return await navigatorDb
        .prepare('SELECT * FROM directory_reviews WHERE entity_id = ? AND entity_type = ? ORDER BY created_at DESC LIMIT 50')
        .all(entityId, entityType) as DirectoryReview[];
    } else if (countyId) {
      return await navigatorDb
        .prepare('SELECT * FROM directory_reviews WHERE county_id = ? ORDER BY created_at DESC LIMIT 100')
        .all(countyId) as DirectoryReview[];
    } else {
      return await navigatorDb
        .prepare('SELECT * FROM directory_reviews ORDER BY created_at DESC LIMIT 50')
        .all() as DirectoryReview[];
    }
  } catch (err) {
    console.error('Failed to fetch reviews:', err);
    return [];
  }
}

export async function saveReview(review: Omit<DirectoryReview, 'id' | 'helpful_count' | 'created_at'>): Promise<any> {
  try {
    const result = await navigatorDb
      .prepare(`
        INSERT INTO directory_reviews 
          (entity_type, entity_id, entity_name, county_id, rating, comment, reviewer_label, experience_type, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        review.entity_type,
        review.entity_id,
        review.entity_name,
        review.county_id,
        review.rating,
        review.comment,
        review.reviewer_label || 'Parent',
        review.experience_type || null,
        new Date().toISOString()
      );
    return result;
  } catch (err) {
    console.error('Failed to save review:', err);
    throw err;
  }
}

export async function incrementReviewHelpful(reviewId: number): Promise<void> {
  try {
    await navigatorDb
      .prepare('UPDATE directory_reviews SET helpful_count = helpful_count + 1 WHERE id = ?')
      .run(reviewId);
  } catch (err) {
    console.error('Failed to increment review helpful count:', err);
    throw err;
  }
}

// -------------------------------------------------------------
// CLINICAL DOCUMENTS & AI OCR FUNCTIONS
// -------------------------------------------------------------

export interface ChildClinicalDocument {
  id: string;
  child_id: string;
  file_name: string;
  document_type: string;
  parsed_data_json: string; // Will be encrypted/decrypted at database level
  uploaded_at: string;
  status: string; // 'pending_verification' | 'verified'
}

export async function getChildClinicalDocuments(childId: string): Promise<ChildClinicalDocument[]> {
  try {
    const rows = await navigatorDb.prepare('SELECT * FROM child_clinical_documents WHERE child_id = ? ORDER BY uploaded_at DESC').all(childId) as any[];
    return rows.map(row => ({
      ...row,
      parsed_data_json: decrypt(row.parsed_data_json)
    }));
  } catch (err) {
    console.error('Failed to get clinical documents:', err);
    return [];
  }
}

export async function saveClinicalDocument(doc: ChildClinicalDocument): Promise<boolean> {
  if (isVercel && !usePg) return true;
  try {
    const encryptedData = encrypt(doc.parsed_data_json);
    const stmt = await navigatorDb.prepare(`
      INSERT INTO child_clinical_documents (id, child_id, file_name, document_type, parsed_data_json, uploaded_at, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        file_name = excluded.file_name,
        document_type = excluded.document_type,
        parsed_data_json = excluded.parsed_data_json,
        status = excluded.status
    `);
    await stmt.run(
      doc.id,
      doc.child_id,
      doc.file_name,
      doc.document_type,
      encryptedData,
      doc.uploaded_at,
      doc.status
    );
    return true;
  } catch (err) {
    console.error('Failed to save clinical document:', err);
    return false;
  }
}

export async function deleteClinicalDocument(docId: string): Promise<boolean> {
  if (isVercel && !usePg) return true;
  try {
    await navigatorDb.prepare('DELETE FROM child_clinical_documents WHERE id = ?').run(docId);
    return true;
  } catch (err) {
    console.error('Failed to delete clinical document:', err);
    return false;
  }
}

// -------------------------------------------------------------
// DIRECT REFERRALS & ADVOCATE CONSULTATION MESSAGING FUNCTIONS
// -------------------------------------------------------------

export interface ConsultationThread {
  id: string;
  child_id: string;
  advocate_id: string;
  status: string; // 'active' | 'archived'
  created_at: string;
  advocate_name?: string;
  advocate_credentials?: string;
}

export interface ConsultationMessage {
  id: string;
  thread_id: string;
  sender_role: 'parent' | 'advocate';
  message_text: string; // Will be encrypted/decrypted at database level
  attachments_json: string | null; // Will be encrypted/decrypted at database level
  created_at: string;
}

export async function getConsultationThreads(childId: string): Promise<ConsultationThread[]> {
  try {
    const rows = await navigatorDb.prepare(`
      SELECT t.*, a.name as advocate_name, a.credentials as advocate_credentials
      FROM consultation_threads t
      JOIN iep_advocates a ON t.advocate_id = a.id
      WHERE t.child_id = ?
      ORDER BY t.created_at DESC
    `).all(childId) as any[];
    return rows;
  } catch (err) {
    console.error('Failed to get consultation threads:', err);
    return [];
  }
}

export async function getThreadMessages(threadId: string): Promise<ConsultationMessage[]> {
  try {
    const rows = await navigatorDb.prepare('SELECT * FROM consultation_messages WHERE thread_id = ? ORDER BY created_at ASC').all(threadId) as any[];
    return rows.map(row => ({
      ...row,
      message_text: decrypt(row.message_text),
      attachments_json: row.attachments_json ? decrypt(row.attachments_json) : null
    }));
  } catch (err) {
    console.error('Failed to get thread messages:', err);
    return [];
  }
}

export async function createConsultationThread(id: string, childId: string, advocateId: string): Promise<boolean> {
  if (isVercel && !usePg) return true;
  try {
    const stmt = await navigatorDb.prepare(`
      INSERT INTO consultation_threads (id, child_id, advocate_id, status, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    await stmt.run(id, childId, advocateId, 'active', new Date().toISOString());
    return true;
  } catch (err) {
    console.error('Failed to create consultation thread:', err);
    return false;
  }
}

export async function insertMessage(msg: ConsultationMessage): Promise<boolean> {
  if (isVercel && !usePg) return true;
  try {
    const encryptedText = encrypt(msg.message_text);
    const encryptedAttachments = msg.attachments_json ? encrypt(msg.attachments_json) : null;
    const stmt = await navigatorDb.prepare(`
      INSERT INTO consultation_messages (id, thread_id, sender_role, message_text, attachments_json, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    await stmt.run(msg.id, msg.thread_id, msg.sender_role, encryptedText, encryptedAttachments, msg.created_at);
    return true;
  } catch (err) {
    console.error('Failed to insert message:', err);
    return false;
  }
}

// -------------------------------------------------------------
// CRYPTOGRAPHIC TIME-BOUNDED PORTAL TOKENS FUNCTIONS
// -------------------------------------------------------------

export interface SharedPortalToken {
  id: string;
  child_id: string;
  token: string;
  expires_at: string; // ISO date string
  access_scope: 'read_only' | 'read_write';
  created_at: string;
}

export async function saveSharedPortalToken(token: SharedPortalToken): Promise<boolean> {
  if (isVercel && !usePg) return true;
  try {
    const stmt = await navigatorDb.prepare(`
      INSERT INTO shared_portal_tokens (id, child_id, token, expires_at, access_scope, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    await stmt.run(token.id, token.child_id, token.token, token.expires_at, token.access_scope, token.created_at);
    return true;
  } catch (err) {
    console.error('Failed to save shared portal token:', err);
    return false;
  }
}

export async function verifyShareToken(tokenStr: string): Promise<SharedPortalToken | null> {
  try {
    const res = await navigatorDb.prepare(`
      SELECT * FROM shared_portal_tokens 
      WHERE token = ? AND expires_at > ?
    `).get(tokenStr, new Date().toISOString()) as SharedPortalToken | undefined;
    return res || null;
  } catch (err) {
    console.error('Failed to verify share token:', err);
    return null;
  }
}

export async function getActiveSharedPortalTokens(childId: string): Promise<SharedPortalToken[]> {
  try {
    return await navigatorDb.prepare('SELECT * FROM shared_portal_tokens WHERE child_id = ? ORDER BY created_at DESC').all(childId) as SharedPortalToken[];
  } catch (err) {
    console.error('Failed to get active share tokens:', err);
    return [];
  }
}

export async function revokeShareToken(tokenId: string): Promise<boolean> {
  if (isVercel && !usePg) return true;
  try {
    await navigatorDb.prepare('DELETE FROM shared_portal_tokens WHERE id = ?').run(tokenId);
    return true;
  } catch (err) {
    console.error('Failed to revoke share token:', err);
    return false;
  }
}

export interface LegalDecision {
  id: string;
  state: string;
  case_name: string;
  case_number?: string | null;
  decision_date?: string | null;
  summary?: string | null;
  document_url?: string | null;
  body_text?: string | null;
  source?: string | null;
  scraped_at?: string | null;
  school_district_id?: string | null;
  outcome?: 'parent_win' | 'district_win' | 'unknown' | null;
}

export async function getSchoolDistrictById(id: string): Promise<SchoolDistrict | undefined> {
  try {
    return await navigatorDb.prepare('SELECT * FROM school_districts WHERE id = ?').get(id) as SchoolDistrict | undefined;
  } catch (err) {
    console.error(`Failed to get school district by id ${id}:`, err);
    return undefined;
  }
}

export async function getSchoolDistrictLitigation(districtId: string) {
  try {
    const cases = await navigatorDb.prepare('SELECT * FROM legal_decisions WHERE school_district_id = ? ORDER BY decision_date DESC').all(districtId) as LegalDecision[];
    
    let parentWins = 0;
    let districtWins = 0;
    let unknownWins = 0;
    
    for (const c of cases) {
      if (c.outcome === 'parent_win') {
        parentWins++;
      } else if (c.outcome === 'district_win') {
        districtWins++;
      } else {
        unknownWins++;
      }
    }
    
    return {
      totalCases: cases.length,
      parentWins,
      districtWins,
      unknownWins,
      cases
    };
  } catch (err) {
    console.error(`Failed to get school district litigation for ${districtId}:`, err);
    return {
      totalCases: 0,
      parentWins: 0,
      districtWins: 0,
      unknownWins: 0,
      cases: []
    };
  }
}

export async function getSchoolDistrictsWithLitigation() {
  try {
    // 1. Fetch all districts
    const districts = await navigatorDb.prepare('SELECT * FROM school_districts ORDER BY name ASC').all() as SchoolDistrict[];
    
    // 2. Fetch case aggregations
    const caseStats = await navigatorDb.prepare(`
      SELECT 
        school_district_id,
        COUNT(*) as total_cases,
        SUM(CASE WHEN outcome = 'parent_win' THEN 1 ELSE 0 END) as parent_wins,
        SUM(CASE WHEN outcome = 'district_win' THEN 1 ELSE 0 END) as district_wins,
        SUM(CASE WHEN outcome NOT IN ('parent_win', 'district_win') OR outcome IS NULL THEN 1 ELSE 0 END) as unknown_wins
      FROM legal_decisions
      GROUP BY school_district_id
    `).all() as {
      school_district_id: string;
      total_cases: number;
      parent_wins: number;
      district_wins: number;
      unknown_wins: number;
    }[];

    const statsMap = new Map(caseStats.map(s => [s.school_district_id, s]));

    return districts.map(d => {
      const stats = statsMap.get(d.id);
      
      // Infer state from county_id (e.g. "travis-tx" -> "TX")
      let state = 'CA';
      if (d.county_id && d.county_id.includes('-')) {
        const parts = d.county_id.split('-');
        const lastPart = parts[parts.length - 1];
        if (lastPart.length === 2) {
          state = lastPart.toUpperCase();
        }
      }

      return {
        ...d,
        state,
        totalCases: stats ? stats.total_cases : 0,
        parentWins: stats ? stats.parent_wins : 0,
        districtWins: stats ? stats.district_wins : 0,
        unknownWins: stats ? stats.unknown_wins : 0,
        parentWinRate: stats && stats.total_cases > 0 ? (stats.parent_wins / stats.total_cases) * 100 : 0
      };
    });
  } catch (err) {
    console.error('Failed to get school districts with litigation:', err);
    return [];
  }
}

