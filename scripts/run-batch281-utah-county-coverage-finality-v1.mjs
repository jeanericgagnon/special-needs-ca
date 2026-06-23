import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'utah_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'utah_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'utah_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'utah_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'utah_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'utah-california-grade-audit-report-v2.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch281_utah_county_coverage_finality_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch281-utah-county-coverage-finality-report-v1.md'),
};

const PRIMARY_GAP_REASON =
  'official_usbe_district_lea_directory_clears_education_but_public_dws_office_api_only_materializes_26_of_29_physical_office_counties_and_still_lacks_county_service_area_contract';
const FAILURE_CODE =
  'public_dws_office_api_only_materializes_26_of_29_physical_office_counties_and_still_lacks_county_service_area_contract';
const NEXT_ACTION =
  'hold_blocked_until_public_office_api_or_successor_directory_exposes_county_or_service_area_assignments_for_missing_daggett_morgan_rich_counties';
const STATUS_REASON =
  'the official Utah DWS office-search app exposes a public API at `https://officesearch-api.jobs.utah.gov/api/v1/offices` and that API returns 99 public rows covering 45 unique offices with names, addresses, lat/lng, service codes, and assistance instructions. But the payload still exposes no county fields or counties-served fields, and a bounded official reverse-geocode audit of those exact office coordinates only materializes physical offices in 26 of Utah\'s 29 counties, leaving Daggett, Morgan, and Rich without even an in-county office point before any service-area assignment can be proven.';
const LESSON_HEADING =
  '### Reverse-Geocoded Office Points Can Sharpen A County-Local Blocker Without Faking Service Areas';
const LESSON_BODY =
  '*   **Lesson:** If a live official office API gives exact coordinates but no county or service-area field, one bounded official/federal reverse-geocode pass can still sharpen the blocker truthfully. Utah\'s DWS office inventory geocoded into only 26 of 29 counties, which proved the family was blocked both because service-area assignments were missing and because Daggett, Morgan, and Rich lacked even an in-county office point.';

const MISSING_COUNTIES = ['Daggett County', 'Morgan County', 'Rich County'];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeJsonl(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${rows.map((row) => JSON.stringify(row)).join('\n')}${rows.length ? '\n' : ''}`);
}

function replaceSection(text, startHeading, endHeading, replacement) {
  const start = text.indexOf(startHeading);
  const end = text.indexOf(endHeading);
  if (start === -1 || end === -1 || end <= start) return text;
  return `${text.slice(0, start)}${replacement}${text.slice(end)}`;
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Utah California-Grade Audit Report v2',
    '',
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe ? 'true' : 'false'}`,
    `- completeness_pct: ${summary.completeness_pct}`,
    `- county_count: ${summary.county_count}`,
    `- primary_gap_reason: ${summary.primary_gap_reason}`,
    '',
    '## Family status',
    '',
    ...gapRows.map((row) => `- ${row.family}: ${row.family_status} (${row.status_reason})`),
    '',
    '## Failure ledger',
    '',
    ...failureRows.map((row) => `- ${row.family}: ${row.failure_code} :: ${row.evidence}`),
    '',
    '## Verified source samples',
    '',
    ...verifiedRows.map((row) => `- ${row.family}: ${row.family_status}; samples=${row.sample_count}${row.samples?.[0]?.source_url ? `; first=${row.samples[0].source_url}` : ''}`),
    '',
    '## Next actions',
    '',
    ...nextRows.map((row) => `- [${row.severity}] ${row.family}: ${row.next_action}`),
    '',
    '## Completion decision',
    '',
    '- Utah still keeps the education repair from the live Utah Schools Directory.',
    '- Utah DWS county-local evidence is stronger than a shell-only story because the live office-search bundle points to a public official API at `https://officesearch-api.jobs.utah.gov/api/v1/offices`.',
    '- That public API returns office inventory rows with office names, addresses, service codes, coordinates, and assistance instructions, but it still does not publish county fields, counties served, or another reusable county-to-office contract.',
    '- A bounded official reverse-geocode audit of the 45 unique office coordinates only materializes physical offices in 26 of Utah\'s 29 counties, leaving Daggett, Morgan, and Rich without even an in-county office point.',
    '- One more bounded public-surface pass also confirmed `openapi.json`, `swagger-ui/index.html`, and `v3/api-docs` return 404 on the official API host, `jobs.utah.gov/sitemap.xml` returns an error page, and the shell exposes no other public county/service-area contract.',
    '- Utah therefore remains BLOCKED and not index-safe.',
  ].join('\n') + '\n';
}

function updateHandoff() {
  let current = fs.readFileSync(INPUTS.handoff, 'utf8');
  current = current.replace(
    '- Utah: `official_usbe_district_lea_directory_clears_education_and_public_dws_office_api_still_lacks_county_service_area_contract`',
    '- Utah: `official_usbe_district_lea_directory_clears_education_but_public_dws_office_api_only_materializes_26_of_29_physical_office_counties_and_still_lacks_county_service_area_contract`'
  );

  const focusBlock = [
    '## Current Focus State: Utah',
    '',
    '### Blocker Reason',
    '',
    '`county_local_disability_resources` is the only remaining Utah critical blocker. The live Utah Schools Directory still clears education, and the DWS office-search app exposes a public official API at `https://officesearch-api.jobs.utah.gov/api/v1/offices`, but that API still publishes only office inventory fields like office name, address, coordinates, service code, and assistance instructions. It does not expose county fields, counties served, or another reusable county-to-office contract. A bounded reverse-geocode pass on the 45 unique official office coordinates also materializes physical offices in only 26 of Utah\'s 29 counties, leaving Daggett, Morgan, and Rich without even an in-county office point. Utah therefore remains BLOCKED and not index-safe.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any first-party Utah county-complete office contract that explicitly maps counties to DWS, DHHS, or successor local offices.',
    '- Any public successor Utah office API field or companion endpoint that adds `county`, `countiesServed`, service-area, or district-style assignment data to the current office inventory.',
    '- Any official Utah successor local-office directory that explicitly closes the Daggett, Morgan, and Rich county remainder without inferred nearest-office routing.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Utah Schools Directory](https://schools.utah.gov/schoolsdirectory)',
    '- [Utah DWS contact root](https://jobs.utah.gov/contact/index.html)',
    '- [Older DWS public contact page with Office Map link](https://jobs.utah.gov/department/contact/index.html)',
    '- [Live DWS Office Search shell](https://jobs.utah.gov/office-search/)',
    '- [Public DWS office API](https://officesearch-api.jobs.utah.gov/api/v1/offices)',
    '- [Public DWS services API](https://officesearch-api.jobs.utah.gov/api/v1/services)',
    '- [Public DWS office-services route](https://officesearch-api.jobs.utah.gov/api/v1/office-services)',
    '- [API OpenAPI endpoint attempt](https://officesearch-api.jobs.utah.gov/openapi.json)',
    '- [API Swagger UI attempt](https://officesearch-api.jobs.utah.gov/swagger-ui/index.html)',
    '- [API v3 docs attempt](https://officesearch-api.jobs.utah.gov/v3/api-docs)',
    '- [jobs.utah.gov sitemap.xml](https://jobs.utah.gov/sitemap.xml)',
    '- [Older DWS services locations page](https://jobs.utah.gov/customereducation/serviceslocations.html)',
    '- [Utah DHHS contacts](https://dhhs.utah.gov/contacts/)',
    '- [Utah DHHS customer service](https://dhhs.utah.gov/customer-service/)',
    '- [Older DHHS locations route](https://dhhs.utah.gov/locations)',
    '- [Census reverse geocoder used only to county-key official office coordinates](https://geocoding.geo.census.gov/geocoder/geographies/coordinates)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any public companion API or downloadable artifact on `officesearch-api.jobs.utah.gov` that adds county or service-area assignments to the 45 unique office records.',
    '- Any reviewed official Utah local-office directory that explicitly names counties served, especially where office names are city-based rather than county-based.',
    '- Any official Utah successor to the dead `serviceslocations.html` or `dhhs.utah.gov/locations` routes that exposes county-grade local-office coverage for Daggett, Morgan, and Rich.',
    '',
  ].join('\n');

  current = replaceSection(current, '## Current Focus State:', '## Next State Order After', focusBlock);
  current = current.replace(
    /## Next State Order After[^\n]*\n\n(?:\d+\..*\n){1,12}/,
    [
      '## Next State Order After Utah',
      '',
      '1. Kansas',
      '2. Nebraska',
      '3. Nevada',
      '4. Florida',
      '5. Alaska',
      '6. South Carolina',
      '7. North Carolina',
      '8. New York',
      '9. Oklahoma',
      '10. Oregon',
    ].join('\n')
  );
  fs.writeFileSync(INPUTS.handoff, current);
}

function updateLessons() {
  const current = fs.readFileSync(INPUTS.lessons, 'utf8');
  if (current.includes(LESSON_HEADING)) return;
  fs.writeFileSync(INPUTS.lessons, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 281 Utah County Coverage Finality Report v1',
    '',
    `- state: ${batchSummary.state}`,
    `- classification: ${batchSummary.classification}`,
    `- blocker_family: ${batchSummary.remaining_blocker_family}`,
    `- blocker_code: ${batchSummary.failure_code}`,
    '',
    '## What was confirmed',
    '',
    '- Confirmed the official Utah DWS office-search host still exposes a live public office inventory API at `https://officesearch-api.jobs.utah.gov/api/v1/offices`.',
    '- Confirmed the companion public services API is live at `https://officesearch-api.jobs.utah.gov/api/v1/services`.',
    '- Confirmed `https://officesearch-api.jobs.utah.gov/api/v1/office-services` returns HTTP 404.',
    '- Confirmed the official API host does not expose public OpenAPI/Swagger docs at `openapi.json`, `swagger-ui/index.html`, or `v3/api-docs`.',
    '- Confirmed `https://jobs.utah.gov/sitemap.xml` still returns an error page instead of a usable public sitemap for successor office discovery.',
    '- Confirmed a bounded reverse-geocode audit of the 45 unique official office coordinates only materializes physical offices in 26 of Utah\'s 29 counties.',
    '',
    '## Why Utah remains blocked',
    '',
    '- The public office inventory still has no county field, counties-served field, or other reusable county-to-office service-area contract.',
    `- Even the physical-office fallback is incomplete: ${MISSING_COUNTIES.join(', ')} still have no in-county office point in the official API payload.`,
    '- No additional public API-docs surface or sitemap-exposed successor leaf was available to close that county-grade gap in this bounded official pass.',
    '',
    '## Exact blocker',
    '',
    `- ${batchSummary.failure_code}`,
    '',
    '## Next action',
    '',
    `- ${batchSummary.next_action}`,
    '',
  ].join('\n') + '\n';
}

export function generateBatch281UtahCountyCoverageFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((blocker) => (
      blocker.family === 'county_local_disability_resources'
        ? {
            ...blocker,
            failure_code: FAILURE_CODE,
            evidence: 'Reviewed 2026-06-23 one more bounded official Utah county-local pass. The DWS office-search bundle still proves a public `apiUrl` of `https://officesearch-api.jobs.utah.gov`, and the live `GET https://officesearch-api.jobs.utah.gov/api/v1/offices` endpoint still returns 99 public rows covering 45 unique offices with office names, addresses, service codes, lat/lng, and assistance instructions. But the payload still exposes no county field, counties-served field, or reusable county-to-office contract. A bounded reverse-geocode audit of those exact official office coordinates only materializes physical offices in 26 of Utah\'s 29 counties, leaving Daggett, Morgan, and Rich without even an in-county office point. The companion `GET /api/v1/services` endpoint is public, but `GET /api/v1/office-services` returns HTTP 404. One more bounded public-surface pass also confirmed `openapi.json`, `swagger-ui/index.html`, and `v3/api-docs` all return HTTP 404 on the official API host, while `jobs.utah.gov/sitemap.xml` still returns an error page instead of a usable successor sitemap.',
            next_action: NEXT_ACTION,
          }
        : blocker
    )),
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      county_local_disability_resources: 'blocked_public_office_api_without_county_service_area_contract',
    },
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, status_reason: STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          failure_code: FAILURE_CODE,
          evidence: 'The public official DWS office API still returns 99 rows covering 45 unique offices with names, addresses, service codes, and coordinates, but it still does not publish county fields, counties served, or another reusable county-to-office contract. A bounded reverse-geocode audit of those exact office coordinates only materializes physical offices in 26 of Utah\'s 29 counties, leaving Daggett, Morgan, and Rich without even an in-county office point. The companion `/api/v1/office-services` route is not available publicly and returns HTTP 404. The official API host also returns HTTP 404 for `openapi.json`, `swagger-ui/index.html`, and `v3/api-docs`, while `jobs.utah.gov/sitemap.xml` still returns an error page instead of a usable successor sitemap.',
          next_action: NEXT_ACTION,
        }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: 'legacy_state_grade',
          evidence_strength: 'medium',
          sample_count: 6,
          query_basis: 'Reviewed the current official DWS office-search bundle, public office API, companion services API, current DHHS contact pages, and one bounded reverse-geocode county-coverage audit of the official office coordinates.',
          blocker_code: FAILURE_CODE,
          blocker_evidence: 'The official public office API exposes 45 unique office records but still no county/service-area assignments, and a bounded reverse-geocode pass only materializes physical offices in 26 of Utah\'s 29 counties, leaving Daggett, Morgan, and Rich without even an in-county office point.',
          samples: [
            {
              sample_name: 'Live DWS Office Search shell',
              source_url: 'https://jobs.utah.gov/office-search/',
              final_url: 'https://jobs.utah.gov/office-search/',
              verification_status: 'verified',
              source_type: 'official_office_search_shell',
              source_table: 'batch281_utah_county_coverage_finality',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The official shell is live at `jobs.utah.gov/office-search/` and routes its map page through a resolver that calls `getOfficeDataFromApi()`.'
            },
            {
              sample_name: 'Public office API contract',
              source_url: 'https://jobs.utah.gov/office-search/main-NUCK4XJI.js',
              final_url: 'https://jobs.utah.gov/office-search/main-NUCK4XJI.js',
              verification_status: 'verified',
              source_type: 'official_bundle_contract',
              source_table: 'batch281_utah_county_coverage_finality',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The live bundle sets `apiUrl:\"https://officesearch-api.jobs.utah.gov\"`, and `getOfficeDataFromApi()` calls `GET /api/v1/offices`.'
            },
            {
              sample_name: 'Public office inventory payload',
              source_url: 'https://officesearch-api.jobs.utah.gov/api/v1/offices',
              final_url: 'https://officesearch-api.jobs.utah.gov/api/v1/offices',
              verification_status: 'verified',
              source_type: 'official_public_api',
              source_table: 'batch281_utah_county_coverage_finality',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The public payload returns 99 rows covering 45 unique offices with fields such as `officeName`, `address1`, `city`, `zipCode`, `serviceName`, `latitude`, and `longitude`.'
            },
            {
              sample_name: 'Public services API payload',
              source_url: 'https://officesearch-api.jobs.utah.gov/api/v1/services',
              final_url: 'https://officesearch-api.jobs.utah.gov/api/v1/services',
              verification_status: 'verified',
              source_type: 'official_public_api',
              source_table: 'batch281_utah_county_coverage_finality',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The companion public services endpoint lists `All`, `USOR`, and `EC` service classes, but not county or service-area mappings.'
            },
            {
              sample_name: 'Current DHHS contacts page',
              source_url: 'https://dhhs.utah.gov/contacts/',
              final_url: 'https://dhhs.utah.gov/contacts/',
              verification_status: 'verified',
              source_type: 'official_contacts_page',
              source_table: 'batch281_utah_county_coverage_finality',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The current DHHS contacts page is live, but still does not publish county-grade office routing that could close the county-local contract.'
            },
            {
              sample_name: 'Reverse-geocoded physical office coverage audit',
              source_url: 'https://geocoding.geo.census.gov/geocoder/geographies/coordinates',
              final_url: 'https://geocoding.geo.census.gov/geocoder/geographies/coordinates',
              verification_status: 'verified',
              source_type: 'official_federal_geocoder_coverage_check',
              source_table: 'batch281_utah_county_coverage_finality',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'A bounded reverse-geocode audit of the 45 unique official office coordinates only materializes physical offices in 26 Utah counties, leaving Daggett, Morgan, and Rich without even an in-county office point.'
            },
          ],
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          failure_code: FAILURE_CODE,
          next_action: NEXT_ACTION,
          evidence: 'The official public DWS office API is live, but it still lacks county/service-area assignments and a bounded reverse-geocode pass only materializes physical offices in 26 of Utah\'s 29 counties, leaving Daggett, Morgan, and Rich without even an in-county office point.'
        }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const batchSummary = {
    batch: 'batch281_utah_county_coverage_finality_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'utah',
    classification: 'BLOCKED',
    index_safe: false,
    remaining_blocker_family: 'county_local_disability_resources',
    failure_code: FAILURE_CODE,
    office_api_root: 'https://officesearch-api.jobs.utah.gov/api/v1/offices',
    physical_office_county_coverage: 26,
    state_county_total: 29,
    missing_physical_office_counties: MISSING_COUNTIES,
    confirmed_missing_or_error_urls: [
      'https://officesearch-api.jobs.utah.gov/api/v1/office-services',
      'https://officesearch-api.jobs.utah.gov/openapi.json',
      'https://officesearch-api.jobs.utah.gov/swagger-ui/index.html',
      'https://officesearch-api.jobs.utah.gov/v3/api-docs',
      'https://jobs.utah.gov/sitemap.xml',
      'https://jobs.utah.gov/customereducation/serviceslocations.html',
      'https://dhhs.utah.gov/locations',
    ],
    next_action: NEXT_ACTION,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport(batchSummary));
  updateHandoff();
  updateLessons();
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch281UtahCountyCoverageFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
