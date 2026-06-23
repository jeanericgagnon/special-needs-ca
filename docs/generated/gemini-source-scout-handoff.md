# Gemini Source Scout Handoff

Updated: 2026-06-23

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, Nevada, New Jersey, Pennsylvania, South Carolina, Texas

## Current Blocked States

- Alaska: `live_dfcs_services_page_only_provides_statewide_phone_relay_while_health_host_county_equivalent_directory_stays_challenged`
- Arizona: `three_public_district_domains_official_api_and_exact_slug_sweeps_still_lack_role_leafs_and_altcs_office_cards_still_lack_county_assignments`
- Florida: `official_local_offices_leaf_routes_to_partial_family_resource_center_and_myaccess_results_stay_authenticated`
- Idaho: `reviewed_idaho_district_leaves_now_cover_12_counties_and_dhw_split_is_explicit_but_county_grade_remains_incomplete`
- Kansas: `reviewed_kansas_district_and_district_linked_coop_leaves_now_cover_10_counties_but_export_backed_county_grade_coverage_is_still_incomplete`
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

`county_local_disability_resources` is the only remaining Utah critical blocker. The live Utah Schools Directory still clears education, and the DWS office-search app exposes a public official API at `https://officesearch-api.jobs.utah.gov/api/v1/offices`, but that API still publishes only office inventory fields like office name, address, coordinates, service code, and assistance instructions. It does not expose county fields, counties served, or another reusable county-to-office contract. A bounded reverse-geocode pass on the 45 unique official office coordinates also materializes physical offices in only 26 of Utah's 29 counties, leaving Daggett, Morgan, and Rich without even an in-county office point. Utah therefore remains BLOCKED and not index-safe.

### Exact Evidence Needed

- Any first-party Utah county-complete office contract that explicitly maps counties to DWS, DHHS, or successor local offices.
- Any public successor Utah office API field or companion endpoint that adds `county`, `countiesServed`, service-area, or district-style assignment data to the current office inventory.
- Any official Utah successor local-office directory that explicitly closes the Daggett, Morgan, and Rich county remainder without inferred nearest-office routing.

### Useful Official URLs Already Tried

- [Utah Schools Directory](https://schools.utah.gov/schoolsdirectory)
- [Utah DWS contact root](https://jobs.utah.gov/contact/index.html)
- [Older DWS public contact page with Office Map link](https://jobs.utah.gov/department/contact/index.html)
- [Live DWS Office Search shell](https://jobs.utah.gov/office-search/)
- [Public DWS office API](https://officesearch-api.jobs.utah.gov/api/v1/offices)
- [Public DWS services API](https://officesearch-api.jobs.utah.gov/api/v1/services)
- [Public DWS office-services route](https://officesearch-api.jobs.utah.gov/api/v1/office-services)
- [API OpenAPI endpoint attempt](https://officesearch-api.jobs.utah.gov/openapi.json)
- [API Swagger UI attempt](https://officesearch-api.jobs.utah.gov/swagger-ui/index.html)
- [API v3 docs attempt](https://officesearch-api.jobs.utah.gov/v3/api-docs)
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
3. Nevada
4. Florida
5. Alaska
6. South Carolina
7. North Carolina
8. New York
9. Oklahoma
10. Oregon10. Oregon10. Oregon10. Massachusetts