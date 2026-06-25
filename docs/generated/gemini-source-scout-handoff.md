# Gemini Source Scout Handoff

Updated: 2026-06-25

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, Ohio, Oklahoma, Oregon, Pennsylvania, South Carolina, Texas, Utah

## Current Blocked States

- Alaska: `reviewed_live_dpa_offices_and_dpa_services_pages_still_lack_borough_assignment_while_raw_health_page_sitemap_robots_and_search_all_403`
- Arizona: `ahcccs_university_familycare_pdf_bundle_now_proves_non_contract_support_letters_and_live_public_education_surface_recheck_confirms_three_public_domains_still_lack_role_leaves`
- Idaho: `remaining_idaho_district_roots_now_reduce_to_wrong_role_contact_or_title_ix_leaves_without_special_education_or_student_services_routing`
- Maine: `official_dhhs_nav_stack_still_exposes_office_addresses_and_labels_but_no_county_or_service_area_contract`
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

`county_local_disability_resources` is the highest-priority Alaska blocker. The current official Alaska Department of Health pages now prove that DPA offices and services are live in browser-readable review, but they still stop short of the county-equivalent contract needed for California-grade local routing. The exact `Division of Public Assistance (DPA) Offices` page preserves real offices, addresses, hours, fax numbers, and virtual routing by broad regions only. The sibling `Division of Public Assistance (DPA) Services` page confirms Alaska Connect, the Virtual Contact Center, and a generic `Office locations` path, but it only loops back to the same region-level office surface and statewide contact paths. In the raw low-token lane, the same health host still fails closed on the page, sitemap, robots, and bounded site-search URLs with the Cloudflare `Just a moment...` shell. DFCS remains a dead-end successor lane with no borough or census-area assignment contract.

### Exact Evidence Needed

- Any reviewed official Alaska page, export, PDF, or public API that explicitly assigns boroughs or census areas to DPA/public-assistance offices.
- Any official county-equivalent office directory or map layer on `health.alaska.gov`, `dfcs.alaska.gov`, or another current Alaska state host that names boroughs or census areas in the office assignment itself.
- Any official public data endpoint behind the reviewed DPA office experience that turns the current region-only page into a borough/census-area contract.

### Useful Official URLs Already Tried

- [DPA Offices](https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/)
- [DPA Services](https://health.alaska.gov/en/services/division-of-public-assistance-dpa-services/)
- [DPA landing page](https://health.alaska.gov/en/division-of-public-assistance/)
- [health.alaska.gov sitemap](https://health.alaska.gov/sitemap.xml)
- [health.alaska.gov robots](https://health.alaska.gov/robots.txt)
- [health.alaska.gov search for public assistance](https://health.alaska.gov/en/search/?q=public+assistance)
- [DFCS root](https://dfcs.alaska.gov/Pages/default.aspx)
- [DFCS Services](https://dfcs.alaska.gov/Pages/Services.aspx)
- [DFCS Site Map](https://dfcs.alaska.gov/Pages/Site-Map.aspx)
- [DFCS Department Contacts](https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx)

### Top Remaining Source-Scouting Targets

- Any current Alaska state-hosted office map, export, or directory that names boroughs or census areas directly in the DPA assignment contract.
- Any official Alaska geospatial or data endpoint that powers the reviewed DPA office pages and exposes county-equivalent service areas.
- Any reviewed official replacement for the region-only DPA office surface that preserves borough or census-area routing on a public host.

## Next State Order After Alaska

1. South Dakota
2. Maine
3. Idaho
4. Arizona
5. Massachusetts
6. New Mexico
7. Rhode Island
8. Virginia
9. West Virginia
10. North Dakota
