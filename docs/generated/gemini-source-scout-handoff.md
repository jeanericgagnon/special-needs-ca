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

## Current Focus State: Alaska

### Blocker Reason

`county_local_disability_resources` is the only remaining Alaska blocker. The current official Alaska Department of Health DPA stack is now dual-lane final. In the reviewed browser lane, the official DPA Offices page and sibling DPA Services page are both public and readable, but they still preserve only broad regional groupings plus statewide contact paths. They do not assign Alaska boroughs or census areas to those offices. In the raw low-token lane, the same health host still fails closed with Cloudflare 403 shells on the exact DPA offices page, DPA landing page, sitemap, robots, and bounded site-search URLs. The DFCS successor host is also still negative: it exposes statewide or wrong-role branches, not borough-assignment routing.

### Exact Evidence Needed

- Any current official Alaska public page, PDF, export, API, or map data that explicitly assigns boroughs or census areas to DPA offices.
- Any reviewed official county-equivalent-to-service-area crosswalk on `health.alaska.gov`, `alaska.gov`, or another current Alaska official host that binds a borough or census area to a named DPA office or routing region.
- Any public official successor surface that preserves county-equivalent service-area text beyond the current region-only office inventory.

### Useful Official URLs Already Tried

- [DPA Offices](https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/)
- [DPA Services](https://health.alaska.gov/en/services/division-of-public-assistance-dpa-services/)
- [DPA landing page](https://health.alaska.gov/en/division-of-public-assistance/)
- [health.alaska.gov sitemap.xml](https://health.alaska.gov/sitemap.xml)
- [health.alaska.gov robots.txt](https://health.alaska.gov/robots.txt)
- [health.alaska.gov search: public assistance](https://health.alaska.gov/en/search/?q=public+assistance)
- [health.alaska.gov search: office](https://health.alaska.gov/en/search/?q=office)
- [DFCS root](https://dfcs.alaska.gov/Pages/default.aspx)
- [DFCS Services](https://dfcs.alaska.gov/Pages/Services.aspx)
- [DFCS Site Map](https://dfcs.alaska.gov/Pages/Site-Map.aspx)
- [DFCS Department Contacts](https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx)
- [DFCS search results guess: public assistance](https://dfcs.alaska.gov/Pages/search-results.aspx?k=public%20assistance)
- [DFCS search results guess: office](https://dfcs.alaska.gov/Pages/search-results.aspx?k=office)
- [DFCS search results guess: medicaid](https://dfcs.alaska.gov/Pages/search-results.aspx?k=medicaid)
- [DFCS search results guess: adult public assistance](https://dfcs.alaska.gov/Pages/search-results.aspx?k=adult%20public%20assistance)

### Top Remaining Source-Scouting Targets

- Any official Alaska surface that names boroughs or census areas under DPA office coverage.
- Any current Alaska export, API, workbook, or map configuration that exposes office identifiers plus borough/census-area bindings instead of region-only groupings.
- Any official successor page or reviewable public document that preserves borough-served or census-area-served text more specific than the current office-city inventory.

## Next State Order After Alaska

1. Maine
2. Idaho
3. Arizona
4. Massachusetts
5. New Mexico
6. South Dakota
7. Rhode Island
8. Virginia
9. West Virginia
10. North Dakota
