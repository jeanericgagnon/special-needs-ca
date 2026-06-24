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
  allStateQueue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch297_utah_bundle_contract_refinement_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch297-utah-bundle-contract-refinement-report-v1.md'),
};

const PRIMARY_GAP_REASON =
  'official_usbe_district_lea_directory_clears_education_but_live_dws_bundle_only_supports_city_or_zip_search_and_public_office_api_still_lacks_county_service_area_contract';
const FAILURE_CODE =
  'live_dws_bundle_only_supports_city_or_zip_search_and_public_office_api_still_lacks_county_service_area_contract';
const NEXT_ACTION =
  'hold_blocked_until_public_utah_dws_successor_exposes_county_or_service_area_assignments_in_api_payload_or_reviewable_official_leaf';
const FAMILY_STATUS =
  'blocked_live_dws_bundle_city_zip_only_without_county_service_area_contract';
const STATUS_REASON =
  'The live official Utah DWS office-search app is now narrowed to its current first-party page and bundle contract. `https://jobs.utah.gov/office-search/` loads a public JS bundle whose config points to `https://officesearch-api.jobs.utah.gov`, whose resolver fetches `/api/v1/offices`, whose service cache fetches `/api/v1/services`, and whose optional `getOfficeServices()` call still points to `/api/v1/office-services`. But the public office payload still returns only office inventory fields like `officeName`, `address1`, `city`, `zipCode`, `serviceName`, `latitude`, and `longitude`, the public services payload still returns only service classes (`All`, `USOR`, `EC`), the exact `office-services` route still returns `404 Not Found`, and the bundle search logic still only filters by `city` or `zipCode` before falling back to nearest-office geocoding. Neither the page HTML nor the reviewed bundle carries a county field, counties-served field, county filter, or other reusable county-to-office contract, and a bounded reverse-geocode audit still materializes physical offices in only 26 of Utah\'s 29 counties while `Daggett` and `Morgan` never appear in the public JSON and `Rich` appears only inside `Richfield`.';
const COUNTY_EVIDENCE =
  'Reviewed 2026-06-23 one more bounded official Utah county-local pass on the exact live office-search page plus its first-party JS bundle and public API surfaces. `https://jobs.utah.gov/office-search/` still returns a live public shell, and the current app bundle (`main-NUCK4XJI.js` plus imported chunks) now makes the contract explicit: the config sets `apiUrl` to `https://officesearch-api.jobs.utah.gov`, `getOfficeDataFromApi()` calls `/api/v1/offices`, `getServicesList()` calls `/api/v1/services`, and `getOfficeServices()` still points to `/api/v1/office-services`. The search logic in the live bundle only filters office rows by `city` and then `zipCode`, and otherwise falls back to nearest-office geocoding; there is still no county filter, county field, or counties-served field in the page HTML or reviewed bundle text. The public office payload still returns 99 rows covering 45 unique offices with `officeName`, address, city, zip, service, and coordinate fields but no county or service-area assignment, the companion services endpoint still exposes only service classes (`All`, `USOR`, `EC`), and the exact `office-services` route still returns JSON `404 Not Found`. A bounded reverse-geocode audit of the exact official office coordinates still materializes physical offices in only 26 of Utah\'s 29 counties, leaving Daggett, Morgan, and Rich without even an in-county office point. One more payload-text audit confirms `Daggett` and `Morgan` never appear anywhere in the public JSON, `Rich` appears only inside `Richfield` office names, and there is still no public county-grade office contract.';

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
    '- Utah county-local routing remains the only critical blocker, and the live DWS office-search stack is now narrowed not just to the public APIs but to the current bundle contract itself.',
    '- The live office-search bundle explicitly sets `apiUrl` to `https://officesearch-api.jobs.utah.gov` and only calls `/api/v1/offices`, `/api/v1/services`, and `/api/v1/office-services`.',
    '- The reviewed bundle search logic only filters by `city` and then `zipCode`, and otherwise falls back to nearest-office geocoding. It does not expose a county filter, county field, or counties-served field.',
    '- The public office payload still returns office inventory and coordinates only, the services payload still returns only service classes, and the exact `office-services` route still returns `404`.',
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
    '`county_local_disability_resources` is the only remaining Utah critical blocker. The live Utah Schools Directory still clears education, and the DWS office-search lane is now bounded to a stricter first-party bundle contract rather than just a guessed API family. `https://jobs.utah.gov/office-search/` loads a public JS bundle whose config points to `https://officesearch-api.jobs.utah.gov`, whose resolver fetches `/api/v1/offices`, whose service cache fetches `/api/v1/services`, and whose optional `getOfficeServices()` hook still points to `/api/v1/office-services`. The live bundle search logic only filters office rows by `city` and then `zipCode`, then falls back to nearest-office geocoding; it still has no county filter, county field, or counties-served field in the page HTML or reviewed bundle text. The public office payload still returns only office inventory rows with fields like `officeName`, address, city, zip, service, and coordinates, the services payload still returns only service classes, the exact `office-services` route still returns JSON `404 Not Found`, and a bounded reverse-geocode pass still materializes physical offices in only 26 of Utah\'s 29 counties, leaving Daggett, Morgan, and Rich without even an in-county office point. One more payload-text audit confirms `Daggett` and `Morgan` never appear anywhere in the public JSON while `Rich` appears only as `Richfield`, not as Rich County routing. Utah therefore remains BLOCKED and not index-safe.',
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
    '- [Live DWS bundle entrypoint](https://jobs.utah.gov/office-search/main-NUCK4XJI.js)',
    '- [Live DWS bundle imported chunk](https://jobs.utah.gov/office-search/chunk-Y7CB7UTP.js)',
    '- [Public DWS office API](https://officesearch-api.jobs.utah.gov/api/v1/offices)',
    '- [Public DWS services API](https://officesearch-api.jobs.utah.gov/api/v1/services)',
    '- [Exact office-services route](https://officesearch-api.jobs.utah.gov/api/v1/office-services)',
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
  const oldNeedle = '- Utah county-local routing is now explicitly sharpened to the live DWS office API plus its exact failure surfaces: the office payload still lacks county/service-area fields, `office-services` and the docs probes return `404`, the older DWS roots return `500`, and the county remainder is still explicit at Daggett, Morgan, and Rich.';
  const newNeedle = '- Utah county-local routing is now explicitly sharpened to the live DWS bundle contract itself: the public page only wires `/api/v1/offices`, `/api/v1/services`, and a still-broken `/api/v1/office-services` route, the search logic is city/ZIP-only plus nearest-office geocoding, the payload still lacks county/service-area fields, and the county remainder is still explicit at Daggett, Morgan, and Rich.';
  if (current.includes(oldNeedle)) {
    current = current.replace(oldNeedle, newNeedle);
  } else if (!current.includes(newNeedle)) {
    current = `${current.trimEnd()}\n- Utah county-local routing is now explicitly sharpened to the live DWS bundle contract itself: the public page only wires \`/api/v1/offices\`, \`/api/v1/services\`, and a still-broken \`/api/v1/office-services\` route, the search logic is city/ZIP-only plus nearest-office geocoding, the payload still lacks county/service-area fields, and the county remainder is still explicit at Daggett, Morgan, and Rich.\n`;
  }
  fs.writeFileSync(INPUTS.allStateReport, current);
}

function updateLessonsLearned() {
  const lesson = [
    '### City-Or-ZIP Office Search Contracts Still Fail County-Grade Routing',
    '*   **Lesson:** If a live official office-search bundle only filters by city or ZIP and otherwise falls back to nearest-office geocoding, that is still not a county-grade routing contract even when the public API returns office rows and coordinates. Utah’s DWS app made the exact contract visible in the first-party JS bundle: it called `/api/v1/offices` and `/api/v1/services`, pointed at a broken `/api/v1/office-services` route, and never exposed county or counties-served fields.'
  ].join('\n');

  let current = fs.readFileSync(INPUTS.lessons, 'utf8');
  if (!current.includes('### City-Or-ZIP Office Search Contracts Still Fail County-Grade Routing')) {
    current = `${current.trimEnd()}\n\n${lesson}\n`;
    fs.writeFileSync(INPUTS.lessons, current);
  }
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 297 Utah Bundle Contract Refinement Report v1',
    '',
    `- state: ${batchSummary.state}`,
    `- classification: ${batchSummary.classification}`,
    `- blocker_family: ${batchSummary.remaining_blocker_family}`,
    `- blocker_code: ${batchSummary.failure_code}`,
    '',
    '## What was confirmed',
    '',
    '- Confirmed the live Utah office-search page loads a first-party bundle whose config sets `apiUrl` to `https://officesearch-api.jobs.utah.gov`.',
    '- Confirmed the bundle calls only `/api/v1/offices`, `/api/v1/services`, and a still-broken `/api/v1/office-services` route.',
    '- Confirmed the reviewed bundle search logic only filters office rows by `city` and then `zipCode`, then falls back to nearest-office geocoding.',
    '- Confirmed the public office payload still exposes no county field or counties-served field.',
    '- Confirmed the public services payload still exposes only service classes, not service-area mappings.',
    '- Confirmed the exact `office-services` route still returns `404 Not Found`.',
    '- Confirmed the county remainder is still explicit at Daggett, Morgan, and Rich.',
    '',
    '## Why Utah remains blocked',
    '',
    '- The live bundle contract itself proves the office-search lane is city/ZIP-oriented, not county-oriented.',
    '- The public API family still exposes no reusable county-to-office or counties-served mapping.',
    '- The missing-county remainder is still explicit and cannot be truthfully inferred from nearest-office search behavior.',
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

export function generateBatch297UtahBundleContractRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const allStateQueue = readJsonl(INPUTS.allStateQueue);
  const allStateAudit = readJson(INPUTS.allStateAudit);

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
      county_local_disability_resources: FAMILY_STATUS,
    },
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: FAMILY_STATUS, status_reason: STATUS_REASON }
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
      sample_count: 12,
      query_basis: 'Reviewed the current official DWS office-search shell, its first-party JS bundle contract, the public office API, the companion services API, the exact `office-services` failure route, one bounded reverse-geocode county-coverage audit of the official office coordinates, and one bounded payload-text audit for missing county tokens.',
      blocker_code: FAILURE_CODE,
      blocker_evidence: 'The live Utah office-search bundle itself proves the public contract is city/ZIP oriented. It sets `apiUrl` to `https://officesearch-api.jobs.utah.gov`, only calls `/api/v1/offices`, `/api/v1/services`, and a broken `/api/v1/office-services` route, and its search logic only filters by `city` and `zipCode` before nearest-office geocoding. The public payload still exposes no county/service-area assignments, a bounded reverse-geocode pass only materializes physical offices in 26 of Utah\'s 29 counties, `Daggett` and `Morgan` never appear anywhere in the public JSON, and `Rich` appears only as `Richfield` office naming rather than Rich County routing.',
      samples: [
        {
          sample_name: 'Live DWS Office Search shell',
          source_url: 'https://jobs.utah.gov/office-search/',
          final_url: 'https://jobs.utah.gov/office-search/',
          verification_status: 'verified',
          source_type: 'official_office_search_shell',
          source_table: 'batch297_utah_bundle_contract_refinement',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The official shell is still live at `jobs.utah.gov/office-search/`.'
        },
        {
          sample_name: 'Legacy office-search alias',
          source_url: 'https://jobs.utah.gov/jsp/officesearch/',
          final_url: 'https://jobs.utah.gov/office-search/',
          verification_status: 'verified',
          source_type: 'official_legacy_alias_same_shell',
          source_table: 'batch297_utah_bundle_contract_refinement',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The older `jsp/officesearch` route still resolves into the same live Office Search shell.'
        },
        {
          sample_name: 'Bundle config pins the public API host',
          source_url: 'https://jobs.utah.gov/office-search/chunk-Y7CB7UTP.js',
          final_url: 'https://jobs.utah.gov/office-search/chunk-Y7CB7UTP.js',
          verification_status: 'verified',
          source_type: 'official_bundle_contract',
          source_table: 'batch297_utah_bundle_contract_refinement',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The reviewed first-party bundle config sets `apiUrl:\"https://officesearch-api.jobs.utah.gov\"` on the current live host.'
        },
        {
          sample_name: 'Bundle resolver fetches only office inventory',
          source_url: 'https://jobs.utah.gov/office-search/chunk-Y7CB7UTP.js',
          final_url: 'https://jobs.utah.gov/office-search/chunk-Y7CB7UTP.js',
          verification_status: 'verified',
          source_type: 'official_bundle_contract',
          source_table: 'batch297_utah_bundle_contract_refinement',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The live bundle method `getOfficeDataFromApi()` calls `/api/v1/offices` and caches office inventory rows only.'
        },
        {
          sample_name: 'Bundle service cache fetches only service classes',
          source_url: 'https://jobs.utah.gov/office-search/chunk-Y7CB7UTP.js',
          final_url: 'https://jobs.utah.gov/office-search/chunk-Y7CB7UTP.js',
          verification_status: 'verified',
          source_type: 'official_bundle_contract',
          source_table: 'batch297_utah_bundle_contract_refinement',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The live bundle method `getServicesList()` calls `/api/v1/services`, which is the same public service-class lane already reviewed.'
        },
        {
          sample_name: 'Bundle still points to broken office-services route',
          source_url: 'https://jobs.utah.gov/office-search/chunk-Y7CB7UTP.js',
          final_url: 'https://jobs.utah.gov/office-search/chunk-Y7CB7UTP.js',
          verification_status: 'verified',
          source_type: 'official_bundle_contract',
          source_table: 'batch297_utah_bundle_contract_refinement',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The live bundle method `getOfficeServices()` still points to `/api/v1/office-services`, which remains an exact public `404 Not Found` route.'
        },
        {
          sample_name: 'Bundle search logic is city-or-ZIP only',
          source_url: 'https://jobs.utah.gov/office-search/chunk-Y7CB7UTP.js',
          final_url: 'https://jobs.utah.gov/office-search/chunk-Y7CB7UTP.js',
          verification_status: 'verified',
          source_type: 'official_bundle_contract',
          source_table: 'batch297_utah_bundle_contract_refinement',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The reviewed bundle search logic filters office rows first by `city.toLowerCase().includes(search)` and then by `zipCode`, then falls back to nearest-office geocoding rather than county assignment.'
        },
        {
          sample_name: 'Public office inventory payload',
          source_url: 'https://officesearch-api.jobs.utah.gov/api/v1/offices',
          final_url: 'https://officesearch-api.jobs.utah.gov/api/v1/offices',
          verification_status: 'verified',
          source_type: 'official_public_api',
          source_table: 'batch297_utah_bundle_contract_refinement',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The public payload returns 99 rows covering 45 unique offices with fields such as `officeName`, `address1`, `city`, `zipCode`, `serviceName`, `latitude`, and `longitude`, but no county or counties-served field.'
        },
        {
          sample_name: 'Public services API payload',
          source_url: 'https://officesearch-api.jobs.utah.gov/api/v1/services',
          final_url: 'https://officesearch-api.jobs.utah.gov/api/v1/services',
          verification_status: 'verified',
          source_type: 'official_public_api',
          source_table: 'batch297_utah_bundle_contract_refinement',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The companion public services endpoint lists only service classes like `All`, `USOR`, and `EC`, not county or service-area mappings.'
        },
        {
          sample_name: 'Exact office-services route now 404s',
          source_url: 'https://officesearch-api.jobs.utah.gov/api/v1/office-services',
          final_url: 'https://officesearch-api.jobs.utah.gov/api/v1/office-services',
          verification_status: 'verified',
          source_type: 'official_api_failure_probe',
          source_table: 'batch297_utah_bundle_contract_refinement',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The exact `office-services` route still returns an explicit JSON `404 Not Found` response.'
        },
        {
          sample_name: 'Reverse-geocoded physical office coverage audit',
          source_url: 'https://geocoding.geo.census.gov/geocoder/geographies/coordinates',
          final_url: 'https://geocoding.geo.census.gov/geocoder/geographies/coordinates',
          verification_status: 'verified',
          source_type: 'official_federal_geocoder_coverage_check',
          source_table: 'batch297_utah_bundle_contract_refinement',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'A bounded reverse-geocode audit of the 45 unique official office coordinates only materializes physical offices in 26 Utah counties, leaving Daggett, Morgan, and Rich without even an in-county office point.'
        },
        {
          sample_name: 'Missing county token audit',
          source_url: 'https://officesearch-api.jobs.utah.gov/api/v1/offices',
          final_url: 'https://officesearch-api.jobs.utah.gov/api/v1/offices',
          verification_status: 'verified',
          source_type: 'official_payload_token_audit',
          source_table: 'batch297_utah_bundle_contract_refinement',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'A bounded audit of the live public JSON finds no `Daggett` token and no `Morgan` token anywhere in the payload text, while `Rich` appears only as `Richfield`.'
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
          evidence: 'The live Utah DWS bundle only supports city/ZIP lookup plus nearest-office geocoding, its public API family still lacks county/service-area fields, `office-services` still 404s, and the county remainder is still explicit at Daggett, Morgan, and Rich.',
        }
      : row
  ));

  const updatedAllStateQueue = allStateQueue.map((row) => (
    row.state === 'utah'
      ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  const updatedAllStateAudit = {
    ...allStateAudit,
    lessonsUpdate: 'Added a new blocker lesson: city-or-ZIP office-search bundles still fail county-grade routing.',
    states: allStateAudit.states.map((row) => (
      row.stateId === 'utah'
        ? {
            ...row,
            familyStatuses: {
              ...row.familyStatuses,
              county_local_disability_resources: FAMILY_STATUS,
            },
            packetBatch: 'batch297_utah_bundle_contract_refinement_v1',
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
          }
        : row
    )),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  writeJsonl(INPUTS.allStateQueue, updatedAllStateQueue);
  writeJson(INPUTS.allStateAudit, updatedAllStateAudit);
  updateHandoff();
  updateAllStateReport();
  updateLessonsLearned();

  const batchSummary = {
    state: 'utah',
    classification: 'BLOCKED',
    index_safe: false,
    remaining_blocker_family: 'county_local_disability_resources',
    failure_code: FAILURE_CODE,
    bundle_api_url: 'https://officesearch-api.jobs.utah.gov',
    bundle_exact_routes: ['/api/v1/offices', '/api/v1/services', '/api/v1/office-services'],
    bundle_search_contract: ['city', 'zipCode', 'nearest-office geocoding fallback'],
    office_payload_rows: 99,
    unique_offices: 45,
    physical_office_county_coverage: 26,
    missing_physical_office_counties: ['Daggett County', 'Morgan County', 'Rich County'],
    exact_missing_payload_tokens: ['Daggett', 'Morgan'],
    ambiguous_payload_tokens: ['Richfield'],
    next_action: NEXT_ACTION,
    lessons_updated: true,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport(batchSummary));
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch297UtahBundleContractRefinementV1();
  console.log(JSON.stringify(result, null, 2));
}
