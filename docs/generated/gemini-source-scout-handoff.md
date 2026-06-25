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
- Kansas: `current_ksde_directory_roots_and_pdf_url_return_request_rejected_shells_and_exact_submit_replay_is_rejected_while_reviewed_local_district_leaves_cover_only_24_counties`
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

## Current Focus State: Kansas

### Blocker Reason

`district_or_county_education_routing` is the only remaining Kansas critical blocker. Kansas now has reviewed local education-routing proof for 24/105 counties from preserved district-owned or district-linked local leaves, but the current live KSDE state directory/export lane is still not reproducible in the bounded raw pass. `https://uapps.ksde.gov/Directory_Rpts/default.aspx`, `https://www.ksde.gov/data-and-reporting/directories`, and the current Kansas educational-directory PDF URL now each return HTTP 200 only as the same `Request Rejected` shell, and one fresh exact district-scoped submit replay on the Directory Reports root also returns that shell instead of a workbook. Labette now clears because the official Parsons District Schools USD 503 sitemap exposes an exact district-owned `/page/tri-county-special-education-cooperative/` leaf, and the fetched usd503.org page preserves the role-exact title `Tri-County Special Education Cooperative | Parsons District Schools`, H1 `Tri-County Special Education`, and Child Find screening language on the district host. Kansas remains BLOCKED and not index-safe because county-grade local education proof is still incomplete across the remaining counties and the state-level export lane is not trustworthy enough to drive deterministic repair work right now.

### Exact Evidence Needed

- Additional district-owned Kansas `special education`, `student services`, `special services`, `parent rights`, or district-linked cooperative leaves on unresolved saved district domains.
- Exact same-domain district leaf evidence for unresolved counties that is role-bearing enough to replace the statewide KSDE placeholders.
- If a district host is live but lacks any role-exact leaf, exact non-match proof so the county can stay frozen without repeated retries.

### Useful Official URLs Already Tried

- [KSDE Directory Reports root](https://uapps.ksde.gov/Directory_Rpts/default.aspx)
- [KSDE Directories root](https://www.ksde.gov/data-and-reporting/directories)
- [Kansas Educational Directory PDF](https://www.ksde.gov/docs/default-source/crp/2025-2026-kansas-educational-directory.pdf?sfvrsn=7c81fd62_12)
- [Parsons District Schools sitemap](https://www.usd503.org/sitemap.xml)
- [Parsons district leaf](https://www.usd503.org/page/tri-county-special-education-cooperative/)
- [Coffeyville USD 445 home](https://www.cvilleschools.com/)
- [Coffeyville USD 445 site map](https://www.cvilleschools.com/site-map)
- [Tri County Special Education Coop 607 child-find leaf](https://www.tricounty607.com/child-find)
- [Marysville USD 364 sitemap](https://www.usd364.org/sitemap.xml)
- [Marshall County Special Education Coop eligibility page](https://www.usd364.org/o/mcsec/page/special-education-eligibility/)
- [McPherson County Special Education Cooperative](https://mccsec.mcpherson.com/)

### Top Remaining Source-Scouting Targets

- Saved district-owned domains for unresolved counties, checked only through exact same-domain role-bearing leaf paths.
- District-linked cooperative leaves on district-owned hosts where the district nav explicitly labels the route as Special Education or Child Find.
- Additional district-owned document-folder or CMS routes like the Parsons USD 503, Hays USD 489, Hutchinson USD 308, Marysville USD 364, and Coffeyville USD 445 recoveries, but only on already-preserved district domains.
## Next State Order After Kansas

1. Nebraska
2. Nevada
3. Florida
4. Alaska
5. South Carolina
6. North Carolina
7. New York
8. Oklahoma
9. Oregon
10. Ohio