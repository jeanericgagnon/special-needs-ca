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
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch273_utah_api_surface_finality_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch273-utah-api-surface-finality-report-v1.md'),
};

const PRIMARY_GAP_REASON =
  'official_usbe_district_lea_directory_clears_education_and_public_dws_office_api_still_lacks_county_service_area_contract';
const FAILURE_CODE =
  'public_dws_office_api_exposes_office_inventory_but_no_county_or_service_area_contract';
const NEXT_ACTION =
  'hold_blocked_until_public_office_api_or_successor_directory_exposes_county_or_service_area_assignments';
const STATUS_REASON =
  'the official Utah DWS office-search app now exposes a public API at `https://officesearch-api.jobs.utah.gov/api/v1/offices` and that API returns 99 public rows covering 45 unique offices with names, addresses, lat/lng, service codes, and assistance instructions. But neither the API payload nor the current shell publishes county fields, counties served, or another reusable county-to-office contract, and one more bounded public-surface pass confirmed no public OpenAPI/Swagger docs or sitemap-exposed successor endpoint fills that gap.';

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
    '- Utah DWS county-local evidence is now stronger than a shell-only story because the live office-search bundle points to a public official API at `https://officesearch-api.jobs.utah.gov/api/v1/offices`.',
    '- That public API returns office inventory rows with office names, addresses, service codes, coordinates, and assistance instructions, but it still does not publish county fields, counties served, or another reusable county-to-office contract.',
    '- One more bounded public-surface pass also confirmed `openapi.json`, `swagger-ui/index.html`, and `v3/api-docs` return 404 on the official API host, `jobs.utah.gov/sitemap.xml` returns an error page, and the shell exposes no other public county/service-area contract.',
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
    '`county_local_disability_resources` is the only remaining Utah critical blocker. The live Utah Schools Directory still clears education, and the DWS office-search app exposes a public official API at `https://officesearch-api.jobs.utah.gov/api/v1/offices`, but that API still publishes only office inventory fields like office name, address, coordinates, service code, and assistance instructions. It does not expose county fields, counties served, or another reusable county-to-office contract, so Utah remains BLOCKED and not index-safe.',
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
    '- [Public DWS office API](https://officesearch-api.jobs.utah.gov/api/v1/offices)',
    '- [Public DWS services API](https://officesearch-api.jobs.utah.gov/api/v1/services)',
    '- [Public DWS office-services route](https://officesearch-api.jobs.utah.gov/api/v1/office-services)',
    '- [API OpenAPI endpoint attempt](https://officesearch-api.jobs.utah.gov/openapi.json)',
    '- [API Swagger UI attempt](https://officesearch-api.jobs.utah.gov/swagger-ui/index.html)',
    '- [API v3 docs attempt](https://officesearch-api.jobs.utah.gov/v3/api-docs)',
    '- [jobs.utah.gov robots.txt](https://jobs.utah.gov/robots.txt)',
    '- [jobs.utah.gov sitemap.xml](https://jobs.utah.gov/sitemap.xml)',
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

function buildBatchReport(batchSummary) {
  return [
    '# Batch 273 Utah API Surface Finality Report v1',
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
    '',
    '## Why Utah remains blocked',
    '',
    '- The public office inventory still has no county field, counties-served field, or other reusable county-to-office service-area contract.',
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

export function generateBatch273UtahApiSurfaceFinalityV1() {
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
            evidence: 'Reviewed 2026-06-23 one more bounded official Utah county-local pass. The DWS office-search bundle still proves a public `apiUrl` of `https://officesearch-api.jobs.utah.gov`, and the live `GET https://officesearch-api.jobs.utah.gov/api/v1/offices` endpoint still returns 99 public rows covering 45 unique offices with office names, addresses, service codes, lat/lng, and assistance instructions. But the payload still exposes no county field, counties-served field, or reusable county-to-office contract. The companion `GET /api/v1/services` endpoint is public, but `GET /api/v1/office-services` returns HTTP 404. One more bounded public-surface pass also confirmed `openapi.json`, `swagger-ui/index.html`, and `v3/api-docs` all return HTTP 404 on the official API host, while `jobs.utah.gov/sitemap.xml` still returns an error page instead of a usable successor sitemap.',
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
          evidence: 'The public official DWS office API still returns 99 rows covering 45 unique offices with names, addresses, service codes, and coordinates, but it still does not publish county fields, counties served, or another reusable county-to-office contract. The companion `/api/v1/office-services` route is not available publicly and returns HTTP 404. The official API host also returns HTTP 404 for `openapi.json`, `swagger-ui/index.html`, and `v3/api-docs`, while `jobs.utah.gov/sitemap.xml` still returns an error page instead of a usable successor sitemap.',
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
          query_basis: 'Reviewed the current official DWS office-search bundle, public office API, companion services API, and one more bounded official API-surface check for OpenAPI/Swagger/sitemap successors.',
          blocker_code: FAILURE_CODE,
          blocker_evidence: 'The official public office API exposes 45 unique office records but still no county/service-area assignments, and the official API host exposes no public OpenAPI/Swagger docs or sitemap-backed successor endpoint that closes that gap.',
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          failure_code: FAILURE_CODE,
          next_action: NEXT_ACTION,
          evidence: 'The official public DWS office API is live, but it still lacks county fields or service-area assignments, and one more bounded public-surface pass found no public OpenAPI/Swagger or sitemap successor that adds them.',
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

  const batchSummary = {
    state: 'utah',
    classification: 'BLOCKED',
    remaining_blocker_family: 'county_local_disability_resources',
    failure_code: FAILURE_CODE,
    next_action: NEXT_ACTION,
    confirmed_live_urls: [
      'https://jobs.utah.gov/office-search/',
      'https://officesearch-api.jobs.utah.gov/api/v1/offices',
      'https://officesearch-api.jobs.utah.gov/api/v1/services',
      'https://jobs.utah.gov/robots.txt',
    ],
    confirmed_missing_or_error_urls: [
      'https://officesearch-api.jobs.utah.gov/api/v1/office-services',
      'https://officesearch-api.jobs.utah.gov/openapi.json',
      'https://officesearch-api.jobs.utah.gov/swagger-ui/index.html',
      'https://officesearch-api.jobs.utah.gov/v3/api-docs',
      'https://jobs.utah.gov/sitemap.xml',
    ],
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport(batchSummary));
  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateBatch273UtahApiSurfaceFinalityV1();
  console.log('Generated batch273 Utah API surface finality artifacts.');
}
