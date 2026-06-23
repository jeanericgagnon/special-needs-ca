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
  batchSummary: path.join(generatedDir, 'batch272_utah_public_office_api_refinement_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch272-utah-public-office-api-refinement-report-v1.md'),
};

const PRIMARY_GAP_REASON = 'official_usbe_district_lea_directory_clears_education_and_public_dws_office_api_still_lacks_county_service_area_contract';
const FAILURE_CODE = 'public_dws_office_api_exposes_office_inventory_but_no_county_or_service_area_contract';
const NEXT_ACTION = 'hold_blocked_until_public_office_api_or_successor_directory_exposes_county_or_service_area_assignments';
const STATUS_REASON = 'the official Utah DWS office-search app now exposes a public API at `https://officesearch-api.jobs.utah.gov/api/v1/offices` and that API returns 99 public rows covering 45 unique offices with names, addresses, lat/lng, service codes, and assistance instructions. But neither the API payload nor the current shell publishes county fields, counties served, or another reusable county-to-office contract, so county-grade local routing is still unverified.';
const LESSON_HEADING = '### A Public Office API Still Does Not Clear County-Grade Routing Without County Or Service-Area Fields';
const LESSON_BODY = '*   **Lesson:** A live official JSON API is stronger than a shell-only SPA, but it still does not clear county-local routing unless the payload itself exposes county assignments, counties served, or another explicit service-area contract. Utah\'s DWS `officesearch-api` returns 45 unique public office records with addresses and coordinates, yet it still lacks county/service-area fields, so the state remains blocked for county-grade proof.';

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
    '- Utah DWS county-local evidence is now stronger than a shell-only story because the live office-search bundle points to a public official API at `https://officesearch-api.jobs.utah.gov/api/v1/offices`.',
    '- That public API returns office inventory rows with office names, addresses, service codes, coordinates, and assistance instructions, but it still does not publish county fields, counties served, or another reusable county-to-office contract.',
    '- Utah therefore remains BLOCKED and not index-safe.',
  ].join('\n') + '\n';
}

function replaceSection(text, startHeading, endHeading, replacement) {
  const start = text.indexOf(startHeading);
  const end = text.indexOf(endHeading);
  if (start === -1 || end === -1 || end <= start) return text;
  return `${text.slice(0, start)}${replacement}${text.slice(end)}`;
}

function updateHandoff() {
  let current = fs.readFileSync(INPUTS.handoff, 'utf8');
  current = current.replace(
    '- Utah: `official_usbe_district_lea_directory_clears_education_and_live_dws_office_search_shell_still_lacks_public_county_office_contract`',
    '- Utah: `official_usbe_district_lea_directory_clears_education_and_public_dws_office_api_still_lacks_county_service_area_contract`'
  );

  const focusBlock = [
    '## Current Focus State: Utah',
    '',
    '### Blocker Reason',
    '',
    '`county_local_disability_resources` is the only remaining Utah critical blocker. The live Utah Schools Directory still clears education, and the DWS office-search app now exposes a public official API at `https://officesearch-api.jobs.utah.gov/api/v1/offices`, but that API still publishes only office inventory fields like office name, address, coordinates, service code, and assistance instructions. It does not expose county fields, counties served, or another reusable county-to-office contract, so Utah remains BLOCKED and not index-safe.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any first-party Utah county-complete office contract that explicitly maps counties to DWS, DHHS, or successor local offices.',
    '- Any public successor Utah office API field or companion endpoint that adds `county`, `countiesServed`, service-area, or district-style assignment data to the current office inventory.',
    '- Any official Utah county-owned or state-maintained human-services directory that preserves county routing more explicitly than the current office inventory API.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Utah Schools Directory](https://schools.utah.gov/schoolsdirectory)',
    '- [Utah DWS contact root](https://jobs.utah.gov/contact/index.html)',
    '- [Older DWS public contact page with Office Map link](https://jobs.utah.gov/department/contact/index.html)',
    '- [Live DWS Office Search shell](https://jobs.utah.gov/office-search/)',
    '- [Live DWS Office Search map route](https://jobs.utah.gov/office-search/map)',
    '- [Public DWS office API](https://officesearch-api.jobs.utah.gov/api/v1/offices)',
    '- [Public DWS services API](https://officesearch-api.jobs.utah.gov/api/v1/services)',
    '- [Older DWS services locations page](https://jobs.utah.gov/customereducation/serviceslocations.html)',
    '- [Utah DHHS contacts](https://dhhs.utah.gov/contacts/)',
    '- [Utah DHHS customer service](https://dhhs.utah.gov/customer-service/)',
    '- [Older DHHS locations route](https://dhhs.utah.gov/locations)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any public companion API or downloadable artifact on `officesearch-api.jobs.utah.gov` that adds county or service-area assignments to the 45 unique office records.',
    '- Any reviewed official Utah local-office directory that explicitly names counties served, especially where office names are city-based rather than county-based.',
    '- Any official Utah successor to the dead `serviceslocations.html` or `dhhs.utah.gov/locations` routes that exposes county-grade local-office coverage.',
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
      '5. South Carolina',
      '6. North Carolina',
      '7. New York',
      '8. Oklahoma',
      '9. Oregon',
      '10. Ohio',
    ].join('\n')
  );
  fs.writeFileSync(INPUTS.handoff, current);
}

function updateLessons() {
  const current = fs.readFileSync(INPUTS.lessons, 'utf8');
  if (current.includes(LESSON_HEADING)) return;
  fs.writeFileSync(INPUTS.lessons, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
}

export function generateBatch272UtahPublicOfficeApiRefinementV1() {
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
            evidence: 'Reviewed 2026-06-23 one more bounded official Utah county-local pass. The DWS office-search bundle now proves a public `apiUrl` of `https://officesearch-api.jobs.utah.gov`, and the live `GET https://officesearch-api.jobs.utah.gov/api/v1/offices` endpoint returns 99 public rows covering 45 unique offices with office names, addresses, service codes, lat/lng, and assistance instructions. But the payload still exposes no county field, counties-served field, or reusable county-to-office contract. The companion `GET /api/v1/services` endpoint is public, but `GET /api/v1/office-services` returns HTTP 404. The older DWS services locations page still returns HTTP 500, the older DHHS locations route still returns HTTP 404, and current DHHS contacts/customer-service pages still do not publish a county-grade office directory.',
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
          evidence: 'The public official DWS office API now returns 99 rows covering 45 unique offices with names, addresses, service codes, and coordinates, but it still does not publish county fields, counties served, or another reusable county-to-office contract. The companion `/api/v1/office-services` route is not available publicly and returns HTTP 404. The old DWS services locations page remains HTTP 500, the old DHHS locations route remains HTTP 404, and DHHS contact pages still do not expose county-grade office routing.',
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
          sample_count: 5,
          query_basis: 'Reviewed the current official DWS office-search bundle, public office API, companion services API, and current DHHS contact pages.',
          blocker_code: FAILURE_CODE,
          blocker_evidence: 'The official public office API exposes 45 unique office records but still no county/service-area assignments, so the state lacks a reusable county-grade office contract.',
          samples: [
            {
              sample_name: 'Live DWS Office Search shell',
              source_url: 'https://jobs.utah.gov/office-search/',
              final_url: 'https://jobs.utah.gov/office-search/',
              verification_status: 'verified',
              source_type: 'official_office_search_shell',
              source_table: 'batch272_utah_public_office_api_refinement',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The official shell is live at `jobs.utah.gov/office-search/` and routes its map page through a resolver that calls `getOfficeDataFromApi()`.'
            },
            {
              sample_name: 'Public office API contract',
              source_url: 'https://jobs.utah.gov/office-search/main-NUCK4XJI.js',
              final_url: 'https://jobs.utah.gov/office-search/main-NUCK4XJI.js',
              verification_status: 'verified',
              source_type: 'official_bundle_contract',
              source_table: 'batch272_utah_public_office_api_refinement',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The live bundle sets `apiUrl:\"https://officesearch-api.jobs.utah.gov\"`, and `getOfficeDataFromApi()` calls `GET /api/v1/offices`.'
            },
            {
              sample_name: 'Public office inventory payload',
              source_url: 'https://officesearch-api.jobs.utah.gov/api/v1/offices',
              final_url: 'https://officesearch-api.jobs.utah.gov/api/v1/offices',
              verification_status: 'verified',
              source_type: 'official_public_api',
              source_table: 'batch272_utah_public_office_api_refinement',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The public payload returns 99 rows covering 45 unique offices with fields such as `officeName`, `address1`, `city`, `zipCode`, `serviceName`, `latitude`, and `longitude`.'
            },
            {
              sample_name: 'Public services API payload',
              source_url: 'https://officesearch-api.jobs.utah.gov/api/v1/services',
              final_url: 'https://officesearch-api.jobs.utah.gov/api/v1/services',
              verification_status: 'verified',
              source_type: 'official_public_api',
              source_table: 'batch272_utah_public_office_api_refinement',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The companion public services endpoint lists `All`, `USOR`, and `EC` service classes, but not county or service-area mappings.'
            },
            {
              sample_name: 'Current DHHS contacts page',
              source_url: 'https://dhhs.utah.gov/contacts/',
              final_url: 'https://dhhs.utah.gov/contacts/',
              verification_status: 'verified',
              source_type: 'official_contacts_page',
              source_table: 'batch272_utah_public_office_api_refinement',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The current DHHS contacts page is live, but still does not publish county-grade office routing that could close the county-local contract.'
            }
          ]
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          failure_code: FAILURE_CODE,
          next_action: NEXT_ACTION,
          evidence: 'The official public DWS office API is live, but it still lacks county fields or service-area assignments, so Utah has office inventory but not county-grade office proof.',
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
  updateLessons();

  writeJson(OUTPUTS.batchSummary, {
    batch: 'batch272_utah_public_office_api_refinement_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'utah',
    classification: 'BLOCKED',
    index_safe: false,
    remaining_blocker_family: 'county_local_disability_resources',
    office_search_root: 'https://jobs.utah.gov/office-search/',
    office_api_root: 'https://officesearch-api.jobs.utah.gov/api/v1/offices',
    blocker_code: FAILURE_CODE,
  });

  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 272 Utah Public Office API Refinement Report v1',
      '',
      '- classification_after: BLOCKED',
      '- index_safe_after: false',
      `- primary_gap_reason_after: ${PRIMARY_GAP_REASON}`,
      '',
      '## What changed',
      '',
      '- Confirmed the Utah DWS office-search app has a live public API contract, not just a public shell.',
      '- Verified the office inventory endpoint returns 99 rows covering 45 unique offices with office names, addresses, service codes, and coordinates.',
      '- Kept Utah blocked because the API still does not publish county fields, counties served, or another reusable county-to-office contract.',
      '',
      '## Exact evidence',
      '',
      '- The live bundle `https://jobs.utah.gov/office-search/main-NUCK4XJI.js` sets `apiUrl:\"https://officesearch-api.jobs.utah.gov\"`.',
      '- The same bundle uses `getOfficeDataFromApi()` to call `GET /api/v1/offices`.',
      '- `https://officesearch-api.jobs.utah.gov/api/v1/offices` is publicly reachable and returns office rows with `officeName`, `address1`, `city`, `zipCode`, `serviceName`, `latitude`, and `longitude`.',
      '- The public payload still exposes no `county`, `countiesServed`, `serviceArea`, or equivalent county-assignment field.',
      '- `https://officesearch-api.jobs.utah.gov/api/v1/services` is public, but only enumerates service classes, and `GET /api/v1/office-services` returns HTTP 404.',
      '',
      '## Remaining blocker',
      '',
      '- `county_local_disability_resources` remains the sole critical blocker for Utah because the public office inventory still lacks county-grade assignment proof.',
    ].join('\n') + '\n'
  );

  return updatedSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch272UtahPublicOfficeApiRefinementV1();
  console.log(JSON.stringify(result, null, 2));
}
