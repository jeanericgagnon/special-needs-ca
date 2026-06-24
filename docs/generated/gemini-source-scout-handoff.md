# Gemini Source Scout Handoff

Updated: 2026-06-23

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, Nevada, New Jersey, North Carolina, Pennsylvania, South Carolina, Texas

## Current Blocked States

- Alaska: `live_dfcs_services_and_publications_surfaces_still_expose_no_dpa_or_borough_mapping_while_dfcs_search_self_posts_without_results_and_alt_health_legacy_hosts_fail_closed`
- Arizona: `three_public_district_domains_official_api_and_exact_slug_sweeps_still_lack_role_leafs_and_altcs_office_cards_still_lack_county_assignments`
- Florida: `official_local_offices_leaf_routes_to_partial_family_resource_center_and_current_myaccess_public_shell_and_main_bundle_still_expose_no_anonymous_county_contract`
- Idaho: `reviewed_idaho_district_leaves_now_cover_12_counties_and_dhw_split_is_explicit_but_county_grade_remains_incomplete`
- Kansas: `live_ksde_directory_root_and_public_export_contract_recovered_but_reviewed_local_district_leaves_still_cover_only_16_counties`
- Maine: `official_maine_workbook_is_stable_mapping_only_and_contact_materialization_lane_still_500_plus_dhhs_office_html_has_no_county_contract`
- Massachusetts: `exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export`
- Minnesota: `mdeorg_root_is_live_but_actionable_child_routes_are_title_only_radware_shells_plus_mn_dhs_local_office_family_is_radware_challenged`
- Nebraska: `freshly_republished_public_office_experience_still_only_wraps_42_offices_37_distinct_counties_and_no_statewide_assignment_contract`
- New Hampshire: `official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable_with_no_live_nh_gov_successor_root`
- New Mexico: `district_leafs_missing_and_county_local_four_county_remainder_persists_after_empty_archive_tail`
- New York: `nygov_links_exact_otda_successor_leaves_that_still_reset_while_mybenefits_begin_page_recovers_without_county_local_contract_and_health_ny_ldss_family_remains_unusable`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
- Ohio: `official_ohio_jfs_medicaid_and_ohio_gov_root_surfaces_all_404_while_education_inventory_root_only`
- Oklahoma: `live_okdhs_general_office_map_only_materializes_46_counties_while_same_host_child_support_tree_proves_county_contracts_exist_but_not_for_disability_local_routing`
- Oregon: `live_odhs_office_finder_is_only_a_custom_component_shell_with_no_public_county_extract_query_contract_or_api_surface`
- Rhode Island: `generic_or_statewide_evidence_used_where_local_required`
- South Dakota: `live_sd_educational_directory_exists_but_local_district_leaves_are_unauthored_and_localoffices_root_has_no_public_county_contract`
- Tennessee: `generic_or_statewide_evidence_used_where_local_required`
- Utah: `live_utah_dhhs_contacts_page_recovers_but_explicitly_defers_local_office_info_while_surviving_dws_public_api_still_lacks_any_county_contract`
- Vermont: `generic_or_statewide_evidence_used_where_local_required`
- Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Washington: `generic_or_statewide_evidence_used_where_local_required`
- West Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Wisconsin: `generic_or_statewide_evidence_used_where_local_required`
- Wyoming: `legacy_or_inventory_only_evidence`

## Current Focus State: Utah

### Blocker Reason

`county_local_disability_resources` is the only remaining Utah critical blocker. The live Utah Schools Directory still clears education, and the official Utah evidence has shifted again: `https://dhhs.utah.gov/contacts/` is publicly reviewable at HTTP 200, but it now clearly acts only as a central contacts hub. The page routes community-service discovery to Utah 211, says users can find services by clicking on a county in the map below or using a search bar by type, and later explicitly says `Please visit specific division or program pages for local office information.` The surviving official local-office lane is still the DWS stack: `jobs.utah.gov/department/contact/index.html` still points to an `Office Map`, the redirected `jobs.utah.gov/office-search/` shell is still live, the public office API still returns office inventory rows, and the public services API still exposes only `All`, `USOR`, and `EC`. No public county endpoint or service-area field materializes on the same host. Utah therefore remains BLOCKED and not index-safe.

### Exact Evidence Needed

- Any public Utah successor directory, export, or leaf set that explicitly maps all 29 counties to local DWS, DHHS, or disability-resource offices.
- Any reviewable Utah division or program page that actually materializes county-local office assignments instead of only central contact information.
- Any public office API field or companion endpoint that adds `county`, `countiesServed`, or equivalent service-area assignments to the current Utah office inventory.

### Useful Official URLs Already Tried

- [Utah Schools Directory](https://schools.utah.gov/schoolsdirectory)
- [Utah DHHS Contacts](https://dhhs.utah.gov/contacts/)
- [DHHS customer service contact form](https://dhhs.utah.gov/customer-service/customer-service-contact-form/)
- [Older DWS public contact page with Office Map link](https://jobs.utah.gov/department/contact/index.html)
- [Legacy DWS office-search alias](https://jobs.utah.gov/jsp/officesearch/)
- [Live DWS Office Search shell](https://jobs.utah.gov/office-search/)
- [Public DWS office API](https://officesearch-api.jobs.utah.gov/api/v1/offices)
- [Public DWS services API](https://officesearch-api.jobs.utah.gov/api/v1/services)
- [Missing county endpoint probe](https://officesearch-api.jobs.utah.gov/api/v1/counties)
- [Missing search endpoint probe](https://officesearch-api.jobs.utah.gov/api/v1/search)
- [Missing office-search endpoint probe](https://officesearch-api.jobs.utah.gov/api/v1/offices/search)
- [Utah DHHS WordPress API root](https://dhhs.utah.gov/wp-json/)

### Top Remaining Source-Scouting Targets

- Any public Utah successor leaf or export that materially maps counties to local offices rather than just publishing office inventory.
- Any public companion API artifact that adds `county` or service-area assignments to the current DWS office inventory.
- Any reviewable official Utah division/program office page that preserves local county or service-area coverage on the current DHHS host.
## Next State Order After Utah

1. Kansas
2. Nebraska
3. Nevada
4. Florida
5. Alaska
6. South Carolina
7. North Carolina
8. New York
9. Oklahoma
10. Oregon10. Oregon