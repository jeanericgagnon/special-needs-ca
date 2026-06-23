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
  priorityQueue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  report: path.join(docsGeneratedDir, 'utah-california-grade-audit-report-v2.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch270_utah_office_search_shell_refinement_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch270-utah-office-search-shell-refinement-report-v1.md'),
};

const PRIMARY_GAP_REASON = 'official_usbe_district_lea_directory_clears_education_and_live_dws_office_search_shell_still_lacks_public_county_office_contract';
const FAILURE_CODE = 'live_dws_office_search_shell_and_dhhs_contacts_still_lack_public_county_office_contract';
const NEXT_ACTION = 'hold_blocked_until_office_search_materializes_public_office_rows_or_a_county_grade_utah_directory_is_verified';
const STATUS_REASON = 'the official DWS contact page now links a live Office Map that redirects to `jobs.utah.gov/office-search/`, but the public shell still exposes only map/search controls and no county list, office rows, addresses, or county-to-office contract in raw public HTML. The older DWS services locations page still returns HTTP 500, the older DHHS locations route still returns HTTP 404, and current DHHS contacts/customer-service pages still do not publish a county-grade office directory';
const LESSON_HEADING = '### A Live Official Office-Search App Shell Still Does Not Clear County-Grade Routing Without Public Office Rows';
const LESSON_BODY = '*   **Lesson:** A live official office-search app is only enough when the public surface itself exposes office rows, addresses, county filters, or another reusable county-to-office contract. Utah\'s DWS contact page now points to a real `office-search` app, but the raw public shell only exposes map/search controls; without a county list or public office extract, the county-local blocker remains.'; 

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
    '- Utah now also has a live official DWS Office Map route: the older public contact page links `/jsp/officesearch/`, which redirects to `https://jobs.utah.gov/office-search/`.',
    '- That official office-search surface still does not clear county-grade routing because the public shell only exposes map/search controls and not a county list, office rows, addresses, or another reusable county-to-office contract in raw public HTML.',
    '- Utah therefore remains BLOCKED and not index-safe.',
  ].join('\n') + '\n';
}

function updateHandoff() {
  const current = fs.readFileSync(INPUTS.handoff, 'utf8');
  const replacement = current
    .replace('- Utah: `official_usbe_district_lea_directory_clears_education_but_dws_locations_500_and_dhhs_locations_404_leave_no_live_county_local_contract`', '- Utah: `official_usbe_district_lea_directory_clears_education_and_live_dws_office_search_shell_still_lacks_public_county_office_contract`')
    .replace(
      '`county_local_disability_resources` is now the top Utah blocker in the state queue. The live Utah Schools Directory clears education because it is explicitly district- and LEA-sourced and exposes a district filter plus CSV export on the official USBE host, but the older DWS services locations page returns HTTP 500, the older DHHS locations route returns HTTP 404, and the live DHHS home still lacks a county-grade office directory contract.',
      '`county_local_disability_resources` is now the top Utah blocker in the state queue. The live Utah Schools Directory still clears education, and the older public DWS contact page now leads to a live official `jobs.utah.gov/office-search/` app, but the public office-search shell still exposes only map/search controls and no county list, office rows, addresses, or county-to-office contract. The older DWS services locations page still returns HTTP 500, the older DHHS locations route still returns HTTP 404, and current DHHS contact pages still do not publish a county-grade office directory.'
    )
    .replace(
      '- Any live Utah county office directory, county list, or county-owned human-services office leaves on a live state or county host.\n- The Utah Schools Directory no longer needs repair, but county-local still needs a live county-grade office contract.',
      '- Any live Utah public office-search result page, office-row API, county list, or county-owned human-services office leaves on a live state or county host.\n- The Utah Schools Directory no longer needs repair, but county-local still needs a public county-grade office contract.'
    )
    .replace(
      '- [Utah Schools Directory](https://schools.utah.gov/schoolsdirectory)\n- [Utah DWS contact root](https://jobs.utah.gov/contact/index.html)\n- [Older DWS services locations page](https://jobs.utah.gov/customereducation/serviceslocations.html)\n- [Utah DHHS home](https://dhhs.utah.gov)\n- [Older DHHS locations route](https://dhhs.utah.gov/locations)',
      '- [Utah Schools Directory](https://schools.utah.gov/schoolsdirectory)\n- [Utah DWS contact root](https://jobs.utah.gov/contact/index.html)\n- [Older DWS public contact page with Office Map link](https://jobs.utah.gov/department/contact/index.html)\n- [Live DWS Office Search shell](https://jobs.utah.gov/office-search/)\n- [Live DWS Office Search map route](https://jobs.utah.gov/office-search/map)\n- [Older DWS services locations page](https://jobs.utah.gov/customereducation/serviceslocations.html)\n- [Utah DHHS contacts](https://dhhs.utah.gov/contacts/)\n- [Utah DHHS customer service](https://dhhs.utah.gov/customer-service/)\n- [Older DHHS locations route](https://dhhs.utah.gov/locations)'
    )
    .replace(
      '- Any live Utah county office directory or county-owned human-services office leaves.\n- Any official Utah successor artifact to the broken `serviceslocations.html` and dead `dhhs.utah.gov/locations` routes.\n- Any county-grade office extract that can replace statewide-only or inventory-only local-office rows.',
      '- Any public office rows, addresses, or county filter contract behind `jobs.utah.gov/office-search/`.\n- Any official Utah successor artifact to the broken `serviceslocations.html` and dead `dhhs.utah.gov/locations` routes.\n- Any county-grade office extract or county-owned office leaves that can replace statewide-only or inventory-only local-office rows.'
    );
  fs.writeFileSync(INPUTS.handoff, replacement);
}

function updateLessons() {
  const current = fs.readFileSync(INPUTS.lessons, 'utf8');
  if (current.includes(LESSON_HEADING)) return;
  fs.writeFileSync(INPUTS.lessons, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
}

export function generateBatch270UtahOfficeSearchShellRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const priorityRows = readJsonl(INPUTS.priorityQueue);

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
            evidence: 'Reviewed 2026-06-23 one more bounded official Utah county-local pass. The older public DWS contact page links an `Office Map` at `/jsp/officesearch/`, and that route now redirects to a live official `https://jobs.utah.gov/office-search/` app titled `Office Search - DWS`. The live shell exposes map/search controls, including `search/<zip-or-city>` and `map` routes, but the raw public HTML still contains no county list, office rows, office addresses, or county-to-office contract. The older DWS services locations page still returns HTTP 500, the older DHHS locations route still returns HTTP 404, and current DHHS contacts/customer-service pages still do not publish a county-grade office directory.',
            next_action: NEXT_ACTION,
          }
        : blocker
    )),
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      county_local_disability_resources: 'blocked_live_office_search_shell_without_public_county_contract',
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
          evidence: 'The public DWS contact page now leads to a live official `office-search` app, but the raw public shell still exposes only map/search controls and no county-grade office rows or county-to-office contract. The older DWS services locations page still returns HTTP 500, the older DHHS locations route still returns HTTP 404, and DHHS contacts/customer-service pages still do not publish a county-grade office directory.',
          next_action: NEXT_ACTION,
        }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: 'legacy_state_grade',
          evidence_strength: 'weak',
          sample_count: 4,
          query_basis: 'Reviewed the current official DWS office-search shell plus current DHHS contact pages.',
          blocker_code: FAILURE_CODE,
          blocker_evidence: 'The live official office-search shell exists but still exposes no public county list, office rows, addresses, or county-to-office contract in raw HTML.',
          samples: [
            {
              sample_name: 'Older DWS public contact page with Office Map link',
              source_url: 'https://jobs.utah.gov/department/contact/index.html',
              final_url: 'https://jobs.utah.gov/department/contact/index.html',
              verification_status: 'verified',
              source_type: 'official_contact_page',
              source_table: 'batch270_utah_office_search_shell_refinement',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The public page says `To find the Workforce Services office nearest you, visit our online Office Map` and links `/jsp/officesearch/`.'
            },
            {
              sample_name: 'Live DWS Office Search shell',
              source_url: 'https://jobs.utah.gov/jsp/officesearch/',
              final_url: 'https://jobs.utah.gov/office-search/',
              verification_status: 'verified',
              source_type: 'official_office_search_shell',
              source_table: 'batch270_utah_office_search_shell_refinement',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The redirected official page title is `Office Search - DWS` and the public shell exposes map/search controls.'
            },
            {
              sample_name: 'Live DWS Office Search map/search controls',
              source_url: 'https://jobs.utah.gov/office-search/',
              final_url: 'https://jobs.utah.gov/office-search/',
              verification_status: 'verified',
              source_type: 'official_office_search_controls',
              source_table: 'batch270_utah_office_search_shell_refinement',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The public shell exposes `search/<zip-or-city>` and `map` routes plus a `Zip Code or City` search box, but no public office rows or county contract in raw HTML.'
            },
            {
              sample_name: 'Current DHHS contacts page',
              source_url: 'https://dhhs.utah.gov/contacts/',
              final_url: 'https://dhhs.utah.gov/contacts/',
              verification_status: 'verified',
              source_type: 'official_contacts_page',
              source_table: 'batch270_utah_office_search_shell_refinement',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The current DHHS contacts page is live, but still does not publish a county-grade office directory contract.'
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
          evidence: 'A live official DWS office-search shell now exists, but it still exposes no public county-grade office rows or county contract in raw HTML.',
        }
      : row
  ));

  const updatedPriorityRows = priorityRows.map((row) => (
    (row.state_name || row.state) === 'Utah'
      ? { ...row, classification: 'BLOCKED', index_safe: false, primary_gap_reason: PRIMARY_GAP_REASON, status: 'BLOCKED' }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJsonl(INPUTS.priorityQueue, updatedPriorityRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  updateHandoff();
  updateLessons();

  writeJson(OUTPUTS.batchSummary, {
    batch: 'batch270_utah_office_search_shell_refinement_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'utah',
    classification: 'BLOCKED',
    index_safe: false,
    remaining_blocker_family: 'county_local_disability_resources',
    office_search_root: 'https://jobs.utah.gov/office-search/',
    blocker_code: FAILURE_CODE,
  });

  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 270 Utah Office Search Shell Refinement Report v1',
      '',
      '- classification_after: BLOCKED',
      '- index_safe_after: false',
      `- primary_gap_reason_after: ${PRIMARY_GAP_REASON}`,
      '',
      '## What changed',
      '',
      '- Confirmed the older public DWS contact page now leads to a live official `Office Search - DWS` app.',
      '- Confirmed the public shell still does not expose county-grade office rows, addresses, or a county-to-office contract in raw HTML.',
      '- Kept Utah blocked, but sharpened the blocker from dead-route-only evidence to the stronger live-shell-without-county-contract evidence.',
      '',
      '## Exact evidence',
      '',
      '- `https://jobs.utah.gov/department/contact/index.html` is live and links an `Office Map` at `/jsp/officesearch/`.',
      '- `/jsp/officesearch/` now redirects to `https://jobs.utah.gov/office-search/`.',
      '- The live shell title is `Office Search - DWS` and exposes map/search controls including `Zip Code or City` input and `search/<zip-or-city>` / `map` routes.',
      '- The public shell still exposes no county list, office rows, office addresses, or county-to-office contract in raw public HTML.',
      '',
      '## Remaining blocker',
      '',
      '- `county_local_disability_resources` remains the sole critical blocker for Utah.',
    ].join('\n') + '\n'
  );

  return updatedSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch270UtahOfficeSearchShellRefinementV1();
  console.log(JSON.stringify(result, null, 2));
}
