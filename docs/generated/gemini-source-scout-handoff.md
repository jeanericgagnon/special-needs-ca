# Gemini Source Scout Handoff

Updated: 2026-06-24

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, Nevada, New Jersey, New York, North Carolina, Oregon, Pennsylvania, South Carolina, Texas

## Current Blocked States

- Alaska: `live_dfcs_services_publications_search_and_site_map_still_expose_no_dpa_or_borough_mapping_and_only_surface_wrong_role_ocs_offices_while_legacy_dhss_dpa_paths_now_canonicalize_into_same_challenged_health_host`
- Arizona: `three_public_district_domains_official_api_and_exact_slug_sweeps_still_lack_role_leafs_and_altcs_office_cards_still_lack_county_assignments`
- Florida: `official_local_offices_leaf_routes_to_partial_family_resource_center_and_current_myaccess_bundle_reexposes_exact_county_endpoints_but_they_remain_authenticated_only`
- Idaho: `reviewed_idaho_district_leaves_now_cover_12_counties_and_dhw_split_is_explicit_but_county_grade_remains_incomplete`
- Kansas: `current_ksde_directory_roots_and_pdf_url_return_request_rejected_shells_and_exact_submit_replay_is_rejected_while_reviewed_local_district_leaves_cover_only_23_counties`
- Maine: `official_maine_workbook_is_stable_mapping_only_and_contact_materialization_lane_still_500_plus_dhhs_office_html_has_no_county_contract`
- Massachusetts: `exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export`
- Minnesota: `mdeorg_root_is_live_but_actionable_child_routes_are_title_only_radware_shells_plus_mn_dhs_local_office_family_is_radware_challenged`
- Nebraska: `public_nebraska_office_config_still_only_references_one_web_map_and_a_closest_feature_output_while_the_feature_service_stops_at_42_offices_for_93_counties`
- New Hampshire: `official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable_with_no_live_nh_gov_successor_root`
- New Mexico: `district_leafs_missing_and_county_local_four_county_remainder_persists_after_empty_archive_tail`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
- Ohio: `live_ohio_jfs_medicaid_and_ohio_gov_roots_plus_robots_and_sitemaps_recover_but_current_directory_search_and_sample_cdjfs_leafs_render_404_while_education_inventory_remains_root_only`
- Oklahoma: `live_okdhs_public_county_widget_only_publishes_adair_and_alfalfa_while_kml_still_yields_only_45_benefit_capable_counties_and_no_contract_for_remaining_32`
- Rhode Island: `generic_or_statewide_evidence_used_where_local_required`
- South Dakota: `live_sd_educational_directory_exists_but_local_district_leaves_are_unauthored_and_localoffices_root_has_no_public_county_contract`
- Tennessee: `generic_or_statewide_evidence_used_where_local_required`
- Utah: `live_utah_dhhs_contacts_and_first_party_wpsl_location_api_only_prove_general_contacts_plus_non_disability_program_location_categories_while_dws_lookup_remains_zip_city_without_any_county_contract`
- Vermont: `generic_or_statewide_evidence_used_where_local_required`
- Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Washington: `generic_or_statewide_evidence_used_where_local_required`
- West Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Wisconsin: `generic_or_statewide_evidence_used_where_local_required`
- Wyoming: `legacy_or_inventory_only_evidence`

## Current Focus State: Oklahoma

### Blocker Reason

`county_local_disability_resources` remains the top Oklahoma blocker. The live OKDHS county widget is official but now proves even less than the broader KML: its public widget feed and linked `mapconfig2` model only publish county entries for Adair and Alfalfa, while the broader public KML still yields only 45 benefit-capable counties once TANF-only access points are excluded. The same host still proves county trees are technically publishable for child-support offices, but not yet for the missing disability/local-routing remainder.

### Exact Evidence Needed

- Any current official Oklahoma county-local office directory or export that closes the 32-county remainder on the OKDHS host.
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
- The current measured county remainder is: Adair, Alfalfa, Beaver, Blaine, Cimarron, Coal, Dewey, Ellis, Grant, Greer, Harmon, Harper, Haskell, Hughes, Jefferson, Kingfisher, Kiowa, Logan, Major, Marshall, McClain, McIntosh, Murray, Noble, Nowata, Okfuskee, Pawnee, Roger Mills, Seminole, Tillman, Washita, Woods.

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
