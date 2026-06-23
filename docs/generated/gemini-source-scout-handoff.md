# Gemini Source Scout Handoff

Updated: 2026-06-23

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, Nevada, New Jersey, North Carolina, Pennsylvania, South Carolina, Texas

## Current Blocked States

- Alaska: `live_dfcs_services_page_only_provides_statewide_phone_relay_while_current_health_and_legacy_dhss_dpa_hosts_stay_gate_blocked`
- Arizona: `three_public_district_domains_official_api_and_exact_slug_sweeps_still_lack_role_leafs_and_altcs_office_cards_still_lack_county_assignments`
- Florida: `official_local_offices_leaf_routes_to_partial_family_resource_center_and_myaccess_public_shell_only_exposes_dataexchangeproxy_shell`
- Idaho: `reviewed_idaho_district_leaves_now_cover_12_counties_and_dhw_split_is_explicit_but_county_grade_remains_incomplete`
- Kansas: `reviewed_kansas_district_and_district_linked_coop_leaves_now_cover_14_counties_but_export_backed_county_grade_coverage_is_still_incomplete`
- Maine: `official_maine_workbook_is_stable_mapping_only_and_contact_materialization_lane_still_500_plus_dhhs_office_html_has_no_county_contract`
- Massachusetts: `exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export`
- Minnesota: `mdeorg_root_is_live_but_actionable_child_routes_are_title_only_radware_shells_plus_mn_dhs_local_office_family_is_radware_challenged`
- Nebraska: `official_public_office_service_root_has_no_tables_and_office_schema_has_no_service_area_fields`
- New Hampshire: `official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable_with_no_live_nh_gov_successor_root`
- New Mexico: `district_leafs_missing_and_county_local_four_county_remainder_persists_after_empty_archive_tail`
- New York: `official_nysed_boces_pages_cover_non_nyc_counties_but_no_reviewed_nyc_borough_route_and_nygov_linked_otda_successor_leaves_still_reset`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
- Ohio: `retired_official_county_family_and_public_search_surfaces_still_dead_plus_education_inventory_root_only`
- Oklahoma: `official_osde_state_school_directory_clears_education_but_dead_dhhs_locator_host_and_planning_rows_still_block_county_local`
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

## Current Focus State: Florida

### Blocker Reason

`county_local_disability_resources` is the only remaining Florida critical blocker. The live DCF local-offices leaf, the Family Resource Center storefront, and the current MyACCESS public shell surfaces are all readable enough to prove what is missing: Florida still has no county-complete public local-office contract, and the present MyACCESS office-mapping lane is only a shell contract.

### Exact Evidence Needed

- A first-party Florida DCF or MyACCESS county-complete local-offices directory or export that maps all 67 counties to public assistance / ESS office routing.
- An anonymous official MyACCESS office-mapping or county-result contract that returns real office or community-partner results without authentication.
- A first-party Family Resource Center or DCF local-office lane that expands beyond the current 34-county storefront contract and publishes the full county set.

### Useful Official URLs Already Tried

- [Florida DCF food-cash-and-medical page](https://www.myflfamilies.com/food-cash-and-medical)
- [Florida Family Resource Center root](https://familyresourcecenter.myflfamilies.com/)
- [Florida Family Resource Center providers.csv](https://familyresourcecenter.myflfamilies.com/providers.csv)
- [MyACCESS Public CPCPS](https://myaccess.myflfamilies.com/Public/CPCPS)
- [MyACCESS Help HCINT](https://myaccess.myflfamilies.com/Help/HCINT)
- [MyACCESS appconfig](https://myaccess.myflfamilies.com/config/appconfig.js)
- [MyACCESS config.json shell](https://myaccess.myflfamilies.com/config/config.json)
- [MyACCESS swagger shell](https://myaccess.myflfamilies.com/swagger)
- [MyACCESS swagger index shell](https://myaccess.myflfamilies.com/swagger/index.html)
- [MyACCESS dataexchangeproxy shell](https://myaccess.myflfamilies.com/dataexchangeproxy)

### Top Remaining Source-Scouting Targets

- Any official DCF or MyACCESS export or API path that materially extends the public county-local contract beyond the 34 counties in `providers.csv`.
- Any exact first-party DCF county office page or local-office directory leaf that is linked from current public-assistance pages but not yet exposed in the current sitemap.
- Any anonymous result lane on the official MyACCESS host that returns real county storefront or office rows without an authenticated or JS-only shell step.

## Next State Order After Florida

1. Utah
2. Kansas
3. Nebraska
4. Alaska
5. New York
6. Oklahoma
7. Oregon
8. Ohio
9. Minnesota
10. Maine
