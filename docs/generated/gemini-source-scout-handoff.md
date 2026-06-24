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
- Kansas: `official_ksde_directory_and_pdf_roots_now_only_serve_request_rejected_shells_and_the_directory_reports_root_exposes_no_hidden_submit_fields_while_reviewed_district_owned_leaves_cover_16_counties`
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
- Utah: `utah_dhhs_contacts_now_serves_cloudflare_403_while_live_dws_office_inventory_and_sparse_county_named_labels_still_fail_to_expose_complete_county_service_area_contract`
- Vermont: `generic_or_statewide_evidence_used_where_local_required`
- Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Washington: `generic_or_statewide_evidence_used_where_local_required`
- West Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Wisconsin: `generic_or_statewide_evidence_used_where_local_required`
- Wyoming: `legacy_or_inventory_only_evidence`

## Current Focus State: Kansas

### Blocker Reason

`district_or_county_education_routing` is the only remaining Kansas critical blocker. Kansas still has reviewed local education-routing proof for 16 counties from previously preserved district-owned or district-linked local leaves, but the current official KSDE roots are now fully unusable in the raw lane. `https://uapps.ksde.gov/Directory_Rpts/default.aspx`, `https://www.ksde.gov/data-and-reporting/directories`, and the current Kansas educational directory PDF URL each return HTTP 200 only as the same `Request Rejected` shell. The raw Directory Reports root also exposes no `__VIEWSTATE`, `__VIEWSTATEGENERATOR`, or `__EVENTVALIDATION` fields, so the old exact district-scoped public submit contract is not reproducible from the current raw lane. Kansas remains BLOCKED and not index-safe because county-grade local education proof is still incomplete across the remaining counties.

### Exact Evidence Needed

- Additional district-owned Kansas `special education`, `student services`, `special services`, `parent rights`, or district-linked cooperative leaves on unresolved saved district domains.
- Exact same-domain district leaf evidence for unresolved counties that is role-bearing enough to replace the statewide KSDE placeholders.
- If a district host is live but lacks any role-exact leaf, exact non-match proof so the county can stay frozen without repeated retries.

### Useful Official URLs Already Tried

- [KSDE Directory Reports root](https://uapps.ksde.gov/Directory_Rpts/default.aspx)
- [KSDE Directories root](https://www.ksde.gov/data-and-reporting/directories)
- [Kansas Educational Directory PDF](https://www.ksde.gov/docs/default-source/crp/2025-2026-kansas-educational-directory.pdf?sfvrsn=7c81fd62_12)
- [Atchison Public Schools Special Education Services](https://www.usd409.net/page/special-education-services/)
- [Hays USD 489 Special Education folder](https://www.usd489.com/documents/about-usd-489/special-education/81796)
- [Abilene Public Schools root](https://www.abileneschools.org/)
- [Abilene Public Schools sitemap](https://www.abileneschools.org/sitemap.xml)

### Top Remaining Source-Scouting Targets

- Saved district-owned domains for unresolved counties, checked only through exact same-domain role-bearing leaf paths.
- District-linked cooperative leaves on district-owned hosts where the district nav explicitly labels the route as Special Education or similar.
- Additional district-owned document-folder or CMS routes like the Hays USD 489 recovery, but only on already-preserved district domains.
## Next State Order After Kansas

1. Nebraska
2. Florida
3. Alaska
4. New York
5. Oklahoma
6. Oregon
7. Ohio
8. Minnesota
9. Maine
10. Idaho
