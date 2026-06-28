import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import Database from 'better-sqlite3';
import { quarantinePlaceholderPublicRecords } from '../src/db/quarantine_placeholder_public_records.js';

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'public-placeholder-quarantine-'));
const dbPath = path.join(tempRoot, 'ca_disability_navigator.db');
const outputDir = path.join(tempRoot, 'out');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE school_districts (
    id TEXT PRIMARY KEY,
    county_id TEXT,
    name TEXT,
    spec_ed_contact_phone TEXT,
    spec_ed_contact_email TEXT,
    website TEXT,
    source_url TEXT,
    verification_status TEXT
  );

  CREATE TABLE county_offices (
    id TEXT PRIMARY KEY,
    office_name TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    source_url TEXT,
    verification_status TEXT,
    display_status TEXT DEFAULT 'published'
  );

  CREATE TABLE state_resource_agencies (
    id TEXT PRIMARY KEY,
    name TEXT,
    intake_phone TEXT,
    agency_intake_contact TEXT,
    early_intervention_contact TEXT,
    website TEXT,
    source_url TEXT,
    verification_status TEXT
  );

  CREATE TABLE resource_providers (
    id TEXT PRIMARY KEY,
    name TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    next_step_phone TEXT,
    next_step_email TEXT,
    next_step_url TEXT,
    application_url TEXT,
    referral_url TEXT,
    source_url TEXT,
    verification_status TEXT,
    data_quality_notes TEXT,
    display_status TEXT DEFAULT 'published'
  );

  CREATE TABLE nonprofit_organizations (
    id TEXT PRIMARY KEY,
    name TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    next_step_phone TEXT,
    next_step_email TEXT,
    next_step_url TEXT,
    application_url TEXT,
    referral_url TEXT,
    source_url TEXT,
    verification_status TEXT,
    data_origin TEXT,
    display_status TEXT DEFAULT 'published'
  );

  CREATE TABLE forms_and_guides (
    id TEXT PRIMARY KEY,
    title TEXT,
    agency TEXT,
    source_url TEXT,
    pdf_url TEXT,
    verification_status TEXT,
    display_status TEXT DEFAULT 'published'
  );
`);

db.prepare(`
  INSERT INTO school_districts (id, county_id, name, spec_ed_contact_phone, spec_ed_contact_email, website, source_url, verification_status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run('dist-bad', 'los-angeles-ca', 'Example USD', '(800) 555-7777', 'specialed@district.org', 'https://district.org', 'https://district.org', 'verified');

db.prepare(`
  INSERT INTO school_districts (id, county_id, name, spec_ed_contact_phone, spec_ed_contact_email, website, source_url, verification_status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run('dist-good', 'orange-ca', 'Real USD', '(714) 555-1111'.replace('555', '541'), 'specialed@realusd.org', 'https://www.realusd.org', 'https://www.realusd.org/special-education', 'verified');

db.prepare(`
  INSERT INTO county_offices (id, office_name, phone, email, website, source_url, verification_status, display_status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run('office-bad', 'Generic Office Placeholder', '800-222-3333', '', 'https://www.example.org/office', 'https://www.example.org/office', 'official_verified', 'published');

db.prepare(`
  INSERT INTO county_offices (id, office_name, phone, email, website, source_url, verification_status, display_status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run('office-good', 'Orange County Medi-Cal Office', '800-222-3333', '', 'https://www.dhcs.ca.gov/orange', 'https://www.dhcs.ca.gov/orange', 'official_verified', 'published');

db.prepare(`
  INSERT INTO county_offices (id, office_name, phone, email, website, source_url, verification_status, display_status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run('office-fallback', 'Fallback County Office', '800-222-3333', '', 'https://www.real-county.gov/services', 'https://www.real-county.gov/services', 'generated_county_fallback', 'published');

db.prepare(`
  INSERT INTO state_resource_agencies (id, name, intake_phone, agency_intake_contact, early_intervention_contact, website, source_url, verification_status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run('agency-bad', 'Agency Example', '(555) 019-0000', '', '', 'https://www.example.org/agency', '', 'verified');

db.prepare(`
  INSERT INTO resource_providers (id, name, phone, email, website, next_step_phone, next_step_email, next_step_url, application_url, referral_url, source_url, verification_status, display_status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'provider-bad-action',
  'Provider With Placeholder Action URL',
  '800-222-4444',
  '',
  'https://www.example.org/provider',
  '',
  '',
  'https://www.example.org/apply',
  '',
  '',
  'https://www.dds.ca.gov/provider-placeholder-action',
  'official_verified',
  'published'
);

db.prepare(`
  INSERT INTO resource_providers (id, name, phone, email, website, next_step_phone, next_step_email, next_step_url, application_url, referral_url, source_url, verification_status, data_quality_notes, display_status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'provider-already-hidden',
  'Already Hidden Placeholder Provider',
  '(800) 555-2222',
  'clinic@example.org',
  '',
  '',
  '',
  '',
  '',
  '',
  'https://clinic.org/path',
  'verified',
  '',
  'needs_review'
);

db.prepare(`
  INSERT INTO nonprofit_organizations (id, name, phone, email, website, next_step_phone, next_step_email, next_step_url, application_url, referral_url, source_url, verification_status, data_origin, display_status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'nonprofit-search-fallback',
  'County Family Resource Center',
  '(530) 555-1111',
  '',
  'https://www.example.org/family-center',
  '',
  '',
  '',
  '',
  '',
  'https://www.google.com/search?q=county+family+resource+center',
  'generated_county_fallback',
  'programmatic_fallback',
  'published'
);

db.prepare(`
  INSERT INTO forms_and_guides (id, title, agency, source_url, pdf_url, verification_status, display_status)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`).run(
  'form-bad',
  'Application Form',
  'Department of Social Services',
  'https://example.org/forms',
  'https://example.org/form.pdf',
  'verified',
  'published'
);

db.prepare(`
  INSERT INTO forms_and_guides (id, title, agency, source_url, pdf_url, verification_status, display_status)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`).run(
  'form-good',
  'SOC 123',
  'California Department of Social Services',
  'https://www.cdss.ca.gov/forms',
  'https://www.cdss.ca.gov/Portals/9/Additional-Resources/Forms-and-Brochures/SOC123.pdf',
  'official_verified',
  'published'
);

db.prepare(`
  INSERT INTO nonprofit_organizations (id, name, phone, email, website, next_step_phone, next_step_email, next_step_url, application_url, referral_url, source_url, verification_status, data_origin, display_status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'nonprofit-fallback',
  'Fallback Nonprofit',
  '530-444-2222',
  '',
  'https://realnonprofit.org',
  '',
  '',
  '',
  '',
  '',
  'https://realnonprofit.org',
  'source_listed',
  'programmatic_fallback',
  'published'
);

db.close();

const { summary } = quarantinePlaceholderPublicRecords({
  dbPath,
  outputDir,
  generatedDate: '2099-01-01',
});

const checkDb = new Database(dbPath, { readonly: true });
const schoolDistrictCols = checkDb.prepare('PRAGMA table_info(school_districts)').all().map((row) => row.name);
const stateAgencyCols = checkDb.prepare('PRAGMA table_info(state_resource_agencies)').all().map((row) => row.name);

assert.equal(schoolDistrictCols.includes('display_status'), true);
assert.equal(stateAgencyCols.includes('display_status'), true);

const liveDbPath = path.resolve('frontend/ca_disability_navigator.db');
const liveDb = new Database(liveDbPath, { readonly: true });
const publicDirectoryTables = [
  'county_offices',
  'school_districts',
  'state_resource_agencies',
  'nonprofit_organizations',
  'iep_advocates',
  'resource_providers',
];

function isPlaceholderPhone(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return false;
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length < 10) return true;
  if (digits.startsWith('555') || digits.slice(3, 6) === '555') return true;
  if (/^(\d)\1+$/.test(digits)) return true;
  if (digits.endsWith('1234') || digits.endsWith('0000')) return true;
  return false;
}

function isPlaceholderEmail(value) {
  const trimmed = String(value || '').trim().toLowerCase();
  if (!trimmed) return false;
  return trimmed.includes('example.');
}

for (const table of publicDirectoryTables) {
  const columns = new Set(
    liveDb.prepare(`PRAGMA table_info(${table})`).all().map((row) => row.name),
  );
  const rows = liveDb.prepare(`
    SELECT *
    FROM ${table}
    WHERE COALESCE(display_status, 'published') = 'published'
  `).all();

  const phoneFields = [
    columns.has('phone') ? 'phone' : null,
    columns.has('intake_phone') ? 'intake_phone' : null,
    columns.has('next_step_phone') ? 'next_step_phone' : null,
    columns.has('spec_ed_contact_phone') ? 'spec_ed_contact_phone' : null,
  ].filter(Boolean);

  const emailFields = [
    columns.has('email') ? 'email' : null,
    columns.has('next_step_email') ? 'next_step_email' : null,
    columns.has('spec_ed_contact_email') ? 'spec_ed_contact_email' : null,
  ].filter(Boolean);

  const placeholderPhoneCount = rows.filter((row) =>
    phoneFields.some((field) => isPlaceholderPhone(row[field])),
  ).length;

  assert.equal(
    placeholderPhoneCount,
    0,
    `${table} should not expose published rows with placeholder 555-style phones in the active app DB`,
  );

  const placeholderEmailCount = rows.filter((row) =>
    emailFields.some((field) => isPlaceholderEmail(row[field])),
  ).length;

  assert.equal(
    placeholderEmailCount,
    0,
    `${table} should not expose published rows with placeholder example-style emails in the active app DB`,
  );

  const placeholderSourceCount = liveDb.prepare(`
    SELECT COUNT(*) AS count
    FROM ${table}
    WHERE COALESCE(display_status, 'published') = 'published'
      AND (
        source_url LIKE 'https://www.google.com/search%'
        OR source_url LIKE 'https://google.com/search%'
        OR source_url LIKE '%example.com%'
        OR source_url LIKE '%example.org%'
        OR source_url LIKE '%state.gov%'
      )
  `).get().count;

  assert.equal(
    placeholderSourceCount,
    0,
    `${table} should not expose published rows with placeholder or search-result source URLs in the active app DB`,
  );

  const publishedNeedsReviewCount = liveDb.prepare(`
    SELECT COUNT(*) AS count
    FROM ${table}
    WHERE COALESCE(display_status, 'published') = 'published'
      AND COALESCE(verification_status, '') IN ('needs_review', 'generated_county_fallback')
  `).get().count;

  assert.equal(
    publishedNeedsReviewCount,
    0,
    `${table} should not expose published rows that still carry needs_review or generated fallback verification in the active app DB`,
  );
}

liveDb.close();

const districtStatuses = checkDb.prepare('SELECT id, display_status FROM school_districts ORDER BY id').all();
assert.deepEqual(districtStatuses, [
  { id: 'dist-bad', display_status: 'needs_review' },
  { id: 'dist-good', display_status: 'published' },
]);

const officeStatuses = checkDb.prepare('SELECT id, display_status FROM county_offices ORDER BY id').all();
assert.deepEqual(officeStatuses, [
  { id: 'office-bad', display_status: 'needs_review' },
  { id: 'office-fallback', display_status: 'needs_review' },
  { id: 'office-good', display_status: 'published' },
]);

const agencyStatuses = checkDb.prepare('SELECT id, display_status FROM state_resource_agencies ORDER BY id').all();
assert.deepEqual(agencyStatuses, [
  { id: 'agency-bad', display_status: 'needs_review' },
]);

const providerStatuses = checkDb.prepare('SELECT id, display_status, verification_status, data_quality_notes FROM resource_providers ORDER BY id').all();
assert.deepEqual(providerStatuses, [
  {
    id: 'provider-already-hidden',
    display_status: 'needs_review',
    verification_status: 'needs_review',
    data_quality_notes: 'placeholder quarantine: placeholder_name:name, placeholder_phone:phone, placeholder_email:email',
  },
  {
    id: 'provider-bad-action',
    display_status: 'needs_review',
    verification_status: 'needs_review',
    data_quality_notes: 'placeholder quarantine: placeholder_name:name, placeholder_website:website, placeholder_action_url:next_step_url',
  },
]);

const nonprofitStatuses = checkDb.prepare('SELECT id, display_status FROM nonprofit_organizations ORDER BY id').all();
assert.deepEqual(nonprofitStatuses, [
  { id: 'nonprofit-fallback', display_status: 'needs_review' },
  { id: 'nonprofit-search-fallback', display_status: 'needs_review' },
]);

const formStatuses = checkDb.prepare('SELECT id, display_status FROM forms_and_guides ORDER BY id').all();
assert.deepEqual(formStatuses, [
  { id: 'form-bad', display_status: 'needs_review' },
  { id: 'form-good', display_status: 'published' },
]);

assert.equal(summary.totalDowngraded, 9);
assert.equal(fs.existsSync(path.join(outputDir, 'public-placeholder-quarantine-audit-2099-01-01.json')), true);
assert.equal(fs.existsSync(path.join(outputDir, 'public-placeholder-quarantine-audit-2099-01-01.md')), true);

checkDb.close();
fs.rmSync(tempRoot, { recursive: true, force: true });

console.log('public placeholder quarantine tests passed');
