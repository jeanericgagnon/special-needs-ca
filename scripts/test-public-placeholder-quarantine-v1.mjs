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

const districtStatuses = checkDb.prepare('SELECT id, display_status FROM school_districts ORDER BY id').all();
assert.deepEqual(districtStatuses, [
  { id: 'dist-bad', display_status: 'needs_review' },
  { id: 'dist-good', display_status: 'published' },
]);

const officeStatuses = checkDb.prepare('SELECT id, display_status FROM county_offices ORDER BY id').all();
assert.deepEqual(officeStatuses, [
  { id: 'office-bad', display_status: 'needs_review' },
  { id: 'office-good', display_status: 'published' },
]);

const agencyStatuses = checkDb.prepare('SELECT id, display_status FROM state_resource_agencies ORDER BY id').all();
assert.deepEqual(agencyStatuses, [
  { id: 'agency-bad', display_status: 'needs_review' },
]);

const providerStatuses = checkDb.prepare('SELECT id, display_status FROM resource_providers ORDER BY id').all();
assert.deepEqual(providerStatuses, [
  { id: 'provider-bad-action', display_status: 'needs_review' },
]);

const nonprofitStatuses = checkDb.prepare('SELECT id, display_status FROM nonprofit_organizations ORDER BY id').all();
assert.deepEqual(nonprofitStatuses, [
  { id: 'nonprofit-search-fallback', display_status: 'needs_review' },
]);

assert.equal(summary.totalDowngraded, 5);
assert.equal(fs.existsSync(path.join(outputDir, 'public-placeholder-quarantine-audit-2099-01-01.json')), true);
assert.equal(fs.existsSync(path.join(outputDir, 'public-placeholder-quarantine-audit-2099-01-01.md')), true);

checkDb.close();
fs.rmSync(tempRoot, { recursive: true, force: true });

console.log('public placeholder quarantine tests passed');
