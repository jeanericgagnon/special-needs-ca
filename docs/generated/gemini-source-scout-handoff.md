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

## Current Focus State: Utah

### Blocker Reason

`county_local_disability_resources` is the only remaining Utah critical blocker. The live Utah Schools Directory still clears education, and the DWS office-search lane is now bounded to a stricter first-party bundle contract rather than just a guessed API family. `https://jobs.utah.gov/office-search/` loads a public JS bundle whose config points to `https://officesearch-api.jobs.utah.gov`, whose resolver fetches `/api/v1/offices`, whose service cache fetches `/api/v1/services`, and whose optional `getOfficeServices()` hook still points to `/api/v1/office-services`. The live bundle search logic only filters office rows by `city` and then `zipCode`, then falls back to nearest-office geocoding; it still has no county filter, county field, or counties-served field in the page HTML or reviewed bundle text. The public office payload still returns only office inventory rows with fields like `officeName`, address, city, zip, service, and coordinates, the services payload still returns only service classes, the exact `office-services` route still returns JSON `404 Not Found`, and a bounded reverse-geocode pass still materializes physical offices in only 26 of Utah's 29 counties, leaving Daggett, Morgan, and Rich without even an in-county office point. One more payload-text audit confirms `Daggett` and `Morgan` never appear anywhere in the public JSON while `Rich` appears only as `Richfield`, not as Rich County routing. Utah therefore remains BLOCKED and not index-safe.

### Exact Evidence Needed

- Any first-party Utah county-complete office contract that explicitly maps counties to DWS, DHHS, or successor local offices.
- Any public successor Utah office API field or companion endpoint that adds `county`, `countiesServed`, service-area, or district-style assignment data to the current office inventory.
- Any official Utah successor local-office directory that explicitly closes the Daggett, Morgan, and Rich county remainder without inferred nearest-office routing.

### Useful Official URLs Already Tried

- [Utah Schools Directory](https://schools.utah.gov/schoolsdirectory)
- [Utah DWS contact root](https://jobs.utah.gov/contact/index.html)
- [Older DWS public contact page with Office Map link](https://jobs.utah.gov/department/contact/index.html)
- [Legacy DWS office-search alias](https://jobs.utah.gov/jsp/officesearch/)
- [Live DWS Office Search shell](https://jobs.utah.gov/office-search/)
- [Live DWS bundle entrypoint](https://jobs.utah.gov/office-search/main-NUCK4XJI.js)
- [Live DWS bundle imported chunk](https://jobs.utah.gov/office-search/chunk-Y7CB7UTP.js)
- [Public DWS office API](https://officesearch-api.jobs.utah.gov/api/v1/offices)
- [Public DWS services API](https://officesearch-api.jobs.utah.gov/api/v1/services)
- [Exact office-services route](https://officesearch-api.jobs.utah.gov/api/v1/office-services)
- [jobs.utah.gov sitemap.xml](https://jobs.utah.gov/sitemap.xml)
- [Older DWS services locations page](https://jobs.utah.gov/customereducation/serviceslocations.html)
- [Utah DHHS contacts](https://dhhs.utah.gov/contacts/)
- [Utah DHHS customer service](https://dhhs.utah.gov/customer-service/)
- [Older DHHS locations route](https://dhhs.utah.gov/locations)
- [Census reverse geocoder used only to county-key official office coordinates](https://geocoding.geo.census.gov/geocoder/geographies/coordinates)

### Top Remaining Source-Scouting Targets

- Any public companion API or downloadable artifact on `officesearch-api.jobs.utah.gov` that adds county or service-area assignments to the 45 unique office records.
- Any reviewed official Utah local-office directory that explicitly names counties served, especially where office names are city-based rather than county-based.
- Any official Utah successor to the dead `serviceslocations.html` or `dhhs.utah.gov/locations` routes that exposes county-grade local-office coverage for Daggett, Morgan, and Rich.
## Next State Order After Utah

1. Kansas
2. Nebraska
3. Florida
4. Alaska
5. New York
6. Oklahoma
7. Oregon
8. Ohio
9. Minnesota
10. Maine10. Maine10. Maine