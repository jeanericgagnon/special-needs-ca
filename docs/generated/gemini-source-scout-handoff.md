# Gemini Source Scout Handoff

Updated: 2026-06-25

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, Ohio, Oregon, Pennsylvania, South Carolina, Texas, Utah

## Current Blocked States

- Alaska: `reviewed_live_dpa_offices_page_now_public_but_only_groups_regional_offices_without_borough_or_census_area_assignment_while_dfcs_surfaces_add_no_local_mapping_contract`
- Arizona: `ahcccs_university_familycare_html_lane_replays_only_pdf_admin_artifacts_and_azed_remaining_three_public_domains_still_lack_role_leaves`
- Idaho: `reviewed_idaho_district_leaves_hold_at_13_counties_after_live_bear_lake_special_education_leaf_and_remaining_county_bearing_district_roots_now_fail_into_404_or_blank_shell_negative_checks`
- Maine: `live_maine_neo_superintendent_selectors_now_materialize_local_rows_but_dhhs_office_html_still_has_no_county_contract`
- Massachusetts: `exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export`
- Minnesota: `browser_reviewed_mdeorg_county_and_district_routes_now_clear_education_but_mn_dhs_successor_county_tribal_state_directory_is_still_bot_gated`
- New Hampshire: `official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable_with_no_live_nh_gov_successor_root`
- New Mexico: `district_leafs_missing_and_county_local_four_county_remainder_persists_after_empty_archive_tail`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
- Oklahoma: `live_okdhs_public_county_widget_salvages_alfalfa_but_still_only_publishes_two_rows_while_combined_official_county_local_coverage_stops_at_46_and_leaves_31`
- Rhode Island: `generic_or_statewide_evidence_used_where_local_required`
- South Dakota: `live_sd_educational_directory_exists_but_local_district_leaves_are_unauthored_and_localoffices_root_has_no_public_county_contract`
- Tennessee: `generic_or_statewide_evidence_used_where_local_required`
- Vermont: `generic_or_statewide_evidence_used_where_local_required`
- Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Washington: `generic_or_statewide_evidence_used_where_local_required`
- West Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Wisconsin: `generic_or_statewide_evidence_used_where_local_required`
- Wyoming: `legacy_or_inventory_only_evidence`

## Current Focus State: Maine

### Blocker Reason

Maine no longer has an education blocker. The live official Superintendent-by-SAU and Superintendent-by-Town selectors on the Maine DOE NEO host both materialize real Bangor local superintendent rows with address, phone, fax, and email on bounded replay. The only remaining critical blocker is `county_local_disability_resources`: the official DHHS district office page still lists office towns and contact details but still exposes no county or service-area crosswalk.

### Exact Evidence Needed

- An official DHHS county or service-area crosswalk for office towns like Bangor, Calais, Machias, Portland, or Skowhegan.
- Or, any other official Maine DHHS county-grade office-routing page or export that explicitly assigns counties or service areas to those offices.

### Useful Official URLs Already Tried

- [Maine NEO Primary Contacts By Organization](https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU)
- [Maine NEO Superintendent by SAU](https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/SAU)
- [Maine NEO Town selector](https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town)
- [Maine SAU workbook](https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx)
- [Maine special education landing page](https://www.maine.gov/doe/learning/specialed)
- [Maine DHHS district offices](https://www.maine.gov/dhhs/about/contact/offices)

### Top Remaining Source-Scouting Targets

- Any official DHHS county/service-area crosswalk for the named district-office towns.
- Any official DHHS district-office PDF, spreadsheet, ArcGIS layer, or service-area page that names counties served by Bangor, Calais, Caribou, Ellsworth, Machias, Portland, or Skowhegan.

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
