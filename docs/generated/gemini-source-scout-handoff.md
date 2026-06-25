# Gemini Source Scout Handoff

Updated: 2026-06-25

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, Ohio, Oklahoma, Oregon, Pennsylvania, South Carolina, Texas, Utah

## Current Blocked States

- Alaska: `reviewed_live_dpa_regions_cross_multiple_borough_or_census_area_boundaries_and_raw_health_page_sitemap_robots_search_all_403`
- Arizona: `ahcccs_university_familycare_pdf_bundle_now_proves_non_contract_support_letters_and_live_public_education_surface_recheck_confirms_three_public_domains_still_lack_role_leaves`
- Idaho: `remaining_idaho_district_roots_and_live_sitemaps_still_materialize_only_contact_title_ix_or_generic_leaves_without_special_education_routing`
- Maine: `official_dhhs_office_cross_program_referrals_and_public_county_workbooks_still_expose_no_county_to_office_or_service_area_contract`
- Massachusetts: `official_dese_export_plus_census_county_subdivision_crosswalk_clears_education_and_reviewed_dds_locality_capture_covers_13_of_14_counties_but_suffolk_remains_unresolved`
- New Hampshire: `official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable_with_no_live_nh_gov_successor_root`
- New Mexico: `official_webed_directory_workbooks_are_live_single_sheet_exports_with_no_county_field_or_rec_service_area_contract_and_official_dvr_root_still_returns_401_without_reviewed_public_alternate`
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

`district_or_county_education_routing` is the highest-priority New Mexico blocker. The official PED-managed directory host is now live, and its public workbook downloads were rechecked directly. `NM Schools.xlsx`, `Superintendents.xlsx`, and `REC Directors.xlsx` all return HTTP 200 from `webed.ped.state.nm.us`, but a bounded workbook-structure inspection confirmed each one is a single-sheet export with district, superintendent, or REC contact data only. None of the three preserves a county field, and the REC workbook preserves no county-service-area labels. The dead legacy `education.new-mexico.gov` host still cannot substitute, and the current `webnew.ped.state.nm.us/bureaus/special-education/` page still remains statewide-only. New Mexico therefore remains blocked on an official county-to-district or county-to-REC crosswalk, not on absence of a public PED directory.

### Exact Evidence Needed

- Any official New Mexico county-to-district or county-to-REC crosswalk published from the PED-managed directory host family.
- Any official REC service-area document or page that explicitly names the counties served by each REC.
- Any official PED-managed workbook, export, or directory leaf that adds a county field or county-labeled local routing contract to the current district or REC inventory.

### Useful Official URLs Already Tried

- [New Mexico Public Schools Directory home](https://webed.ped.state.nm.us/sites/schooldirectory/SitePages/Home.aspx)
- [NM Schools workbook](https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/NM%20Schools.xlsx)
- [Superintendents workbook](https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/Superintendents.xlsx)
- [REC Directors workbook](https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/REC%20Directors.xlsx)
- [PED Special Education Bureau](https://webnew.ped.state.nm.us/bureaus/special-education/)

### Top Remaining Source-Scouting Targets

- Any official county-bearing crosswalk exported from the live PED-managed directory host.
- Any county-labeled REC service-area contract on PED-managed or REC first-party official hosts.
- Any reviewed PED or REC source that goes beyond district or REC contact inventory and explicitly binds counties to local education-routing entities.

## Next State Order After New Mexico

1. Arizona
2. New Hampshire
