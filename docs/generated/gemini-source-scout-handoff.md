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

## Current Focus State: Massachusetts

### Blocker Reason

`district_or_county_education_routing` remains the top Massachusetts blocker in the state queue. The hidden DESE district-directory replay still no longer materializes local rows, and the live official School Finder at `get_closest_orgs.aspx` only accepts address, city, or town inputs. It exposes superintendent and address-oriented local search behavior, but no county field, no county selector, and no export lane that can be truthfully bridged to county rows.

### Exact Evidence Needed

- Any official Massachusetts DESE county-to-district contract, county selector, or county-keyed export.
- Or, a reviewed browser/cached DESE or DDS locality capture that can be truthfully bridged to counties.
- Or, an official DDS county crosswalk or county-served export.
- The live School Finder, the non-materializing hidden replay, and the DDS raw-403 location pages are still not enough without county-grade routing fields.

### Useful Official URLs Already Tried

- [DESE district-directory bridge](https://profiles.doe.mass.edu/search/search_link.aspx?orgType=5,12&runOrgSearch=Y&leftNavId=11238)
- [DESE Profiles Search](https://profiles.doe.mass.edu/search/search.aspx?leftNavId=11238)
- [DESE School Finder](https://profiles.doe.mass.edu/search/get_closest_orgs.aspx)
- [DESE Search, Export and Mailing Labels help](https://profiles.doe.mass.edu/help/search.aspx?leftNavId=12104)
- [DDS org page](https://www.mass.gov/orgs/department-of-developmental-services)
- [DDS locations index](https://www.mass.gov/orgs/department-of-developmental-services/locations)
- [DDS interactive regional map](https://www.mass.gov/info-details/interactive-dds-regional-map)

### Top Remaining Source-Scouting Targets

- Any official Massachusetts DESE county-keyed export, selector, or district crosswalk.
- Any official DDS county crosswalk or county-served locality export.
- Any reviewed browser/cached locality capture from DESE or DDS that can be truthfully bridged to counties.

## Next State Order After Massachusetts

1. Oregon
2. Oklahoma
3. Utah
4. New Hampshire
5. New Mexico
6. New York
7. North Carolina
8. North Dakota
9. Rhode Island
10. South Carolina
