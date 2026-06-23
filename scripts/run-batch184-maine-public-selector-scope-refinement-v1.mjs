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
  educationPacket: path.join(generatedDir, 'maine_district_or_county_education_routing_manual_export_packet_v1.json'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch184_maine_public_selector_scope_refinement_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch184-maine-public-selector-scope-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'maine-california-grade-audit-report-v2.md'),
};

const EDUCATION_REASON = 'Maine now has a narrower official education blocker: the public NEO Town selector, the public Primary Contacts By Organization selector, and the official SAU-by-municipality workbook are all live and reviewable on simple GET requests. The failure is concentrated in the result/export step: once a real OrgId is submitted, the official workflow still returns HTTP 500 before any district-grade contact rows or export file appear. All 16 county education rows still depend on statewide DOE fallbacks, so the next honest lane is reviewed browser/manual capture from the already-live selectors rather than more selector discovery.';

const EDUCATION_EVIDENCE = 'Reviewed 2026-06-23 bounded live official Maine education checks on https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town, https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU, https://neo.maine.gov/doe/neo/SuperSearch/Home/Index, and the official workbook https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx. The public Town selector page is live and reviewable with a full municipality dropdown, the public Primary Contacts By Organization page is live and reviewable with a full organization catalog, and the SAU-by-municipality workbook is still downloadable on the official DOE host. So Maine no longer has a selector-discovery problem. The blocker is narrower: a bounded cookie-backed submit using a real OrgId still returns HTTP 500 and the NEO Contact Search shell before any verified local contact rows or export file appear. Fourteen county rows still point at https://www.maine.gov/doe/learning/specialed and two still point at https://www.maine.gov/doe, so Maine remains blocked on reviewed browser/manual capture from these already-live selectors rather than speculative POST or discovery retries.';

const LESSON_HEADING = '### Separate Live Selector Inventory From Broken Result Actions';
const LESSON_BODY = '*   **Lesson:** If an official search workflow has public selector pages and a downloadable mapping workbook, preserve those as solved inventory and isolate the blocker to the result/export action. Maine’s NEO town selector, org selector, and SAU-by-municipality workbook were all publicly live, so later work should start from manual capture on those selectors instead of rechecking whether the inventory exists.';

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
    '- Education is still blocked, but the selector inventory is now clearly public and complete enough to support manual/browser capture without reopening discovery.',
    '- County-local is still blocked because the DHHS office page remains office-grade only and still lacks county or town coverage boundaries.',
  ].join('\n') + '\n';
}

export function generateBatch184MainePublicSelectorScopeRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const educationPacket = readJson(INPUTS.educationPacket);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, status_reason: EDUCATION_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          failure_code: 'public_selector_inventory_live_but_result_export_actions_return_500',
          evidence: EDUCATION_EVIDENCE,
          next_action: 'use_live_town_and_org_selectors_plus_workbook_for_reviewed_browser_capture_or_manual_export',
        }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'district_or_county_education_routing') return row;
    return {
      ...row,
      blocker_code: 'public_selector_inventory_live_but_result_export_actions_return_500',
      blocker_evidence: EDUCATION_EVIDENCE,
      query_basis: 'Reviewed the live official NEO town selector, the public organization selector, the official workbook, and the bounded failing result step.',
      samples: [
        {
          sample_name: 'Maine NEO Town selector',
          source_url: 'https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town',
          final_url: 'https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town',
          verification_status: 'verified',
          source_type: 'official_public_selector_inventory',
          source_table: 'batch184_maine_public_selector_scope_refinement',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The public Town selector page is live and reviewable and exposes a full municipality dropdown from Abbot through York, proving the selector inventory itself is public.',
        },
        {
          sample_name: 'Maine NEO Primary Contacts By Organization selector',
          source_url: 'https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU',
          final_url: 'https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU',
          verification_status: 'verified',
          source_type: 'official_public_selector_inventory',
          source_table: 'batch184_maine_public_selector_scope_refinement',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The public Primary Contacts By Organization page is live and reviewable and exposes a full organization catalog including Portland Public Schools, York Public Schools, and RSU 60/MSAD 60.',
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
      sample_count: 4,
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          failure_code: 'public_selector_inventory_live_but_result_export_actions_return_500',
          next_action: 'use_live_town_and_org_selectors_plus_workbook_for_reviewed_browser_capture_or_manual_export',
          evidence: EDUCATION_EVIDENCE,
        }
      : row
  ));

  educationPacket.current_problem_metrics.reviewedTownSelectorLive = true;
  educationPacket.current_problem_metrics.reviewedOrgSelectorLive = true;
  educationPacket.current_problem_metrics.workbookStillDownloadable = true;
  educationPacket.current_problem_metrics.selectorDiscoverySolved = true;
  educationPacket.packet_complete_when = 'Every Maine county row either points at reviewed local SAU or district contact evidence or remains explicitly blocked because the result/export step on the already-live public selectors still fails. The selector inventory itself is now proven public and stable enough for manual/browser capture.';
  educationPacket.representative_sources = [
    'https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx',
    'https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town',
    'https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU',
    'https://neo.maine.gov/doe/neo/SuperSearch/Home/Index',
  ];

  const updatedSummary = {
    ...summary,
    primary_gap_reason: 'public_neo_selector_inventory_is_live_but_result_export_actions_return_500_and_dhhs_office_directory_lacks_county_or_town_mapping',
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'district_or_county_education_routing'
        ? {
            ...row,
            failure_code: 'public_selector_inventory_live_but_result_export_actions_return_500',
            evidence: EDUCATION_EVIDENCE,
            next_action: 'use_live_town_and_org_selectors_plus_workbook_for_reviewed_browser_capture_or_manual_export',
          }
        : row
    )),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJson(INPUTS.educationPacket, educationPacket);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch_184_maine_public_selector_scope_refinement_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'maine',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    town_selector_live: true,
    org_selector_live: true,
    workbook_still_downloadable: true,
    result_step_still_blocked: true,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 184 Maine Public Selector Scope Refinement Report v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- refined_family: district_or_county_education_routing',
    '- failure_code: public_selector_inventory_live_but_result_export_actions_return_500',
    '',
    '## Evidence',
    '',
    `- ${EDUCATION_EVIDENCE}`,
    '',
    '## Repair decision',
    '',
    '- Maine remains blocked and not index-safe.',
    '- The Maine NEO selector inventory is no longer the blocker: both public selector pages and the SAU workbook are live and reviewable.',
    '- The failure is narrower and should stay narrow in later work: the result/export step still fails, so the next lane is manual or browser capture from the already-live selectors.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch184MainePublicSelectorScopeRefinementV1();
  console.log(JSON.stringify(result, null, 2));
}
