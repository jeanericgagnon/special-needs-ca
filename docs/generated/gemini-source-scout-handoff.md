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
- Kansas: `current_ksde_directory_roots_and_pdf_url_return_request_rejected_shells_and_exact_submit_replay_is_rejected_while_reviewed_local_district_leaves_cover_only_22_counties`
- Maine: `official_maine_workbook_is_stable_mapping_only_and_contact_materialization_lane_still_500_plus_dhhs_office_html_has_no_county_contract`
- Massachusetts: `exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export`
- Minnesota: `mdeorg_root_is_live_but_actionable_child_routes_are_title_only_radware_shells_plus_mn_dhs_local_office_family_is_radware_challenged`
- Nebraska: `public_nebraska_office_config_still_only_references_one_web_map_and_a_closest_feature_output_while_the_feature_service_stops_at_42_offices_for_93_counties`
- New Hampshire: `official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable_with_no_live_nh_gov_successor_root`
- New Mexico: `district_leafs_missing_and_county_local_four_county_remainder_persists_after_empty_archive_tail`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
- Ohio: `live_ohio_jfs_medicaid_and_ohio_gov_roots_plus_robots_and_sitemaps_recover_but_current_directory_search_and_sample_cdjfs_leafs_render_404_while_education_inventory_remains_root_only`
- Oklahoma: `live_okdhs_kml_only_yields_45_benefit_capable_counties_while_tanf_only_access_points_and_child_support_only_county_tree_cannot_close_the_remaining_32`
- Rhode Island: `generic_or_statewide_evidence_used_where_local_required`
- South Dakota: `live_sd_educational_directory_exists_but_local_district_leaves_are_unauthored_and_localoffices_root_has_no_public_county_contract`
- Tennessee: `generic_or_statewide_evidence_used_where_local_required`
- Utah: `live_utah_dhhs_contacts_page_recovers_but_explicitly_defers_local_office_info_and_current_dws_office_search_still_limits_public_lookup_to_zip_or_city_without_any_county_contract`
- Vermont: `generic_or_statewide_evidence_used_where_local_required`
- Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Washington: `generic_or_statewide_evidence_used_where_local_required`
- West Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Wisconsin: `generic_or_statewide_evidence_used_where_local_required`
- Wyoming: `legacy_or_inventory_only_evidence`

## Current Focus State: Florida

### Blocker Reason

`county_local_disability_resources` is the only remaining Florida critical blocker. The live DCF local-offices leaf and Family Resource Center storefront still stop at a partial 34-county contract. MyACCESS is readable again, and the live main bundle now re-exposes the exact county-result endpoint names `getZipCountyDetails` and `communityPartnerSearch`, but those exact official endpoints still return HTTP 401 `Unauthorized` on bounded anonymous GET and POST probes. The public `dataexchangeproxy` root still only replays the same generic shell, so there is still no anonymous county-complete public local-office contract.

### Exact Evidence Needed

- A first-party Florida DCF or MyACCESS county-complete local-offices directory or export that maps all 67 counties to public assistance / ESS office routing.
- A recovered anonymous official MyACCESS county-result contract that returns real office or community-partner results without authentication.
- A first-party Family Resource Center or DCF local-office lane that expands beyond the current 34-county storefront contract and publishes the full county set.

### Useful Official URLs Already Tried

- [Florida DCF food-cash-and-medical page](https://www.myflfamilies.com/food-cash-and-medical)
- [Florida Family Resource Center providers.csv](https://familyresourcecenter.myflfamilies.com/providers.csv)
- [MyACCESS root](https://myaccess.myflfamilies.com/)
- [MyACCESS Public CPCPS](https://myaccess.myflfamilies.com/Public/CPCPS)
- [MyACCESS appconfig](https://myaccess.myflfamilies.com/config/appconfig.js)
- [MyACCESS asset manifest](https://myaccess.myflfamilies.com/asset-manifest.json)
- [MyACCESS main bundle](https://myaccess.myflfamilies.com/static/js/main.d43b0959.js)
- [MyACCESS dataexchangeproxy root](https://myaccess.myflfamilies.com/dataexchangeproxy)
- [MyACCESS getZipCountyDetails](https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails)
- [MyACCESS communityPartnerSearch](https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch)

### Top Remaining Source-Scouting Targets

- Any official DCF or MyACCESS export or API path that materially extends the public county-local contract beyond the 34 counties in `providers.csv`.
- Any exact first-party DCF county office page or local-office directory leaf that is linked from current public-assistance pages but not yet exposed in the current public tree.
- Any anonymous result lane on the official MyACCESS host that returns real county storefront or office rows rather than replaying the public shell or requiring authentication.

## Next State Order After Florida

1. Alaska
2. Oklahoma
3. Ohio
4. Minnesota
5. Maine
6. Idaho
7. Arizona
8. Massachusetts
9. New Mexico
10. South Dakota
