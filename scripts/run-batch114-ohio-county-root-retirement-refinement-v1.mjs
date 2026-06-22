import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'ohio_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'ohio_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'ohio_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'ohio_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'ohio_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch114_ohio_county_root_retirement_refinement_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch114-ohio-county-root-retirement-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'ohio-california-grade-audit-report-v2.md'),
};

const COUNTY_BLOCKER_CODE = 'official_jfs_root_domain_retired_and_replacement_domains_unresolved';
const COUNTY_NEXT_ACTION = 'hold_blocked_until_new_live_official_ohio_county_directory_or_locator_is_verified';
const COUNTY_STATUS_REASON = 'The live official Ohio county-office family is now a root-retirement blocker, not just a stale PDF path. jfs.ohio.gov returns HTTP 404 across the root, sitemap, robots, county directory, and county-agencies paths, while the obvious odjfs.ohio.gov and jobandfamilyservices.ohio.gov replacement domains do not resolve.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-22 bounded live official checks on https://jfs.ohio.gov/, https://jfs.ohio.gov/sitemap.xml, https://jfs.ohio.gov/robots.txt, https://jfs.ohio.gov/county-agencies, https://jfs.ohio.gov/county/, https://jfs.ohio.gov/county/county_directory.pdf, https://jfs.ohio.gov/wps/portal/gov/jfs/, and https://jfs.ohio.gov/wps/portal/gov/jfs/county-agencies. All jfs.ohio.gov roots returned HTTP 404, while the obvious replacement authority domains https://odjfs.ohio.gov/ and https://jobandfamilyservices.ohio.gov/ failed DNS resolution. The remaining DOI-hosted county dataset is therefore planning evidence only, and no live official county-office directory or locator was verified in this bounded pass.';

const LESSON_HEADING = '### Domain-Wide 404 Plus NXDOMAIN Replacement Is Stronger Than A Dead Leaf';
const LESSON_BODY = '*   **Lesson:** If the root, sitemap, robots, and known child paths on an official domain all return `404`, and the obvious replacement authority subdomains are `NXDOMAIN`, classify the source family as retired at the domain level rather than as a single dead leaf. Ohio county-local routing stayed blocked because the whole `jfs.ohio.gov` family was retired and no live official replacement domain resolved.';

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
    '# Ohio California-Grade Audit Report v2',
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
    '## Ohio final blocker decision',
    '',
    '- County-local disability resources remain blocked because the live official Ohio JFS county-directory family now looks retired at the domain level: the root and all bounded child paths return 404, while the obvious replacement domains do not resolve.',
    '- District or county education routing remains blocked because only 6 reviewed ESC-owned exact leaves across 8 bounded Ohio packet roots have been verified; that is not enough to truthfully prove district-grade routing across all 88 Ohio counties without reopening broader district authoring.',
    '- Ohio is therefore truthfully final-blocked and not index-safe until a new live official county-office directory or locator is verified and new exact district-owned education leaves are authored.',
  ].join('\n') + '\n';
}

export function generateBatch114OhioCountyRootRetirementRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: 'blocked_retired_official_county_domain_family', status_reason: COUNTY_STATUS_REASON }
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
        family_status: 'blocked_retired_official_county_domain_family',
        evidence_strength: 'weak',
        query_basis: 'Reviewed bounded live official JFS root/sitemap/robots/county paths plus replacement-domain resolution checks.',
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
    state: 'ohio',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    refined_family: 'county_local_disability_resources',
    blocker_code: COUNTY_BLOCKER_CODE,
    next_action: COUNTY_NEXT_ACTION,
    lesson_added: lessonAdded,
    evidence_checks: {
      jfsRoot: '404',
      jfsSitemap: '404',
      jfsRobots: '404',
      countyAgencies: '404',
      countyPdf: '404',
      odjfs: 'dns_failure',
      jobandfamilyservices: 'dns_failure',
      doiFallbackOnly: true,
    },
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 114 Ohio County Root Retirement Refinement Report v1',
      '',
      'This pass does not broaden Ohio discovery. It sharpens the county-local blocker by proving the entire official JFS county-directory domain family is retired or unresolved, not just one stale PDF path.',
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
  const summary = generateBatch114OhioCountyRootRetirementRefinementV1();
  console.log(JSON.stringify(summary, null, 2));
}
