import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'new-york_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'new-york_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'new-york_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'new-york_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'new-york_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch115_new-york_health_host_403_refinement_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch115-new-york-health-host-403-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'new-york-california-grade-audit-report-v2.md'),
};

const COUNTY_BLOCKER_CODE = 'bounded_health_ny_medicaid_host_returns_403_without_public_ldss_replacement';
const COUNTY_NEXT_ACTION = 'hold_blocked_until_public_health_ny_ldss_replacement_or_county_owned_locator_is_verified';
const COUNTY_STATUS_REASON = 'The county-local blocker is host-wide, not just one dead LDSS page: bounded checks on the live health.ny.gov Medicaid lane returned HTTP 403 for ldss.htm, robots.txt, sitemap.xml, /health_care/medicaid/, and /health_care/medicaid/redesign/, so no public same-host replacement locator is currently verifiable from the official lane.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-22 bounded live official checks on https://www.health.ny.gov/health_care/medicaid/ldss.htm, https://www.health.ny.gov/robots.txt, https://www.health.ny.gov/sitemap.xml, https://www.health.ny.gov/health_care/medicaid/, and https://www.health.ny.gov/health_care/medicaid/redesign/. All five bounded health.ny.gov Medicaid/host surfaces returned HTTP 403, so the failure is broader than one stale LDSS URL. No public same-host replacement locator was verified in this bounded pass, and the current county-office rows cannot remain California-grade local proof.';

const LESSON_HEADING = '### Host-Wide 403 Across Root, Robots, And Sitemap Is Not A Single-Page Failure';
const LESSON_BODY = '*   **Lesson:** If the target page, `robots.txt`, `sitemap.xml`, and the obvious same-host section roots all return `403`, treat the blocker as a host-wide public-access failure rather than as one stale page. New York county-local routing stayed blocked because the whole bounded `health.ny.gov` Medicaid lane was inaccessible, not just `ldss.htm`.';

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
    '# New York California-Grade Audit Report v2',
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
    '## New York final blocker decision',
    '',
    '- County-local disability resources remain blocked because the official New York health.ny.gov Medicaid lane is failing at the host level, not just on one LDSS page: the bounded LDSS page, robots, sitemap, and nearby Medicaid roots all return 403, and no public same-host replacement locator is attached to the packet evidence chain.',
    '- District or county education routing remains blocked because only 3 reviewed BOCES-owned exact leaves have been verified; that is not enough to truthfully prove district-grade routing across all 62 New York counties without reopening broader district authoring.',
    '- Parent training information center remains below California-grade because the reviewed Parent Network of WNY evidence is explicitly regional and this pass did not produce first-party statewide scope proof for a New York PTI route.',
    '- New York is therefore truthfully final-blocked and not index-safe until a public county-office directory or county-owned locator is verified, district-grade education leaves expand beyond the current bounded BOCES set, and a statewide PTI route is proven beyond regional scope.',
  ].join('\n') + '\n';
}

export function generateBatch115NewYorkHealthHost403RefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: 'blocked_health_hostwide_403', status_reason: COUNTY_STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: COUNTY_BLOCKER_CODE, evidence: COUNTY_EVIDENCE, next_action: COUNTY_NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
        ...row,
        family_status: 'blocked_health_hostwide_403',
        query_basis: 'Reviewed bounded official health.ny.gov LDSS page plus robots, sitemap, and nearby Medicaid root paths.',
        blocker_code: COUNTY_BLOCKER_CODE,
        blocker_evidence: COUNTY_EVIDENCE,
      }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: COUNTY_BLOCKER_CODE, next_action: COUNTY_NEXT_ACTION, evidence: COUNTY_EVIDENCE }
      : row
  ));

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    primary_gap_reason: COUNTY_BLOCKER_CODE,
    complete_ready: false,
    final_blockers: summary.final_blockers.map((row) => (
      row.family === 'county_local_disability_resources'
        ? { ...row, failure_code: COUNTY_BLOCKER_CODE, evidence: COUNTY_EVIDENCE, next_action: COUNTY_NEXT_ACTION }
        : row
    )),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    state: 'new-york',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    refined_family: 'county_local_disability_resources',
    blocker_code: COUNTY_BLOCKER_CODE,
    next_action: COUNTY_NEXT_ACTION,
    lesson_added: lessonAdded,
    evidence_checks: {
      ldss: '403',
      robots: '403',
      sitemap: '403',
      medicaidRoot: '403',
      medicaidRedesign: '403',
      publicSameHostReplacementVerified: false,
    },
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 115 New York Health Host 403 Refinement Report v1',
      '',
      'This pass does not broaden New York discovery. It sharpens the county-local blocker by proving the bounded health.ny.gov Medicaid lane is host-wide 403, not just one blocked LDSS page.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- blocker_code: ${COUNTY_BLOCKER_CODE}`,
      `- next_action: ${COUNTY_NEXT_ACTION}`,
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch115NewYorkHealthHost403RefinementV1();
  console.log(JSON.stringify(summary, null, 2));
}
