# Gemini Source Scout Handoff

Updated: 2026-06-25

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, Ohio, Oklahoma, Oregon, Pennsylvania, South Carolina, Texas, Utah

## Current Blocked States

- Alaska: `reviewed_live_dpa_offices_page_now_public_but_only_groups_regional_offices_without_borough_or_census_area_assignment_while_dfcs_surfaces_add_no_local_mapping_contract`
- Arizona: `ahcccs_university_familycare_html_lane_replays_only_pdf_admin_artifacts_and_azed_remaining_three_public_domains_still_lack_role_leaves`
- Idaho: `reviewed_idaho_district_leaves_hold_at_13_counties_after_live_bear_lake_special_education_leaf_and_remaining_county_bearing_district_roots_now_fail_into_404_or_blank_shell_negative_checks`
- Maine: `live_maine_neo_superintendent_selectors_now_materialize_local_rows_but_dhhs_office_html_still_has_no_county_contract`
- Massachusetts: `exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export`
- New Hampshire: `official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable_with_no_live_nh_gov_successor_root`
- New Mexico: `district_leafs_missing_and_county_local_four_county_remainder_persists_after_empty_archive_tail`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
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

`county_local_disability_resources` is the only remaining Maine critical blocker. Reviewed 2026-06-23 live official Maine DHHS District Office Locations page at https://www.maine.gov/dhhs/about/contact/offices. The page preserves district office names, exact office towns and addresses, phones, emails, cross-office program notes, and `Show Map` links for offices such as Bangor, Biddeford, Calais, Caribou, Ellsworth, Machias, Portland, and Skowhegan. But a bounded HTML inspection still exposed zero county names such as Aroostook, Washington, or York, zero county-served labels, and zero service-area fields in the public page itself. The official page therefore remains office-grade evidence without a truthful county-to-office routing contract.

### Exact Evidence Needed

- Any official Maine DHHS county or service-area crosswalk that ties counties to the named district office towns on the public DHHS office page.
- Any official Maine DHHS office export, table, map, PDF, or API that exposes county-served labels or service-area fields for those offices.
- Any official county-grade routing contract on a successor Maine DHHS surface that is public and reviewable without inference.

### Useful Official URLs Already Tried

- [Maine DHHS District Office Locations](https://www.maine.gov/dhhs/about/contact/offices)
- [Maine NEO Superintendent by SAU](https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/SAU)
- [Maine NEO Superintendent by Town](https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town)

### Top Remaining Source-Scouting Targets

- Any official DHHS county/service-area crosswalk for Bangor, Biddeford, Calais, Caribou, Ellsworth, Machias, Portland, Skowhegan, and the other named district office towns.
- Any official export or embedded data source behind the public DHHS office locations page that exposes county assignments.

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
