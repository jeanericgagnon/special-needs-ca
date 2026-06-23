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
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch291_utah_live_surface_sync_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch291-utah-live-surface-sync-report-v1.md'),
};

const PRIMARY_GAP_REASON =
  'official_usbe_district_lea_directory_clears_education_but_public_dws_office_api_only_materializes_26_of_29_physical_office_counties_and_still_lacks_county_service_area_contract';
const FAILURE_CODE =
  'public_dws_office_api_only_materializes_26_of_29_physical_office_counties_and_still_lacks_county_service_area_contract';
const NEXT_ACTION =
  'hold_blocked_until_public_office_api_or_successor_directory_exposes_county_or_service_area_assignments_for_missing_daggett_morgan_rich_counties';
const STATUS_REASON =
  'the live official Utah DWS office-search stack still exposes a public office inventory API at `https://officesearch-api.jobs.utah.gov/api/v1/offices`, and that payload still returns 99 rows covering 45 unique offices with fields like `officeName`, `address1`, `city`, `zipCode`, `serviceName`, `latitude`, and `longitude`. But there is still no county field, counties-served field, or other reusable county-to-office contract, the companion `services` endpoint still exposes only service classes, the guessed `office-services` route now returns `404`, the docs surfaces (`openapi.json`, `swagger-ui/index.html`, and `v3/api-docs`) now return `404 Service Not Found`, the older DWS roots (`jobs.utah.gov/sitemap.xml` and `jobs.utah.gov/customereducation/serviceslocations.html`) now return `500`, `dhhs.utah.gov/locations` now returns `404`, and a bounded reverse-geocode audit still materializes physical offices in only 26 of Utah\'s 29 counties while `Daggett` and `Morgan` never appear in the payload and `Rich` appears only as `Richfield`.';
const COUNTY_EVIDENCE =
  'Reviewed 2026-06-23 one more bounded official Utah county-local pass on the current live DWS office-search surfaces. `https://jobs.utah.gov/office-search/` and the older `https://jobs.utah.gov/jsp/officesearch/` alias both still land on the live Office Search shell, and `GET https://officesearch-api.jobs.utah.gov/api/v1/offices` still returns 99 public rows covering 45 unique offices with `officeName`, address, city, zip, service, and coordinate fields but no county or counties-served field. The companion `GET https://officesearch-api.jobs.utah.gov/api/v1/services` endpoint still exposes only service classes (`All`, `USOR`, `EC`), while the guessed `GET https://officesearch-api.jobs.utah.gov/api/v1/office-services` route now returns an explicit JSON `404 Not Found` and the docs probes (`/openapi.json`, `/swagger-ui/index.html`, `/v3/api-docs`) now return `404 Service Not Found`. The older public roots also still add no successor county contract: `jobs.utah.gov/sitemap.xml` and `jobs.utah.gov/customereducation/serviceslocations.html` now return `500 Internal Server Error`, and `dhhs.utah.gov/locations` returns `404`. A bounded reverse-geocode audit of the exact official office coordinates still materializes physical offices in only 26 of Utah\'s 29 counties, leaving Daggett, Morgan, and Rich without even an in-county office point. One more payload-text audit confirms `Daggett` and `Morgan` never appear anywhere in the public JSON, `Rich` appears only inside `Richfield` office names, and the only literal county-looking office names are `Emery County (Castle Dale)` and `South County (Taylorsville)`, which is still far short of a statewide county contract.';

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
    '- Utah county-local routing remains the only critical blocker and the live official DWS office-search stack is now narrowed to today’s exact public surfaces rather than an assumed successor lane.',
    '- The live public office API still returns office inventory rows and service classes only. It does not publish county fields, counties served, or another reusable county-to-office contract.',
    '- The guessed `office-services` route and all probed docs surfaces now fail explicitly with `404`, which strengthens the finding that no public self-describing county contract is exposed on the current API host.',
    '- The older public roots also still fail to supply a successor county contract: `jobs.utah.gov/sitemap.xml` and `jobs.utah.gov/customereducation/serviceslocations.html` now return `500`, while `dhhs.utah.gov/locations` returns `404`.',
    '- A bounded official reverse-geocode audit of the 45 unique office coordinates still only materializes physical offices in 26 of Utah\'s 29 counties, leaving Daggett, Morgan, and Rich without even an in-county office point.',
    '- One more bounded payload-text audit also confirmed `Daggett` and `Morgan` never appear anywhere in the public office JSON, while `Rich` appears only as `Richfield` office naming rather than Rich County routing.',
    '- Utah therefore remains BLOCKED and not index-safe.',
  ].join('\n') + '\n';
}

function updateHandoff() {
  let current = fs.readFileSync(INPUTS.handoff, 'utf8');

  const focusBlock = [
    '## Current Focus State: Utah',
    '',
    '### Blocker Reason',
    '',
    '`county_local_disability_resources` is the only remaining Utah critical blocker. The live Utah Schools Directory still clears education, and the DWS office-search stack is now bounded to a precise public surface: `https://jobs.utah.gov/office-search/`, the older `jsp/officesearch` alias, `https://officesearch-api.jobs.utah.gov/api/v1/offices`, and `https://officesearch-api.jobs.utah.gov/api/v1/services`. The office payload still returns only office inventory rows with fields like `officeName`, address, city, zip, service, and coordinates; it still has no county fields, counties served, or another reusable county-to-office contract. The guessed `office-services` route now returns JSON `404 Not Found`, the docs probes (`openapi.json`, `swagger-ui/index.html`, and `v3/api-docs`) now return `404 Service Not Found`, and the older public roots still do not expose a successor county contract (`jobs.utah.gov/sitemap.xml` and `jobs.utah.gov/customereducation/serviceslocations.html` return `500`, while `dhhs.utah.gov/locations` returns `404`). A bounded reverse-geocode pass still materializes physical offices in only 26 of Utah\'s 29 counties, leaving Daggett, Morgan, and Rich without even an in-county office point, and one more payload-text audit confirms `Daggett` and `Morgan` never appear anywhere in the public JSON while `Rich` appears only as `Richfield`, not as Rich County routing. Utah therefore remains BLOCKED and not index-safe.',
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
    '- [Legacy DWS office-search alias](https://jobs.utah.gov/jsp/officesearch/)',
    '- [Live DWS Office Search shell](https://jobs.utah.gov/office-search/)',
    '- [Public DWS office API](https://officesearch-api.jobs.utah.gov/api/v1/offices)',
    '- [Public DWS services API](https://officesearch-api.jobs.utah.gov/api/v1/services)',
    '- [Guessed office-services route](https://officesearch-api.jobs.utah.gov/api/v1/office-services)',
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
      '3. Florida',
      '4. Alaska',
      '5. New York',
      '6. Oklahoma',
      '7. Oregon',
      '8. Ohio',
      '9. Minnesota',
      '10. Maine',
    ].join('\n')
  );

  fs.writeFileSync(INPUTS.handoff, current);
}

function updateAllStateReport() {
  let current = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const oldLine = '- Florida county-local routing is now explicitly sharpened to the partial Family Resource Center contract plus the public MyACCESS dataexchangeproxy shell lane, not a hidden anonymous API.';
  const newLine = '- Utah county-local routing is now explicitly sharpened to the live DWS office API plus its exact failure surfaces: the office payload still lacks county/service-area fields, `office-services` and the docs probes return `404`, the older DWS roots return `500`, and the county remainder is still explicit at Daggett, Morgan, and Rich.';
  if (current.includes(oldLine)) {
    current = current.replace(oldLine, newLine);
  } else if (!current.includes(newLine)) {
    current = `${current.trimEnd()}\n- Utah county-local routing is now explicitly sharpened to the live DWS office API plus its exact failure surfaces: the office payload still lacks county/service-area fields, \`office-services\` and the docs probes return \`404\`, the older DWS roots return \`500\`, and the county remainder is still explicit at Daggett, Morgan, and Rich.\n`;
  }
  fs.writeFileSync(INPUTS.allStateReport, current);
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 291 Utah Live Surface Sync Report v1',
    '',
    `- state: ${batchSummary.state}`,
    `- classification: ${batchSummary.classification}`,
    `- blocker_family: ${batchSummary.remaining_blocker_family}`,
    `- blocker_code: ${batchSummary.failure_code}`,
    '',
    '## What was confirmed',
    '',
    '- Confirmed the official Utah DWS office-search host still exposes a live public office inventory API at `https://officesearch-api.jobs.utah.gov/api/v1/offices`.',
    '- Confirmed the public office payload still returns 99 rows across 45 unique offices and still has no county field or counties-served field.',
    '- Confirmed the companion public services endpoint still exposes only service classes, not service-area mappings.',
    '- Confirmed the guessed `office-services` route now returns an explicit JSON `404 Not Found` response.',
    '- Confirmed the probed docs surfaces (`openapi.json`, `swagger-ui/index.html`, and `v3/api-docs`) now return `404 Service Not Found`.',
    '- Confirmed the older public roots also still do not expose a successor contract: `jobs.utah.gov/sitemap.xml` and `jobs.utah.gov/customereducation/serviceslocations.html` now return `500`, while `dhhs.utah.gov/locations` returns `404`.',
    '- Confirmed `Daggett` and `Morgan` do not appear anywhere in the public office JSON and `Rich` appears only inside `Richfield` office names.',
    '',
    '## Why Utah remains blocked',
    '',
    '- The public office inventory still has no county field, counties-served field, or other reusable county-to-office service-area contract.',
    '- The exact API and older public roots now fail cleanly enough to prove there is still no public self-describing county contract on the current reviewed Utah stack.',
    '- The missing-county remainder is still explicit: Daggett, Morgan, and Rich have no proven county-grade office assignment.',
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

export function generateBatch291UtahLiveSurfaceSyncV1() {
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
        ? { ...blocker, failure_code: FAILURE_CODE, evidence: COUNTY_EVIDENCE, next_action: NEXT_ACTION }
        : blocker
    )),
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      county_local_disability_resources: 'blocked_public_office_api_without_county_service_area_contract',
    },
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: 'blocked_public_office_api_without_county_service_area_contract', status_reason: STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, evidence: COUNTY_EVIDENCE, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    return {
      ...row,
      family_status: 'legacy_state_grade',
      sample_count: 10,
      query_basis: 'Reviewed the current official DWS office-search shell, public office API, companion services API, exact failure responses on guessed docs/service routes, one bounded reverse-geocode county-coverage audit of the official office coordinates, and one bounded payload-text audit for missing county tokens.',
      blocker_code: FAILURE_CODE,
      blocker_evidence: 'The official public office API still exposes 45 unique office records but still no county/service-area assignments. The guessed `office-services` route and the docs probes now fail explicitly with `404`, the older public roots now return `500`/`404`, a bounded reverse-geocode pass only materializes physical offices in 26 of Utah\'s 29 counties, `Daggett` and `Morgan` never appear anywhere in the public JSON, and `Rich` appears only as `Richfield` office naming rather than Rich County routing.',
      samples: [
        {
          sample_name: 'Live DWS Office Search shell',
          source_url: 'https://jobs.utah.gov/office-search/',
          final_url: 'https://jobs.utah.gov/office-search/',
          verification_status: 'verified',
          source_type: 'official_office_search_shell',
          source_table: 'batch291_utah_live_surface_sync',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The official shell is still live at `jobs.utah.gov/office-search/`.'
        },
        {
          sample_name: 'Legacy office-search alias',
          source_url: 'https://jobs.utah.gov/jsp/officesearch/',
          final_url: 'https://jobs.utah.gov/office-search/',
          verification_status: 'verified',
          source_type: 'official_legacy_alias_same_shell',
          source_table: 'batch291_utah_live_surface_sync',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The older `jsp/officesearch` route still resolves into the same live Office Search shell.'
        },
        {
          sample_name: 'Public office inventory payload',
          source_url: 'https://officesearch-api.jobs.utah.gov/api/v1/offices',
          final_url: 'https://officesearch-api.jobs.utah.gov/api/v1/offices',
          verification_status: 'verified',
          source_type: 'official_public_api',
          source_table: 'batch291_utah_live_surface_sync',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The public payload returns 99 rows covering 45 unique offices with fields such as `officeName`, `address1`, `city`, `zipCode`, `serviceName`, `latitude`, and `longitude`, but no county or counties-served field.'
        },
        {
          sample_name: 'Public services API payload',
          source_url: 'https://officesearch-api.jobs.utah.gov/api/v1/services',
          final_url: 'https://officesearch-api.jobs.utah.gov/api/v1/services',
          verification_status: 'verified',
          source_type: 'official_public_api',
          source_table: 'batch291_utah_live_surface_sync',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The companion public services endpoint lists only service classes like `All`, `USOR`, and `EC`, not county or service-area mappings.'
        },
        {
          sample_name: 'Guessed office-services route now 404s',
          source_url: 'https://officesearch-api.jobs.utah.gov/api/v1/office-services',
          final_url: 'https://officesearch-api.jobs.utah.gov/api/v1/office-services',
          verification_status: 'verified',
          source_type: 'official_api_failure_probe',
          source_table: 'batch291_utah_live_surface_sync',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The guessed `office-services` route now returns an explicit JSON `404 Not Found` response.'
        },
        {
          sample_name: 'API docs probes now 404',
          source_url: 'https://officesearch-api.jobs.utah.gov/openapi.json',
          final_url: 'https://officesearch-api.jobs.utah.gov/openapi.json',
          verification_status: 'verified',
          source_type: 'official_api_failure_probe',
          source_table: 'batch291_utah_live_surface_sync',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The probed docs surfaces (`openapi.json`, `swagger-ui/index.html`, and `v3/api-docs`) now return `404 Service Not Found`.'
        },
        {
          sample_name: 'Older DWS roots now 500',
          source_url: 'https://jobs.utah.gov/sitemap.xml',
          final_url: 'https://jobs.utah.gov/sitemap.xml',
          verification_status: 'verified',
          source_type: 'official_root_failure_probe',
          source_table: 'batch291_utah_live_surface_sync',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'Both `jobs.utah.gov/sitemap.xml` and `jobs.utah.gov/customereducation/serviceslocations.html` now return `500 Internal Server Error` and do not expose a successor county contract.'
        },
        {
          sample_name: 'Older DHHS locations route now 404',
          source_url: 'https://dhhs.utah.gov/locations',
          final_url: 'https://dhhs.utah.gov/locations',
          verification_status: 'verified',
          source_type: 'official_root_failure_probe',
          source_table: 'batch291_utah_live_surface_sync',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The older `dhhs.utah.gov/locations` route now returns `404` and does not add a county-grade local-office contract.'
        },
        {
          sample_name: 'Reverse-geocoded physical office coverage audit',
          source_url: 'https://geocoding.geo.census.gov/geocoder/geographies/coordinates',
          final_url: 'https://geocoding.geo.census.gov/geocoder/geographies/coordinates',
          verification_status: 'verified',
          source_type: 'official_federal_geocoder_coverage_check',
          source_table: 'batch291_utah_live_surface_sync',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'A bounded reverse-geocode audit of the 45 unique official office coordinates only materializes physical offices in 26 Utah counties, leaving Daggett, Morgan, and Rich without even an in-county office point.'
        },
        {
          sample_name: 'Missing county token audit',
          source_url: 'https://officesearch-api.jobs.utah.gov/api/v1/offices',
          final_url: 'https://officesearch-api.jobs.utah.gov/api/v1/offices',
          verification_status: 'verified',
          source_type: 'official_payload_token_audit',
          source_table: 'batch291_utah_live_surface_sync',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'A bounded audit of the live public JSON finds no `Daggett` token and no `Morgan` token anywhere in the payload text, while `Rich` appears only as `Richfield` and the only county-looking office names are `Emery County (Castle Dale)` and `South County (Taylorsville)`.'
        }
      ]
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          failure_code: FAILURE_CODE,
          next_action: NEXT_ACTION,
          evidence: 'The live Utah DWS office API still has no county/service-area field, `office-services` and the docs probes now 404, the older DWS roots now 500/404, no `Daggett` or `Morgan` token appears in the public JSON, and `Rich` only appears inside `Richfield` office naming rather than Rich County routing.',
        }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  updateHandoff();
  updateAllStateReport();

  const batchSummary = {
    state: 'utah',
    classification: 'BLOCKED',
    index_safe: false,
    remaining_blocker_family: 'county_local_disability_resources',
    failure_code: FAILURE_CODE,
    office_payload_rows: 99,
    unique_offices: 45,
    physical_office_county_coverage: 26,
    missing_physical_office_counties: ['Daggett County', 'Morgan County', 'Rich County'],
    docs_probe_statuses: {
      office_services: 404,
      openapi_json: 404,
      swagger_ui_index: 404,
      v3_api_docs: 404,
    },
    legacy_root_statuses: {
      jobs_sitemap_xml: 500,
      jobs_serviceslocations_html: 500,
      dhhs_locations: 404,
    },
    exact_missing_payload_tokens: ['Daggett', 'Morgan'],
    ambiguous_payload_tokens: ['Richfield'],
    literal_county_name_rows: ['Emery County (Castle Dale)', 'South County (Taylorsville)'],
    next_action: NEXT_ACTION,
    lessons_updated: false,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport(batchSummary));
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch291UtahLiveSurfaceSyncV1();
  console.log(JSON.stringify(result, null, 2));
}
