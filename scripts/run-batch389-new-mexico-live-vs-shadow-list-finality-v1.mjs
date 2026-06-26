import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'new-mexico_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'new-mexico_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'new-mexico_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'new-mexico_verified_sources_v1.jsonl'),
  report: path.join(docsGeneratedDir, 'new-mexico-california-grade-audit-report-v2.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch389_new_mexico_live_vs_shadow_list_finality_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch389-new-mexico-live-vs-shadow-list-finality-report-v1.md'),
};

const BATCH = 'batch389_new_mexico_live_vs_shadow_list_finality_v1';
const FAILURE_CODE =
  'official_webed_sharepoint_lists_and_six_public_workbooks_verified_live_but_no_county_crosswalk_or_rec_service_area_contract';
const DISTRICT_STATUS =
  'blocked_official_sharepoint_lists_and_six_public_workbooks_live_but_verified_county_crosswalk_still_missing';
const NEXT_ACTION = 'author_official_county_crosswalk_from_webed_directory_or_rec_contract';
const VR_FAILURE_CODE = 'official_dvr_root_returns_401_without_reviewed_public_alternate';
const VR_NEXT_ACTION = 'browser_assisted_or_review_alternate_official_vr_root';
const VR_EVIDENCE =
  'Reviewed 2026-06-25 the New Mexico VR blocker artifacts plus one more bounded live official probe. The exact official DVR root `https://www.dvr.nm.gov/` still returns HTTP 401 Unauthorized in bounded fetches and remains the only reviewed first-party VR host in the state packet. A bounded likely-official workforce successor probe on `https://www.dws.state.nm.us/` now returns a live `Request Rejected` shell rather than a reviewable public VR lane, and the New Mexico official-domain registry still carries no reviewed alternate VR domain. The NM unresolved-roles ledger still shows both `vocational_rehabilitation` and `pre_ets` with `no_reviewed_allowed_domains`. New Mexico VR therefore remains blocked on missing reviewed alternate official-root evidence after the 401 lane, not on a broader discovery gap.';

const DISTRICT_REASON =
  'Reviewed 2026-06-25 one more bounded official New Mexico education directory pass on the live PED-managed SharePoint host. The official `2017 NM Schools` list is still live and REST-backed, and the public workbook stack is broader than the earlier packet captured: `NM Schools.xlsx`, `Superintendents.xlsx`, `REC Directors.xlsx`, `Elementary School Principals.xlsx`, `Middle School Principals.xlsx`, and `High School Principals.xlsx` all download successfully from the same official host. A follow-up schema and folder inventory pass also closed the remaining uncertainty on that host: the public `Document Library` contains only those six workbook files and `SitePages` contains only `Home.aspx`, `RECHome.aspx`, `How To Use This Library.aspx`, `Home1.aspx`, and `untitled_1.aspx`, with no separate county-crosswalk page. The official `RECHome.aspx` page does surface one more exact PED leaf, `REC Executive Directors Directory – New Mexico Public Education Department`, but a bounded 12-second replay of that `webnew.ped.state.nm.us` page still did not yield a reviewable public REC service-area contract. A final bounded API pass tightened the row-level truth further: the live 935-row `2017 NM Schools` list exposes only `Title` plus `Column2` through `Column13` on public row payloads, corresponding to district, location, address, city, state, zip, level, type, status, and phone columns, with no county field on actual rows. The same host also exposes a separate zero-item shadow `NM Schools` schema with a `County Name` field, but that list has `ItemCount=0` and cannot satisfy county-grade public routing. `Superintendents.xlsx` preserves district names, codes, contacts, and addresses, but no county field. Fresh bounded workbook inspection now confirms `REC Directors.xlsx` headers are only `REC`, `Executive Director Name`, `Mailing Address`, `Physical Address`, `Phone`, `Fax`, and `Email address`, with no county or service-area field. The elementary, middle, and high school principal workbooks each preserve school/district/contact columns, but no county field. The public `RECHome.aspx` page is also live and still groups districts under REC headings rather than exposing counties or REC service-area labels. New Mexico education therefore remains blocked on a missing official county-to-district or county-to-REC crosswalk, not on absence of public PED directory artifacts.';

const DISTRICT_EVIDENCE =
  'Reviewed 2026-06-25 bounded official New Mexico PED SharePoint surfaces on `https://webed.ped.state.nm.us/sites/schooldirectory/SitePages/Home.aspx`, `https://webed.ped.state.nm.us/sites/schooldirectory/Lists/2017%20NM%20Schools/AllItems.aspx`, the public SharePoint REST inventory and field schema for that list family, `https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/NM%20Schools.xlsx`, `https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/Superintendents.xlsx`, `https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/REC%20Directors.xlsx`, `https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/Elementary%20School%20Principals.xlsx`, `https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/Middle%20School%20Principals.xlsx`, `https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/High%20School%20Principals.xlsx`, `https://webed.ped.state.nm.us/sites/schooldirectory/SitePages/RECHome.aspx`, and the exact PED leaf `https://webnew.ped.state.nm.us/information/rec-executive-directors-directory/` surfaced from that REC page. The official SharePoint host is genuinely live and materially useful, but every public list and workbook still omits county or REC service-area fields, and the bounded replay of the PED REC executive-directors leaf did not yield a reviewable public service-area contract within 12 seconds. A final bounded API pass tightened the public-list evidence further: the live 935-row `2017 NM Schools` list at GUID `ed760a23-c290-4b26-8fec-4f94210cf7c3` exposes public row payload keys `Title`, `Column2` through `Column13`, corresponding to district, location, address, city, state, zip, level, type, status, and phone only, with no county field on real rows. The same host also exposes a separate zero-item shadow `NM Schools` schema whose fields include `County Name`, but that list has `ItemCount=0` and therefore does not provide a public county-grade routing contract. The public `Document Library` inventory still closes at six workbook files and `SitePages` closes at five public pages, none of which is a county crosswalk or REC service-area contract. `Superintendents.xlsx` exposes district contact columns only. Fresh bounded workbook inspection confirms `REC Directors.xlsx` headers are only `REC`, `Executive Director Name`, `Mailing Address`, `Physical Address`, `Phone`, `Fax`, and `Email address`, with no county or REC service-area column. The principal workbooks expose district/location/contact columns only. `RECHome.aspx` still groups districts under REC headings without county labels or service-area text. New Mexico education therefore remains blocked on a missing official county-to-district or county-to-REC crosswalk, not on absence of public PED education inventory.';

const LESSON_HEADING =
  '### Shadow SharePoint Schemas Do Not Count If The Live List Rows Still Omit The Field';
const LESSON_BODY =
  '*   **Lesson:** If a SharePoint host exposes a helpful field on a zero-row shadow list or schema, verify that the same field exists on the actual live row contract before treating the blocker as cleared. New Mexico\'s WebED host exposed a separate zero-item `NM Schools` schema with `County Name`, but the real 935-row `2017 NM Schools` list still materialized only `Title` and `Column2` through `Column13`, so county-grade routing stayed blocked.';

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

function writeText(filePath, text) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text);
}

function main() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const reportText = fs.readFileSync(INPUTS.report, 'utf8');
  const handoffText = fs.readFileSync(INPUTS.handoff, 'utf8');
  const lessonsText = fs.readFileSync(INPUTS.lessons, 'utf8');

  summary.batch = BATCH;
  for (const blocker of summary.final_blockers || []) {
    if (blocker.family === 'district_or_county_education_routing') {
      blocker.failure_code = FAILURE_CODE;
      blocker.evidence = DISTRICT_EVIDENCE;
      blocker.next_action = NEXT_ACTION;
    } else if (blocker.family === 'vocational_rehabilitation_pre_ets') {
      blocker.failure_code = VR_FAILURE_CODE;
      blocker.evidence = VR_EVIDENCE;
      blocker.next_action = VR_NEXT_ACTION;
    }
  }

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, family_status: DISTRICT_STATUS, status_reason: DISTRICT_REASON }
      : row.family === 'vocational_rehabilitation_pre_ets'
        ? { ...row, status_reason: VR_EVIDENCE }
        : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: FAILURE_CODE, evidence: DISTRICT_EVIDENCE, next_action: NEXT_ACTION }
      : row.family === 'vocational_rehabilitation_pre_ets'
        ? { ...row, failure_code: VR_FAILURE_CODE, evidence: VR_EVIDENCE, next_action: VR_NEXT_ACTION }
        : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return {
        ...row,
        query_basis: 'Reviewed 2026-06-25 the official DVR root, the NM domain registry, and one bounded likely-official workforce successor probe.',
        blocker_code: VR_FAILURE_CODE,
        blocker_evidence: VR_EVIDENCE,
        samples: [
          {
            sample_name: 'New Mexico DVR root',
            source_url: 'https://www.dvr.nm.gov/',
            final_url: 'https://www.dvr.nm.gov/',
            verification_status: 'blocked',
            source_type: 'official_root_401',
            source_table: 'batch389_new_mexico_live_vs_shadow_list_finality_v1',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The exact official DVR root still returned HTTP 401 Unauthorized in bounded live review.',
          },
          {
            sample_name: 'Likely workforce successor probe',
            source_url: 'https://www.dws.state.nm.us/',
            final_url: 'https://www.dws.state.nm.us/',
            verification_status: 'blocked',
            source_type: 'likely_official_successor_probe_without_reviewable_vr_leaf',
            source_table: 'batch389_new_mexico_live_vs_shadow_list_finality_v1',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'A bounded likely-official workforce successor probe on the live DWS root returned a `Request Rejected` shell rather than a reviewed public vocational-rehabilitation or Pre-ETS leaf.',
          },
        ],
      };
    }
    if (row.family !== 'district_or_county_education_routing') return row;
    const preservedSamples = row.samples.filter((sample) => ![
      '2017 NM Schools GUID and item count',
      '2017 NM Schools row payload keys',
      'Zero-item shadow NM Schools schema',
    ].includes(sample.sample_name));
    return {
      ...row,
      query_basis: 'Reviewed 2026-06-25 the full official WebED SharePoint list and workbook stack, then verified the live 935-row list payload and the separate zero-item shadow schema for county-grade routing fields.',
      evidence_strength: 'weak',
      sample_count: 12,
      blocker_code: FAILURE_CODE,
      blocker_evidence: DISTRICT_EVIDENCE,
      samples: [
        preservedSamples[0],
        preservedSamples[1],
        {
          sample_name: '2017 NM Schools GUID and item count',
          source_url: "https://webed.ped.state.nm.us/sites/schooldirectory/_api/web/lists(guid'ed760a23-c290-4b26-8fec-4f94210cf7c3')?$select=Title,ItemCount,RootFolder/ServerRelativeUrl&$expand=RootFolder",
          final_url: "https://webed.ped.state.nm.us/sites/schooldirectory/_api/web/lists(guid'ed760a23-c290-4b26-8fec-4f94210cf7c3')?$select=Title,ItemCount,RootFolder/ServerRelativeUrl&$expand=RootFolder",
          verification_status: 'blocked',
          source_type: 'official_public_rest_list_identity',
          source_table: BATCH,
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet: 'The official REST metadata confirms the live list title is `NM Schools`, `ItemCount: 935`, and `RootFolder: /sites/schooldirectory/Lists/2017 NM Schools`.',
        },
        {
          sample_name: '2017 NM Schools row payload keys',
          source_url: "https://webed.ped.state.nm.us/sites/schooldirectory/_api/web/lists(guid'ed760a23-c290-4b26-8fec-4f94210cf7c3')/items?$top=1",
          final_url: "https://webed.ped.state.nm.us/sites/schooldirectory/_api/web/lists(guid'ed760a23-c290-4b26-8fec-4f94210cf7c3')/items?$top=1",
          verification_status: 'blocked',
          source_type: 'official_public_rest_list_row_without_county_field',
          source_table: BATCH,
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet: 'The live row payload exposes `Title` and `Column2` through `Column13` plus metadata keys, with no county field present on the actual public row contract.',
        },
        {
          sample_name: 'Zero-item shadow NM Schools schema',
          source_url: "https://webed.ped.state.nm.us/sites/schooldirectory/_api/web/lists/GetByTitle('NM%20Schools')/Fields?$select=Title,InternalName,Hidden&$filter=Hidden%20eq%20false",
          final_url: "https://webed.ped.state.nm.us/sites/schooldirectory/_api/web/lists/GetByTitle('NM%20Schools')/Fields?$select=Title,InternalName,Hidden&$filter=Hidden%20eq%20false",
          verification_status: 'blocked',
          source_type: 'official_shadow_schema_not_live_contract',
          source_table: BATCH,
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet: 'A separate `NM Schools` schema exposes a `County Name` field, but it is not the live 935-row routing list and cannot substitute for county-grade public rows.',
        },
        ...preservedSamples.slice(2),
      ].slice(0, 12),
    };
  });
  const finalVerifiedRows = updatedVerifiedRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    return {
      ...row,
      sample_count: 5,
      query_basis:
        'Reviewed 2026-06-25 the current official HCA `Field Offices` page, which now preserves county-to-office service-area assignments directly in public HTML across all 33 New Mexico counties.',
      samples: [
        ...(row.samples || []),
        {
          sample_name: 'Bernalillo and Sandoval county office assignment',
          source_url: 'https://www.hca.nm.gov/lookingforassistance/field_offices/',
          final_url: 'https://www.hca.nm.gov/lookingforassistance/field_offices/',
          verification_status: 'verified',
          source_type: 'official_county_service_area_row',
          source_table: 'batch363_new_mexico_current_field_offices_remainder_clear_v1',
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet:
            '`Albuquerque Office County Office 2 - Serving Bernalillo, Los Alamos & Sandoval Counties` preserves a direct county-to-office service area contract on the live official HCA host.',
        },
      ].slice(0, 5),
    };
  });

  let updatedReport = reportText;
  updatedReport = updatedReport.replace(
    /- district_or_county_education_routing: blocked_official_sharepoint_lists_and_six_public_workbooks_live_but_verified_county_crosswalk_still_missing \([\s\S]*?New Mexico education therefore remains blocked on a missing official county-to-district or county-to-REC crosswalk, not on absence of public PED directory artifacts\.\)/,
    `- district_or_county_education_routing: ${DISTRICT_STATUS} (${DISTRICT_REASON})`,
  );
  updatedReport = updatedReport.replace(
    /- district_or_county_education_routing: official_webed_sharepoint_lists_and_six_public_workbooks_verified_live_but_no_county_crosswalk_or_rec_service_area_contract :: [\s\S]*?New Mexico education therefore remains blocked on a missing official county-to-district or county-to-REC crosswalk, not on absence of public PED education inventory\./,
    `- district_or_county_education_routing: ${FAILURE_CODE} :: ${DISTRICT_EVIDENCE}`,
  );
  if (!updatedReport.includes('The live 935-row `2017 NM Schools` list is now explicitly distinguished')) {
    updatedReport = updatedReport.replace(
      '- The live official WebED host is now stronger than a single-workbook blocker: the public SharePoint list, REST inventory, REC grouping page, and six public workbooks are all reviewable on the PED-managed host.',
      '- The live official WebED host is now stronger than a single-workbook blocker: the public SharePoint list, REST inventory, REC grouping page, and six public workbooks are all reviewable on the PED-managed host.\n- The live 935-row `2017 NM Schools` list is now explicitly distinguished from a separate zero-item shadow `NM Schools` schema: only the live list counts, and its public row payload still lacks any county field.',
    );
  }

  const blockedStatesSection = `## Current Blocked States

- Alaska: \`reviewed_live_dpa_offices_page_still_only_groups_regions_while_raw_health_host_403_persists_and_dfcs_adds_no_borough_or_census_area_contract\`
- Arizona: \`ahcccs_county_local_contract_still_missing_and_arizona_education_now_resolves_coconino_via_caviat_504_but_mohave_alt_leaf_still_needs_official_county_attachment_and_yavapai_still_lacks_role_leaf\`
- Idaho: \`remaining_idaho_camas_and_clark_surfaces_now_reduce_to_wrong_role_contact_board_roster_title_ix_or_general_education_notice_leaves_without_special_education_or_student_services_routing\`
- Maine: \`official_dhhs_nav_stack_and_official_maine_search_still_expose_office_addresses_and_labels_but_no_county_or_service_area_contract\`
- Massachusetts: \`official_dese_export_plus_census_county_subdivision_crosswalk_clears_education_and_reviewed_dds_locality_capture_covers_13_of_14_counties_but_suffolk_remains_unresolved\`
- New Hampshire: \`official_nh_dhhs_education_and_vr_host_families_plus_diagnostic_robots_sitemaps_still_return_access_denied_shell_and_saved_dhhs_replacement_hosts_remain_dns_dead\`
- New Mexico: \`official_webed_sharepoint_lists_and_six_public_workbooks_are_live_but_still_expose_no_county_field_or_rec_service_area_contract_and_official_dvr_root_still_returns_401_without_reviewed_public_alternate\`
- Rhode Island: \`generic_or_statewide_evidence_used_where_local_required\`
- South Dakota: \`current_dhs_host_exposes_no_public_county_or_local_office_contract_for_south_dakota_county_local_disability_routing\`
- Wyoming: \`wde_idea_evidence_is_now_public_but_no_reviewable_county_to_district_special_education_crosswalk_or_disability_specific_county_resource_contract\``;

  const currentFocusSection = `## Current Focus State: New Mexico

### Blocker Reason

\`district_or_county_education_routing\` remains the highest-priority New Mexico blocker. The official \`2017 NM Schools\` list is still live and REST-backed, and the public workbook stack is broader than the earlier packet captured: \`NM Schools.xlsx\`, \`Superintendents.xlsx\`, \`REC Directors.xlsx\`, \`Elementary School Principals.xlsx\`, \`Middle School Principals.xlsx\`, and \`High School Principals.xlsx\` all download successfully from the same official host. A follow-up schema and folder inventory pass also closed the remaining uncertainty on that host: the public \`Document Library\` contains only those six workbook files and \`SitePages\` contains only \`Home.aspx\`, \`RECHome.aspx\`, \`How To Use This Library.aspx\`, \`Home1.aspx\`, and \`untitled_1.aspx\`, with no separate county-crosswalk page. A final bounded API pass tightened the crucial distinction on the host: the live 935-row \`2017 NM Schools\` list exposes only district/location/contact columns on actual public rows, while a separate zero-item shadow \`NM Schools\` schema does expose a \`County Name\` field but cannot satisfy county-grade routing because it has no live rows. \`Superintendents.xlsx\` preserves district contacts only. \`REC Directors.xlsx\` preserves REC contact rows only. The principal workbooks preserve school and contact columns only. \`RECHome.aspx\` still groups districts under REC headings without county labels or REC service-area text. New Mexico remains BLOCKED because the public official PED stack still lacks a truthful county-to-district or county-to-REC crosswalk.

### Exact Evidence Needed

- Any official PED-managed county-to-district crosswalk, county column, county selector, or county-keyed export on the live WebED host.
- Any official PED-managed REC service-area artifact that explicitly labels counties served by each REC.
- Any official district-owned or REC-owned local special-education routing leaf that proves county-grade coverage without inference.

### Useful Official URLs Already Tried

- [PED SharePoint school directory home](https://webed.ped.state.nm.us/sites/schooldirectory/SitePages/Home.aspx)
- [2017 NM Schools list](https://webed.ped.state.nm.us/sites/schooldirectory/Lists/2017%20NM%20Schools/AllItems.aspx)
- [2017 NM Schools live-list metadata](https://webed.ped.state.nm.us/sites/schooldirectory/_api/web/lists(guid'ed760a23-c290-4b26-8fec-4f94210cf7c3')?$select=Title,ItemCount,RootFolder/ServerRelativeUrl&$expand=RootFolder)
- [NM Schools workbook](https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/NM%20Schools.xlsx)
- [Superintendents workbook](https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/Superintendents.xlsx)
- [REC Directors workbook](https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/REC%20Directors.xlsx)
- [Elementary School Principals workbook](https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/Elementary%20School%20Principals.xlsx)
- [Middle School Principals workbook](https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/Middle%20School%20Principals.xlsx)
- [High School Principals workbook](https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/High%20School%20Principals.xlsx)
- [REC home page](https://webed.ped.state.nm.us/sites/schooldirectory/SitePages/RECHome.aspx)
- [Special Education Bureau page](https://webnew.ped.state.nm.us/bureaus/special-education/)

### Top Remaining Source-Scouting Targets

- Any live WebED list, workbook, or site page with an explicit county column or county-keyed filter.
- Any live WebED row contract, not just a shadow schema, that actually materializes county on public rows.
- Any official REC service-area contract with county labels on the PED-managed host or REC-owned official hosts.
- Any official district-owned local special-education or student-services leaf that can clear counties without relying on statewide PED exports.

## Next State Order After New Mexico

1. Arizona
2. New Hampshire`;

  let updatedHandoff = handoffText.replace(/## Current Blocked States[\s\S]*$/, `${blockedStatesSection}
${currentFocusSection}
`);

  let updatedLessons = lessonsText;
  if (!updatedLessons.includes(LESSON_HEADING)) {
    updatedLessons = `${updatedLessons.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`;
  }

  writeJson(INPUTS.summary, summary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, finalVerifiedRows);
  writeText(INPUTS.report, updatedReport);
  writeText(INPUTS.handoff, updatedHandoff);
  writeText(INPUTS.lessons, updatedLessons);

  writeJson(OUTPUTS.batchSummary, {
    batch: BATCH,
    state: 'new-mexico',
    classification: summary.classification,
    index_safe: summary.index_safe,
    primary_gap_reason: summary.primary_gap_reason,
    live_list_guid: 'ed760a23-c290-4b26-8fec-4f94210cf7c3',
    live_list_item_count: 935,
    live_list_public_row_columns: ['Title', 'Column2', 'Column3', 'Column4', 'Column5', 'Column6', 'Column7', 'Column8', 'Column9', 'Column10', 'Column11', 'Column12', 'Column13'],
    shadow_schema_has_county_name: true,
    shadow_schema_item_count: 0,
    blocker_changed: false,
    conclusion: 'New Mexico remains blocked because the live 935-row WebED list still omits county on actual public rows, and a separate zero-item shadow schema cannot satisfy county-grade routing.',
  });

  writeText(OUTPUTS.batchReport, [
    '# Batch 389 New Mexico Live vs Shadow List Finality v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: tightened the education blocker to distinguish the live 935-row WebED list from a zero-item shadow schema that exposes `County Name` but has no public rows',
    '',
    '## Conclusion',
    '',
    '- The live official `2017 NM Schools` list remains the controlling public row contract and still exposes only `Title` plus `Column2` through `Column13` on actual rows.',
    '- A separate shadow `NM Schools` schema exposes `County Name`, but it has `ItemCount=0` and cannot be used as county-grade public routing proof.',
    '- New Mexico stays BLOCKED and index_safe=false until a live official county-to-district or county-to-REC contract appears.',
    '',
  ].join('\n'));
}

main();
