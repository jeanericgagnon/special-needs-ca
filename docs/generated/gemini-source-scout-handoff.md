# Gemini Source Scout Handoff

Updated: 2026-06-25

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, Ohio, Oklahoma, Oregon, Pennsylvania, South Carolina, Texas, Utah

## Current Blocked States

- Alaska: `reviewed_live_dpa_regions_cross_multiple_borough_or_census_area_boundaries_and_raw_health_page_sitemap_robots_search_all_403`
- Arizona: `ahcccs_university_familycare_pdf_bundle_now_proves_non_contract_support_letters_and_live_public_education_surface_recheck_confirms_three_public_domains_still_lack_role_leaves`
- Idaho: `remaining_idaho_district_roots_and_live_sitemaps_still_materialize_only_wrong_role_or_generic_leaves_without_special_education_routing`
- Maine: `official_dhhs_office_pages_and_public_county_workbooks_exist_but_still_expose_no_county_to_office_or_service_area_contract`
- Massachusetts: `official_dese_export_plus_census_county_subdivision_crosswalk_clears_education_and_reviewed_dds_locality_capture_covers_13_of_14_counties_but_suffolk_remains_unresolved`
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

## Current Focus State: Alaska

### Blocker Reason

`county_local_disability_resources` is the highest-priority Alaska blocker. The reviewed official Department of Health DPA offices page is live, but the page’s own region buckets prove it is not a county-equivalent contract: `Alaska Peninsula` groups Homer and Kenai, `Northern Alaska` groups Fairbanks and Nome, `Southcentral Alaska` groups Anchorage and Matanuska-Susitna Valley, `Southeast Alaska` groups Juneau, Ketchikan, and Sitka, and `Southwest Alaska` groups Bethel and Kodiak. Those region buckets cross or mismatch multiple borough and census-area boundaries, so the office cities cannot be safely projected into county-equivalent routing. The raw low-token lane for the same health host still returns Cloudflare 403 shells on the exact page, sitemap, robots, and bounded site-search URLs, and the DFCS successor host still exposes no borough- or census-area assignment surface.

### Exact Evidence Needed

- Any official Alaska DPA borough- or census-area-to-office assignment table, export, API, or page on the health host.
- Any public official surface that explicitly maps Alaska boroughs or census areas to DPA offices rather than broad regions or office cities.
- Any reviewed successor DFCS or related official page that preserves borough or census-area service assignments for public-assistance offices.

### Useful Official URLs Already Tried

- [Alaska DPA offices page](https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/)
- [Alaska DPA services page](https://health.alaska.gov/en/services/division-of-public-assistance-dpa-services/)
- [Alaska DPA landing page](https://health.alaska.gov/en/division-of-public-assistance/)
- [Alaska DFCS root](https://dfcs.alaska.gov/Pages/default.aspx)
- [Alaska DFCS services page](https://dfcs.alaska.gov/Pages/Services.aspx)
- [Alaska DFCS site map](https://dfcs.alaska.gov/Pages/Site-Map.aspx)
- [Alaska DFCS contacts page](https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx)

### Top Remaining Source-Scouting Targets

- Any public official borough/census-area assignment contract on the current health.alaska.gov DPA host.
- Any official export or API behind the live DPA office page that names boroughs or census areas directly.
- Any successor DFCS public-assistance lane that goes beyond statewide phone routing and explicitly maps county-equivalent areas to DPA offices.

## Next State Order After New Mexico

1. Maine
2. Idaho
3. New Mexico
4. Arizona
5. New Hampshire
