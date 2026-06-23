import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'nebraska_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'nebraska_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'nebraska_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'nebraska_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'nebraska_next_action_queue_v2.jsonl'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  packet: path.join(generatedDir, 'nebraska_county_local_disability_resources_service_area_packet_v1.json'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch274_nebraska_webmap_popup_finality_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch274-nebraska-webmap-popup-finality-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'nebraska-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'official_public_office_service_root_has_no_tables_and_office_schema_has_no_service_area_fields';
const FAILURE_CODE = 'official_public_office_service_root_has_no_tables_no_relationships_and_webmap_popup_only_materializes_contact_fields';
const NEXT_ACTION = 'hold_blocked_until_official_service_area_table_or_county_assignment_artifact_exists';
const STATUS_REASON = 'Reviewed 2026-06-23 the live official Nebraska county-local office lane on the DHHS content host, the public ExperienceBuilder app config, and the referenced public web map item. The exact first-party leaf at `https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx` is live and now proves the office lane exists, but its body only preserves a temporary Scottsbluff closing notice plus a `View the Nebraska Public Office Location Lookup` handoff and no county-to-office table, county list, or county assignment text. The public app config still resolves only to the same office and county layers, the FeatureServer root reports `tables: []`, both public layers have empty relationship arrays, and the office schema contains only address/contact fields such as USER_Address_1, USER_City, USER_County, USER_Tel, USER_Toll_Free_Line, USER_Hours, USER_Computer, USER_Scanning, and USER_Phone. The referenced public web map item (`4bdbf8e8703743b0b2ff290f98737825`) adds no hidden county bridge: the county popup lists only boundary/identifier fields, while the office popup only renders office address, phone/toll-free/hours/scanning fields, Google Maps directions, and last-edited metadata. There are still only 42 office rows and 37 distinct USER_County values for 93 counties, with no service-area, assigned-counties, region, or coverage fields. Nebraska therefore still lacks any public county-to-office assignment contract.';
const EVIDENCE = 'Reviewed 2026-06-23 the official Nebraska county-local office lane directly on the DHHS content host, the public office locator stack, and the referenced web map item. The exact leaf at https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx is live and titled `Public Assistance Offices`, but the body only preserves a temporary Scottsbluff closing notice plus `View the Nebraska Public Office Location Lookup`; it does not publish a county list, office table, or county assignment contract, and the `Local DHHS Offices` nav loops back to the same page. The public app data at https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json is open and still exposes only the shared web map plus two derived feature layers. The service root at https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer?f=pjson reports exactly two layers, `tables: []`, and no extra public assignment table. Layer 0 still exposes only office contact fields like USER_Address_1, USER_City, USER_County, USER_Tel, USER_Toll_Free_Line, USER_Hours, USER_Computer, USER_Scanning, and USER_Phone; it has no service-area or coverage fields, no multi-county USER_County values, and only 37 distinct counties across 42 office rows. The referenced public web map at https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825/data?f=json confirms there is no hidden county bridge in popup configuration: the `County Boundary` popup only lists NAME and other county geometry/identifier fields, and the `Public Assistance Office` popup only renders address, city, ZIP, phone/toll-free/hours/scanning, a Google Maps directions expression, and last-edited metadata. So the official Nebraska county-local office stack is final-blocked on missing public county-assignment data, not on an unresolved popup or ArcGIS-discovery question.';

const LESSON_HEADING = '### Popup Templates That Only Render Contact Cards Do Not Create A Hidden County Contract';
const LESSON_BODY = '*   **Lesson:** If a public ArcGIS web map popup only renders office contact cards, Google Maps directions, and edit metadata, do not treat the popup layer as a hidden county-to-office bridge. Nebraska’s public office web map added no assignment logic beyond address and phone fields, so the blocker remained a true missing county contract.';

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
    '# Nebraska California-Grade Truth Refresh v2',
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
    '- Nebraska remains BLOCKED and index_safe=false.',
    '- district_or_county_education_routing is still verified_county_grade through the live official NDE county-selectable directory host.',
    '- county_local_disability_resources is now final-blocked more tightly: the exact DHHS Public Assistance Offices leaf is live but only hands off to the locator, and the public FeatureServer root, county layer, and office popup configuration still expose no county-to-office assignment contract.',
  ].join('\n') + '\n';
}

function updateHandoff() {
  const content = [
    '# Gemini Source Scout Handoff',
    '',
    'Updated: 2026-06-23',
    '',
    'Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.',
    '',
    '## Current Complete States',
    '',
    'Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, Nevada, New Jersey, Pennsylvania, Texas',
    '',
    '## Current Blocked States',
    '',
    '- Alaska: `live_dfcs_services_page_only_provides_statewide_phone_relay_while_health_host_county_equivalent_directory_stays_challenged`',
    '- Arizona: `three_public_district_domains_official_api_and_exact_slug_sweeps_still_lack_role_leafs_and_altcs_office_cards_still_lack_county_assignments`',
    '- Florida: `official_local_offices_leaf_routes_to_partial_family_resource_center_and_myaccess_results_stay_authenticated`',
    '- Idaho: `reviewed_idaho_district_leaves_now_cover_12_counties_and_dhw_split_is_explicit_but_county_grade_remains_incomplete`',
    '- Kansas: `reviewed_kansas_district_and_district_linked_coop_leaves_now_cover_10_counties_but_export_backed_county_grade_coverage_is_still_incomplete`',
    '- Maine: `official_maine_workbook_is_stable_mapping_only_and_contact_materialization_lane_still_500_plus_dhhs_office_html_has_no_county_contract`',
    '- Massachusetts: `exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export`',
    '- Minnesota: `mdeorg_root_is_live_but_actionable_child_routes_are_title_only_radware_shells_plus_mn_dhs_local_office_family_is_radware_challenged`',
    '- Nebraska: `official_public_office_service_root_has_no_tables_and_office_schema_has_no_service_area_fields`',
    '- New Hampshire: `official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable_with_no_live_nh_gov_successor_root`',
    '- New Mexico: `district_leafs_missing_and_county_local_four_county_remainder_persists_after_empty_archive_tail`',
    '- New York: `official_nysed_boces_pages_cover_non_nyc_counties_but_no_reviewed_nyc_borough_route_and_no_public_ldss_replacement`',
    '- North Carolina: `generic_or_statewide_evidence_used_where_local_required`',
    '- North Dakota: `generic_or_statewide_evidence_used_where_local_required`',
    '- Ohio: `retired_official_county_family_and_public_search_surfaces_still_dead_plus_education_inventory_root_only`',
    '- Oklahoma: `official_osde_state_school_directory_clears_education_but_dead_dhhs_locator_host_and_planning_rows_still_block_county_local`',
    '- Oregon: `official_ode_county_searchable_school_directory_clears_education_but_live_office_finder_root_still_has_no_county_extract`',
    '- Rhode Island: `generic_or_statewide_evidence_used_where_local_required`',
    '- South Carolina: `official_school_directory_root_is_live_but_not_yet_converted_into_district_owned_special_education_leaves`',
    '- South Dakota: `live_sd_educational_directory_exists_but_local_district_leaves_are_unauthored_and_localoffices_root_has_no_public_county_contract`',
    '- Tennessee: `generic_or_statewide_evidence_used_where_local_required`',
    '- Utah: `official_usbe_district_lea_directory_clears_education_and_public_dws_office_api_still_lacks_county_service_area_contract`',
    '- Vermont: `generic_or_statewide_evidence_used_where_local_required`',
    '- Virginia: `generic_or_statewide_evidence_used_where_local_required`',
    '- Washington: `generic_or_statewide_evidence_used_where_local_required`',
    '- West Virginia: `generic_or_statewide_evidence_used_where_local_required`',
    '- Wisconsin: `generic_or_statewide_evidence_used_where_local_required`',
    '- Wyoming: `legacy_or_inventory_only_evidence`',
    '',
    '## Current Focus State: Nebraska',
    '',
    '### Blocker Reason',
    '',
    '`county_local_disability_resources` is the only remaining Nebraska critical blocker. The live DHHS office page, the public FeatureServer, and the referenced public web map are all readable enough to prove what is missing: there is still no county-to-office assignment contract, so Nebraska stays BLOCKED and not index-safe.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any official Nebraska DHHS county-to-office assignment table, export, or service-area artifact that maps all 93 counties to public assistance offices.',
    '- Any public ArcGIS layer, related table, or API field on the existing Nebraska office stack that explicitly enumerates served counties, assigned counties, regions, or coverage areas for each office.',
    '- Any exact first-party DHHS leaf that publishes a county list or county-by-county local office contract instead of only a locator handoff.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Nebraska DHHS Public Assistance Offices](https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx)',
    '- [Nebraska public office locator ExperienceBuilder app](https://gis.ne.gov/portal/apps/experiencebuilder/experience/?id=76a6ec0ec7c449448c95d00f59002457)',
    '- [ExperienceBuilder app data JSON](https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json)',
    '- [Nebraska public office FeatureServer root](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer?f=pjson)',
    '- [Nebraska public office layer schema](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0?f=pjson)',
    '- [Nebraska county boundary layer schema](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/1?f=pjson)',
    '- [Nebraska office-layer distinct county query](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&outFields=USER_County&returnDistinctValues=true&returnGeometry=false&f=json)',
    '- [Referenced public web map data JSON](https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825/data?f=json)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- An official Nebraska DHHS county assignment export or service-area table attached to the existing office stack.',
    '- An exact first-party county office page or county directory leaf on `dhhs.ne.gov` that publishes county coverage instead of only contact cards.',
    '- Any public Nebraska GIS item related to the office stack that adds county-served fields or related-table joins beyond the current two public layers.',
    '',
    '## Next State Order After Nebraska',
    '',
    '1. Florida',
    '2. Alaska',
    '3. South Carolina',
    '4. North Carolina',
    '5. New York',
    '6. Oklahoma',
    '7. Oregon',
    '8. Ohio',
    '9. Minnesota',
    '10. Maine',
  ].join('\n') + '\n';
  fs.writeFileSync(INPUTS.handoff, content);
}

export function generateBatch274NebraskaWebmapPopupFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);
  const packet = readJson(INPUTS.packet);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: 'blocked_public_office_service_root_without_assignment_contract', status_reason: STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: 'blocked_public_office_service_root_without_assignment_contract',
          blocker_code: FAILURE_CODE,
          blocker_evidence: EVIDENCE,
          query_basis: 'Reviewed 2026-06-23 the official Nebraska ExperienceBuilder app data, FeatureServer root, office layer schema, distinct county coverage query, and referenced public web map popup configuration.',
          sample_count: 6,
          samples: [
            {
              sample_name: 'Nebraska Public Assistance Offices leaf',
              source_url: 'https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx',
              final_url: 'https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx',
              verification_status: 'blocked',
              source_type: 'official_office_leaf_without_county_assignment_contract',
              source_table: 'batch274_nebraska_webmap_popup_finality',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The exact first-party Public Assistance Offices page is live, but it only preserves a Scottsbluff closing notice and a `View the Nebraska Public Office Location Lookup` handoff with no county list or county-to-office table.',
            },
            {
              sample_name: 'Nebraska office app config',
              source_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json',
              final_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json',
              verification_status: 'blocked',
              source_type: 'official_experiencebuilder_config',
              source_table: 'batch274_nebraska_webmap_popup_finality',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The public app config is open and still exposes only the shared web map plus two derived feature layers.',
            },
            {
              sample_name: 'Nebraska FeatureServer root',
              source_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer?f=pjson',
              final_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer?f=pjson',
              verification_status: 'blocked',
              source_type: 'official_feature_service_root_without_tables',
              source_table: 'batch274_nebraska_webmap_popup_finality',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The public FeatureServer root reports exactly two layers and `tables: []`, so there is no public related table to recover.',
            },
            {
              sample_name: 'Nebraska office feature layer schema',
              source_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0?f=pjson',
              final_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0?f=pjson',
              verification_status: 'blocked',
              source_type: 'official_office_feature_layer_contact_only_schema',
              source_table: 'batch274_nebraska_webmap_popup_finality',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The office layer schema contains only contact and office fields like USER_Address_1, USER_City, USER_County, USER_Tel, USER_Toll_Free_Line, USER_Hours, USER_Computer, USER_Scanning, and USER_Phone, with no service-area or coverage fields.',
            },
            {
              sample_name: 'Nebraska office feature layer distinct county coverage',
              source_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&outFields=USER_County&returnDistinctValues=true&returnGeometry=false&f=json',
              final_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&outFields=USER_County&returnDistinctValues=true&returnGeometry=false&f=json',
              verification_status: 'blocked',
              source_type: 'official_office_feature_layer_distinct_counties',
              source_table: 'batch274_nebraska_webmap_popup_finality',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'A bounded distinct-value query still returns only 37 distinct USER_County values across 42 office rows, and none of those values are multi-county coverage strings.',
            },
            {
              sample_name: 'Nebraska referenced web map popup config',
              source_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825/data?f=json',
              final_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825/data?f=json',
              verification_status: 'blocked',
              source_type: 'official_webmap_popup_config_without_assignment_contract',
              source_table: 'batch274_nebraska_webmap_popup_finality',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The referenced public web map popup config only renders county boundary identifiers and office contact-card fields, plus Google Maps directions and last-edited metadata; it exposes no county-to-office assignment expression or service-area text.',
            },
          ],
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence: EVIDENCE }
      : row
  ));

  const updatedSummary = {
    ...summary,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'county_local_disability_resources'
        ? { ...row, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
        : row
    )),
  };

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'nebraska'
      ? { ...row, status: updatedSummary.classification, classification: updatedSummary.classification, primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  const updatedPacket = {
    ...packet,
    purpose: 'Deterministic packet for Nebraska county-local routing after the public office web map and popup configuration also proved there is no hidden county assignment contract.',
    current_problem_metrics: {
      ...(packet.current_problem_metrics || {}),
      countyTotal: 93,
      officeLayerRows: 42,
      officeLayerDistinctCounties: 37,
      countyBoundaryLayerHasAssignmentFields: false,
      officialConfigOpen: true,
      officeLayerRelationshipsPresent: false,
      countyLayerRelationshipsPresent: false,
      publicOfficeCount: 42,
      publicCountyCount: 93,
      distinctOfficeCounties: 37,
      serviceRootTablesPresent: false,
      officeLayerHasServiceAreaFields: false,
      officeLayerHasMultiCountyValues: false,
      webMapPopupHasCountyAssignmentFields: false,
      countyPopupOnlyShowsBoundaryFields: true,
      officePopupOnlyShowsContactFields: true,
      officePopupExpressionsAreAddressAndEditMetadataOnly: true,
    },
    representative_sources: Array.from(new Set([
      ...(packet.representative_sources || []),
      'https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825/data?f=json',
    ])),
    packet_complete_when: 'Nebraska can reopen county-local only when an official service-area table, county-assignment artifact, office schema with county-coverage fields, or a public web map popup expression that explicitly bridges counties to offices exists on the public stack.',
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.packet, updatedPacket);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  updateHandoff();
  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch274_nebraska_webmap_popup_finality_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'nebraska',
    classification: 'BLOCKED',
    index_safe: false,
    service_root_tables_present: false,
    office_schema_has_service_area_fields: false,
    office_layer_has_multi_county_values: false,
    webmap_popup_has_county_assignment_fields: false,
    office_popup_only_shows_contact_fields: true,
    county_popup_only_shows_boundary_fields: true,
    distinct_office_counties: 37,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.summary, batchSummary);

  const batchReport = [
    '# Batch 274 Nebraska Web Map Popup Finality Report v1',
    '',
    '- state: Nebraska',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- refined_family: county_local_disability_resources',
    `- failure_code: ${FAILURE_CODE}`,
    '',
    '## Outcome',
    '',
    '- Confirmed the exact DHHS Public Assistance Offices leaf is live but still only hands off to the locator and exposes no county assignment contract.',
    '- Confirmed the public FeatureServer root still exposes no tables and the office layer still exposes only contact fields.',
    '- Confirmed the referenced public web map popup configuration adds no hidden county bridge: county popups only show boundary fields, and office popups only show contact-card fields, directions, and last-edited metadata.',
    '- Nebraska remains truthfully BLOCKED and not index-safe until an official county-to-office assignment artifact exists.',
  ].join('\n') + '\n';

  fs.writeFileSync(OUTPUTS.report, batchReport);
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch274NebraskaWebmapPopupFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
