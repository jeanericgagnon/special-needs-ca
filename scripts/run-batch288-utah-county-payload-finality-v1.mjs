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
  batchSummary: path.join(generatedDir, 'batch288_utah_county_payload_finality_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch288-utah-county-payload-finality-report-v1.md'),
};

const PRIMARY_GAP_REASON =
  'official_usbe_district_lea_directory_clears_education_but_public_dws_office_api_only_materializes_26_of_29_physical_office_counties_and_still_lacks_county_service_area_contract';
const FAILURE_CODE =
  'public_dws_office_api_only_materializes_26_of_29_physical_office_counties_and_still_lacks_county_service_area_contract';
const NEXT_ACTION =
  'hold_blocked_until_public_office_api_or_successor_directory_exposes_county_or_service_area_assignments_for_missing_daggett_morgan_rich_counties';
const STATUS_REASON =
  'the official Utah DWS office-search app exposes a public API at `https://officesearch-api.jobs.utah.gov/api/v1/offices` and that API returns 99 public rows covering 45 unique offices with names, addresses, lat/lng, service codes, and assistance instructions. But the payload still exposes no county fields or counties-served fields, a bounded reverse-geocode audit only materializes physical offices in 26 of Utah\'s 29 counties, and one more payload-text audit confirms `Daggett` and `Morgan` never appear anywhere in the public JSON while `Rich` appears only as `Richfield`, not as Rich County routing.';
const COUNTY_EVIDENCE =
  'Reviewed 2026-06-23 one more bounded official Utah county-local pass on the same live public DWS office API. The official `GET https://officesearch-api.jobs.utah.gov/api/v1/offices` payload still returns 99 public rows covering 45 unique offices with office names, addresses, service codes, lat/lng, and assistance instructions, but still no county field, counties-served field, or reusable county-to-office contract. A bounded reverse-geocode audit of those exact official office coordinates still materializes physical offices in only 26 of Utah\'s 29 counties, leaving Daggett, Morgan, and Rich without even an in-county office point. One more payload-text audit now tightens that blocker further: `Daggett` and `Morgan` do not appear anywhere in the public JSON at all, `Rich` appears only inside `Richfield` office names rather than as Rich County routing, and the only literal `county` office-name tokens are `Emery County (Castle Dale)` and `South County (Taylorsville)`, which is far short of a statewide county contract.';
const LESSON_HEADING =
  '### County-Looking Office Names Still Do Not Create A Statewide County Contract';
const LESSON_BODY =
  '*   **Lesson:** If a live official office payload exposes only a few county-looking office names but still lacks county fields or counties-served fields, do not stretch those names into a statewide local-routing contract. Utah\'s public DWS JSON mentioned `Emery County` and `South County`, but `Daggett` and `Morgan` never appeared at all and `Rich` only appeared inside `Richfield`, so the payload still failed county-grade proof.';

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

function appendLessonIfMissing() {
  const current = fs.readFileSync(INPUTS.lessons, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(INPUTS.lessons, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
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
    '`county_local_disability_resources` is the only remaining Utah critical blocker. The live Utah Schools Directory still clears education, and the DWS office-search app exposes a public official API at `https://officesearch-api.jobs.utah.gov/api/v1/offices`, but that API still publishes only office inventory fields like office name, address, coordinates, service code, and assistance instructions. It does not expose county fields, counties served, or another reusable county-to-office contract. A bounded reverse-geocode pass still materializes physical offices in only 26 of Utah\'s 29 counties, leaving Daggett, Morgan, and Rich without even an in-county office point, and one more payload-text audit confirms `Daggett` and `Morgan` never appear anywhere in the public JSON while `Rich` appears only as `Richfield`, not as Rich County routing. Utah therefore remains BLOCKED and not index-safe.',
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

function buildBatchReport(batchSummary) {
  return [
    '# Batch 288 Utah County Payload Finality Report v1',
    '',
    `- state: ${batchSummary.state}`,
    `- classification: ${batchSummary.classification}`,
    `- blocker_family: ${batchSummary.remaining_blocker_family}`,
    `- blocker_code: ${batchSummary.failure_code}`,
    '',
    '## What was confirmed',
    '',
    '- Confirmed the official Utah DWS office-search host still exposes a live public office inventory API at `https://officesearch-api.jobs.utah.gov/api/v1/offices`.',
    '- Confirmed the payload still has no `county`, `countiesServed`, or similar service-area field.',
    '- Confirmed `Daggett` and `Morgan` do not appear anywhere in the public office JSON.',
    '- Confirmed `Rich` appears only inside `Richfield` office naming rather than Rich County routing.',
    '- Confirmed the only literal `county` office-name tokens in the public JSON are `Emery County (Castle Dale)` and `South County (Taylorsville)`, which is not a statewide county contract.',
    '',
    '## Why Utah remains blocked',
    '',
    '- The public office inventory still has no county field, counties-served field, or other reusable county-to-office service-area contract.',
    '- The missing-county remainder is still explicit: Daggett, Morgan, and Rich have no proven county-grade office assignment, and Daggett/Morgan are absent from the payload text entirely.',
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

export function generateBatch288UtahCountyPayloadFinalityV1() {
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
            evidence: COUNTY_EVIDENCE,
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
      ? { ...row, family_status: 'blocked_public_office_api_without_county_service_area_contract', status_reason: STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          failure_code: FAILURE_CODE,
          evidence: COUNTY_EVIDENCE,
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
          sample_count: 7,
          query_basis: 'Reviewed the current official DWS office-search bundle, public office API, companion services API, one bounded reverse-geocode county-coverage audit of the official office coordinates, and one bounded payload-text audit for missing county tokens.',
          blocker_code: FAILURE_CODE,
          blocker_evidence: 'The official public office API exposes 45 unique office records but still no county/service-area assignments. A bounded reverse-geocode pass only materializes physical offices in 26 of Utah\'s 29 counties, `Daggett` and `Morgan` never appear anywhere in the public JSON, and `Rich` appears only as `Richfield` office naming rather than Rich County routing.',
          samples: [
            {
              sample_name: 'Live DWS Office Search shell',
              source_url: 'https://jobs.utah.gov/office-search/',
              final_url: 'https://jobs.utah.gov/office-search/',
              verification_status: 'verified',
              source_type: 'official_office_search_shell',
              source_table: 'batch288_utah_county_payload_finality',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The official shell is live at `jobs.utah.gov/office-search/` and routes its map page through a resolver that calls `getOfficeDataFromApi()`.'
            },
            {
              sample_name: 'Legacy office-search alias',
              source_url: 'https://jobs.utah.gov/jsp/officesearch/',
              final_url: 'https://jobs.utah.gov/jsp/officesearch/',
              verification_status: 'verified',
              source_type: 'official_legacy_alias_same_shell',
              source_table: 'batch288_utah_county_payload_finality',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The older `jsp/officesearch` route still resolves to the same Office Search shell and does not add county-grade routing fields or county text.'
            },
            {
              sample_name: 'Public office inventory payload',
              source_url: 'https://officesearch-api.jobs.utah.gov/api/v1/offices',
              final_url: 'https://officesearch-api.jobs.utah.gov/api/v1/offices',
              verification_status: 'verified',
              source_type: 'official_public_api',
              source_table: 'batch288_utah_county_payload_finality',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The public payload returns 99 rows covering 45 unique offices with fields such as `officeName`, `address1`, `city`, `zipCode`, `serviceName`, `latitude`, and `longitude`, but no county or counties-served field.'
            },
            {
              sample_name: 'Public services API payload',
              source_url: 'https://officesearch-api.jobs.utah.gov/api/v1/services',
              final_url: 'https://officesearch-api.jobs.utah.gov/api/v1/services',
              verification_status: 'verified',
              source_type: 'official_public_api',
              source_table: 'batch288_utah_county_payload_finality',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The companion public services endpoint lists `All`, `USOR`, and `EC` service classes, but not county or service-area mappings.'
            },
            {
              sample_name: 'Reverse-geocoded physical office coverage audit',
              source_url: 'https://geocoding.geo.census.gov/geocoder/geographies/coordinates',
              final_url: 'https://geocoding.geo.census.gov/geocoder/geographies/coordinates',
              verification_status: 'verified',
              source_type: 'official_federal_geocoder_coverage_check',
              source_table: 'batch288_utah_county_payload_finality',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'A bounded reverse-geocode audit of the 45 unique official office coordinates only materializes physical offices in 26 Utah counties, leaving Daggett, Morgan, and Rich without even an in-county office point.'
            },
            {
              sample_name: 'Missing county token audit',
              source_url: 'https://officesearch-api.jobs.utah.gov/api/v1/offices',
              final_url: 'https://officesearch-api.jobs.utah.gov/api/v1/offices',
              verification_status: 'verified',
              source_type: 'official_payload_token_audit',
              source_table: 'batch288_utah_county_payload_finality',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'A bounded audit of the live public JSON finds no `Daggett` token and no `Morgan` token anywhere in the payload text.'
            },
            {
              sample_name: 'Rich token audit',
              source_url: 'https://officesearch-api.jobs.utah.gov/api/v1/offices',
              final_url: 'https://officesearch-api.jobs.utah.gov/api/v1/offices',
              verification_status: 'verified',
              source_type: 'official_payload_token_audit',
              source_table: 'batch288_utah_county_payload_finality',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The only `Rich` matches in the payload are `Richfield` office names, not Rich County routing; the only literal `county` office-name tokens are `Emery County` and `South County`.'
            }
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
          evidence: 'The public office inventory still lacks county/service-area assignments, reverse-geocodes into only 26 Utah counties, and the raw payload text contains no `Daggett` or `Morgan` token at all while `Rich` appears only as `Richfield` office naming.',
        }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonAdded = appendLessonIfMissing();
  updateHandoff();

  const batchSummary = {
    batch: 'batch288_utah_county_payload_finality_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'utah',
    classification: 'BLOCKED',
    index_safe: false,
    remaining_blocker_family: 'county_local_disability_resources',
    failure_code: FAILURE_CODE,
    physical_office_county_coverage: 26,
    state_county_total: 29,
    missing_physical_office_counties: ['Daggett County', 'Morgan County', 'Rich County'],
    exact_missing_payload_tokens: ['Daggett', 'Morgan'],
    ambiguous_payload_tokens: ['Richfield'],
    literal_county_name_rows: ['Emery County (Castle Dale)', 'South County (Taylorsville)'],
    next_action: NEXT_ACTION,
    lesson_added: lessonAdded,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport(batchSummary));

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch288UtahCountyPayloadFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
