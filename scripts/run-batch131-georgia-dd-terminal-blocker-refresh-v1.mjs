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
  batchSummary: path.join(generatedDir, 'batch131_georgia_dd_terminal_blocker_refresh_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch131-georgia-dd-terminal-blocker-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'georgia-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'official_county_page_points_to_unpublished_region_leaves_and_no_public_replacement_contract';
const STATUS_REASON = 'The live official DBHDD county lookup page still fails county-grade proof: county cells are blank and the repeated Region links themselves are marked data-status-unpublished=1 with aria-label "Not visible to public", so the page points to unpublished region leaves rather than preserving a public county-to-region routing contract. The old replacement root https://dbhdd.georgia.gov/locations/regional-offices is now HTTP 404, and the reviewed dbhdd.maps.arcgis.com Zone Lookup app shell exposes no county/region/service contract in the fetched public source.';
const EVIDENCE = 'Reviewed 2026-06-22 bounded live official HTML on https://dbhdd.georgia.gov/regional-field-office-county plus exact replacement candidates https://dbhdd.georgia.gov/locations/regional-offices and https://dbhdd.maps.arcgis.com/apps/instant/lookup/index.html?appid=66e57defda7a442597357d9be5ec00bc. The county table still renders empty county cells and repeated Region 1-6 links, and each reviewed region link carries data-status-unpublished="1", data-status-in-trash="1", and aria-label="Not visible to public". The older DBHDD regional-offices replacement root now returns HTTP 404. The reviewed ArcGIS app loads only a generic "Zone Lookup" shell; the fetched public source exposes no county names, region names, FeatureServer/MapServer reference, or other public county-to-region routing contract. A deterministic 159-county county-to-region map still cannot be verified from the current public official evidence.';

const LESSON_HEADING = '### Generic ArcGIS Instant-App Shells Do Not Count As County Contracts';
const LESSON_BODY = '*   **Lesson:** If an official `*.maps.arcgis.com` app only fetches as a generic “Zone Lookup” shell and the public HTML exposes no county names, region names, or service/layer references, do not treat it as a county-routing contract. Georgia still stayed blocked because the DBHDD ArcGIS app revealed no public county-to-region evidence beyond the shell.';

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
    '## Georgia final blocker decision',
    '',
    '- Developmental disability routing remains blocked.',
    '- The public county lookup still points only to unpublished region leaves rather than a public county-to-region contract.',
    '- The old official replacement root is now a hard 404, and the reviewed DBHDD ArcGIS app is only a generic shell with no exposed county/region/service contract in fetched public source.',
    '- Georgia should reopen this family only if DBHDD republishes a public county-to-region source or a public official map/data contract becomes visible.',
  ].join('\n') + '\n';
}

export function generateBatch131GeorgiaDdTerminalBlockerRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedSummary = {
    ...summary,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: summary.final_blockers.map((row) => (
      row.family === 'developmental_disability_idd_authority'
        ? { ...row, evidence: EVIDENCE }
        : row
    )),
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'developmental_disability_idd_authority'
      ? { ...row, status_reason: STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'developmental_disability_idd_authority'
      ? { ...row, evidence: EVIDENCE }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'developmental_disability_idd_authority'
      ? {
        ...row,
        query_basis: 'Reviewed official DBHDD county page HTML, prior blocked region leaves, 404 replacement root, and the public ArcGIS app shell for a county-to-region contract.',
        blocker_evidence: EVIDENCE,
      }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'developmental_disability_idd_authority'
      ? { ...row, evidence: EVIDENCE }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    state: 'georgia',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    blocker_family: 'developmental_disability_idd_authority',
    county_page_unpublished_region_links: 159,
    replacement_root_status: 404,
    arcgis_shell_title: 'Zone Lookup',
    arcgis_public_contract_found: false,
    lesson_added: lessonAdded,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 131 Georgia DD Terminal Blocker Refresh Report v1',
      '',
      'This pass does not broaden Georgia discovery. It tightens the last DD blocker by recording the dead official replacement root and the non-contract ArcGIS shell.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- county_page_unpublished_region_links: ${batchSummary.county_page_unpublished_region_links}`,
      `- replacement_root_status: ${batchSummary.replacement_root_status}`,
      `- arcgis_shell_title: ${batchSummary.arcgis_shell_title}`,
      `- arcgis_public_contract_found: ${batchSummary.arcgis_public_contract_found}`,
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch131GeorgiaDdTerminalBlockerRefreshV1();
  console.log(JSON.stringify(summary, null, 2));
}
