import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');
const db = new Database(dbPath);

console.log('Initializing staging tables in:', dbPath);

const schema = `
-- Staging Source Targets
CREATE TABLE IF NOT EXISTS staging_source_targets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    state_id TEXT NOT NULL,
    category TEXT NOT NULL,
    source_name TEXT NOT NULL,
    organization_type TEXT NOT NULL,
    source_url TEXT NOT NULL,
    domain TEXT NOT NULL,
    target_tables TEXT NOT NULL,
    expected_fields TEXT NOT NULL,
    crawl_method TEXT NOT NULL,
    robots_txt_status TEXT NOT NULL,
    terms_risk TEXT NOT NULL,
    priority INTEGER NOT NULL,
    update_frequency_estimate TEXT,
    notes TEXT,
    last_checked_at TEXT
);

CREATE TABLE IF NOT EXISTS staging_scraped_county_offices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_url TEXT NOT NULL,
    source_name TEXT,
    source_type TEXT,
    scraped_at TEXT NOT NULL,
    state_id TEXT NOT NULL,
    county_id TEXT,
    confidence_score REAL,
    extraction_notes TEXT,
    raw_text_excerpt TEXT,
    suggested_target_table TEXT,
    suggested_target_id TEXT,
    duplicate_candidate_id TEXT,
    review_status TEXT DEFAULT 'pending_review',
    extracted_name TEXT NOT NULL,
    extracted_phone TEXT NOT NULL,
    extracted_email TEXT,
    extracted_address TEXT NOT NULL,
    extracted_website TEXT,
    program_id TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS staging_scraped_state_resource_agencies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_url TEXT NOT NULL,
    source_name TEXT,
    source_type TEXT,
    scraped_at TEXT NOT NULL,
    state_id TEXT NOT NULL,
    county_id TEXT,
    confidence_score REAL,
    extraction_notes TEXT,
    raw_text_excerpt TEXT,
    suggested_target_table TEXT,
    suggested_target_id TEXT,
    duplicate_candidate_id TEXT,
    review_status TEXT DEFAULT 'pending_review',
    extracted_name TEXT NOT NULL,
    agency_type TEXT NOT NULL,
    counties_served TEXT NOT NULL,
    catchment_boundaries TEXT NOT NULL,
    extracted_website TEXT NOT NULL,
    extracted_phone TEXT NOT NULL,
    early_intervention_contact TEXT NOT NULL,
    agency_intake_contact TEXT NOT NULL,
    eligibility_info_page TEXT NOT NULL,
    services_page TEXT NOT NULL,
    appeals_info TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS staging_scraped_regional_education_agencies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_url TEXT NOT NULL,
    source_name TEXT,
    source_type TEXT,
    scraped_at TEXT NOT NULL,
    state_id TEXT NOT NULL,
    county_id TEXT,
    confidence_score REAL,
    extraction_notes TEXT,
    raw_text_excerpt TEXT,
    suggested_target_table TEXT,
    suggested_target_id TEXT,
    duplicate_candidate_id TEXT,
    review_status TEXT DEFAULT 'pending_review',
    extracted_name TEXT NOT NULL,
    agency_type TEXT NOT NULL,
    counties_served TEXT NOT NULL,
    extracted_website TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS staging_scraped_school_districts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_url TEXT NOT NULL,
    source_name TEXT,
    source_type TEXT,
    scraped_at TEXT NOT NULL,
    state_id TEXT NOT NULL,
    county_id TEXT,
    confidence_score REAL,
    extraction_notes TEXT,
    raw_text_excerpt TEXT,
    suggested_target_table TEXT,
    suggested_target_id TEXT,
    duplicate_candidate_id TEXT,
    review_status TEXT DEFAULT 'pending_review',
    extracted_name TEXT NOT NULL,
    spec_ed_contact_phone TEXT NOT NULL,
    spec_ed_contact_email TEXT,
    extracted_website TEXT NOT NULL,
    total_enrollment INTEGER
);

CREATE TABLE IF NOT EXISTS staging_scraped_nonprofit_organizations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_url TEXT NOT NULL,
    source_name TEXT,
    source_type TEXT,
    scraped_at TEXT NOT NULL,
    state_id TEXT NOT NULL,
    county_id TEXT,
    confidence_score REAL,
    extraction_notes TEXT,
    raw_text_excerpt TEXT,
    suggested_target_table TEXT,
    suggested_target_id TEXT,
    duplicate_candidate_id TEXT,
    review_status TEXT DEFAULT 'pending_review',
    extracted_name TEXT NOT NULL,
    extracted_website TEXT NOT NULL,
    extracted_phone TEXT NOT NULL,
    focus_condition TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS staging_scraped_iep_advocates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_url TEXT NOT NULL,
    source_name TEXT,
    source_type TEXT,
    scraped_at TEXT NOT NULL,
    state_id TEXT NOT NULL,
    county_id TEXT,
    confidence_score REAL,
    extraction_notes TEXT,
    raw_text_excerpt TEXT,
    suggested_target_table TEXT,
    suggested_target_id TEXT,
    duplicate_candidate_id TEXT,
    review_status TEXT DEFAULT 'pending_review',
    extracted_name TEXT NOT NULL,
    credentials TEXT NOT NULL,
    experience_years INTEGER,
    price_rate TEXT,
    counties_served TEXT,
    languages_spoken TEXT,
    extracted_phone TEXT NOT NULL,
    extracted_email TEXT NOT NULL,
    extracted_website TEXT NOT NULL,
    specialties TEXT,
    description TEXT
);

CREATE TABLE IF NOT EXISTS staging_scraped_resource_providers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_url TEXT NOT NULL,
    source_name TEXT,
    source_type TEXT,
    scraped_at TEXT NOT NULL,
    state_id TEXT NOT NULL,
    county_id TEXT,
    confidence_score REAL,
    extraction_notes TEXT,
    raw_text_excerpt TEXT,
    suggested_target_table TEXT,
    suggested_target_id TEXT,
    duplicate_candidate_id TEXT,
    review_status TEXT DEFAULT 'pending_review',
    extracted_name TEXT NOT NULL,
    categories TEXT NOT NULL,
    extracted_phone TEXT NOT NULL,
    extracted_email TEXT,
    extracted_address TEXT NOT NULL,
    accepts_medi_cal INTEGER
);

CREATE TABLE IF NOT EXISTS staging_scraped_forms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_url TEXT NOT NULL,
    source_name TEXT,
    source_type TEXT,
    scraped_at TEXT NOT NULL,
    state_id TEXT NOT NULL,
    county_id TEXT,
    confidence_score REAL,
    extraction_notes TEXT,
    raw_text_excerpt TEXT,
    suggested_target_table TEXT,
    suggested_target_id TEXT,
    duplicate_candidate_id TEXT,
    review_status TEXT DEFAULT 'pending_review',
    slug TEXT NOT NULL,
    program TEXT NOT NULL,
    official_download_url TEXT NOT NULL,
    who_uses_it TEXT,
    who_signs_it TEXT,
    where_to_send_it TEXT,
    letter_script TEXT
);

CREATE TABLE IF NOT EXISTS staging_scraped_programs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_url TEXT NOT NULL,
    source_name TEXT,
    source_type TEXT,
    scraped_at TEXT NOT NULL,
    state_id TEXT NOT NULL,
    county_id TEXT,
    confidence_score REAL,
    extraction_notes TEXT,
    raw_text_excerpt TEXT,
    suggested_target_table TEXT,
    suggested_target_id TEXT,
    duplicate_candidate_id TEXT,
    review_status TEXT DEFAULT 'pending_review',
    extracted_name TEXT NOT NULL,
    description TEXT,
    who_it_is_for TEXT,
    who_might_qualify TEXT,
    official_source_url TEXT NOT NULL,
    category TEXT NOT NULL,
    program_type TEXT NOT NULL,
    extracted_phone TEXT,
    extracted_email TEXT,
    action_url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS staging_scraped_help_resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_url TEXT NOT NULL,
    source_name TEXT,
    source_type TEXT,
    scraped_at TEXT NOT NULL,
    state_id TEXT NOT NULL,
    county_id TEXT,
    confidence_score REAL,
    extraction_notes TEXT,
    raw_text_excerpt TEXT,
    suggested_target_table TEXT,
    suggested_target_id TEXT,
    duplicate_candidate_id TEXT,
    review_status TEXT DEFAULT 'pending_review',
    extracted_name TEXT NOT NULL,
    gap_family TEXT NOT NULL,
    help_type TEXT NOT NULL,
    extracted_website TEXT,
    extracted_phone TEXT,
    extracted_email TEXT,
    extracted_address TEXT,
    action_url TEXT NOT NULL,
    service_summary TEXT
);

CREATE TABLE IF NOT EXISTS staging_scraped_knowledge_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_url TEXT NOT NULL,
    source_name TEXT,
    source_type TEXT,
    scraped_at TEXT NOT NULL,
    state_id TEXT NOT NULL,
    county_id TEXT,
    confidence_score REAL,
    extraction_notes TEXT,
    raw_text_excerpt TEXT,
    suggested_target_table TEXT,
    suggested_target_id TEXT,
    duplicate_candidate_id TEXT,
    review_status TEXT DEFAULT 'pending_review',
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    content_category TEXT NOT NULL,
    canonical_url TEXT NOT NULL,
    summary TEXT
);

CREATE TABLE IF NOT EXISTS staging_scraped_waitlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_url TEXT NOT NULL,
    source_name TEXT,
    source_type TEXT,
    scraped_at TEXT NOT NULL,
    state_id TEXT NOT NULL,
    county_id TEXT,
    confidence_score REAL,
    extraction_notes TEXT,
    raw_text_excerpt TEXT,
    suggested_target_table TEXT,
    suggested_target_id TEXT,
    duplicate_candidate_id TEXT,
    review_status TEXT DEFAULT 'pending_review',
    program_id TEXT NOT NULL,
    name TEXT NOT NULL,
    duration_label TEXT NOT NULL,
    duration_months REAL NOT NULL,
    status TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS staging_scraped_sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_url TEXT NOT NULL,
    source_name TEXT,
    source_type TEXT,
    scraped_at TEXT NOT NULL,
    state_id TEXT NOT NULL,
    county_id TEXT,
    confidence_score REAL,
    extraction_notes TEXT,
    raw_text_excerpt TEXT,
    suggested_target_table TEXT,
    suggested_target_id TEXT,
    duplicate_candidate_id TEXT,
    review_status TEXT DEFAULT 'pending_review',
    program_id TEXT NOT NULL,
    url TEXT NOT NULL,
    type TEXT NOT NULL,
    confidence_rating TEXT NOT NULL
);

-- Scraped Record Promotion Audit Trail
CREATE TABLE IF NOT EXISTS staging_promotion_audit (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    staging_table TEXT NOT NULL,
    staging_record_id INTEGER NOT NULL,
    target_table TEXT NOT NULL,
    target_record_id TEXT NOT NULL,
    promoted_at TEXT NOT NULL,
    source_url TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    reason TEXT NOT NULL
);
`;

db.exec(schema);
console.log('Staging schema created successfully!');
db.close();
