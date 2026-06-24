# Gemini Source Scout Handoff

Updated: 2026-06-23

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, Nevada, New Jersey, North Carolina, Pennsylvania, South Carolina, Texas

## Current Blocked States

- Alaska: `live_dfcs_services_page_remains_phone_only_while_dfcs_search_exposes_input_field_but_no_public_results_endpoint_and_current_health_and_legacy_dhss_dpa_hosts_stay_gate_blocked`
- Arizona: `three_public_district_domains_official_api_and_exact_slug_sweeps_still_lack_role_leafs_and_altcs_office_cards_still_lack_county_assignments`
- Florida: `official_local_offices_leaf_routes_to_partial_family_resource_center_and_current_myaccess_public_lane_is_cloudfront_blocked`
- Idaho: `reviewed_idaho_district_leaves_now_cover_12_counties_and_dhw_split_is_explicit_but_county_grade_remains_incomplete`
- Kansas: `reviewed_kansas_district_and_district_owned_leaves_now_cover_16_counties_but_export_backed_county_grade_coverage_is_still_incomplete`
- Maine: `official_maine_workbook_is_stable_mapping_only_and_contact_materialization_lane_still_500_plus_dhhs_office_html_has_no_county_contract`
- Massachusetts: `exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export`
- Minnesota: `mdeorg_root_is_live_but_actionable_child_routes_are_title_only_radware_shells_plus_mn_dhs_local_office_family_is_radware_challenged`
- Nebraska: `official_public_office_service_root_has_no_tables_and_office_schema_has_no_service_area_fields`
- New Hampshire: `official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable_with_no_live_nh_gov_successor_root`
- New Mexico: `district_leafs_missing_and_county_local_four_county_remainder_persists_after_empty_archive_tail`
- New York: `nygov_linked_exact_otda_and_mybenefits_successor_leaves_still_reset_while_health_ny_ldss_family_remains_unusable`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
- Ohio: `official_ohio_jfs_medicaid_and_ohio_gov_root_surfaces_all_404_while_education_inventory_root_only`
- Oklahoma: `live_okdhs_general_office_map_only_materializes_46_counties_while_same_host_child_support_tree_proves_county_contracts_exist_but_not_for_disability_local_routing`
- Oregon: `live_odhs_office_finder_is_only_a_custom_component_shell_with_no_public_county_extract_query_contract_or_api_surface`
- Rhode Island: `generic_or_statewide_evidence_used_where_local_required`
- South Dakota: `live_sd_educational_directory_exists_but_local_district_leaves_are_unauthored_and_localoffices_root_has_no_public_county_contract`
- Tennessee: `generic_or_statewide_evidence_used_where_local_required`
- Utah: `official_usbe_district_lea_directory_clears_education_but_live_dws_bundle_only_supports_city_or_zip_search_and_public_office_api_still_lacks_county_service_area_contract`
- Vermont: `generic_or_statewide_evidence_used_where_local_required`
- Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Washington: `generic_or_statewide_evidence_used_where_local_required`
- West Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Wisconsin: `generic_or_statewide_evidence_used_where_local_required`
- Wyoming: `legacy_or_inventory_only_evidence`

## Current Focus State: Utah

### Blocker Reason

`county_local_disability_resources` is the only remaining Utah critical blocker. The live Utah Schools Directory still clears education, but one more bounded official review on `https://dhhs.utah.gov/contacts/` confirms Utah still does not expose a county-grade disability-office contract. The reviewed official contacts page says users can find services by clicking on a county in the map below or by using the search bar to find services by type, but the public text still does not expose county-by-county office rows, county-to-disability-office assignments, or a reusable local-office export; it also tells users to visit specific division or program pages for local office information. The DWS office-search lane remains the closest reviewed local-office stack, but it still only exposes a city/ZIP-oriented first-party bundle plus office inventory rows without county or counties-served fields. Utah therefore remains BLOCKED and not index-safe.

### Exact Evidence Needed

- Any public Utah successor directory, export, or leaf set that explicitly maps counties to local DWS, DHHS, or disability-resource offices.
- Any reviewed first-party page behind the DHHS county-click service map that actually materializes county-local disability office assignments.
- Any public office API field or companion endpoint that adds `county`, `countiesServed`, or equivalent service-area assignments to the current Utah office inventory.

### Useful Official URLs Already Tried

- [Utah Schools Directory](https://schools.utah.gov/schoolsdirectory)
- [Utah DHHS Contacts](https://dhhs.utah.gov/contacts/)
- [Utah DHHS Customer Service](https://dhhs.utah.gov/customer-service/)
- [Utah DWS contact root](https://jobs.utah.gov/contact/index.html)
- [Older DWS public contact page with Office Map link](https://jobs.utah.gov/department/contact/index.html)
- [Legacy DWS office-search alias](https://jobs.utah.gov/jsp/officesearch/)
- [Live DWS Office Search shell](https://jobs.utah.gov/office-search/)
- [Live DWS bundle entrypoint](https://jobs.utah.gov/office-search/main-NUCK4XJI.js)
- [Live DWS bundle imported chunk](https://jobs.utah.gov/office-search/chunk-Y7CB7UTP.js)
- [Public DWS office API](https://officesearch-api.jobs.utah.gov/api/v1/offices)
- [Public DWS services API](https://officesearch-api.jobs.utah.gov/api/v1/services)
- [Exact office-services route](https://officesearch-api.jobs.utah.gov/api/v1/office-services)

### Top Remaining Source-Scouting Targets

- Any public county-click child route or export behind the official DHHS contacts map that materializes county-local disability office assignments.
- Any public companion API or downloadable artifact on `officesearch-api.jobs.utah.gov` that adds county or service-area assignments to the current office records.
- Any official Utah successor local-office directory that explicitly names counties served instead of only office city or ZIP.
## Next State Order After Utah

1. Kansas
2. Nebraska
3. Florida
4. Alaska
5. South Carolina
6. North Carolina
7. New York
8. Oklahoma
9. Oregon
10. Ohio10. Ohio