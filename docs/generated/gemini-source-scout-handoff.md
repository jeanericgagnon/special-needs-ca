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
- Minnesota: `mde_description_page_is_live_but_mdeorg_root_district_county_contact_and_analytics_routes_are_radware_blocked_plus_mn_dhs_successor_county_tribal_state_directory_is_bot_gated`
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

## Current Focus State: Minnesota

### Blocker Reason

Minnesota still has two critical blockers, and the highest-priority one remains `district_or_county_education_routing`. The stricter live official picture is now: the MDE description page is still public, but the MDE-ORG glossary root itself and every actionable child route checked in low-token mode now redirect into Radware captcha. That includes the district, county, contact-search, contact-type, and analytics routes. The separate county-local blocker is also sharper: the saved DHS disability-services replacements still 404, and the official shell now points to a named successor county/tribal/state directory route that is itself bot-gated.

### Exact Evidence Needed

- A public first-party Minnesota MDE root, district, county, contact, or export route that yields reproducible organization data instead of the current Radware challenge.
- Or, a reviewed public Minnesota MDE download/export lane that preserves county-grade organization routing without browser validation.
- Separately, a live official Minnesota DHS county/tribal/state directory route that stays public instead of redirecting into bot protection.

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
- [Minnesota DHS county tribal state directory successor](https://mn.gov/dhs/people-we-serve/adults/health-care/health-care-programs/contact-us/county-tribal-state-offices.jsp)

### Top Remaining Source-Scouting Targets

- Any official Minnesota MDE root, district, county, contact, or analytics export surface that stays public and yields real organization data.
- Any first-party Minnesota education export or downloadable organization file linked from the live MDE-ORG family.
- Any official Minnesota DHS successor page for county-and-tribal office routing that stays public instead of redirecting into Radware.

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
