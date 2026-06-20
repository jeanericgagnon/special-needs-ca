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
const PUBLIC_STATUSES = new Set(['official_verified', 'verified', 'human_verified', 'source_listed']);

function parseList(value) {
  if (!value) return [];
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function deriveIntakeModel(provider) {
  const candidates = [
    provider.next_step_type,
    provider.next_step_url,
    provider.application_url,
    provider.referral_url,
    provider.next_step_phone,
    provider.phone,
    provider.next_step_email,
    provider.email,
  ].map((value) => String(value || '').trim()).filter(Boolean);

  if (provider.next_step_type) {
    if (provider.next_step_type === 'schedule') return 'schedule';
    if (provider.next_step_type === 'apply_online') return 'apply_online';
    if (provider.next_step_type === 'referral') return 'referral';
    if (provider.next_step_type === 'walk_in') return 'walk_in';
    if (provider.next_step_type === 'email') return 'email';
    if (provider.next_step_type === 'call') return 'call';
  }

  const hasPhone = candidates.some((value) => /\(?\d{3}\)?/.test(value));
  const hasEmail = candidates.some((value) => value.includes('@'));
  const hasUrl = candidates.some((value) => /^https?:\/\//i.test(value));

  if (hasPhone && hasUrl) return 'mixed';
  if (hasPhone) return 'call';
  if (hasEmail) return 'email';
  if (hasUrl) return 'see_instructions';
  return 'unknown';
}

function deriveLocationType(categories) {
  const normalized = parseList(categories).map((value) => value.toLowerCase());
  if (normalized.some((value) => value.includes('clinic') || value.includes('clinical') || value.includes('diagnostic'))) {
    return 'clinic';
  }
  if (normalized.some((value) => value.includes('campus'))) {
    return 'campus';
  }
  if (normalized.some((value) => value.includes('home'))) {
    return 'home_based';
  }
  if (normalized.some((value) => value.includes('mobile'))) {
    return 'mobile';
  }
  return 'other';
}

function buildServiceSummary(provider) {
  const categories = parseList(provider.categories);
  const serviceTags = parseList(provider.service_tags);
  const parts = [];

  if (categories.length > 0) {
    parts.push(`Categories: ${categories.join(', ')}`);
  }
  if (serviceTags.length > 0) {
    parts.push(`Services: ${serviceTags.join(', ')}`);
  }

  return parts.join('. ') || 'Source-backed provider listing.';
}

function buildEligibilitySummary(provider) {
  const servingTags = parseList(provider.serving_tags);
  const parts = [];

  if (servingTags.length > 0) {
    parts.push(`Serves: ${servingTags.join(', ')}`);
  }
  if (provider.requirements) {
    parts.push(`Requirements: ${provider.requirements}`);
  }

  return parts.join('. ') || null;
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

const upsertServiceLocation = db.prepare(`
  INSERT INTO service_locations (
    id, organization_id, location_name, location_type, address, city, state_id, postal_code,
    county_id, phone, email, website, appointment_url, hours_text, source_url, source_type,
    data_origin, verification_status, last_verified_date, last_scraped_at, confidence_score
  ) VALUES (
    @id, @organization_id, @location_name, @location_type, @address, NULL, @state_id, NULL,
    @county_id, @phone, @email, @website, @appointment_url, NULL, @source_url, @source_type,
    @data_origin, @verification_status, @last_verified_date, @last_scraped_at, @confidence_score
  )
  ON CONFLICT(id) DO UPDATE SET
    organization_id = excluded.organization_id,
    location_name = excluded.location_name,
    location_type = excluded.location_type,
    address = excluded.address,
    state_id = excluded.state_id,
    county_id = excluded.county_id,
    phone = excluded.phone,
    email = excluded.email,
    website = excluded.website,
    appointment_url = excluded.appointment_url,
    source_url = excluded.source_url,
    source_type = excluded.source_type,
    data_origin = excluded.data_origin,
    verification_status = excluded.verification_status,
    last_verified_date = excluded.last_verified_date,
    last_scraped_at = excluded.last_scraped_at,
    confidence_score = excluded.confidence_score
`);

const providers = db.prepare(`
  SELECT rp.*, c.state_id
  FROM resource_providers rp
  JOIN counties c ON c.id = rp.county_id
  WHERE rp.source_url IS NOT NULL
    AND TRIM(rp.source_url) <> ''
    AND rp.verification_status IN ('official_verified', 'verified', 'human_verified', 'source_listed')
`).all();

const tx = db.transaction(() => {
  let normalizedOrganizations = 0;
  let normalizedProgramLinks = 0;
  let normalizedServiceLocations = 0;

  for (const provider of providers) {
    if (!PUBLIC_STATUSES.has(String(provider.verification_status || ''))) continue;

    const organizationId = `org-provider-${provider.id}`;
    const programLinkId = `opl-provider-${provider.id}`;
    const serviceLocationId = `svc-provider-${provider.id}`;
    const intakePhone = provider.next_step_phone || provider.phone || null;
    const intakeEmail = provider.next_step_email || provider.email || null;
    const appointmentUrl = provider.next_step_url || provider.application_url || provider.referral_url || null;
    const sourceUrl = provider.source_url;

    upsertOrganization.run({
      id: organizationId,
      name: provider.name,
      organization_type: 'provider_org',
      website: sourceUrl,
      intake_phone: intakePhone,
      intake_email: intakeEmail,
      source_url: sourceUrl,
      source_type: provider.source_type,
      data_origin: 'normalized_backfill_provider_locations',
      verification_status: provider.verification_status,
      last_verified_date: provider.last_verified_date || today,
      last_scraped_at: provider.last_scraped_at || now,
      confidence_score: provider.confidence_score,
      notes: `Backfilled from resource_providers:${provider.id}`,
    });
    normalizedOrganizations += 1;

    upsertProgramLink.run({
      id: programLinkId,
      organization_id: organizationId,
      title: provider.name,
      intake_model: deriveIntakeModel(provider),
      service_summary: buildServiceSummary(provider),
      eligibility_summary: buildEligibilitySummary(provider),
      source_url: sourceUrl,
      source_type: provider.source_type,
      data_origin: 'normalized_backfill_provider_locations',
      verification_status: provider.verification_status,
      last_verified_date: provider.last_verified_date || today,
      last_scraped_at: provider.last_scraped_at || now,
      confidence_score: provider.confidence_score,
    });
    normalizedProgramLinks += 1;

    upsertServiceLocation.run({
      id: serviceLocationId,
      organization_id: organizationId,
      location_name: provider.name,
      location_type: deriveLocationType(provider.categories),
      address: provider.address,
      state_id: provider.state_id,
      county_id: provider.county_id,
      phone: provider.phone,
      email: provider.email,
      website: sourceUrl,
      appointment_url: appointmentUrl,
      source_url: sourceUrl,
      source_type: provider.source_type,
      data_origin: 'normalized_backfill_provider_locations',
      verification_status: provider.verification_status,
      last_verified_date: provider.last_verified_date || today,
      last_scraped_at: provider.last_scraped_at || now,
      confidence_score: provider.confidence_score,
    });
    normalizedServiceLocations += 1;
  }

  return {
    normalizedOrganizations,
    normalizedProgramLinks,
    normalizedServiceLocations,
    sourceBackedProviders: providers.length,
  };
});

const result = tx();

db.pragma('wal_checkpoint(TRUNCATE)');
db.close();

if (fs.existsSync(frontendDbPath)) {
  fs.copyFileSync(dbPath, frontendDbPath);
}

console.log(JSON.stringify({
  message: 'Backfilled normalized provider locations',
  ...result,
}, null, 2));
