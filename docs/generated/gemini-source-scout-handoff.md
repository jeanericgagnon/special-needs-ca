# Gemini Source Scout Handoff

Updated: 2026-06-25

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
- Ohio: `bounded_live_ohio_education_leaf_probe_recovers_45_strong_and_23_partial_counties_but_20_counties_still_unresolved`
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

## Current Focus State: Alaska

### Blocker Reason

`county_local_disability_resources` is the only remaining Alaska critical blocker. The official Department of Health DPA host is no longer only a stale challenge assumption: in the reviewed browser lane, `https://health.alaska.gov/dpa` now renders a live DPA landing page, and the exact DPA offices page at `https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/` is also publicly reviewable. That page now truthfully proves regional offices, office hours, addresses, fax numbers, virtual contact-center routing, and secure upload options on the official host. But it still only groups offices by broad regions and still does not map Alaska boroughs or census areas to those offices. The public DPA dashboard and Medicaid snapshot PDFs are also live, but they only publish region aggregates like Anchorage/Mat-Su, Gulf Coast, Interior, Northern, Southeast, Southwest, Anchorage, and Mat-Su rather than office-assignment geography. The DFCS successor surfaces still add no county-equivalent contract: `Services.aspx` remains phone-only, `Publications.aspx` still exposes no office-routing material, the Site Map still only surfaces wrong-role OCS and Pioneer Homes branches, and public DFCS search still materializes no usable results. Alaska remains BLOCKED because the live DPA offices page still lacks borough- or census-area assignment proof.

### Exact Evidence Needed

- Any official Alaska page, table, PDF, export, or API that explicitly maps boroughs or census areas to DPA office locations.
- Any public detail surface on the current Department of Health DPA host that adds service-area or region-to-borough assignment beyond the regional office groupings now visible.
- Any official borough/census-area office-routing contract on DFCS, Health, or a canonical Alaska successor host that is publicly reviewable without inference.

### Useful Official URLs Already Tried

- [Alaska DPA landing page](https://health.alaska.gov/dpa)
- [Alaska DPA offices directory](https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/)
- [Alaska DPA Dashboard PDF](https://health.alaska.gov/media/b54gx4ic/dpa-dashboard.pdf)
- [Alaska Medicaid enrollment snapshot PDF](https://health.alaska.gov/media/kk5orhkc/medicaid-enrollment-monthly-snapshot.pdf)
- [Alaska DFCS Services](https://dfcs.alaska.gov/Pages/Services.aspx)
- [Alaska DFCS Publications](https://dfcs.alaska.gov/Pages/Publications.aspx)
- [Alaska DFCS Site Map](https://dfcs.alaska.gov/Pages/Site-Map.aspx)
- [Alaska DFCS Search](https://dfcs.alaska.gov/Search/default.aspx)
- [Alaska DFCS Search results endpoint](https://dfcs.alaska.gov/Search/Pages/results.aspx?k=public%20assistance)
- [Alaska Pioneer Homes Payment Assistance Program](https://dfcs.alaska.gov/daph/Pages/paymentassistance/default.aspx)
- [Alaska DAPH publications](https://dfcs.alaska.gov/daph/Pages/publications.aspx)
- [Alaska OCS Regional Offices](https://dfcs.alaska.gov/ocs/Pages/offices/default.aspx)
- [Legacy DHSS DPA root](https://dhss.alaska.gov/dpa/Pages/default.aspx)
- [Legacy DHSS office locations](https://dhss.alaska.gov/dpa/Pages/office-locations.aspx)

### Top Remaining Source-Scouting Targets

- Any current Alaska public page or download that ties named boroughs or census areas to the now-live DPA office locations page.
- Any embedded data source, downloadable attachment, or companion offices table on the live DPA offices page that exposes service areas.
- Any future public Alaska office-routing export on the DPA or DFCS host that materializes county-equivalent assignments instead of only region labels.

## Next State Order After Alaska

1. Oklahoma
2. Ohio
3. Minnesota
4. Maine
5. Idaho
6. Arizona
7. Massachusetts
8. New Mexico
9. South Dakota
10. Rhode Island
