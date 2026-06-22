import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'indiana_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'indiana_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'indiana_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'indiana_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'indiana_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch135_indiana_dead_contact_lane_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch135-indiana-dead-contact-lane-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'indiana-california-grade-audit-report-v2.md'),
};

const BLOCKER_CODE = 'official_special_education_contact_lane_removed_and_no_official_search_replacement';
const EDUCATION_REASON = 'Reviewed 2026-06-22 bounded official Indiana DOE special-education and data-center lanes. The Special Education Director and Local Administrator Contact List is now preserved only inside commented-out HTML on the live special-education page, and the linked Google Sheets edit, export, csv, and preview URLs each return HTTP 410 Gone. The official Indiana DOE site-search lane for this contact-list phrase also returns 404, and the live 2025-2026 Indiana School Directory XLSX remains a generic school/corporation directory rather than a special-education routing source.';
const FAILURE_EVIDENCE = 'Reviewed 2026-06-22 official Indiana DOE Special Education and Data Center pages. The page preserves the Special Education Director and Local Administrator Contact List only inside commented-out HTML, the Google Sheets edit/export/csv/preview paths for spreadsheet 1hRtp2zsG3WtdCf2ma69awNDkxTc65jLn all return HTTP 410 Gone, the bounded Indiana DOE site-search lane for the contact-list phrase returns 404, and the live 2025-2026 Indiana School Directory XLSX remains generic school/corporation metadata instead of district-grade special-education routing evidence.';
const NEXT_ACTION = 'hold_blocked_until_indiana_doe_publishes_a_live_special_education_contact_or_district_grade_routing_source';
const LESSON_HEADING = '### Commented-Out Official Links Plus 410 Exports Mean The Contact Lane Is Truly Retired';
const LESSON_BODY = '*   **Lesson:** If an official page still advertises a contact list only inside commented-out HTML, treat that lane as retired unless a live replacement exists. Indiana was cheaper to classify once the edit, export, csv, and preview URLs for the old Google Sheet all returned 410 and the official site search produced no replacement, which avoided reprobing the same dead contact-list lane again.';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  if (!fs.existsSync(filePath)) return [];
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

function buildReport(summary, gapRows, verifiedRows) {
  return [
    '# Indiana California-Grade Audit Report v2',
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
    `- district_or_county_education_routing: ${BLOCKER_CODE} :: ${FAILURE_EVIDENCE}`,
    '',
    '## Verified source samples',
    '',
    ...verifiedRows.map((row) => `- ${row.family}: ${row.family_status}; samples=${row.sample_count}${row.samples?.[0]?.source_url ? `; first=${row.samples[0].source_url}` : ''}`),
    '',
    '## Completion decision',
    '',
    '- Indiana still cannot reach California-grade or become index-safe because district-or-county education routing remains unresolved.',
    '- The prior blocker is now sharper: the contact-list lane is not just stale, it is retired across the live Indiana DOE page, all Google Sheets access modes, and the bounded official site-search lane.',
    '- Indiana therefore remains BLOCKED and not index-safe until a reviewed district-grade education routing source replaces the removed contact-list lane.',
  ].join('\n') + '\n';
}

export function generateBatch135IndianaDeadContactLaneRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedSummary = {
    ...summary,
    batch: 'batch_135_indiana_dead_contact_lane_refresh_v1',
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 91,
    strong_critical_families: 11,
    weak_critical_families: 1,
    missing_critical_families: 0,
    primary_gap_reason: BLOCKER_CODE,
    recommended_batch: 'batch_2_repair_blocked',
    critical_gap_families: ['district_or_county_education_routing'],
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: BLOCKER_CODE,
        evidence: FAILURE_EVIDENCE,
        next_action: NEXT_ACTION,
      },
    ],
    complete_ready: false,
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
        ...row,
        family_status: 'blocked_official_contact_lane_removed',
        status_reason: EDUCATION_REASON,
      }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
        ...row,
        failure_code: BLOCKER_CODE,
        evidence: FAILURE_EVIDENCE,
        next_action: NEXT_ACTION,
      }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
        ...row,
        failure_code: BLOCKER_CODE,
        next_action: NEXT_ACTION,
        evidence: FAILURE_EVIDENCE,
      }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
        ...row,
        family_status: 'blocked_official_contact_lane_removed',
        blocker_code: BLOCKER_CODE,
        blocker_evidence: 'The official Indiana DOE contact-list lane is now commented out on-page, all live Google Sheets access modes return 410 Gone, official site-search returns 404, and the school directory XLSX remains generic metadata.',
        samples: [
          {
            sample_name: 'Indiana DOE Special Education',
            source_url: 'https://www.in.gov/doe/students/special-education/',
            final_url: 'https://www.in.gov/doe/students/special-education/',
            verification_status: 'verified',
            source_type: 'official_statewide_special_education_root',
            source_table: 'batch135_indiana_dead_contact_lane_refresh',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The Special Education Director and Local Administrator Contact List is now preserved only inside commented-out HTML on the live page.',
          },
          {
            sample_name: 'Retired Google Sheets contact-list lane',
            source_url: 'https://docs.google.com/spreadsheets/d/1hRtp2zsG3WtdCf2ma69awNDkxTc65jLn/edit#gid=1314039117',
            final_url: 'https://docs.google.com/spreadsheets/d/1hRtp2zsG3WtdCf2ma69awNDkxTc65jLn/edit#gid=1314039117',
            verification_status: 'blocked',
            source_type: 'retired_contact_lane',
            source_table: 'batch135_indiana_dead_contact_lane_refresh',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The edit, export, csv, and preview paths for spreadsheet 1hRtp2zsG3WtdCf2ma69awNDkxTc65jLn each return HTTP 410 Gone.',
          },
          {
            sample_name: 'Indiana DOE Data Center & Reports',
            source_url: 'https://www.in.gov/doe/it/data-center-and-reports/',
            final_url: 'https://www.in.gov/doe/it/data-center-and-reports/',
            verification_status: 'verified',
            source_type: 'official_data_directory_root',
            source_table: 'batch135_indiana_dead_contact_lane_refresh',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The live 2025-2026 Indiana School Directory XLSX remains a generic school and corporation directory rather than a district-grade special-education routing source.',
          },
        ],
      }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    state: 'indiana',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    refined_family: 'district_or_county_education_routing',
    blocker_code: BLOCKER_CODE,
    google_sheet_modes_checked: ['edit', 'export_xlsx', 'export_csv', 'preview'],
    official_search_status: 404,
    lesson_added: lessonAdded,
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedVerifiedRows));
  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Batch 135 Indiana Dead Contact Lane Refresh Report v1',
      '',
      'This pass does not broaden Indiana scraping. It sharpens the last education blocker by proving the old special-education contact-list lane is retired across the live page, all Google Sheets modes, and the bounded official site-search lane.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- blocker_code: ${batchSummary.blocker_code}`,
      `- google_sheet_modes_checked: ${batchSummary.google_sheet_modes_checked.join(', ')}`,
      `- official_search_status: ${batchSummary.official_search_status}`,
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch135IndianaDeadContactLaneRefreshV1();
  console.log(JSON.stringify(summary, null, 2));
}
