import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import Database from 'better-sqlite3';
import { normalizeConfidenceScore, normalizePhone, normalizeUrl, runCanonicalNormalization } from './run-canonical-normalization-v1.mjs';

assert.equal(normalizePhone('1-800-555-1212 ext 9'), '(800) 555-1212 ext 9');
assert.equal(normalizeUrl('https://Example.org/forms/?utm_source=test#top'), 'https://example.org/forms');
assert.equal(normalizeConfidenceScore(5), 1);
assert.equal(normalizeConfidenceScore(8), 0.8);

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'canonical-normalization-'));
const dbPath = path.join(tmpDir, 'fixture.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE states (id TEXT PRIMARY KEY, code TEXT, name TEXT);
  CREATE TABLE counties (id TEXT PRIMARY KEY, state_id TEXT, name TEXT);
  CREATE TABLE programs (
    id TEXT PRIMARY KEY,
    name TEXT,
    description TEXT,
    who_it_is_for TEXT,
    who_might_qualify TEXT,
    official_source_url TEXT,
    category TEXT,
    confidence_score REAL,
    last_verified_date TEXT,
    state_id TEXT,
    source_url TEXT,
    source_type TEXT,
    data_origin TEXT,
    verification_status TEXT,
    last_scraped_at TEXT,
    program_type TEXT
  );
  CREATE TABLE program_eligibility_rules (
    id TEXT PRIMARY KEY,
    program_id TEXT,
    required_condition TEXT,
    required_need TEXT,
    insurance_status TEXT,
    school_status TEXT,
    trigger_reason TEXT
  );
  CREATE TABLE program_document_requirements (id TEXT PRIMARY KEY, program_id TEXT, name TEXT, description TEXT);
  CREATE TABLE program_application_steps (id TEXT PRIMARY KEY, program_id TEXT, title TEXT, action_description TEXT, apply_url_or_contact TEXT);
  CREATE TABLE program_appeal_info (program_id TEXT PRIMARY KEY, appeal_steps TEXT, denial_reasons TEXT, appeal_form_name TEXT, official_appeal_source_url TEXT);
  CREATE TABLE program_waitlists (id TEXT PRIMARY KEY, program_id TEXT, name TEXT, description TEXT, estimate_source_url TEXT, estimate_source_type TEXT, last_checked_at TEXT);
  CREATE TABLE state_resource_agencies (
    id TEXT PRIMARY KEY, state_id TEXT, agency_type TEXT, name TEXT, counties_served TEXT, catchment_boundaries TEXT, website TEXT,
    intake_phone TEXT, early_intervention_contact TEXT, agency_intake_contact TEXT, eligibility_info_page TEXT, services_page TEXT, appeals_info TEXT,
    languages TEXT, last_verified_date TEXT, source_urls TEXT, source_url TEXT, source_type TEXT, data_origin TEXT, verification_status TEXT,
    last_scraped_at TEXT, confidence_score REAL, evidence_level TEXT
  );
  CREATE TABLE county_offices (
    id TEXT PRIMARY KEY, county_id TEXT, program_id TEXT, office_name TEXT, address TEXT, phone TEXT, email TEXT, website TEXT, source_url TEXT,
    source_type TEXT, data_origin TEXT, verification_status TEXT, last_verified_date TEXT, last_scraped_at TEXT, confidence_score REAL, evidence_level TEXT
  );
  CREATE TABLE regional_education_agencies (
    id TEXT PRIMARY KEY, state_id TEXT, agency_type TEXT, name TEXT, counties_served TEXT, website TEXT, source_url TEXT, source_type TEXT, data_origin TEXT,
    verification_status TEXT, last_verified_date TEXT, last_scraped_at TEXT, confidence_score REAL, evidence_level TEXT
  );
  CREATE TABLE school_districts (
    id TEXT PRIMARY KEY, county_id TEXT, name TEXT, spec_ed_contact_phone TEXT, spec_ed_contact_email TEXT, website TEXT, source_url TEXT, source_type TEXT,
    data_origin TEXT, verification_status TEXT, last_verified_date TEXT, last_scraped_at TEXT, confidence_score REAL, evidence_level TEXT
  );
  CREATE TABLE forms_and_guides (
    id TEXT PRIMARY KEY, state_id TEXT, program_id TEXT, title TEXT, slug TEXT, category TEXT, form_type TEXT, agency TEXT, source_url TEXT, pdf_url TEXT,
    description TEXT, related_action TEXT, display_context TEXT, who_uses_it TEXT, who_signs_it TEXT, where_to_send_it TEXT, deadline TEXT, attachments TEXT,
    common_mistakes TEXT, letter_template TEXT, call_script TEXT, evidence_level TEXT, data_origin TEXT, verification_status TEXT, confidence_score REAL,
    last_checked_at TEXT, last_verified_at TEXT
  );
  CREATE TABLE nonprofit_organizations (
    id TEXT PRIMARY KEY, name TEXT, county_id TEXT, website TEXT, phone TEXT, focus_condition TEXT, source_url TEXT, source_type TEXT, data_origin TEXT,
    verification_status TEXT, last_verified_date TEXT, last_scraped_at TEXT, confidence_score REAL, evidence_level TEXT, service_tags TEXT, serving_tags TEXT,
    availability_status TEXT, checked_at TEXT, source_name TEXT, source_last_updated TEXT, next_step_type TEXT, next_step_label TEXT, next_step_url TEXT,
    next_step_phone TEXT, next_step_email TEXT, next_step_instructions TEXT, requirements TEXT, application_url TEXT, referral_url TEXT, languages TEXT,
    accessibility_notes TEXT, data_quality_notes TEXT, unsupported_claim_flags TEXT, claim_status TEXT, claim_email TEXT, last_verified_at TEXT,
    accessibility_evidence_level TEXT, accessibility_source_address TEXT
  );
  CREATE TABLE resource_providers (
    id TEXT PRIMARY KEY, name TEXT, categories TEXT, county_id TEXT, phone TEXT, email TEXT, address TEXT, regional_center_vendor_ids TEXT, source_url TEXT,
    source_type TEXT, data_origin TEXT, verification_status TEXT, last_verified_date TEXT, last_scraped_at TEXT, confidence_score REAL, evidence_level TEXT,
    service_tags TEXT, serving_tags TEXT, availability_status TEXT, checked_at TEXT, source_name TEXT, source_last_updated TEXT, next_step_type TEXT,
    next_step_label TEXT, next_step_url TEXT, next_step_phone TEXT, next_step_email TEXT, next_step_instructions TEXT, requirements TEXT, application_url TEXT,
    referral_url TEXT, languages TEXT, accessibility_notes TEXT, data_quality_notes TEXT, unsupported_claim_flags TEXT, claim_status TEXT, claim_email TEXT,
    last_verified_at TEXT
  );
  CREATE TABLE sources (
    id TEXT PRIMARY KEY, program_id TEXT, url TEXT, type TEXT, confidence_rating TEXT, source_url TEXT, source_type TEXT, data_origin TEXT,
    verification_status TEXT, last_verified_date TEXT, last_scraped_at TEXT, confidence_score REAL
  );
  CREATE TABLE source_verifications (
    id TEXT PRIMARY KEY, source_id TEXT, verified_by TEXT, verified_date TEXT, notes TEXT, source_url TEXT, source_type TEXT, data_origin TEXT,
    verification_status TEXT, last_verified_date TEXT, last_scraped_at TEXT, confidence_score REAL
  );
  CREATE TABLE organizations (
    id TEXT PRIMARY KEY, name TEXT, organization_type TEXT, parent_organization_id TEXT, website TEXT, intake_phone TEXT, intake_email TEXT, source_url TEXT,
    source_type TEXT, data_origin TEXT, verification_status TEXT, last_verified_date TEXT, last_scraped_at TEXT, confidence_score REAL, notes TEXT
  );
  CREATE TABLE office_locations (
    id TEXT PRIMARY KEY, organization_id TEXT, office_name TEXT, office_type TEXT, address TEXT, city TEXT, state_id TEXT, postal_code TEXT, county_id TEXT,
    intake_phone TEXT, intake_email TEXT, website TEXT, hours_text TEXT, source_url TEXT, source_type TEXT, data_origin TEXT, verification_status TEXT,
    last_verified_date TEXT, last_scraped_at TEXT, confidence_score REAL
  );
  CREATE TABLE service_locations (
    id TEXT PRIMARY KEY, organization_id TEXT, location_name TEXT, location_type TEXT, address TEXT, city TEXT, state_id TEXT, postal_code TEXT, county_id TEXT,
    phone TEXT, email TEXT, website TEXT, appointment_url TEXT, hours_text TEXT, source_url TEXT, source_type TEXT, data_origin TEXT, verification_status TEXT,
    last_verified_date TEXT, last_scraped_at TEXT, confidence_score REAL
  );
  CREATE TABLE organization_program_links (
    id TEXT PRIMARY KEY, organization_id TEXT, program_id TEXT, listing_type TEXT, title TEXT, intake_model TEXT, service_summary TEXT, eligibility_summary TEXT,
    source_url TEXT, source_type TEXT, data_origin TEXT, verification_status TEXT, last_verified_date TEXT, last_scraped_at TEXT, confidence_score REAL
  );
`);

db.prepare(`INSERT INTO states (id, code, name) VALUES ('california', 'CA', 'California')`).run();
db.prepare(`INSERT INTO counties (id, state_id, name) VALUES ('los-angeles-ca', 'california', 'Los Angeles')`).run();
db.prepare(`
  INSERT INTO programs (
    id, name, description, who_it_is_for, who_might_qualify, official_source_url, category, confidence_score, last_verified_date, state_id,
    source_url, source_type, data_origin, verification_status, last_scraped_at, program_type
  ) VALUES (
    'ihss-for-children', '  IHSS for Children  ', ' help  for children ', ' parents ', ' low income ',
    'https://EXAMPLE.org/ihss?utm_source=test', 'benefit', 5.0, '2026-06-01T10:00:00Z', 'CA',
    'https://EXAMPLE.org/ihss?utm_medium=x', 'official', ' scrape ', ' verified ', '2026-06-02T03:00:00Z', 'HCBS Waiver'
  )
`).run();
db.prepare(`INSERT INTO program_application_steps (id, program_id, title, action_description, apply_url_or_contact) VALUES ('step1', 'IHSS for Children', ' Apply ', ' call  now ', '1-800-555-1212')`).run();
db.prepare(`INSERT INTO county_offices (id, county_id, program_id, office_name, address, phone, email, website, source_url, source_type, data_origin, verification_status, last_verified_date, last_scraped_at, confidence_score, evidence_level) VALUES ('office1', 'Los Angeles County', 'IHSS for Children', ' LA IHSS Office ', ' 123 Main St , Los Angeles, ca ', '8005559999', 'TEST@EXAMPLE.ORG', 'https://County.Example.org/office/#top', 'https://County.Example.org/office/?utm_campaign=test', 'official', 'scrape', 'verified', '2026/06/03', '2026-06-04T10:00:00Z', 4.0, 'Official Form Guide Extract')`).run();
db.prepare(`INSERT INTO school_districts (id, county_id, name, spec_ed_contact_phone, spec_ed_contact_email, website, source_url, source_type, data_origin, verification_status, last_verified_date, last_scraped_at, confidence_score, evidence_level) VALUES ('dist1', 'los angeles county', ' Example USD ', '800.555.7777', 'SpecialEd@District.org', 'https://district.org/', 'https://district.org/?fbclid=test', 'official', 'scrape', 'verified', 'June 5 2026', '2026-06-06T00:00:00Z', 0.9, 'District Contact')`).run();
db.prepare(`INSERT INTO forms_and_guides (id, state_id, program_id, title, slug, category, form_type, agency, source_url, pdf_url, who_uses_it, who_signs_it, where_to_send_it, confidence_score, verification_status, last_checked_at, last_verified_at) VALUES ('form1', 'CA', 'IHSS for Children', ' Application Form ', 'application form', 'State Forms', 'Application Form', ' Dept. of Social Services ', 'https://example.org/forms/?utm_source=x', 'https://example.org/form.pdf#page=1', ' parents ', ' doctor ', ' portal ', 3.0, 'verified', '2026-06-07T00:00:00Z', '2026/06/08')`).run();
db.prepare(`INSERT INTO nonprofit_organizations (id, name, county_id, website, phone, source_url, verification_status, confidence_score, service_tags, availability_status, next_step_phone, claim_email, accessibility_source_address) VALUES ('np1', ' Parent Support Center ', 'Los Angeles', 'https://Nonprofit.org/?utm_source=x', '8005558888', 'https://Nonprofit.org/programs#top', 'verified', 8.0, ' Parent Support ; parent support ', 'Accepting New Clients', '8005550000', 'HELLO@NONPROFIT.ORG', ' 55 Oak St , Los Angeles ')`).run();
db.prepare(`INSERT INTO resource_providers (id, name, categories, county_id, phone, email, address, source_url, verification_status, confidence_score, service_tags, next_step_url, languages) VALUES ('rp1', ' Kids Clinic ', ' Clinic ; Diagnostic Clinic ', 'los-angeles county', '8005552222', 'CLINIC@EXAMPLE.ORG', ' 99 Health Way , Los Angeles ', 'https://clinic.org/path/?utm_campaign=x', 'verified', 10.0, ' diagnosis ; Diagnosis ', 'https://clinic.org/apply/#top', ' English ; spanish ')`).run();
db.prepare(`INSERT INTO sources (id, program_id, url, type, confidence_rating, source_url, verification_status, confidence_score) VALUES ('src1', 'IHSS for Children', 'https://example.org/source/?utm_source=x', 'Official Source', 'High Confidence', 'https://example.org/source/?utm_source=x', 'verified', 5.0)`).run();
db.prepare(`INSERT INTO source_verifications (id, source_id, verified_by, verified_date, notes, source_url, verification_status, confidence_score) VALUES ('sv1', 'src1', ' manual verifier ', '2026/06/09', ' looked good ', 'https://example.org/source/?utm_source=x', 'verified', 4.5)`).run();
db.prepare(`INSERT INTO organizations (id, name, organization_type, website, intake_phone, intake_email, source_url, verification_status, confidence_score) VALUES ('org1', ' Org Name ', 'Public Agency', 'https://ORG.org/?utm_source=x', '8005551111', 'INFO@ORG.ORG', 'https://ORG.org/?utm_source=x', 'verified', 5.0)`).run();
db.prepare(`INSERT INTO office_locations (id, organization_id, office_name, office_type, address, city, state_id, county_id, intake_phone, intake_email, website, source_url, verification_status, confidence_score) VALUES ('ol1', 'org1', ' Main Office ', 'County Office', ' 100 Center St , Los Angeles ', ' los angeles ', 'CA', 'Los Angeles County', '8005553333', 'OFFICE@ORG.ORG', 'https://ORG.org/office/?utm_source=x', 'https://ORG.org/office/?utm_source=x', 'verified', 4.0)`).run();
db.prepare(`INSERT INTO service_locations (id, organization_id, location_name, location_type, address, city, state_id, county_id, phone, email, website, appointment_url, source_url, verification_status, confidence_score) VALUES ('sl1', 'org1', ' Service Site ', 'Clinic', ' 200 Care St , Los Angeles ', ' los angeles ', 'CA', 'Los Angeles', '8005554444', 'SERVICE@ORG.ORG', 'https://ORG.org/service/?utm_source=x', 'https://ORG.org/book/?utm_campaign=x', 'https://ORG.org/service/?utm_source=x', 'verified', 3.5)`).run();
db.prepare(`INSERT INTO organization_program_links (id, organization_id, program_id, listing_type, title, intake_model, service_summary, eligibility_summary, source_url, verification_status, confidence_score) VALUES ('opl1', 'org1', 'IHSS for Children', 'Directory Service', ' Org Program ', 'See Instructions', ' Helps families ', ' low income ', 'https://ORG.org/program/?utm_source=x', 'verified', 4.0)`).run();
db.close();

const summary = runCanonicalNormalization({ dbPath, mode: 'apply', skipBackfill: true });
assert.ok(summary.totals.rowsChanged > 0);

const verifyDb = new Database(dbPath, { readonly: true });
const program = verifyDb.prepare(`SELECT * FROM programs WHERE id = 'ihss-for-children'`).get();
assert.equal(program.state_id, 'california');
assert.equal(program.official_source_url, 'https://example.org/ihss');
assert.equal(program.source_url, 'https://example.org/ihss');
assert.equal(program.confidence_score, 1);
assert.equal(program.last_verified_date, '2026-06-01');
assert.equal(program.program_type, 'hcbs_waiver');

const step = verifyDb.prepare(`SELECT * FROM program_application_steps WHERE id = 'step1'`).get();
assert.equal(step.program_id, 'ihss-for-children');
assert.equal(step.apply_url_or_contact, '(800) 555-1212');

const office = verifyDb.prepare(`SELECT * FROM county_offices WHERE id = 'office1'`).get();
assert.equal(office.county_id, 'los-angeles-ca');
assert.equal(office.program_id, 'ihss-for-children');
assert.equal(office.phone, '(800) 555-9999');
assert.equal(office.email, 'test@example.org');
assert.equal(office.website, 'https://county.example.org/office');
assert.equal(office.source_url, 'https://county.example.org/office');
assert.equal(office.confidence_score, 0.8);
assert.equal(office.last_verified_date, '2026-06-03');
assert.equal(office.evidence_level, 'official_form_guide_extract');

const district = verifyDb.prepare(`SELECT * FROM school_districts WHERE id = 'dist1'`).get();
assert.equal(district.county_id, 'los-angeles-ca');
assert.equal(district.spec_ed_contact_phone, '(800) 555-7777');
assert.equal(district.spec_ed_contact_email, 'specialed@district.org');
assert.equal(district.source_url, 'https://district.org');

const form = verifyDb.prepare(`SELECT * FROM forms_and_guides WHERE id = 'form1'`).get();
assert.equal(form.state_id, 'california');
assert.equal(form.program_id, 'ihss-for-children');
assert.equal(form.slug, 'application-form');
assert.equal(form.category, 'state_forms');
assert.equal(form.form_type, 'application_form');
assert.equal(form.source_url, 'https://example.org/forms');
assert.equal(form.pdf_url, 'https://example.org/form.pdf');
assert.equal(form.confidence_score, 0.6);
assert.equal(form.last_verified_at, '2026-06-08');

const nonprofit = verifyDb.prepare(`SELECT * FROM nonprofit_organizations WHERE id = 'np1'`).get();
assert.equal(nonprofit.county_id, 'los-angeles-ca');
assert.equal(nonprofit.website, 'https://nonprofit.org');
assert.equal(nonprofit.source_url, 'https://nonprofit.org/programs');
assert.equal(nonprofit.phone, '(800) 555-8888');
assert.equal(nonprofit.next_step_phone, '(800) 555-0000');
assert.equal(nonprofit.claim_email, 'hello@nonprofit.org');
assert.equal(nonprofit.service_tags, 'parent_support');
assert.equal(nonprofit.availability_status, 'accepting_new_clients');
assert.equal(nonprofit.accessibility_source_address, '55 Oak St, Los Angeles');
assert.equal(nonprofit.confidence_score, 0.8);

const provider = verifyDb.prepare(`SELECT * FROM resource_providers WHERE id = 'rp1'`).get();
assert.equal(provider.county_id, 'los-angeles-ca');
assert.equal(provider.categories, 'Clinic, Diagnostic Clinic');
assert.equal(provider.phone, '(800) 555-2222');
assert.equal(provider.email, 'clinic@example.org');
assert.equal(provider.source_url, 'https://clinic.org/path');
assert.equal(provider.next_step_url, 'https://clinic.org/apply');
assert.equal(provider.languages, 'English, spanish');
assert.equal(provider.service_tags, 'diagnosis');
assert.equal(provider.confidence_score, 1);

const source = verifyDb.prepare(`SELECT * FROM sources WHERE id = 'src1'`).get();
assert.equal(source.program_id, 'ihss-for-children');
assert.equal(source.url, 'https://example.org/source');
assert.equal(source.type, 'official_source');
assert.equal(source.confidence_rating, 'high_confidence');
assert.equal(source.confidence_score, 1);

const verification = verifyDb.prepare(`SELECT * FROM source_verifications WHERE id = 'sv1'`).get();
assert.equal(verification.verified_by, 'manual verifier');
assert.equal(verification.verified_date, '2026-06-09');
assert.equal(verification.source_url, 'https://example.org/source');
assert.equal(verification.confidence_score, 0.9);

const org = verifyDb.prepare(`SELECT * FROM organizations WHERE id = 'org1'`).get();
assert.equal(org.organization_type, 'public_agency');
assert.equal(org.website, 'https://org.org');
assert.equal(org.intake_email, 'info@org.org');
assert.equal(org.confidence_score, 1);

const officeLocation = verifyDb.prepare(`SELECT * FROM office_locations WHERE id = 'ol1'`).get();
assert.equal(officeLocation.state_id, 'california');
assert.equal(officeLocation.county_id, 'los-angeles-ca');
assert.equal(officeLocation.intake_phone, '(800) 555-3333');

const serviceLocation = verifyDb.prepare(`SELECT * FROM service_locations WHERE id = 'sl1'`).get();
assert.equal(serviceLocation.state_id, 'california');
assert.equal(serviceLocation.county_id, 'los-angeles-ca');
assert.equal(serviceLocation.phone, '(800) 555-4444');
assert.equal(serviceLocation.appointment_url, 'https://org.org/book');

const orgProgramLink = verifyDb.prepare(`SELECT * FROM organization_program_links WHERE id = 'opl1'`).get();
assert.equal(orgProgramLink.program_id, 'ihss-for-children');
assert.equal(orgProgramLink.listing_type, 'directory_service');
assert.equal(orgProgramLink.intake_model, 'see_instructions');
assert.equal(orgProgramLink.source_url, 'https://org.org/program');
assert.equal(orgProgramLink.confidence_score, 0.8);

verifyDb.close();
console.log('canonical normalization v1 tests passed');
