# Gemini Source Scout Handoff

Updated: 2026-06-24

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, Oregon, Pennsylvania, South Carolina, Texas, Utah

## Current Blocked States

- Alaska: `reviewed_live_dpa_offices_page_now_public_but_only_groups_regional_offices_without_borough_or_census_area_assignment_while_dfcs_surfaces_add_no_local_mapping_contract`
- Arizona: `ahcccs_university_familycare_html_lane_replays_only_pdf_admin_artifacts_and_azed_remaining_three_public_domains_still_lack_role_leaves`
- Florida: `official_local_offices_leaf_routes_to_partial_family_resource_center_and_current_myaccess_bundle_reexposes_exact_county_endpoints_but_they_remain_authenticated_only`
- Idaho: `reviewed_idaho_district_leaves_hold_at_13_counties_after_live_bear_lake_special_education_leaf_and_remaining_county_bearing_district_roots_still_lack_role_evidence`
- Maine: `official_maine_contact_and_superintendent_selectors_are_live_but_current_bangor_materialization_posts_still_return_same_500_shell_plus_dhhs_office_html_has_no_county_contract`
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

## Current Focus State: Arizona

### Blocker Reason

Arizona still has two critical blockers, and the county-local blocker is now the sharper one. The official AHCCCS oversight page `https://www.azahcccs.gov/Resources/OversightOfHealthPlans/UniversityFamilyCare.html` is public and reviewable, but its county-relevant links only replay the same PDF artifacts already in the blocker lane: `Pima.pdf`, `PimaCountyAdmin.pdf`, and `CountyAdminOffice.pdf`. The current repo/runtime still has no reviewable OCR or PDF text stack for those files. DES remains challenge-blocked on the public office-locator family. Education remains separately blocked, but it is already source-final on the last three public district domains: Coconino, Mohave, and Yavapai still expose no role-bearing local leaves after sitemap, API, and exact-slug replay.

### Exact Evidence Needed

- A committed OCR artifact or other reviewable text extraction for the official AHCCCS county-admin PDFs that truthfully yields county-to-office assignment evidence.
- Or, a new official AHCCCS or DES HTML page that directly exposes county-admin or county-to-office assignment fields in public HTML.
- Separately, any newly published district-owned special-education, special-services, student-services, or 504 leaf on the remaining three Arizona district domains.

### Useful Official URLs Already Tried

- [AHCCCS UniversityFamilyCare oversight page](https://www.azahcccs.gov/Resources/OversightOfHealthPlans/UniversityFamilyCare.html)
- [AHCCCS ALTCS Offices page](https://www.azahcccs.gov/members/ALTCSlocations.html)
- [AHCCCS Contacts page](https://www.azahcccs.gov/shared/AHCCCScontacts.html)
- [AHCCCS ALTCS Member Resources page](https://www.azahcccs.gov/Members/AlreadyCovered/MemberResources/ALTCS.html)
- [AHCCCS CountyAdminOffice PDF](https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/CountyAdminOffice.pdf)
- [AHCCCS PimaCountyAdmin PDF](https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/PimaCountyAdmin.pdf)
- [AHCCCS Pima Community Access Program PDF](https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/Pima.pdf)
- [Coconino County Accommodation School District](https://www.ccasdaz.org/)
- [Mohave Accelerated Schools](https://www.mohavelearning.org/)
- [Yavapai County High School](https://www.yavapaicountyhighschool.com/)

### Top Remaining Source-Scouting Targets

- Any official AHCCCS or DES HTML page that exposes county-admin, county office, counties served, or county-to-office assignment fields directly in public HTML.
- Any committed OCR artifact for the existing official AHCCCS county-admin PDFs.
- Any exact district-owned local leaf on the remaining Coconino, Mohave, or Yavapai district hosts that explicitly carries special-education, special-services, student-services, or 504 role text.

## Next State Order After Arizona

1. Massachusetts
2. New Mexico
3. South Dakota
4. Rhode Island
5. Virginia
6. West Virginia
7. North Dakota
8. Wisconsin
9. Washington
10. Tennessee
