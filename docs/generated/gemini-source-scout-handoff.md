# Gemini Source Scout Handoff

Updated: 2026-06-23

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, New Jersey, Pennsylvania, Texas

## Current Blocked States

- Alaska: `live_dfcs_services_page_only_provides_statewide_phone_relay_while_health_host_county_equivalent_directory_stays_challenged`
- Arizona: `three_public_district_domains_official_api_and_exact_slug_sweeps_still_lack_role_leafs_and_altcs_office_cards_still_lack_county_assignments`
- Florida: `official_local_offices_leaf_routes_to_partial_family_resource_center_and_myaccess_results_stay_authenticated`
- Idaho: `reviewed_idaho_district_leaves_now_cover_12_counties_and_dhw_split_is_explicit_but_county_grade_remains_incomplete`
- Kansas: `reviewed_kansas_district_owned_leaves_now_cover_8_counties_but_export_backed_county_grade_coverage_is_still_incomplete`
- Maine: `official_maine_workbook_is_stable_mapping_only_and_contact_materialization_lane_still_500_plus_dhhs_office_html_has_no_county_contract`
- Massachusetts: `exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export`
- Minnesota: `mdeorg_root_is_live_but_actionable_child_routes_are_title_only_radware_shells_plus_mn_dhs_local_office_family_is_radware_challenged`
- Nebraska: `official_public_office_service_root_has_no_tables_and_office_schema_has_no_service_area_fields`
- Nevada: `official_county_local_pages_now_cover_13_of_17_counties_but_four_counties_lack_reviewed_local_route`
- New Hampshire: `official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable_with_no_live_nh_gov_successor_root`
- New Mexico: `district_leafs_missing_and_county_local_four_county_remainder_persists_after_empty_archive_tail`
- New York: `official_nysed_boces_pages_cover_non_nyc_counties_but_no_reviewed_nyc_borough_route_and_no_public_ldss_replacement`
- North Carolina: `generic_or_statewide_evidence_used_where_local_required`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
- Ohio: `retired_official_county_family_and_public_search_surfaces_still_dead_plus_education_inventory_root_only`
- Oklahoma: `generic_state_education_page_collapse_and_dead_dhhs_locator_host`
- Oregon: `official_ode_county_searchable_school_directory_clears_education_but_live_office_finder_root_still_has_no_county_extract`
- Rhode Island: `generic_or_statewide_evidence_used_where_local_required`
- South Carolina: `official_school_directory_root_is_live_but_not_yet_converted_into_district_owned_special_education_leaves`
- South Dakota: `live_sd_educational_directory_exists_but_local_district_leaves_are_unauthored_and_localoffices_root_has_no_public_county_contract`
- Tennessee: `generic_or_statewide_evidence_used_where_local_required`
- Utah: `generic_or_statewide_evidence_used_where_local_required`
- Vermont: `generic_or_statewide_evidence_used_where_local_required`
- Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Washington: `generic_or_statewide_evidence_used_where_local_required`
- West Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Wisconsin: `generic_or_statewide_evidence_used_where_local_required`
- Wyoming: `legacy_or_inventory_only_evidence`

## Current Focus State: Oregon

### Blocker Reason

`county_local_disability_resources` is now the top Oregon blocker in the state queue. The official ODE School Directory PDF clears education because it explicitly organizes districts by county and preserves district contact blocks, but the live ODHS office-finder root still returns only a generic `Find an Office` page in static HTML with no county list, no office extract, and no county-to-office contract.

### Exact Evidence Needed

- Any official ODHS county-to-office contract, county list, or office extract from the live office-finder stack.
- Or, official county-owned disability office leaves that can be truthfully mapped to Oregon counties.
- The ODE school-directory PDF no longer needs repair, but the live ODHS office-finder root is still not enough without county-grade routing fields.

### Useful Official URLs Already Tried

- [ODE Special Education root](https://www.oregon.gov/ode/students-and-family/specialeducation/pages/default.aspx)
- [ODE School Directory page](https://www.oregon.gov/ode/about-us/Pages/School-Directory.aspx)
- [ODE Combined Directory PDF](https://www.oregon.gov/ode/about-us/Documents/CombinedDirectory_20260430_024706.pdf)
- [ODHS Find an Office root](https://www.oregon.gov/odhs/pages/office-finder.aspx)
- [ODHS home](https://www.oregon.gov/odhs/Pages/default.aspx)
- [ODE home](https://www.oregon.gov/ode/Pages/default.aspx)

### Top Remaining Source-Scouting Targets

- Any official ODHS county list, office extract, or county-to-office contract behind the live office-finder lane.
- Any official county-owned disability office leaves that can replace DOI-backed planning rows.
- Any machine-readable ODHS successor artifact to the dead `dhhs.oregon.gov/locations` host.

## Next State Order After Oregon

1. Oklahoma
2. Utah
3. New Hampshire
4. New Mexico
5. New York
6. North Carolina
7. North Dakota
8. Rhode Island
9. South Carolina
10. South Dakota
