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
- New Mexico: `official_webed_directory_rest_list_and_rec_home_are_live_but_expose_no_county_field_or_rec_service_area_contract_and_official_dvr_root_still_returns_401_without_reviewed_public_alternate`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
- Rhode Island: `generic_or_statewide_evidence_used_where_local_required`
- South Dakota: `live_sd_educational_directory_exists_but_local_district_leaves_are_unauthored_and_localoffices_root_has_no_public_county_contract`
- Vermont: `generic_or_statewide_evidence_used_where_local_required`
- Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Washington: `generic_or_statewide_evidence_used_where_local_required`
- West Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Wisconsin: `generic_or_statewide_evidence_used_where_local_required`
- Wyoming: `legacy_or_inventory_only_evidence`

## Current Focus State: New Mexico

### Blocker Reason

New Mexico still has two blockers, but `district_or_county_education_routing` remains the top one because it is the only critical family still failing. The live official PED SharePoint directory lane is stronger than the older dead-host picture: `https://webed.ped.state.nm.us/sites/schooldirectory/SitePages/Home.aspx` is public, its visible `NM Schools` page is backed by a public SharePoint REST list with `ItemCount: 935` plus live `items` and `RenderListDataAsStream` responses, and the public `RECHome.aspx` page is also live. But that stronger official lane still does not clear county-grade routing: the live school-list schema exposes district/location columns with no county field, the public workbooks still have no county or REC service-area field, and the REC page only groups districts under REC headings instead of naming counties.

### Exact Evidence Needed

- Any current official PED county-to-district crosswalk, county-labeled school-directory export, or public county field on the live SharePoint list/API lane.
- Any current official REC service-area contract that explicitly maps counties to REC numbers or REC offices.
- Any current official PED or REC artifact that binds counties to local education-routing responsibility without requiring inference from district names or city names.

### Useful Official URLs Already Tried

- [New Mexico Public Schools Directory home](https://webed.ped.state.nm.us/sites/schooldirectory/SitePages/Home.aspx)
- [Visible 2017 NM Schools list](https://webed.ped.state.nm.us/sites/schooldirectory/Lists/2017%20NM%20Schools/AllItems.aspx)
- [2017 NM Schools public REST render lane](https://webed.ped.state.nm.us/sites/schooldirectory/_api/web/lists(guid'ed760a23-c290-4b26-8fec-4f94210cf7c3')/RenderListDataAsStream)
- [NM Schools workbook](https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/NM%20Schools.xlsx)
- [Superintendents workbook](https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/Superintendents.xlsx)
- [REC Directors workbook](https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/REC%20Directors.xlsx)
- [REC home page](https://webed.ped.state.nm.us/sites/schooldirectory/SitePages/RECHome.aspx)
- [PED Special Education Bureau](https://webnew.ped.state.nm.us/bureaus/special-education/)
- [New Mexico DVR root](https://www.dvr.nm.gov/)

### Top Remaining Source-Scouting Targets

- Any newly exposed county-bearing field on the live PED SharePoint school list or workbook exports.
- Any official PED or REC page that explicitly maps counties to REC numbers, REC offices, or district-routing responsibility.
- Any reviewed alternate official VR / Pre-ETS root if the DVR 401 lane is later revisited after education.

## Next State Order After New Mexico

1. Arizona
2. New Hampshire
