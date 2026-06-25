# Gemini Source Scout Handoff

Updated: 2026-06-25

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, Ohio, Oregon, Pennsylvania, South Carolina, Texas, Utah

## Current Blocked States

- Alaska: `reviewed_live_dpa_offices_page_now_public_but_only_groups_regional_offices_without_borough_or_census_area_assignment_while_dfcs_surfaces_add_no_local_mapping_contract`
- Arizona: `ahcccs_university_familycare_html_lane_replays_only_pdf_admin_artifacts_and_azed_remaining_three_public_domains_still_lack_role_leaves`
- Idaho: `reviewed_idaho_district_leaves_hold_at_13_counties_after_live_bear_lake_special_education_leaf_and_remaining_county_bearing_district_roots_now_fail_into_404_or_blank_shell_negative_checks`
- Maine: `official_maine_contact_and_superintendent_selectors_are_live_but_current_bangor_materialization_posts_still_return_same_500_shell_plus_dhhs_office_html_has_no_county_contract`
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

## Current Focus State: Minnesota

### Blocker Reason

Minnesota no longer has an education blocker. Browser-reviewed official MDE-ORG pages on the public MDE host now provide a county-grade education-routing contract: the public `Schools and Districts` route exposes district listings plus a `Special Education Directors` contact list and extract link, the public `Counties` route lists all 87 Minnesota counties and explicitly says users can click a county name to view all organizations located within that county, county member pages enumerate district members, and district detail leaves preserve superintendent name, email, phone, website, physical address, and county. The only remaining critical blocker is `county_local_disability_resources`: the saved DHS disability-services replacements still 404, and the official shell now points to a named successor county/tribal/state directory route that is itself bot-gated.

### Exact Evidence Needed

- A live official Minnesota DHS county/tribal/state directory route that stays public instead of redirecting into bot protection.
- Or, any other first-party Minnesota DHS county-grade county/tribal office directory that is publicly reviewable without inference.

### Useful Official URLs Already Tried

- [Minnesota MDE description page](https://education.mn.gov/MDE/about/SchOrg/)
- [Minnesota MDE-ORG root](https://pub.education.mn.gov/MdeOrgView/)
- [Minnesota schools and districts route](https://pub.education.mn.gov/MdeOrgView/districts/index)
- [Minnesota counties route](https://pub.education.mn.gov/MdeOrgView/reference/county)
- [Minnesota county member page example](https://pub.education.mn.gov/MdeOrgView/groupTag/members/County?headStateOrganizationId=910001000000)
- [Minnesota district detail example](https://pub.education.mn.gov/MdeOrgView/organization/show/262)
- [Minnesota special education directors list](https://pub.education.mn.gov/MdeOrgView/contact/contactsByContactType?contactRoleTypeCode=SPEC_ED_DIR_Contact)
- [Minnesota DHS county and tribal offices replacement](https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices/)
- [Minnesota DHS county tribal nation directory replacement](https://mn.gov/dhs/people-we-serve/adults/services/disability-services/partners-and-providers/county-tribal-nation-directory/)
- [Minnesota DHS county tribal state directory successor](https://mn.gov/dhs/people-we-serve/adults/health-care/health-care-programs/contact-us/county-tribal-state-offices.jsp)

### Top Remaining Source-Scouting Targets

- Any official Minnesota DHS successor page for county-and-tribal office routing that stays public instead of redirecting into Radware.
- Any first-party DHS county/tribal/state office export, directory, or HTML contact contract that replaces the current bot-gated successor route.

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
