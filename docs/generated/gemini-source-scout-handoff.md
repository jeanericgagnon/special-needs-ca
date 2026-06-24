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
- Ohio: `retired_official_county_family_and_public_search_surfaces_still_dead_plus_education_inventory_root_only`
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

## Current Focus State: Oregon

### Blocker Reason

Oregon has one remaining California-grade blocker: `county_local_disability_resources`. Education is already cleared by the official county-searchable ODE Combined Directory PDF. The county-local lane is no longer blocked by an unknown successor host; it is now blocked because the live ODHS successor is only a custom office-finder component shell with no public county extract, query contract, or API surface.

### Exact Evidence Needed

- A live official Oregon county-grade ODHS office export, county list, or public office-result payload behind the current office-finder component.
- County-owned or ODHS-maintained local office leaves covering all 36 counties with direct routing evidence.
- Any public API, JSON, GeoJSON, KML, or export contract from the live office-finder stack that materializes office rows by county.

### Useful Official URLs Already Tried

- [Dead legacy ODHS locator host](https://dhhs.oregon.gov/locations)
- [Live ODHS office finder](https://www.oregon.gov/odhs/pages/office-finder.aspx)
- [County query probe](https://www.oregon.gov/odhs/pages/office-finder.aspx?county=Baker)
- [City query probe](https://www.oregon.gov/odhs/pages/office-finder.aspx?city=Salem)
- [Service query probe](https://www.oregon.gov/odhs/pages/office-finder.aspx?service=SNAP)
- [API-like probe](https://www.oregon.gov/odhs/pages/office-finder.aspx/_api/)
- [JSON-like probe](https://www.oregon.gov/odhs/pages/office-finder.aspx?format=json)
- [ODE School Directory page](https://www.oregon.gov/ode/about-us/Pages/School-Directory.aspx)

### Top Remaining Source-Scouting Targets

- Any live public data contract behind the custom `<odhs-office-finder />` component.
- Any county-owned or ODHS-maintained office leaves that bypass the current component shell and directly list county office contact data.
- Any Oregon-hosted export or service endpoint that the office-finder uses client-side but does not expose in the current raw page source.

## Next State Order After Oregon

1. Ohio
2. Minnesota
3. Maine
4. Idaho
5. Arizona
6. Massachusetts
7. New Mexico
8. South Dakota
9. Rhode Island
10. Virginia
