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
  failure: path.join(generatedDir, 'maine_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'maine_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'maine_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'maine-california-grade-audit-report-v2.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch263_maine_workbook_mapping_only_refinement_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch263-maine-workbook-mapping-only-refinement-report-v1.md'),
};

const PRIMARY_GAP_REASON = 'official_maine_workbook_is_stable_mapping_only_and_contact_materialization_lane_still_500_plus_dhhs_office_html_has_no_county_contract';
const EDUCATION_FAILURE_CODE = 'official_workbook_is_mapping_only_and_search_export_contact_lane_still_500';
const EDUCATION_FAMILY_STATUS = 'blocked_workbook_proves_mapping_only_but_contact_materialization_lane_still_500';
const EDUCATION_STATUS_REASON = 'Maine now has a narrower and more exact education blocker: the official SAU workbook is live and stable, but it only preserves mapping fields like Municipality, TownCode, GEOCode, OrganizationId, and OrganizationName. It does not preserve county-grade contact routing fields. The public contact-search/export lane is still the materialization path for local contact rows, and fresh bounded named replays still return only the generic HTTP 500 error shell.';
const EDUCATION_NEXT_ACTION = 'preserve_manual_export_or_browser_capture_lane_until_first_party_contact_rows_materialize';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-23 official Maine education sources at https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU, https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town, and the official workbook https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx. The official workbook is live, stable, and directly inspectable. Its workbook tables prove a real municipality-to-organization mapping contract, but not a local contact contract: `ByMunicipality_IncludingEUT` and `ByMunicipality_NoEUT` carry only `YearCode`, `Municipality`, `TownCode`, `GEOCode`, `OrganizationId`, and `OrganizationName`; `BySAU_IncludingEUT` and `BySAU_NoEUT` carry only the same mapping fields in reversed order; and `SAUs Only & Charters` adds only `Organization Type`. No workbook table preserves county names, superintendent contacts, special-education contacts, phones, emails, or district routing rows. The public selector HTML still exposes a real anti-forgery token, the full hidden `SAUs[*]` inventory, `OrgId` as the organization selector, and the exact first-party submit controls `action:CSearchBySAU` (`Search`) and `action:SAUExport` (`Export to Excel`). But fresh bounded Bangor replays with `OrgId=42` and those literal named submit values still return HTTP 500 and only the generic NEO Contact Search error shell rather than local contact rows or `SAUSearchResults.xls`. Maine therefore no longer has a discovery blocker and does have a stable official mapping workbook, but the county-grade contact materialization lane is still not recovered.';

const LESSON_HEADING = '### A Stable Official Mapping Workbook Still Does Not Clear County-Grade Routing If It Lacks Contact Fields';
const LESSON_BODY = '*   **Lesson:** If an official workbook is live and stable, inspect its actual table headers before treating it as a recovered routing export. Maine DOE’s SAU workbook proved municipality-to-organization mapping, but it carried no county, phone, email, or special-education contact fields, so county-grade routing still depended on the broken contact-search/export lane.';

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
    '- But the workbook only proves municipality-to-organization mapping and not county-grade contact routing, while both current named raw replays still return the same HTTP 500 error shell instead of local contact rows.',
    '- County-local remains blocked because the official DHHS office page publishes named office towns, but still no county or service-area mapping fields in public HTML.',
  ].join('\n') + '\n';
}

function updateHandoff() {
  const current = fs.readFileSync(INPUTS.handoff, 'utf8');
  const replacement = current
    .replace('- Maine: `public_maine_sau_selectors_and_workbook_are_live_but_search_and_export_replays_still_500_and_dhhs_office_html_has_no_county_contract`', '- Maine: `official_maine_workbook_is_stable_mapping_only_and_contact_materialization_lane_still_500_plus_dhhs_office_html_has_no_county_contract`')
    .replace('## Current Focus State: Minnesota', '## Current Focus State: Maine')
    .replace(
      '`district_or_county_education_routing` remains the top Minnesota blocker in the state queue. The official MDE-ORG description page and root are live, but the district, county, contact, and analytics routes still only return title-bearing Radware shells with no real county-grade directory or export content. Minnesota therefore still lacks a reproducible official district-routing contract in the low-token lane.',
      '`district_or_county_education_routing` remains the top Maine blocker in the state queue. The official DOE selector pages and SAU workbook are live, but the workbook only carries municipality-to-organization mapping fields and the named contact-search/export replays still return the same HTTP 500 error shell. Maine therefore still lacks a reproducible county-grade local contact contract in the low-token lane.'
    )
    .replace(
      '- Any first-party Minnesota MDE child route or export contract that exposes real district, county, or contact content without collapsing into a Radware shell.\n- Or, a stable official MDE analytics/export lane that preserves reproducible county-grade organization data.\n- Or, an official DHS county-and-tribal office contract that is reviewable without the current Radware challenge.\n- Live roots and good page titles are still not enough if the actionable child routes contain no real routing data.',
      '- Any first-party Maine DOE contact row lane that materializes real local contacts from the live selector/workbook contract.\n- Or, an official Maine workbook or export that includes county-grade contact fields rather than only municipality-to-organization mappings.\n- Or, an official DHHS county or service-area crosswalk for the named district office towns.\n- A stable mapping workbook alone is still not enough if it lacks contact fields.'
    )
    .replace(
      '- [Minnesota MDE description page](https://education.mn.gov/MDE/about/SchOrg/)\n- [Minnesota MDE-ORG root](https://pub.education.mn.gov/MdeOrgView/)\n- [Minnesota districts route](https://pub.education.mn.gov/MdeOrgView/districts/index)\n- [Minnesota counties route](https://pub.education.mn.gov/MdeOrgView/reference/county)\n- [Minnesota contacts search route](https://pub.education.mn.gov/MdeOrgView/search/searchContacts)\n- [Minnesota contact types route](https://pub.education.mn.gov/MdeOrgView/contact/contactTypeList)\n- [Minnesota analytics route](https://pub.education.mn.gov/MDEAnalytics/Data.jsp)\n- [Minnesota DHS county and tribal offices replacement](https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices/)\n- [Minnesota DHS county tribal nation directory replacement](https://mn.gov/dhs/people-we-serve/adults/services/disability-services/partners-and-providers/county-tribal-nation-directory/)',
      '- [Maine NEO Primary Contacts By Organization](https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU)\n- [Maine NEO Town selector](https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town)\n- [Maine SAU workbook](https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx)\n- [Maine special education landing page](https://www.maine.gov/doe/learning/specialed)\n- [Maine DHHS district offices](https://www.maine.gov/dhhs/about/contact/offices)'
    )
    .replace(
      '- Any official MDE child route or export endpoint that returns real district, county, or contact records instead of a title-bearing Radware shell.\n- Any stable first-party downloadable district/county organization file linked from MDE-ORG or MDE analytics.\n- Any official DHS county-and-tribal office contract that is reviewable without browser validation.',
      '- Any official Maine DOE contact export or search result that returns real local contact rows instead of the generic HTTP 500 NEO shell.\n- Any official DOE workbook or adjacent file that includes county or contact fields, not just Municipality, TownCode, GEOCode, OrganizationId, and OrganizationName.\n- Any official DHHS county/service-area crosswalk for office towns like Bangor, Calais, Machias, Portland, or Skowhegan.'
    )
    .replace(
      '## Next State Order After Minnesota\n\n1. Maine\n2. Idaho\n3. Arizona\n4. Massachusetts\n5. Oregon\n6. Oklahoma\n7. Utah\n8. New Hampshire\n9. New Mexico\n10. New York',
      '## Next State Order After Maine\n\n1. Idaho\n2. Arizona\n3. Massachusetts\n4. Oregon\n5. Oklahoma\n6. Utah\n7. New Hampshire\n8. New Mexico\n9. New York\n10. North Carolina'
    );

  fs.writeFileSync(INPUTS.handoff, replacement);
}

export function generateBatch263MaineWorkbookMappingOnlyRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: PRIMARY_GAP_REASON,
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      district_or_county_education_routing: EDUCATION_FAMILY_STATUS,
    },
    final_blockers: (summary.final_blockers || []).map((blocker) => (
      blocker.family === 'district_or_county_education_routing'
        ? {
            ...blocker,
            failure_code: EDUCATION_FAILURE_CODE,
            evidence: EDUCATION_EVIDENCE,
            next_action: EDUCATION_NEXT_ACTION,
          }
        : blocker
    )),
  };

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
          query_basis: 'Reviewed the live official Maine selector pages, workbook table headers, and fresh bounded contact-search/export replays.',
          blocker_code: EDUCATION_FAILURE_CODE,
          blocker_evidence: EDUCATION_EVIDENCE,
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: EDUCATION_FAILURE_CODE, next_action: EDUCATION_NEXT_ACTION, evidence: EDUCATION_EVIDENCE }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  updateHandoff();

  writeJson(OUTPUTS.summary, {
    batch: 'batch263_maine_workbook_mapping_only_refinement_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'maine',
    classification: 'BLOCKED',
    index_safe: false,
    workbook_live: true,
    workbook_mapping_only_headers_confirmed: true,
    contact_materialization_lane_still_500: true,
    lesson_added: lessonAdded,
  });

  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Batch 263 Maine Workbook Mapping-Only Refinement Report v1',
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
      '- The official workbook is real and stable.',
      '- But it is only a mapping workbook, and the local contact materialization lane is still not recovered.',
    ].join('\n') + '\n',
  );

  return updatedSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch263MaineWorkbookMappingOnlyRefinementV1();
  console.log(JSON.stringify(result, null, 2));
}
