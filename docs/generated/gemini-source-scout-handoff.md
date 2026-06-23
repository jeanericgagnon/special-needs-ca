# Gemini Source Scout Handoff

Updated: 2026-06-23

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, Nevada, New Jersey, North Carolina, Pennsylvania, South Carolina, Texas

## Current Blocked States

- Alaska: `live_dfcs_services_page_and_public_dfcs_search_still_expose_no_borough_routing_while_current_health_and_legacy_dhss_dpa_hosts_stay_gate_blocked`
- Arizona: `three_public_district_domains_official_api_and_exact_slug_sweeps_still_lack_role_leafs_and_altcs_office_cards_still_lack_county_assignments`
- Florida: `official_local_offices_leaf_routes_to_partial_family_resource_center_and_myaccess_public_shell_only_exposes_dataexchangeproxy_shell`
- Idaho: `reviewed_idaho_district_leaves_now_cover_12_counties_and_dhw_split_is_explicit_but_county_grade_remains_incomplete`
- Kansas: `reviewed_kansas_district_and_district_owned_leaves_now_cover_15_counties_but_export_backed_county_grade_coverage_is_still_incomplete`
- Maine: `official_maine_workbook_is_stable_mapping_only_and_contact_materialization_lane_still_500_plus_dhhs_office_html_has_no_county_contract`
- Massachusetts: `exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export`
- Minnesota: `mdeorg_root_is_live_but_actionable_child_routes_are_title_only_radware_shells_plus_mn_dhs_local_office_family_is_radware_challenged`
- Nebraska: `official_public_office_service_root_has_no_tables_and_office_schema_has_no_service_area_fields`
- New Hampshire: `official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable_with_no_live_nh_gov_successor_root`
- New Mexico: `district_leafs_missing_and_county_local_four_county_remainder_persists_after_empty_archive_tail`
- New York: `nygov_linked_exact_otda_successor_leaves_still_reset_while_health_ny_ldss_family_remains_unusable`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
- Ohio: `retired_official_county_family_and_public_search_surfaces_still_dead_plus_education_inventory_root_only`
- Oklahoma: `live_okdhs_office_map_only_materializes_46_counties_and_no_disability_local_export_closes_the_77_county_contract`
- Oregon: `official_ode_county_searchable_school_directory_clears_education_but_live_office_finder_root_still_has_no_county_extract`
- Rhode Island: `generic_or_statewide_evidence_used_where_local_required`
- South Dakota: `live_sd_educational_directory_exists_but_local_district_leaves_are_unauthored_and_localoffices_root_has_no_public_county_contract`
- Tennessee: `generic_or_statewide_evidence_used_where_local_required`
- Utah: `official_usbe_district_lea_directory_clears_education_but_public_dws_office_api_only_materializes_26_of_29_physical_office_counties_and_still_lacks_county_service_area_contract`
- Vermont: `generic_or_statewide_evidence_used_where_local_required`
- Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Washington: `generic_or_statewide_evidence_used_where_local_required`
- West Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Wisconsin: `generic_or_statewide_evidence_used_where_local_required`
- Wyoming: `legacy_or_inventory_only_evidence`

## Current Focus State: Oklahoma

### Blocker Reason

Oklahoma has one remaining California-grade blocker: `county_local_disability_resources`. Education is already cleared by the current official OSDE State School and District Directory. The county-local lane is no longer blocked by an unknown successor host; it is now blocked because the live official Oklahoma Human Services office-map lane still fails to prove all 77 counties.

### Exact Evidence Needed

- A live official Oklahoma county-grade local office export, directory, or county-owned leaves that closes the remaining 31 counties not materialized by the current office-map KML.
- County-owned or state-maintained local office leaves with real county routing, not planning placeholders or service-specific substitutes.
- Any public Oklahoma disability/local-office surface that preserves county-to-office assignments directly for the counties the current map still misses.

### Useful Official URLs Already Tried

- [Dead Oklahoma DHHS locator host](https://dhhs.oklahoma.gov/locations)
- [Official Oklahoma Human Services Contact Us page](https://oklahoma.gov/okdhs/contact-us.html)
- [Public Oklahoma Human Services office-map KML](https://www.google.com/maps/d/kml?mid=1w_a87-58BajiMsz61WcDuiR8LaT6FPw&forcekml=1)
- [Official Oklahoma DDS Apply for Services page](https://oklahoma.gov/okdhs/services/dds/areacontactinfo.html)
- [Official Oklahoma Child Support office locations page](https://oklahoma.gov/okdhs/services/child-support-services/officelocations.html)
- [Official Oklahoma State School Directory](https://oklahoma.gov/education/resources/state-school-directory.html)

### Top Remaining Source-Scouting Targets

- Any live Oklahoma Human Services county export or office dataset that extends the current public KML from 46 county-keyed locations to full statewide county coverage.
- Any county-owned or state-maintained Oklahoma Human Services local office leaves for the 31 counties still missing from the current office-map evidence.
- Any live DDS, OHCA, or Human Services local-office surface on `oklahoma.gov` that explicitly lists counties served per office.

## Next State Order After Oklahoma

1. Oregon
2. Ohio
3. Minnesota
4. Maine
5. Idaho
6. Arizona
7. Massachusetts
8. New Mexico
9. South Dakota
10. Rhode Island
