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
- Kansas: `reviewed_kansas_district_and_district_owned_leaves_now_cover_15_counties_but_export_backed_county_grade_coverage_is_still_incomplete`
- Maine: `official_maine_workbook_is_stable_mapping_only_and_contact_materialization_lane_still_500_plus_dhhs_office_html_has_no_county_contract`
- Massachusetts: `exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export`
- Minnesota: `mdeorg_root_is_live_but_actionable_child_routes_are_title_only_radware_shells_plus_mn_dhs_local_office_family_is_radware_challenged`
- Nebraska: `official_public_office_service_root_has_no_tables_and_office_schema_has_no_service_area_fields`
- New Hampshire: `official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable_with_no_live_nh_gov_successor_root`
- New Mexico: `district_leafs_missing_and_county_local_four_county_remainder_persists_after_empty_archive_tail`
- New York: `official_nysed_boces_pages_cover_non_nyc_counties_but_no_reviewed_nyc_borough_route_and_nygov_linked_otda_successor_leaves_still_reset`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
- Ohio: `retired_official_county_family_and_public_search_surfaces_still_dead_plus_education_inventory_root_only`
- Oklahoma: `official_osde_state_school_directory_clears_education_but_dead_dhhs_locator_host_and_planning_rows_still_block_county_local`
- Oregon: `official_ode_county_searchable_school_directory_clears_education_but_live_office_finder_root_still_has_no_county_extract`
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

## Current Focus State: Alaska

### Blocker Reason

`county_local_disability_resources` is the only remaining Alaska critical blocker. The live DFCS successor host still only gives statewide phone routing, the public DFCS search surface is readable but exposes no DPA office results contract, the current `health.alaska.gov` DPA family is challenge-blocked end to end, and the legacy `dhss.alaska.gov` DPA subtree is also not reviewable even though the root is partially live.

### Exact Evidence Needed

- Any official Alaska surface that maps boroughs or census areas to DPA or Medicaid office locations on a publicly reviewable host.
- Any reviewable successor office locator or directory that lives on `dfcs.alaska.gov`, `dhss.alaska.gov`, or another current official Alaska host instead of only on the challenge-blocked `health.alaska.gov` family.
- Any official document, export, or table that explicitly enumerates Alaska borough or census-area coverage for public assistance office routing.

### Useful Official URLs Already Tried

- [Alaska DFCS Services](https://dfcs.alaska.gov/Pages/Services.aspx)
- [Alaska DFCS Search](https://dfcs.alaska.gov/Search/default.aspx)
- [Alaska DFCS Department Contacts](https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx)
- [Alaska DFCS Publications](https://dfcs.alaska.gov/Pages/Publications.aspx)
- [Alaska DFCS robots.txt](https://dfcs.alaska.gov/robots.txt)
- [Alaska DFCS sitemap.xml](https://dfcs.alaska.gov/sitemap.xml)
- [Alaska Adult Public Assistance leaf](https://health.alaska.gov/en/services/adult-public-assistance-apa/)
- [Alaska Apply for Medicaid leaf](https://health.alaska.gov/en/services/division-of-public-assistance-services/apply-for-medicaid/)
- [Alaska DPA offices directory](https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/)
- [Alaska health robots.txt](https://health.alaska.gov/robots.txt)
- [Legacy DHSS root](https://dhss.alaska.gov/)
- [Legacy DHSS robots.txt](https://dhss.alaska.gov/robots.txt)
- [Legacy DHSS DPA root](https://dhss.alaska.gov/dpa/Pages/default.aspx)
- [Legacy DHSS office locations](https://dhss.alaska.gov/dpa/Pages/office-locations.aspx)
- [Legacy DHSS DPA contacts](https://dhss.alaska.gov/dpa/Pages/contacts.aspx)
- [Legacy DHSS DPA publications](https://dhss.alaska.gov/dpa/Pages/Publications.aspx)

### Top Remaining Source-Scouting Targets

- Any current Alaska host outside the challenged `health.alaska.gov` family that now publishes a borough- or census-area DPA office directory.
- Any official Alaska PDF, spreadsheet, or office-contact table that names specific borough or census-area coverage for public assistance offices.
- Any future public relaxation on either the `health.alaska.gov` or legacy `dhss.alaska.gov` DPA subtree that makes office-routing leaves scraper-reviewable.

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
