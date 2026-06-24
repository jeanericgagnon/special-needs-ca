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
- Oregon: `live_odhs_office_finder_is_only_a_sharepoint_leaflet_shell_with_no_public_county_extract_or_query_contract`
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

## Current Focus State: Oregon

### Blocker Reason

Oregon has one remaining California-grade blocker: `county_local_disability_resources`. Education is already cleared by the current official ODE county-searchable school directory. The county-local lane is no longer blocked by a missing successor root; it is now blocked because the live ODHS office-finder still only exposes a public app shell with no county-grade office extract.

### Exact Evidence Needed

- A live official Oregon ODHS office export, result payload, or county-owned ODHS local-office leaves that materialize office rows for all 36 counties.
- A public county list, office result payload, or service-area contract from the live office-finder itself, not just generic map/search controls.
- Any public official Oregon local-office surface that replaces the current DOI-backed planning rows with real county-to-office routing.

### Useful Official URLs Already Tried

- [Dead Oregon legacy locations host](https://dhhs.oregon.gov/locations)
- [Live ODHS Office Finder successor root](https://www.oregon.gov/odhs/pages/office-finder.aspx)
- [Office Finder county query probe](https://www.oregon.gov/odhs/pages/office-finder.aspx?county=Baker)
- [Office Finder city query probe](https://www.oregon.gov/odhs/pages/office-finder.aspx?city=Salem)
- [Official Oregon robots.txt](https://www.oregon.gov/robots.txt)

### Top Remaining Source-Scouting Targets

- Any public ODHS office-finder result endpoint, export lane, or office payload that the current page shell calls client-side.
- Any official Oregon county-owned or ODHS-maintained local-office leaves that preserve county identity and direct office contact routing.
- Any live public successor lane on `oregon.gov/odhs` that exposes county-served offices without depending on the old DOI planning dataset.

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
