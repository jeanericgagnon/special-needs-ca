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
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
  packet: path.join(generatedDir, 'maine_district_or_county_education_routing_manual_export_packet_v1.json'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch219_maine_sau_blocker_truth_alignment_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch219-maine-sau-blocker-truth-alignment-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'maine-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON =
  'public_maine_sau_selectors_and_workbook_are_live_but_raw_export_replay_still_500_and_dhhs_office_html_has_no_county_contract';
const EDUCATION_FAILURE_CODE =
  'public_maine_sau_selectors_are_live_but_raw_export_replay_still_500_and_county_grade_contacts_remain_unmaterialized';
const EDUCATION_NEXT_ACTION =
  'use_reviewed_browser_capture_or_district_owned_leaves_to_materialize_county_grade_contacts_because_raw_sau_export_replay_still_500s';
const EDUCATION_FAMILY_STATUS =
  'blocked_live_public_sau_selectors_and_workbook_but_raw_export_replay_still_500';
const EDUCATION_STATUS_REASON =
  'The official Maine DOE Primary Contacts By Organization selector is public, the Town selector is public, and the official SAU-by-municipality workbook is still downloadable. But a fresh bounded 2026-06-23 raw replay with the anti-forgery token, full hidden SAU inventory, OrgId=42, and the named submit actions still does not yield reusable local contact rows in this lane: both `action:CSearchBySAU` and `action:SAUExport` end in HTTP 500 or shell-only responses instead of a stable first-party contact export. Maine education therefore remains blocked until reviewed browser capture or district-owned local leaves materialize county-grade routing across all 16 counties.';
const EDUCATION_EVIDENCE =
  'Reviewed 2026-06-23 official Maine education sources at https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU, https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town, and the official workbook https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx. The public selector HTML still exposes `__RequestVerificationToken`, live OrgIds such as `42` for Bangor Public Schools, and the named submit actions `action:CSearchBySAU` and `action:SAUExport`, and the official workbook still parses with municipality-to-OrganizationId mappings. But a fresh bounded raw replay in this lane with the anti-forgery token, full hidden SAU inventory, OrgId=42, and each named submit still failed to produce stable role-bearing contact rows: the POST lane returned HTTP 500 or shell-only HTML instead of a reusable first-party export. Maine therefore no longer has a discovery blocker for education, but it still does have a materialization blocker because the public selector/workbook contract does not currently yield county-grade local routing rows in the low-token raw lane.';

const LESSON_HEADING =
  '### Public Selectors And Mapping Workbooks Are Not Enough If The Export Postback Still Fails';
const LESSON_BODY =
  "*   **Lesson:** If an official selector page and mapping workbook are both public but the exact postback lane still returns HTTP 500 or shell-only HTML in bounded replay, keep the family blocked on materialization rather than upgrading it to a working export contract. Maine's DOE SAU selector exposed OrgIds and the municipality workbook, but the named export/search submits still failed in the raw lane.";

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
    '- Education has real official discovery primitives: the public selectors are live and the municipality workbook still downloads from the DOE host.',
    '- Maine education still does not clear because the raw postback lane remains unstable in bounded replay and has not yielded reusable county-grade local contact rows in this environment.',
    '- County-local remains blocked because the official DHHS office page still publishes zero county, town, or service-area mapping fields in public HTML.',
  ].join('\n') + '\n';
}

export function generateBatch219MaineSauBlockerTruthAlignmentV1() {
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
      ...(summary.familyStatuses || {}),
      district_or_county_education_routing: EDUCATION_FAMILY_STATUS,
    },
  };

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'maine'
      ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, family_status: EDUCATION_FAMILY_STATUS, status_reason: EDUCATION_STATUS_REASON }
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
          family_status: EDUCATION_FAMILY_STATUS,
          query_basis: 'Reviewed the live official Maine Org selector HTML, Town selector, workbook, and a bounded raw postback replay that still failed to return stable local contact rows on the first-party DOE host.',
          blocker_code: EDUCATION_FAILURE_CODE,
          blocker_evidence: EDUCATION_EVIDENCE,
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
              evidence_snippet: 'The public selector HTML itself exposes live OrgIds and names including Bangor Public Schools and the anti-forgery token needed for the official postback lane.',
            },
            {
              sample_name: 'Maine NEO Town selector',
              source_url: 'https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town',
              final_url: 'https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town',
              verification_status: 'verified',
              source_type: 'official_public_selector_inventory',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The public Town selector page is live and reviewable and exposes a full municipality dropdown for the DOE search workflow.',
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
              sample_name: 'Maine SAU export raw replay remainder',
              source_url: 'https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU',
              final_url: 'https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU',
              verification_status: 'blocked',
              source_type: 'raw_postback_materialization_gap',
              source_table: 'bounded_live_maine_export_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'A bounded raw replay with OrgId=42 and the named submit actions still returned HTTP 500 or shell-only HTML instead of reusable local contact rows.',
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
      ...(packet.current_problem_metrics || {}),
      boundedPostReplayFailures: 4,
      sessionedPost500Confirmed: true,
      publicExportMaterializedInRawLane: false,
    },
    packet_complete_when:
      'Every Maine county row either points at reviewed local SAU or district contact evidence or remains explicitly blocked because the live public selectors and municipality workbook are public but the bounded raw postback lane still fails to return reusable local contact rows.',
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
    batch: 'batch219_maine_sau_blocker_truth_alignment_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'maine',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    public_selectors_live: true,
    municipality_workbook_live: true,
    raw_export_materialized: false,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const report = [
    '# Batch 219 Maine SAU Blocker Truth Alignment Report v1',
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
    '- Kept Maine BLOCKED.',
    '- Preserved the official selector and workbook as real discovery primitives.',
    '- Removed the overclaim that the raw export contract is already working in this lane.',
    '- Repointed the next action toward reviewed browser capture or district-owned local leaves instead of pretending the raw export lane is scrape-ready.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, report);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch219MaineSauBlockerTruthAlignmentV1();
  console.log(JSON.stringify(result, null, 2));
}
