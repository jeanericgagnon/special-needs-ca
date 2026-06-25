# Gemini Source Scout Handoff

Updated: 2026-06-25

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, Ohio, Oklahoma, Oregon, Pennsylvania, South Carolina, Texas, Utah

## Current Blocked States

- Alaska: `reviewed_live_dpa_offices_page_still_only_groups_regions_while_raw_health_host_403_persists_and_dfcs_adds_no_borough_or_census_area_contract`
- Arizona: `ahcccs_university_familycare_pdf_bundle_now_proves_non_contract_support_letters_and_live_public_education_surface_recheck_confirms_three_public_domains_still_lack_role_leaves`
- Idaho: `remaining_idaho_district_roots_now_reduce_to_wrong_role_contact_or_title_ix_leaves_without_special_education_or_student_services_routing`
- Maine: `official_dhhs_nav_stack_still_exposes_office_addresses_and_labels_but_no_county_or_service_area_contract`
- Massachusetts: `official_dese_export_plus_census_county_subdivision_crosswalk_clears_education_but_live_dds_browser_lane_without_raw_county_contract_remains`
- New Hampshire: `official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable_with_no_live_nh_gov_successor_root`
- New Mexico: `current_ped_host_timeouts_plus_dead_legacy_education_host_leave_zero_local_education_leaves_and_hca_four_county_remainder_persists`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
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

`district_or_county_education_routing` remains the highest-priority Arizona blocker. The final three unresolved district-owned public domains are still `https://www.ccasdaz.org/`, `https://www.mohavelearning.org/`, and `https://www.yavapaicountyhighschool.com/`. One more bounded live pass confirmed all three hosts are still publicly reachable, but their public discovery surfaces still fail closed for role-bearing education routing. CCASDAZ stayed live and its `sitemap.xml`, `page-sitemap.xml`, and `post-sitemap.xml` also stayed live, but all exposed zero same-host special-education, student-services, 504, Child Find, or procedural-safeguards URLs. Mohave Learning stayed live, but its sitemap-like paths still 404 and its public `search-results/` surface still materialized zero role-bearing term hits. Yavapai County High School stayed live, and its `sitemap.xml` plus `documents/` surface also stayed live, but they still exposed zero role-bearing education URLs. Arizona remains BLOCKED because the last three district-owned public domains are real but still do not publish local special-education routing.

### Exact Evidence Needed

- Any district-owned special-education, student-services, special-services, 504, Child Find, or procedural-safeguards leaf on CCASDAZ, Mohave Learning, or Yavapai County High School.
- Any district-owned PDF or document already linked from those hosts that explicitly preserves local special-education routing plus named contact information.
- Any official Arizona county-to-district routing artifact that is more local than the current statewide inventory and can be repo-side verified directly.

### Useful Official URLs Already Tried

- [CCASDAZ root](https://www.ccasdaz.org/)
- [CCASDAZ page sitemap](https://www.ccasdaz.org/page-sitemap.xml)
- [CCASDAZ post sitemap](https://www.ccasdaz.org/post-sitemap.xml)
- [Mohave Learning root](https://www.mohavelearning.org/)
- [Mohave Learning search results](https://www.mohavelearning.org/search-results/)
- [Yavapai County High School root](https://www.yavapaicountyhighschool.com/)
- [Yavapai County High School sitemap](https://www.yavapaicountyhighschool.com/sitemap.xml)
- [Yavapai County High School documents](https://www.yavapaicountyhighschool.com/documents/)

### Top Remaining Source-Scouting Targets

- Any current district-owned role-bearing leaf or document on CCASDAZ, Mohave Learning, or Yavapai County High School that is not visible on the current public root/sitemap/documents/search lane.
- Any current official Arizona county-to-office or county-to-district artifact that can reduce the separate county-local or education blocker without inventing mappings.
- Any current official AHCCCS county-local artifact that is stronger than the current support-letter PDF bundle.

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
