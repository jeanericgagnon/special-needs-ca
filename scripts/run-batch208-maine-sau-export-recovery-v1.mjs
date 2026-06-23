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
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch208_maine_sau_export_recovery_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch208-maine-sau-export-recovery-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'maine-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'public_maine_sau_export_contract_now_works_but_not_yet_materialized_county_grade_and_dhhs_office_html_has_no_county_contract';
const EDUCATION_FAILURE_CODE = 'public_sau_export_contract_works_but_not_yet_materialized_into_county_grade_local_routing';
const EDUCATION_NEXT_ACTION = 'use_live_orgids_workbook_and_working_sau_export_to_materialize_reviewed_local_district_contacts_county_by_county';
const EDUCATION_STATUS_REASON = 'Maine now has a materially stronger official education lane than a generic hidden-form error blocker. The public Primary Contacts By Organization selector is live, the Town selector is live, the official SAU-by-municipality workbook is still downloadable, and a bounded 2026-06-23 replay with the anti-forgery token, hidden SAU inventory, OrgId, and the named `action:SAUExport` submit returned a real first-party Excel attachment rather than a generic error shell. That export preserves role-bearing contact rows such as `504 Coordinator`, plus phone, email, town, and SAU fields on the official host. Maine education remains blocked only because the working export contract is not yet materialized into reviewed county-grade district routing coverage across all 16 counties.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-23 official Maine education sources at https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU, https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town, and the official workbook https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx. A fresh bounded replay of the live public form included the anti-forgery `__RequestVerificationToken`, the full hidden `SAUs[*]` inventory, `OrgId=42`, and the named submit actions exposed on the page (`action:CSearchBySAU` and `action:SAUExport`). The Search submit now returns the official ContactSearchBySAU page without a raw transport failure, and the Export submit returns HTTP 200 with `content-type: application/ms-excel` and `content-disposition: attachment; filename=SAUSearchResults.xls`. The first-party export preserves local contact rows on the official host, including `504 Coordinator`, `Phone`, `Email`, `Town`, and `SAU` columns plus Bangor Public Schools values such as Daniel Chadbourne, dchadbourne@bangorschools.net, 73 Harlow Street, Bangor, ME 04401. Maine therefore no longer has a generic hidden-form error blocker for education. It remains blocked only because this working OrgId/workbook/export contract is not yet materialized into reviewed county-grade district routing rows across all counties.';

const LESSON_HEADING = '### MVC Search Forms May Need The Named Submit Action, Not Just The Hidden Inventory';
const LESSON_BODY = "*   **Lesson:** If an official MVC form exposes an anti-forgery token and multiple named submit actions, replay the exact submit name instead of only posting the hidden inventory. Maine's DOE contact search started working once `__RequestVerificationToken` and the named `action:SAUExport` submit were included with the SAU payload.";

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
    '- Education is stronger than before: the official export contract now works and returns role-bearing local contact rows on the first-party DOE host.',
    '- Maine still does not clear because that OrgId/workbook/export lane is not yet materialized into reviewed county-grade district routing coverage across all counties.',
    '- County-local remains blocked because the official DHHS office page still publishes zero county, town, or service-area mapping fields in public HTML.',
  ].join('\n') + '\n';
}

export function generateBatch208MaineSauExportRecoveryV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const queueRows = readJsonl(INPUTS.queue);

  const updatedSummary = {
    ...summary,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'district_or_county_education_routing'
        ? { ...row, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_EVIDENCE, next_action: EDUCATION_NEXT_ACTION }
        : row
    )),
  };

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'maine'
      ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, family_status: 'blocked_live_public_sau_export_contract_not_materialized_county_grade', status_reason: EDUCATION_STATUS_REASON }
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
          family_status: 'blocked_live_public_sau_export_contract_not_materialized_county_grade',
          query_basis: 'Reviewed the live official Maine Org selector HTML, Town selector, workbook, and a working named-submit SAU export replay on the first-party DOE host.',
          blocker_code: EDUCATION_FAILURE_CODE,
          blocker_evidence: EDUCATION_EVIDENCE,
          sample_count: 5,
          samples: [
            {
              sample_name: 'Maine NEO Primary Contacts By Organization selector',
              source_url: 'https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU',
              final_url: 'https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU',
              verification_status: 'verified',
              source_type: 'official_public_org_selector_inventory',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The public selector HTML itself exposes real OrgIds and names including Bangor Public Schools.',
            },
            {
              sample_name: 'Maine NEO Town selector',
              source_url: 'https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town',
              final_url: 'https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town',
              verification_status: 'verified',
              source_type: 'official_public_selector_inventory',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The public Town selector page is live and reviewable and exposes a full municipality dropdown.',
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
              sample_name: 'Maine SAU export workbook',
              source_url: 'https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU',
              final_url: 'https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU',
              verification_status: 'reviewed',
              source_type: 'official_first_party_sau_export',
              source_table: 'bounded_live_maine_export_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'A named `action:SAUExport` submit returned `SAUSearchResults.xls` with local contact fields including Contact Type, Phone, Email, Town, SAU, and a 504 Coordinator row for Bangor Public Schools.',
            },
            {
              sample_name: 'Maine county-grade education remainder',
              source_url: 'https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU',
              final_url: 'https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU',
              verification_status: 'blocked',
              source_type: 'coverage_gap',
              source_table: 'packet_reconciliation',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The working export contract is not yet materialized into reviewed county-grade district routing rows across all 16 Maine counties.',
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

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch_208_maine_sau_export_recovery_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'maine',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    public_sau_export_contract_verified: true,
    sample_orgid: 42,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const report = [
    '# Batch 208 Maine SAU Export Recovery Report v1',
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
    '- The official DOE education lane is stronger than before: the named SAU export submit now returns a real first-party workbook with local contact rows.',
    '- Maine education still does not clear until that OrgId/workbook/export lane is turned into reviewed county-grade routing coverage across all counties.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, report);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch208MaineSauExportRecoveryV1();
  console.log(JSON.stringify(result, null, 2));
}
