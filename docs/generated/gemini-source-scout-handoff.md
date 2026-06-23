# Gemini Source Scout Handoff

Updated: 2026-06-23

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, Nevada, New Jersey, Pennsylvania, Texas

## Current Blocked States

- Alaska: `live_dfcs_services_page_only_provides_statewide_phone_relay_while_health_host_county_equivalent_directory_stays_challenged`
- Arizona: `three_public_district_domains_official_api_and_exact_slug_sweeps_still_lack_role_leafs_and_altcs_office_cards_still_lack_county_assignments`
- Florida: `official_local_offices_leaf_routes_to_partial_family_resource_center_and_myaccess_results_stay_authenticated`
- Idaho: `reviewed_idaho_district_leaves_now_cover_12_counties_and_dhw_split_is_explicit_but_county_grade_remains_incomplete`
- Kansas: `reviewed_kansas_district_owned_leaves_now_cover_9_counties_but_export_backed_county_grade_coverage_is_still_incomplete`
- Maine: `official_maine_workbook_is_stable_mapping_only_and_contact_materialization_lane_still_500_plus_dhhs_office_html_has_no_county_contract`
- Massachusetts: `exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export`
- Minnesota: `mdeorg_root_is_live_but_actionable_child_routes_are_title_only_radware_shells_plus_mn_dhs_local_office_family_is_radware_challenged`
- Nebraska: `official_public_office_service_root_has_no_tables_and_office_schema_has_no_service_area_fields`
- New Hampshire: `official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable_with_no_live_nh_gov_successor_root`
- New Mexico: `district_leafs_missing_and_county_local_four_county_remainder_persists_after_empty_archive_tail`
- New York: `official_nysed_boces_pages_cover_non_nyc_counties_but_no_reviewed_nyc_borough_route_and_no_public_ldss_replacement`
- North Carolina: `generic_or_statewide_evidence_used_where_local_required`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
- Ohio: `retired_official_county_family_and_public_search_surfaces_still_dead_plus_education_inventory_root_only`
- Oklahoma: `official_osde_state_school_directory_clears_education_but_dead_dhhs_locator_host_and_planning_rows_still_block_county_local`
- Oregon: `official_ode_county_searchable_school_directory_clears_education_but_live_office_finder_root_still_has_no_county_extract`
- Rhode Island: `generic_or_statewide_evidence_used_where_local_required`
- South Carolina: `official_school_directory_root_is_live_but_not_yet_converted_into_district_owned_special_education_leaves`
- South Dakota: `live_sd_educational_directory_exists_but_local_district_leaves_are_unauthored_and_localoffices_root_has_no_public_county_contract`
- Tennessee: `generic_or_statewide_evidence_used_where_local_required`
- Utah: `official_usbe_district_lea_directory_clears_education_and_live_dws_office_search_shell_still_lacks_public_county_office_contract`
- Vermont: `generic_or_statewide_evidence_used_where_local_required`
- Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Washington: `generic_or_statewide_evidence_used_where_local_required`
- West Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Wisconsin: `generic_or_statewide_evidence_used_where_local_required`
- Wyoming: `legacy_or_inventory_only_evidence`

## Current Focus State: Florida

### Blocker Reason

`county_local_disability_resources` is the only remaining Florida critical blocker. The exact official `food-cash-and-medical` leaf now advertises `Find Local Offices`, but it still routes into a partial 34-county Family Resource Center storefront lane, the public circuit leaves in the sitemap still 404, and the anonymous MyACCESS county-result endpoints still return `401 Unauthorized`, so Florida remains BLOCKED and not index-safe.

### Exact Evidence Needed

- Any first-party Florida county-complete local-offices contract that publicly covers all 67 counties.
- A reviewed anonymous MyACCESS county-result surface that returns public county-level local-office results without authentication.
- A public official county-office CSV, HTML table, sitemap child family, or other exact first-party route that does more than point back to the partial Family Resource Center storefront lane.

### Useful Official URLs Already Tried

- [Florida DCF sitemap](https://www.myflfamilies.com/sitemap.xml)
- [Florida DCF contact hub](https://www.myflfamilies.com/contact-us)
- [Florida DCF contacts.csv](https://www.myflfamilies.com/contact-us/contacts.csv)
- [Florida public assistance root](https://www.myflfamilies.com/services/public-assistance)
- [Florida applying-for-assistance](https://www.myflfamilies.com/services/public-assistance/applying-for-assistance)
- [Florida ESS FAQ](https://www.myflfamilies.com/services/public-assistance/economic-self-sufficiency-frequently-asked-questions/)
- [Florida community resources](https://www.myflfamilies.com/services/public-assistance/additional-resources-and-services/community/)
- [Florida food-cash-and-medical](https://www.myflfamilies.com/food-cash-and-medical)
- [Florida Family Resource Center](https://familyresourcecenter.myflfamilies.com/)
- [Florida Family Resource Center providers.csv](https://familyresourcecenter.myflfamilies.com/providers.csv)
- [Florida MyACCESS Public/CPCPS](https://myaccess.myflfamilies.com/Public/CPCPS)
- [Florida MyACCESS Help/HCINT](https://myaccess.myflfamilies.com/Help/HCINT)
- [Florida MyACCESS app config](https://myaccess.myflfamilies.com/config/appconfig.js)
- [Florida MyACCESS getZipCountyDetails](https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails)
- [Florida MyACCESS communityPartnerSearch](https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch)

### Top Remaining Source-Scouting Targets

- Any first-party Florida DCF or MyACCESS public local-office export that covers the 33 counties missing from the public Family Resource Center lane.
- Any live official `contact-us/circuit-*` successor children or replacement county-local leaves that no longer 404 and actually preserve county office routing.
- Any anonymous public county-result endpoint or downloadable local-office dataset on the current `myflfamilies.com` or `myaccess.myflfamilies.com` stack.

## Next State Order After Florida

1. Alaska
2. South Carolina
3. North Carolina
4. New York
5. Oklahoma
6. Oregon
7. Ohio
8. Minnesota
9. Maine
10. Idaho
