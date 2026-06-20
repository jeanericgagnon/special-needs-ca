-- SQL Relational Schema for California Disability Navigator Database System
-- Target Engine: SQLite

-- Enable Foreign Key Enforcement
PRAGMA foreign_keys = ON;

-- 0. states
CREATE TABLE IF NOT EXISTS states (
    id TEXT PRIMARY KEY,       -- 'california', 'texas', etc.
    name TEXT NOT NULL,        -- 'California', 'Texas'
    code TEXT NOT NULL UNIQUE  -- 'CA', 'TX'
);

-- 1. programs
CREATE TABLE IF NOT EXISTS programs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    who_it_is_for TEXT NOT NULL,
    who_might_qualify TEXT NOT NULL,
    official_source_url TEXT NOT NULL,
    category TEXT NOT NULL, -- 'federal' | 'state' | 'county'
    confidence_score REAL NOT NULL DEFAULT 5.0,
    last_verified_date TEXT NOT NULL, -- YYYY-MM-DD
    state_id TEXT REFERENCES states(id),
    source_url TEXT,
    source_type TEXT,
    data_origin TEXT,
    verification_status TEXT,
    last_scraped_at TEXT
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
-- 6. counties
CREATE TABLE IF NOT EXISTS counties (
    id TEXT PRIMARY KEY, -- 'los-angeles', 'orange', etc.
    state_id TEXT NOT NULL REFERENCES states(id),
    name TEXT NOT NULL,
    website TEXT NOT NULL,
    ihss_wage_rate REAL DEFAULT 16.00,
    medi_cal_plans TEXT
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
    source_url TEXT,
    source_type TEXT,
    data_origin TEXT,
    verification_status TEXT,
    last_verified_at TEXT,
    last_verified_date TEXT,
    last_scraped_at TEXT,
    confidence_score REAL,
    FOREIGN KEY (county_id) REFERENCES counties(id) ON DELETE CASCADE,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
);

-- 8. state_resource_agencies
CREATE TABLE IF NOT EXISTS state_resource_agencies (
    id TEXT PRIMARY KEY,
    state_id TEXT NOT NULL REFERENCES states(id),
    agency_type TEXT NOT NULL, -- 'regional_center' | 'lidda' | 'apd_office' | 'ddro'
    name TEXT NOT NULL,
    counties_served TEXT NOT NULL, -- Comma-separated slug list
    catchment_boundaries TEXT NOT NULL,
    website TEXT NOT NULL,
    intake_phone TEXT NOT NULL,
    early_intervention_contact TEXT NOT NULL,
    agency_intake_contact TEXT NOT NULL,
    eligibility_info_page TEXT NOT NULL,
    services_page TEXT NOT NULL,
    appeals_info TEXT NOT NULL,
    frc_relationship TEXT,
    office_locations TEXT,
    languages TEXT NOT NULL, -- Comma-separated languages list
    last_verified_date TEXT NOT NULL,
    source_urls TEXT NOT NULL, -- Comma-separated list
    source_url TEXT,
    source_type TEXT,
    data_origin TEXT,
    verification_status TEXT,
    last_scraped_at TEXT,
    confidence_score REAL
);

-- 9. regional_education_agencies
CREATE TABLE IF NOT EXISTS regional_education_agencies (
    id TEXT PRIMARY KEY,
    state_id TEXT NOT NULL REFERENCES states(id),
    agency_type TEXT NOT NULL, -- 'selpa' | 'boces' | 'resc'
    name TEXT NOT NULL,
    counties_served TEXT NOT NULL,
    website TEXT NOT NULL,
    source_url TEXT,
    source_type TEXT,
    data_origin TEXT,
    verification_status TEXT,
    last_verified_date TEXT,
    last_scraped_at TEXT,
    confidence_score REAL
);

-- Backward Compatible Views
CREATE VIEW IF NOT EXISTS regional_centers AS
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

CREATE VIEW IF NOT EXISTS selpas AS
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

-- 10. school_districts
CREATE TABLE IF NOT EXISTS school_districts (
    id TEXT PRIMARY KEY,
    county_id TEXT NOT NULL,
    name TEXT NOT NULL,
    spec_ed_contact_phone TEXT NOT NULL,
    spec_ed_contact_email TEXT,
    website TEXT NOT NULL,
    total_enrollment INTEGER,
    special_ed_pct REAL,
    inclusion_rate_pct REAL,
    self_contained_rate_pct REAL,
    source_url TEXT,
    source_type TEXT,
    data_origin TEXT,
    verification_status TEXT,
    last_verified_at TEXT,
    last_verified_date TEXT,
    last_scraped_at TEXT,
    confidence_score REAL,
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
    last_verified_date TEXT,
    last_scraped_at TEXT,
    confidence_score REAL,
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
    last_verified_date TEXT,
    last_scraped_at TEXT,
    confidence_score REAL,
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
    source_url TEXT,
    source_type TEXT,
    data_origin TEXT,
    verification_status TEXT,
    last_verified_date TEXT,
    last_scraped_at TEXT,
    confidence_score REAL,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
);

-- 23. source_verifications
CREATE TABLE IF NOT EXISTS source_verifications (
    id TEXT PRIMARY KEY,
    source_id TEXT NOT NULL,
    verified_by TEXT NOT NULL,
    verified_date TEXT NOT NULL,
    notes TEXT,
    source_url TEXT,
    source_type TEXT,
    data_origin TEXT,
    verification_status TEXT,
    last_verified_date TEXT,
    last_scraped_at TEXT,
    confidence_score REAL,
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

-- 26b. provider_accessibility_pull_results
CREATE TABLE IF NOT EXISTS provider_accessibility_pull_results (
    id TEXT PRIMARY KEY,
    provider_id TEXT NOT NULL,
    county_id TEXT,
    state_id TEXT NOT NULL,
    source_url TEXT NOT NULL,
    source_host TEXT NOT NULL,
    clue_page_url TEXT,
    clue_page_type TEXT, -- 'contact_page' | 'appointment_page' | 'patient_services' | 'faq_page' | 'telehealth_page' | 'accessibility_page' | 'program_overview'
    clue_field TEXT NOT NULL, -- 'languages' | 'interpreter_available' | 'asl_available' | 'wheelchair_accessible' | 'virtual_services' | 'in_person_services' | 'home_visits' | 'transportation_help' | 'accessibility_notes' | 'next_step_type' | 'requirements' | 'application_url' | 'referral_url'
    clue_value TEXT,
    clue_text TEXT,
    clue_status TEXT NOT NULL DEFAULT 'queued', -- 'queued' | 'reviewed' | 'promoted' | 'rejected'
    promotion_target_column TEXT,
    review_notes TEXT,
    reviewed_by TEXT,
    reviewed_at TEXT,
    promoted_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES resource_providers(id) ON DELETE CASCADE,
    FOREIGN KEY (county_id) REFERENCES counties(id) ON DELETE SET NULL,
    FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_provider_accessibility_pull_results_provider ON provider_accessibility_pull_results(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_accessibility_pull_results_status ON provider_accessibility_pull_results(clue_status);
CREATE INDEX IF NOT EXISTS idx_provider_accessibility_pull_results_state ON provider_accessibility_pull_results(state_id);

-- 27. iep_advocates
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
    last_verified_at TEXT,
    data_origin TEXT,
    last_verified_date TEXT,
    confidence_score REAL
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

-- 28. child_waivers (Waiver Vault & Re-Application)
CREATE TABLE IF NOT EXISTS child_waivers (
    id TEXT PRIMARY KEY,
    child_id TEXT NOT NULL,
    waiver_type TEXT NOT NULL, -- 'hcbs-dd-waiver' | 'institutional-deeming' | 'ccs-authorization' | 'other'
    document_name TEXT NOT NULL,
    file_path TEXT,
    effective_date TEXT,
    expiration_date TEXT,
    authorized_hours REAL,
    parsed_content TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_waivers_child ON child_waivers(child_id);

-- 29. regional_center_counties
CREATE TABLE IF NOT EXISTS regional_center_counties (
    regional_center_id TEXT,
    county_id TEXT,
    PRIMARY KEY (regional_center_id, county_id),
    FOREIGN KEY (regional_center_id) REFERENCES state_resource_agencies(id) ON DELETE CASCADE,
    FOREIGN KEY (county_id) REFERENCES counties(id) ON DELETE CASCADE
);

-- 30. selpa_counties
CREATE TABLE IF NOT EXISTS selpa_counties (
    selpa_id TEXT,
    county_id TEXT,
    PRIMARY KEY (selpa_id, county_id),
    FOREIGN KEY (selpa_id) REFERENCES regional_education_agencies(id) ON DELETE CASCADE,
    FOREIGN KEY (county_id) REFERENCES counties(id) ON DELETE CASCADE
);

-- 31. iep_advocate_counties
CREATE TABLE IF NOT EXISTS iep_advocate_counties (
    iep_advocate_id TEXT,
    county_id TEXT,
    PRIMARY KEY (iep_advocate_id, county_id),
    FOREIGN KEY (iep_advocate_id) REFERENCES iep_advocates(id) ON DELETE CASCADE,
    FOREIGN KEY (county_id) REFERENCES counties(id) ON DELETE CASCADE
);

-- 32. organizations
CREATE TABLE IF NOT EXISTS organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    organization_type TEXT NOT NULL, -- 'provider_org' | 'nonprofit' | 'advocacy_org' | 'public_agency' | 'school_system' | 'multi_service_org'
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
    notes TEXT,
    FOREIGN KEY (parent_organization_id) REFERENCES organizations(id) ON DELETE SET NULL
);

-- 33. organization_program_links
CREATE TABLE IF NOT EXISTS organization_program_links (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    program_id TEXT,
    listing_type TEXT NOT NULL, -- 'directory_service' | 'official_program' | 'public_office' | 'education_support'
    title TEXT NOT NULL,
    intake_model TEXT, -- 'call' | 'email' | 'apply_online' | 'referral' | 'schedule' | 'walk_in' | 'mixed' | 'unknown'
    service_summary TEXT,
    eligibility_summary TEXT,
    source_url TEXT,
    source_type TEXT,
    data_origin TEXT,
    verification_status TEXT,
    last_verified_date TEXT,
    last_scraped_at TEXT,
    confidence_score REAL,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE SET NULL
);

-- 34. service_locations
CREATE TABLE IF NOT EXISTS service_locations (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    location_name TEXT NOT NULL,
    location_type TEXT NOT NULL, -- 'clinic' | 'campus' | 'community_site' | 'home_based' | 'mobile' | 'other'
    address TEXT,
    city TEXT,
    state_id TEXT REFERENCES states(id),
    postal_code TEXT,
    county_id TEXT REFERENCES counties(id),
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
    confidence_score REAL,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- 35. office_locations
CREATE TABLE IF NOT EXISTS office_locations (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    office_name TEXT NOT NULL,
    office_type TEXT NOT NULL, -- 'intake' | 'regional' | 'county' | 'administrative' | 'appeals' | 'education'
    address TEXT,
    city TEXT,
    state_id TEXT REFERENCES states(id),
    postal_code TEXT,
    county_id TEXT REFERENCES counties(id),
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
    confidence_score REAL,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- 36. virtual_service_areas
CREATE TABLE IF NOT EXISTS virtual_service_areas (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    program_link_id TEXT,
    area_type TEXT NOT NULL, -- 'statewide' | 'county_group' | 'catchment' | 'metro' | 'virtual_only'
    area_name TEXT NOT NULL,
    state_id TEXT REFERENCES states(id),
    coverage_notes TEXT,
    intake_model TEXT,
    source_url TEXT,
    source_type TEXT,
    data_origin TEXT,
    verification_status TEXT,
    last_verified_date TEXT,
    last_scraped_at TEXT,
    confidence_score REAL,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (program_link_id) REFERENCES organization_program_links(id) ON DELETE SET NULL
);

-- 37. virtual_service_area_counties
CREATE TABLE IF NOT EXISTS virtual_service_area_counties (
    virtual_service_area_id TEXT,
    county_id TEXT,
    PRIMARY KEY (virtual_service_area_id, county_id),
    FOREIGN KEY (virtual_service_area_id) REFERENCES virtual_service_areas(id) ON DELETE CASCADE,
    FOREIGN KEY (county_id) REFERENCES counties(id) ON DELETE CASCADE
);

-- 38. safety_incidents
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

-- 39. parent_declarations
CREATE TABLE IF NOT EXISTS parent_declarations (
    child_id TEXT PRIMARY KEY,
    declaration_text TEXT,
    doctor_name TEXT,
    FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE
);

-- 40. caregiver_profiles
CREATE TABLE IF NOT EXISTS caregiver_profiles (
    user_id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 41. child_transition_tasks
CREATE TABLE IF NOT EXISTS child_transition_tasks (
    child_id TEXT,
    task_id TEXT,
    PRIMARY KEY (child_id, task_id),
    FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE
);

-- 42. caregiver_selfcare_logs
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

-- 43. child_coordinators
CREATE TABLE IF NOT EXISTS child_coordinators (
    child_id TEXT PRIMARY KEY,
    coordinator_name TEXT,
    FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE
);

-- 44. child_clinical_documents
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

-- 45. consultation_threads
CREATE TABLE IF NOT EXISTS consultation_threads (
    id TEXT PRIMARY KEY,
    child_id TEXT NOT NULL,
    advocate_id TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (advocate_id) REFERENCES iep_advocates(id) ON DELETE CASCADE
);

-- 46. consultation_messages
CREATE TABLE IF NOT EXISTS consultation_messages (
    id TEXT PRIMARY KEY,
    thread_id TEXT NOT NULL,
    sender_role TEXT NOT NULL,
    message_text TEXT NOT NULL,
    attachments_json TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (thread_id) REFERENCES consultation_threads(id) ON DELETE CASCADE
);

-- 47. shared_portal_tokens
CREATE TABLE IF NOT EXISTS shared_portal_tokens (
    id TEXT PRIMARY KEY,
    child_id TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    access_scope TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE
);

-- 48. program_waitlists
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

-- 49. knowledge_articles
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

-- 50. child_iep_accommodations
CREATE TABLE IF NOT EXISTS child_iep_accommodations (
    id TEXT PRIMARY KEY,
    child_id TEXT NOT NULL,
    accommodation_id TEXT NOT NULL,
    FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE
);

-- 51. child_iep_goals
CREATE TABLE IF NOT EXISTS child_iep_goals (
    id TEXT PRIMARY KEY,
    child_id TEXT NOT NULL,
    goal_template_id TEXT NOT NULL,
    custom_text TEXT NOT NULL,
    tokens_json TEXT,
    FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE
);

-- 52. child_respite_assessments
CREATE TABLE IF NOT EXISTS child_respite_assessments (
    child_id TEXT PRIMARY KEY,
    safety_score INTEGER NOT NULL,
    sleep_score INTEGER NOT NULL,
    medical_score INTEGER NOT NULL,
    behavior_score INTEGER NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE
);

-- 53. staging_source_targets
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

-- 54. staging_scraped_county_offices
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

-- 55. staging_scraped_state_resource_agencies
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

-- 56. staging_scraped_regional_education_agencies
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

-- 57. staging_scraped_school_districts
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

-- 58. staging_scraped_nonprofit_organizations
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

-- 59. staging_scraped_iep_advocates
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

-- 60. staging_scraped_resource_providers
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

-- 61. staging_scraped_forms
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

-- 62. staging_scraped_waitlists
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

-- 62. staging_scraped_waitlists
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

-- 63. staging_scraped_sources
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

-- 64. staging_promotion_audit
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
