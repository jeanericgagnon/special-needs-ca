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
- Kansas: `current_ksde_directory_roots_and_pdf_url_return_request_rejected_shells_and_exact_submit_replay_is_rejected_while_reviewed_local_district_leaves_cover_only_18_counties`
- Maine: `official_maine_workbook_is_stable_mapping_only_and_contact_materialization_lane_still_500_plus_dhhs_office_html_has_no_county_contract`
- Massachusetts: `exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export`
- Minnesota: `mdeorg_root_is_live_but_actionable_child_routes_are_title_only_radware_shells_plus_mn_dhs_local_office_family_is_radware_challenged`
- Nebraska: `public_nebraska_office_config_still_only_references_one_web_map_and_a_closest_feature_output_while_the_feature_service_stops_at_42_offices_for_93_counties`
- New Hampshire: `official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable_with_no_live_nh_gov_successor_root`
- New Mexico: `district_leafs_missing_and_county_local_four_county_remainder_persists_after_empty_archive_tail`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
- Ohio: `official_ohio_jfs_medicaid_and_ohio_gov_root_surfaces_all_404_while_education_inventory_root_only`
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

## Current Focus State: Utah

### Blocker Reason

`county_local_disability_resources` is the only remaining Utah critical blocker. The live Utah Schools Directory still clears education, and the official Utah evidence has shifted again: `https://dhhs.utah.gov/contacts/` is publicly reviewable at HTTP 200, but it clearly acts only as a central contacts hub. The page routes community-service discovery to Utah 211, says users can find services by clicking on a county in the map below or using a search bar by type, and later explicitly says `Please visit specific division or program pages for local office information.` The surviving official local-office lane is still the DWS stack: `jobs.utah.gov/department/contact/index.html` still points to an `Office Map`, the redirected `jobs.utah.gov/office-search/` shell is still live, and that current shell now exposes the surviving public lookup rule directly because its footer input placeholder says `Zip Code or City` and its button only routes to `search/<zip-or-city>` or `map`. The public office API still returns office inventory rows, and the public services API still exposes only `All`, `USOR`, and `EC`. No public county endpoint or service-area field materializes on the same host. Utah therefore remains BLOCKED and not index-safe.

### Exact Evidence Needed

- Any public Utah successor directory, export, or leaf set that explicitly maps all 29 counties to local DWS, DHHS, or disability-resource offices.
- Any reviewable Utah division or program page that actually materializes county-local office assignments instead of only central contact information.
- Any public office API field or companion endpoint that adds `county`, `countiesServed`, or equivalent service-area assignments to the current Utah office inventory.

### Useful Official URLs Already Tried

- [Utah Schools Directory](https://schools.utah.gov/schoolsdirectory)
- [Utah DHHS Contacts](https://dhhs.utah.gov/contacts/)
- [DHHS customer service contact form](https://dhhs.utah.gov/customer-service/customer-service-contact-form/)
- [Older DWS public contact page with Office Map link](https://jobs.utah.gov/department/contact/index.html)
- [Legacy DWS office-search alias](https://jobs.utah.gov/jsp/officesearch/)
- [Live DWS Office Search shell](https://jobs.utah.gov/office-search/)
- [Live DWS zip-coded detail route](https://jobs.utah.gov/office-search/search/84713)
- [Public DWS office API](https://officesearch-api.jobs.utah.gov/api/v1/offices)
- [Public DWS services API](https://officesearch-api.jobs.utah.gov/api/v1/services)
- [Missing county endpoint probe](https://officesearch-api.jobs.utah.gov/api/v1/counties)
- [Missing search endpoint probe](https://officesearch-api.jobs.utah.gov/api/v1/search)
- [Missing office-search endpoint probe](https://officesearch-api.jobs.utah.gov/api/v1/offices/search)
- [Utah DHHS WordPress API root](https://dhhs.utah.gov/wp-json/)

### Top Remaining Source-Scouting Targets

- Any public Utah successor leaf or export that materially maps counties to local offices rather than just publishing office inventory.
- Any public companion API artifact that adds `county` or service-area assignments to the current DWS office inventory.
- Any reviewable official Utah division/program office page that preserves local county or service-area coverage on the current DHHS host.
## Next State Order After Utah

1. Kansas
2. Nebraska
3. Nevada
4. Florida
5. Alaska
6. South Carolina
7. North Carolina
8. New York
9. Oklahoma
10. Oregon