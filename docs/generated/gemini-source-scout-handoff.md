# Gemini Source Scout Handoff

Updated: 2026-06-25

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, Oregon, Pennsylvania, South Carolina, Texas, Utah

## Current Blocked States

- Alaska: `reviewed_live_dpa_offices_page_now_public_but_only_groups_regional_offices_without_borough_or_census_area_assignment_while_dfcs_surfaces_add_no_local_mapping_contract`
- Arizona: `azed_host_challenged_and_ahcccs_county_mapping_requires_reviewed_admin_html_leaves_or_explicit_ocr_artifact`
- Florida: `official_local_offices_leaf_routes_to_partial_family_resource_center_and_current_myaccess_bundle_reexposes_exact_county_endpoints_but_they_remain_authenticated_only`
- Idaho: `reviewed_idaho_district_leaves_hold_at_12_counties_and_remaining_county_bearing_district_roots_now_have_public_sitemap_exhaustion_evidence`
- Maine: `official_maine_selector_and_workbook_are_live_but_current_search_export_posts_still_return_same_500_shell_plus_dhhs_office_html_has_no_county_contract`
- Massachusetts: `exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export`
- Minnesota: `live_mdeorg_root_and_district_page_but_county_contact_and_analytics_routes_are_radware_blocked_plus_mn_dhs_saved_county_tribal_replacements_are_official_404s`
- New Hampshire: `official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable_with_no_live_nh_gov_successor_root`
- New Mexico: `district_leafs_missing_and_county_local_four_county_remainder_persists_after_empty_archive_tail`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
- Ohio: `live_ohio_county_jfs_directory_now_verifies_88_counties_while_education_inventory_remains_root_only`
- Oklahoma: `live_okdhs_public_county_widget_salvages_alfalfa_but_still_only_publishes_two_rows_while_combined_official_county_local_coverage_stops_at_46_and_leaves_31`
- Rhode Island: `generic_or_statewide_evidence_used_where_local_required`
- South Dakota: `live_sd_educational_directory_exists_but_local_district_leaves_are_unauthored_and_localoffices_root_has_no_public_county_contract`
- Tennessee: `generic_or_statewide_evidence_used_where_local_required`
- Vermont: `generic_or_statewide_evidence_used_where_local_required`
- Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Washington: `generic_or_statewide_evidence_used_where_local_required`
- West Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Wisconsin: `generic_or_statewide_evidence_used_where_local_required`
- Wyoming: `legacy_or_inventory_only_evidence`

## Current Focus State: Oklahoma

### Blocker Reason

`county_local_disability_resources` remains the top Oklahoma blocker. The live OKDHS county widget is official but still only publishes county entries for Adair and Alfalfa. The Alfalfa row is good enough to salvage one county because it preserves a local office contract, but the Adair row still only provides a service note plus statewide phone routing. The broader public KML plus the salvaged Alfalfa row still stop at 46 benefit-capable counties, and the same host only proves a county-complete tree for child-support offices, not the missing disability/local-routing remainder.

### Exact Evidence Needed

- Any current official Oklahoma county-local office directory or export that closes the 31-county remainder on the OKDHS host.
- Any official county-owned or state-owned successor leaves that explicitly map the unresolved counties to public assistance or disability-routing offices.
- Any public API, CSV, JSON, ArcGIS, or HTML contract on the official host that exposes the missing county assignments directly.

### Useful Official URLs Already Tried

- [Oklahoma Human Services Contact Us](https://oklahoma.gov/okdhs/contact-us.html)
- [Oklahoma Human Services county widget leaf](https://oklahoma.gov/okdhs/contact-us/dhsofficelocations.html)
- [Oklahoma Human Services map2 page](https://oklahoma.gov/okdhs/contact-us/map2.html)
- [Oklahoma Human Services mapconfig2 model](https://oklahoma.gov/okdhs/contact-us/map2/mapconfig2.model.json)
- [Oklahoma Human Services public widget feed](https://oklahoma.gov/content/sok-wcm/en/okdhs/contact-us/map2/jcr:content/root/container/container/election_list.electionConfigPageData.json)
- [Oklahoma Human Services public office-map KML](https://www.google.com/maps/d/kml?mid=1w_a87-58BajiMsz61WcDuiR8LaT6FPw&forcekml=1)
- [Oklahoma Child Support offices tree](https://oklahoma.gov/okdhs/services/child-support-services/officelocations.html)
- [Oklahoma DDS area-contact page](https://oklahoma.gov/okdhs/services/dds/areacontactinfo.html)

### Top Remaining Source-Scouting Targets

- Any exact official OKDHS county-office export or county-filter contract that covers the unresolved counties.
- Any official county-level benefit or disability-routing leaf linked from the same host but not yet packeted.
- The current measured county remainder is: Adair, Beaver, Blaine, Cimarron, Coal, Dewey, Ellis, Grant, Greer, Harmon, Harper, Haskell, Hughes, Jefferson, Kingfisher, Kiowa, Logan, Major, Marshall, McClain, McIntosh, Murray, Noble, Nowata, Okfuskee, Pawnee, Roger Mills, Seminole, Tillman, Washita, Woods.

## Next State Order After Oklahoma

1. Ohio
2. Minnesota
3. Maine
4. Idaho
5. Arizona
6. Massachusetts
7. New Mexico
8. South Dakota
9. Rhode Island
10. Virginia
