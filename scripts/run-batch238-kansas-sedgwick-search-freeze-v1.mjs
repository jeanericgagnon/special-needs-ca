import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');
const lessonsPath = path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md');

const FILES = {
  summary: path.join(generatedDir, 'kansas_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'kansas_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'kansas_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'kansas_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'kansas_next_action_queue_v2.jsonl'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch238_kansas_sedgwick_search_freeze_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch238-kansas-sedgwick-search-freeze-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'kansas-california-grade-audit-report-v2.md'),
};

const FAILURE_CODE = 'reviewed_district_owned_special_education_leaves_exist_but_kansas_county_grade_coverage_is_still_incomplete';
const NEXT_ACTION = 'expand_reviewed_kansas_district_owned_special_education_leaves_from_public_export_backed_inventory_and_do_not_reprobe_sedgwick_without_new_role_exact_leaf';
const PRIMARY_GAP_REASON = 'reviewed_kansas_district_owned_leaves_exist_but_full_county_grade_coverage_is_incomplete';

const EVIDENCE = 'Reviewed 2026-06-23 bounded Kansas district-owned exact leaf checks after the public KSDE export contract was proven. District-owned special-education leaves remain reviewed for 6/105 counties: atchison-ks, butler-ks, douglas-ks, finney-ks, johnson-ks, shawnee-ks. A final Sedgwick-only same-domain freeze pass then confirmed that Wichita USD 259 still has no role-exact local leaf on its public host: https://www.usd259.org/ returned a live homepage, https://www.usd259.org/site-map returned HTTP 200 with no role-exact special-education or student-services links, and the internal search pages for `special education` and `student services` also returned HTTP 200 but no matching role-exact links. The existing https://www.usd259.org/schools23/special-programs-and-schools page therefore remains only a generic district-owned special-programs page, not county-grade special-education routing. Kansas still remains blocked until reviewed district-owned local leaves expand county by county across the 105-county packet.';

const LESSON_HEADING = '### Internal Site Search Can Be A Valid Final Negative Check';
const LESSON_BODY = '*   **Lesson:** If a district-owned host already failed obvious role-exact paths, one bounded pass across its public site map and internal search can be enough to freeze it as reviewed-without-leaf. Wichita USD 259 returned 200 on homepage, site-map, and internal search, but none exposed a role-exact special-education or student-services leaf.';

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

function upsertLesson() {
  const current = fs.readFileSync(lessonsPath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(lessonsPath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Kansas California-Grade Audit Report v2',
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
    '## Repair decision',
    '',
    '- Kansas remains BLOCKED and not index-safe.',
    '- Education still has real reviewed district-owned leaves for six counties.',
    '- Sedgwick is now fully frozen in the low-token lane: homepage, site-map, and internal search all stayed live but exposed no role-exact special-education or student-services leaf.',
    '- Kansas still does not clear until reviewed district-owned special-education or student-services leaves expand county by county across the remaining unresolved counties.',
  ].join('\n') + '\n';
}

export function generateBatch238KansasSedgwickSearchFreezeV1() {
  const summary = readJson(FILES.summary);
  const gapRows = readJsonl(FILES.gap);
  const failureRows = readJsonl(FILES.failures);
  const verifiedRows = readJsonl(FILES.verified);
  const nextRows = readJsonl(FILES.next);
  const queueRows = readJsonl(FILES.queue);

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'district_or_county_education_routing') return row;
    const filtered = (row.samples || []).filter((sample) => ![
      'sedgwick district non-match site map',
      'sedgwick district non-match search results',
    ].includes(sample.sample_name));
    const samples = [
      ...filtered,
      {
        sample_name: 'sedgwick district non-match site map',
        source_url: 'https://www.usd259.org/site-map',
        final_url: 'https://www.usd259.org/site-map',
        verification_status: 'reviewed',
        source_type: 'district_owned_site_map_without_role_exact_leaf',
        source_table: 'reviewed_live_probe',
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The public USD 259 site map returned HTTP 200 but exposed no role-exact special-education or student-services links.',
      },
      {
        sample_name: 'sedgwick district non-match search results',
        source_url: 'https://www.usd259.org/search-results?q=special%20education',
        final_url: 'https://www.usd259.org/search-results?q=special%20education',
        verification_status: 'reviewed',
        source_type: 'district_owned_search_results_without_role_exact_leaf',
        source_table: 'reviewed_live_probe',
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The public USD 259 internal search pages for `special education` and `student services` returned HTTP 200 but no role-exact special-education or student-services links.',
      },
    ];
    return {
      ...row,
      blocker_code: FAILURE_CODE,
      blocker_evidence: EVIDENCE,
      sample_count: samples.length,
      samples,
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
      : row
  ));

  const updatedSummary = {
    ...summary,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'district_or_county_education_routing'
        ? { ...row, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
        : row
    )),
  };

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'kansas'
      ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  writeJson(FILES.summary, updatedSummary);
  writeJsonl(FILES.failures, updatedFailureRows);
  writeJsonl(FILES.verified, updatedVerifiedRows);
  writeJsonl(FILES.next, updatedNextRows);
  writeJsonl(FILES.queue, updatedQueueRows);

  const stateReport = buildStateReport(updatedSummary, gapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, stateReport);

  const lessonAdded = upsertLesson();

  const batchSummary = {
    state: 'kansas',
    batch: 'batch238_kansas_sedgwick_search_freeze_v1',
    classification: 'BLOCKED',
    index_safe: false,
    sedgwick_root: 'https://www.usd259.org/',
    sedgwick_site_map: 'https://www.usd259.org/site-map',
    sedgwick_search: 'https://www.usd259.org/search-results?q=special%20education',
    primary_gap_reason: PRIMARY_GAP_REASON,
    lesson_added: lessonAdded,
  };
  writeJson(OUTPUTS.summary, batchSummary);

  const batchReport = [
    '# Kansas Sedgwick Search Freeze Report v1',
    '',
    '- state: Kansas',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: Sedgwick USD 259 is now explicitly frozen as a reviewed district-owned host without any role-exact special-education or student-services leaf',
    '',
    '- homepage: https://www.usd259.org/',
    '- site map: https://www.usd259.org/site-map',
    '- internal search: https://www.usd259.org/search-results?q=special%20education',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.report, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const summary = generateBatch238KansasSedgwickSearchFreezeV1();
  console.log(JSON.stringify(summary, null, 2));
}
