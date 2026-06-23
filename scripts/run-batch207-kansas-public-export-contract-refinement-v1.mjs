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
  packet: path.join(generatedDir, 'kansas_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch207_kansas_public_export_contract_refinement_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch207-kansas-public-export-contract-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'kansas-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'public_ksde_directory_export_contract_exists_but_not_yet_converted_into_reviewed_district_owned_special_education_leaves';
const FAILURE_CODE = PRIMARY_GAP_REASON;
const NEXT_ACTION = 'use_public_directory_export_county_join_and_directory_artifacts_to_author_reviewed_district_owned_special_education_leaves';

const STATUS_REASON = 'Kansas now has a stronger first-party education inventory lane than a static dropdown alone. The public KSDE Directory Reports app accepts a reviewed submit contract and returns a real Excel attachment for district reports, while the official Directories page publishes annual Kansas Educational Directory PDFs. A bounded live export for D0435 Abilene USD 435 produced an official `Directory.xls` workbook whose extracted strings preserve county and district contact fields such as `County Name`, `Superintendent Address`, `Phone`, plus Abilene/Dickinson and district email domains like `dsprinkle@abileneschools.org`. That means the public stack already yields a county-to-district join plus district-domain hints on a first-party surface. Kansas still remains blocked because those export-backed district rows are not yet converted into reviewed district-owned special-education or student-services leaves on disk.';

const EVIDENCE = 'Reviewed 2026-06-23 bounded live official Kansas education probes on https://uapps.ksde.gov/Directory_Rpts/default.aspx and https://www.ksde.gov/data-and-reporting/directories, then reproduced one exact public report export using the live ASP.NET form contract (`__VIEWSTATE`, `__VIEWSTATEGENERATOR`, `__EVENTVALIDATION`, `ctl00$MainContent$ddDistricts=D0435`, `ctl00$MainContent$RadioGroup1=RadioUSD1`, `ctl00$MainContent$rblFormat=Excel`, `ctl00$MainContent$btnPrintSection1=Run Report`). The public Directory Reports app returned HTTP 200 on the same official host with `content-type: application/vnd.ms-excel` and `content-disposition: attachment ; filename=Directory.xls`. Bounded string extraction from that first-party export preserved the report title `SCHOOL DISTRICT SUPERINTENDENTS AND BOARD PRESIDENTS`, column names including `County Name`, `Superintendent Address`, `Phone`, and district-specific values for Abilene USD 435 such as `Abilene`, `Dickinson`, `785-263-2630`, and district email domains like `dsprinkle@abileneschools.org`, `cwest@abileneschools.org`, and `acornell@abileneschools.org`. The official KSDE Directories page also still publishes annual Kansas Educational Directory PDFs. Kansas therefore now has a public export-backed county join lane plus district-domain hints, but it remains blocked because no reviewed district-owned special-education or student-services leaves are yet preserved on disk for those districts.';

const LESSON_HEADING = '### Public ASP.NET Directory Exports Beat Dropdown Scraping When The Submit Contract Is Stable';
const LESSON_BODY = "*   **Lesson:** If a first-party ASP.NET directory app exposes stable hidden fields and a submit button, reproduce the public export directly instead of scraping dropdown HTML alone. Kansas's KSDE Directory Reports app returned a real `Directory.xls` attachment once `__VIEWSTATE`, `__VIEWSTATEGENERATOR`, `__EVENTVALIDATION`, and the public report parameters were posted together.";

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
    '- Education is still the only remaining critical blocker, but the public first-party lane is now stronger than a dropdown-only inventory.',
    '- The KSDE Directory Reports app returns a real district export with county and district contact fields, which is enough to drive district-owned leaf authoring without reopening statewide KSDE roots.',
    '- Kansas still does not clear until those export-backed district rows are converted into reviewed district-owned special-education or student-services leaves.',
  ].join('\n') + '\n';
}

export function generateBatch207KansasPublicExportContractRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const packet = readJson(INPUTS.packet);
  const queueRows = readJsonl(INPUTS.queue);

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

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, family_status: 'blocked_public_ksde_export_contract_without_reviewed_local_leaves', status_reason: STATUS_REASON }
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
          family_status: 'blocked_public_ksde_export_contract_without_reviewed_local_leaves',
          query_basis: 'Reviewed current KSDE directory roots plus one reproduced public district export to determine whether Kansas already exposes a first-party county join and district-domain hint lane for local leaf authoring.',
          blocker_code: FAILURE_CODE,
          blocker_evidence: EVIDENCE,
          sample_count: 5,
          samples: [
            {
              sample_name: 'KSDE Directories page',
              source_url: 'https://www.ksde.gov/data-and-reporting/directories',
              final_url: 'https://www.ksde.gov/data-and-reporting/directories',
              verification_status: 'reviewed',
              source_type: 'official_statewide_directory_root',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The official Directories page publishes current annual Kansas Educational Directory PDFs for 2025-2026, 2024-2025, and 2023-2024.',
            },
            {
              sample_name: 'Kansas Educational Directory Reports home page',
              source_url: 'https://uapps.ksde.gov/Directory_Rpts/default.aspx',
              final_url: 'https://uapps.ksde.gov/Directory_Rpts/default.aspx',
              verification_status: 'reviewed',
              source_type: 'official_public_directory_app',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The public directory app preserves a real Kansas Educational Directory Reports home page with public selectors, report types, and a Run Report submit contract.',
            },
            {
              sample_name: 'Kansas public district dropdown inventory',
              source_url: 'https://uapps.ksde.gov/Directory_Rpts/default.aspx',
              final_url: 'https://uapps.ksde.gov/Directory_Rpts/default.aspx',
              verification_status: 'reviewed',
              source_type: 'official_public_district_inventory',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The live public district selector includes ***ALL DISTRICTS*** and named options such as D0435 ABILENE USD 435, D0385 ANDOVER USD 385, and D0409 ATCHISON PUBLIC SCHOOLS USD 409.',
            },
            {
              sample_name: 'Abilene USD 435 public export workbook',
              source_url: 'https://uapps.ksde.gov/Directory_Rpts/default.aspx',
              final_url: 'https://uapps.ksde.gov/Directory_Rpts/default.aspx',
              verification_status: 'reviewed',
              source_type: 'official_public_export_contract',
              source_table: 'bounded_live_kansas_export_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'A public Run Report POST returned `Directory.xls` with fields including County Name, Superintendent Address, Phone, and Abilene/Dickinson values plus district email domains like dsprinkle@abileneschools.org.',
            },
            {
              sample_name: 'Kansas education DB placeholder inventory',
              source_url: 'https://www.ksde.gov/data-and-reporting/directories',
              final_url: 'https://www.ksde.gov/data-and-reporting/directories',
              verification_status: 'blocked',
              source_type: 'db_reconciliation',
              source_table: 'live_db_reconciliation',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'A live DB reconciliation still shows all 105 Kansas school_district rows pointing at the same statewide placeholder website rather than reviewed district-owned local leaves.',
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

  const updatedPacket = {
    ...packet,
    repair_lane: 'public_export_backed_district_leaf_repair',
    current_problem_metrics: {
      ...packet.current_problem_metrics,
      liveDirectoryRoots: 4,
      publicExportContractVerified: true,
    },
    root_domains_to_review: [
      'district-owned Kansas USD domains derived from the live KSDE Directory Reports export contract plus the annual directory artifacts',
      ...packet.root_domains_to_review,
    ],
    packet_complete_when: 'Every Kansas county row either points at a reviewed district-owned education-routing leaf authored from the public KSDE export-backed district inventory or remains explicitly blocked where no district-owned local contract has been preserved.',
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJson(INPUTS.packet, updatedPacket);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch_207_kansas_public_export_contract_refinement_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'kansas',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    public_export_contract_verified: true,
    sample_export_district: 'D0435 Abilene USD 435',
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const report = [
    '# Batch 207 Kansas Public Export Contract Refinement Report v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
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
    '- The public KSDE directory lane is now stronger than a dropdown-only inventory: a reproduced public export yields county and district contact fields on a first-party report.',
    '- That export-backed inventory still must be converted into reviewed district-owned special-education or student-services leaves before Kansas can clear.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, report);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch207KansasPublicExportContractRefinementV1();
  console.log(JSON.stringify(result, null, 2));
}
