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

function deriveIntakeModel(nonprofit) {
  if (nonprofit.next_step_type) {
    if (['call', 'email', 'apply_online', 'referral', 'schedule', 'walk_in'].includes(nonprofit.next_step_type)) {
      return nonprofit.next_step_type;
    }
  }

  const candidates = [
    nonprofit.next_step_url,
    nonprofit.application_url,
    nonprofit.referral_url,
    nonprofit.next_step_phone,
    nonprofit.phone,
    nonprofit.next_step_email,
    nonprofit.website,
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

function buildServiceSummary(nonprofit) {
  const serviceTags = parseList(nonprofit.service_tags);
  const parts = [];

  if (serviceTags.length > 0) {
    parts.push(`Services: ${serviceTags.join(', ')}`);
  }
  if (nonprofit.focus_condition) {
    parts.push(`Focus condition: ${nonprofit.focus_condition}`);
  }

  return parts.join('. ') || 'Source-backed nonprofit listing.';
}

function buildEligibilitySummary(nonprofit) {
  const servingTags = parseList(nonprofit.serving_tags);
  const parts = [];

  if (servingTags.length > 0) {
    parts.push(`Serves: ${servingTags.join(', ')}`);
  }
  if (nonprofit.requirements) {
    parts.push(`Requirements: ${nonprofit.requirements}`);
  }

  return parts.join('. ') || null;
}

const upsertOrganization = db.prepare(`
  INSERT INTO organizations (
    id, name, organization_type, parent_organization_id, website, intake_phone, intake_email,
    source_url, source_type, data_origin, verification_status, last_verified_date,
    last_scraped_at, confidence_score, notes
  ) VALUES (
    @id, @name, 'nonprofit', NULL, @website, @intake_phone, @intake_email,
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
    @id, @organization_id, NULL, 'directory_service', @title, @intake_model, @service_summary,
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
    @id, @organization_id, @program_link_id, 'catchment', @area_name, @state_id, @coverage_notes,
    @intake_model, @source_url, @source_type, @data_origin, @verification_status,
    @last_verified_date, @last_scraped_at, @confidence_score
  )
  ON CONFLICT(id) DO UPDATE SET
    organization_id = excluded.organization_id,
    program_link_id = excluded.program_link_id,
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

const nonprofits = db.prepare(`
  SELECT n.*, c.state_id, c.name AS county_name
  FROM nonprofit_organizations n
  JOIN counties c ON c.id = n.county_id
  WHERE n.source_url IS NOT NULL
    AND TRIM(n.source_url) <> ''
    AND n.verification_status IN ('official_verified', 'verified', 'human_verified', 'source_listed')
`).all();

const tx = db.transaction(() => {
  let normalizedOrganizations = 0;
  let normalizedProgramLinks = 0;
  let normalizedVirtualAreas = 0;
  let normalizedCountyMappings = 0;

  for (const nonprofit of nonprofits) {
    const organizationId = `org-nonprofit-${nonprofit.id}`;
    const programLinkId = `opl-nonprofit-${nonprofit.id}`;
    const virtualAreaId = `vsa-nonprofit-${nonprofit.id}`;
    const intakePhone = nonprofit.next_step_phone || nonprofit.phone || null;
    const intakeEmail = nonprofit.next_step_email || null;
    const sourceUrl = nonprofit.source_url || nonprofit.website;

    upsertOrganization.run({
      id: organizationId,
      name: nonprofit.name,
      website: nonprofit.website,
      intake_phone: intakePhone,
      intake_email: intakeEmail,
      source_url: sourceUrl,
      source_type: nonprofit.source_type,
      data_origin: 'normalized_backfill_nonprofit_areas',
      verification_status: nonprofit.verification_status,
      last_verified_date: nonprofit.last_verified_date || today,
      last_scraped_at: nonprofit.last_scraped_at || now,
      confidence_score: nonprofit.confidence_score,
      notes: `Backfilled from nonprofit_organizations:${nonprofit.id}`,
    });
    normalizedOrganizations += 1;

    upsertProgramLink.run({
      id: programLinkId,
      organization_id: organizationId,
      title: nonprofit.name,
      intake_model: deriveIntakeModel(nonprofit),
      service_summary: buildServiceSummary(nonprofit),
      eligibility_summary: buildEligibilitySummary(nonprofit),
      source_url: sourceUrl,
      source_type: nonprofit.source_type,
      data_origin: 'normalized_backfill_nonprofit_areas',
      verification_status: nonprofit.verification_status,
      last_verified_date: nonprofit.last_verified_date || today,
      last_scraped_at: nonprofit.last_scraped_at || now,
      confidence_score: nonprofit.confidence_score,
    });
    normalizedProgramLinks += 1;

    upsertVirtualServiceArea.run({
      id: virtualAreaId,
      organization_id: organizationId,
      program_link_id: programLinkId,
      area_name: `${nonprofit.name} - ${nonprofit.county_name} County`,
      state_id: nonprofit.state_id,
      coverage_notes: `Anchored to ${nonprofit.county_name} County via nonprofit_organizations:${nonprofit.id}.`,
      intake_model: deriveIntakeModel(nonprofit),
      source_url: sourceUrl,
      source_type: nonprofit.source_type,
      data_origin: 'normalized_backfill_nonprofit_areas',
      verification_status: nonprofit.verification_status,
      last_verified_date: nonprofit.last_verified_date || today,
      last_scraped_at: nonprofit.last_scraped_at || now,
      confidence_score: nonprofit.confidence_score,
    });
    normalizedVirtualAreas += 1;

    upsertVirtualAreaCounty.run(virtualAreaId, nonprofit.county_id);
    normalizedCountyMappings += 1;
  }

  return {
    normalizedOrganizations,
    normalizedProgramLinks,
    normalizedVirtualAreas,
    normalizedCountyMappings,
    sourceBackedNonprofits: nonprofits.length,
  };
});

const result = tx();

db.pragma('wal_checkpoint(TRUNCATE)');
db.close();

if (fs.existsSync(frontendDbPath)) {
  fs.copyFileSync(dbPath, frontendDbPath);
}

console.log(JSON.stringify({
  message: 'Backfilled normalized nonprofit areas',
  ...result,
}, null, 2));
