# Gemini Source Scout Handoff

Updated: 2026-06-24

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, Oregon, Pennsylvania, South Carolina, Texas, Utah

## Current Blocked States

- Alaska: `reviewed_live_dpa_offices_page_now_public_but_only_groups_regional_offices_without_borough_or_census_area_assignment_while_dfcs_surfaces_add_no_local_mapping_contract`
- Arizona: `azed_host_challenged_and_ahcccs_county_mapping_requires_reviewed_admin_html_leaves_or_explicit_ocr_artifact`
- Florida: `official_local_offices_leaf_routes_to_partial_family_resource_center_and_current_myaccess_bundle_reexposes_exact_county_endpoints_but_they_remain_authenticated_only`
- Idaho: `reviewed_idaho_district_leaves_hold_at_12_counties_and_remaining_county_bearing_district_roots_now_have_public_sitemap_exhaustion_evidence`
- Maine: `official_maine_selector_and_workbook_are_live_but_current_search_export_posts_still_return_same_500_shell_plus_dhhs_office_html_has_no_county_contract`
- Massachusetts: `exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export`
- Minnesota: `live_mdeorg_root_and_district_page_but_county_contact_and_analytics_routes_are_radware_blocked_plus_mn_dhs_saved_county_tribal_replacements_are_official_404s`
- New Hampshire: `official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable_with_no_live_nh_gov_successor_root`
- New Mexico: `district_leafs_missing_and_county_local_four_county_remainder_persists_after_empty_archive_tail`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
- Ohio: `bounded_live_ohio_education_leaf_probe_recovers_54_strong_and_24_partial_counties_but_10_counties_still_unresolved`
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

## Current Focus State: Ohio

### Blocker Reason

`district_or_county_education_routing` remains the top Ohio blocker. The bounded live same-domain education leaf probe recovered strong exact local education leaves for 54 counties and partial exact local education leaves for 24 more counties from existing Ohio ESC and district-owned roots, but 10 counties still point to dead, unresolvable, transport-broken, or no-leaf roots, so the state still cannot clear county-grade education routing.

### Exact Evidence Needed

- Reviewed exact local education leaves for the remaining unresolved counties, ideally district-owned or ESC-owned pages that explicitly preserve `districts served`, `member districts`, `our schools`, `special education`, or `student services` on the same official host.
- For roots that are dead or unresolvable, a reviewed official successor root or exact replacement local leaf on the real county ESC or district host.
- For roots that are live but generic, a same-domain exact leaf found from sitemap, navigation, or official district/ESC directories.

### Useful Official URLs Already Tried

- [Educational Service Center of Central Ohio](https://www.escco.org/)
- [East Central Ohio ESC](https://www.ecoesc.org/)
- [Northwest Ohio ESC](https://www.nwoesc.org/)
- [Ohio Valley Educational Service Center](https://www.ovesc.org/)
- [Tri-County Educational Service Center](https://www.youresc.k12.oh.us/)
- [Athens Meigs ESC](https://www.athensmeigs.com/)
- [South Central Ohio ESC districts](https://www.scoesc.org/districts)
- [Western Buckeye ESC schools](https://www.wbesc.org/our-schools)
- [Hancock County ESC sitemap leaf](https://www.hancockesc.org/page/schools-we-serve/)
- [Ross Pike ESD sitemap leaf](https://www.rpesd.org/page/special-education/)

### Remaining Unresolved County Roots

- brown => https://www.brown.k12.oh.us
- clermont => https://www.ccesc.org
- columbiana => https://www.ccesc.k12.oh.us
- fairfield => https://www.fairfieldesc.org
- gallia => https://www.gvesc.org
- lawrence => https://www.lawrenceesc.org
- mercer => https://www.merceresc.org
- putnam => https://www.putnamesc.org
- trumbull => https://www.trumbull.k12.oh.us
- vinton => https://www.gvesc.org

## Next State Order After Ohio

1. Minnesota
2. Maine
3. Idaho
4. Arizona
5. Massachusetts
6. New Mexico
7. South Dakota
8. Rhode Island
9. Virginia
10. West Virginia
