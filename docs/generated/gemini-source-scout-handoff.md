# Gemini Source Scout Handoff

Updated: 2026-06-23

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, Nevada, New Jersey, North Carolina, Pennsylvania, South Carolina, Texas

## Current Blocked States

- Alaska: `live_dfcs_services_page_and_public_dfcs_search_still_expose_no_borough_routing_while_current_health_and_legacy_dhss_dpa_hosts_stay_gate_blocked`
- Arizona: `three_public_district_domains_official_api_and_exact_slug_sweeps_still_lack_role_leafs_and_altcs_office_cards_still_lack_county_assignments`
- Florida: `official_local_offices_leaf_routes_to_partial_family_resource_center_and_myaccess_public_shell_only_exposes_dataexchangeproxy_shell`
- Idaho: `reviewed_idaho_district_leaves_now_cover_12_counties_and_dhw_split_is_explicit_but_county_grade_remains_incomplete`
- Kansas: `reviewed_kansas_district_and_district_owned_leaves_now_cover_16_counties_but_export_backed_county_grade_coverage_is_still_incomplete`
- Maine: `official_maine_workbook_is_stable_mapping_only_and_contact_materialization_lane_still_500_plus_dhhs_office_html_has_no_county_contract`
- Massachusetts: `exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export`
- Minnesota: `mdeorg_root_is_live_but_actionable_child_routes_are_title_only_radware_shells_plus_mn_dhs_local_office_family_is_radware_challenged`
- Nebraska: `official_public_office_service_root_has_no_tables_and_office_schema_has_no_service_area_fields`
- New Hampshire: `official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable_with_no_live_nh_gov_successor_root`
- New Mexico: `district_leafs_missing_and_county_local_four_county_remainder_persists_after_empty_archive_tail`
- New York: `nygov_linked_exact_otda_successor_leaves_still_reset_while_health_ny_ldss_family_remains_unusable`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
- Ohio: `retired_official_county_family_and_public_search_surfaces_still_dead_plus_education_inventory_root_only`
- Oklahoma: `live_okdhs_office_map_only_materializes_46_counties_and_no_disability_local_export_closes_the_77_county_contract`
- Oregon: `live_odhs_office_finder_is_only_a_sharepoint_leaflet_shell_with_no_public_county_extract_or_query_contract`
- Rhode Island: `generic_or_statewide_evidence_used_where_local_required`
- South Dakota: `live_sd_educational_directory_exists_but_local_district_leaves_are_unauthored_and_localoffices_root_has_no_public_county_contract`
- Tennessee: `generic_or_statewide_evidence_used_where_local_required`
- Utah: `official_usbe_district_lea_directory_clears_education_but_public_dws_office_api_only_materializes_26_of_29_physical_office_counties_and_still_lacks_county_service_area_contract`
- Vermont: `generic_or_statewide_evidence_used_where_local_required`
- Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Washington: `generic_or_statewide_evidence_used_where_local_required`
- West Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Wisconsin: `generic_or_statewide_evidence_used_where_local_required`
- Wyoming: `legacy_or_inventory_only_evidence`

## Current Focus State: Kansas

### Blocker Reason

`district_or_county_education_routing` is the only remaining Kansas critical blocker. Reviewed local education-routing proof now covers 16/105 counties. The newest bounded recovery is Ellis County: the export-backed Hays USD 489 host is live, its public sitemap is live, and the district-owned route `https://www.usd489.com/documents/about-usd-489/special-education/81796` returns a live Nuxt document shell whose embedded route data preserves breadcrumb name `Special Education` plus same-domain child folders `WEBKIDSS Handbook` and `SPED Resources`. That is enough to clear Ellis as a role-exact district-owned special-education lane. Dickinson remains a correct exact non-match freeze: the official Abilene Public Schools host at `https://www.abileneschools.org/` and its public sitemap are both live, but the bounded same-domain pass still found no role-exact special-education, student-services, procedural-safeguards, or parent-rights leaf on the district host. Kansas therefore remains blocked because county-grade local education proof is still incomplete across the remaining unresolved counties.

### Exact Evidence Needed

- More export-backed Kansas district-owned special-education or student-support leaves that stay role-exact on the live district host.
- More district-linked cooperative routes where the district explicitly labels the path as local special-education services and the linked cooperative host clearly states the service scope, parent-rights path, or local IEP routing.
- Exact non-match freezes for districts whose live pages are still generic program hubs, homepage-only, document-shell-only without role-bearing metadata, or sitemap-only content.

### Useful Official URLs Already Tried

- [Kansas KSDE directories root](https://www.ksde.gov/data-and-reporting/directories)
- [Kansas Directory Reports](https://uapps.ksde.gov/Directory_Rpts/default.aspx)
- [Kansas Data Central](https://datacentral.ksde.gov/default.aspx)
- [Kansas district maps PDF](https://www.ksde.gov/docs/default-source/sf/2025-usd-county-map.pdf?sfvrsn=8ceea3ce_5)
- [Hays USD 489 root](https://www.usd489.com/)
- [Hays USD 489 sitemap](https://www.usd489.com/sitemap.xml)
- [Hays USD 489 Special Education document folder](https://www.usd489.com/documents/about-usd-489/special-education/81796)
- [Hays USD 489 WEBKIDSS child folder](https://www.usd489.com/documents/about-usd-489/special-education/webkidss-handbook/16663727)
- [Hays USD 489 SPED Resources child folder](https://www.usd489.com/documents/about-usd-489/special-education/sped-resources/16663728)
- [Abilene Public Schools root](https://www.abileneschools.org/)
- [Abilene Public Schools sitemap](https://www.abileneschools.org/sitemap.xml)

### Top Remaining Source-Scouting Targets

- Additional Kansas district-owned `special education`, `student support`, `special services`, or role-bearing document-folder routes on export-backed district hosts for unresolved counties.
- Additional district-linked cooperative hosts that explicitly state they provide special-education services across partner districts and preserve parent-rights or IEP routing on the same local stack.
- Exact county-by-county non-match documentation where a district host is live but only exposes generic or non-role-bearing local pages.
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