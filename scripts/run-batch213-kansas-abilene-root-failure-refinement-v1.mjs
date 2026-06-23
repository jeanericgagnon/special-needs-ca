import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'kansas_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'kansas_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'kansas_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'kansas_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'kansas_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch213_kansas_abilene_root_failure_refinement_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch213-kansas-abilene-root-failure-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'kansas-california-grade-audit-report-v2.md'),
};

const FAILURE_CODE = 'reviewed_district_owned_special_education_leaves_exist_but_kansas_county_grade_coverage_is_still_incomplete';
const NEXT_ACTION = 'expand_reviewed_kansas_district_owned_special_education_leaves_from_public_export_backed_inventory';
const STATUS_REASON = 'Kansas is past a root-only blocker: reviewed district-owned special-education leaves now exist for a small county subset, but the education family remains blocked because county-grade local leaf coverage is still incomplete across the 105-county packet. Export-backed district domains are useful authoring hints, but they still fail closed unless a role-exact local leaf is preserved on the district-owned host.';
const EVIDENCE = 'Reviewed 2026-06-23 bounded Kansas district-owned exact leaf checks after the public KSDE export contract was proven. District-owned special-education leaves are now reviewed for 3/105 counties: atchison-ks, butler-ks, shawnee-ks. https://www.usd385.org/departments/special-education returned HTTP 200 with title `Special Education - Andover Public Schools` and H1 `Special Education`. https://www.usd409.net/page/special-education-services/ returned HTTP 200 with title `Special Education Services | Atchison Public Schools` on the district-owned host. https://www.topekapublicschools.net/departments/special_education returned HTTP 200 with title `Special Education - Topeka Public Schools` on the district-owned host. A bounded export-backed Abilene USD 435 follow-up then verified the official district root https://www.abileneschools.org/ and its public sitemap https://www.abileneschools.org/sitemap.xml, but the obvious role-exact candidates `/page/special-education`, `/page/special-services`, `/departments/special-education`, `/departments/special-services`, `/special-education`, and `/student-services` all returned clean `Page Not Found` shells, and the sitemap preserved no role-exact special-education leaf. A bounded probe also showed the public KSDE app\'s `***ALL DISTRICTS***` export attempt returns the generic `There was a problem` shell, while district-scoped submits still return the workbook contract. Kansas therefore has real reviewed district-owned leaves for a small county subset and at least one export-backed district root that still fails closed, but education remains blocked until local-leaf coverage expands county by county across the 105-county packet.';

const LESSON_HEADING = '### Export-Backed District Domains Still Need A Role-Exact Leaf';
const LESSON_BODY = "*   **Lesson:** If a first-party district export yields a clean district domain and even a live sitemap, keep the county blocked unless a role-exact special-education or student-services leaf survives bounded fetches on that host. Kansas's Abilene USD 435 root and sitemap were real, but every obvious special-ed path returned `Page Not Found`, so the export-backed root stayed authoring evidence only.";

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
    '- Education is sharper than before because reviewed district-owned leaves now exist for a real county subset and at least one export-backed district root has now been proven to fail closed without a role-exact leaf.',
    '- Kansas still does not clear until reviewed district-owned special-education or student-services leaves expand county by county across the remaining unresolved counties.',
  ].join('\n') + '\n';
}

export function generateBatch213KansasAbileneRootFailureRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, family_status: 'blocked_reviewed_district_owned_leaves_exist_but_not_statewide_county_grade', status_reason: STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: 'blocked_reviewed_district_owned_leaves_exist_but_not_statewide_county_grade',
          blocker_code: FAILURE_CODE,
          blocker_evidence: EVIDENCE,
          sample_count: 6,
          samples: [
            ...(row.samples || []).filter((sample) => sample.sample_name !== 'abilene export-backed district root unresolved'),
            {
              sample_name: 'abilene export-backed district root unresolved',
              source_url: 'https://www.abileneschools.org/',
              final_url: 'https://www.abileneschools.org/',
              verification_status: 'reviewed',
              source_type: 'export_backed_district_root_without_role_exact_leaf',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The KSDE export-backed Abilene USD 435 district root and sitemap are live, but bounded role-exact special-education path checks all returned Page Not Found and the sitemap preserved no special-education leaf.',
            },
          ],
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence: EVIDENCE }
      : row
  ));

  const updatedSummary = {
    ...summary,
    primary_gap_reason: 'reviewed_kansas_district_owned_leaves_exist_but_full_county_grade_coverage_is_incomplete',
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'district_or_county_education_routing'
        ? { ...row, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
        : row
    )),
  };

  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.summary, updatedSummary);

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const batchSummary = {
    batch: 'batch_213_kansas_abilene_root_failure_refinement_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'kansas',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    refined_root: 'https://www.abileneschools.org/',
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.summary, batchSummary);

  const batchReport = [
    '# Batch 213 Kansas Abilene Root Failure Refinement Report v1',
    '',
    `- classification: ${updatedSummary.classification}`,
    `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
    '- refined_family: district_or_county_education_routing',
    `- failure_code: ${FAILURE_CODE}`,
    '',
    '## Evidence',
    '',
    `- ${EVIDENCE}`,
    '',
    '## Repair decision',
    '',
    '- Kansas remains blocked and not index-safe.',
    '- Abilene USD 435 now proves that a KSDE export-backed district root and sitemap can still fail closed when no role-exact special-education leaf survives bounded fetches.',
    '- Future Kansas work should keep using the official export-backed inventory, but must still require district-owned role-exact leaves before a county can count.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.report, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch213KansasAbileneRootFailureRefinementV1();
  console.log(JSON.stringify(result, null, 2));
}
