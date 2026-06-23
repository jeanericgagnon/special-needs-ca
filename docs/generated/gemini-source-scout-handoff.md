# Gemini Source Scout Handoff

Updated: 2026-06-23

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, North Carolina, Nevada, New Jersey, Pennsylvania, South Carolina, Texas

## Current Blocked States

- Alaska: `live_dfcs_services_page_only_provides_statewide_phone_relay_while_current_health_and_legacy_dhss_dpa_hosts_stay_gate_blocked`
- Arizona: `three_public_district_domains_official_api_and_exact_slug_sweeps_still_lack_role_leafs_and_altcs_office_cards_still_lack_county_assignments`
- Florida: `official_local_offices_leaf_routes_to_partial_family_resource_center_and_myaccess_public_shell_only_exposes_dataexchangeproxy_shell`
- Idaho: `reviewed_idaho_district_leaves_now_cover_12_counties_and_dhw_split_is_explicit_but_county_grade_remains_incomplete`
- Kansas: `reviewed_kansas_district_and_district_linked_coop_leaves_now_cover_12_counties_but_export_backed_county_grade_coverage_is_still_incomplete`
- Maine: `official_maine_workbook_is_stable_mapping_only_and_contact_materialization_lane_still_500_plus_dhhs_office_html_has_no_county_contract`
- Massachusetts: `exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export`
- Minnesota: `mdeorg_root_is_live_but_actionable_child_routes_are_title_only_radware_shells_plus_mn_dhs_local_office_family_is_radware_challenged`
- Nebraska: `official_public_office_service_root_has_no_tables_and_office_schema_has_no_service_area_fields`
- New Hampshire: `official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable_with_no_live_nh_gov_successor_root`
- New Mexico: `district_leafs_missing_and_county_local_four_county_remainder_persists_after_empty_archive_tail`
- New York: `official_nysed_boces_pages_cover_non_nyc_counties_but_no_reviewed_nyc_borough_route_and_no_public_ldss_replacement`
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

## Current Focus State: New York

### Blocker Reason

New York still has two critical California-grade blockers. Education is no longer a statewide-root problem: the official NYSED Joint Management Teams and District Superintendents pages already cover the 57 non-NYC counties, but no reviewed borough-specific route is on disk yet for Bronx, Kings, New York/Manhattan, Queens, or Richmond. County-local is blocked separately because the old `health.ny.gov` LDSS lane is host-wide 403 and the obvious OTDA replacement host failed with connection resets.

### Exact Evidence Needed

- A reviewed official NYC borough special-education routing contract that covers Bronx, Kings, New York/Manhattan, Queens, and Richmond.
- A public New York county-local replacement for the dead `health.ny.gov/health_care/medicaid/ldss.htm` lane, either as a state-managed replacement locator or county-owned local directory coverage.
- Any official NYC or NYSED district/borough export that directly closes the borough remainder without falling back to generic statewide pages.

### Useful Official URLs Already Tried

- [NYSED Joint Management Teams](https://www.p12.nysed.gov/ds/jmt.html)
- [NYSED District Superintendents Directory](https://www.p12.nysed.gov/ds/superintendents.html)
- [New York health LDSS page](https://www.health.ny.gov/health_care/medicaid/ldss.htm)
- [New York health Medicaid root](https://www.health.ny.gov/health_care/medicaid/)
- [OTDA working families DSS attempt](https://otda.ny.gov/workingfamilies/dss.asp)
- [OTDA working families root](https://otda.ny.gov/workingfamilies/)

### Top Remaining Source-Scouting Targets

- Official NYC DOE borough or district special-education routing pages with clear borough-specific scope.
- Any public New York state or county-owned local assistance directory that truthfully replaces the blocked LDSS host family.
- Any reviewed official export or directory contract that closes the five-borough education remainder without broad browsing.

## Next State Order After North Carolina

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