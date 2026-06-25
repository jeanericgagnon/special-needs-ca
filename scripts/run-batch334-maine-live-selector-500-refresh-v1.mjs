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
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch334_maine_live_selector_500_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch334-maine-live-selector-500-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'maine-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'live_maine_neo_superintendent_selectors_now_materialize_local_rows_but_dhhs_office_html_still_has_no_county_contract';

const EDUCATION_STATUS = 'verified_current_official_neo_superintendent_selectors';
const EDUCATION_REASON = 'Maine education now clears from the live official NEO superintendent selectors. On 2026-06-25 the Superintendent by SAU selector and the Superintendent by Town selector both remained publicly reachable on official Maine DOE hosts, both exposed fresh anti-forgery tokens, and bounded Bangor submits on both routes materialized real local superintendent rows with address, phone, fax, and email on the official host. The sibling Primary Contacts By Organization search/export lane still falls into the NEO CustomError shell, but that no longer blocks district-grade routing because the superintendent selectors themselves now provide reusable local routing rows.';
const EDUCATION_VERIFIED_QUERY_BASIS = 'Reviewed 2026-06-25 the live official Maine superintendent selectors, their fresh anti-forgery tokens, and bounded Bangor materialization submits on both the SAU and Town lanes.';
const EDUCATION_CLEARED_EVIDENCE = 'Reviewed 2026-06-25 official Maine education sources at https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/SAU, https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town, and the official workbook https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx. The Superintendent by SAU selector returned HTTP 200 with title `NEO Contact Search [ v2.0.0.0 - A4 ]` and a fresh `__RequestVerificationToken`; the Town selector returned HTTP 200 with title `NEO Contact Search [ v2.0.0.0 - A1 ]` and its own fresh token; and bounded Bangor submits on both selectors returned HTTP 200 materialized superintendent rows on the official host rather than an error shell. Those Bangor rows preserve `73 Harlow Street Bangor ME 04401`, phone `(207) 262-9125`, fax `(207) 262-9126`, and email `mrobinson@bangorschools.net`, which is sufficient direct local routing evidence for the education family. The sibling Primary Contacts By Organization search/export lane still falls into the NEO `Home/CustomError` shell, but it no longer blocks district-grade routing because the superintendent selectors themselves now return real local rows.';
const EDUCATION_NOTE = 'The sibling Primary Contacts By Organization search/export lane is still unstable in bounded replay and currently lands on the NEO `Home/CustomError` shell, but Maine no longer needs that lane to keep district-grade routing verified.';

const COUNTY_STATUS = 'blocked_district_office_locations_with_towns_but_without_county_crosswalk';
const COUNTY_FAILURE_CODE = 'official_dhhs_office_page_lists_office_towns_but_has_no_county_or_service_area_crosswalk';
const COUNTY_REASON = 'Maine county-local remains blocked for the same reason as the prior pass: the official DHHS District Office Locations page is public and role-bearing and lists named office towns, addresses, phones, emails, and map links, but it still exposes no county-served labels and no service-area crosswalk in public HTML.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-23 live official Maine DHHS District Office Locations page at https://www.maine.gov/dhhs/about/contact/offices. The page preserves district office names, exact office towns and addresses, phones, emails, cross-office program notes, and `Show Map` links for offices such as Bangor, Biddeford, Calais, Caribou, Ellsworth, Machias, Portland, and Skowhegan. But a bounded HTML inspection still exposed zero county names such as Aroostook, Washington, or York, zero county-served labels, and zero service-area fields in the public page itself. The official page therefore remains office-grade evidence without a truthful county-to-office routing contract.';
const COUNTY_NEXT_ACTION = 'find_official_county_or_service_area_crosswalk_for_named_dhhs_office_towns_or_keep_maine_counties_blocked';
const LESSON_HEADING = '### One Recovered Official Selector Can Clear A Family Even If A Sibling Selector Still Errors';
const LESSON_BODY = '*   **Lesson:** If one official local-routing selector starts materializing real local rows again, clear the family from that lane even if a sibling selector on the same host still falls into an error shell. Maine DOE’s Superintendent-by-SAU and Superintendent-by-Town selectors both returned Bangor local rows with address, phone, fax, and email after the Primary Contacts search/export lane still fell into `Home/CustomError`.';

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
    '- Education now clears from the live official Superintendent-by-SAU and Superintendent-by-Town selectors, which both materialize Bangor local rows with address, phone, fax, and email on the official host.',
    '- The sibling Primary Contacts search/export lane still falls into the NEO `Home/CustomError` shell, but it no longer blocks district-grade routing.',
    '- County-local remains blocked because the official DHHS office page still publishes office towns but no county or service-area crosswalk in public HTML.',
  ].join('\n') + '\n';
}

function updateAllStateReport() {
  let text = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  text = text.replace(/- Maine remains blocked on a broader public-but-unmaterialized DOE lane:[^\n]*\n?/g, '');
  const bullet = '- Maine now clears education from the live NEO superintendent selectors, but it remains blocked because DHHS district offices still expose no county/service-area crosswalk for the named office towns.';
  if (!text.includes(bullet)) text = `${text.trimEnd()}\n${bullet}\n`;
  fs.writeFileSync(INPUTS.allStateReport, text);
}

function updateHandoff() {
  let text = fs.readFileSync(INPUTS.handoff, 'utf8');
  text = text.replace(
    '- Maine: `official_maine_workbook_is_stable_mapping_only_and_contact_materialization_lane_still_500_plus_dhhs_office_html_has_no_county_contract`',
    '- Maine: `official_maine_contact_and_superintendent_selectors_are_live_but_current_bangor_materialization_posts_still_return_same_500_shell_plus_dhhs_office_html_has_no_county_contract`'
  );
  text = text.replace(
    '- Maine: `official_maine_selector_and_workbook_are_live_but_current_search_export_posts_still_return_same_500_shell_plus_dhhs_office_html_has_no_county_contract`',
    '- Maine: `official_maine_contact_and_superintendent_selectors_are_live_but_current_bangor_materialization_posts_still_return_same_500_shell_plus_dhhs_office_html_has_no_county_contract`'
  );
  text = text.replace(
    '- Maine: `official_maine_contact_and_superintendent_selectors_are_live_but_current_bangor_materialization_posts_still_return_same_500_shell_plus_dhhs_office_html_has_no_county_contract`',
    '- Maine: `live_maine_neo_superintendent_selectors_now_materialize_local_rows_but_dhhs_office_html_still_has_no_county_contract`'
  );

  const focusSection = `## Current Focus State: Maine

### Blocker Reason

Maine no longer has an education blocker. The live official Superintendent-by-SAU and Superintendent-by-Town selectors on the Maine DOE NEO host both materialize real Bangor local superintendent rows with address, phone, fax, and email on bounded replay. The only remaining critical blocker is \`county_local_disability_resources\`: the official DHHS district office page still lists office towns and contact details but still exposes no county or service-area crosswalk.

### Exact Evidence Needed

- An official DHHS county or service-area crosswalk for office towns like Bangor, Calais, Machias, Portland, or Skowhegan.
- Or, any other official Maine DHHS county-grade office-routing page or export that explicitly assigns counties or service areas to those offices.

### Useful Official URLs Already Tried

- [Maine NEO Primary Contacts By Organization](https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU)
- [Maine NEO Superintendent by SAU](https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/SAU)
- [Maine NEO Town selector](https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town)
- [Maine SAU workbook](https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx)
- [Maine special education landing page](https://www.maine.gov/doe/learning/specialed)
- [Maine DHHS district offices](https://www.maine.gov/dhhs/about/contact/offices)

### Top Remaining Source-Scouting Targets

- Any official DHHS county/service-area crosswalk for the named district-office towns.
- Any official DHHS district-office PDF, spreadsheet, ArcGIS layer, or service-area page that names counties served by Bangor, Calais, Caribou, Ellsworth, Machias, Portland, or Skowhegan.

## Next State Order After Maine

1. Idaho
2. Arizona
3. Massachusetts
4. New Mexico
5. South Dakota
6. Rhode Island
7. Virginia
8. West Virginia
9. North Dakota
10. Wisconsin`;

  text = text.replace(/## Current Focus State:[\s\S]*$/m, focusSection);
  fs.writeFileSync(INPUTS.handoff, `${text.trimEnd()}\n`);
}

function updateLessons() {
  let text = fs.readFileSync(INPUTS.lessons, 'utf8');
  if (!text.includes(LESSON_HEADING)) {
    text = `${text.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`;
    fs.writeFileSync(INPUTS.lessons, text);
  }
}

function buildBatchReport() {
  return [
    '# Batch 334 Maine Live Selector 500 Refresh Report v1',
    '',
    '- state: maine',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- refined_family: district_or_county_education_routing',
    '',
    '## What changed',
    '',
    '- Rechecked the live Primary Contacts selector, Superintendent selectors, and official SAU workbook on 2026-06-25.',
    '- Confirmed the current contact selector still exposes the anti-forgery token, the `OrgId` selector, the `SAUs[*]` hidden inventory, and the literal `action:CSearchBySAU` / `action:SAUExport` submit controls.',
    '- Confirmed fresh Bangor search and export posts on the Primary Contacts lane still fall into the NEO `Home/CustomError` shell.',
    '- Confirmed fresh Bangor submits on both the Superintendent by SAU and Superintendent by Town selectors now materialize local superintendent rows with address, phone, fax, and email on the official host.',
  ].join('\n') + '\n';
}

export function generateBatch334MaineLiveSelector500RefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);
  const allStateAudit = readJson(INPUTS.allStateAudit);

  const updatedSummary = {
    ...summary,
    batch: 'batch334_maine_live_selector_500_refresh_v1',
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 91,
    strong_critical_families: 11,
    weak_critical_families: 1,
    primary_gap_reason: PRIMARY_GAP_REASON,
    critical_gap_families: ['county_local_disability_resources'],
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      district_or_county_education_routing: EDUCATION_STATUS,
      county_local_disability_resources: COUNTY_STATUS,
    },
    final_blockers: (summary.final_blockers || [])
      .filter((blocker) => blocker.family !== 'district_or_county_education_routing')
      .map((blocker) => (
        blocker.family === 'county_local_disability_resources'
          ? { ...blocker, failure_code: COUNTY_FAILURE_CODE, evidence: COUNTY_EVIDENCE, next_action: COUNTY_NEXT_ACTION }
          : blocker
      )),
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, family_status: EDUCATION_STATUS, status_reason: EDUCATION_REASON };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, family_status: COUNTY_STATUS, status_reason: COUNTY_REASON };
    }
    return row;
  });

  const updatedFailureRows = failureRows
    .filter((row) => row.family !== 'district_or_county_education_routing')
    .map((row) => (
      row.family === 'county_local_disability_resources'
        ? { ...row, failure_code: COUNTY_FAILURE_CODE, evidence: COUNTY_EVIDENCE, next_action: COUNTY_NEXT_ACTION }
        : row
    ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: EDUCATION_STATUS,
        query_basis: EDUCATION_VERIFIED_QUERY_BASIS,
        blocker_code: null,
        blocker_evidence: null,
        sample_count: 4,
        samples: [
          {
            sample_name: 'Maine NEO Superintendent by SAU selector',
            source_url: 'https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/SAU',
            final_url: 'https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/SAU',
            verification_status: 'verified',
            source_type: 'official_public_superintendent_selector_inventory',
            source_table: 'batch334_maine_live_selector_500_refresh',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The Superintendent by SAU selector is live with title `NEO Contact Search [ v2.0.0.0 - A4 ]`, exposes a fresh `__RequestVerificationToken`, and accepts `orgid` as the SAU selector.',
          },
          {
            sample_name: 'Maine Bangor superintendent row via SAU selector',
            source_url: 'https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/SAU',
            final_url: 'https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/SAU',
            verification_status: 'verified',
            source_type: 'official_materialized_local_superintendent_row',
            source_table: 'batch334_maine_live_selector_500_refresh',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'A bounded Bangor `orgid=42` submit on the official Superintendent by SAU selector returned a local row with `73 Harlow Street Bangor ME 04401`, phone `(207) 262-9125`, fax `(207) 262-9126`, and email `mrobinson@bangorschools.net`.',
          },
          {
            sample_name: 'Maine NEO Town selector',
            source_url: 'https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town',
            final_url: 'https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town',
            verification_status: 'verified',
            source_type: 'official_public_selector_inventory',
            source_table: 'batch334_maine_live_selector_500_refresh',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The Town selector is live with title `NEO Contact Search [ v2.0.0.0 - A1 ]`, exposes a fresh `__RequestVerificationToken`, and still publishes a municipality picker with `Bangor` as town code `027`.',
          },
          {
            sample_name: 'Maine Bangor superintendent row via Town selector',
            source_url: 'https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town',
            final_url: 'https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town',
            verification_status: 'verified',
            source_type: 'official_materialized_local_superintendent_row',
            source_table: 'batch334_maine_live_selector_500_refresh',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'A bounded Bangor `schoolId=027` submit on the official Superintendent by Town selector also returned a local row with `73 Harlow Street Bangor ME 04401`, phone `(207) 262-9125`, fax `(207) 262-9126`, and email `mrobinson@bangorschools.net`.',
          },
        ],
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: COUNTY_STATUS,
        blocker_code: COUNTY_FAILURE_CODE,
        blocker_evidence: COUNTY_EVIDENCE,
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'county_local_disability_resources') {
      return { ...row, failure_code: COUNTY_FAILURE_CODE, next_action: COUNTY_NEXT_ACTION, evidence: COUNTY_EVIDENCE };
    }
    return row;
  }).filter((row) => row.family !== 'district_or_county_education_routing');

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'maine'
      ? {
          ...row,
          completeness_pct: 91,
          weak_critical_families: 1,
          primary_gap_reason: PRIMARY_GAP_REASON,
        }
      : row
  ));

  const updatedAllStateAudit = {
    ...allStateAudit,
    generatedAt: '2026-06-25T23:55:00.000Z',
    states: allStateAudit.states.map((row) => {
      if (row.stateId !== 'maine') return row;
      return {
        ...row,
        strongCriticalFamilies: 11,
        weakCriticalFamilies: 1,
        completenessPct: 91,
        familyStatuses: {
          ...row.familyStatuses,
          district_or_county_education_routing: EDUCATION_STATUS,
          county_local_disability_resources: COUNTY_STATUS,
        },
        packetBatch: 'batch334_maine_live_selector_500_refresh_v1',
        packetPrimaryGapReason: PRIMARY_GAP_REASON,
      };
    }),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.allStateAudit, updatedAllStateAudit);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  updateAllStateReport();
  updateHandoff();
  updateLessons();

  const batchSummary = {
    batch: 'batch334_maine_live_selector_500_refresh_v1',
    generated_at: '2026-06-25T23:55:00.000Z',
    state: 'maine',
    classification: 'BLOCKED',
    index_safe: false,
    selector_live: true,
    superintendent_sau_live: true,
    town_selector_live: true,
    workbook_live: true,
    contact_search_post_status: 200,
    contact_export_post_status: 200,
    contact_error_shell: true,
    superintendent_sau_post_status: 200,
    superintendent_town_post_status: 200,
    superintendent_materialized: true,
    lessons_changed: true,
  };
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport());
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch334MaineLiveSelector500RefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
