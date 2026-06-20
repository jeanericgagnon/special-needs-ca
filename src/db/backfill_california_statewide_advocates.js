import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');
const frontendDbPath = path.join(repoRoot, 'frontend', 'ca_disability_navigator.db');

const db = new Database(dbPath);

const now = new Date().toISOString();
const today = now.slice(0, 10);

const californiaCounties = db.prepare(`
  SELECT id, name
  FROM counties
  WHERE state_id = 'california'
  ORDER BY name ASC
`).all();

if (californiaCounties.length === 0) {
  throw new Error('No California counties found.');
}

const statewideCoverageLabel = 'Statewide (All California Counties)';
const sharedServingTags = 'parents_caregivers,iep_families,school_age,idd_dd';

const records = [
  {
    id: 'ca-adv-legal-drc-statewide',
    name: 'Disability Rights California',
    credentials: 'Protection & Advocacy Organization',
    experience_years: 0,
    price_rate: 'Free',
    counties_served: statewideCoverageLabel,
    languages_spoken: '',
    phone: '1-800-776-5746',
    email: '',
    website: 'https://www.disabilityrightsca.org',
    specialties: 'Disability Rights, Special Education, K-12 Education, Regional Center, IHSS, Medi-Cal',
    regional_center_vendorized: 0,
    organization_affiliation: 'Statewide Organization',
    description: 'Statewide protection and advocacy organization with a public Get Help intake for legal questions, including K-12 Education, Regional Center, IHSS, and Medi-Cal or Medicare topics.',
    verification_status: 'official_verified',
    source_url: 'https://www.disabilityrightsca.org/contact-us/how-to-get-help',
    source_type: 'official',
    last_scraped_at: now,
    last_verified_at: now,
    data_origin: 'official_backfill',
    last_verified_date: today,
    confidence_score: 5.0,
    evidence_level: 'official_website',
    service_tags: 'iep_advocacy,special_education,legal_aid,appeals',
    serving_tags: sharedServingTags,
    availability_status: 'unknown',
    accepting_new_clients: null,
    waitlist_status: '',
    capacity_notes: '',
    funding_status: 'grant_funded',
    checked_at: now,
    source_name: 'Disability Rights California',
    source_last_updated: '',
    next_step_type: 'call',
    next_step_label: 'Call Get Help',
    next_step_url: 'https://www.disabilityrightsca.org/contact-us/how-to-get-help',
    next_step_phone: '1-800-776-5746',
    next_step_email: '',
    next_step_instructions: 'Call the public Get Help intake line for legal questions and select the topic that best matches your need.',
    requirements: '',
    application_url: '',
    referral_url: '',
    walk_in_available: 0,
    appointment_required: 1,
    interpreter_available: null,
    asl_available: null,
    wheelchair_accessible: null,
    virtual_services: 1,
    in_person_services: null,
    home_visits: null,
    transportation_help: null,
    accessibility_notes: '',
    manual_review_required: 0,
    data_quality_notes: 'Backfilled from official Disability Rights California Get Help page.',
    unsupported_claim_flags: '',
    claim_status: 'unclaimed',
    claimed_by: '',
    verified_affiliation: 0,
    claim_email: '',
  },
  {
    id: 'ca-adv-family-frcnca-statewide',
    name: 'Family Resource Centers Network of California',
    credentials: 'Family Support Network',
    experience_years: 0,
    price_rate: 'Free',
    counties_served: statewideCoverageLabel,
    languages_spoken: '',
    phone: '(626) 677-0058',
    email: 'info@frcnca.org',
    website: 'https://frcnca.org',
    specialties: 'Family Support, Early Start, Referrals, Local Resources, Parent Navigation',
    regional_center_vendorized: 0,
    organization_affiliation: 'Statewide Organization',
    description: 'Statewide network supporting California families with referrals, Early Start information, local Family Resource Center connections, and parent navigation support.',
    verification_status: 'official_verified',
    source_url: 'https://frcnca.org/contact-us/',
    source_type: 'official',
    last_scraped_at: now,
    last_verified_at: now,
    data_origin: 'official_backfill',
    last_verified_date: today,
    confidence_score: 5.0,
    evidence_level: 'official_website',
    service_tags: 'early_intervention,iep_advocacy,special_education',
    serving_tags: sharedServingTags,
    availability_status: 'unknown',
    accepting_new_clients: null,
    waitlist_status: '',
    capacity_notes: '',
    funding_status: 'grant_funded',
    checked_at: now,
    source_name: 'Family Resource Centers Network of California',
    source_last_updated: '2026-06-16',
    next_step_type: 'email',
    next_step_label: 'Email FRCNCA',
    next_step_url: 'https://frcnca.org/contact-us/',
    next_step_phone: '(626) 677-0058',
    next_step_email: 'info@frcnca.org',
    next_step_instructions: 'Contact FRCNCA or your local Family Resource Center for family support services, referrals, Early Start information, or local resources.',
    requirements: '',
    application_url: '',
    referral_url: '',
    walk_in_available: 0,
    appointment_required: 1,
    interpreter_available: null,
    asl_available: null,
    wheelchair_accessible: null,
    virtual_services: 1,
    in_person_services: null,
    home_visits: null,
    transportation_help: null,
    accessibility_notes: '',
    manual_review_required: 0,
    data_quality_notes: 'Backfilled from official FRCNCA contact page.',
    unsupported_claim_flags: '',
    claim_status: 'unclaimed',
    claimed_by: '',
    verified_affiliation: 0,
    claim_email: '',
  },
];

const advocateColumns = [
  'id',
  'name',
  'credentials',
  'experience_years',
  'price_rate',
  'counties_served',
  'languages_spoken',
  'phone',
  'email',
  'website',
  'specialties',
  'regional_center_vendorized',
  'organization_affiliation',
  'description',
  'verification_status',
  'source_url',
  'source_type',
  'last_scraped_at',
  'last_verified_at',
  'data_origin',
  'last_verified_date',
  'confidence_score',
  'evidence_level',
  'service_tags',
  'serving_tags',
  'availability_status',
  'accepting_new_clients',
  'waitlist_status',
  'capacity_notes',
  'funding_status',
  'checked_at',
  'source_name',
  'source_last_updated',
  'next_step_type',
  'next_step_label',
  'next_step_url',
  'next_step_phone',
  'next_step_email',
  'next_step_instructions',
  'requirements',
  'application_url',
  'referral_url',
  'walk_in_available',
  'appointment_required',
  'interpreter_available',
  'asl_available',
  'wheelchair_accessible',
  'virtual_services',
  'in_person_services',
  'home_visits',
  'transportation_help',
  'accessibility_notes',
  'manual_review_required',
  'data_quality_notes',
  'unsupported_claim_flags',
  'claim_status',
  'claimed_by',
  'verified_affiliation',
  'claim_email',
];

const placeholders = advocateColumns.map(() => '?').join(', ');
const updateAssignments = advocateColumns
  .filter((column) => column !== 'id')
  .map((column) => `${column} = excluded.${column}`)
  .join(',\n      ');

const upsertAdvocate = db.prepare(`
  INSERT INTO iep_advocates (${advocateColumns.join(', ')})
  VALUES (${placeholders})
  ON CONFLICT(id) DO UPDATE SET
      ${updateAssignments}
`);

const deleteCountyLinks = db.prepare(`
  DELETE FROM iep_advocate_counties
  WHERE iep_advocate_id = ?
`);

const insertCountyLink = db.prepare(`
  INSERT OR IGNORE INTO iep_advocate_counties (iep_advocate_id, county_id)
  VALUES (?, ?)
`);

const tx = db.transaction(() => {
  for (const record of records) {
    upsertAdvocate.run(...advocateColumns.map((column) => record[column]));
    deleteCountyLinks.run(record.id);
    for (const county of californiaCounties) {
      insertCountyLink.run(record.id, county.id);
    }
  }
});

tx();
db.pragma('wal_checkpoint(TRUNCATE)');
db.close();

if (fs.existsSync(frontendDbPath)) {
  fs.copyFileSync(dbPath, frontendDbPath);
}

console.log(JSON.stringify({
  message: 'Backfilled California statewide advocate coverage from official sources.',
  advocateRowsUpserted: records.length,
  californiaCountyLinksPerAdvocate: californiaCounties.length,
  totalCountyLinksWritten: records.length * californiaCounties.length,
}, null, 2));
