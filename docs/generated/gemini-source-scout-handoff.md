# Gemini Source Scout Handoff

Updated: 2026-06-24

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, Nevada, New Jersey, North Carolina, Pennsylvania, South Carolina, Texas

## Current Blocked States

- Alaska: `live_dfcs_services_publications_search_and_site_map_still_expose_no_dpa_or_borough_mapping_and_only_surface_wrong_role_ocs_offices_while_legacy_dhss_dpa_paths_now_canonicalize_into_same_challenged_health_host`
- Arizona: `three_public_district_domains_official_api_and_exact_slug_sweeps_still_lack_role_leafs_and_altcs_office_cards_still_lack_county_assignments`
- Florida: `official_local_offices_leaf_routes_to_partial_family_resource_center_and_current_myaccess_bundle_reexposes_exact_county_endpoints_but_they_remain_authenticated_only`
- Idaho: `reviewed_idaho_district_leaves_now_cover_12_counties_and_dhw_split_is_explicit_but_county_grade_remains_incomplete`
- Kansas: `live_ksde_directory_root_and_public_export_contract_recovered_but_reviewed_local_district_leaves_still_cover_only_18_counties`
- Maine: `official_maine_workbook_is_stable_mapping_only_and_contact_materialization_lane_still_500_plus_dhhs_office_html_has_no_county_contract`
- Massachusetts: `exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export`
- Minnesota: `mdeorg_root_is_live_but_actionable_child_routes_are_title_only_radware_shells_plus_mn_dhs_local_office_family_is_radware_challenged`
- Nebraska: `recovered_public_office_stack_still_has_no_hidden_table_assignment_bridge_and_only_42_offices_for_93_counties`
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
- Utah: `live_utah_dhhs_contacts_page_recovers_but_explicitly_defers_local_office_info_while_surviving_dws_public_api_still_lacks_any_county_contract`
- Vermont: `generic_or_statewide_evidence_used_where_local_required`
- Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Washington: `generic_or_statewide_evidence_used_where_local_required`
- West Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Wisconsin: `generic_or_statewide_evidence_used_where_local_required`
- Wyoming: `legacy_or_inventory_only_evidence`

## Current Focus State: Alaska

### Blocker Reason

`county_local_disability_resources` is the only remaining Alaska critical blocker. The live DFCS successor host still only gives statewide phone routing, the DFCS Publications surface still exposes no DPA or public-assistance office material, the DFCS Site Map only adds the wrong-service `OCS Regional Offices` leaf, the public DFCS search surface still has no usable public results contract, the current `health.alaska.gov` DPA family is challenge-blocked end to end, and the legacy `dhss.alaska.gov/dpa/...` paths now canonicalize into that same challenged `health.alaska.gov/dpa` host instead of preserving a separate reviewable legacy subtree.

### Exact Evidence Needed

- Any official Alaska surface that maps boroughs or census areas to DPA or Medicaid office locations on a publicly reviewable host.
- Any reviewable successor office locator or directory that lives on `dfcs.alaska.gov`, `dhss.alaska.gov`, or another current official Alaska host instead of only on the challenge-blocked `health.alaska.gov` family.
- Any official document, export, or table that explicitly enumerates Alaska borough or census-area coverage for public assistance office routing.

### Useful Official URLs Already Tried

- [Alaska DFCS Services](https://dfcs.alaska.gov/Pages/Services.aspx)
- [Alaska DFCS Publications](https://dfcs.alaska.gov/Pages/Publications.aspx)
- [Alaska DFCS Site Map](https://dfcs.alaska.gov/Pages/Site-Map.aspx)
- [Alaska DFCS Search](https://dfcs.alaska.gov/Search/default.aspx)
- [Alaska DFCS Search results endpoint](https://dfcs.alaska.gov/Search/Pages/results.aspx?k=public%20assistance)
- [Alaska DPA offices directory](https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/)
- [Alaska Adult Public Assistance leaf](https://health.alaska.gov/en/services/adult-public-assistance-apa/)
- [Alaska Apply for Medicaid leaf](https://health.alaska.gov/en/services/division-of-public-assistance-services/apply-for-medicaid/)
- [Alaska health robots.txt](https://health.alaska.gov/robots.txt)
- [Legacy DHSS root](https://dhss.alaska.gov/)
- [Legacy DHSS robots.txt](https://dhss.alaska.gov/robots.txt)
- [Legacy DHSS DPA root](https://dhss.alaska.gov/dpa/Pages/default.aspx)
- [Legacy DHSS office locations](https://dhss.alaska.gov/dpa/Pages/office-locations.aspx)
- [Legacy DHSS DPA contacts](https://dhss.alaska.gov/dpa/Pages/contacts.aspx)

### Top Remaining Source-Scouting Targets

- Any current Alaska host outside the challenged `health.alaska.gov` family that now publishes a borough- or census-area DPA office directory.
- Any official Alaska PDF, spreadsheet, or office-contact table that names specific borough or census-area coverage for public assistance offices.
- Any future public relaxation on either the `health.alaska.gov` or canonicalized legacy `dhss.alaska.gov/dpa` lane that makes actual DPA office-routing leaves scraper-reviewable.

## Next State Order After Alaska

1. New York
2. Oklahoma
3. Oregon
4. Ohio
5. Minnesota
6. Maine
7. Idaho
8. Arizona
9. Massachusetts
10. New Mexico
