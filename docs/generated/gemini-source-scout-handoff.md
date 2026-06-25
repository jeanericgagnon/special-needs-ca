# Gemini Source Scout Handoff

Updated: 2026-06-24

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, Nevada, New Jersey, New York, North Carolina, Oregon, Pennsylvania, South Carolina, Texas, Utah

## Current Blocked States

- Alaska: `live_dfcs_services_publications_search_and_site_map_still_expose_no_dpa_or_borough_mapping_and_only_surface_wrong_role_ocs_offices_while_legacy_dhss_dpa_paths_now_canonicalize_into_same_challenged_health_host`
- Arizona: `three_public_district_domains_official_api_and_exact_slug_sweeps_still_lack_role_leafs_and_altcs_office_cards_still_lack_county_assignments`
- Florida: `official_local_offices_leaf_routes_to_partial_family_resource_center_and_current_myaccess_bundle_reexposes_exact_county_endpoints_but_they_remain_authenticated_only`
- Idaho: `reviewed_idaho_district_leaves_hold_at_12_counties_and_remaining_county_bearing_district_roots_now_have_public_sitemap_exhaustion_evidence`
- Kansas: `current_ksde_directory_roots_and_pdf_url_return_request_rejected_shells_and_exact_submit_replay_is_rejected_while_reviewed_local_district_leaves_cover_only_27_counties`
- Maine: `official_maine_selector_and_workbook_are_live_but_current_search_export_posts_still_return_same_500_shell_plus_dhhs_office_html_has_no_county_contract`
- Massachusetts: `exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export`
- Minnesota: `live_mdeorg_root_and_district_page_but_county_contact_and_analytics_routes_are_radware_blocked_plus_mn_dhs_saved_county_tribal_replacements_are_official_404s`
- Nebraska: `public_nebraska_office_config_still_only_references_one_web_map_a_closest_feature_output_and_a_geocoder_county_result_but_no_official_county_assignment_datasource`
- New Hampshire: `official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable_with_no_live_nh_gov_successor_root`
- New Mexico: `district_leafs_missing_and_county_local_four_county_remainder_persists_after_empty_archive_tail`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
- Ohio: `live_ohio_jfs_medicaid_and_ohio_gov_roots_plus_robots_and_sitemaps_recover_but_current_directory_search_and_sample_cdjfs_leafs_render_404_while_education_inventory_remains_root_only`
- Oklahoma: `live_okdhs_public_county_widget_only_publishes_adair_and_alfalfa_while_kml_still_yields_only_45_benefit_capable_counties_and_no_contract_for_remaining_32`
- Rhode Island: `generic_or_statewide_evidence_used_where_local_required`
- South Dakota: `live_sd_educational_directory_exists_but_local_district_leaves_are_unauthored_and_localoffices_root_has_no_public_county_contract`
- Tennessee: `generic_or_statewide_evidence_used_where_local_required`
- Vermont: `generic_or_statewide_evidence_used_where_local_required`
- Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Washington: `generic_or_statewide_evidence_used_where_local_required`
- West Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Wisconsin: `generic_or_statewide_evidence_used_where_local_required`
- Wyoming: `legacy_or_inventory_only_evidence`

## Current Focus State: Florida

### Blocker Reason

`county_local_disability_resources` is the only remaining Florida critical blocker. Florida already has verified statewide Medicaid, waiver, APD regional DD routing, Early Steps, FDLRS special-education dispute coverage, county-grade FDLRS education routing, VR, P&A, PTI, legal-aid, ABLE, and SSI coverage. The remaining county-local family stays blocked because the exact official `food-cash-and-medical` leaf still routes families only into the Family Resource Center storefront lane, and that reviewed first-party `providers.csv` still preserves only 34 distinct county values across 39 rows rather than a 67-county county-local contract. The public MyACCESS shell is readable again and the live main bundle re-exposes the exact county-result endpoint names `getZipCountyDetails` and `communityPartnerSearch`, but bounded anonymous GET and POST probes to those exact official endpoints still return HTTP 401 `Unauthorized`. Florida remains BLOCKED because the storefront lane is still partial and the only exact county-result endpoints now visible on the live official host remain authenticated-only rather than anonymously reviewable.

### Exact Evidence Needed

- A new first-party Florida DCF or MyACCESS county-complete public local-offices contract that covers all 67 counties.
- A newly public anonymous MyACCESS office-mapping result lane that materializes county results without authentication.
- A reviewed first-party Florida county-local directory leaf or export that extends the current Family Resource Center storefront beyond the 34 counties preserved in `providers.csv`.

### Useful Official URLs Already Tried

- [Florida DCF food-cash-and-medical page](https://www.myflfamilies.com/food-cash-and-medical)
- [Florida Family Resource Center root](https://familyresourcecenter.myflfamilies.com/)
- [Florida Family Resource Center providers.csv](https://familyresourcecenter.myflfamilies.com/providers.csv)
- [Florida DCF contact-us page](https://www.myflfamilies.com/contact-us)
- [Florida DCF contacts.csv](https://www.myflfamilies.com/contact-us/contacts.csv)
- [Florida MyACCESS root](https://myaccess.myflfamilies.com/)
- [Florida MyACCESS Public/CPCPS](https://myaccess.myflfamilies.com/Public/CPCPS)
- [Florida MyACCESS appconfig.js](https://myaccess.myflfamilies.com/config/appconfig.js)
- [Florida MyACCESS asset manifest](https://myaccess.myflfamilies.com/asset-manifest.json)
- [Florida MyACCESS main bundle](https://myaccess.myflfamilies.com/static/js/main.d43b0959.js)
- [Florida MyACCESS dataexchangeproxy](https://myaccess.myflfamilies.com/dataexchangeproxy)
- [Florida MyACCESS getZipCountyDetails](https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails)
- [Florida MyACCESS communityPartnerSearch](https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch)

### Top Remaining Source-Scouting Targets

- Any newly public Florida DCF or MyACCESS export or API path that materially extends county-local coverage beyond the 34 counties in `providers.csv`.
- Any reviewed first-party Florida DCF local-office directory that maps counties directly to ACCESS, SNAP, cash, Medicaid, or Economic Self-Sufficiency routing rather than generic circuit or wrong-role contacts.
- Any anonymous MyACCESS county-result contract that returns real county-specific partner or office results without authentication.
## Next State Order After Florida

1. Alaska
2. South Carolina
3. North Carolina
4. New York
5. Oklahoma
6. Oregon
7. Ohio
8. Minnesota
9. Maine
10. Idaho
