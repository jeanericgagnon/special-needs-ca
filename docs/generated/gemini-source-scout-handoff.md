# Gemini Source Scout Handoff

Updated: 2026-06-23

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, Nevada, New Jersey, Pennsylvania, Texas

## Current Blocked States

- Alaska: `live_dfcs_services_page_only_provides_statewide_phone_relay_while_health_host_county_equivalent_directory_stays_challenged`
- Arizona: `three_public_district_domains_official_api_and_exact_slug_sweeps_still_lack_role_leafs_and_altcs_office_cards_still_lack_county_assignments`
- Florida: `official_local_offices_leaf_routes_to_partial_family_resource_center_and_myaccess_results_stay_authenticated`
- Idaho: `reviewed_idaho_district_leaves_now_cover_12_counties_and_dhw_split_is_explicit_but_county_grade_remains_incomplete`
- Kansas: `reviewed_kansas_district_and_district_linked_coop_leaves_now_cover_10_counties_but_export_backed_county_grade_coverage_is_still_incomplete`
- Maine: `official_maine_workbook_is_stable_mapping_only_and_contact_materialization_lane_still_500_plus_dhhs_office_html_has_no_county_contract`
- Massachusetts: `exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export`
- Minnesota: `mdeorg_root_is_live_but_actionable_child_routes_are_title_only_radware_shells_plus_mn_dhs_local_office_family_is_radware_challenged`
- Nebraska: `official_public_office_service_root_has_no_tables_and_office_schema_has_no_service_area_fields`
- New Hampshire: `official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable_with_no_live_nh_gov_successor_root`
- New Mexico: `district_leafs_missing_and_county_local_four_county_remainder_persists_after_empty_archive_tail`
- New York: `official_nysed_boces_pages_cover_non_nyc_counties_but_no_reviewed_nyc_borough_route_and_no_public_ldss_replacement`
- North Carolina: `generic_or_statewide_evidence_used_where_local_required`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
- Ohio: `retired_official_county_family_and_public_search_surfaces_still_dead_plus_education_inventory_root_only`
- Oklahoma: `official_osde_state_school_directory_clears_education_but_dead_dhhs_locator_host_and_planning_rows_still_block_county_local`
- Oregon: `official_ode_county_searchable_school_directory_clears_education_but_live_office_finder_root_still_has_no_county_extract`
- Rhode Island: `generic_or_statewide_evidence_used_where_local_required`
- South Carolina: `official_school_directory_root_is_live_but_not_yet_converted_into_district_owned_special_education_leaves`
- South Dakota: `live_sd_educational_directory_exists_but_local_district_leaves_are_unauthored_and_localoffices_root_has_no_public_county_contract`
- Tennessee: `generic_or_statewide_evidence_used_where_local_required`
- Utah: `official_usbe_district_lea_directory_clears_education_and_public_dws_office_api_still_lacks_county_service_area_contract`
- Vermont: `generic_or_statewide_evidence_used_where_local_required`
- Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Washington: `generic_or_statewide_evidence_used_where_local_required`
- West Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Wisconsin: `generic_or_statewide_evidence_used_where_local_required`
- Wyoming: `legacy_or_inventory_only_evidence`

## Current Focus State: Alaska

### Blocker Reason

`county_local_disability_resources` is the only remaining Alaska critical blocker. The live DFCS successor host is exhausted and preserves only statewide phone routing, while the current official health-host family is challenge-blocked end to end: exact office leaves, parent service/resource roots, and even low-cost discovery surfaces like `robots.txt`, `sitemap.xml`, `wp-json`, and `wp-sitemap.xml` all return the same 403 Cloudflare shell.

### Exact Evidence Needed

- Any official Alaska surface that maps boroughs or census areas to DPA or Medicaid office locations on a publicly reviewable host.
- Any reviewable successor office locator or directory that lives on `dfcs.alaska.gov` or another current official Alaska host instead of only on the challenge-blocked `health.alaska.gov` family.
- Any official document, export, or table that explicitly enumerates Alaska borough or census-area coverage for public assistance office routing.

### Useful Official URLs Already Tried

- [Alaska DFCS Services](https://dfcs.alaska.gov/Pages/Services.aspx)
- [Alaska DFCS Department Contacts](https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx)
- [Alaska DFCS Publications](https://dfcs.alaska.gov/Pages/Publications.aspx)
- [Alaska DFCS robots.txt](https://dfcs.alaska.gov/robots.txt)
- [Alaska DFCS sitemap.xml](https://dfcs.alaska.gov/sitemap.xml)
- [Alaska DFCS search for public assistance](https://dfcs.alaska.gov/search/pages/results.aspx?k=public%20assistance)
- [Alaska DFCS search for office](https://dfcs.alaska.gov/search/pages/results.aspx?k=office)
- [Alaska health robots.txt](https://health.alaska.gov/robots.txt)
- [Alaska health sitemap.xml](https://health.alaska.gov/sitemap.xml)
- [Alaska health wp-json](https://health.alaska.gov/wp-json/)
- [Alaska health wp-sitemap.xml](https://health.alaska.gov/wp-sitemap.xml)
- [Alaska health resources root](https://health.alaska.gov/en/resources/)
- [Alaska health services root](https://health.alaska.gov/en/services/)
- [Alaska Adult Public Assistance leaf](https://health.alaska.gov/en/services/adult-public-assistance-apa/)
- [Alaska Apply for Medicaid leaf](https://health.alaska.gov/en/services/division-of-public-assistance-services/apply-for-medicaid/)
- [Alaska DPA offices directory](https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/)
- [Alaska legacy office locations](https://health.alaska.gov/dpa/Pages/office-locations.aspx)

### Top Remaining Source-Scouting Targets

- Any current Alaska host outside `health.alaska.gov` that now publishes a borough- or census-area DPA office directory.
- Any official Alaska PDF, spreadsheet, or office-contact table that names specific borough or census-area coverage for public assistance offices.
- Any future public relaxation on the health host that makes the DPA office directory or Medicaid application leaves scraper-reviewable without the Cloudflare shell.
## Next State Order After Alaska

1. South Carolina
2. North Carolina
3. New York
4. Oklahoma
5. Oregon
6. Ohio
7. Minnesota
8. Maine
9. Idaho
10. Arizona10. Arizona10. Idaho10. Idaho10. Minnesota10. Minnesota10. Minnesota10. Minnesota10. Ohio10. Ohio10. Oregon10. Oregon