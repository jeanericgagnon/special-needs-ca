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

## Current Focus State: Alaska

### Blocker Reason

`county_local_disability_resources` is the only Alaska blocker left. The live official Department of Health DPA offices lane is stronger than a pure host-block assumption: the browser-readable page at `https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/` preserves real regional offices, hours, addresses, fax numbers, and virtual routing options. But that same reviewed page also proves why Alaska is still blocked: the office buckets are regional and cross county-equivalent boundaries, for example `Alaska Peninsula` groups Homer and Kenai, `Northern Alaska` groups Fairbanks and Nome, `Southcentral Alaska` groups Anchorage and Matanuska-Susitna Valley, `Southeast Alaska` groups Juneau, Ketchikan, and Sitka, and `Southwest Alaska` groups Bethel and Kodiak. Those are not borough or census-area assignment contracts. In the raw low-token lane, the same health-host family still fails closed more broadly: the DPA landing page, DPA offices page, `sitemap.xml`, `robots.txt`, and bounded search URLs still return HTTP 403 Cloudflare `Just a moment...` shells, so no replayable raw county-equivalent export exists.

### Exact Evidence Needed

- Any current official Alaska page, export, ArcGIS/API surface, or machine-readable table that explicitly maps each borough or census area to a DPA office, office region, or county-equivalent local-routing assignment.
- Any current official Alaska Department of Health or DFCS locality contract that ties the regional office buckets to boroughs or census areas without inference from city names.
- Any official public office-directory or service-area artifact that converts the reviewed regional DPA structure into county-equivalent coverage.

### Useful Official URLs Already Tried

- [Alaska DPA Offices](https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/)
- [Alaska DPA Services](https://health.alaska.gov/en/services/division-of-public-assistance-dpa-services/)
- [Alaska DFCS root](https://dfcs.alaska.gov/Pages/default.aspx)
- [Alaska DFCS Services](https://dfcs.alaska.gov/Pages/Services.aspx)
- [Alaska DFCS Site Map](https://dfcs.alaska.gov/Pages/Site-Map.aspx)
- [Alaska DFCS Department Contacts](https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx)

### Top Remaining Source-Scouting Targets

- Any official Alaska machine-readable office coverage artifact that names boroughs or census areas directly.
- Any official Alaska search, sitemap, API, or export surface on the health or DFCS host that can be replayed raw instead of browser-only and that preserves county-equivalent assignment text.
- Any reviewed official Alaska leaf that explicitly ties DPA regions or offices to borough/census-area service responsibility rather than just listing office cities.

## Next State Order After Alaska

1. Maine
2. Idaho
3. New Mexico
4. Arizona
5. New Hampshire
