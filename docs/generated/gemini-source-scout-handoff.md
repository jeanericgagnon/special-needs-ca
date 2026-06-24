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
- Kansas: `live_ksde_directory_root_and_public_export_contract_recovered_but_reviewed_local_district_leaves_still_cover_only_18_counties`
- Maine: `official_maine_workbook_is_stable_mapping_only_and_contact_materialization_lane_still_500_plus_dhhs_office_html_has_no_county_contract`
- Massachusetts: `exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export`
- Minnesota: `mdeorg_root_is_live_but_actionable_child_routes_are_title_only_radware_shells_plus_mn_dhs_local_office_family_is_radware_challenged`
- Nebraska: `recovered_public_office_stack_still_has_no_hidden_table_assignment_bridge_and_only_42_offices_for_93_counties`
- New Hampshire: `official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable_with_no_live_nh_gov_successor_root`
- New Mexico: `district_leafs_missing_and_county_local_four_county_remainder_persists_after_empty_archive_tail`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
- Ohio: `official_ohio_jfs_medicaid_and_ohio_gov_root_surfaces_all_404_while_education_inventory_root_only`
- Oklahoma: `live_okdhs_kml_only_yields_45_benefit_capable_counties_while_tanf_only_access_points_and_child_support_only_county_tree_cannot_close_the_remaining_32`
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

## Current Focus State: Ohio

### Blocker Reason

`official_ohio_jfs_medicaid_and_ohio_gov_root_surfaces_all_404_while_education_inventory_root_only`

### Exact Evidence Needed

- Any live official Ohio county-local JFS, Medicaid, or Ohio.gov successor directory, locator, search index, or export that replaces the retired county-office family.
- Any public official county-office contract that stays live on the current Ohio host family instead of the dead 404 roots.
- More exact district-owned or ESC-owned local routing leaves so education can move beyond the current tiny reviewed inventory.

### Useful Official URLs Already Tried

- [Ohio JFS root](https://jfs.ohio.gov/)
- [Ohio Medicaid root](https://medicaid.ohio.gov/)
- [Ohio.gov root](https://ohio.gov/)
- [Ohio JFS local agencies directory guess](https://jfs.ohio.gov/home/local-agencies-directory)
- [Ohio Medicaid county agencies guess](https://medicaid.ohio.gov/families-and-individuals/county-agencies)
- [Ohio Medicaid resources county agencies guess](https://medicaid.ohio.gov/resources/county-agencies)
- [Ohio.gov Job and Family Services directory guess](https://ohio.gov/residents/resources/job-family-services-directory)
- [NPESC districts leaf](https://www.npesc.org/vnews/display.v/SEC/Member%20%26%20Partner%20School%20Districts)
- [SCOESC districts leaf](https://www.scoesc.org/districts)
- [WBESC schools leaf](https://www.wbesc.org/our-schools)
- [MRESC districts served leaf](https://www.mresc.org/districts-we-serve/)

### Top Remaining Source-Scouting Targets

- Reviewed 2026-06-23 one more bounded live official Ohio county-local pass after the earlier JFS retirement finding. The blocker is now stronger than dead guessed county-directory paths alone: in the current repo-side verification lane, even the official root and discovery surfaces fail closed. `https://jfs.ohio.gov/`, `https://medicaid.ohio.gov/`, and `https://ohio.gov/` all return HTTP 404, and the same is true for `robots.txt` and `sitemap.xml` on each host family. The already-tried legacy and guessed county-directory paths remain dead as well, including `https://jfs.ohio.gov/home/local-agencies-directory`, `https://medicaid.ohio.gov/families-and-individuals/county-agencies`, `https://medicaid.ohio.gov/resources/county-agencies`, and `https://ohio.gov/residents/resources/job-family-services-directory`, all of which still return HTTP 404. This means the blocker is no longer just that a county-office page moved; the bounded lane currently has no live official JFS, Medicaid, or Ohio.gov root/discovery contract from which to verify a county-office successor. The DOI-hosted county dataset therefore remains planning evidence only.
- Reviewed 2026-06-23 Ohio school_district source inventory from disk. Only 4 distinct source URLs still preserve any path-level leaf signal, covering just 8 county rows total, while 49 distinct URLs remain generic roots only. The leaf-like URLs are https://www.npesc.org/vnews/display.v/SEC/Member%20%26%20Partner%20School%20Districts, https://www.scoesc.org/districts, https://www.wbesc.org/our-schools, https://www.mresc.org/districts-we-serve/; that is still not enough county-grade coverage to truthfully clear district_or_county_education_routing statewide.

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
