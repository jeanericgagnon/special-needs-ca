import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'alaska_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'alaska_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'alaska_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'alaska_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'alaska_next_action_queue_v2.jsonl'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch276_alaska_dfcs_host_exhaustion_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch276-alaska-dfcs-host-exhaustion-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'alaska-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'live_dfcs_services_page_only_provides_statewide_phone_relay_while_health_host_county_equivalent_directory_stays_challenged';
const FAILURE_CODE = 'live_dfcs_services_page_is_phone_only_and_dfcs_host_has_no_public_search_sitemap_or_office_alias_while_health_host_directory_stays_challenged';
const FAMILY_STATUS = 'blocked_live_dfcs_phone_relay_plus_exhausted_dfcs_host_and_challenged_health_directory';
const NEXT_ACTION = 'hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_mapping_on_a_reviewable_official_surface_or_replaces_the_phone_only_dfcs_relay_with_a_reviewable_office_locator';

const STATUS_REASON = 'The live Alaska DFCS Services page is reviewable and preserves statewide phone routing for Adult Public Assistance and Apply for Medicaid through 888-804-6330, but it still does not provide borough or census-area office mapping. A final bounded pass on the still-live `dfcs.alaska.gov` host found no alternate local-routing contract there either: `robots.txt` is public, but `sitemap.xml` is 404, the obvious SharePoint search routes 404, guessed office/contact aliases such as `/Pages/Offices.aspx`, `/Pages/Office-Locations.aspx`, `/Pages/Contacts.aspx`, and `/Pages/Public-Assistance.aspx` all 404, and the on-host Publications page does not materialize any office list, directory, or borough/census-area routing content in raw HTML. The exact service links still send users to health.alaska.gov leaves that remain Cloudflare-challenged in the low-token lane, so Alaska still lacks a scraper-safe county-equivalent routing contract.';

const EVIDENCE = 'Reviewed 2026-06-23 bounded official Alaska rechecks against both the live DFCS successor host and the challenged health host. The current DFCS Services page at https://dfcs.alaska.gov/Pages/Services.aspx is live and publicly reviewable. It preserves explicit statewide phone-only routing for `Adult Public Assistance` and `Apply for Medicaid`, both with the same statewide number `888-804-6330`, and its exact links point to https://health.alaska.gov/en/services/adult-public-assistance-apa/ and https://health.alaska.gov/en/services/division-of-public-assistance-services/apply-for-medicaid/. But those health-host leaves still return HTTP 403 with the Cloudflare `Just a moment...` shell in the low-token lane, just like the reviewed DPA offices directory at https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/ and the legacy office-locations page at https://health.alaska.gov/dpa/Pages/office-locations.aspx. One more bounded pass on `dfcs.alaska.gov` also exhausted the successor host itself: https://dfcs.alaska.gov/robots.txt is public, but https://dfcs.alaska.gov/sitemap.xml returns 404, SharePoint search routes like `/search/pages/results.aspx?k=public%20assistance` and `/search/pages/results.aspx?k=office` return 404, guessed office aliases like `/Pages/Offices.aspx`, `/Pages/Office-Locations.aspx`, `/Pages/Contacts.aspx`, and `/Pages/Public-Assistance.aspx` all return 404, and the live DFCS Publications page does not materialize any office list, directory, or borough/census-area routing contract in raw HTML. The DFCS Department Contacts page is also live, but it still exposes no borough names, no census-area names, and no Public Assistance or disability office-location mapping contract. So Alaska now has stronger proof that the successor host is exhausted and the office-routing lane still lives only on the challenge-blocked health host, leaving the state blocked on missing reviewable borough- or census-area-to-office mapping.';

const LESSON_HEADING = '### A Live Successor Host With Public Robots But No Sitemap, Search, Or Office Aliases Can Be Source-Final';
const LESSON_BODY = '*   **Lesson:** If a live successor host exposes `robots.txt` but no sitemap, no working public search, and no office/contact aliases beyond the already-reviewed phone-only service page, stop spending low-token retries there. Alaska DFCS had a real successor host, but once the obvious on-host office branches all 404ed and publications still materialized no office contract, the remaining lane was clearly the challenge-blocked health host.';

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
    '# Alaska California-Grade Audit Report v2',
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
    '- Alaska remains BLOCKED and not index-safe.',
    '- The live DFCS Services page is real and preserves statewide phone routing for Adult Public Assistance and Apply for Medicaid, but it is still only a phone relay and not a borough/census-area office map.',
    '- The live DFCS host is now exhausted more tightly: no sitemap, no public search, no office aliases, and no office contract on the Publications page.',
    '- The exact office-facing health-host leaves remain challenge-blocked, so Alaska still lacks a reviewable county-equivalent local-office contract.',
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
    '## Current Focus State: Alaska',
    '',
    '### Blocker Reason',
    '',
    '`county_local_disability_resources` is the only remaining Alaska critical blocker. The live DFCS successor host is now exhausted more tightly: it preserves statewide phone-only routing, but no borough/census-area office contract, while the exact office-facing health host still challenge-blocks the county-equivalent directory lane.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any official Alaska surface that maps boroughs or census areas to DPA or Medicaid office locations on a publicly reviewable host.',
    '- Any reviewable successor office locator or directory that lives on `dfcs.alaska.gov` or another current official Alaska host instead of only on the challenge-blocked `health.alaska.gov` pages.',
    '- Any official document, export, or table that explicitly enumerates Alaska borough or census-area coverage for public assistance office routing.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Alaska DFCS Services](https://dfcs.alaska.gov/Pages/Services.aspx)',
    '- [Alaska DFCS Department Contacts](https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx)',
    '- [Alaska DFCS Publications](https://dfcs.alaska.gov/Pages/Publications.aspx)',
    '- [Alaska DFCS robots.txt](https://dfcs.alaska.gov/robots.txt)',
    '- [Alaska DFCS sitemap.xml](https://dfcs.alaska.gov/sitemap.xml)',
    '- [Alaska DFCS search for public assistance](https://dfcs.alaska.gov/search/pages/results.aspx?k=public%20assistance)',
    '- [Alaska DFCS search for office](https://dfcs.alaska.gov/search/pages/results.aspx?k=office)',
    '- [Alaska Adult Public Assistance leaf](https://health.alaska.gov/en/services/adult-public-assistance-apa/)',
    '- [Alaska Apply for Medicaid leaf](https://health.alaska.gov/en/services/division-of-public-assistance-services/apply-for-medicaid/)',
    '- [Alaska DPA offices directory](https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/)',
    '- [Alaska legacy office locations](https://health.alaska.gov/dpa/Pages/office-locations.aspx)',
    '- [Alaska health host sitemap](https://health.alaska.gov/sitemap.xml)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any current Alaska host outside `health.alaska.gov` that now publishes a borough- or census-area DPA office directory.',
    '- Any official Alaska PDF, spreadsheet, or office-contact table that names specific borough or census-area coverage for public assistance offices.',
    '- Any future public relaxation on the health host that makes the DPA office directory or Medicaid application leaves scraper-reviewable without the Cloudflare shell.',
    '',
    '## Next State Order After Alaska',
    '',
    '1. South Carolina',
    '2. North Carolina',
    '3. New York',
    '4. Oklahoma',
    '5. Oregon',
    '6. Ohio',
    '7. Minnesota',
    '8. Maine',
    '9. Idaho',
    '10. Arizona',
  ].join('\n') + '\n';
  fs.writeFileSync(INPUTS.handoff, content);
}

export function generateBatch276AlaskaDfcsHostExhaustionV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);

  const updatedSummary = {
    ...summary,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: [
      {
        family: 'county_local_disability_resources',
        failure_code: FAILURE_CODE,
        evidence: EVIDENCE,
        next_action: NEXT_ACTION,
      },
    ],
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

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: FAMILY_STATUS,
          query_basis: 'Reviewed 2026-06-23 live Alaska DFCS Services, Department Contacts, Publications, robots, sitemap/search aliases, plus exact linked health-host leaves and DPA office directory endpoints.',
          blocker_code: FAILURE_CODE,
          blocker_evidence: EVIDENCE,
          sample_count: 10,
          samples: [
            {
              sample_name: 'Alaska DFCS Services',
              source_url: 'https://dfcs.alaska.gov/Pages/Services.aspx',
              final_url: 'https://dfcs.alaska.gov/Pages/Services.aspx',
              verification_status: 'reviewed',
              source_type: 'official_services_hub_with_statewide_phone_relay',
              source_table: 'batch276_alaska_dfcs_host_exhaustion',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The live DFCS Services page lists Adult Public Assistance and Apply for Medicaid with the same statewide phone number 888-804-6330, but no borough or census-area mapping.',
            },
            {
              sample_name: 'Alaska DFCS robots.txt',
              source_url: 'https://dfcs.alaska.gov/robots.txt',
              final_url: 'https://dfcs.alaska.gov/robots.txt',
              verification_status: 'reviewed',
              source_type: 'official_live_host_without_discovery_contract',
              source_table: 'batch276_alaska_dfcs_host_exhaustion',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The successor DFCS host is live enough to expose robots.txt, but that alone does not provide any borough or census-area office mapping contract.',
            },
            {
              sample_name: 'Alaska DFCS sitemap.xml',
              source_url: 'https://dfcs.alaska.gov/sitemap.xml',
              final_url: 'https://dfcs.alaska.gov/sitemap.xml',
              verification_status: 'blocked',
              source_type: 'official_successor_host_missing_sitemap',
              source_table: 'batch276_alaska_dfcs_host_exhaustion',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The successor DFCS host returns HTTP 404 for sitemap.xml, so there is no public sitemap branch to recover a borough- or census-area office lane.',
            },
            {
              sample_name: 'Alaska DFCS search route',
              source_url: 'https://dfcs.alaska.gov/search/pages/results.aspx?k=public%20assistance',
              final_url: 'https://dfcs.alaska.gov/search/pages/results.aspx?k=public%20assistance',
              verification_status: 'blocked',
              source_type: 'official_successor_host_missing_search_surface',
              source_table: 'batch276_alaska_dfcs_host_exhaustion',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The obvious SharePoint search route for public assistance returns HTTP 404, so there is no live public search surface for recovering office-routing leaves on the DFCS host.',
            },
            {
              sample_name: 'Alaska DFCS office alias guesses',
              source_url: 'https://dfcs.alaska.gov/Pages/Offices.aspx',
              final_url: 'https://dfcs.alaska.gov/Pages/Offices.aspx',
              verification_status: 'blocked',
              source_type: 'official_successor_host_missing_office_alias',
              source_table: 'batch276_alaska_dfcs_host_exhaustion',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'Obvious successor-host office aliases such as `/Pages/Offices.aspx`, `/Pages/Office-Locations.aspx`, `/Pages/Contacts.aspx`, and `/Pages/Public-Assistance.aspx` all return HTTP 404.',
            },
            {
              sample_name: 'Alaska DFCS Publications',
              source_url: 'https://dfcs.alaska.gov/Pages/Publications.aspx',
              final_url: 'https://dfcs.alaska.gov/Pages/Publications.aspx',
              verification_status: 'reviewed',
              source_type: 'official_publications_without_local_mapping',
              source_table: 'batch276_alaska_dfcs_host_exhaustion',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The on-host Publications page is live, but its raw HTML does not materialize any office list, directory, or borough/census-area routing contract.',
            },
            {
              sample_name: 'Alaska DFCS Department Contacts',
              source_url: 'https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx',
              final_url: 'https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx',
              verification_status: 'reviewed',
              source_type: 'official_contacts_without_local_mapping',
              source_table: 'batch276_alaska_dfcs_host_exhaustion',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The live DFCS Department Contacts page exposes agency anchors and statewide contacts but no borough names, census-area names, or Public Assistance office-location contract.',
            },
            {
              sample_name: 'Adult Public Assistance leaf target',
              source_url: 'https://health.alaska.gov/en/services/adult-public-assistance-apa/',
              final_url: 'https://health.alaska.gov/en/services/adult-public-assistance-apa/',
              verification_status: 'blocked',
              source_type: 'official_health_host_challenge',
              source_table: 'batch276_alaska_dfcs_host_exhaustion',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The exact Adult Public Assistance health-host leaf linked from DFCS still returns the Cloudflare `Just a moment...` shell under bounded low-token fetch.',
            },
            {
              sample_name: 'Alaska DPA offices directory',
              source_url: 'https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/',
              final_url: 'https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/',
              verification_status: 'blocked',
              source_type: 'official_health_host_challenge',
              source_table: 'batch276_alaska_dfcs_host_exhaustion',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The reviewed DPA offices directory remains raw-fetch blocked by the Cloudflare `Just a moment...` shell, so the office list is still not scraper-safe in the low-token lane.',
            },
            {
              sample_name: 'Health host sitemap',
              source_url: 'https://health.alaska.gov/sitemap.xml',
              final_url: 'https://health.alaska.gov/sitemap.xml',
              verification_status: 'blocked',
              source_type: 'official_host_level_challenge',
              source_table: 'batch276_alaska_dfcs_host_exhaustion',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The host-level sitemap.xml still returns the Cloudflare challenge shell, confirming the official health host remains scraper-blocked beyond a single leaf.',
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

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'alaska'
      ? { ...row, status: updatedSummary.classification, classification: updatedSummary.classification, primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  updateHandoff();
  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  writeJson(OUTPUTS.summary, {
    batch: 'batch276_alaska_dfcs_host_exhaustion_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'alaska',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    dfcs_services_page_live: true,
    dfcs_robots_live: true,
    dfcs_sitemap_404: true,
    dfcs_search_404: true,
    dfcs_office_aliases_404: true,
    dfcs_publications_has_no_local_mapping_contract: true,
    health_host_still_challenged: true,
    lesson_added: lessonAdded,
  });

  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Batch 276 Alaska DFCS Host Exhaustion Report v1',
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
      '- Alaska remains blocked and not index-safe.',
      '- The live DFCS Services page proves the successor host is real and exposes statewide APA/Medicaid phone routing, but it is still only a phone relay.',
      '- The DFCS host itself is now exhausted more tightly: no sitemap, no public search, no office aliases, and no local-routing contract on Publications or Department Contacts.',
      '- The office-routing lane still lives only on the challenge-blocked health host.',
    ].join('\n') + '\n',
  );

  return updatedSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch276AlaskaDfcsHostExhaustionV1();
  console.log(JSON.stringify(result, null, 2));
}
