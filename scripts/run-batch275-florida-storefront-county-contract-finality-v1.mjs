import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'florida_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'florida_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'florida_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'florida_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'florida_next_action_queue_v2.jsonl'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch275_florida_storefront_county_contract_finality_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch275-florida-storefront-county-contract-finality-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'florida-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'official_local_offices_leaf_routes_to_partial_family_resource_center_and_myaccess_results_stay_authenticated';
const FAILURE_CODE = 'official_family_resource_center_html_and_csv_both_materialize_only_partial_county_contract_while_myaccess_results_stay_authenticated';
const FAMILY_STATUS = 'blocked_official_storefront_root_and_csv_only_cover_partial_county_set_and_authenticated_myaccess_results';
const NEXT_ACTION = 'hold_county_local_until_first_party_local_offices_lane_is_county_complete_or_anonymous_myaccess_results_exist';

const STATUS_REASON = 'Official Florida DCF county-local routing remains blocked after one more bounded first-party storefront pass. The live public `food-cash-and-medical` leaf still advertises `Local Offices` and links to the Family Resource Center host, but that first-party lane now proves its own limit in two places: the reviewed `providers.csv` still preserves only 34 distinct county values across 39 rows, and the reviewed storefront HTML hardcodes only 33 unique `filterByCountyFromMap(...)` county pins, including a `Monore` typo, while deriving the county dropdown directly from the same `providers.csv` dataset. The public DCF contacts.csv still proves 67/67 county-to-circuit coverage but zero true ACCESS, Medicaid, SNAP, TANF, economic self-sufficiency, food assistance, cash assistance, or customer service center rows. The live sitemap still exposes `contact-us/circuit-*` children that return HTTP 404, and the anonymous MyACCESS county-result endpoints still return HTTP 401.';

const EVIDENCE = 'Reviewed 2026-06-23 bounded live official checks on https://www.myflfamilies.com/sitemap.xml, https://www.myflfamilies.com/contact-us, https://www.myflfamilies.com/contact-us/contacts.csv, https://www.myflfamilies.com/services/public-assistance, https://www.myflfamilies.com/services/public-assistance/applying-for-assistance, https://www.myflfamilies.com/services/public-assistance/economic-self-sufficiency-frequently-asked-questions/, https://www.myflfamilies.com/services/public-assistance/additional-resources-and-services/community/, https://www.myflfamilies.com/food-cash-and-medical, https://familyresourcecenter.myflfamilies.com/, https://familyresourcecenter.myflfamilies.com/providers.csv, https://myaccess.myflfamilies.com/Public/CPCPS, https://myaccess.myflfamilies.com/Help/HCINT, https://myaccess.myflfamilies.com/config/appconfig.js, https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails, and https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch. The exact official `food-cash-and-medical` leaf still includes a `Find Local Offices` link, but that link lands on the Family Resource Center host, whose reviewed `providers.csv` preserves only 34 distinct county values across 39 rows rather than a 67-county local-office contract. The same first-party storefront HTML proves there is no hidden county-complete dataset on the public root: it hardcodes only 33 unique `filterByCountyFromMap(...)` county pins (38 total pin calls because some counties repeat) and even includes a `Monore` typo, while the inline dropdown logic explicitly fetches `https://familyresourcecenter.myflfamilies.com/providers.csv` and populates the county selector from `new Set(data.map(item => item.counties.trim()))`. The public contacts.csv still loads with all 67 counties mapped to circuits, but a bounded role-field audit across all 109 rows still returns zero true matches for ACCESS, Medicaid, SNAP, TANF, economic self-sufficiency, food assistance, cash assistance, or customer service center, and the apparent `ESS` hits remain false positives from `5920 Arlington Expressway`. The live sitemap still advertises `contact-us/circuit-*` children, and sampled circuit leaves such as `/contact-us/circuit-3` and `/contact-us/circuit-11` still return live HTTP 404 responses. The anonymous MyACCESS `Public/CPCPS` and `Help/HCINT` routes still return the same generic MyACCESS shell, and bounded anonymous POST probes to the exact official `getZipCountyDetails` plus `communityPartnerSearch` endpoints still return HTTP 401 with `{\"message\":\"Unauthorized\"}`. Florida therefore remains blocked because the exact official local-offices leaf still resolves only to a partial storefront lane, the storefront root itself derives its county UI from that same partial CSV, the public circuit leaves are dead, and the county-result search lane remains authenticated-only.';

const LESSON_HEADING = '### A First-Party Storefront Root That Derives Its County UI From A Partial CSV Is Still A Partial County Contract';
const LESSON_BODY = '*   **Lesson:** If a first-party locator page builds its county dropdown and map pins directly from a partial CSV, count the whole storefront as partial rather than treating the root as a stronger contract. Florida’s Family Resource Center root fetched `providers.csv`, rendered only 33 unique county pins in HTML, and still could not outrun the 34-county CSV ceiling.';

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
    '# Florida California-Grade Audit Report v2',
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
    '- Florida remains BLOCKED and not index-safe.',
    '- The exact official `food-cash-and-medical` leaf still resolves only to the partial Family Resource Center storefront lane.',
    '- The first-party storefront root itself derives its county dropdown and county pins from the same partial `providers.csv`, so the root is not a stronger county-complete contract than the CSV.',
    '- The public DCF contacts.csv remains the wrong service role, the public circuit leaves remain dead, and the anonymous MyACCESS county-result endpoints remain authenticated-only.',
    '- Florida should reopen county-local only if a county-complete first-party local-offices directory or anonymous county-result contract becomes public.',
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
    '## Current Focus State: Florida',
    '',
    '### Blocker Reason',
    '',
    '`county_local_disability_resources` is the only remaining Florida critical blocker. The live DCF local-offices leaf, the Family Resource Center storefront, the public contacts CSV, and the anonymous MyACCESS result endpoints are all readable enough to prove what is missing: Florida still has no county-complete public local-office contract.',
    '',
    '### Exact Evidence Needed',
    '',
    '- A first-party Florida DCF or MyACCESS county-complete local-offices directory or export that maps all 67 counties to public assistance / ESS office routing.',
    '- An anonymous official MyACCESS county-result contract that returns real office or community-partner results without authentication.',
    '- A first-party Family Resource Center or DCF local-office lane that expands beyond the current 34-county storefront contract and publishes the full county set.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Florida DCF sitemap](https://www.myflfamilies.com/sitemap.xml)',
    '- [Florida DCF contact-us page](https://www.myflfamilies.com/contact-us)',
    '- [Florida DCF contacts.csv](https://www.myflfamilies.com/contact-us/contacts.csv)',
    '- [Florida DCF food-cash-and-medical page](https://www.myflfamilies.com/food-cash-and-medical)',
    '- [Florida DCF applying-for-assistance page](https://www.myflfamilies.com/services/public-assistance/applying-for-assistance)',
    '- [Florida Family Resource Center root](https://familyresourcecenter.myflfamilies.com/)',
    '- [Florida Family Resource Center providers.csv](https://familyresourcecenter.myflfamilies.com/providers.csv)',
    '- [MyACCESS Public CPCPS](https://myaccess.myflfamilies.com/Public/CPCPS)',
    '- [MyACCESS Help HCINT](https://myaccess.myflfamilies.com/Help/HCINT)',
    '- [MyACCESS appconfig](https://myaccess.myflfamilies.com/config/appconfig.js)',
    '- [MyACCESS getZipCountyDetails](https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails)',
    '- [MyACCESS communityPartnerSearch](https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any official DCF or MyACCESS export or API path that materially extends the public county-local contract beyond the 34 counties in `providers.csv`.',
    '- Any exact first-party DCF county office page or local-office directory leaf that is linked from current public-assistance pages but not yet exposed in the current sitemap.',
    '- Any anonymous result lane on the official MyACCESS host that returns real county storefront or office rows without an authenticated `/accountmanagement` session.',
    '',
    '## Next State Order After Florida',
    '',
    '1. Alaska',
    '2. South Carolina',
    '3. North Carolina',
    '4. New York',
    '5. Oklahoma',
    '6. Oregon',
    '7. Ohio',
    '8. Minnesota',
    '9. Maine',
    '10. Idaho',
  ].join('\n') + '\n';
  fs.writeFileSync(INPUTS.handoff, content);
}

export function generateBatch275FloridaStorefrontCountyContractFinalityV1() {
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
      row.family === 'county_local_disability_resources'
        ? { ...row, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
        : row
    )),
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: FAMILY_STATUS, status_reason: STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    return {
      ...row,
      family_status: FAMILY_STATUS,
      blocker_code: FAILURE_CODE,
      blocker_evidence: EVIDENCE,
      query_basis: 'Reviewed 2026-06-23 the official DCF public-assistance leaves, Family Resource Center root and CSV, storefront HTML county pins, contacts.csv, sitemap circuit leaves, and anonymous MyACCESS endpoints.',
      sample_count: 8,
      samples: [
        {
          sample_name: 'Florida Food Cash and Medical',
          source_url: 'https://www.myflfamilies.com/food-cash-and-medical',
          final_url: 'https://www.myflfamilies.com/food-cash-and-medical',
          verification_status: 'reviewed',
          source_type: 'official_local_offices_leaf_to_partial_storefront_lane',
          source_table: 'batch275_florida_storefront_county_contract_finality',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The page explicitly advertises `Local Offices` and links `Find Local Offices` to familyresourcecenter.myflfamilies.com rather than to a county-complete DCF office directory.',
        },
        {
          sample_name: 'Florida Family Resource Center root HTML',
          source_url: 'https://familyresourcecenter.myflfamilies.com/',
          final_url: 'https://familyresourcecenter.myflfamilies.com/',
          verification_status: 'blocked',
          source_type: 'official_storefront_root_with_partial_county_ui',
          source_table: 'batch275_florida_storefront_county_contract_finality',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The first-party storefront root hardcodes only 33 unique `filterByCountyFromMap(...)` county pins, including a `Monore` typo, and its inline JS fetches `providers.csv` to populate the county dropdown.',
        },
        {
          sample_name: 'Florida Family Resource Center providers.csv',
          source_url: 'https://familyresourcecenter.myflfamilies.com/providers.csv',
          final_url: 'https://familyresourcecenter.myflfamilies.com/providers.csv',
          verification_status: 'blocked',
          source_type: 'official_partial_storefront_lane',
          source_table: 'batch275_florida_storefront_county_contract_finality',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The reviewed providers.csv preserves only 34 distinct county values across 39 rows rather than a full 67-county local-office contract.',
        },
        {
          sample_name: 'Florida DCF contacts.csv',
          source_url: 'https://www.myflfamilies.com/contact-us/contacts.csv',
          final_url: 'https://www.myflfamilies.com/contact-us/contacts.csv',
          verification_status: 'blocked',
          source_type: 'official_circuit_mapping_wrong_service_role',
          source_table: 'batch275_florida_storefront_county_contract_finality',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The contacts.csv still maps all 67 counties to circuits, but role-field review still shows zero true ACCESS, SNAP, TANF, Medicaid, ESS, or customer service center rows.',
        },
        {
          sample_name: 'Florida DCF sitemap circuit leaves',
          source_url: 'https://www.myflfamilies.com/sitemap.xml',
          final_url: 'https://www.myflfamilies.com/sitemap.xml',
          verification_status: 'blocked',
          source_type: 'official_sitemap_with_dead_circuit_children',
          source_table: 'batch275_florida_storefront_county_contract_finality',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The sitemap still advertises `contact-us/circuit-*` children, but sampled circuit leaves like `/contact-us/circuit-3` and `/contact-us/circuit-11` return live 404 pages.',
        },
        {
          sample_name: 'Florida Applying for Assistance',
          source_url: 'https://www.myflfamilies.com/services/public-assistance/applying-for-assistance',
          final_url: 'https://www.myflfamilies.com/services/public-assistance/applying-for-assistance',
          verification_status: 'reviewed',
          source_type: 'official_local_office_prose_without_public_leaf',
          source_table: 'batch275_florida_storefront_county_contract_finality',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The page says families can turn in information at a local office or community partner, but the linked county-result lane still stops at Family Resource Center or authenticated-only MyACCESS routes.',
        },
        {
          sample_name: 'MyACCESS Public CPCPS',
          source_url: 'https://myaccess.myflfamilies.com/Public/CPCPS',
          final_url: 'https://myaccess.myflfamilies.com/Public/CPCPS',
          verification_status: 'blocked',
          source_type: 'official_generic_myaccess_shell',
          source_table: 'batch275_florida_storefront_county_contract_finality',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The public CPCPS route still returns the same generic MyACCESS shell with no county, office, or storefront result rows.',
        },
        {
          sample_name: 'MyACCESS anonymous county-result endpoints',
          source_url: 'https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails',
          final_url: 'https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails',
          verification_status: 'blocked',
          source_type: 'official_authenticated_only_endpoint',
          source_table: 'batch275_florida_storefront_county_contract_finality',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'Bounded anonymous POST probes to `getZipCountyDetails` and `communityPartnerSearch` still return HTTP 401 `{\"message\":\"Unauthorized\"}`.',
        },
      ],
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
      : row
  ));

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'florida'
      ? { ...row, status: updatedSummary.classification, classification: updatedSummary.classification, primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  updateHandoff();
  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch275_florida_storefront_county_contract_finality_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'florida',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    exact_local_offices_leaf_reviewed: true,
    family_resource_center_county_rows: 39,
    family_resource_center_distinct_counties: 34,
    storefront_root_unique_county_pins: 33,
    storefront_root_pin_calls: 38,
    storefront_root_has_monore_typo: true,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 275 Florida Storefront County Contract Finality Report v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- refined_family: county_local_disability_resources',
    `- failure_code: ${FAILURE_CODE}`,
    '',
    '## Evidence',
    '',
    `- ${EVIDENCE}`,
    '',
    '## Repair decision',
    '',
    '- Florida remains blocked and not index-safe.',
    '- The exact official `food-cash-and-medical` leaf still lands on the partial Family Resource Center storefront lane.',
    '- The first-party storefront root itself proves the same ceiling: its county dropdown is built from `providers.csv`, and its HTML only hardcodes 33 unique county pins.',
    '- The public DCF circuit leaves remain dead and the anonymous MyACCESS county-result endpoints remain authenticated-only.',
    '- Florida should only reopen when a county-complete first-party local-office contract or anonymous county-result lane becomes public.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch275FloridaStorefrontCountyContractFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
