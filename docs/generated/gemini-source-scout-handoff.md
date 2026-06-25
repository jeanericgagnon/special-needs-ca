# Gemini Source Scout Handoff

Updated: 2026-06-25

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, Ohio, Oklahoma, Oregon, Pennsylvania, South Carolina, Tennessee, Texas, Utah, Virginia, Washington, West Virginia, Wisconsin

## Current Blocked States

- Alaska: `reviewed_live_dpa_offices_page_still_only_groups_regions_while_raw_health_host_403_persists_and_dfcs_adds_no_borough_or_census_area_contract`
- Arizona: `ahcccs_university_familycare_pdf_bundle_now_proves_non_contract_support_letters_and_live_public_education_surface_recheck_confirms_three_public_domains_still_lack_role_leaves`
- Idaho: `remaining_idaho_district_roots_now_reduce_to_camas_and_clark_wrong_role_leaves_without_special_education_or_student_services_routing`
- Maine: `official_dhhs_nav_stack_still_exposes_office_addresses_and_labels_but_no_county_or_service_area_contract`
- Massachusetts: `official_dese_export_plus_census_county_subdivision_crosswalk_clears_education_and_reviewed_dds_locality_capture_covers_13_of_14_counties_but_suffolk_remains_unresolved`
- New Hampshire: `official_nh_dhhs_education_and_vr_host_families_still_return_access_denied_shell_and_saved_dhhs_replacement_hosts_remain_dns_dead`
- New Mexico: `official_webed_sharepoint_lists_and_six_public_workbooks_are_live_but_still_expose_no_county_field_or_rec_service_area_contract_and_official_dvr_root_still_returns_401_without_reviewed_public_alternate`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
- Rhode Island: `generic_or_statewide_evidence_used_where_local_required`
- South Dakota: `live_sd_educational_directory_exists_but_local_district_leaves_are_unauthored_and_localoffices_root_has_no_public_county_contract`
- Vermont: `official_ahs_district_jurisdiction_codes_are_public_but_no_reviewable_public_ahs_office_crosswalk_or_service_area_contract_exists`
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
