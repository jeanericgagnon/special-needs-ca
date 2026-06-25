# Gemini Source Scout Handoff

Updated: 2026-06-25

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, Nevada, New Jersey, New York, North Carolina, Oregon, Pennsylvania, South Carolina, Texas, Utah

## Current Blocked States

- Alaska: `reviewed_live_dpa_offices_page_now_public_but_only_groups_regional_offices_without_borough_or_census_area_assignment_while_dfcs_surfaces_add_no_local_mapping_contract`
- Arizona: `azed_host_challenged_and_ahcccs_county_mapping_requires_reviewed_admin_html_leaves_or_explicit_ocr_artifact`
- Florida: `official_local_offices_leaf_routes_to_partial_family_resource_center_and_current_myaccess_bundle_reexposes_exact_county_endpoints_but_they_remain_authenticated_only`
- Idaho: `reviewed_idaho_district_leaves_hold_at_12_counties_and_remaining_county_bearing_district_roots_now_have_public_sitemap_exhaustion_evidence`
- Kansas: `current_ksde_directory_roots_and_pdf_url_return_request_rejected_shells_and_exact_submit_replay_is_rejected_while_reviewed_local_district_leaves_cover_only_30_counties`
- Maine: `official_maine_selector_and_workbook_are_live_but_current_search_export_posts_still_return_same_500_shell_plus_dhhs_office_html_has_no_county_contract`
- Massachusetts: `exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export`
- Minnesota: `live_mdeorg_root_and_district_page_but_county_contact_and_analytics_routes_are_radware_blocked_plus_mn_dhs_saved_county_tribal_replacements_are_official_404s`
- Nebraska: `official_nebraska_dhhs_site_has_no_public_sitemap_or_search_recovery_and_portal_search_still_returns_only_the_same_web_map_feature_service_and_map_service_without_any_county_assignment_item_or_directory_leaf`
- New Hampshire: `official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable_with_no_live_nh_gov_successor_root`
- New Mexico: `district_leafs_missing_and_county_local_four_county_remainder_persists_after_empty_archive_tail`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
- Ohio: `live_ohio_jfs_medicaid_and_ohio_gov_roots_plus_robots_and_sitemaps_recover_but_current_directory_search_and_sample_cdjfs_leafs_render_404_while_education_inventory_remains_root_only`
- Oklahoma: `live_okdhs_public_county_widget_only_publishes_adair_and_alfalfa_while_kml_still_yields_only_45_benefit_capable_counties_and_no_contract_for_remaining_32`
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

`county_local_disability_resources` is the only remaining Nebraska critical blocker. The official publication layer now fails closed just as clearly as the ArcGIS layer: `https://dhhs.ne.gov/robots.txt` is live, but `https://dhhs.ne.gov/sitemap.xml` returns 404, the live SharePoint wrapper still loops `Public Assistance Offices` back to the same locator stack, and bounded DHHS SharePoint search API queries do not produce a searchable county office leaf. The official public GIS portal search still returns only the same office-locator trilogy, namely one web map item, one feature service, and one map service, all with the same Nebraska DHHS office-location title and no county-assignment table, county directory leaf, or alternate routing artifact. Nebraska therefore remains BLOCKED and not index-safe because there is still no public statewide county-to-office assignment bridge anywhere on the current official stack.

### Exact Evidence Needed

- Any official Nebraska DHHS county-to-office assignment table, export, or service-area artifact that maps all 93 counties to public assistance offices.
- Any public ArcGIS table, related layer, popup expression, output schema, or config datasource on the current office stack that explicitly enumerates served counties, assigned counties, or coverage areas for each office.
- Any exact first-party DHHS county office page or county directory leaf that publishes county coverage instead of only contact-card inventory or a loop back to the current wrapper page.
- Any searchable first-party DHHS sitemap or search publication surface that actually materializes county office leaves rather than only the current wrapper and portal stack.

### Useful Official URLs Already Tried

- [Nebraska DHHS robots.txt](https://dhhs.ne.gov/robots.txt)
- [Nebraska DHHS sitemap.xml](https://dhhs.ne.gov/sitemap.xml)
- [Nebraska DHHS Public Assistance Offices](https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx)
- [Nebraska DHHS Economic Assistance](https://dhhs.ne.gov/Pages/economic-assistance.aspx)
- [Nebraska DHHS Contact DHHS](https://dhhs.ne.gov/Pages/Contact-DHHS.aspx)
- [Official GIS portal search: Public Assistance Offices](https://gis.ne.gov/portal/sharing/rest/search?q=title%3A%22Public%20Assistance%20Offices%22&f=json)
- [Official GIS portal search: Public Assistance Office Location Lookup](https://gis.ne.gov/portal/sharing/rest/search?q=Public%20Assistance%20Office%20Location%20Lookup&f=json)
- [ExperienceBuilder item data](https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json)
- [ExperienceBuilder resource list](https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/resources?f=json)
- [ExperienceBuilder config resource](https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/resources/config/config.json?f=json)
- [Nebraska public web map item data](https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825/data?f=json)
- [Nebraska public office FeatureServer root](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer?f=pjson)

### Top Remaining Source-Scouting Targets

- Any official Nebraska DHHS county assignment export or service-area table attached to the existing office stack.
- Any new public ArcGIS resource, web map table, config datasource, or output field that explicitly carries county assignment data rather than only office contact fields.
- An exact first-party county office page or county directory leaf on `dhhs.ne.gov` that publishes county coverage instead of only wrapper-page loops or wrong-role local health department links.
## Next State Order After Nebraska

1. Nevada
2. Florida
3. Alaska
4. South Carolina
5. North Carolina
6. New York
7. Oklahoma
8. Oregon
9. Ohio
10. Minnesota