# Gemini Source Scout Handoff

Updated: 2026-06-24

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, Nevada, New Jersey, New York, North Carolina, Oregon, Pennsylvania, South Carolina, Texas, Utah

## Current Blocked States

- Alaska: `reviewed_live_dpa_offices_page_now_public_but_only_groups_regional_offices_without_borough_or_census_area_assignment_while_dfcs_surfaces_add_no_local_mapping_contract`
- Arizona: `azed_host_challenged_and_ahcccs_county_mapping_requires_reviewed_admin_html_leaves_or_explicit_ocr_artifact`
- Florida: `official_local_offices_leaf_routes_to_partial_family_resource_center_and_current_myaccess_bundle_reexposes_exact_county_endpoints_but_they_remain_authenticated_only`
- Idaho: `reviewed_idaho_district_leaves_hold_at_12_counties_and_remaining_county_bearing_district_roots_now_have_public_sitemap_exhaustion_evidence`
- Maine: `official_maine_selector_and_workbook_are_live_but_current_search_export_posts_still_return_same_500_shell_plus_dhhs_office_html_has_no_county_contract`
- Massachusetts: `exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export`
- Minnesota: `live_mdeorg_root_and_district_page_but_county_contact_and_analytics_routes_are_radware_blocked_plus_mn_dhs_saved_county_tribal_replacements_are_official_404s`
- Nebraska: `official_nebraska_dhhs_site_has_no_public_sitemap_or_search_recovery_and_portal_search_still_returns_only_the_same_web_map_feature_service_and_map_service_without_any_county_assignment_item_or_directory_leaf`
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

## Current Focus State: Nebraska

### Blocker Reason

Nebraska still has one critical blocker: `county_local_disability_resources`. Reviewed 2026-06-24 one more bounded official Nebraska county-local pass across both the DHHS publication layer and the ArcGIS publication stack. `https://dhhs.ne.gov/robots.txt` is live, but `https://dhhs.ne.gov/sitemap.xml` returns HTTP 404, so there is still no first-party sitemap publication index for office leaves. The live SharePoint HTML for `https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx`, `https://dhhs.ne.gov/Pages/Contact-DHHS.aspx`, and `https://dhhs.ne.gov/Pages/economic-assistance.aspx` still loops users only to the same office wrapper and sibling economic-assistance pages, while bounded SharePoint search API queries such as `_api/search/query?querytext='Public Assistance Offices'` return only HTTP 500/400 errors rather than any searchable county office leaves. On the ArcGIS side, `https://gis.ne.gov/portal/sharing/rest/search?q=title%3A%22Public%20Assistance%20Offices%22&f=json` still returns only three public items with the same office-location title and owner family: the web map item `4bdbf8e8703743b0b2ff290f98737825`, the feature service item `cf70cb74fcc94634afc89f0a22a7d06f`, and the map service item `90a19933cfc444be836f51d15e2e23ec`. No table item, CSV, county assignment app item, or county directory leaf appears anywhere in either official publication lane. Nebraska therefore still has no public county-assignment item anywhere on the current official stack.

### Exact Evidence Needed

- An official DHHS service-area table, county-assignment artifact, or new public county leaf that actually maps Nebraska counties to local assistance routing.
- A new searchable DHHS publication index or sitemap-backed office inventory that materializes county-specific public-assistance office leaves on the current official stack.
- A new official ArcGIS table, CSV, or item that adds county assignment instead of only repeating the current office-location web map, feature service, and map service.

### Useful Official URLs Already Tried

- [Nebraska DHHS robots.txt](https://dhhs.ne.gov/robots.txt)
- [Nebraska DHHS sitemap.xml](https://dhhs.ne.gov/sitemap.xml)
- [Nebraska Public Assistance Offices](https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx)
- [Nebraska Contact DHHS](https://dhhs.ne.gov/Pages/Contact-DHHS.aspx)
- [Nebraska Economic Assistance](https://dhhs.ne.gov/Pages/economic-assistance.aspx)
- [Nebraska GIS portal search for Public Assistance Offices](https://gis.ne.gov/portal/sharing/rest/search?q=title%3A%22Public%20Assistance%20Offices%22&f=json)

### Top Remaining Source-Scouting Targets

- Any official Nebraska DHHS county-assignment table or downloadable office/service-area artifact published on the current dhhs.ne.gov stack.
- Any new searchable DHHS publication index, sitemap publication root, or county-named public-assistance office leaves on the live SharePoint host.
- Any official ArcGIS item linked from the Nebraska public portal that adds county assignment rather than repeating the current web map / feature service / map service trio.

## Next State Order After Nebraska

1. Florida
2. Alaska
3. Oklahoma
4. Ohio
5. Minnesota
6. Maine
7. Idaho
8. Arizona
9. Massachusetts
10. New Mexico

Current Nebraska next action: hold_blocked_until_official_service_area_table_county_assignment_artifact_new_public_county_leaf_or_searchable_dhhs_publication_index_is_published.

