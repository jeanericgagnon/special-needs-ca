# Gemini Source Scout Handoff

Updated: 2026-06-25

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, Ohio, Oklahoma, Oregon, Pennsylvania, South Carolina, Tennessee, Texas, Utah, Virginia, West Virginia

## Current Blocked States

- Alaska: `reviewed_live_dpa_offices_page_still_only_groups_regions_while_raw_health_host_403_persists_and_dfcs_adds_no_borough_or_census_area_contract`
- Arizona: `ahcccs_university_familycare_pdf_bundle_now_proves_non_contract_support_letters_and_live_public_education_surface_recheck_confirms_three_public_domains_still_lack_role_leaves`
- Idaho: `remaining_idaho_district_roots_now_reduce_to_camas_clark_and_shoshone_wrong_role_leaves_without_special_education_or_student_services_routing`
- Maine: `official_dhhs_nav_stack_still_exposes_office_addresses_and_labels_but_no_county_or_service_area_contract`
- Massachusetts: `official_dese_export_plus_census_county_subdivision_crosswalk_clears_education_and_reviewed_dds_locality_capture_covers_13_of_14_counties_but_suffolk_remains_unresolved`
- New Hampshire: `official_nh_dhhs_education_and_vr_host_families_still_return_access_denied_shell_and_saved_dhhs_replacement_hosts_remain_dns_dead`
- New Mexico: `official_webed_sharepoint_lists_and_six_public_workbooks_are_live_but_still_expose_no_county_field_or_rec_service_area_contract_and_official_dvr_root_still_returns_401_without_reviewed_public_alternate`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
- Rhode Island: `generic_or_statewide_evidence_used_where_local_required`
- South Dakota: `live_sd_educational_directory_exists_but_local_district_leaves_are_unauthored_and_localoffices_root_has_no_public_county_contract`
- Vermont: `official_ahs_district_jurisdiction_codes_are_public_but_no_reviewable_public_ahs_office_crosswalk_or_service_area_contract_exists`
- Washington: `official_dshs_local_offices_are_public_but_reviewed_pages_do_not_preserve_a_county_to_office_or_service_area_contract`
- Wisconsin: `generic_or_statewide_evidence_used_where_local_required`
- Wyoming: `legacy_or_inventory_only_evidence`

## Current Focus State: New Mexico

### Blocker Reason

`district_or_county_education_routing` is still the highest-priority New Mexico blocker, but the official failure mode is now more exhaustive than the earlier packet. The live PED-managed SharePoint host preserves the public `2017 NM Schools` list with REST-backed rows, the public `RECHome.aspx` grouping page, and six public workbook exports: `NM Schools.xlsx`, `Superintendents.xlsx`, `REC Directors.xlsx`, `Elementary School Principals.xlsx`, `Middle School Principals.xlsx`, and `High School Principals.xlsx`. That broader official stack proves the state has a public directory lane, but every reviewed list and workbook still omits county or REC service-area fields. `NM Schools.xlsx` and the REST list preserve district/location columns only. `Superintendents.xlsx` preserves district contacts only. `REC Directors.xlsx` preserves REC contact rows only. The principal workbooks preserve school and contact columns only. `RECHome.aspx` still groups districts under REC headings without county labels or REC service-area text. New Mexico remains BLOCKED because the public official PED stack still lacks a truthful county-to-district or county-to-REC crosswalk.

### Exact Evidence Needed

- Any official PED-managed county-to-district crosswalk, county column, county selector, or county-keyed export on the live WebED host.
- Any official PED-managed REC service-area artifact that explicitly labels counties served by each REC.
- Any official district-owned or REC-owned local special-education routing leaf that proves county-grade coverage without inference.

### Useful Official URLs Already Tried

- [PED SharePoint school directory home](https://webed.ped.state.nm.us/sites/schooldirectory/SitePages/Home.aspx)
- [2017 NM Schools list](https://webed.ped.state.nm.us/sites/schooldirectory/Lists/2017%20NM%20Schools/AllItems.aspx)
- [NM Schools workbook](https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/NM%20Schools.xlsx)
- [Superintendents workbook](https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/Superintendents.xlsx)
- [REC Directors workbook](https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/REC%20Directors.xlsx)
- [Elementary School Principals workbook](https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/Elementary%20School%20Principals.xlsx)
- [Middle School Principals workbook](https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/Middle%20School%20Principals.xlsx)
- [High School Principals workbook](https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/High%20School%20Principals.xlsx)
- [REC home page](https://webed.ped.state.nm.us/sites/schooldirectory/SitePages/RECHome.aspx)
- [Special Education Bureau page](https://webnew.ped.state.nm.us/bureaus/special-education/)

### Top Remaining Source-Scouting Targets

- Any live WebED list, workbook, or site page with an explicit county column or county-keyed filter.
- Any official REC service-area contract with county labels on the PED-managed host or REC-owned official hosts.
- Any official district-owned local special-education or student-services leaf that can clear counties without relying on statewide PED exports.

## Next State Order After New Mexico

1. Arizona
2. New Hampshire
