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

function parseList(value) {
  if (!value) return [];
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function deriveIntakeModel(advocate) {
  if (advocate.next_step_type) {
    if (['call', 'email', 'apply_online', 'referral', 'schedule', 'walk_in'].includes(advocate.next_step_type)) {
      return advocate.next_step_type;
    }
  }

  const candidates = [
    advocate.next_step_url,
    advocate.application_url,
    advocate.referral_url,
    advocate.next_step_phone,
    advocate.phone,
    advocate.next_step_email,
    advocate.email,
    advocate.website,
  ].map((value) => String(value || '').trim()).filter(Boolean);

  const hasPhone = candidates.some((value) => /\(?\d{3}\)?/.test(value));
  const hasEmail = candidates.some((value) => value.includes('@'));
  const hasUrl = candidates.some((value) => /^https?:\/\//i.test(value));

  if (hasPhone && hasUrl) return 'mixed';
  if (hasPhone) return 'call';
  if (hasEmail) return 'email';
  if (hasUrl) return 'see_instructions';
  return 'unknown';
}

function buildServiceSummary(advocate) {
  const specialties = parseList(advocate.specialties);
  const serviceTags = parseList(advocate.service_tags);
  const parts = [];

  if (specialties.length > 0) {
    parts.push(`Specialties: ${specialties.join(', ')}`);
  }
  if (serviceTags.length > 0) {
    parts.push(`Services: ${serviceTags.join(', ')}`);
  }
  if (advocate.description) {
    parts.push(String(advocate.description).trim());
  }

  return parts.join('. ') || 'Source-backed advocate listing.';
}

function buildEligibilitySummary(advocate) {
  const servingTags = parseList(advocate.serving_tags);
  const parts = [];

  if (servingTags.length > 0) {
    parts.push(`Serves: ${servingTags.join(', ')}`);
  }
  if (advocate.requirements) {
    parts.push(`Requirements: ${advocate.requirements}`);
  }

  return parts.join('. ') || null;
}

function deriveAreaType(countyCount) {
  return countyCount > 1 ? 'county_group' : 'catchment';
}

const upsertOrganization = db.prepare(`
  INSERT INTO organizations (
    id, name, organization_type, parent_organization_id, website, intake_phone, intake_email,
    source_url, source_type, data_origin, verification_status, last_verified_date,
    last_scraped_at, confidence_score, notes
  ) VALUES (
    @id, @name, 'advocacy_org', NULL, @website, @intake_phone, @intake_email,
    @source_url, @source_type, @data_origin, @verification_status, @last_verified_date,
    @last_scraped_at, @confidence_score, @notes
  )
  ON CONFLICT(id) DO UPDATE SET
    name = excluded.name,
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
    @id, @organization_id, NULL, 'education_support', @title, @intake_model, @service_summary,
    @eligibility_summary, @source_url, @source_type, @data_origin, @verification_status,
    @last_verified_date, @last_scraped_at, @confidence_score
  )
  ON CONFLICT(id) DO UPDATE SET
    organization_id = excluded.organization_id,
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

const advocates = db.prepare(`
  SELECT ia.*
  FROM iep_advocates ia
  WHERE ia.source_url IS NOT NULL
    AND TRIM(ia.source_url) <> ''
    AND ia.verification_status IN ('official_verified', 'verified', 'human_verified', 'source_listed')
`).all();

const countiesByAdvocate = new Map();
for (const row of db.prepare(`
  SELECT ia.id AS advocate_id, iac.county_id, c.state_id, c.name AS county_name
  FROM iep_advocates ia
  JOIN iep_advocate_counties iac ON iac.iep_advocate_id = ia.id
  JOIN counties c ON c.id = iac.county_id
  WHERE ia.source_url IS NOT NULL
    AND TRIM(ia.source_url) <> ''
    AND ia.verification_status IN ('official_verified', 'verified', 'human_verified', 'source_listed')
`).all()) {
  const existing = countiesByAdvocate.get(row.advocate_id) || [];
  existing.push(row);
  countiesByAdvocate.set(row.advocate_id, existing);
}

const tx = db.transaction(() => {
  let normalizedOrganizations = 0;
  let normalizedProgramLinks = 0;
  let normalizedVirtualAreas = 0;
  let normalizedCountyMappings = 0;

  for (const advocate of advocates) {
    const counties = countiesByAdvocate.get(advocate.id) || [];
    if (counties.length === 0) continue;

    const organizationId = `org-advocate-${advocate.id}`;
    const programLinkId = `opl-advocate-${advocate.id}`;
    const virtualAreaId = `vsa-advocate-${advocate.id}`;
    const intakePhone = advocate.next_step_phone || advocate.phone || null;
    const intakeEmail = advocate.next_step_email || advocate.email || null;
    const sourceUrl = advocate.source_url || advocate.website;
    const stateId = counties[0].state_id;
    const areaType = deriveAreaType(counties.length);
    const areaName = counties.length === 1
      ? `${advocate.name} - ${counties[0].county_name} County`
      : `${advocate.name} multi-county service area`;
    const coverageNotes = counties.length === 1
      ? `Anchored to ${counties[0].county_name} County via iep_advocate_counties.`
      : `Mapped to ${counties.length} counties via iep_advocate_counties.`;

    upsertOrganization.run({
      id: organizationId,
      name: advocate.name,
      website: advocate.website,
      intake_phone: intakePhone,
      intake_email: intakeEmail,
      source_url: sourceUrl,
      source_type: advocate.source_type,
      data_origin: 'normalized_backfill_advocate_areas',
      verification_status: advocate.verification_status,
      last_verified_date: advocate.last_verified_date || advocate.last_verified_at || today,
      last_scraped_at: advocate.last_scraped_at || now,
      confidence_score: advocate.confidence_score,
      notes: `Backfilled from iep_advocates:${advocate.id}`,
    });
    normalizedOrganizations += 1;

    upsertProgramLink.run({
      id: programLinkId,
      organization_id: organizationId,
      title: advocate.name,
      intake_model: deriveIntakeModel(advocate),
      service_summary: buildServiceSummary(advocate),
      eligibility_summary: buildEligibilitySummary(advocate),
      source_url: sourceUrl,
      source_type: advocate.source_type,
      data_origin: 'normalized_backfill_advocate_areas',
      verification_status: advocate.verification_status,
      last_verified_date: advocate.last_verified_date || advocate.last_verified_at || today,
      last_scraped_at: advocate.last_scraped_at || now,
      confidence_score: advocate.confidence_score,
    });
    normalizedProgramLinks += 1;

    upsertVirtualServiceArea.run({
      id: virtualAreaId,
      organization_id: organizationId,
      program_link_id: programLinkId,
      area_type: areaType,
      area_name: areaName,
      state_id: stateId,
      coverage_notes: coverageNotes,
      intake_model: deriveIntakeModel(advocate),
      source_url: sourceUrl,
      source_type: advocate.source_type,
      data_origin: 'normalized_backfill_advocate_areas',
      verification_status: advocate.verification_status,
      last_verified_date: advocate.last_verified_date || advocate.last_verified_at || today,
      last_scraped_at: advocate.last_scraped_at || now,
      confidence_score: advocate.confidence_score,
    });
    normalizedVirtualAreas += 1;

    for (const county of counties) {
      upsertVirtualAreaCounty.run(virtualAreaId, county.county_id);
      normalizedCountyMappings += 1;
    }
  }

  return {
    normalizedOrganizations,
    normalizedProgramLinks,
    normalizedVirtualAreas,
    normalizedCountyMappings,
    sourceBackedAdvocates: advocates.length,
  };
});

const result = tx();

db.pragma('wal_checkpoint(TRUNCATE)');
db.close();

if (fs.existsSync(frontendDbPath)) {
  fs.copyFileSync(dbPath, frontendDbPath);
}

console.log(JSON.stringify({
  message: 'Backfilled normalized advocate areas',
  ...result,
}, null, 2));
