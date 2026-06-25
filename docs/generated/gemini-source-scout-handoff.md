# Gemini Source Scout Handoff

Updated: 2026-06-25

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, Nevada, New Jersey, New York, North Carolina, Oregon, Pennsylvania, South Carolina, Texas, Utah

## Current Blocked States

- Alaska: `reviewed_live_dpa_offices_page_now_public_but_only_groups_regional_offices_without_borough_or_census_area_assignment_while_dfcs_surfaces_add_no_local_mapping_contract`
- Arizona: `azed_host_challenged_and_ahcccs_county_mapping_requires_reviewed_admin_html_leaves_or_explicit_ocr_artifact`
- Florida: `official_local_offices_leaf_routes_to_partial_family_resource_center_and_current_myaccess_bundle_reexposes_exact_county_endpoints_but_they_remain_authenticated_only`
- Idaho: `reviewed_idaho_district_leaves_hold_at_12_counties_and_remaining_county_bearing_district_roots_now_have_public_sitemap_exhaustion_evidence`
- Kansas: `current_ksde_directory_roots_and_pdf_url_return_request_rejected_shells_and_exact_submit_replay_is_rejected_while_reviewed_local_district_leaves_cover_only_30_counties`
- Maine: `official_maine_selector_and_workbook_are_live_but_current_search_export_posts_still_return_same_500_shell_plus_dhhs_office_html_has_no_county_contract`
- Massachusetts: `exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export`
- Minnesota: `live_mdeorg_root_and_district_page_but_county_contact_and_analytics_routes_are_radware_blocked_plus_mn_dhs_saved_county_tribal_replacements_are_official_404s`
- Nebraska: `official_nebraska_portal_search_still_returns_only_the_same_web_map_feature_service_and_map_service_without_any_county_assignment_item_or_directory_leaf`
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

## Current Focus State: Kansas

### Blocker Reason

`district_or_county_education_routing` is the only remaining Kansas critical blocker. Kansas now has reviewed local education-routing proof for 30/105 counties from preserved district-owned or district-linked leaves, but the current live KSDE state directory/export lane is still not reproducible in the bounded raw pass. `https://uapps.ksde.gov/Directory_Rpts/default.aspx`, `https://www.ksde.gov/data-and-reporting/directories`, and the current Kansas educational-directory PDF URL now each return HTTP 200 only as the same `Request Rejected` shell, and one fresh exact district-scoped submit replay on the Directory Reports root also returns that shell instead of a workbook. Franklin now clears because the official Ottawa USD 290 homepage links directly to the district-branded `studentlearningservices` site on the `usd290.org` namespace, and the fetched exact `Special Education` leaf returned HTTP 200 with title `USD 290 Student Services - Special Education` while the same stack also exposes `Parent Rights`. Kansas remains BLOCKED because county-grade local education proof is still incomplete across the remaining counties and the state-level export lane is not trustworthy enough to drive deterministic repair work right now.

### Exact Evidence Needed

- Additional district-owned Kansas `special education`, `student services`, `special services`, `parent rights`, or district-linked cooperative leaves on unresolved saved district domains.
- Exact same-domain district leaf evidence for unresolved counties that is role-bearing enough to replace the statewide KSDE placeholders.
- If a district host is live but lacks any role-exact leaf, exact non-match proof so the county can stay frozen without repeated retries.

### Useful Official URLs Already Tried

- [KSDE Directory Reports root](https://uapps.ksde.gov/Directory_Rpts/default.aspx)
- [KSDE Directories root](https://www.ksde.gov/data-and-reporting/directories)
- [Kansas Educational Directory PDF](https://www.ksde.gov/docs/default-source/crp/2025-2026-kansas-educational-directory.pdf?sfvrsn=7c81fd62_12)
- [Ottawa USD 290 root](https://www.usd290.org/)
- [Ottawa USD 290 sitemap](https://www.usd290.org/sitemap.xml)
- [Ottawa USD 290 Student Services home](https://sites.google.com/usd290.org/studentlearningservices/home)
- [Ottawa USD 290 Student Services Special Education leaf](https://sites.google.com/usd290.org/studentlearningservices/special-education)
- [Ottawa USD 290 Parent Rights leaf](https://sites.google.com/usd290.org/studentlearningservices/parent-rights)
- [Garnett USD 365 Public Info / Forms leaf](https://www.usd365.org/69971_2)
- [Fort Scott USD 234 Special Education leaf](https://www.usd234.org/page/special-education/)
- [Wamego USD 320 Child Find leaf](https://www.usd320.com/childfind)

### Top Remaining Source-Scouting Targets

- Saved district-owned domains for unresolved counties, checked only through exact same-domain role-bearing leaf paths.
- District-linked cooperative leaves on district-owned hosts where the district nav explicitly labels the route as Special Education or Child Find.
- Additional district-owned document-folder, Google Sites, or CMS routes like the Ottawa USD 290, Garnett USD 365, Parsons USD 503, Hays USD 489, Hutchinson USD 308, Marysville USD 364, Burlington USD 244, Coffeyville USD 445, Wamego USD 320, and Fort Scott USD 234 recoveries, but only on already-preserved district domains.
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