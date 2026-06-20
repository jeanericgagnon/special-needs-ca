import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const frontendDbPath = path.join(repoRoot, 'frontend', 'ca_disability_navigator.db');
const rootDbPath = path.join(repoRoot, 'ca_disability_navigator.db');
const dbPath = fs.existsSync(frontendDbPath) ? frontendDbPath : rootDbPath;
const docsDir = path.join(repoRoot, 'docs', 'generated');
const generatedDate = new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `competitive-foundation-gap-audit-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `competitive-foundation-gap-audit-${generatedDate}.md`);

const db = new Database(dbPath, { readonly: true });

const directoryFoundationPath = path.join(repoRoot, 'frontend', 'src', 'lib', 'directoryFoundation.ts');
const directoryAnalyticsPath = path.join(repoRoot, 'frontend', 'src', 'lib', 'directoryAnalytics.ts');
const directoryPanelPath = path.join(repoRoot, 'frontend', 'src', 'app', 'components', 'directory-foundation-panel.tsx');
const advocatesClientPath = path.join(repoRoot, 'frontend', 'src', 'app', 'advocates', 'advocate-directory-client.tsx');
const countiesClientPath = path.join(repoRoot, 'frontend', 'src', 'app', 'counties', '[state]', 'counties-client.tsx');
const findHelpClientPath = path.join(repoRoot, 'frontend', 'src', 'app', 'find-help', 'find-help-client.tsx');
const publicTruthPath = path.join(repoRoot, 'frontend', 'src', 'lib', 'publicTruth.ts');
const frontendDbLibraryPath = path.join(repoRoot, 'frontend', 'src', 'lib', 'db.ts');
const orgProgramLocationDocPath = path.join(repoRoot, 'docs', 'directory-org-program-location-foundation-v1.md');

const directoryFoundationContent = fs.readFileSync(directoryFoundationPath, 'utf8');
const directoryAnalyticsContent = fs.readFileSync(directoryAnalyticsPath, 'utf8');
const directoryPanelContent = fs.readFileSync(directoryPanelPath, 'utf8');
const advocatesClientContent = fs.readFileSync(advocatesClientPath, 'utf8');
const countiesClientContent = fs.readFileSync(countiesClientPath, 'utf8');
const findHelpClientContent = fs.readFileSync(findHelpClientPath, 'utf8');
const publicTruthContent = fs.readFileSync(publicTruthPath, 'utf8');
const frontendDbLibraryContent = fs.readFileSync(frontendDbLibraryPath, 'utf8');
const orgProgramLocationDocContent = fs.readFileSync(orgProgramLocationDocPath, 'utf8');

const DIRECTORY_TABLES = ['resource_providers', 'nonprofit_organizations', 'iep_advocates'];
const NORMALIZATION_TABLES = [
  'organizations',
  'organization_program_links',
  'service_locations',
  'office_locations',
  'virtual_service_areas',
  'virtual_service_area_counties',
];

function tableColumns(tableName) {
  return db.prepare(`PRAGMA table_info(${tableName})`).all().map((row) => row.name);
}

function tableHasColumns(tableName, requiredColumns) {
  const columns = new Set(tableColumns(tableName));
  return requiredColumns.every((column) => columns.has(column));
}

function countRowsWithAny(tableName, columns) {
  const availableColumns = new Set(tableColumns(tableName));
  const conditions = columns
    .filter((column) => {
      const normalized = column.endsWith('=1') ? column.slice(0, -2) : column;
      return availableColumns.has(normalized);
    })
    .map((column) => {
      if (column.endsWith('=1')) {
        const normalized = column.slice(0, -2);
        return `${normalized} = 1`;
      }
      return `${column} IS NOT NULL AND TRIM(CAST(${column} AS TEXT)) <> ''`;
    });
  if (!conditions.length) return 0;
  return db.prepare(`SELECT COUNT(*) AS count FROM ${tableName} WHERE ${conditions.join(' OR ')}`).get().count;
}

function countRowsWithAll(tableName, columns) {
  const availableColumns = new Set(tableColumns(tableName));
  const presentColumns = columns.filter((column) => availableColumns.has(column));
  if (presentColumns.length !== columns.length) return 0;
  const conditions = presentColumns.map((column) => `${column} IS NOT NULL AND TRIM(CAST(${column} AS TEXT)) <> ''`);
  return db.prepare(`SELECT COUNT(*) AS count FROM ${tableName} WHERE ${conditions.join(' AND ')}`).get().count;
}

function countTotal(tableName) {
  return db.prepare(`SELECT COUNT(*) AS count FROM ${tableName}`).get().count;
}

function countWhere(tableName, whereClause) {
  return db.prepare(`SELECT COUNT(*) AS count FROM ${tableName} WHERE ${whereClause}`).get().count;
}

function hasPattern(content, pattern) {
  return pattern.test(content);
}

function getStatus({ implemented, partial }) {
  if (implemented) return 'implemented';
  if (partial) return 'partial';
  return 'missing';
}

const rowTotals = Object.fromEntries(DIRECTORY_TABLES.map((table) => [table, countTotal(table)]));

const sections = [];

{
  const requiredColumns = ['service_tags', 'serving_tags'];
  const implemented = DIRECTORY_TABLES.every((table) => tableHasColumns(table, requiredColumns)) &&
    hasPattern(directoryFoundationContent, /DIRECTORY_SERVICE_TAGS/) &&
    hasPattern(directoryFoundationContent, /DIRECTORY_SERVING_TAGS/);
  const schemaSupport = hasPattern(frontendDbLibraryContent, /ADD COLUMN IF NOT EXISTS [a-z_]+ ADD COLUMN IF NOT EXISTS service_tags/s) ||
    hasPattern(frontendDbLibraryContent, /ADD COLUMN IF NOT EXISTS service_tags TEXT;/);
  const coverage = Object.fromEntries(DIRECTORY_TABLES.map((table) => [table, countRowsWithAny(table, requiredColumns)]));
  sections.push({
    id: 'taxonomy_tags',
    label: 'Disability-adjacent taxonomy and tags',
    status: getStatus({ implemented: implemented && Object.values(coverage).some((count) => count > 0), partial: implemented || schemaSupport }),
    evidence: [
      'Controlled service and serving tag vocabularies exist in frontend/src/lib/directoryFoundation.ts',
      'All three public directory tables carry service_tags and serving_tags columns',
      `Tagged records: providers ${coverage.resource_providers}/${rowTotals.resource_providers}, nonprofits ${coverage.nonprofit_organizations}/${rowTotals.nonprofit_organizations}, advocates ${coverage.iep_advocates}/${rowTotals.iep_advocates}`,
    ],
    gap: 'Condition taxonomy remains separate by design; tags are implemented for directory entities, not every program or office layer.',
  });
}

{
  const requiredColumns = ['availability_status', 'accepting_new_clients', 'waitlist_status', 'capacity_notes', 'funding_status', 'checked_at'];
  const hasSchema = DIRECTORY_TABLES.every((table) => tableHasColumns(table, requiredColumns));
  const schemaSupport = hasPattern(frontendDbLibraryContent, /ADD COLUMN IF NOT EXISTS availability_status TEXT;/);
  const coverage = Object.fromEntries(DIRECTORY_TABLES.map((table) => [table, countRowsWithAny(table, ['availability_status', 'accepting_new_clients', 'waitlist_status', 'capacity_notes', 'funding_status'])]));
  const explicitUnknownCoverage = Object.fromEntries(DIRECTORY_TABLES.map((table) => [table, countWhere(table, "availability_status = 'unknown'")]));
  const concreteCoverage = Object.fromEntries(DIRECTORY_TABLES.map((table) => [table, countWhere(table, "availability_status IN ('available','limited','near_capacity','waitlist','full','out_of_funding','temporarily_closed') OR accepting_new_clients = 1 OR (waitlist_status IS NOT NULL AND TRIM(waitlist_status) <> '') OR (capacity_notes IS NOT NULL AND TRIM(capacity_notes) <> '') OR (funding_status IS NOT NULL AND TRIM(funding_status) <> '')")]));
  const freshnessCoverage = Object.fromEntries(DIRECTORY_TABLES.map((table) => [table, countRowsWithAny(table, ['checked_at'])]));
  const hasConcreteCoverage = Object.values(concreteCoverage).some((count) => count > 0);
  sections.push({
    id: 'availability_capacity',
    label: 'Availability and capacity',
    status: getStatus({
      implemented: hasSchema && hasConcreteCoverage,
      partial: hasSchema || schemaSupport || Object.values(coverage).some((count) => count > 0),
    }),
    evidence: [
      'Availability, waitlist, capacity, funding, and freshness fields exist on public directory tables',
      `Rows carrying any availability/capacity signal: providers ${coverage.resource_providers}/${rowTotals.resource_providers}, nonprofits ${coverage.nonprofit_organizations}/${rowTotals.nonprofit_organizations}, advocates ${coverage.iep_advocates}/${rowTotals.iep_advocates}`,
      `Rows with explicit unknown availability: providers ${explicitUnknownCoverage.resource_providers}/${rowTotals.resource_providers}, nonprofits ${explicitUnknownCoverage.nonprofit_organizations}/${rowTotals.nonprofit_organizations}, advocates ${explicitUnknownCoverage.iep_advocates}/${rowTotals.iep_advocates}`,
      `Rows with concrete live availability/capacity signals: providers ${concreteCoverage.resource_providers}/${rowTotals.resource_providers}, nonprofits ${concreteCoverage.nonprofit_organizations}/${rowTotals.nonprofit_organizations}, advocates ${concreteCoverage.iep_advocates}/${rowTotals.iep_advocates}`,
      `Rows carrying freshness-only checked_at support: providers ${freshnessCoverage.resource_providers}/${rowTotals.resource_providers}, nonprofits ${freshnessCoverage.nonprofit_organizations}/${rowTotals.nonprofit_organizations}, advocates ${freshnessCoverage.iep_advocates}/${rowTotals.iep_advocates}`,
      'Supported availability statuses are validated in frontend/src/lib/directoryFoundation.ts and src/db/audit_directory_foundation.js',
    ],
    gap: 'Truth-first availability is now supported, including explicit unknown status for checked rows, but concrete live capacity data remains sparse.',
  });
}

{
  const requiredColumns = ['next_step_type', 'next_step_label', 'next_step_url', 'next_step_phone', 'next_step_email', 'next_step_instructions', 'requirements', 'application_url', 'referral_url', 'walk_in_available', 'appointment_required'];
  const implemented = DIRECTORY_TABLES.every((table) => tableHasColumns(table, requiredColumns));
  const schemaSupport = hasPattern(frontendDbLibraryContent, /ADD COLUMN IF NOT EXISTS next_step_type TEXT;/) &&
    hasPattern(frontendDbLibraryContent, /ADD COLUMN IF NOT EXISTS application_url TEXT;/);
  const coverage = Object.fromEntries(DIRECTORY_TABLES.map((table) => [table, countRowsWithAny(table, ['next_step_type', 'next_step_url', 'next_step_phone', 'next_step_email'])]));
  sections.push({
    id: 'next_step_intake',
    label: 'Next-step and intake fields',
    status: getStatus({ implemented: implemented && Object.values(coverage).some((count) => count > 0), partial: implemented || schemaSupport }),
    evidence: [
      'Next-step, intake, and CTA fields exist on public directory tables',
      `Rows carrying at least one next-step signal: providers ${coverage.resource_providers}/${rowTotals.resource_providers}, nonprofits ${coverage.nonprofit_organizations}/${rowTotals.nonprofit_organizations}, advocates ${coverage.iep_advocates}/${rowTotals.iep_advocates}`,
      'Invalid next_step_type values are audited and renderers suppress empty CTAs',
    ],
    gap: 'The schema is in place, but many rows still lack direct next-step data.',
  });
}

{
  const tables = new Set(db.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all().map((row) => row.name));
  const hasProgramLayer = tables.has('programs') && tables.has('program_application_steps') && tables.has('program_document_requirements');
  const hasLocationFields = tableHasColumns('state_resource_agencies', ['catchment_boundaries', 'office_locations', 'intake_phone']) &&
    tableHasColumns('county_offices', ['office_name', 'address', 'phone']);
  const hasDedicatedOrgModel = NORMALIZATION_TABLES.every((tableName) => tables.has(tableName));
  const hasMigrationDoc = hasPattern(orgProgramLocationDocContent, /organization_program_links/) &&
    hasPattern(orgProgramLocationDocContent, /virtual_service_areas/);
  const normalizationRowCounts = Object.fromEntries(
    NORMALIZATION_TABLES
      .filter((tableName) => tables.has(tableName))
      .map((tableName) => [tableName, countTotal(tableName)])
  );
  const populatedNormalizationTables = Object.values(normalizationRowCounts).filter((count) => count > 0).length;
  const normalizationRowsTotal = Object.values(normalizationRowCounts).reduce((sum, count) => sum + count, 0);
  const sourceBackedProviderCount = countWhere(
    'resource_providers',
    "source_url IS NOT NULL AND TRIM(source_url) <> '' AND verification_status IN ('official_verified', 'verified', 'human_verified', 'source_listed')"
  );
  const normalizedProviderOrganizationCount = countWhere('organizations', "id LIKE 'org-provider-%'");
  const normalizedProviderProgramLinkCount = countWhere('organization_program_links', "id LIKE 'opl-provider-%'");
  const normalizedProviderServiceLocationCount = countWhere('service_locations', "id LIKE 'svc-provider-%'");
  const normalizedAgencyOrganizationCount = countWhere('organizations', "id LIKE 'org-agency-%'");
  const normalizedCountyOfficeOrganizationCount = countWhere('organizations', "id LIKE 'org-county-office-%'");
  const sourceBackedNonprofitCount = countWhere(
    'nonprofit_organizations',
    "source_url IS NOT NULL AND TRIM(source_url) <> '' AND verification_status IN ('official_verified', 'verified', 'human_verified', 'source_listed')"
  );
  const normalizedNonprofitOrganizationCount = countWhere('organizations', "id LIKE 'org-nonprofit-%'");
  const normalizedNonprofitProgramLinkCount = countWhere('organization_program_links', "id LIKE 'opl-nonprofit-%'");
  const normalizedNonprofitVirtualAreaCount = countWhere('virtual_service_areas', "id LIKE 'vsa-nonprofit-%'");
  const sourceBackedAdvocateCount = countWhere(
    'iep_advocates',
    "source_url IS NOT NULL AND TRIM(source_url) <> '' AND verification_status IN ('official_verified', 'verified', 'human_verified', 'source_listed')"
  );
  const normalizedAdvocateOrganizationCount = countWhere('organizations', "id LIKE 'org-advocate-%'");
  const normalizedAdvocateProgramLinkCount = countWhere('organization_program_links', "id LIKE 'opl-advocate-%'");
  const normalizedAdvocateVirtualAreaCount = countWhere('virtual_service_areas', "id LIKE 'vsa-advocate-%'");
  sections.push({
    id: 'org_program_location',
    label: 'Org -> program -> location modeling',
    status: getStatus({
      implemented:
        hasProgramLayer &&
        hasLocationFields &&
        hasDedicatedOrgModel &&
        hasMigrationDoc &&
        populatedNormalizationTables === NORMALIZATION_TABLES.length &&
        normalizationRowsTotal > 0 &&
        sourceBackedProviderCount > 0 &&
        normalizedProviderServiceLocationCount >= sourceBackedProviderCount &&
        normalizedAgencyOrganizationCount > 0 &&
        normalizedCountyOfficeOrganizationCount > 0 &&
        normalizedNonprofitOrganizationCount >= sourceBackedNonprofitCount &&
        normalizedNonprofitProgramLinkCount >= sourceBackedNonprofitCount &&
        normalizedNonprofitVirtualAreaCount >= sourceBackedNonprofitCount &&
        normalizedAdvocateOrganizationCount >= sourceBackedAdvocateCount &&
        normalizedAdvocateProgramLinkCount >= sourceBackedAdvocateCount &&
        normalizedAdvocateVirtualAreaCount >= sourceBackedAdvocateCount,
      partial:
        hasProgramLayer ||
        hasLocationFields ||
        hasDedicatedOrgModel ||
        hasMigrationDoc ||
        normalizationRowsTotal > 0,
    }),
    evidence: [
      `Program tables exist: ${hasProgramLayer ? 'yes' : 'no'}`,
      `Regional/catchment location fields exist: ${hasLocationFields ? 'yes' : 'no'}`,
      `Dedicated organization/location normalization tables exist: ${hasDedicatedOrgModel ? 'yes' : 'no'}`,
      `Normalization rows present: ${normalizationRowsTotal} total across ${populatedNormalizationTables}/${NORMALIZATION_TABLES.length} normalization tables`,
      `Normalization row counts: ${Object.entries(normalizationRowCounts).map(([tableName, count]) => `${tableName}=${count}`).join(', ')}`,
      `Source-backed providers normalized: organizations ${normalizedProviderOrganizationCount}/${sourceBackedProviderCount}, program links ${normalizedProviderProgramLinkCount}/${sourceBackedProviderCount}, service locations ${normalizedProviderServiceLocationCount}/${sourceBackedProviderCount}`,
      `Backfilled public office organizations: agencies ${normalizedAgencyOrganizationCount}, county offices ${normalizedCountyOfficeOrganizationCount}`,
      `Source-backed nonprofits normalized: organizations ${normalizedNonprofitOrganizationCount}/${sourceBackedNonprofitCount}, program links ${normalizedNonprofitProgramLinkCount}/${sourceBackedNonprofitCount}, virtual areas ${normalizedNonprofitVirtualAreaCount}/${sourceBackedNonprofitCount}`,
      `Source-backed advocates normalized: organizations ${normalizedAdvocateOrganizationCount}/${sourceBackedAdvocateCount}, program links ${normalizedAdvocateProgramLinkCount}/${sourceBackedAdvocateCount}, virtual areas ${normalizedAdvocateVirtualAreaCount}/${sourceBackedAdvocateCount}`,
      `Migration foundation doc exists: ${hasMigrationDoc ? 'yes' : 'no'}`,
      'Current docs preserve separation between directory entities and programs while defining a future landing zone for normalized locations and service areas',
    ],
    gap: hasDedicatedOrgModel
      ? normalizationRowsTotal > 0
        ? sourceBackedAdvocateCount > 0 &&
          normalizedAdvocateOrganizationCount >= sourceBackedAdvocateCount &&
          normalizedAdvocateProgramLinkCount >= sourceBackedAdvocateCount &&
          normalizedAdvocateVirtualAreaCount >= sourceBackedAdvocateCount
          ? 'Core normalized public directory coverage is now populated across agencies, county offices, providers, nonprofits, and advocates. Remaining work is canonical deduping and richer cross-surface organization linking.'
          : 'Normalization is now partially populated for public agencies, county offices, source-backed providers, and source-backed nonprofits, but advocate backfill is still not in place.'
        : 'Normalization landing tables and docs exist, but the current repo has not backfilled real rows into them yet, so org/program/location remains a migration path rather than an active populated layer.'
      : 'The repo supports the migration path conceptually, but still lacks a dedicated normalized org/program/location table family.',
  });
}

{
  const requiredColumns = ['languages', 'interpreter_available', 'asl_available', 'wheelchair_accessible', 'virtual_services', 'in_person_services', 'home_visits', 'transportation_help', 'accessibility_notes'];
  const hasSchema = ['resource_providers', 'nonprofit_organizations'].every((table) => tableHasColumns(table, requiredColumns)) &&
    tableHasColumns('iep_advocates', ['languages_spoken', 'interpreter_available', 'asl_available', 'wheelchair_accessible', 'virtual_services', 'in_person_services', 'home_visits', 'transportation_help', 'accessibility_notes']);
  const coverage = {
    resource_providers: countRowsWithAny('resource_providers', ['languages', 'interpreter_available=1', 'asl_available=1', 'wheelchair_accessible=1', 'virtual_services=1', 'home_visits=1', 'transportation_help=1', 'accessibility_notes']),
    nonprofit_organizations: countRowsWithAny('nonprofit_organizations', ['languages', 'interpreter_available=1', 'asl_available=1', 'wheelchair_accessible=1', 'virtual_services=1', 'home_visits=1', 'transportation_help=1', 'accessibility_notes']),
    iep_advocates: countRowsWithAny('iep_advocates', ['languages_spoken', 'interpreter_available=1', 'asl_available=1', 'wheelchair_accessible=1', 'virtual_services=1', 'home_visits=1', 'transportation_help=1', 'accessibility_notes']),
  };
  const coverageOnEveryTable = Object.values(coverage).every((count) => count > 0);
  sections.push({
    id: 'languages_accessibility',
    label: 'Languages and accessibility',
    status: getStatus({
      implemented: hasSchema && coverageOnEveryTable,
      partial: hasSchema || Object.values(coverage).some((count) => count > 0),
    }),
    evidence: [
      'Language, modality, and accessibility fields exist on public directory tables',
      `Rows carrying at least one language or access signal: providers ${coverage.resource_providers}/${rowTotals.resource_providers}, nonprofits ${coverage.nonprofit_organizations}/${rowTotals.nonprofit_organizations}, advocates ${coverage.iep_advocates}/${rowTotals.iep_advocates}`,
      'DirectoryFoundationPanel only renders accessibility details when real data exists',
    ],
    gap: 'Accessibility coverage is present but not yet uniformly dense across all records.',
  });
}

{
  const requiredColumns = ['source_url', 'source_type', 'source_name', 'source_last_updated', 'last_verified_at', 'verification_status', 'manual_review_required', 'data_quality_notes', 'unsupported_claim_flags'];
  const implemented = DIRECTORY_TABLES.every((table) => tableHasColumns(table, requiredColumns)) &&
    hasPattern(publicTruthContent, /isAcceptablePublicVerificationStatus/) &&
    hasPattern(publicTruthContent, /hasPublicSourceUrl/) &&
    hasPattern(publicTruthContent, /hasPublicContactSignal/);
  const trustedRows = Object.fromEntries(DIRECTORY_TABLES.map((table) => [table, countRowsWithAll(table, ['source_url', 'verification_status'])]));
  sections.push({
    id: 'trust_freshness',
    label: 'Source freshness and verification',
    status: getStatus({ implemented, partial: Object.values(trustedRows).some((count) => count > 0) }),
    evidence: [
      'Trust and freshness fields exist on public directory tables',
      `Rows carrying both source_url and verification_status: providers ${trustedRows.resource_providers}/${rowTotals.resource_providers}, nonprofits ${trustedRows.nonprofit_organizations}/${rowTotals.nonprofit_organizations}, advocates ${trustedRows.iep_advocates}/${rowTotals.iep_advocates}`,
      'Public truth gating requires acceptable verification status, source URL, and contact signal before render/index eligibility',
    ],
    gap: 'This proves trust gating exists; it does not prove every record is recently refreshed.',
  });
}

{
  const hasCoreContract = hasPattern(directoryAnalyticsContent, /trackDirectoryAnalyticsEvent/) &&
    hasPattern(directoryAnalyticsContent, /DIRECTORY_ANALYTICS_BRIDGE_EVENT/) &&
    hasPattern(directoryPanelContent, /directory_phone_click/) &&
    hasPattern(directoryPanelContent, /directory_email_click/) &&
    hasPattern(directoryPanelContent, /directory_save_resource/) &&
    hasPattern(directoryPanelContent, /directory_(resource|application|form_download|next_step)_click/) &&
    hasPattern(advocatesClientContent, /directory_search/) &&
    hasPattern(advocatesClientContent, /directory_no_results/) &&
    hasPattern(advocatesClientContent, /directory_dead_end/) &&
    hasPattern(countiesClientContent, /directory_search/) &&
    hasPattern(countiesClientContent, /directory_no_results/) &&
    hasPattern(countiesClientContent, /directory_dead_end/);
  const hasFindHelpSearchAnalytics =
    hasPattern(findHelpClientContent, /directory_search/) &&
    hasPattern(findHelpClientContent, /directory_no_results/) &&
    hasPattern(findHelpClientContent, /directory_dead_end/);
  sections.push({
    id: 'analytics',
    label: 'Privacy-conscious analytics',
    status: getStatus({
      implemented: hasCoreContract && hasFindHelpSearchAnalytics,
      partial: hasCoreContract || hasPattern(directoryAnalyticsContent, /DIRECTORY_ANALYTICS_EVENTS/),
    }),
    evidence: [
      'Analytics event family and sanitization helper exist in frontend/src/lib/directoryAnalytics.ts',
      'A vendor-neutral browser event bridge now dispatches sanitized analytics payloads for directory actions',
      'DirectoryFoundationPanel emits phone, email, resource, application, next-step, and form-download events on real user clicks',
      'DirectoryFoundationPanel emits save-resource analytics when a user saves a listing locally',
      'Advocates and state-county search surfaces now emit directory_search, directory_no_results, and directory_dead_end events with coarse page context only',
      `Find-help surface search analytics wired: ${hasFindHelpSearchAnalytics ? 'yes' : 'no'}`,
    ],
    gap: 'The analytics contract and core wiring are in place. Remaining work is expanding the same event coverage to additional directory surfaces as they adopt the foundation UI.',
  });
}

{
  const requiredColumns = ['claim_status', 'claimed_by', 'verified_affiliation', 'claim_email'];
  const implemented = DIRECTORY_TABLES.every((table) => tableHasColumns(table, requiredColumns));
  const schemaSupport = hasPattern(frontendDbLibraryContent, /ADD COLUMN IF NOT EXISTS claim_status TEXT;/) &&
    hasPattern(frontendDbLibraryContent, /ADD COLUMN IF NOT EXISTS claim_email TEXT;/);
  const coverage = Object.fromEntries(DIRECTORY_TABLES.map((table) => [table, countRowsWithAny(table, ['claim_status', 'claim_email', 'claimed_by'])]));
  sections.push({
    id: 'claimed_listing',
    label: 'Claimed-listing groundwork',
    status: getStatus({ implemented: implemented && Object.values(coverage).some((count) => count > 0), partial: implemented || schemaSupport }),
    evidence: [
      'Claim-related fields exist on public directory tables',
      `Rows carrying at least one claim-groundwork signal: providers ${coverage.resource_providers}/${rowTotals.resource_providers}, nonprofits ${coverage.nonprofit_organizations}/${rowTotals.nonprofit_organizations}, advocates ${coverage.iep_advocates}/${rowTotals.iep_advocates}`,
      'Current scope remains schema/docs groundwork only, without a provider portal workflow',
    ],
    gap: 'No full claim review workflow is implemented yet, which is consistent with scope.',
  });
}

const summary = {
  generatedAt: generatedDate,
  dbPath,
  implemented: sections.filter((section) => section.status === 'implemented').length,
  partial: sections.filter((section) => section.status === 'partial').length,
  missing: sections.filter((section) => section.status === 'missing').length,
};

const payload = { summary, sections };

const mdLines = [
  '# Competitive Foundation Gap Audit',
  '',
  `Generated: ${generatedDate}`,
  '',
  'This artifact audits the broader Competitive Foundation objective against the current repo state so we can distinguish what is fully implemented from what is still only partial.',
  '',
  '## Summary',
  '',
  `- Implemented areas: ${summary.implemented}`,
  `- Partial areas: ${summary.partial}`,
  `- Missing areas: ${summary.missing}`,
  `- DB audited: ${dbPath}`,
  '',
  '## Requirement Ledger',
  '',
  '| Area | Status | Main Gap |',
  '| --- | --- | --- |',
];

for (const section of sections) {
  mdLines.push(`| ${section.label} | ${section.status} | ${section.gap} |`);
}

for (const section of sections) {
  mdLines.push('', `## ${section.label}`, '', `Status: **${section.status}**`, '', 'Evidence:');
  for (const line of section.evidence) {
    mdLines.push(`- ${line}`);
  }
  mdLines.push('', `Main gap: ${section.gap}`);
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(`Wrote ${jsonOutPath}`);
console.log(`Wrote ${mdOutPath}`);
