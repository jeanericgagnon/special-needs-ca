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
  allStateQueue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch312_utah_live_county_contract_refresh_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch312-utah-live-county-contract-refresh-report-v1.md'),
};

const PRIMARY_GAP_REASON =
  'utah_dhhs_contacts_now_serves_cloudflare_403_while_live_dws_office_inventory_and_sparse_county_named_labels_still_fail_to_expose_complete_county_service_area_contract';
const FAILURE_CODE =
  'utah_dhhs_contacts_now_serves_cloudflare_403_while_live_dws_office_inventory_and_sparse_county_named_labels_still_fail_to_expose_complete_county_service_area_contract';
const NEXT_ACTION =
  'hold_blocked_until_public_utah_successor_directory_api_or_reviewable_leaf_explicitly_maps_all_counties_to_local_disability_resource_offices';
const FAMILY_STATUS =
  'blocked_utah_dhhs_cloudflare_plus_dws_sparse_county_named_inventory_without_complete_county_service_area_contract';
const STATUS_REASON =
  'The live official Utah Schools Directory still clears education, but Utah county-local routing remains blocked in the current repo-side lane. `https://dhhs.utah.gov/contacts/` now serves a Cloudflare `403 Attention Required` shell instead of a reviewable public county-contact surface. The surviving live Utah office lane is still the Department of Workforce Services stack: `jobs.utah.gov/department/contact/index.html` still points users to an `Office Map`, the redirected `jobs.utah.gov/office-search/` shell is still live, and the public `https://officesearch-api.jobs.utah.gov/api/v1/offices` payload still returns office inventory rows. But that payload still exposes no `county`, `countiesServed`, or equivalent service-area field, and only two unique office names carry county-like labels (`Emery County (Castle Dale)` and `South County (Taylorsville)`) out of 45 unique offices. Utah therefore still has no complete public county-grade disability-resource office contract.';
const COUNTY_EVIDENCE =
  'Reviewed 2026-06-23 one more bounded official Utah county-local pass from the repo-side lane. `https://dhhs.utah.gov/contacts/` now returns HTTP 403 with a Cloudflare `Attention Required` shell, so the former DHHS contacts text is no longer reviewable as a live county-contact source in this lane. The surviving official local-office path remains the DWS family: `https://jobs.utah.gov/department/contact/index.html` still links users to an online `Office Map`, the legacy `/jsp/officesearch/` alias still routes into the live `https://jobs.utah.gov/office-search/` app, `https://jobs.utah.gov/robots.txt` stays public at 200, while `https://jobs.utah.gov/sitemap.xml` and `https://jobs.utah.gov/search/search.html?q=office` both return 500 error shells instead of usable successor discovery. The live `https://officesearch-api.jobs.utah.gov/api/v1/offices` payload still returns 99 rows covering 45 unique offices with inventory fields like `officeName`, address, city, ZIP, coordinates, serviceName, and instructions, but it still exposes no `county`, `countiesServed`, or equivalent service-area field. A bounded payload audit finds only two unique county-like office labels in the entire public inventory: `Emery County (Castle Dale)` and `South County (Taylorsville)`. Those sparse labels do not provide a complete 29-county mapping or a reusable county-to-office contract, so Utah still has no reviewable official county-grade disability-resource office contract.';
const LESSON_HEADING = '### Sparse County-Named Office Labels Still Do Not Create A Statewide County-Service Contract';
const LESSON_BODY =
  '*   **Lesson:** If a public office inventory only exposes a few office names with county-like labels but still lacks explicit `county` or `countiesServed` fields, do not treat those labels as a statewide county-routing contract. Utah’s live DWS office API still exposed only two unique county-like office names (`Emery County (Castle Dale)` and `South County (Taylorsville)`) across 45 unique offices, which was not enough to prove a complete 29-county disability-resource mapping.';

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

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
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
    '- Utah county-local routing remains the only critical blocker.',
    '- The former DHHS contacts surface is no longer reviewable in the repo-side lane because it now serves a Cloudflare 403 challenge shell.',
    '- The surviving official local-office lane is still the DWS office stack, but its public office payload remains inventory-only and still lacks `county` or `countiesServed` fields.',
    '- Sparse office labels like `Emery County (Castle Dale)` and `South County (Taylorsville)` are not enough to prove a complete 29-county disability-resource contract.',
    '- Utah therefore still lacks a complete public county-to-office disability-resource mapping and remains BLOCKED / not index-safe.',
  ].join('\n') + '\n';
}

function updateHandoff() {
  let current = fs.readFileSync(INPUTS.handoff, 'utf8');
  current = current
    .split('\n')
    .map((line) => (line.startsWith('- Utah: `') ? `- Utah: \`${PRIMARY_GAP_REASON}\`` : line))
    .join('\n');

  const focusBlock = [
    '## Current Focus State: Utah',
    '',
    '### Blocker Reason',
    '',
    '`county_local_disability_resources` is the only remaining Utah critical blocker. The live Utah Schools Directory still clears education, but the current repo-side lane now sees `https://dhhs.utah.gov/contacts/` as a Cloudflare 403 challenge rather than a reviewable public county-contact page. The surviving official Utah office lane is still the DWS stack: `jobs.utah.gov/department/contact/index.html` still points to an `Office Map`, the redirected `jobs.utah.gov/office-search/` shell is still live, and the public office API still returns office inventory rows. But that payload still has no `county`, `countiesServed`, or equivalent service-area field, and only two unique office names carry county-like labels (`Emery County (Castle Dale)` and `South County (Taylorsville)`) out of 45 unique offices. Utah therefore remains BLOCKED and not index-safe.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any public Utah successor directory, export, or leaf set that explicitly maps all 29 counties to local DWS, DHHS, or disability-resource offices.',
    '- Any reviewable DHHS successor child route that materializes county-local disability office assignments without challenge gating.',
    '- Any public office API field or companion endpoint that adds `county`, `countiesServed`, or equivalent service-area assignments to the current Utah office inventory.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Utah Schools Directory](https://schools.utah.gov/schoolsdirectory)',
    '- [Utah DHHS Contacts](https://dhhs.utah.gov/contacts/)',
    '- [Utah DWS contact root](https://jobs.utah.gov/contact/index.html)',
    '- [Older DWS public contact page with Office Map link](https://jobs.utah.gov/department/contact/index.html)',
    '- [Legacy DWS office-search alias](https://jobs.utah.gov/jsp/officesearch/)',
    '- [Live DWS Office Search shell](https://jobs.utah.gov/office-search/)',
    '- [Public DWS office API](https://officesearch-api.jobs.utah.gov/api/v1/offices)',
    '- [Public DWS services API](https://officesearch-api.jobs.utah.gov/api/v1/services)',
    '- [Jobs robots.txt](https://jobs.utah.gov/robots.txt)',
    '- [Jobs sitemap.xml](https://jobs.utah.gov/sitemap.xml)',
    '- [Jobs office search query](https://jobs.utah.gov/search/search.html?q=office)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any public Utah successor leaf or export that materially maps counties to local offices rather than just publishing office inventory.',
    '- Any public companion API artifact that adds `county` or service-area assignments to the current DWS office inventory.',
    '- Any reviewable official DHHS local-office surface that becomes available without Cloudflare challenge gating.',
    '',
  ].join('\n');

  current = replaceSection(current, '## Current Focus State:', '## Next State Order After', focusBlock);
  current = current.replace(
    /## Next State Order After[\s\S]*$/,
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
      '',
    ].join('\n')
  );

  fs.writeFileSync(INPUTS.handoff, current);
}

function updateAllStateReport() {
  let current = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const oldNeedles = [
    '- Utah county-local routing is now explicitly sharpened past the statewide shells: the DHHS contacts page mentions a county-click service map but still exposes no county office assignments and tells users to visit division/program pages for local office information, while the DWS office-search stack remains city/ZIP-only and still lacks county/service-area fields.',
    '- Utah county-local routing is now explicitly sharpened to the live DWS bundle contract itself: the public page only wires `/api/v1/offices`, `/api/v1/services`, and a still-broken `/api/v1/office-services` route, the search logic is city/ZIP-only plus nearest-office geocoding, the payload still lacks county/service-area fields, and the county remainder is still explicit at Daggett, Morgan, and Rich.',
  ];
  const newNeedle = '- Utah county-local routing is now explicitly sharpened to the current live repo-side contract: `dhhs.utah.gov/contacts/` serves a Cloudflare 403 challenge, while the surviving DWS office stack still exposes only inventory rows and a few sparse county-like office labels without a complete 29-county service-area contract.';
  for (const oldNeedle of oldNeedles) {
    if (current.includes(oldNeedle)) current = current.replace(oldNeedle, newNeedle);
  }
  if (!current.includes(newNeedle)) {
    current = `${current.trimEnd()}\n${newNeedle}\n`;
  }
  fs.writeFileSync(INPUTS.allStateReport, current);
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 312 Utah Live County Contract Refresh v1',
    '',
    '- state: Utah',
    `- classification: ${batchSummary.classification}`,
    `- blocker_family: ${batchSummary.remaining_blocker_family}`,
    '',
    '## What was confirmed',
    '',
    '- Confirmed the current repo-side lane now sees `https://dhhs.utah.gov/contacts/` as a Cloudflare `403 Attention Required` shell.',
    '- Confirmed `jobs.utah.gov/department/contact/index.html` still links users to an online `Office Map` route.',
    '- Confirmed the surviving `jobs.utah.gov/office-search/` stack is still live and the public office API still returns inventory rows.',
    '- Confirmed the office payload still has no `county` or `countiesServed` field.',
    '- Confirmed only two unique office names carry county-like labels in the public payload: `Emery County (Castle Dale)` and `South County (Taylorsville)`.',
    '',
    '## Why Utah remains blocked',
    '',
    '- The former DHHS local-office lead is currently challenge-gated in the repo-side lane.',
    '- The surviving DWS office payload remains an inventory, not a reusable county-to-office contract.',
    '- Sparse county-like labels inside a few office names still do not create a complete 29-county disability-resource mapping.',
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

export function generateBatch312UtahLiveCountyContractRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const allStateQueue = readJsonl(INPUTS.allStateQueue);
  const allStateAudit = readJson(INPUTS.allStateAudit);

  const updatedSummary = {
    ...summary,
    batch: 'batch312_utah_live_county_contract_refresh_v1',
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

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: 'legacy_state_grade',
          blocker_code: FAILURE_CODE,
          blocker_evidence: 'The DHHS contacts root now serves a Cloudflare 403 challenge in the repo-side lane, and the surviving DWS office payload still exposes no county or service-area field beyond two sparse county-like office-name labels.',
          query_basis: 'Reviewed the current DHHS contacts root, DWS contact pages, DWS office-search shell, jobs robots/search/sitemap responses, and the live public office/services APIs.',
          samples: [
            {
              sample_name: 'DHHS contacts root now challenge-gated',
              source_url: 'https://dhhs.utah.gov/contacts/',
              final_url: 'https://dhhs.utah.gov/contacts/',
              verification_status: 'blocked',
              source_type: 'official_challenge_shell',
              source_table: 'batch312_utah_live_county_contract_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The current repo-side request returns HTTP 403 with a Cloudflare `Attention Required` shell on the official DHHS contacts host.'
            },
            {
              sample_name: 'Older DWS contact page still points to Office Map',
              source_url: 'https://jobs.utah.gov/department/contact/index.html',
              final_url: 'https://jobs.utah.gov/department/contact/index.html',
              verification_status: 'verified',
              source_type: 'official_contact_leaf',
              source_table: 'batch312_utah_live_county_contract_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The official page still says: To find the Workforce Services office nearest you, visit our online Office Map.'
            },
            {
              sample_name: 'Live DWS office inventory API',
              source_url: 'https://officesearch-api.jobs.utah.gov/api/v1/offices',
              final_url: 'https://officesearch-api.jobs.utah.gov/api/v1/offices',
              verification_status: 'verified',
              source_type: 'official_public_api',
              source_table: 'batch312_utah_live_county_contract_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The public payload still returns 99 rows covering 45 unique offices, but only inventory fields like officeName, address, city, ZIP, coordinates, and serviceName.'
            },
            {
              sample_name: 'Sparse county-like office labels only',
              source_url: 'https://officesearch-api.jobs.utah.gov/api/v1/offices',
              final_url: 'https://officesearch-api.jobs.utah.gov/api/v1/offices',
              verification_status: 'verified',
              source_type: 'official_payload_token_audit',
              source_table: 'batch312_utah_live_county_contract_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'A bounded payload audit finds only two unique office names with county-like labels in the public inventory: `Emery County (Castle Dale)` and `South County (Taylorsville)`.'
            },
          ],
          sample_count: 4,
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          failure_code: FAILURE_CODE,
          next_action: NEXT_ACTION,
          evidence: 'The DHHS contacts root now serves a Cloudflare 403 challenge, and the surviving DWS office inventory still lacks county/service-area fields beyond two sparse county-like office-name labels.',
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
    states: allStateAudit.states.map((row) => (
      row.stateId === 'utah'
        ? {
            ...row,
            familyStatuses: {
              ...row.familyStatuses,
              county_local_disability_resources: FAMILY_STATUS,
            },
            packetBatch: 'batch312_utah_live_county_contract_refresh_v1',
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
  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);

  const batchSummary = {
    state: 'utah',
    classification: 'BLOCKED',
    index_safe: false,
    remaining_blocker_family: 'county_local_disability_resources',
    failure_code: FAILURE_CODE,
    dhhs_contacts_status: 403,
    dhhs_contacts_shell: 'cloudflare_attention_required',
    jobs_robots_status: 200,
    jobs_sitemap_status: 500,
    jobs_search_status: 500,
    office_rows: 99,
    unique_offices: 45,
    unique_county_like_office_labels: 2,
    county_like_labels: [
      'Emery County (Castle Dale)',
      'South County (Taylorsville)',
    ],
    next_action: NEXT_ACTION,
    lessons_updated: lessonsUpdated,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport(batchSummary));
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch312UtahLiveCountyContractRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
