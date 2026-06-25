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
- Maine: `official_maine_selector_and_workbook_are_live_but_current_search_export_posts_still_return_same_500_shell_plus_dhhs_office_html_has_no_county_contract`
- Massachusetts: `exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export`
- Minnesota: `live_mdeorg_root_and_district_page_but_county_contact_and_analytics_routes_are_radware_blocked_plus_mn_dhs_saved_county_tribal_replacements_are_official_404s`
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

## Current Focus State: Maine

### Blocker Reason

Maine still has two critical blockers, and the highest-priority one remains `district_or_county_education_routing`. The official DOE selector/workbook lane is live and public: the Primary Contacts By Organization selector, the Town selector, and the SAU workbook all load on official Maine hosts. But the actual contact materialization lane is still broken in bounded low-token mode. Fresh Bangor search and export posts both return the same HTTP 500 NEO error shell instead of reusable local contact rows. The county-local blocker remains separate: the DHHS district office page lists office towns and contact details but still exposes no county or service-area crosswalk.

### Exact Evidence Needed

- A current official Maine DOE search or export response that returns real local contact rows instead of the generic HTTP 500 shell.
- Or, an official Maine DOE workbook/export with county-grade contact fields rather than only municipality-to-organization mapping.
- Separately, an official DHHS county or service-area crosswalk for office towns like Bangor, Calais, Machias, Portland, or Skowhegan.

### Useful Official URLs Already Tried

- [Maine NEO Primary Contacts By Organization](https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU)
- [Maine NEO Town selector](https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town)
- [Maine SAU workbook](https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx)
- [Maine special education landing page](https://www.maine.gov/doe/learning/specialed)
- [Maine DHHS district offices](https://www.maine.gov/dhhs/about/contact/offices)

### Top Remaining Source-Scouting Targets

- Any current official Maine DOE contact export or search result that yields real local contact rows instead of the generic HTTP 500 shell.
- Any official DOE workbook or adjacent downloadable file that includes county, phone, email, superintendent, or special-education contact fields.
- Any official DHHS county/service-area crosswalk for the named district-office towns.

## Next State Order After Maine

1. Idaho
2. Arizona
3. Massachusetts
4. New Mexico
5. South Dakota
6. Rhode Island
7. Virginia
8. West Virginia
9. North Dakota
10. Wisconsin
