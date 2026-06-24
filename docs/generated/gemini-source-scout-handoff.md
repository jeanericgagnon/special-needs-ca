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
- Nebraska: `official_public_office_feature_service_supports_export_formats_but_schema_and_distinct_county_values_still_expose_no_statewide_assignment_contract`
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
- Utah: `utah_dhhs_contacts_cloudflare_403_and_live_dws_public_api_surface_still_stops_at_inventory_and_three_service_labels_without_any_county_contract`
- Vermont: `generic_or_statewide_evidence_used_where_local_required`
- Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Washington: `generic_or_statewide_evidence_used_where_local_required`
- West Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Wisconsin: `generic_or_statewide_evidence_used_where_local_required`
- Wyoming: `legacy_or_inventory_only_evidence`

## Current Focus State: Utah

### Blocker Reason

`county_local_disability_resources` is the only remaining Utah critical blocker. The live Utah Schools Directory still clears education, but the current repo-side lane now sees `https://dhhs.utah.gov/contacts/` as a Cloudflare 403 challenge rather than a reviewable public county-contact page. The surviving official Utah office lane is still the DWS stack: `jobs.utah.gov/department/contact/index.html` still points to an `Office Map`, the redirected `jobs.utah.gov/office-search/` shell is still live, `https://officesearch-api.jobs.utah.gov/api/v1/offices` still returns office inventory rows, and `https://officesearch-api.jobs.utah.gov/api/v1/services` only exposes the three public labels `All`, `USOR`, and `EC`. No public county endpoint or service-area field materializes on the same host. Utah therefore remains BLOCKED and not index-safe.

### Exact Evidence Needed

- Any public Utah successor directory, export, or leaf set that explicitly maps all 29 counties to local DWS, DHHS, or disability-resource offices.
- Any reviewable DHHS successor child route that materializes county-local disability office assignments without challenge gating.
- Any public office API field or companion endpoint that adds `county`, `countiesServed`, or equivalent service-area assignments to the current Utah office inventory.

### Useful Official URLs Already Tried

- [Utah Schools Directory](https://schools.utah.gov/schoolsdirectory)
- [Utah DHHS Contacts](https://dhhs.utah.gov/contacts/)
- [Older DWS public contact page with Office Map link](https://jobs.utah.gov/department/contact/index.html)
- [Live DWS Office Search shell](https://jobs.utah.gov/office-search/)
- [Public DWS office API](https://officesearch-api.jobs.utah.gov/api/v1/offices)
- [Public DWS services API](https://officesearch-api.jobs.utah.gov/api/v1/services)
- [Missing county endpoint probe](https://officesearch-api.jobs.utah.gov/api/v1/counties)
- [Missing search endpoint probe](https://officesearch-api.jobs.utah.gov/api/v1/search)
- [Missing office-search endpoint probe](https://officesearch-api.jobs.utah.gov/api/v1/offices/search)

### Top Remaining Source-Scouting Targets

- Any public Utah successor leaf or export that materially maps counties to local offices rather than just publishing office inventory.
- Any public companion API artifact that adds `county` or service-area assignments to the current DWS office inventory.
- Any reviewable official DHHS local-office surface that becomes available without Cloudflare challenge gating.
## Next State Order After Utah

1. Kansas
2. Nebraska
3. Florida
4. Alaska
5. New York
6. Oklahoma
7. Oregon
8. Ohio
9. Minnesota
10. Maine
