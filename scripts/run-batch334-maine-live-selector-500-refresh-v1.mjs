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

const PRIMARY_GAP_REASON = 'official_maine_contact_and_superintendent_selectors_are_live_but_current_bangor_materialization_posts_still_return_same_500_shell_plus_dhhs_office_html_has_no_county_contract';

const EDUCATION_STATUS = 'blocked_live_contact_and_superintendent_selectors_but_current_materialization_posts_still_return_same_500_shell';
const EDUCATION_FAILURE_CODE = 'official_contact_and_superintendent_selectors_are_live_but_current_bangor_materialization_posts_still_return_same_500_shell';
const EDUCATION_REASON = 'Maine education remains blocked, but the live official contract is broader and still fails at the same materialization step. On 2026-06-25 the Primary Contacts By Organization selector, the Superintendent by SAU selector, the Superintendent by Town selector, and the official SAU workbook all remained publicly reachable on official Maine DOE hosts. The current contact selector still exposes a live `OrgId` selector plus the `SAUs[*]` hidden inventory, but the anti-forgery token referenced by the older packet is no longer present in the current page contract. Fresh bounded Bangor submits across those live first-party lanes still all return the same generic NEO Contact Search HTTP 500 error shell instead of reusable local contact rows, so the county-grade education materialization lane is still not recovered.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-25 official Maine education sources at https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU, https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/SAU, https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town, and the official workbook https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx. The contact selector returned HTTP 200 with title `NEO Contact Search [ v2.0.0.0 - A3 ]`; the Superintendent by SAU selector returned HTTP 200 with title `NEO Contact Search [ v2.0.0.0 - A4 ]`; the Town selector returned HTTP 200 with title `NEO Contact Search [ v2.0.0.0 - A1 ]`; and the workbook remained downloadable from the official DOE host. A bounded HTML inspection still found the live `OrgId` selector and the `SAUs[*]` field family on the contact selector page, but no current anti-forgery token. Fresh Bangor submits to the live contact search, contact export, Superintendent by SAU, and Superintendent by Town lanes all returned the same `Sorry, an error occurred while processing your request.` HTTP 500 shell. Maine therefore still has a public selector/workbook inventory lane but not a recovered county-grade education contact materialization lane.';
const EDUCATION_NEXT_ACTION = 'preserve_manual_export_or_browser_capture_lane_until_any_live_first_party_maine_education_rows_materialize';

const COUNTY_STATUS = 'blocked_district_office_locations_with_towns_but_without_county_crosswalk';
const COUNTY_FAILURE_CODE = 'official_dhhs_office_page_lists_office_towns_but_has_no_county_or_service_area_crosswalk';
const COUNTY_REASON = 'Maine county-local remains blocked for the same reason as the prior pass: the official DHHS District Office Locations page is public and role-bearing and lists named office towns, addresses, phones, emails, and map links, but it still exposes no county-served labels and no service-area crosswalk in public HTML.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-23 live official Maine DHHS District Office Locations page at https://www.maine.gov/dhhs/about/contact/offices. The page preserves district office names, exact office towns and addresses, phones, emails, cross-office program notes, and `Show Map` links for offices such as Bangor, Biddeford, Calais, Caribou, Ellsworth, Machias, Portland, and Skowhegan. But a bounded HTML inspection still exposed zero county names such as Aroostook, Washington, or York, zero county-served labels, and zero service-area fields in the public page itself. The official page therefore remains office-grade evidence without a truthful county-to-office routing contract.';
const COUNTY_NEXT_ACTION = 'find_official_county_or_service_area_crosswalk_for_named_dhhs_office_towns_or_keep_maine_counties_blocked';

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
    '- Education remains blocked because the official contact selector, superintendent selectors, and workbook are still public, but current Bangor materialization submits across those first-party lanes still return the same HTTP 500 error shell instead of reusable local rows.',
    '- County-local remains blocked because the official DHHS office page still publishes office towns but no county or service-area crosswalk in public HTML.',
  ].join('\n') + '\n';
}

function updateAllStateReport() {
  let text = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const bullet = '- Maine remains blocked on a broader public-but-unmaterialized DOE lane: the contact selector, superintendent selectors, and workbook are live, but current Bangor materialization submits across those first-party pages still return the same HTTP 500 NEO shell, while DHHS district offices still expose no county/service-area crosswalk.';
  if (!text.includes(bullet)) {
    text = `${text.trimEnd()}\n${bullet}\n`;
  }
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

  const focusSection = `## Current Focus State: Maine

### Blocker Reason

Maine still has two critical blockers, and the highest-priority one remains \`district_or_county_education_routing\`. The official DOE selector/workbook lane is live and public across multiple first-party pages: the Primary Contacts By Organization selector, the Superintendent by SAU selector, the Superintendent by Town selector, and the SAU workbook all load on official Maine hosts. But the actual materialization lane is still broken in bounded low-token mode. Fresh Bangor submits across those first-party pages still return the same HTTP 500 NEO error shell instead of reusable local contact rows. The county-local blocker remains separate: the DHHS district office page lists office towns and contact details but still exposes no county or service-area crosswalk.

### Exact Evidence Needed

- A current official Maine DOE search or export response on any of the live first-party contact or superintendent selectors that returns real local rows instead of the generic HTTP 500 shell.
- Or, an official Maine DOE workbook/export with county-grade contact fields rather than only municipality-to-organization mapping.
- Separately, an official DHHS county or service-area crosswalk for office towns like Bangor, Calais, Machias, Portland, or Skowhegan.

### Useful Official URLs Already Tried

- [Maine NEO Primary Contacts By Organization](https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU)
- [Maine NEO Superintendent by SAU](https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/SAU)
- [Maine NEO Town selector](https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town)
- [Maine SAU workbook](https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx)
- [Maine special education landing page](https://www.maine.gov/doe/learning/specialed)
- [Maine DHHS district offices](https://www.maine.gov/dhhs/about/contact/offices)

### Top Remaining Source-Scouting Targets

- Any current official Maine DOE contact or superintendent selector result that yields real local rows instead of the generic HTTP 500 shell.
- Any official DOE workbook or adjacent downloadable file that includes county, phone, email, superintendent, or special-education contact fields.
- Any official DHHS county/service-area crosswalk for the named district-office towns.

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
    '- Confirmed the current selector contract still exposes the `OrgId` selector and `SAUs[*]` hidden inventory, but no longer exposes the anti-forgery token referenced by the older packet.',
    '- Confirmed fresh Bangor search and export posts still both return the same HTTP 500 NEO error shell instead of materialized local contact rows.',
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
    primary_gap_reason: PRIMARY_GAP_REASON,
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      district_or_county_education_routing: EDUCATION_STATUS,
      county_local_disability_resources: COUNTY_STATUS,
    },
    final_blockers: (summary.final_blockers || []).map((blocker) => {
      if (blocker.family === 'district_or_county_education_routing') {
        return {
          ...blocker,
          failure_code: EDUCATION_FAILURE_CODE,
          evidence: EDUCATION_EVIDENCE,
          next_action: EDUCATION_NEXT_ACTION,
        };
      }
      if (blocker.family === 'county_local_disability_resources') {
        return {
          ...blocker,
          failure_code: COUNTY_FAILURE_CODE,
          evidence: COUNTY_EVIDENCE,
          next_action: COUNTY_NEXT_ACTION,
        };
      }
      return blocker;
    }),
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

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_EVIDENCE, next_action: EDUCATION_NEXT_ACTION };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, failure_code: COUNTY_FAILURE_CODE, evidence: COUNTY_EVIDENCE, next_action: COUNTY_NEXT_ACTION };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: EDUCATION_STATUS,
        query_basis: 'Reviewed 2026-06-25 the live official Maine contact selector, superintendent selectors, SAU workbook, and fresh Bangor materialization submits.',
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
            source_table: 'batch334_maine_live_selector_500_refresh',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The selector is live with title `NEO Contact Search [ v2.0.0.0 - A3 ]` and still exposes the `OrgId` selector plus the `SAUs[*]` hidden inventory, but no current anti-forgery token.',
          },
          {
            sample_name: 'Maine NEO Superintendent by SAU selector',
            source_url: 'https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/SAU',
            final_url: 'https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/SAU',
            verification_status: 'verified',
            source_type: 'official_public_superintendent_selector_inventory',
            source_table: 'batch334_maine_live_selector_500_refresh',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The Superintendent by SAU selector is live with title `NEO Contact Search [ v2.0.0.0 - A4 ]` and exposes the schoolId selector.',
          },
          {
            sample_name: 'Maine NEO Town selector',
            source_url: 'https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town',
            final_url: 'https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town',
            verification_status: 'verified',
            source_type: 'official_public_selector_inventory',
            source_table: 'batch334_maine_live_selector_500_refresh',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The Town selector is live with title `NEO Contact Search [ v2.0.0.0 - A1 ]` and still exposes a municipality picker.',
          },
          {
            sample_name: 'Maine SAU workbook',
            source_url: 'https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx',
            final_url: 'https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx',
            verification_status: 'verified',
            source_type: 'official_downloadable_mapping_workbook',
            source_table: 'batch334_maine_live_selector_500_refresh',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official DOE host still serves the SAU workbook, but it remains a mapping workbook rather than a materialized contact export.',
          },
          {
            sample_name: 'Maine Bangor search post',
            source_url: 'https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU',
            final_url: 'https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU',
            verification_status: 'blocked',
            source_type: 'official_raw_search_500_shell',
            source_table: 'batch334_maine_live_selector_500_refresh',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'A fresh Bangor `OrgId=42` search post returned HTTP 500 and the same generic `Sorry, an error occurred while processing your request.` NEO shell instead of local contact rows.',
          },
          {
            sample_name: 'Maine Bangor export post',
            source_url: 'https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU',
            final_url: 'https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU',
            verification_status: 'blocked',
            source_type: 'official_raw_export_500_shell',
            source_table: 'batch334_maine_live_selector_500_refresh',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'A fresh Bangor export post returned the same HTTP 500 NEO shell rather than `SAUSearchResults.xls` or a contact export.',
          },
          {
            sample_name: 'Maine Bangor superintendent materialization posts',
            source_url: 'https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/SAU',
            final_url: 'https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/SAU',
            verification_status: 'blocked',
            source_type: 'official_raw_superintendent_500_shell',
            source_table: 'batch334_maine_live_selector_500_refresh',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'Fresh Bangor submits to both Superintendent by SAU and Superintendent by Town returned the same generic `Sorry, an error occurred while processing your request.` NEO shell instead of superintendent rows.',
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
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, failure_code: EDUCATION_FAILURE_CODE, next_action: EDUCATION_NEXT_ACTION, evidence: EDUCATION_EVIDENCE };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, failure_code: COUNTY_FAILURE_CODE, next_action: COUNTY_NEXT_ACTION, evidence: COUNTY_EVIDENCE };
    }
    return row;
  });

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'maine'
      ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  const updatedAllStateAudit = {
    ...allStateAudit,
    generatedAt: '2026-06-24T23:55:00.000Z',
    states: allStateAudit.states.map((row) => {
      if (row.stateId !== 'maine') return row;
      return {
        ...row,
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

  const batchSummary = {
    batch: 'batch334_maine_live_selector_500_refresh_v1',
    generated_at: '2026-06-25T07:10:00.000Z',
    state: 'maine',
    classification: 'BLOCKED',
    index_safe: false,
    selector_live: true,
    superintendent_sau_live: true,
    town_selector_live: true,
    workbook_live: true,
    search_post_status: 500,
    export_post_status: 500,
    superintendent_post_status: 500,
    lessons_changed: false,
  };
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport());
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch334MaineLiveSelector500RefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
