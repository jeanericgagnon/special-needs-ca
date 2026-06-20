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

function parseCountyList(value) {
  if (!value) return [];
  const raw = String(value).trim();
  if (!raw || raw.toLowerCase() === 'statewide') return [];
  return raw.split(',').map((item) => item.trim()).filter(Boolean);
}

function deriveIntakeModel(...values) {
  const present = values.map((value) => String(value || '').trim()).filter(Boolean);
  const hasPhone = present.some((value) => /\(?\d{3}\)?/.test(value));
  const hasEmail = present.some((value) => value.includes('@'));
  const hasUrl = present.some((value) => /^https?:\/\//i.test(value));

  if (hasPhone && hasUrl) return 'mixed';
  if (hasPhone) return 'call';
  if (hasEmail) return 'email';
  if (hasUrl) return 'see_instructions';
  return 'unknown';
}

function deriveAreaType(countiesServed, catchmentBoundaries) {
  const countyIds = parseCountyList(countiesServed);
  const boundaries = String(catchmentBoundaries || '').toLowerCase();

  if (boundaries.includes('statewide') || String(countiesServed || '').toLowerCase() === 'statewide') {
    return 'statewide';
  }
  if (countyIds.length > 1) return 'county_group';
  if (countyIds.length === 1) return 'catchment';
  return 'catchment';
}

function summarizeCoverage(countiesServed, catchmentBoundaries) {
  const countyIds = parseCountyList(countiesServed);
  if (countyIds.length > 0) {
    return countyIds.length === 1
      ? `Serves county ${countyIds[0]}.`
      : `Serves ${countyIds.length} counties: ${countyIds.join(', ')}.`;
  }
  return String(catchmentBoundaries || '').trim() || 'Regional catchment coverage.';
}

const upsertOrganization = db.prepare(`
  INSERT INTO organizations (
    id, name, organization_type, parent_organization_id, website, intake_phone, intake_email,
    source_url, source_type, data_origin, verification_status, last_verified_date,
    last_scraped_at, confidence_score, notes
  ) VALUES (
    @id, @name, @organization_type, NULL, @website, @intake_phone, @intake_email,
    @source_url, @source_type, @data_origin, @verification_status, @last_verified_date,
    @last_scraped_at, @confidence_score, @notes
  )
  ON CONFLICT(id) DO UPDATE SET
    name = excluded.name,
    organization_type = excluded.organization_type,
    website = excluded.website,
    intake_phone = excluded.intake_phone,
    intake_email = excluded.intake_email,
    source_url = excluded.source_url,
    source_type = excluded.source_type,
    data_origin = excluded.data_origin,
    verification_status = excluded.verification_status,
    last_verified_date = excluded.last_verified_date,
    last_scraped_at = excluded.last_scraped_at,
    confidence_score = excluded.confidence_score,
    notes = excluded.notes
`);

const upsertProgramLink = db.prepare(`
  INSERT INTO organization_program_links (
    id, organization_id, program_id, listing_type, title, intake_model, service_summary,
    eligibility_summary, source_url, source_type, data_origin, verification_status,
    last_verified_date, last_scraped_at, confidence_score
  ) VALUES (
    @id, @organization_id, @program_id, @listing_type, @title, @intake_model, @service_summary,
    @eligibility_summary, @source_url, @source_type, @data_origin, @verification_status,
    @last_verified_date, @last_scraped_at, @confidence_score
  )
  ON CONFLICT(id) DO UPDATE SET
    organization_id = excluded.organization_id,
    program_id = excluded.program_id,
    listing_type = excluded.listing_type,
    title = excluded.title,
    intake_model = excluded.intake_model,
    service_summary = excluded.service_summary,
    eligibility_summary = excluded.eligibility_summary,
    source_url = excluded.source_url,
    source_type = excluded.source_type,
    data_origin = excluded.data_origin,
    verification_status = excluded.verification_status,
    last_verified_date = excluded.last_verified_date,
    last_scraped_at = excluded.last_scraped_at,
    confidence_score = excluded.confidence_score
`);

const upsertOfficeLocation = db.prepare(`
  INSERT INTO office_locations (
    id, organization_id, office_name, office_type, address, city, state_id, postal_code,
    county_id, intake_phone, intake_email, website, hours_text, source_url, source_type,
    data_origin, verification_status, last_verified_date, last_scraped_at, confidence_score
  ) VALUES (
    @id, @organization_id, @office_name, @office_type, @address, NULL, @state_id, NULL,
    @county_id, @intake_phone, @intake_email, @website, NULL, @source_url, @source_type,
    @data_origin, @verification_status, @last_verified_date, @last_scraped_at, @confidence_score
  )
  ON CONFLICT(id) DO UPDATE SET
    organization_id = excluded.organization_id,
    office_name = excluded.office_name,
    office_type = excluded.office_type,
    address = excluded.address,
    state_id = excluded.state_id,
    county_id = excluded.county_id,
    intake_phone = excluded.intake_phone,
    intake_email = excluded.intake_email,
    website = excluded.website,
    source_url = excluded.source_url,
    source_type = excluded.source_type,
    data_origin = excluded.data_origin,
    verification_status = excluded.verification_status,
    last_verified_date = excluded.last_verified_date,
    last_scraped_at = excluded.last_scraped_at,
    confidence_score = excluded.confidence_score
`);

const upsertVirtualServiceArea = db.prepare(`
  INSERT INTO virtual_service_areas (
    id, organization_id, program_link_id, area_type, area_name, state_id, coverage_notes,
    intake_model, source_url, source_type, data_origin, verification_status,
    last_verified_date, last_scraped_at, confidence_score
  ) VALUES (
    @id, @organization_id, @program_link_id, @area_type, @area_name, @state_id, @coverage_notes,
    @intake_model, @source_url, @source_type, @data_origin, @verification_status,
    @last_verified_date, @last_scraped_at, @confidence_score
  )
  ON CONFLICT(id) DO UPDATE SET
    organization_id = excluded.organization_id,
    program_link_id = excluded.program_link_id,
    area_type = excluded.area_type,
    area_name = excluded.area_name,
    state_id = excluded.state_id,
    coverage_notes = excluded.coverage_notes,
    intake_model = excluded.intake_model,
    source_url = excluded.source_url,
    source_type = excluded.source_type,
    data_origin = excluded.data_origin,
    verification_status = excluded.verification_status,
    last_verified_date = excluded.last_verified_date,
    last_scraped_at = excluded.last_scraped_at,
    confidence_score = excluded.confidence_score
`);

const upsertVirtualAreaCounty = db.prepare(`
  INSERT OR REPLACE INTO virtual_service_area_counties (virtual_service_area_id, county_id)
  VALUES (?, ?)
`);

const existingPrograms = new Set(
  db.prepare('SELECT id FROM programs').all().map((row) => row.id)
);

const countiesById = new Map(
  db.prepare('SELECT id, state_id FROM counties').all().map((row) => [row.id, row])
);

const stateAgencies = db.prepare(`
  SELECT id, state_id, agency_type, name, counties_served, catchment_boundaries, website,
         intake_phone, early_intervention_contact, agency_intake_contact, eligibility_info_page,
         services_page, source_url, source_type, data_origin, verification_status,
         last_verified_date, last_scraped_at, confidence_score
  FROM state_resource_agencies
`).all();

const countyOffices = db.prepare(`
  SELECT co.id, co.county_id, co.program_id, co.office_name, co.address, co.phone, co.email, co.website,
         co.source_url, co.source_type, co.data_origin, co.verification_status,
         co.last_verified_date, co.last_scraped_at, co.confidence_score, c.state_id
  FROM county_offices co
  JOIN counties c ON c.id = co.county_id
`).all();

const tx = db.transaction(() => {
  let agencyOrgCount = 0;
  let agencyProgramLinkCount = 0;
  let agencyOfficeCount = 0;
  let agencyVirtualAreaCount = 0;
  let agencyCountyMapCount = 0;
  let countyOrgCount = 0;
  let countyProgramLinkCount = 0;
  let countyOfficeLocationCount = 0;

  for (const agency of stateAgencies) {
    const organizationId = `org-agency-${agency.id}`;
    const programLinkId = `opl-agency-${agency.id}`;
    const officeId = `office-agency-${agency.id}`;
    const virtualAreaId = `vsa-agency-${agency.id}`;
    const intakePhone = agency.agency_intake_contact || agency.intake_phone || agency.early_intervention_contact || null;
    const intakeModel = deriveIntakeModel(
      agency.agency_intake_contact,
      agency.intake_phone,
      agency.early_intervention_contact,
      agency.eligibility_info_page,
      agency.services_page,
      agency.website
    );

    upsertOrganization.run({
      id: organizationId,
      name: agency.name,
      organization_type: 'public_agency',
      website: agency.website,
      intake_phone: intakePhone,
      intake_email: null,
      source_url: agency.source_url || agency.website,
      source_type: agency.source_type,
      data_origin: 'normalized_backfill_public_offices',
      verification_status: agency.verification_status,
      last_verified_date: agency.last_verified_date || today,
      last_scraped_at: agency.last_scraped_at || now,
      confidence_score: agency.confidence_score,
      notes: `Backfilled from state_resource_agencies:${agency.id}`,
    });
    agencyOrgCount += 1;

    upsertProgramLink.run({
      id: programLinkId,
      organization_id: organizationId,
      program_id: null,
      listing_type: 'public_office',
      title: agency.name,
      intake_model: intakeModel,
      service_summary: summarizeCoverage(agency.counties_served, agency.catchment_boundaries),
      eligibility_summary: null,
      source_url: agency.source_url || agency.website,
      source_type: agency.source_type,
      data_origin: 'normalized_backfill_public_offices',
      verification_status: agency.verification_status,
      last_verified_date: agency.last_verified_date || today,
      last_scraped_at: agency.last_scraped_at || now,
      confidence_score: agency.confidence_score,
    });
    agencyProgramLinkCount += 1;

    upsertOfficeLocation.run({
      id: officeId,
      organization_id: organizationId,
      office_name: agency.name,
      office_type: agency.agency_type === 'early_intervention' ? 'intake' : 'regional',
      address: agency.office_locations,
      state_id: agency.state_id,
      county_id: null,
      intake_phone: intakePhone,
      intake_email: null,
      website: agency.website,
      source_url: agency.source_url || agency.website,
      source_type: agency.source_type,
      data_origin: 'normalized_backfill_public_offices',
      verification_status: agency.verification_status,
      last_verified_date: agency.last_verified_date || today,
      last_scraped_at: agency.last_scraped_at || now,
      confidence_score: agency.confidence_score,
    });
    agencyOfficeCount += 1;

    upsertVirtualServiceArea.run({
      id: virtualAreaId,
      organization_id: organizationId,
      program_link_id: programLinkId,
      area_type: deriveAreaType(agency.counties_served, agency.catchment_boundaries),
      area_name: `${agency.name} service area`,
      state_id: agency.state_id,
      coverage_notes: summarizeCoverage(agency.counties_served, agency.catchment_boundaries),
      intake_model: intakeModel,
      source_url: agency.source_url || agency.website,
      source_type: agency.source_type,
      data_origin: 'normalized_backfill_public_offices',
      verification_status: agency.verification_status,
      last_verified_date: agency.last_verified_date || today,
      last_scraped_at: agency.last_scraped_at || now,
      confidence_score: agency.confidence_score,
    });
    agencyVirtualAreaCount += 1;

    for (const countyId of parseCountyList(agency.counties_served)) {
      if (!countiesById.has(countyId)) continue;
      upsertVirtualAreaCounty.run(virtualAreaId, countyId);
      agencyCountyMapCount += 1;
    }
  }

  for (const office of countyOffices) {
    const organizationId = `org-county-office-${office.id}`;
    const programLinkId = `opl-county-office-${office.id}`;
    const officeLocationId = `office-county-${office.id}`;
    const validProgramId = existingPrograms.has(office.program_id) ? office.program_id : null;
    const intakeModel = deriveIntakeModel(office.phone, office.email, office.website);

    upsertOrganization.run({
      id: organizationId,
      name: office.office_name,
      organization_type: 'public_agency',
      website: office.website,
      intake_phone: office.phone,
      intake_email: office.email,
      source_url: office.source_url || office.website,
      source_type: office.source_type,
      data_origin: 'normalized_backfill_public_offices',
      verification_status: office.verification_status,
      last_verified_date: office.last_verified_date || today,
      last_scraped_at: office.last_scraped_at || now,
      confidence_score: office.confidence_score,
      notes: `Backfilled from county_offices:${office.id}`,
    });
    countyOrgCount += 1;

    upsertProgramLink.run({
      id: programLinkId,
      organization_id: organizationId,
      program_id: validProgramId,
      listing_type: 'public_office',
      title: office.office_name,
      intake_model: intakeModel,
      service_summary: `Public office for county ${office.county_id}.`,
      eligibility_summary: null,
      source_url: office.source_url || office.website,
      source_type: office.source_type,
      data_origin: 'normalized_backfill_public_offices',
      verification_status: office.verification_status,
      last_verified_date: office.last_verified_date || today,
      last_scraped_at: office.last_scraped_at || now,
      confidence_score: office.confidence_score,
    });
    countyProgramLinkCount += 1;

    upsertOfficeLocation.run({
      id: officeLocationId,
      organization_id: organizationId,
      office_name: office.office_name,
      office_type: 'county',
      address: office.address,
      state_id: office.state_id,
      county_id: office.county_id,
      intake_phone: office.phone,
      intake_email: office.email,
      website: office.website,
      source_url: office.source_url || office.website,
      source_type: office.source_type,
      data_origin: 'normalized_backfill_public_offices',
      verification_status: office.verification_status,
      last_verified_date: office.last_verified_date || today,
      last_scraped_at: office.last_scraped_at || now,
      confidence_score: office.confidence_score,
    });
    countyOfficeLocationCount += 1;
  }

  return {
    agencyOrgCount,
    agencyProgramLinkCount,
    agencyOfficeCount,
    agencyVirtualAreaCount,
    agencyCountyMapCount,
    countyOrgCount,
    countyProgramLinkCount,
    countyOfficeLocationCount,
  };
});

const result = tx();

db.pragma('wal_checkpoint(TRUNCATE)');
db.close();

if (fs.existsSync(frontendDbPath)) {
  fs.copyFileSync(dbPath, frontendDbPath);
}

console.log(JSON.stringify({
  message: 'Backfilled normalized public office foundation',
  ...result,
}, null, 2));
