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
  nextActions: path.join(generatedDir, 'kansas_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch189_kansas_directory_dropdown_refinement_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch189-kansas-directory-dropdown-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'kansas-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'kansas_dd_stack_is_uniformly_transport_blocked_and_public_directory_inventory_is_now_clear_but_local_leaves_are_still_missing';
const EDUCATION_FAILURE_CODE = 'public_directory_reports_dropdown_and_annual_directory_pdfs_exist_but_no_reviewed_local_special_education_leaves';
const EDUCATION_STATUS_REASON = 'Kansas now has a clearer district-root inventory lane than a generic statewide packet. The live KSDE Directories page publishes current annual Kansas Educational Directory PDFs, and the public Directory Reports app exposes an `***ALL DISTRICTS***` selector plus named USD options such as Abilene USD 435, Andover USD 385, and Atchison Public Schools USD 409. That means the official stack already preserves a concrete district inventory on public first-party surfaces. But the DB still shows all 105 school_district rows pointing at the same statewide KSDE placeholder, and no reviewed county-to-district join or district-owned special-education contact leaves are preserved on disk. Kansas therefore remains blocked until that public district inventory is turned into reviewed district-owned local leaves.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-23 bounded live official Kansas education probes on https://uapps.ksde.gov/Directory_Rpts/default.aspx, https://datacentral.ksde.gov/default.aspx, and https://www.ksde.gov/data-and-reporting/directories, in addition to the existing live KSDE Special Education and School District Maps roots already preserved on disk. The public Directory Reports app is not just an empty root: its HTML preserves a real `Kansas Educational Directory Reports` home page with `Organizational Directory Reports`, `Educator Directory Reports`, a `Complete Directory` link, and a public district selector that includes `***ALL DISTRICTS***` plus specific district IDs and names such as `D0435 :: ABILENE USD 435`, `D0385 :: ANDOVER USD 385`, `D0409 :: ATCHISON PUBLIC SCHOOLS USD 409`, and many more. The official KSDE Directories page also publishes current annual `Kansas Educational Directory` PDFs for 2025-2026, 2024-2025, and 2023-2024, plus pictorial superintendent directory PDFs. So Kansas now has a concrete first-party district inventory lane. But a live DB reconciliation still shows all 105 Kansas school_district rows pointing at the same statewide placeholder website https://www.ksde.org/Default.aspx?tabid=101, and no reviewed district-owned special-education or student-services leaves are preserved on disk. Kansas education therefore remains blocked, but the next lane should start from the public dropdown and annual directory artifacts rather than from re-reading statewide KSDE roots.';

const LESSON_HEADING = '### Public District Dropdowns Count As Inventory, Not As Routing Proof';
const LESSON_BODY = '*   **Lesson:** If a first-party directory app exposes a live `***ALL DISTRICTS***` dropdown with district IDs and names, treat it as a concrete district inventory artifact and move the next lane to district-owned leaf authoring. Kansas `Directory_Rpts` finally proved the district list was public, but it still did not itself prove county routing or special-education contacts.';

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
    '- The DD authority family is still a uniform transport-denial blocker and did not change in this pass.',
    '- Education is sharper: the public Directory Reports app and annual Kansas Educational Directory PDFs now prove a concrete first-party district inventory lane, but still not county-grade routing or district-owned special-education leaves.',
    '- Future Kansas education repair should start from the public district dropdown and directory PDFs, then attach district-owned local leaves from that inventory.',
  ].join('\n') + '\n';
}

export function generateBatch189KansasDirectoryDropdownRefinementV1() {
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
      query_basis: 'Reviewed current KSDE directory roots plus bounded fetches of the public Directory Reports app and official Directories page to determine whether Kansas already exposes a concrete first-party district inventory for local leaf authoring.',
      sample_count: 4,
      samples: [
        {
          sample_name: 'KSDE Directories page',
          source_url: 'https://www.ksde.gov/data-and-reporting/directories',
          final_url: 'https://www.ksde.gov/data-and-reporting/directories',
          verification_status: 'reviewed',
          source_type: 'official_statewide_directory_root',
          source_table: 'reviewed_live_probe',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The official Directories page publishes current annual Kansas Educational Directory PDFs for 2025-2026, 2024-2025, and 2023-2024, plus pictorial superintendent directories.',
        },
        {
          sample_name: 'Kansas Educational Directory Reports home page',
          source_url: 'https://uapps.ksde.gov/Directory_Rpts/default.aspx',
          final_url: 'https://uapps.ksde.gov/Directory_Rpts/default.aspx',
          verification_status: 'reviewed',
          source_type: 'official_public_directory_app',
          source_table: 'reviewed_live_probe',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The public directory app preserves a real Kansas Educational Directory Reports home page with Organizational Directory Reports, Educator Directory Reports, and a Complete Directory link.',
        },
        {
          sample_name: 'Kansas public district dropdown inventory',
          source_url: 'https://uapps.ksde.gov/Directory_Rpts/default.aspx',
          final_url: 'https://uapps.ksde.gov/Directory_Rpts/default.aspx',
          verification_status: 'reviewed',
          source_type: 'official_public_district_inventory',
          source_table: 'reviewed_live_probe',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The live public district selector includes ***ALL DISTRICTS*** and named options such as D0435 ABILENE USD 435, D0385 ANDOVER USD 385, and D0409 ATCHISON PUBLIC SCHOOLS USD 409, proving the district list is publicly exposed on a first-party surface.',
        },
        {
          sample_name: 'Kansas education DB placeholder inventory',
          source_url: 'https://www.ksde.gov/data-and-reporting/directories',
          final_url: 'https://www.ksde.gov/data-and-reporting/directories',
          verification_status: 'blocked',
          source_type: 'db_reconciliation',
          source_table: 'live_db_reconciliation',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'A live DB reconciliation still shows all 105 Kansas school_district rows pointing at the same statewide placeholder website https://www.ksde.org/Default.aspx?tabid=101 rather than reviewed district-owned local leaves.',
        },
      ],
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: EDUCATION_FAILURE_CODE, next_action: 'use_public_directory_dropdown_and_annual_directory_pdfs_to_author_reviewed_district_owned_special_education_leaves', evidence: EDUCATION_EVIDENCE }
      : row
  ));

  const updatedSummary = {
    ...summary,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'district_or_county_education_routing'
        ? { ...row, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_EVIDENCE, next_action: 'use_public_directory_dropdown_and_annual_directory_pdfs_to_author_reviewed_district_owned_special_education_leaves' }
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
    batch: 'batch_189_kansas_directory_dropdown_refinement_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'kansas',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    public_directory_dropdown_detected: true,
    annual_directory_pdfs_detected: 3,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const report = [
    '# Batch 189 Kansas Directory Dropdown Refinement Report v1',
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
    '- Kansas remains blocked and not index-safe.',
    '- The DD blocker is unchanged and remains transport-final.',
    '- The public education lane is now sharper: KSDE exposes a real district dropdown inventory and annual directory PDFs on first-party surfaces.',
    '- That inventory still does not itself prove county-grade routing or district-owned special-education contacts, so the next lane remains exact district-owned leaf authoring.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, report);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch189KansasDirectoryDropdownRefinementV1();
  console.log(JSON.stringify(result, null, 2));
}
