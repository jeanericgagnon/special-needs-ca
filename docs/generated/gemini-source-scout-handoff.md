# Gemini Source Scout Handoff

Updated: 2026-06-25

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, Ohio, Oklahoma, Oregon, Pennsylvania, South Carolina, Texas, Utah

## Current Blocked States

- Alaska: `reviewed_live_dpa_offices_page_now_public_but_only_groups_regional_offices_without_borough_or_census_area_assignment_while_dfcs_surfaces_add_no_local_mapping_contract`
- Arizona: `ahcccs_university_familycare_pdf_bundle_now_proves_non_contract_support_letters_and_azed_remaining_three_public_domains_still_lack_role_leaves`
- Idaho: `remaining_idaho_district_roots_now_split_between_live_homepage_sitemap_surfaces_without_role_bearing_leaves_and_one_blank_shell_challenge_after_bounded_exact_leaf_review`
- Maine: `official_dhhs_office_page_and_same_host_contact_sitemap_surfaces_still_expose_no_county_or_service_area_crosswalk`
- Massachusetts: `exact_dese_hidden_postback_replay_materializes_district_rows_but_zero_county_contract_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export`
- New Hampshire: `official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable_with_no_live_nh_gov_successor_root`
- New Mexico: `district_leafs_missing_and_county_local_four_county_remainder_persists_after_empty_archive_tail`
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

`district_or_county_education_routing` remains the highest-priority Arizona blocker. The live packet truth held up under one more bounded exact-host recheck on 2026-06-25: the final three unresolved district domains are still `https://www.ccasdaz.org/`, `https://www.mohavelearning.org/`, and `https://www.yavapaicountyhighschool.com/`. Coconino stayed live at the district root and its official WordPress JSON search, page sitemap, post sitemap, and sitemap index all still returned 200, but none exposed a role-bearing `special education`, `student services`, `special services`, or `504` leaf. Mohave stayed live at the district root and site map, but the exact Finalsite-style role candidates `/fs/pages/504`, `/fs/pages/special-education`, `/fs/pages/student-services`, and `/fs/pages/special-services` still all returned 404. Yavapai stayed live at the district root and `/page/contact-us/`, proving the public `/page/` namespace is real, but `/page/special-education/`, `/page/student-services/`, and `/page/504/` still all returned 404 while the sitemap still only exposed handbook and generic student-document URLs.

### Exact Evidence Needed

- Any district-owned Arizona leaf on `ccasdaz.org`, `mohavelearning.org`, or `yavapaicountyhighschool.com` that explicitly preserves `special education`, `student services`, `special services`, `504`, or parent-rights/procedural-safeguards routing.
- Any exact same-host sitemap, API, or page-namespace leaf on those three domains that carries role-bearing local education contact or department content.
- Any newly published official county-owned or district-owned local education-routing leaf for Coconino, Mohave, or Yavapai that can replace the current empty-domain blocker.

### Useful Official URLs Already Tried

- [Arizona School Report Cards API](https://azreportcards.azed.gov/api/Entity/GetEntityList)
- [Coconino County Accommodation School District root](https://www.ccasdaz.org/)
- [Coconino WordPress JSON search](https://www.ccasdaz.org/wp-json/wp/v2/search?search=special%20education&per_page=10)
- [Coconino page sitemap](https://www.ccasdaz.org/page-sitemap.xml)
- [Coconino post sitemap](https://www.ccasdaz.org/post-sitemap.xml)
- [Mohave Accelerated Schools root](https://www.mohavelearning.org/)
- [Mohave site map](https://www.mohavelearning.org/site-map)
- [Mohave exact role slugs](https://www.mohavelearning.org/fs/pages/special-education)
- [Yavapai Accommodation School District root](https://www.yavapaicountyhighschool.com/)
- [Yavapai contact page](https://www.yavapaicountyhighschool.com/page/contact-us/)
- [Yavapai sitemap](https://www.yavapaicountyhighschool.com/sitemap.xml)

### Top Remaining Source-Scouting Targets

- Any newly published district-owned special-education, student-services, or 504 leaf on Coconino, Mohave, or Yavapai.
- Any exact role-bearing leaf on those hosts that appears through their public sitemap, WordPress API, or `/page/`/`/fs/pages/` namespaces.
- Any county-owned local education-routing leaf for those counties that becomes public and reviewable without relying on the challenged AZED host.

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
