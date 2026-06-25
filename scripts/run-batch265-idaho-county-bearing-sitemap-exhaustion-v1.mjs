import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'idaho_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'idaho_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'idaho_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'idaho_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'idaho_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'idaho-california-grade-audit-report-v2.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch265_idaho_county_bearing_sitemap_exhaustion_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch265-idaho-county-bearing-sitemap-exhaustion-report-v1.md'),
};

const PRIMARY_GAP_REASON = 'reviewed_idaho_district_leaves_hold_at_12_counties_and_remaining_county_bearing_district_roots_now_have_public_sitemap_exhaustion_evidence';
const EDUCATION_FAILURE_CODE = 'reviewed_district_special_services_leaves_hold_at_12_counties_and_remaining_county_bearing_sitemaps_expose_no_role_slug';
const EDUCATION_NEXT_ACTION = 'continue_exact_district_leaf_expansion_only_when_uncovered_idaho_district_hosts_expose_role_bearing_special_education_or_special_services_leaves';
const EDUCATION_STATUS_REASON = 'The Idaho education blocker is now sharper for the uncovered county-bearing districts too. Reviewed exact district-owned leaves still cover twelve counties, but one more bounded official pass across uncovered county-bearing district roots found no reusable role-bearing sitemap/root contract on Bear Lake, Camas, Clark, Fremont, Jefferson, Oneida, or Shoshone. Fremont exposed only a non-role `student-enrollment` sitemap slug, Oneida redirected its sitemap request back to the district root, and Jefferson returned HTTP 406 on sitemap.xml. Idaho therefore still needs exact district-owned special-education or special-services leaves for the remaining counties, but the low-token root/sitemap lane is now exhausted for this reviewed subset.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-22 one more bounded official Idaho district-root exhaustion pass starting from the public Idaho SDE district JSON and still-uncovered county-bearing district hosts. Bear Lake County District #33, Camas County District #121, Clark County District #161, Fremont County Joint District #215, Jefferson County Joint District #251, Oneida County District #351, and Shoshone Joint District #312 all stayed publicly reachable on district-owned roots. But Bear Lake exposed zero role-bearing sitemap slugs, Camas and Clark returned 404 on sitemap.xml, Fremont returned only a non-role `student-enrollment` sitemap hit, Jefferson returned HTTP 406 on sitemap.xml, Oneida redirected the sitemap request back to the district root with no exact role slug, and Shoshone exposed a WordPress sitemap with zero `special`, `services`, `student`, or `504` slugs. Idaho education therefore still holds at twelve reviewed county-level district-owned leaves while this bounded county-bearing root/sitemap subset is now exhausted without a new exact role leaf.';
const LESSON_HEADING = '### Treat Public District Sitemaps As A Finite Lane';
const LESSON_BODY = '*   **Lesson:** When a county-bearing district root is live but its public sitemap or root scan exposes no role-bearing `special education`, `special services`, `student services`, or `504` slug, mark that host exhausted for the low-token lane instead of reopening it repeatedly. Idaho’s Bear Lake, Camas, Clark, Fremont, Jefferson, Oneida, and Shoshone district hosts stayed public, but their bounded sitemap/root lane still yielded no exact education leaf worth promoting.';

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

function updateLessonsFile(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Idaho California-Grade Audit Report v2',
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
    '- Idaho remains BLOCKED and not index-safe.',
    '- Education still has twelve reviewed county-level district-owned leaves, but one more bounded county-bearing sitemap pass produced no new exact role leaf on the reviewed public subset.',
    '- County-local remains the same explicit split: 17 clean office replacements plus the Canyon split are preserved, and 27 counties stay blocked until Idaho publishes a public county-to-office contract.',
  ].join('\n') + '\n';
}

export function generateBatch265IdahoCountyBearingSitemapExhaustionV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedSummary = {
    ...summary,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((blocker) => (
      blocker.family === 'district_or_county_education_routing'
        ? { ...blocker, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_EVIDENCE, next_action: EDUCATION_NEXT_ACTION }
        : blocker
    )),
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, status_reason: EDUCATION_STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_EVIDENCE, next_action: EDUCATION_NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          blocker_code: EDUCATION_FAILURE_CODE,
          blocker_evidence: EDUCATION_EVIDENCE,
          query_basis: 'Reviewed live official Idaho district-owned special-education leaves already on disk, plus one bounded county-bearing district root/sitemap exhaustion pass from the public Idaho SDE district JSON.',
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_EVIDENCE, next_action: EDUCATION_NEXT_ACTION }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  const lessonAdded = updateLessonsFile(INPUTS.lessons);

  writeJson(OUTPUTS.batchSummary, {
    batch: 'batch265_idaho_county_bearing_sitemap_exhaustion_v1',
    generated_at: '2026-06-22T23:55:00.000Z',
    state: 'idaho',
    classification: 'BLOCKED',
    index_safe: false,
    reviewed_exact_leaf_count: 12,
    exhausted_county_bearing_roots: [
      'bear-lake-id',
      'camas-id',
      'clark-id',
      'fremont-id',
      'jefferson-id',
      'oneida-id',
      'shoshone-id',
    ],
    lesson_added: lessonAdded,
  });

  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 265 Idaho County-Bearing Sitemap Exhaustion Report v1',
      '',
      '- classification: BLOCKED',
      '- index_safe: false',
      '- refined_family: district_or_county_education_routing',
      `- failure_code: ${EDUCATION_FAILURE_CODE}`,
      '',
      '## Evidence',
      '',
      `- ${EDUCATION_EVIDENCE}`,
      '',
      '## Repair decision',
      '',
      '- Idaho remains blocked and not index-safe.',
      '- Education still holds at twelve reviewed county-level district-owned leaves.',
      '- The bounded root/sitemap lane is now exhausted for seven additional county-bearing district hosts without producing a new exact role-bearing leaf.',
    ].join('\n') + '\n',
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch265IdahoCountyBearingSitemapExhaustionV1();
}
