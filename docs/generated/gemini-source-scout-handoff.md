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
- Kansas: `current_ksde_directory_roots_and_pdf_url_return_request_rejected_shells_and_exact_submit_replay_is_rejected_while_reviewed_local_district_leaves_cover_only_20_counties`
- Maine: `official_maine_workbook_is_stable_mapping_only_and_contact_materialization_lane_still_500_plus_dhhs_office_html_has_no_county_contract`
- Massachusetts: `exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export`
- Minnesota: `mdeorg_root_is_live_but_actionable_child_routes_are_title_only_radware_shells_plus_mn_dhs_local_office_family_is_radware_challenged`
- Nebraska: `public_nebraska_office_config_still_only_references_one_web_map_and_a_closest_feature_output_while_the_feature_service_stops_at_42_offices_for_93_counties`
- New Hampshire: `official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable_with_no_live_nh_gov_successor_root`
- New Mexico: `district_leafs_missing_and_county_local_four_county_remainder_persists_after_empty_archive_tail`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
- Ohio: `live_ohio_jfs_medicaid_and_ohio_gov_roots_plus_robots_and_sitemaps_recover_but_current_directory_search_and_sample_cdjfs_leafs_render_404_while_education_inventory_remains_root_only`
- Oklahoma: `live_okdhs_kml_only_yields_45_benefit_capable_counties_while_tanf_only_access_points_and_child_support_only_county_tree_cannot_close_the_remaining_32`
- Rhode Island: `generic_or_statewide_evidence_used_where_local_required`
- South Dakota: `live_sd_educational_directory_exists_but_local_district_leaves_are_unauthored_and_localoffices_root_has_no_public_county_contract`
- Tennessee: `generic_or_statewide_evidence_used_where_local_required`
- Utah: `live_utah_dhhs_contacts_page_recovers_but_explicitly_defers_local_office_info_and_current_dws_office_search_still_limits_public_lookup_to_zip_or_city_without_any_county_contract`
- Vermont: `generic_or_statewide_evidence_used_where_local_required`
- Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Washington: `generic_or_statewide_evidence_used_where_local_required`
- West Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Wisconsin: `generic_or_statewide_evidence_used_where_local_required`
- Wyoming: `legacy_or_inventory_only_evidence`

## Current Focus State: Ohio

### Blocker Reason

Ohio still has two critical blockers, but the highest-priority one is `county_local_disability_resources`. The old root-404 blocker is no longer true: Ohio JFS, Medicaid, and Ohio.gov roots plus their `robots.txt` and `sitemap.xml` surfaces are live again. The current failure is narrower and more truthful: the rendered `job-family-services-directory` page, Ohio search page, JFS `about/local-agencies-directory` root, and sampled `cdjfs-*` county leaves still render public 404 pages even though the live JFS sitemap advertises 98 `cdjfs-*` entries across 88 county slugs.

### Exact Evidence Needed

- A rendered live Ohio county JFS or Medicaid directory page that exposes real county office details instead of the current public 404 page.
- A working current successor to the stale `cdjfs-*` directory family, or proof that the sitemap leaf family itself now renders live office details.
- For education later: more exact district or ESC leaves beyond the tiny current inventory.

### Useful Official URLs Already Tried

- [JFS root](https://jfs.ohio.gov/)
- [JFS robots.txt](https://jfs.ohio.gov/robots.txt)
- [JFS sitemap.xml](https://jfs.ohio.gov/sitemap.xml)
- [Ohio.gov county directory page](https://ohio.gov/residents/resources/job-family-services-directory)
- [Ohio.gov search page](https://ohio.gov/search?query=county%20job%20and%20family%20services)
- [JFS local agencies directory root](https://jfs.ohio.gov/about/local-agencies-directory)
- [Sample JFS county leaf: Adams](https://jfs.ohio.gov/about/local-agencies-directory/cdjfs-adams)
- [Sample JFS county leaf: Cuyahoga](https://jfs.ohio.gov/about/local-agencies-directory/cdjfs-cuyahoga-3)
- [Sample JFS county leaf: Wood](https://jfs.ohio.gov/about/local-agencies-directory/cdjfs-wood)
- [Medicaid root](https://medicaid.ohio.gov/)
- [Medicaid robots.txt](https://medicaid.ohio.gov/robots.txt)
- [Medicaid sitemap.xml](https://medicaid.ohio.gov/sitemap.xml)

### Top Remaining Source-Scouting Targets

- Any current rendered Ohio county-office successor leaf on JFS, Medicaid, or Ohio.gov that replaces the stale public 404 directory family.
- Any official statewide export, table, or rendered directory that maps all 88 counties to county JFS routing without relying on stale sitemap-only leaves.
- For education later: exact district or ESC-owned leaves that materially expand county-grade routing beyond the current root-only inventory.

## Next State Order After Ohio

1. Minnesota
2. Maine
3. Idaho
4. Arizona
5. Massachusetts
6. New Mexico
7. South Dakota
8. Rhode Island
9. Virginia
10. West Virginia
