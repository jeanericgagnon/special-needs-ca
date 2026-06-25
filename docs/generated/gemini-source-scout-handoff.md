# Gemini Source Scout Handoff

Updated: 2026-06-24

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, Nevada, New Jersey, New York, North Carolina, Oregon, Pennsylvania, South Carolina, Texas, Utah

## Current Blocked States

- Alaska: `live_dfcs_services_publications_search_and_site_map_still_expose_no_dpa_or_borough_mapping_and_only_surface_wrong_role_ocs_offices_while_legacy_dhss_dpa_paths_now_canonicalize_into_same_challenged_health_host`
- Arizona: `three_public_district_domains_official_api_and_exact_slug_sweeps_still_lack_role_leafs_and_altcs_office_cards_still_lack_county_assignments`
- Florida: `official_local_offices_leaf_routes_to_partial_family_resource_center_and_current_myaccess_bundle_reexposes_exact_county_endpoints_but_they_remain_authenticated_only`
- Idaho: `reviewed_idaho_district_leaves_hold_at_12_counties_and_remaining_county_bearing_district_roots_now_have_public_sitemap_exhaustion_evidence`
- Kansas: `current_ksde_directory_roots_and_pdf_url_return_request_rejected_shells_and_exact_submit_replay_is_rejected_while_reviewed_local_district_leaves_cover_only_27_counties`
- Maine: `official_maine_selector_and_workbook_are_live_but_current_search_export_posts_still_return_same_500_shell_plus_dhhs_office_html_has_no_county_contract`
- Massachusetts: `exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export`
- Minnesota: `live_mdeorg_root_and_district_page_but_county_contact_and_analytics_routes_are_radware_blocked_plus_mn_dhs_saved_county_tribal_replacements_are_official_404s`
- Nebraska: `public_nebraska_office_config_still_only_references_one_web_map_a_closest_feature_output_and_a_geocoder_county_result_but_no_official_county_assignment_datasource`
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

`county_local_disability_resources` is the only remaining Nebraska critical blocker. Nebraska already has verified statewide DD, Medicaid, waiver, Early Development Network, special-education dispute, county-grade NDE education-directory, VR, P&A, PTI, legal-aid, ABLE, and SSI coverage. The remaining county-local family stays blocked because the live Nebraska DHHS `Public Assistance Offices` page is still only a SharePoint wrapper around the locator, while the public ArcGIS ExperienceBuilder item data proves the only configured datasources are the base web map, a `closest feature` office output, and a geocoder-result output with a `County` field. That `County` field belongs only to the user-location geocode result, not to an official county-to-office assignment datasource. The public web map still has only 42 office rows, 93 county rows, zero tables, empty relationships, and only 37 distinct office-county values on the office layer. Nebraska remains BLOCKED because there is still no public same-host county assignment table, service-area output, or county directory leaf that proves statewide county-to-office mapping.

### Exact Evidence Needed

- A new official Nebraska DHHS county-to-office assignment table, downloadable county directory, or same-host service-area artifact that explicitly maps counties to local DHHS assistance offices.
- A newly published public ArcGIS datasource or attachment on the existing Nebraska locator item that exposes office service areas or county assignments instead of only closest-office and geocoder outputs.
- An official Nebraska county office directory leaf on `dhhs.ne.gov` or `gis.ne.gov` that preserves county-bearing office assignments on disk.

### Useful Official URLs Already Tried

- [Nebraska DHHS Public Assistance Offices wrapper](https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx)
- [Nebraska DHHS Economic Assistance](https://dhhs.ne.gov/Pages/economic-assistance.aspx)
- [Nebraska DHHS Contact DHHS](https://dhhs.ne.gov/Pages/Contact-DHHS.aspx)
- [Nebraska DHHS DD Contact Us](https://dhhs.ne.gov/Pages/DD-Contact-Us.aspx)
- [Nebraska public office locator ExperienceBuilder](https://gis.ne.gov/portal/apps/experiencebuilder/experience/?id=76a6ec0ec7c449448c95d00f59002457)
- [Nebraska locator public config](https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/resources/config/config.json?f=json)
- [Nebraska locator item data](https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json)
- [Nebraska locator web map item data](https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825/data?f=json)
- [Nebraska office layer count query](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&returnCountOnly=true&f=json)
- [Nebraska county layer count query](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/1/query?where=1%3D1&returnCountOnly=true&f=json)
- [Nebraska distinct office-county query](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&outFields=USER_County&returnDistinctValues=true&returnGeometry=false&f=json)

### Top Remaining Source-Scouting Targets

- Any newly published Nebraska DHHS county office CSV, PDF, workbook, or county-assignment table attached to the existing office locator item.
- Any new public ExperienceBuilder datasource, table, or service-area output added under the current `gis.ne.gov` locator stack.
- Any official Nebraska same-host county office directory leaf that materially replaces the current wrapper-only locator page.
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
