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
- Ohio: `live_ohio_county_jfs_directory_now_verifies_88_counties_while_education_inventory_remains_root_only`
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

## Current Focus State: Florida

### Blocker Reason

Florida still has one critical blocker: `county_local_disability_resources`. Reviewed 2026-06-25 bounded live official checks on `https://www.myflfamilies.com/food-cash-and-medical`, `https://familyresourcecenter.myflfamilies.com/providers.csv`, `https://myaccess.myflfamilies.com/`, `https://myaccess.myflfamilies.com/Public/CPCPS`, `https://myaccess.myflfamilies.com/config/appconfig.js`, `https://myaccess.myflfamilies.com/asset-manifest.json`, `https://myaccess.myflfamilies.com/static/js/main.d43b0959.js`, `https://myaccess.myflfamilies.com/dataexchangeproxy`, `https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails`, and `https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch`. The exact official `food-cash-and-medical` leaf still points families to the Family Resource Center lane, whose reviewed `providers.csv` still preserves only 34 distinct county values across 39 rows rather than a 67-county local-office contract. The MyACCESS public lane remains readable: the root, `Public/CPCPS`, `config/appconfig.js`, `asset-manifest.json`, `static/js/main.d43b0959.js`, and `/dataexchangeproxy` all return HTTP 200. Current `appconfig.js` exposes `officeMapping: '/dataexchangeproxy'`, `CreateCBOAccountService: '/dataexchangeproxy'`, and `partnerApproverServices: '/accountmanagement'`. The live main bundle now re-exposes the exact county-result endpoint names `getZipCountyDetails` and `communityPartnerSearch`, but bounded anonymous GET plus POST probes to those endpoints still return HTTP 401 and HTTP 401 with `{"message":"Unauthorized"}`. The public `dataexchangeproxy` root still only replays the same generic shell as the root and `Public/CPCPS`. Florida therefore remains blocked because the storefront lane is still partial and the only exact county-result endpoints still visible on the live official host remain authenticated-only rather than anonymously reviewable.

### Exact Evidence Needed

- A first-party county-complete public local-office contract on the current Florida DCF or MyACCESS stack.
- A public MyACCESS county-result contract that works anonymously, not only behind authenticated endpoints.
- A reviewed first-party Florida local-office or partner-office source that truly covers all 67 counties instead of the current partial Family Resource Center storefront.

### Useful Official URLs Already Tried

- [Florida food, cash, and medical](https://www.myflfamilies.com/food-cash-and-medical)
- [Family Resource Center providers.csv](https://familyresourcecenter.myflfamilies.com/providers.csv)
- [MyACCESS root](https://myaccess.myflfamilies.com/)
- [MyACCESS Public/CPCPS](https://myaccess.myflfamilies.com/Public/CPCPS)
- [MyACCESS appconfig.js](https://myaccess.myflfamilies.com/config/appconfig.js)
- [MyACCESS asset-manifest.json](https://myaccess.myflfamilies.com/asset-manifest.json)
- [MyACCESS main bundle](https://myaccess.myflfamilies.com/static/js/main.d43b0959.js)
- [MyACCESS dataexchangeproxy](https://myaccess.myflfamilies.com/dataexchangeproxy)
- [MyACCESS getZipCountyDetails](https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails)
- [MyACCESS communityPartnerSearch](https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch)

### Top Remaining Source-Scouting Targets

- Any first-party Florida local-office artifact that is county-complete and publicly reviewable without authentication.
- Any public MyACCESS county-result or office-mapping endpoint that no longer requires authenticated access.
- Any official DCF county office or partner office dataset that covers the remaining 33 counties missing from the Family Resource Center storefront.

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

Current Florida next action: hold_county_local_until_first_party_local_offices_lane_is_county_complete_or_a_public_myaccess_county_result_contract_exists.

