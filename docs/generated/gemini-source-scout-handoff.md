# Gemini Source Scout Handoff

Updated: 2026-06-25

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, Ohio, Oklahoma, Oregon, Pennsylvania, South Carolina, Tennessee, Texas, Utah

## Current Blocked States

- Alaska: `reviewed_live_dpa_regions_cross_multiple_borough_or_census_area_boundaries_and_raw_health_page_sitemap_robots_search_all_403`
- Arizona: `current_altcs_html_lane_and_ahcccs_universityfamilycare_bundle_remain_non_contract_and_three_reviewed_public_district_domains_still_lack_role_leaves`
- Idaho: `remaining_idaho_district_roots_and_live_sitemaps_still_materialize_only_contact_title_ix_or_generic_leaves_without_special_education_routing`
- Maine: `official_dhhs_office_cross_program_referrals_and_public_county_workbooks_still_expose_no_county_to_office_or_service_area_contract`
- Massachusetts: `official_dese_export_plus_census_county_subdivision_crosswalk_clears_education_and_reviewed_dds_locality_capture_covers_13_of_14_counties_but_suffolk_remains_unresolved`
- New Hampshire: `official_nh_dhhs_education_and_vr_host_families_still_return_access_denied_shell_and_saved_dhhs_replacement_hosts_remain_dns_dead`
- New Mexico: `official_webed_directory_workbooks_are_live_single_sheet_exports_with_no_county_field_or_rec_service_area_contract_and_official_dvr_root_still_returns_401_without_reviewed_public_alternate`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
- Rhode Island: `generic_or_statewide_evidence_used_where_local_required`
- South Dakota: `live_sd_educational_directory_exists_but_local_district_leaves_are_unauthored_and_localoffices_root_has_no_public_county_contract`
- Vermont: `generic_or_statewide_evidence_used_where_local_required`
- Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Washington: `generic_or_statewide_evidence_used_where_local_required`
- West Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Wisconsin: `generic_or_statewide_evidence_used_where_local_required`
- Wyoming: `legacy_or_inventory_only_evidence`

## Current Focus State: Massachusetts

### Blocker Reason

`county_local_disability_resources` is the only Massachusetts blocker left. The live Mass.gov DDS locations lane is much stronger than the older host-wide-403 assumption: reviewed first-party area-office cards now preserve explicit `This area office serves the following towns and communities:` text and already clear 13 of 14 counties through a bounded town-to-county bridge. The exact remainder is Suffolk County. Bounded Boston, Chelsea, Revere, Winthrop, and Charlestown scans on the same official lane still do not preserve a Suffolk-serving town/community contract, and a fresh 2026-06-25 raw recheck confirmed `https://www.mass.gov/orgs/department-of-developmental-services/locations` still returns the same HTTP 403 `Not allowed` shell in the low-token lane, so no replayable county export has been recovered yet.

### Exact Evidence Needed

- Any current official Mass.gov DDS page, export, or interactive-map surface that explicitly assigns a Suffolk-serving DDS area office by town, community, county, or machine-readable locality field.
- Any current official Mass.gov DDS county field or county-grade export that covers Suffolk directly instead of requiring inference from office names or region labels.
- Any current official Suffolk-serving locality list on the DDS locations lane that names Boston, Chelsea, Revere, Winthrop, Charlestown, or other Suffolk communities inside a single reviewable office contract.

### Useful Official URLs Already Tried

- [Massachusetts DESE district export](https://profiles.doe.mass.edu/search/search_export.aspx?orgCode=&orgType=5,12&runOrgSearch=Y&searchType=0&leftNavId=11238&showEmail=N)
- [Census TIGERweb county subdivision query](https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Places_CouSub_ConCity_SubMCD/MapServer/1/query?where=STATE%3D%2725%27&outFields=NAME,BASENAME,STATE,COUNTY,COUSUB,GEOID&returnGeometry=false&f=json)
- [Massachusetts DDS org page](https://www.mass.gov/orgs/department-of-developmental-services)
- [Massachusetts DDS locations index](https://www.mass.gov/orgs/department-of-developmental-services/locations)
- [Massachusetts DDS interactive regional map](https://www.mass.gov/info-details/interactive-dds-regional-map)

### Top Remaining Source-Scouting Targets

- Any reviewed Mass.gov DDS child page or export that preserves a Suffolk-serving town/community list directly.
- Any reviewed Mass.gov DDS locality or search surface that names a Suffolk community inside an office-serving contract.
- Any reviewed official cached/exported DDS locality artifact that can be replayed from disk and tied directly to Suffolk County without inference.

## Next State Order After Massachusetts

1. Alaska
2. Maine
3. Idaho
4. New Mexico
5. Arizona
6. New Hampshire
