-- SQL Relational Schema for California Disability Navigator Database System
-- Target Engine: SQLite

-- Enable Foreign Key Enforcement
PRAGMA foreign_keys = ON;

-- 1. programs
CREATE TABLE IF NOT EXISTS programs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    who_it_is_for TEXT NOT NULL,
    who_might_qualify TEXT NOT NULL,
    official_source_url TEXT NOT NULL,
    category TEXT NOT NULL, -- 'federal' | 'state' | 'county'
    confidence_score INTEGER NOT NULL DEFAULT 5, -- 1 to 5 scale
    last_verified_date TEXT NOT NULL -- YYYY-MM-DD
);

-- 2. program_eligibility_rules
CREATE TABLE IF NOT EXISTS program_eligibility_rules (
    id TEXT PRIMARY KEY,
    program_id TEXT NOT NULL,
    min_age_years REAL NOT NULL DEFAULT 0.0,
    max_age_years REAL NOT NULL DEFAULT 18.0,
    required_condition TEXT, -- References conditions(id) or generic slug
    required_need TEXT, -- References functional_needs(id)
    insurance_status TEXT NOT NULL DEFAULT 'any', -- 'medi-cal' | 'private' | 'any'
    school_status TEXT NOT NULL DEFAULT 'any', -- 'iep' | '504' | 'early-start' | 'any'
    trigger_reason TEXT NOT NULL,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
);

-- 3. program_document_requirements
CREATE TABLE IF NOT EXISTS program_document_requirements (
    id TEXT PRIMARY KEY,
    program_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    is_mandatory INTEGER NOT NULL DEFAULT 1, -- 0 = False, 1 = True
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
);

-- 4. program_application_steps
CREATE TABLE IF NOT EXISTS program_application_steps (
    id TEXT PRIMARY KEY,
    program_id TEXT NOT NULL,
    step_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    action_description TEXT NOT NULL,
    apply_url_or_contact TEXT,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
);

-- 5. program_appeal_info
CREATE TABLE IF NOT EXISTS program_appeal_info (
    program_id TEXT PRIMARY KEY,
    deadline_days TEXT NOT NULL,
    appeal_steps TEXT NOT NULL,
    denial_reasons TEXT NOT NULL,
    appeal_form_name TEXT NOT NULL,
    official_appeal_source_url TEXT NOT NULL,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
);

-- 6. counties
CREATE TABLE IF NOT EXISTS counties (
    id TEXT PRIMARY KEY, -- 'los-angeles', 'orange', etc.
    name TEXT NOT NULL,
    website TEXT NOT NULL
);

-- 7. county_offices
CREATE TABLE IF NOT EXISTS county_offices (
    id TEXT PRIMARY KEY,
    county_id TEXT NOT NULL,
    program_id TEXT NOT NULL,
    office_name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    website TEXT,
    FOREIGN KEY (county_id) REFERENCES counties(id) ON DELETE CASCADE,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
);

-- 8. regional_centers
CREATE TABLE IF NOT EXISTS regional_centers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    counties_served TEXT NOT NULL, -- Comma-separated slug list
    catchment_boundaries TEXT NOT NULL,
    website TEXT NOT NULL,
    intake_phone TEXT NOT NULL,
    early_start_contact TEXT NOT NULL,
    lanterman_intake_contact TEXT NOT NULL,
    eligibility_info_page TEXT NOT NULL,
    services_page TEXT NOT NULL,
    appeals_info TEXT NOT NULL,
    frc_relationship TEXT NOT NULL,
    office_locations TEXT NOT NULL,
    languages TEXT NOT NULL, -- Comma-separated languages list
    last_verified_date TEXT NOT NULL,
    source_urls TEXT NOT NULL -- Comma-separated list
);

-- 9. selpas
CREATE TABLE IF NOT EXISTS selpas (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    counties_served TEXT NOT NULL,
    website TEXT NOT NULL
);

-- 10. school_districts
CREATE TABLE IF NOT EXISTS school_districts (
    id TEXT PRIMARY KEY,
    county_id TEXT NOT NULL,
    name TEXT NOT NULL,
    spec_ed_contact_phone TEXT NOT NULL,
    spec_ed_contact_email TEXT,
    website TEXT NOT NULL,
    FOREIGN KEY (county_id) REFERENCES counties(id) ON DELETE CASCADE
);

-- 11. resource_providers
CREATE TABLE IF NOT EXISTS resource_providers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    categories TEXT NOT NULL, -- Comma-separated list
    county_id TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT NOT NULL,
    accepts_medi_cal INTEGER NOT NULL DEFAULT 1,
    regional_center_vendor_ids TEXT NOT NULL, -- Comma-separated list
    FOREIGN KEY (county_id) REFERENCES counties(id) ON DELETE CASCADE
);

-- 12. nonprofit_organizations
CREATE TABLE IF NOT EXISTS nonprofit_organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    county_id TEXT NOT NULL,
    website TEXT NOT NULL,
    phone TEXT NOT NULL,
    focus_condition TEXT NOT NULL,
    FOREIGN KEY (county_id) REFERENCES counties(id) ON DELETE CASCADE
);

-- 13. conditions
CREATE TABLE IF NOT EXISTS conditions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    aliases TEXT NOT NULL, -- Comma-separated list
    parent_friendly_explanation TEXT NOT NULL,
    regional_center_relevance INTEGER NOT NULL DEFAULT 1,
    iep_relevance INTEGER NOT NULL DEFAULT 1,
    ccs_relevance INTEGER NOT NULL DEFAULT 1,
    ssi_relevance INTEGER NOT NULL DEFAULT 1,
    cal_able_relevance INTEGER NOT NULL DEFAULT 1,
    age_specific_notes TEXT NOT NULL,
    source_url TEXT NOT NULL,
    last_verified_date TEXT NOT NULL
);

-- 14. functional_needs
CREATE TABLE IF NOT EXISTS functional_needs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'communication' | 'mobility' | 'daily-living' | 'medical' | 'behavioral' | 'education' | 'planning'
    description TEXT NOT NULL,
    program_triggers TEXT NOT NULL -- Comma-separated program IDs
);

-- 15. age_bands
CREATE TABLE IF NOT EXISTS age_bands (
    id TEXT PRIMARY KEY, -- 'prenatal-newborn', '0-3', '3-5', 'k-12', '14-16', '16-18', '18plus'
    label TEXT NOT NULL,
    description TEXT NOT NULL
);

-- 16. insurance_types
CREATE TABLE IF NOT EXISTS insurance_types (
    id TEXT PRIMARY KEY, -- 'medi-cal', 'private', 'both', 'none'
    label TEXT NOT NULL
);

-- 17. family_cases
CREATE TABLE IF NOT EXISTS family_cases (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    created_at TEXT NOT NULL -- ISO Date YYYY-MM-DD
);

-- 18. child_profiles
CREATE TABLE IF NOT EXISTS child_profiles (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL,
    nickname TEXT NOT NULL,
    dob TEXT NOT NULL, -- YYYY-MM-DD
    county_id TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    insurance_type TEXT NOT NULL,
    school_status TEXT NOT NULL,
    language_preference TEXT NOT NULL DEFAULT 'english',
    caregiver_notes TEXT,
    FOREIGN KEY (case_id) REFERENCES family_cases(id) ON DELETE CASCADE,
    FOREIGN KEY (county_id) REFERENCES counties(id) ON DELETE CASCADE
);

-- JUNCTION TABLE: child_profile_conditions (Many-to-Many normalized mapping)
CREATE TABLE IF NOT EXISTS child_profile_conditions (
    child_id TEXT NOT NULL,
    condition_id TEXT NOT NULL,
    PRIMARY KEY (child_id, condition_id),
    FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (condition_id) REFERENCES conditions(id) ON DELETE CASCADE
);

-- JUNCTION TABLE: child_profile_needs (Many-to-Many normalized mapping)
CREATE TABLE IF NOT EXISTS child_profile_needs (
    child_id TEXT NOT NULL,
    need_id TEXT NOT NULL,
    PRIMARY KEY (child_id, need_id),
    FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (need_id) REFERENCES functional_needs(id) ON DELETE CASCADE
);

-- 19. case_program_statuses
CREATE TABLE IF NOT EXISTS case_program_statuses (
    id TEXT PRIMARY KEY,
    child_id TEXT NOT NULL,
    program_id TEXT NOT NULL,
    status TEXT NOT NULL, -- 'recommended' | 'not-started' | 'applied' | 'waiting' | 'approved' | 'denied' etc.
    updated_at TEXT NOT NULL,
    UNIQUE(child_id, program_id),
    FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
);

-- 20. document_checklist_items
CREATE TABLE IF NOT EXISTS document_checklist_items (
    id TEXT PRIMARY KEY,
    child_id TEXT NOT NULL,
    document_name TEXT NOT NULL,
    is_collected INTEGER NOT NULL DEFAULT 0, -- 0 = False, 1 = True
    program_id TEXT,
    file_mock_url TEXT,
    FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
);

-- 21. reminders
CREATE TABLE IF NOT EXISTS reminders (
    id TEXT PRIMARY KEY,
    child_id TEXT NOT NULL,
    program_id TEXT,
    title TEXT NOT NULL,
    due_date TEXT NOT NULL,
    is_completed INTEGER NOT NULL DEFAULT 0, -- 0 = False, 1 = True
    FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
);

-- 22. sources
CREATE TABLE IF NOT EXISTS sources (
    id TEXT PRIMARY KEY,
    program_id TEXT NOT NULL,
    url TEXT NOT NULL,
    type TEXT NOT NULL, -- 'official' | 'nonprofit' | 'provider' | 'scraped'
    confidence_rating TEXT NOT NULL, -- 'high' | 'medium' | 'low'
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
);

-- 23. source_verifications
CREATE TABLE IF NOT EXISTS source_verifications (
    id TEXT PRIMARY KEY,
    source_id TEXT NOT NULL,
    verified_by TEXT NOT NULL,
    verified_date TEXT NOT NULL,
    notes TEXT,
    FOREIGN KEY (source_id) REFERENCES sources(id) ON DELETE CASCADE
);

-- 24. user_submitted_resources
CREATE TABLE IF NOT EXISTS user_submitted_resources (
    id TEXT PRIMARY KEY,
    provider_name TEXT NOT NULL,
    category TEXT NOT NULL,
    county_id TEXT NOT NULL,
    phone TEXT NOT NULL,
    website TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
    submitted_at TEXT NOT NULL,
    FOREIGN KEY (county_id) REFERENCES counties(id) ON DELETE CASCADE
);

-- 25. coverage_gaps
CREATE TABLE IF NOT EXISTS coverage_gaps (
    id TEXT PRIMARY KEY,
    county_id TEXT NOT NULL,
    gap_category TEXT NOT NULL,
    description TEXT NOT NULL,
    severity TEXT NOT NULL, -- 'critical' | 'moderate' | 'low'
    FOREIGN KEY (county_id) REFERENCES counties(id) ON DELETE CASCADE
);

-- 26. verification_queue_items
CREATE TABLE IF NOT EXISTS verification_queue_items (
    id TEXT PRIMARY KEY,
    record_type TEXT NOT NULL, -- 'program' | 'county' | 'regional-center' | 'condition' | 'need'
    record_id TEXT NOT NULL,
    record_name TEXT NOT NULL,
    reason TEXT NOT NULL,
    verification_level INTEGER NOT NULL DEFAULT 5 -- Level 1-6 scale
);

-- Create optimized database indexes to accelerate query joins
CREATE INDEX IF NOT EXISTS idx_rules_program ON program_eligibility_rules(program_id);
CREATE INDEX IF NOT EXISTS idx_offices_county ON county_offices(county_id);
CREATE INDEX IF NOT EXISTS idx_offices_program ON county_offices(program_id);
CREATE INDEX IF NOT EXISTS idx_districts_county ON school_districts(county_id);
CREATE INDEX IF NOT EXISTS idx_junction_child_cond ON child_profile_conditions(child_id);
CREATE INDEX IF NOT EXISTS idx_junction_child_need ON child_profile_needs(child_id);
CREATE INDEX IF NOT EXISTS idx_statuses_child ON case_program_statuses(child_id);
CREATE INDEX IF NOT EXISTS idx_checklists_child ON document_checklist_items(child_id);
CREATE INDEX IF NOT EXISTS idx_reminders_child ON reminders(child_id);
