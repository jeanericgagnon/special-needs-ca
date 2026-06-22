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
  batchSummary: path.join(generatedDir, 'batch113_georgia_dd_unpublished_link_refinement_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch113-georgia-dd-unpublished-link-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'georgia-california-grade-audit-report-v2.md'),
};

const DD_BLOCKER_CODE = 'official_county_page_points_to_unpublished_region_leaves';
const DD_NEXT_ACTION = 'hold_blocked_until_public_county_to_region_source_replaces_unpublished_region_links';
const DD_STATUS_REASON = 'The live official DBHDD county lookup page still fails county-grade proof: county cells are blank and the repeated Region links themselves are marked data-status-unpublished=1 with aria-label "Not visible to public", so the page points to unpublished region leaves rather than preserving a public county-to-region routing contract.';
const DD_EVIDENCE = 'Reviewed 2026-06-22 bounded live official HTML on https://dbhdd.georgia.gov/regional-field-office-county. The county table still renders empty county cells and repeated Region 1-6 links, but the live anchor markup now makes the failure mode explicit: each reviewed region link carries data-status-unpublished="1", data-status-in-trash="1", and aria-label="Not visible to public". That means the current official county page is not exposing a public county-to-region routing contract, and the linked region leaves remain non-public/access-denied. A deterministic 159-county county-to-region map still cannot be verified from the current public official evidence.';

const LESSON_HEADING = '### Unpublished Markup On Official Links Is A Public-Evidence Failure';
const LESSON_BODY = '*   **Lesson:** If an official county or district lookup page links to leaves marked `data-status-unpublished=\"1\"`, `data-status-in-trash=\"1\"`, or `aria-label=\"Not visible to public\"`, treat the link set as non-public evidence even when the page itself returns HTTP 200. Georgia DBHDD stayed blocked because the public county page pointed only to unpublished region leaves.';

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
    '- Developmental disability routing remains blocked, and the official failure mode is now sharper than a generic 403 story: the live DBHDD county lookup page itself points only to unpublished region leaves, so there is no public county-to-region contract to verify from the current page.',
    '- District or county education routing remains blocked because only 5 reviewed district-owned exact leaves across the bounded Georgia packet evidence have been verified; that is not enough to truthfully prove county-grade routing across 159 Georgia counties without reopening broad district discovery.',
    '- Georgia remains blocked and not index-safe until a public county-to-region source replaces the unpublished DBHDD region links and education gains new exact district-owned county leaves.',
  ].join('\n') + '\n';
}

export function generateBatch113GeorgiaDdUnpublishedLinkRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'developmental_disability_idd_authority'
      ? { ...row, family_status: 'blocked_unpublished_official_region_links', status_reason: DD_STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'developmental_disability_idd_authority'
      ? { ...row, failure_code: DD_BLOCKER_CODE, evidence: DD_EVIDENCE, next_action: DD_NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'developmental_disability_idd_authority'
      ? {
        ...row,
        family_status: 'blocked_unpublished_official_region_links',
        evidence_strength: 'medium',
        query_basis: 'Reviewed official DBHDD county page HTML and prior region-leaf checks; county table points to unpublished region links rather than a public routing contract.',
        blocker_code: DD_BLOCKER_CODE,
        blocker_evidence: DD_EVIDENCE,
      }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'developmental_disability_idd_authority'
      ? { ...row, failure_code: DD_BLOCKER_CODE, next_action: DD_NEXT_ACTION, evidence: DD_EVIDENCE }
      : row
  ));

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    primary_gap_reason: DD_BLOCKER_CODE,
    complete_ready: false,
    final_blockers: summary.final_blockers.map((row) => (
      row.family === 'developmental_disability_idd_authority'
        ? { ...row, failure_code: DD_BLOCKER_CODE, evidence: DD_EVIDENCE, next_action: DD_NEXT_ACTION }
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
    state: 'georgia',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    refined_family: 'developmental_disability_idd_authority',
    blocker_code: DD_BLOCKER_CODE,
    next_action: DD_NEXT_ACTION,
    lesson_added: lessonAdded,
    evidence_checks: {
      countyLookupUrl: 'https://dbhdd.georgia.gov/regional-field-office-county',
      countyCellsVisible: false,
      repeatedRegionLinksPresent: true,
      unpublishedMarker: 'data-status-unpublished=1',
      inTrashMarker: 'data-status-in-trash=1',
      notVisibleLabel: 'aria-label=Not visible to public',
      publicCountyToRegionMapAvailable: false,
    },
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 113 Georgia DD Unpublished-Link Refinement Report v1',
      '',
      'This pass does not broaden Georgia discovery. It sharpens the official DBHDD blocker by proving the live county lookup page points to unpublished/non-public region leaves instead of a public county-to-region routing contract.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- blocker_code: ${DD_BLOCKER_CODE}`,
      `- next_action: ${DD_NEXT_ACTION}`,
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch113GeorgiaDdUnpublishedLinkRefinementV1();
  console.log(JSON.stringify(summary, null, 2));
}
