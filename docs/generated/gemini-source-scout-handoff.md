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

`county_local_disability_resources` is the highest-priority Alaska blocker. The official Alaska Department of Health DPA offices and DPA services pages are real, live, and browser-readable, but they still only expose region-level office groupings, statewide Alaska Connect / Virtual Contact Center routing, and office cards for named cities. They do not assign boroughs or census areas to those offices. The raw low-token lane remains closed on the same host family: the exact health-host pages, `robots.txt`, `sitemap.xml`, and bounded site-search probes still return the same Cloudflare 403 shell rather than machine-readable county-equivalent routing.

### Exact Evidence Needed

- Any reviewed official Alaska page, export, API, PDF, or map layer that explicitly assigns one or more boroughs or census areas to a named DPA office or service area.
- Any current public machine-readable office dataset on the Alaska health or DFCS host family that adds borough-served, census-area-served, or county-equivalent routing fields to the current DPA office stack.
- Any official public office-locator contract that ties the existing regional office cards to boroughs or census areas instead of only city office names and statewide contact paths.

### Useful Official URLs Already Tried

- [DPA Offices](https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/)
- [DPA Services](https://health.alaska.gov/en/services/division-of-public-assistance-dpa-services/)
- [DPA landing](https://health.alaska.gov/en/division-of-public-assistance/)
- [health.alaska.gov robots](https://health.alaska.gov/robots.txt)
- [health.alaska.gov sitemap](https://health.alaska.gov/sitemap.xml)
- [health-host site search: public assistance](https://health.alaska.gov/en/search/?q=public+assistance)
- [health-host site search: office](https://health.alaska.gov/en/search/?q=office)
- [DFCS Services](https://dfcs.alaska.gov/Pages/Services.aspx)
- [DFCS Site Map](https://dfcs.alaska.gov/Pages/Site-Map.aspx)
- [DFCS Contacts](https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx)

### Top Remaining Source-Scouting Targets

- Any official Alaska DPA office contract that names boroughs or census areas directly.
- Any official public data export or map service behind the DPA office page that exposes county-equivalent service coverage.
- Any official successor DFCS or health-host publication that binds boroughs or census areas to the current office cards.

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
