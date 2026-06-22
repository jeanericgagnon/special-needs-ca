import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'georgia_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'georgia_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'georgia_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'georgia_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'georgia_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch105_georgia_dd_live_blank_table_refinement_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'georgia-california-grade-audit-report-v2.md'),
  batchReport: path.join(docsGeneratedDir, 'batch105-georgia-dd-live-blank-table-refinement-report-v1.md'),
};

const DD_EVIDENCE = 'A fresh bounded live check on 2026-06-22 shows the official DBHDD county lookup page https://dbhdd.georgia.gov/regional-field-office-county still returns HTTP 200 but renders blank county cells with only repeated Region links in the official HTML, while the alternate official regional-offices path https://dbhdd.georgia.gov/locations/regional-offices returns an official 404 page and the six same-domain region field-office leaves remain access-denied in prior reviewed checks. A deterministic 159-county county-to-region map still cannot be verified from the current official evidence.';
const DD_REASON = 'Live official DBHDD county lookup page still renders blank county cells and only repeated Region links, the alternate regional-offices path now returns an official 404, and the reviewed region leaves remain access denied.';
const LESSON_HEADING = '### Live Official County Tables Can Still Fail Closed When The Key Cells Are Blank';
const LESSON_BULLET = '*   **Lesson:** Do not count a live official county-routing table just because it returns HTTP 200. Georgia DBHDD still fails county-grade DD routing because the official county page renders blank county cells and repeated region links, even before you consider the blocked region leaves.';

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

function ensureLesson() {
  const current = fs.readFileSync(INPUTS.lessons, 'utf8');
  if (current.includes(LESSON_HEADING)) return;
  fs.writeFileSync(INPUTS.lessons, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BULLET}\n`);
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Georgia California-Grade Audit Report v2',
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
    '## Georgia repair decision',
    '',
    '- County-local disability resources remain verified from the official DFCS county directory.',
    '- Developmental disability routing remains blocked because the official DBHDD county page is live but still does not expose county names in the HTML, the alternate official regional-offices path is now a 404, and the reviewed region field-office leaves remain non-proving.',
    '- District or county education routing remains blocked because only 5 reviewed exact district leaves are preserved on disk and county-grade district coverage still cannot be proven statewide.',
    '- Georgia therefore remains truthfully BLOCKED and not index-safe.',
  ].join('\n') + '\n';
}

export function generateBatch105GeorgiaDdLiveBlankTableRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'developmental_disability_idd_authority'
      ? { ...row, status_reason: DD_REASON }
      : row
  ));

  const updatedFailures = failureRows.map((row) => (
    row.family === 'developmental_disability_idd_authority'
      ? { ...row, evidence: DD_EVIDENCE }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'developmental_disability_idd_authority'
      ? { ...row, blocker_evidence: DD_EVIDENCE, query_basis: 'Reviewed official county lookup page plus bounded static and browser-assisted checks of all six DBHDD region field-office pages, then a bounded 2026-06-22 recheck of the live county page and alternate regional-offices path.' }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'developmental_disability_idd_authority'
      ? { ...row, evidence: DD_EVIDENCE }
      : row
  ));

  const updatedSummary = {
    ...summary,
    final_blockers: summary.final_blockers.map((row) => (
      row.family === 'developmental_disability_idd_authority'
        ? { ...row, evidence: DD_EVIDENCE }
        : row
    )),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailures);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  ensureLesson();
  fs.writeFileSync(OUTPUTS.report, buildReport(updatedSummary, updatedGapRows, updatedFailures, updatedVerifiedRows, updatedNextRows));
  writeJson(OUTPUTS.batchSummary, {
    state: 'georgia',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    refined_family: 'developmental_disability_idd_authority',
    evidence_checks: {
      countyLookupUrl: 'https://dbhdd.georgia.gov/regional-field-office-county',
      countyLookupStatus: 200,
      countyNamesPresent: false,
      alternateRegionalOfficesUrl: 'https://dbhdd.georgia.gov/locations/regional-offices',
      alternateRegionalOfficesStatus: 404,
    },
  });
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 105 Georgia DD Live Blank-Table Refinement Report v1',
      '',
      'This pass does not broaden Georgia discovery. It reruns one bounded official DBHDD check and shows that the live county page still fails county-grade proof even while returning HTTP 200, and that the alternate official regional-offices path is now a 404.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- refined_family: developmental_disability_idd_authority`,
    ].join('\n') + '\n',
  );

  return updatedSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch105GeorgiaDdLiveBlankTableRefinementV1();
  console.log(JSON.stringify(summary, null, 2));
}
