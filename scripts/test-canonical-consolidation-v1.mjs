import assert from 'assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import Database from 'better-sqlite3';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'canonical-consolidation-'));
const dbPath = path.join(tmpDir, 'test.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE programs (
    id TEXT, name TEXT, description TEXT, who_it_is_for TEXT, who_might_qualify TEXT, official_source_url TEXT,
    category TEXT, confidence_score REAL, last_verified_date TEXT, state_id TEXT, source_url TEXT, source_type TEXT,
    data_origin TEXT, verification_status TEXT, last_scraped_at TEXT, program_type TEXT
  );
  CREATE TABLE state_resource_agencies (
    id TEXT, state_id TEXT, agency_type TEXT, name TEXT, counties_served TEXT, catchment_boundaries TEXT, website TEXT,
    intake_phone TEXT, early_intervention_contact TEXT, agency_intake_contact TEXT, eligibility_info_page TEXT,
    services_page TEXT, appeals_info TEXT, languages TEXT, last_verified_date TEXT, source_urls TEXT, source_url TEXT,
    source_type TEXT, data_origin TEXT, verification_status TEXT, last_scraped_at TEXT, confidence_score REAL, evidence_level TEXT
  );
  CREATE TABLE county_offices (
    id TEXT, county_id TEXT, program_id TEXT, office_name TEXT, address TEXT, phone TEXT, email TEXT, website TEXT,
    source_url TEXT, source_type TEXT, data_origin TEXT, verification_status TEXT, last_verified_date TEXT,
    last_scraped_at TEXT, confidence_score REAL, evidence_level TEXT
  );
  CREATE TABLE school_districts (
    id TEXT, county_id TEXT, name TEXT, spec_ed_contact_phone TEXT, spec_ed_contact_email TEXT, website TEXT,
    total_enrollment INTEGER, special_ed_pct REAL, inclusion_rate_pct REAL, self_contained_rate_pct REAL, source_url TEXT,
    source_type TEXT, data_origin TEXT, verification_status TEXT, last_verified_date TEXT, last_scraped_at TEXT,
    confidence_score REAL, evidence_level TEXT
  );
  CREATE TABLE regional_education_agencies (
    id TEXT, state_id TEXT, agency_type TEXT, name TEXT, counties_served TEXT, website TEXT, source_url TEXT,
    source_type TEXT, data_origin TEXT, verification_status TEXT, last_verified_date TEXT, last_scraped_at TEXT,
    confidence_score REAL, evidence_level TEXT
  );
  CREATE TABLE forms_and_guides (
    id TEXT, state_id TEXT, program_id TEXT, title TEXT, slug TEXT, category TEXT, form_type TEXT, agency TEXT,
    source_url TEXT, pdf_url TEXT, language TEXT, description TEXT, related_action TEXT, display_context TEXT,
    who_uses_it TEXT, who_signs_it TEXT, where_to_send_it TEXT, deadline TEXT, attachments TEXT, common_mistakes TEXT,
    letter_template TEXT, call_script TEXT, evidence_level TEXT, data_origin TEXT, verification_status TEXT,
    confidence_score REAL, last_checked_at TEXT, last_verified_at TEXT
  );
  CREATE TABLE program_waitlists (
    id TEXT, program_id TEXT, name TEXT, duration_label TEXT, duration_months REAL, status TEXT, description TEXT,
    reserve_capacity_notice TEXT, legal_deadline TEXT, last_scraped_at TEXT, estimate_source_url TEXT,
    estimate_source_type TEXT, last_checked_at TEXT
  );
  CREATE TABLE nonprofit_organizations (
    id TEXT, name TEXT, county_id TEXT, website TEXT, phone TEXT, focus_condition TEXT, source_url TEXT, source_type TEXT,
    data_origin TEXT, verification_status TEXT, last_verified_date TEXT, last_scraped_at TEXT, confidence_score REAL
  );
  CREATE TABLE resource_providers (
    id TEXT, name TEXT, categories TEXT, county_id TEXT, phone TEXT, email TEXT, address TEXT, accepts_medi_cal INTEGER,
    regional_center_vendor_ids TEXT, source_url TEXT, source_type TEXT, data_origin TEXT, verification_status TEXT,
    last_verified_date TEXT, last_scraped_at TEXT, confidence_score REAL, source_name TEXT, next_step_type TEXT,
    next_step_label TEXT, next_step_url TEXT, next_step_phone TEXT, next_step_email TEXT
  );
  CREATE TABLE sources (
    id TEXT, program_id TEXT, url TEXT, type TEXT, confidence_rating TEXT, source_url TEXT, source_type TEXT,
    data_origin TEXT, verification_status TEXT, last_verified_date TEXT, last_scraped_at TEXT, confidence_score REAL
  );
  CREATE TABLE source_verifications (
    id TEXT, source_id TEXT, verified_by TEXT, verified_date TEXT, notes TEXT, source_url TEXT, source_type TEXT,
    data_origin TEXT, verification_status TEXT, last_verified_date TEXT, last_scraped_at TEXT, confidence_score REAL
  );
  CREATE TABLE staging_promotion_audit (
    id INTEGER PRIMARY KEY AUTOINCREMENT, staging_table TEXT, staging_record_id INTEGER, target_table TEXT, target_record_id TEXT,
    promoted_at TEXT, source_url TEXT, old_value TEXT, new_value TEXT, reason TEXT
  );
  CREATE TABLE staging_scraped_programs (
    id INTEGER, source_url TEXT, source_name TEXT, source_type TEXT, scraped_at TEXT, state_id TEXT, county_id TEXT,
    confidence_score REAL, extraction_notes TEXT, raw_text_excerpt TEXT, suggested_target_table TEXT, suggested_target_id TEXT,
    duplicate_candidate_id TEXT, review_status TEXT, extracted_name TEXT, description TEXT, who_it_is_for TEXT,
    who_might_qualify TEXT, official_source_url TEXT, category TEXT, program_type TEXT, extracted_phone TEXT,
    extracted_email TEXT, action_url TEXT
  );
  CREATE TABLE staging_scraped_forms (
    id INTEGER, source_url TEXT, source_name TEXT, source_type TEXT, scraped_at TEXT, state_id TEXT, county_id TEXT,
    confidence_score REAL, extraction_notes TEXT, raw_text_excerpt TEXT, suggested_target_table TEXT, suggested_target_id TEXT,
    duplicate_candidate_id TEXT, review_status TEXT, slug TEXT, program TEXT, official_download_url TEXT, who_uses_it TEXT,
    who_signs_it TEXT, where_to_send_it TEXT, letter_script TEXT
  );
  CREATE TABLE staging_scraped_waitlists (
    id INTEGER, source_url TEXT, source_name TEXT, source_type TEXT, scraped_at TEXT, state_id TEXT, county_id TEXT,
    confidence_score REAL, extraction_notes TEXT, raw_text_excerpt TEXT, suggested_target_table TEXT, suggested_target_id TEXT,
    duplicate_candidate_id TEXT, review_status TEXT, program_id TEXT, name TEXT, duration_label TEXT, duration_months REAL,
    status TEXT, description TEXT, estimate_source_url TEXT, estimate_source_type TEXT, last_checked_at TEXT
  );
  CREATE TABLE staging_scraped_county_offices (
    id INTEGER, source_url TEXT, source_name TEXT, source_type TEXT, scraped_at TEXT, state_id TEXT, county_id TEXT,
    confidence_score REAL, extraction_notes TEXT, raw_text_excerpt TEXT, suggested_target_table TEXT, suggested_target_id TEXT,
    duplicate_candidate_id TEXT, review_status TEXT, extracted_name TEXT, extracted_phone TEXT, extracted_email TEXT,
    extracted_address TEXT, extracted_website TEXT, program_id TEXT, evidence_level TEXT
  );
  CREATE TABLE staging_scraped_regional_education_agencies (
    id INTEGER, source_url TEXT, source_name TEXT, source_type TEXT, scraped_at TEXT, state_id TEXT, county_id TEXT,
    confidence_score REAL, extraction_notes TEXT, raw_text_excerpt TEXT, suggested_target_table TEXT, suggested_target_id TEXT,
    duplicate_candidate_id TEXT, review_status TEXT, extracted_name TEXT, agency_type TEXT, counties_served TEXT,
    extracted_website TEXT, evidence_level TEXT, extracted_phone TEXT
  );
  CREATE TABLE staging_scraped_school_districts (
    id INTEGER, source_url TEXT, source_name TEXT, source_type TEXT, scraped_at TEXT, state_id TEXT, county_id TEXT,
    confidence_score REAL, extraction_notes TEXT, raw_text_excerpt TEXT, suggested_target_table TEXT, suggested_target_id TEXT,
    duplicate_candidate_id TEXT, review_status TEXT, extracted_name TEXT, spec_ed_contact_phone TEXT, spec_ed_contact_email TEXT,
    extracted_website TEXT, total_enrollment INTEGER, evidence_level TEXT
  );
  CREATE TABLE staging_scraped_sources (
    id INTEGER, source_url TEXT, source_name TEXT, source_type TEXT, scraped_at TEXT, state_id TEXT, county_id TEXT,
    confidence_score REAL, extraction_notes TEXT, raw_text_excerpt TEXT, suggested_target_table TEXT, suggested_target_id TEXT,
    duplicate_candidate_id TEXT, review_status TEXT, program_id TEXT, url TEXT, type TEXT, confidence_rating TEXT
  );
  CREATE TABLE staging_scraped_nonprofit_organizations (
    id INTEGER, source_url TEXT, source_name TEXT, source_type TEXT, scraped_at TEXT, state_id TEXT, county_id TEXT,
    confidence_score REAL, extraction_notes TEXT, raw_text_excerpt TEXT, suggested_target_table TEXT, suggested_target_id TEXT,
    duplicate_candidate_id TEXT, review_status TEXT, extracted_name TEXT, extracted_phone TEXT, extracted_email TEXT,
    extracted_address TEXT, extracted_website TEXT, focus_condition TEXT
  );
  CREATE TABLE staging_scraped_resource_providers (
    id INTEGER, source_url TEXT, source_name TEXT, source_type TEXT, scraped_at TEXT, state_id TEXT, county_id TEXT,
    confidence_score REAL, extraction_notes TEXT, raw_text_excerpt TEXT, suggested_target_table TEXT, suggested_target_id TEXT,
    duplicate_candidate_id TEXT, review_status TEXT, extracted_name TEXT, extracted_phone TEXT, extracted_email TEXT,
    extracted_address TEXT, extracted_website TEXT, categories TEXT, accepts_medi_cal INTEGER
  );
  CREATE TABLE staging_scraped_state_resource_agencies (
    id INTEGER, source_url TEXT, source_name TEXT, source_type TEXT, scraped_at TEXT, state_id TEXT, county_id TEXT,
    confidence_score REAL, extraction_notes TEXT, raw_text_excerpt TEXT, suggested_target_table TEXT, suggested_target_id TEXT,
    duplicate_candidate_id TEXT, review_status TEXT, extracted_name TEXT, agency_type TEXT, counties_served TEXT,
    extracted_website TEXT, evidence_level TEXT, extracted_phone TEXT, early_intervention_contact TEXT,
    agency_intake_contact TEXT, eligibility_info_page TEXT, services_page TEXT, appeals_info TEXT
  );
  CREATE TABLE staging_scraped_iep_advocates (
    id INTEGER, source_url TEXT, source_name TEXT, source_type TEXT, scraped_at TEXT, state_id TEXT, county_id TEXT,
    confidence_score REAL, extraction_notes TEXT, raw_text_excerpt TEXT, suggested_target_table TEXT, suggested_target_id TEXT,
    duplicate_candidate_id TEXT, review_status TEXT, extracted_name TEXT, extracted_phone TEXT, extracted_email TEXT,
    extracted_address TEXT, extracted_website TEXT
  );
  CREATE TABLE staging_scraped_knowledge_content (
    id INTEGER, review_status TEXT
  );
`);

db.prepare(`INSERT INTO staging_scraped_programs VALUES (1,'https://example.gov/program','State Waiver Program','official_state_page','2026-06-26T00:00:00Z','test-state',NULL,0.9,'','desc',NULL,NULL,NULL,'pending_review','State Waiver Program','Real program desc','','','https://example.gov/program','state','waivers','(800) 111-1111','','https://example.gov/program')`).run();
db.prepare(`INSERT INTO staging_scraped_forms VALUES (2,'https://example.gov/forms/x','Form X','official_form','2026-06-26T00:00:00Z','test-state',NULL,0.9,'','',NULL,NULL,NULL,'pending_review','form-x','Form X','https://example.gov/files/form-x.pdf','Parents','not_applicable','portal route','')`).run();
db.prepare(`INSERT INTO staging_scraped_waitlists VALUES (3,'https://example.gov/waitlist','Waitlist','official_state_page','2026-06-26T00:00:00Z','test-state',NULL,0.9,'','',NULL,NULL,NULL,'pending_review','prog-1','Waitlist X','12 months',12,'active','desc','https://example.gov/waitlist','official_state_page','2026-06-26T00:00:00Z')`).run();
db.prepare(`INSERT INTO staging_scraped_county_offices VALUES (4,'https://example.gov/offices','Office','official_locator','2026-06-26T00:00:00Z','test-state','alpha-ts',0.9,'','',NULL,NULL,NULL,'auto_accepted','Alpha Office','(800) 222-2222','','123 Main St','https://example.gov/offices','prog-1','official_county_office')`).run();
db.prepare(`INSERT INTO staging_scraped_school_districts VALUES (5,'https://example.gov/districts','District','official_directory','2026-06-26T00:00:00Z','test-state','alpha-ts',1.0,'','',NULL,NULL,NULL,'auto_accepted','Alpha School District','(800) 333-3333','sped@example.org','https://district.example.org',1000,'official_directory')`).run();
db.prepare(`INSERT INTO staging_scraped_state_resource_agencies VALUES (6,'https://example.gov/dd','DD Office','official_website','2026-06-26T00:00:00Z','test-state',NULL,0.9,'','',NULL,NULL,NULL,'pending_review','Test DD Agency','dd_routing','test-state','https://example.gov/dd','official_state_agency','(800) 444-4444','','','','','')`).run();
db.prepare(`INSERT INTO staging_scraped_iep_advocates VALUES (7,'https://directory.example.org/a','Directory Entry','advocate_directory','2026-06-26T00:00:00Z','test-state','alpha-ts',0.8,'','',NULL,NULL,NULL,'auto_accepted','Directory Entry','','','','')`).run();
db.prepare(`INSERT INTO staging_scraped_sources VALUES (8,'https://example.gov/program','Program Source','official_state_page','2026-06-26T00:00:00Z','test-state',NULL,0.9,'','',NULL,NULL,NULL,'auto_accepted','prog-1','https://example.gov/program','official','high')`).run();
db.close();

const result = spawnSync(process.execPath, [path.join(repoRoot, 'scripts', 'run-canonical-consolidation-v1.mjs'), `--db-path=${dbPath}`, '--mode=apply'], {
  cwd: repoRoot,
  encoding: 'utf8',
});

assert.equal(result.status, 0, result.stderr || result.stdout);

const verifyDb = new Database(dbPath);
assert.equal(verifyDb.prepare('SELECT COUNT(*) AS count FROM programs').get().count, 1);
assert.equal(verifyDb.prepare('SELECT COUNT(*) AS count FROM forms_and_guides').get().count, 1);
assert.equal(verifyDb.prepare('SELECT COUNT(*) AS count FROM program_waitlists').get().count, 1);
assert.equal(verifyDb.prepare('SELECT COUNT(*) AS count FROM county_offices').get().count, 1);
assert.equal(verifyDb.prepare('SELECT COUNT(*) AS count FROM school_districts').get().count, 1);
assert.equal(verifyDb.prepare('SELECT COUNT(*) AS count FROM state_resource_agencies').get().count, 1);
assert.equal(verifyDb.prepare('SELECT COUNT(*) AS count FROM sources').get().count, 1);
assert.equal(verifyDb.prepare('SELECT COUNT(*) AS count FROM source_verifications').get().count, 1);
assert.equal(verifyDb.prepare(`SELECT review_status FROM staging_scraped_iep_advocates WHERE id = 7`).get().review_status, 'quarantined_advocate_semantic_destination_split_required');
assert.equal(verifyDb.prepare('SELECT COUNT(*) AS count FROM staging_promotion_audit').get().count, 7);
verifyDb.close();

console.log('test-canonical-consolidation-v1: ok');
