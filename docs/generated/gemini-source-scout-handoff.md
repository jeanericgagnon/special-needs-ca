# Gemini Source Scout Handoff

Updated: 2026-06-25

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, Ohio, Oklahoma, Oregon, Pennsylvania, South Carolina, Texas, Utah

## Current Blocked States

- Alaska: `reviewed_live_dpa_offices_page_now_public_but_only_groups_regional_offices_without_borough_or_census_area_assignment_while_dfcs_surfaces_add_no_local_mapping_contract`
- Arizona: `ahcccs_university_familycare_pdf_bundle_now_proves_non_contract_support_letters_and_azed_remaining_three_public_domains_still_lack_role_leaves`
- Idaho: `remaining_idaho_district_roots_now_split_between_live_homepage_sitemap_surfaces_without_role_bearing_leaves_and_one_blank_shell_challenge_after_bounded_exact_leaf_review`
- Maine: `official_dhhs_office_page_and_same_host_contact_sitemap_surfaces_still_expose_no_county_or_service_area_crosswalk`
- Massachusetts: `official_dese_export_plus_census_county_subdivision_crosswalk_clears_education_but_live_dds_locations_lane_still_lacks_county_capture_or_export`
- New Hampshire: `official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable_with_no_live_nh_gov_successor_root`
- New Mexico: `district_leafs_missing_and_county_local_four_county_remainder_persists_after_empty_archive_tail`
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

`county_local_disability_resources` is now the only remaining Massachusetts critical blocker. Education no longer blocks the state: the reviewed official DESE `search_export.aspx` attachment preserves structured district rows with `Town`, address, phone, and grade fields, and a bounded exact-basename join against the official Census TIGERweb county subdivision layer covers all 14 Massachusetts counties. The remaining blocker is the live DDS local-routing lane on Mass.gov. The DDS org page, locations index, and interactive regional map are real first-party surfaces, but they still expose no raw county field, no county export, and no machine-readable town-to-office contract that the low-token raw path can preserve directly on disk.

### Exact Evidence Needed

- Any official Mass.gov DDS surface that exposes county names, county-served labels, or a county-keyed export for DDS regional or area offices.
- Any reviewable browser/cached capture from the live DDS interactive map that preserves town-or-city to office mappings strongly enough to truthfully bridge all 14 counties.
- Any exact first-party DDS locations child page or API response that makes locality-to-office coverage machine-readable without relying on guessed paths.

### Useful Official URLs Already Tried

- [Massachusetts DESE district export](https://profiles.doe.mass.edu/search/search_export.aspx?orgCode=&orgType=5,12&runOrgSearch=Y&searchType=0&leftNavId=11238&showEmail=N)
- [Census TIGERweb county subdivision query](https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Places_CouSub_ConCity_SubMCD/MapServer/1/query?where=STATE%3D%2725%27&outFields=NAME,BASENAME,STATE,COUNTY,COUSUB,GEOID&returnGeometry=false&f=json)
- [Massachusetts DDS org page](https://www.mass.gov/orgs/department-of-developmental-services)
- [Massachusetts DDS locations index](https://www.mass.gov/orgs/department-of-developmental-services/locations)
- [Massachusetts DDS interactive regional map](https://www.mass.gov/info-details/interactive-dds-regional-map)

### Top Remaining Source-Scouting Targets

- Any live Mass.gov DDS county field, county export, or locality-to-office payload that can be preserved without guessing hidden endpoints.
- Any reviewed browser/cached DDS interactive-map capture that truthfully maps Massachusetts towns or cities to area offices and can then be bridged to counties.
- Any exact DDS child location page that adds county-served labels or a county routing contract.

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
