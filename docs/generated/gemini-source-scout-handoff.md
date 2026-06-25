# Gemini Source Scout Handoff

Updated: 2026-06-25

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, Ohio, Oklahoma, Oregon, Pennsylvania, South Carolina, Texas, Utah

## Current Blocked States

- Alaska: `reviewed_live_dpa_offices_and_dpa_services_pages_still_lack_borough_assignment_while_raw_health_page_sitemap_robots_and_search_all_403`
- Arizona: `ahcccs_university_familycare_pdf_bundle_now_proves_non_contract_support_letters_and_live_public_education_surface_recheck_confirms_three_public_domains_still_lack_role_leaves`
- Idaho: `remaining_idaho_district_roots_and_live_sitemaps_still_materialize_only_wrong_role_or_generic_leaves_without_special_education_routing`
- Maine: `official_dhhs_office_pages_and_public_county_workbooks_exist_but_still_expose_no_county_to_office_or_service_area_contract`
- Massachusetts: `official_dese_export_plus_census_county_subdivision_crosswalk_clears_education_but_live_dds_browser_lane_without_raw_county_contract_remains`
- New Hampshire: `official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable_with_no_live_nh_gov_successor_root`
- New Mexico: `current_ped_host_timeouts_plus_dead_legacy_education_host_leave_zero_local_education_leaves_and_official_dvr_root_still_returns_401_without_reviewed_public_alternate`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
- Rhode Island: `generic_or_statewide_evidence_used_where_local_required`
- South Dakota: `live_sd_educational_directory_exists_but_local_district_leaves_are_unauthored_and_localoffices_root_has_no_public_county_contract`
- Tennessee: `generic_or_statewide_evidence_used_where_local_required`
- Vermont: `generic_or_statewide_evidence_used_where_local_required`
- Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Washington: `generic_or_statewide_evidence_used_where_local_required`
- West Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Wisconsin: `generic_or_statewide_evidence_used_where_local_required`
- Wyoming: `legacy_or_inventory_only_evidence`

## Current Focus State: Massachusetts

### Blocker Reason

`county_local_disability_resources` is the only remaining Massachusetts blocker. Education is already cleared by the official DESE district export plus the official Census TIGERweb county-subdivision crosswalk. The remaining blocker is the Massachusetts DDS county-local lane: the live DDS org page, locations index, and interactive regional map are known first-party surfaces, but the low-token raw lane still does not preserve a county field, county export, or machine-readable town-to-office contract. The repo-side fetch path still hits HTTP 403 on the exact locations index and interactive map URLs, so there is still no disk-preserved county-grade DDS crosswalk.

### Exact Evidence Needed

- Any current official Massachusetts DDS page, export, JSON, ArcGIS layer, HTML table, or PDF that explicitly binds towns or counties to DDS regional or area offices.
- Any reviewable first-party DDS locality capture that preserves town-to-office or county-to-office routing on disk rather than only in a transient browser interaction.
- Any official county field or export on the DDS locations index or interactive regional map that can be replayed from disk without generic fallback.

### Useful Official URLs Already Tried

- [Massachusetts DDS org page](https://www.mass.gov/orgs/department-of-developmental-services)
- [Massachusetts DDS locations index](https://www.mass.gov/orgs/department-of-developmental-services/locations)
- [Massachusetts interactive DDS regional map](https://www.mass.gov/info-details/interactive-dds-regional-map)
- [Stale guessed DDS area offices path](https://www.mass.gov/info-details/dds-area-offices)
- [DESE profiles search](https://profiles.doe.mass.edu/search/search.aspx?leftNavId=11238)
- [DESE district export](https://profiles.doe.mass.edu/search/search_export.aspx?orgCode=&orgType=5,12&runOrgSearch=Y&searchType=0&leftNavId=11238&showEmail=N)
- [Census TIGERweb county subdivisions](https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Places_CouSub_ConCity_SubMCD/MapServer/1/query?where=STATE%3D%2725%27&outFields=NAME,BASENAME,STATE,COUNTY,COUSUB,GEOID&returnGeometry=false&f=json)

### Top Remaining Source-Scouting Targets

- Any official DDS surface that upgrades the current browser-readable town/city lookup purpose into a reusable town-to-office or county-to-office contract on disk.
- Any current Mass.gov export, embedded JSON, or ArcGIS payload behind the DDS map or locations index that preserves locality-to-office bindings.
- Any reviewed browser/cached locality capture from the DDS map that can be preserved as first-party locality evidence rather than a generic area-office inventory.

## Next State Order After Massachusetts

1. New Mexico
2. South Dakota
3. Rhode Island
4. Virginia
5. West Virginia
6. North Dakota
7. Wisconsin
8. Washington
9. Tennessee
10. Vermont
