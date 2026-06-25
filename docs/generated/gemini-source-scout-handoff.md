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
- Kansas: `current_ksde_directory_roots_and_pdf_url_return_request_rejected_shells_and_exact_submit_replay_is_rejected_while_reviewed_local_district_leaves_cover_only_23_counties`
- Maine: `official_maine_workbook_is_stable_mapping_only_and_contact_materialization_lane_still_500_plus_dhhs_office_html_has_no_county_contract`
- Massachusetts: `exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export`
- Minnesota: `live_mdeorg_root_and_district_page_but_county_contact_and_analytics_routes_are_radware_blocked_plus_mn_dhs_saved_county_tribal_replacements_are_official_404s`
- Nebraska: `public_nebraska_office_config_still_only_references_one_web_map_and_a_closest_feature_output_while_the_feature_service_stops_at_42_offices_for_93_counties`
- New Hampshire: `official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable_with_no_live_nh_gov_successor_root`
- New Mexico: `district_leafs_missing_and_county_local_four_county_remainder_persists_after_empty_archive_tail`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
- Ohio: `live_ohio_jfs_medicaid_and_ohio_gov_roots_plus_robots_and_sitemaps_recover_but_current_directory_search_and_sample_cdjfs_leafs_render_404_while_education_inventory_remains_root_only`
- Oklahoma: `live_okdhs_public_county_widget_only_publishes_adair_and_alfalfa_while_kml_still_yields_only_45_benefit_capable_counties_and_no_contract_for_remaining_32`
- Rhode Island: `generic_or_statewide_evidence_used_where_local_required`
- South Dakota: `live_sd_educational_directory_exists_but_local_district_leaves_are_unauthored_and_localoffices_root_has_no_public_county_contract`
- Tennessee: `generic_or_statewide_evidence_used_where_local_required`
- Utah: `live_utah_dhhs_contacts_and_first_party_wpsl_location_api_only_prove_general_contacts_plus_non_disability_program_location_categories_while_dws_lookup_remains_zip_city_without_any_county_contract`
- Vermont: `generic_or_statewide_evidence_used_where_local_required`
- Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Washington: `generic_or_statewide_evidence_used_where_local_required`
- West Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Wisconsin: `generic_or_statewide_evidence_used_where_local_required`
- Wyoming: `legacy_or_inventory_only_evidence`

## Current Focus State: Minnesota

### Blocker Reason

Minnesota still has two critical blockers, and the highest-priority one remains `district_or_county_education_routing`. The live official picture is now narrower and more accurate: the MDE-ORG description page, glossary root, and `Schools and Districts` route all render publicly on official Minnesota hosts, but the county route, contact-search route, contact-type route, and analytics route still fall into Radware captcha. The separate county-local blocker also shifted: the saved DHS county-and-tribal replacement URLs now return official DHS 404 pages instead of a live captcha family.

### Exact Evidence Needed

- A public first-party Minnesota MDE county, contact, or export route that yields reproducible organization data instead of the current Radware challenge.
- Or, a reviewed public Minnesota MDE download/export lane that preserves county-grade organization routing without browser validation.
- Separately, a live official Minnesota DHS successor for county-and-tribal office routing; the two saved replacements now 404 and no longer provide a usable local-office contract.

### Useful Official URLs Already Tried

- [Minnesota MDE description page](https://education.mn.gov/MDE/about/SchOrg/)
- [Minnesota MDE-ORG root](https://pub.education.mn.gov/MdeOrgView/)
- [Minnesota schools and districts route](https://pub.education.mn.gov/MdeOrgView/districts/index)
- [Minnesota counties route](https://pub.education.mn.gov/MdeOrgView/reference/county)
- [Minnesota contact search route](https://pub.education.mn.gov/MdeOrgView/search/searchContacts)
- [Minnesota contact types route](https://pub.education.mn.gov/MdeOrgView/contact/contactTypeList)
- [Minnesota analytics route](https://pub.education.mn.gov/MDEAnalytics/Data.jsp)
- [Minnesota DHS county and tribal offices replacement](https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices/)
- [Minnesota DHS county tribal nation directory replacement](https://mn.gov/dhs/people-we-serve/adults/services/disability-services/partners-and-providers/county-tribal-nation-directory/)

### Top Remaining Source-Scouting Targets

- Any official Minnesota MDE county, contact, or analytics export surface that stays public and yields real organization data.
- Any first-party Minnesota education export or downloadable organization file linked from the live MDE-ORG family.
- Any official Minnesota DHS successor page for county-and-tribal office routing that replaces the two reviewed 404 paths.

## Next State Order After Minnesota

1. Maine
2. Idaho
3. Arizona
4. Massachusetts
5. New Mexico
6. South Dakota
7. Rhode Island
8. Virginia
9. West Virginia
10. North Dakota
