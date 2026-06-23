# Gemini Source Scout Handoff

Updated: 2026-06-23

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, New Jersey, Pennsylvania, Texas

## Current Blocked States

- Alaska: `browser_only_dpa_directory_lacks_borough_mapping_and_dfcs_successor_hub_only_relays_into_challenged_health_host_leaves`
- Arizona: `three_public_district_domains_sitemap_exhausted_and_altcs_office_cards_still_lack_county_assignments`
- Florida: `public_assistance_sitemap_exposes_dead_circuit_leaves_and_myaccess_results_stay_authenticated`
- Idaho: `reviewed_idaho_district_leaves_now_cover_11_counties_and_dhw_split_is_explicit_but_county_grade_remains_incomplete`
- Kansas: `reviewed_kansas_district_owned_leaves_now_cover_8_counties_but_export_backed_county_grade_coverage_is_still_incomplete`
- Maine: `public_maine_sau_selectors_and_workbook_are_live_but_search_and_export_replays_still_500_and_dhhs_office_html_has_no_county_contract`
- Massachusetts: `exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_dds_locations_lane_still_lacks_county_export`
- Minnesota: `mdeorg_root_and_analytics_routes_flap_to_radware_plus_mn_dhs_local_office_family_is_radware_challenged`
- Nebraska: `official_public_office_service_root_has_no_tables_and_office_schema_has_no_service_area_fields`
- Nevada: `live_welfare_office_pages_without_county_contract`
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

## Current Focus State: Nebraska

### Blocker Reason

`county_local_disability_resources` is still the only critical blocker. Nebraska’s public DHHS office stack is fully inspectable, but it still exposes no county-assignment artifact: the public FeatureServer root has `tables: []`, both layers have empty relationships, and the office schema is contact-only.

### Exact Evidence Needed

- Any official Nebraska county-to-office assignment artifact, service-area table, downloadable office coverage file, or public schema field that explicitly maps the remaining counties to office coverage.
- A public DHHS or GIS artifact is required; generic office-location roots and county boundary layers are not enough.
- Strongest remaining need: a reviewed official county coverage contract for the 56 counties not explicitly represented by the 37 distinct `USER_County` office values.

### Useful Official URLs Already Tried

- [Nebraska Public Assistance Offices](https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx)
- [Nebraska Public Office Location Experience](https://gis.ne.gov/portal/apps/experiencebuilder/experience/?id=76a6ec0ec7c449448c95d00f59002457)
- [Nebraska office app config](https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json)
- [Nebraska office FeatureServer root](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer?f=pjson)
- [Nebraska office layer schema](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0?f=pjson)
- [Nebraska office layer distinct county coverage](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&outFields=USER_County&returnDistinctValues=true&returnGeometry=false&f=json)
- [Nebraska county layer schema](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/1?f=pjson)

### Top Remaining Source-Scouting Targets

- Official Nebraska DHHS or GIS artifacts outside the current FeatureServer pair that could expose service-area assignments.
- Any official downloadable office coverage document, CSV/XLS/PDF, or ArcGIS related table not already exposed from the public service root.
- Any official public query surface on the DHHS/GIS stack that returns county-to-office coverage instead of just office contact rows.

## Next State Order After Nebraska

1. Nevada
2. Florida
3. Alaska
4. Ohio
5. Minnesota
6. Maine
7. Idaho
8. Arizona
9. Massachusetts
10. Oregon
11. Oklahoma
12. Utah
