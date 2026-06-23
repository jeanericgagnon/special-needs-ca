# Gemini Source Scout Handoff

Updated: 2026-06-23

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, New Jersey, Pennsylvania, Texas

## Current Blocked States

- Alaska: `browser_only_dpa_directory_lacks_borough_mapping_and_dfcs_successor_hub_only_relays_into_challenged_health_host_leaves`
- Arizona: `three_public_district_domains_sitemap_exhausted_and_altcs_office_cards_still_lack_county_assignments`
- Florida: `official_local_offices_leaf_routes_to_partial_family_resource_center_and_myaccess_results_stay_authenticated`
- Idaho: `reviewed_idaho_district_leaves_now_cover_11_counties_and_dhw_split_is_explicit_but_county_grade_remains_incomplete`
- Kansas: `reviewed_kansas_district_owned_leaves_now_cover_8_counties_but_export_backed_county_grade_coverage_is_still_incomplete`
- Maine: `public_maine_sau_selectors_and_workbook_are_live_but_search_and_export_replays_still_500_and_dhhs_office_html_has_no_county_contract`
- Massachusetts: `exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_dds_locations_lane_still_lacks_county_export`
- Minnesota: `mdeorg_root_and_analytics_routes_flap_to_radware_plus_mn_dhs_local_office_family_is_radware_challenged`
- Nebraska: `official_public_office_service_root_has_no_tables_and_office_schema_has_no_service_area_fields`
- Nevada: `official_county_local_pages_now_cover_13_of_17_counties_but_four_counties_lack_reviewed_local_route`
- New Hampshire: `official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable_with_no_live_nh_gov_successor_root`
- New Mexico: `district_leafs_missing_and_county_local_four_county_remainder_persists_after_empty_archive_tail`
- New York: `official_nysed_boces_pages_cover_non_nyc_counties_but_no_reviewed_nyc_borough_route_and_no_public_ldss_replacement`
- North Carolina: `generic_or_statewide_evidence_used_where_local_required`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
- Ohio: `retired_official_county_family_no_live_successor_and_education_inventory_still_root_only`
- Oklahoma: `generic_state_education_page_collapse_and_dead_dhhs_locator_host`
- Oregon: `live_state_special_education_root_without_district_contract_and_live_office_finder_root_without_county_extract`
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

## Current Focus State: Florida

### Blocker Reason

`county_local_disability_resources` is still the only critical blocker. Florida now has an exact official `food-cash-and-medical` leaf that advertises `Local Offices`, but that link still resolves only to the partial Family Resource Center storefront lane rather than a full 67-county county-local contract. The public circuit leaves are still dead, and the anonymous MyACCESS county-result endpoints still require authentication.

### Exact Evidence Needed

- Any first-party Florida DCF county-complete local-office directory, customer service center table, or county-result contract that is public and anonymous.
- Or, a reviewed public Family Resource Center / local-offices dataset that expands from the current 34 county storefront rows to complete 67-county coverage.
- Or, anonymous MyACCESS county-result responses from the official `getZipCountyDetails` or `communityPartnerSearch` endpoints.
- Generic statewide circuit contacts and prose mentioning local offices are still not enough.

### Useful Official URLs Already Tried

- [Florida DCF sitemap](https://www.myflfamilies.com/sitemap.xml)
- [Florida DCF Contact Us](https://www.myflfamilies.com/contact-us)
- [Florida DCF contacts.csv](https://www.myflfamilies.com/contact-us/contacts.csv)
- [Florida Public Assistance](https://www.myflfamilies.com/services/public-assistance)
- [Florida Applying for Assistance](https://www.myflfamilies.com/services/public-assistance/applying-for-assistance)
- [Florida ESS FAQ](https://www.myflfamilies.com/services/public-assistance/economic-self-sufficiency-frequently-asked-questions/)
- [Florida Community Partner Network](https://www.myflfamilies.com/services/public-assistance/additional-resources-and-services/community/)
- [Florida Food Cash and Medical](https://www.myflfamilies.com/food-cash-and-medical)
- [Florida Family Resource Center](https://familyresourcecenter.myflfamilies.com/)
- [Florida Family Resource Center providers.csv](https://familyresourcecenter.myflfamilies.com/providers.csv)
- [MyACCESS Public CPCPS](https://myaccess.myflfamilies.com/Public/CPCPS)
- [MyACCESS Help HCINT](https://myaccess.myflfamilies.com/Help/HCINT)
- [MyACCESS appconfig](https://myaccess.myflfamilies.com/config/appconfig.js)
- [Sample dead circuit leaf](https://www.myflfamilies.com/contact-us/circuit-3)

### Top Remaining Source-Scouting Targets

- Any official Florida DCF local-offices dataset or directory that is county-complete instead of the current 34-county storefront lane.
- Any public, anonymous MyACCESS county-result response contract for `getZipCountyDetails` or `communityPartnerSearch`.
- Any first-party DCF county office or customer service center leaf that is actually live, reviewable, and county-bearing rather than just prose or dead sitemap children.

## Next State Order After Florida

1. Alaska
2. Ohio
3. Minnesota
4. Maine
5. Idaho
6. Arizona
7. Massachusetts
8. Oregon
9. Oklahoma
10. Utah
