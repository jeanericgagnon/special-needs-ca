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
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch190_maine_public_orgid_refinement_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch190-maine-public-orgid-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'maine-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'public_maine_orgid_inventory_and_municipality_workbook_are_live_but_contact_result_step_still_500_and_dhhs_office_mapping_is_absent';
const EDUCATION_FAILURE_CODE = 'public_orgid_inventory_and_workbook_are_live_but_contact_result_step_still_500';
const EDUCATION_STATUS_REASON = 'Maine now has a narrower official education blocker than a generic selector problem. The public Primary Contacts By Organization selector already exposes real OrgIds and names directly in the HTML, including Acadia Academy (1761), Acton Public Schools (2), Auburn Public Schools (14), Augusta Public Schools (28), and Bangor Public Schools (42). The public Town selector remains live, and the official SAU-by-municipality workbook remains downloadable. So Maine no longer needs more selector or inventory discovery. The blocker is now concentrated entirely in the result/export step: once a real OrgId is submitted, the official workflow still returns HTTP 500 before any verified local contact rows or export file appear. All 16 county education rows still depend on statewide DOE fallbacks, so the next honest lane is reviewed browser/manual capture or export recovery from these already-live OrgIds and workbook mappings.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-23 bounded live official Maine education checks on https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU, https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town, https://neo.maine.gov/doe/neo/SuperSearch/Home/Index, and the official workbook https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx. The public Primary Contacts By Organization selector itself now proves a concrete official OrgId inventory on simple GET, with live option values such as 1761 Acadia Academy, 2 Acton Public Schools, 14 Auburn Public Schools, 28 Augusta Public Schools, and 42 Bangor Public Schools rendered directly in the HTML. The public Town selector is still live and reviewable, and the SAU-by-municipality workbook is still downloadable on the official DOE host. So Maine no longer has a selector-discovery problem or an unknown organization-id problem. The blocker is narrower: a bounded cookie-backed submit using a real OrgId still returns HTTP 500 and the NEO Contact Search shell before any verified local contact rows or export file appear. Fourteen county rows still point at https://www.maine.gov/doe/learning/specialed and two still point at https://www.maine.gov/doe, so Maine remains blocked on reviewed browser/manual capture or alternate export recovery from the already-live OrgId inventory and workbook rather than speculative POST or discovery retries.';

const LESSON_HEADING = '### Public OrgId Dropdowns Eliminate Selector Discovery';
const LESSON_BODY = '*   **Lesson:** If a first-party contact selector renders real organization option values in the HTML, stop treating OrgId discovery as an open problem. Maine’s public selector already exposed OrgIds like `2 Acton Public Schools`, `14 Auburn Public Schools`, and `42 Bangor Public Schools`, so later work should focus only on result capture or export recovery.';

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
    '- Education is still blocked, but the public OrgId and municipality inventory is now clearly solved on official first-party surfaces.',
    '- County-local is still blocked because the DHHS office page remains office-grade only and still lacks county or town coverage boundaries.',
    '- Future Maine education repair should start from the live OrgIds plus workbook mappings, not from more selector discovery.',
  ].join('\n') + '\n';
}

export function generateBatch190MainePublicOrgIdRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, status_reason: EDUCATION_STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_EVIDENCE }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'district_or_county_education_routing') return row;
    return {
      ...row,
      blocker_code: EDUCATION_FAILURE_CODE,
      blocker_evidence: EDUCATION_EVIDENCE,
      query_basis: 'Reviewed the live official Maine Org selector HTML, Town selector, and SAU-by-municipality workbook to determine whether the blocker is still selector discovery or only the result/export action.',
      sample_count: 4,
      samples: [
        {
          sample_name: 'Maine NEO Primary Contacts By Organization selector',
          source_url: 'https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU',
          final_url: 'https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU',
          verification_status: 'verified',
          source_type: 'official_public_org_selector_inventory',
          source_table: 'reviewed_live_probe',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The public selector HTML itself exposes real OrgIds and names including 1761 Acadia Academy, 2 Acton Public Schools, 14 Auburn Public Schools, 28 Augusta Public Schools, and 42 Bangor Public Schools.',
        },
        {
          sample_name: 'Maine NEO Town selector',
          source_url: 'https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town',
          final_url: 'https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town',
          verification_status: 'verified',
          source_type: 'official_public_selector_inventory',
          source_table: 'batch184_maine_public_selector_scope_refinement',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The public Town selector page is live and reviewable and exposes a full municipality dropdown, proving the municipality inventory itself is public.',
        },
        {
          sample_name: 'Maine SAU by Municipality workbook',
          source_url: 'https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx',
          final_url: 'https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx',
          verification_status: 'verified',
          source_type: 'official_downloadable_mapping_workbook',
          source_table: 'batch184_maine_public_selector_scope_refinement',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The official DOE host still serves the SAU-by-municipality workbook, so municipality-to-SAU mapping remains publicly downloadable even though the contact result action still fails.',
        },
        {
          sample_name: 'NEO result step still fails',
          source_url: 'https://neo.maine.gov/doe/neo/SuperSearch/Home/Index',
          final_url: 'https://neo.maine.gov/doe/neo/SuperSearch/Home/Index',
          verification_status: 'blocked',
          source_type: 'official_result_step_requires_manual_or_browser_capture',
          source_table: 'batch161_maine_official_form_session_confirmation',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The dashboard is live, but the result/export step still returns HTTP 500 before any verified local contact rows or export file appear.',
        },
      ],
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: EDUCATION_FAILURE_CODE, next_action: 'use_live_orgids_and_municipality_workbook_for_reviewed_browser_capture_or_export_recovery', evidence: EDUCATION_EVIDENCE }
      : row
  ));

  const updatedSummary = {
    ...summary,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'district_or_county_education_routing'
        ? { ...row, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_EVIDENCE, next_action: 'use_live_orgids_and_municipality_workbook_for_reviewed_browser_capture_or_export_recovery' }
        : row
    )),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch_190_maine_public_orgid_refinement_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'maine',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    public_orgids_detected: true,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const report = [
    '# Batch 190 Maine Public OrgId Refinement Report v1',
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
    '- Maine remains blocked and not index-safe.',
    '- The public Maine selector lane is now even narrower: OrgId discovery is already solved on the first-party selector HTML itself.',
    '- The remaining blocker is the result/export capture step, not selector discovery.',
    '- The county-local blocker is unchanged in this pass.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, report);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch190MainePublicOrgIdRefinementV1();
  console.log(JSON.stringify(result, null, 2));
}
