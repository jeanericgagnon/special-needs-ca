# Gemini Source Scout Handoff

Updated: 2026-06-23

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, Nevada, New Jersey, North Carolina, Pennsylvania, South Carolina, Texas

## Current Blocked States

- Alaska: `live_dfcs_services_page_remains_phone_only_while_dfcs_search_still_self_posts_without_results_and_current_health_and_legacy_dhss_dpa_hosts_stay_gate_blocked`
- Arizona: `three_public_district_domains_official_api_and_exact_slug_sweeps_still_lack_role_leafs_and_altcs_office_cards_still_lack_county_assignments`
- Florida: `official_local_offices_leaf_routes_to_partial_family_resource_center_and_current_myaccess_public_shell_recovers_but_county_results_remain_authenticated_or_shell_only`
- Idaho: `reviewed_idaho_district_leaves_now_cover_12_counties_and_dhw_split_is_explicit_but_county_grade_remains_incomplete`
- Kansas: `official_ksde_directory_export_roots_now_return_request_rejected_shells_while_reviewed_district_owned_leaves_cover_16_counties_but_county_grade_is_still_incomplete`
- Maine: `official_maine_workbook_is_stable_mapping_only_and_contact_materialization_lane_still_500_plus_dhhs_office_html_has_no_county_contract`
- Massachusetts: `exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export`
- Minnesota: `mdeorg_root_is_live_but_actionable_child_routes_are_title_only_radware_shells_plus_mn_dhs_local_office_family_is_radware_challenged`
- Nebraska: `official_published_resource_list_contains_only_config_and_static_assets_while_no_metadata_or_hidden_assignment_artifact_exists`
- New Hampshire: `official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable_with_no_live_nh_gov_successor_root`
- New Mexico: `district_leafs_missing_and_county_local_four_county_remainder_persists_after_empty_archive_tail`
- New York: `nygov_links_exact_otda_successor_leaves_that_still_reset_while_mybenefits_begin_page_recovers_without_county_local_contract_and_health_ny_ldss_family_remains_unusable`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
- Ohio: `official_ohio_jfs_medicaid_and_ohio_gov_root_surfaces_all_404_while_education_inventory_root_only`
- Oklahoma: `live_okdhs_general_office_map_only_materializes_46_counties_while_same_host_child_support_tree_proves_county_contracts_exist_but_not_for_disability_local_routing`
- Oregon: `live_odhs_office_finder_is_only_a_custom_component_shell_with_no_public_county_extract_query_contract_or_api_surface`
- Rhode Island: `generic_or_statewide_evidence_used_where_local_required`
- South Dakota: `live_sd_educational_directory_exists_but_local_district_leaves_are_unauthored_and_localoffices_root_has_no_public_county_contract`
- Tennessee: `generic_or_statewide_evidence_used_where_local_required`
- Utah: `official_usbe_district_lea_directory_clears_education_but_utah_dhhs_contacts_county_map_text_and_live_dws_office_stack_still_fail_to_expose_county_service_area_contract`
- Vermont: `generic_or_statewide_evidence_used_where_local_required`
- Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Washington: `generic_or_statewide_evidence_used_where_local_required`
- West Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Wisconsin: `generic_or_statewide_evidence_used_where_local_required`
- Wyoming: `legacy_or_inventory_only_evidence`

## Current Focus State: New York

### Blocker Reason

`county_local_disability_resources` is the only remaining New York critical blocker. The old `health.ny.gov` LDSS family still fails host-wide, the exact OTDA successor leaves still reset, and although `mybenefits.ny.gov` now lands on a public begin page, that recovered portal surface still does not expose county-local district office routing.

### Exact Evidence Needed

- Any official New York surface that maps counties or local social services districts to Medicaid / HEAP / public assistance office contacts on a publicly reviewable host.
- Any exact OTDA successor leaf that becomes reviewable and preserves local district office contact or county-local routing.
- Any county-owned or state-managed local district directory that publicly replaces the old `health.ny.gov` LDSS lane.

### Useful Official URLs Already Tried

- [New York LDSS directory](https://www.health.ny.gov/health_care/medicaid/ldss.htm)
- [New York health robots.txt](https://www.health.ny.gov/robots.txt)
- [New York health sitemap.xml](https://www.health.ny.gov/sitemap.xml)
- [New York Medicaid root](https://www.health.ny.gov/health_care/medicaid/)
- [New York Social Programs portal](https://www.ny.gov/services/social-programs)
- [Apply for Cooling Assistance](https://www.ny.gov/services/apply-cooling-assistance)
- [OTDA HEAP Local District Contact](https://otda.ny.gov/programs/heap/contacts/)
- [OTDA HEAP root](https://otda.ny.gov/programs/heap/)
- [OTDA application PDF](https://otda.ny.gov/programs/applications/4826.pdf)
- [OTDA DSS locator attempt](https://otda.ny.gov/workingfamilies/dss.asp)
- [OTDA root](https://otda.ny.gov/)
- [OTDA www root](https://www.otda.ny.gov/)
- [myBenefits root](https://mybenefits.ny.gov/)

### Top Remaining Source-Scouting Targets

- Any public OTDA contact or applications surface that stops resetting and becomes reviewable in the bounded lane.
- Any county-owned or state-owned local district office directory explicitly linked from current `ny.gov`, OTDA, or MyBenefits surfaces.
- Any public page on the recovered MyBenefits host that goes beyond portal begin/login flow and actually preserves county-local contact routing.

## Next State Order After New York

1. Oklahoma
2. Oregon
3. Ohio
4. Minnesota
5. Maine
6. Idaho
7. Arizona
8. Massachusetts
9. New Mexico
10. South Dakota
