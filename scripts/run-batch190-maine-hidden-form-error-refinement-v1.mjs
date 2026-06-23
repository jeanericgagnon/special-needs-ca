import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'maine_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'maine_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'maine_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'maine_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'maine_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'maine-california-grade-audit-report-v2.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch190_maine_hidden_form_error_refinement_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch190-maine-hidden-form-error-refinement-report-v1.md'),
};

const EDUCATION_FAILURE_CODE = 'live_orgid_inventory_and_workbook_exist_but_full_hidden_form_post_returns_generic_error_shell';
const COUNTY_FAILURE_CODE = 'official_dhhs_office_page_has_zero_county_town_or_service_area_fields';

const EDUCATION_REASON = 'Maine now has a tighter official education blocker than a generic POST-500 claim. The public Primary Contacts By Organization selector is live, the Town selector is live, and the official SAU-by-municipality workbook is still downloadable. A bounded replay that includes the page token plus the full hidden `SAUs[*]` inputs no longer throws raw HTTP 500, but both the Search and Export submits still return the same generic official `Error.` shell before any contact rows or export file appear. Maine therefore remains blocked on reviewed browser/manual capture or another official export path, not on selector discovery or missing form hydration.';
const COUNTY_REASON = 'Maine now has a tighter county-local blocker than a generic office-grade warning. The live DHHS District Office Locations page is public and role-bearing, but a bounded 2026-06-23 HTML inspection still exposes zero county terms, zero town terms, and zero service-area fields in the public page itself. Program cross-office notes such as Machias and Lewiston remain real office-routing hints, but they still cannot be promoted into county coverage proof. Maine county-local therefore remains blocked until an official county or town mapping contract appears.';

const EDUCATION_EVIDENCE = 'Reviewed 2026-06-23 official Maine education sources at https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU, https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town, and the official workbook https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx. The public selector and workbook still prove a live OrgId and municipality inventory. A bounded replay that included the page token, OrgId, and the full hidden SAU fields changed the old transport behavior: Search and Export no longer returned raw HTTP 500, but both official submits still returned the same generic `Error.` shell with no contact rows, no export file, and no recoverable local result payload.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-23 live official Maine DHHS District Office Locations page at https://www.maine.gov/dhhs/about/contact/offices. The page still preserves district office names, addresses, phones, emails, and cross-office program notes, but a bounded HTML inspection exposed zero county terms, zero town terms, zero service-area fields, and no county names such as Aroostook, Washington, or York in the public page itself. DOI mirror rows and dead locator fallbacks therefore still lack a truthful official mapping contract.';

const LESSON_HEADING = '### Retry ASP.NET Search Forms Once With Their Hidden Collections Before Calling The Workflow Broken';
const LESSON_BODY = '*   **Lesson:** If a public ASP.NET selector page exposes a live dropdown plus a token and hundreds of hidden collection inputs, replay one bounded submit with the page-owned hidden fields before locking a transport blocker. Maine DOE Contact Search looked like a raw POST-500 failure until the hidden `SAUs[*]` fields were included; after that, the official app still failed, but in a more precise generic `Error.` shell that proved the blocker was app-side, not selector-hydration drift.';

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

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Maine California-Grade Audit Report v2',
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
    '- Maine remains BLOCKED and not index-safe.',
    '- Education is still blocked, but the blocker is now more precise: the fully hydrated official form still collapses to a generic error shell before any local contact rows or export file appear.',
    '- County-local is still blocked because the official DHHS office page remains office-grade only and still publishes zero county/town/service-area fields in the public HTML.',
    '- Future Maine repair should start from reviewed browser/manual capture on the already-live DOE selectors and workbook, not from more selector discovery or partial POST guesses.',
  ].join('\n') + '\n';
}

export function generateBatch190MaineHiddenFormErrorRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedSummary = {
    ...summary,
    primary_gap_reason: 'public_maine_selectors_and_workbook_are_live_but_full_hidden_form_post_still_errors_and_dhhs_office_html_has_no_county_contract',
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      district_or_county_education_routing: 'blocked_live_public_org_selector_with_hidden_form_error_shell',
      county_local_disability_resources: 'blocked_district_office_locations_without_county_town_or_service_area_fields',
    },
    final_blockers: (summary.final_blockers || []).map((row) => {
      if (row.family === 'district_or_county_education_routing') {
        return { ...row, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_EVIDENCE };
      }
      if (row.family === 'county_local_disability_resources') {
        return { ...row, failure_code: COUNTY_FAILURE_CODE, evidence: COUNTY_EVIDENCE };
      }
      return row;
    }),
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_live_public_org_selector_with_hidden_form_error_shell',
        status_reason: EDUCATION_REASON,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_district_office_locations_without_county_town_or_service_area_fields',
        status_reason: COUNTY_REASON,
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        failure_code: EDUCATION_FAILURE_CODE,
        evidence: EDUCATION_EVIDENCE,
        next_action: 'use_live_orgids_and_workbook_for_reviewed_browser_capture_now_that_hidden_form_replay_is_understood',
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        failure_code: COUNTY_FAILURE_CODE,
        evidence: COUNTY_EVIDENCE,
        next_action: 'find_official_county_or_town_mapping_contract_or_keep_maine_counties_blocked',
      };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_live_public_org_selector_with_hidden_form_error_shell',
        blocker_code: EDUCATION_FAILURE_CODE,
        blocker_evidence: EDUCATION_EVIDENCE,
        query_basis: 'Reviewed the live official Maine Org selector HTML, Town selector, workbook, and a fully hydrated hidden-field submit replay.',
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_district_office_locations_without_county_town_or_service_area_fields',
        blocker_code: COUNTY_FAILURE_CODE,
        blocker_evidence: COUNTY_EVIDENCE,
        query_basis: 'Reviewed the live official DHHS district office page and bounded HTML field presence, not just the visible office cards.',
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        failure_code: EDUCATION_FAILURE_CODE,
        next_action: 'use_live_orgids_and_workbook_for_reviewed_browser_capture_now_that_hidden_form_replay_is_understood',
        evidence: EDUCATION_EVIDENCE,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        failure_code: COUNTY_FAILURE_CODE,
        next_action: 'find_official_county_or_town_mapping_contract_or_keep_maine_counties_blocked',
        evidence: COUNTY_EVIDENCE,
      };
    }
    return row;
  });

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch_190_maine_hidden_form_error_refinement_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'maine',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    hidden_form_replay_changes_500_to_error_shell: true,
    dhhs_office_page_has_county_fields: false,
    dhhs_office_page_has_town_fields: false,
    dhhs_office_page_has_service_area_fields: false,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 190 Maine Hidden Form Error Refinement Report v1',
    '',
    '- Confirmed the official DOE selector and workbook remain live.',
    '- Confirmed a fully hydrated hidden-field form replay still fails, but now as a generic official error shell instead of a raw 500.',
    '- Confirmed the official DHHS district office page still exposes zero county, town, or service-area fields in public HTML.',
    '- Maine remains blocked and not index-safe.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch190MaineHiddenFormErrorRefinementV1();
  console.log(JSON.stringify(result, null, 2));
}
