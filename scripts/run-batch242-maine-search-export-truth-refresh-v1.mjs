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
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  packet: path.join(generatedDir, 'maine_district_or_county_education_routing_manual_export_packet_v1.json'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch242_maine_search_export_truth_refresh_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch242-maine-search-export-truth-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'maine-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'public_maine_sau_selectors_and_workbook_are_live_but_search_and_export_replays_still_500_and_dhhs_office_html_has_no_county_contract';
const EDUCATION_STATUS = 'blocked_live_public_sau_selectors_and_workbook_but_search_and_export_replays_still_500';
const EDUCATION_FAILURE_CODE = 'live_public_sau_selectors_and_workbook_exist_but_search_and_export_replays_still_500';
const EDUCATION_NEXT_ACTION = 'preserve_manual_export_or_browser_capture_lane_and_do_not_treat_search_or_export_replays_as_recovered';
const EDUCATION_STATUS_REASON = 'Maine still has a materially stronger official education lane than a selector-discovery blocker: the public Primary Contacts By Organization selector is live, the Town selector is live, and the official SAU-by-municipality workbook is still downloadable. But fresh bounded 2026-06-23 replays using the exact first-party inputs (`__RequestVerificationToken`, the full hidden `SAUs[*]` inventory, `OrgId=42`, and the named `action:CSearchBySAU=Search` plus `action:SAUExport=Export to Excel` submits) both return HTTP 500 with only the generic NEO Contact Search error shell instead of local contact rows or `SAUSearchResults.xls`. Maine education therefore remains blocked until reviewed browser/manual capture or district-owned local leaves materialize county-grade routing across all 16 counties.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-23 official Maine education sources at https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU, https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town, and the official workbook https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx. The public selector HTML still exposes a real anti-forgery token, the full hidden `SAUs[*]` inventory, `OrgId` as the organization selector, and the exact first-party submit controls `action:CSearchBySAU` (`Search`) and `action:SAUExport` (`Export to Excel`). But fresh bounded Bangor replays with `OrgId=42` and those literal named submit values both return HTTP 500 and only the generic NEO Contact Search error shell rather than local contact rows or `SAUSearchResults.xls`. Maine therefore no longer has a selector-discovery problem, but it also cannot truthfully claim a recovered raw search or export lane in the current environment.';

const LESSON_HEADING = '### Freeze Selector Lanes When Both Named Submits Hit The Same Error Shell';
const LESSON_BODY = '*   **Lesson:** If a public official selector still exposes a valid token, full hidden inventory, and named submit buttons, replay both the search and export submits once before preserving any “maybe recovered” lane. Maine NEO kept `action:CSearchBySAU` and `action:SAUExport`, but both Bangor replays returned the same HTTP 500 `Sorry, an error occurred` shell, so the whole selector lane stayed manual/browser-only.';

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
    '- Education still has a real public selector/workbook inventory lane on the official DOE host.',
    '- Maine education does not clear because both current named raw replays return the same HTTP 500 error shell instead of reusable local contact rows.',
    '- County-local remains blocked because the official DHHS office page still publishes zero county, town, or service-area mapping fields in public HTML.',
  ].join('\n') + '\n';
}

export function generateBatch242MaineSearchExportTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const queueRows = readJsonl(INPUTS.queue);
  const packet = readJson(INPUTS.packet);

  const updatedSummary = {
    ...summary,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'district_or_county_education_routing'
        ? { ...row, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_EVIDENCE, next_action: EDUCATION_NEXT_ACTION }
        : row
    )),
    familyStatuses: {
      ...summary.familyStatuses,
      district_or_county_education_routing: EDUCATION_STATUS,
    },
  };

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'maine'
      ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, family_status: EDUCATION_STATUS, status_reason: EDUCATION_STATUS_REASON }
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
          family_status: EDUCATION_STATUS,
          query_basis: 'Reviewed the live official Maine Org selector HTML, Town selector, workbook, and fresh bounded raw search/export replays that both end in the same HTTP 500 error shell.',
          blocker_code: EDUCATION_FAILURE_CODE,
          blocker_evidence: EDUCATION_EVIDENCE,
          sample_count: 6,
          samples: [
            {
              sample_name: 'Maine NEO Primary Contacts By Organization selector',
              source_url: 'https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU',
              final_url: 'https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU',
              verification_status: 'verified',
              source_type: 'official_public_org_selector_inventory',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The public selector HTML remains live and exposes the `OrgId` selector plus the named submit actions for Search and Export.',
            },
            {
              sample_name: 'Maine NEO Town selector',
              source_url: 'https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town',
              final_url: 'https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town',
              verification_status: 'verified',
              source_type: 'official_public_selector_inventory',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The public Town selector page is live and reviewable and still exposes a full municipality dropdown.',
            },
            {
              sample_name: 'Maine SAU by Municipality workbook',
              source_url: 'https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx',
              final_url: 'https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx',
              verification_status: 'verified',
              source_type: 'official_downloadable_mapping_workbook',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The official DOE host still serves the SAU-by-municipality workbook, so municipality-to-SAU mapping remains publicly downloadable.',
            },
            {
              sample_name: 'Maine SAU search raw replay remainder',
              source_url: 'https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU',
              final_url: 'https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU',
              verification_status: 'blocked',
              source_type: 'official_raw_search_500_shell',
              source_table: 'bounded_live_maine_search_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'A fresh Bangor `OrgId=42` replay with the literal `action:CSearchBySAU=Search` value returned HTTP 500 and the generic `Sorry, an error occurred while processing your request.` shell instead of local contact rows.',
            },
            {
              sample_name: 'Maine SAU export raw replay remainder',
              source_url: 'https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU',
              final_url: 'https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU',
              verification_status: 'blocked',
              source_type: 'official_raw_export_500_shell',
              source_table: 'bounded_live_maine_export_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'A fresh Bangor `OrgId=42` replay with the literal `action:SAUExport=Export to Excel` value returned HTTP 500 and the same generic NEO Contact Search error shell rather than `SAUSearchResults.xls` or local contact rows.',
            },
            {
              sample_name: 'Maine county-grade education remainder',
              source_url: 'https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU',
              final_url: 'https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU',
              verification_status: 'blocked',
              source_type: 'coverage_gap',
              source_table: 'packet_reconciliation',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The public inventory lane exists, but both current named raw replays still fail app-side before yielding reusable county-grade local routing rows across all 16 Maine counties.',
            },
          ],
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: EDUCATION_FAILURE_CODE, next_action: EDUCATION_NEXT_ACTION, evidence: EDUCATION_EVIDENCE }
      : row
  ));

  const updatedPacket = {
    ...packet,
    current_problem_metrics: {
      ...packet.current_problem_metrics,
      publicSearchMaterializedInRawLane: false,
      publicExportMaterializedInRawLane: false,
      sessionedSearch500Confirmed: true,
      sessionedExport500Confirmed: true,
      sessionedOrgIdTested: 42,
    },
    packet_complete_when: 'Every Maine county row either points at reviewed local SAU or district contact evidence or remains explicitly blocked because the live public selectors and municipality workbook are public but both named raw search/export replays still return the same HTTP 500 error shell.',
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
    batch: 'batch_242_maine_search_export_truth_refresh_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'maine',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    sample_orgid: 42,
    raw_search_recovered: false,
    raw_export_recovered: false,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const report = [
    '# Batch 242 Maine Search+Export Truth Refresh Report v1',
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
    '- The official DOE selector/workbook inventory is still live and useful for future browser/manual capture.',
    '- The raw low-token lane is now sharper: both named search and export submits fail with the same app-side HTTP 500 error shell for Bangor `OrgId=42`.',
    '- County-local remains separately blocked because the official DHHS office page still has no county or service-area crosswalk.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, report);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch242MaineSearchExportTruthRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
