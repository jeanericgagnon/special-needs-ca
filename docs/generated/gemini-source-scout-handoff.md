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
- New Mexico: `official_webed_school_directory_and_rec_workbooks_live_but_no_county_crosswalk_or_county_labeled_local_education_contract_and_official_dvr_root_still_returns_401_without_reviewed_public_alternate`
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

## Current Focus State: New Mexico

### Blocker Reason

`district_or_county_education_routing` is the highest-priority New Mexico blocker. The older blocker wording was too pessimistic: there is now a live official PED-managed public school-directory lane at `https://webed.ped.state.nm.us/sites/schooldirectory/SitePages/Home.aspx`, and the public downloads `NM Schools.xlsx`, `Superintendents.xlsx`, and `REC Directors.xlsx` all return HTTP 200 on the same host. Those official workbooks prove district names/codes, superintendent contacts, and REC director contacts. But they still do not preserve a county field or county-service-area labels, so they cannot yet clear county-grade education routing across all 33 counties. The legacy `education.new-mexico.gov` host family remains dead, and the current `webnew.ped.state.nm.us/bureaus/special-education/` page is still statewide-only rather than a county-grade local-routing contract.

### Exact Evidence Needed

- Any official county-to-district or county-to-REC crosswalk from the live PED-managed directory stack.
- Any county-labeled local-routing contract on the live `webed.ped.state.nm.us` directory host, its downloadable workbooks, or a sibling official REC page.
- Any reviewed district-owned or regional local-routing page that can be tied back to counties without inventing mappings.

### Useful Official URLs Already Tried

- [PED public school directory home](https://webed.ped.state.nm.us/sites/schooldirectory/SitePages/Home.aspx)
- [PED NM Schools list](https://webed.ped.state.nm.us/sites/schooldirectory/Lists/2017%20NM%20Schools/AllItems.aspx)
- [PED Superintendents list](https://webed.ped.state.nm.us/sites/schooldirectory/Lists/Superintendents/AllItems.aspx)
- [PED REC Directors page](https://webed.ped.state.nm.us/sites/schooldirectory/SitePages/RECHome.aspx)
- [PED NM Schools workbook](https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/NM%20Schools.xlsx)
- [PED Superintendents workbook](https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/Superintendents.xlsx)
- [PED REC Directors workbook](https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/REC%20Directors.xlsx)
- [Legacy education host root](https://education.new-mexico.gov/)
- [Current PED Special Education Bureau](https://webnew.ped.state.nm.us/bureaus/special-education/)

### Top Remaining Source-Scouting Targets

- Any official county field hiding in the PED directory stack, workbook metadata, or a sibling public export.
- Any official REC coverage page that explicitly labels counties served by REC number or REC director.
- Any official district-locator or county-labeled routing page on a district-owned or regional official host that can satisfy county-grade local education routing without generic statewide fallback.

## Next State Order After New Mexico

1. Massachusetts
2. South Dakota
3. Rhode Island
4. Virginia
5. West Virginia
6. North Dakota
7. Wisconsin
8. Washington
9. Tennessee
10. Vermont
