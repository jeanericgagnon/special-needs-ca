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
- Minnesota: `mde_description_page_is_live_mdeorg_root_flaps_between_live_glossary_and_radware_child_routes_stay_blocked_plus_mn_dhs_successor_county_tribal_state_directory_is_bot_gated`
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

## Current Focus State: Idaho

### Blocker Reason

Idaho still has two critical blockers, and the highest-priority one remains `district_or_county_education_routing`. The live Bear Lake School District root now exposes an embedded district-owned `Special Education` route, and the exact public leaf at `https://www.blsd.net/en-US/special-education-e92c299d` carries district-specific special-education text, director contact, and IDEA/FAPE/LRE language. That raises Idaho to thirteen reviewed county-grade district-owned education leaves. A fresh bounded recheck on 2026-06-25 then hardened the remainder instead of reopening it broadly: Camas and Oneida returned district-branded 404s on likely special-education or student-services leaves, Shoshone returned WordPress `Page not found` on the same role-bearing guesses, Fremont preserved a live sitemap but no role-bearing URLs and still 404ed likely leaf guesses, Clark page guesses all collapsed to the same `News and Announcements` shell, and Jefferson's sitemap plus likely role-bearing routes collapsed into blank Incapsula-style shells. The county-local blocker remains separate: Idaho DHW still preserves 17 clean exact office replacements plus the Canyon split, but still no public county-to-office contract for the remaining 27 counties.

### Exact Evidence Needed

- Any current official district-owned special-education, special-services, student-services, or procedural-safeguards leaf on the remaining Idaho county-bearing district hosts for Camas, Clark, Fremont, Jefferson, Oneida, or Shoshone.
- Or, any official county-grade Idaho SDE district/export contract that truthfully maps those counties to district-owned education-routing leaves.
- Separately, any official Idaho DHW county-to-office or county-served contract for the 27 counties still blocked on legacy county-local routing.

### Useful Official URLs Already Tried

- [Idaho School Districts directory](https://www.sde.idaho.gov/school-districts/)
- [Bear Lake School District root](https://www.blsd.net/)
- [Bear Lake Special Education leaf](https://www.blsd.net/en-US/special-education-e92c299d)
- [Camas County School District root](https://www.camascountyschools.org)
- [Clark County School District 161 root](https://www.clarkcountyschools161.org/)
- [Fremont County Joint School District #215 root](https://www.sd215.net/)
- [Jefferson School District 251 root](https://www.jeffersonsd251.org/)
- [Oneida School District root](https://www.oneidaschooldistrict.org/)
- [Shoshone School District root](https://shoshonesd.org/)
- [Idaho DHW office root](https://healthandwelfare.idaho.gov/offices)
- [Idaho DHW sitemap](https://healthandwelfare.idaho.gov/sitemap.xml)

### Top Remaining Source-Scouting Targets

- Any exact district-owned local leaf on the remaining uncovered Idaho district hosts that explicitly carries `Special Education`, `Special Services`, `Student Services`, `504`, or procedural-safeguards role text.
- Any official Idaho SDE or district export that yields county-grade education routing without relying on generic statewide fallback.
- Any official Idaho DHW county-to-office contract or county-served metadata on the public office stack.

## Next State Order After Idaho

1. Arizona
2. Massachusetts
3. New Mexico
4. South Dakota
5. Rhode Island
6. Virginia
7. West Virginia
8. North Dakota
9. Wisconsin
10. Washington
