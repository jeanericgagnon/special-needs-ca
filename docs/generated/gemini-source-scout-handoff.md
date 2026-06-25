# Gemini Source Scout Handoff

Updated: 2026-06-25

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, Ohio, Oklahoma, Oregon, Pennsylvania, South Carolina, Tennessee, Texas, Utah, Virginia, West Virginia

## Current Blocked States

- Alaska: `reviewed_live_dpa_offices_page_still_only_groups_regions_while_raw_health_host_403_persists_and_dfcs_adds_no_borough_or_census_area_contract`
- Arizona: `ahcccs_university_familycare_pdf_bundle_now_proves_non_contract_support_letters_and_live_public_education_surface_recheck_confirms_three_public_domains_still_lack_role_leaves`
- Idaho: `remaining_idaho_district_roots_now_reduce_to_camas_clark_and_shoshone_wrong_role_leaves_without_special_education_or_student_services_routing`
- Maine: `official_dhhs_nav_stack_still_exposes_office_addresses_and_labels_but_no_county_or_service_area_contract`
- Massachusetts: `official_dese_export_plus_census_county_subdivision_crosswalk_clears_education_and_reviewed_dds_locality_capture_covers_13_of_14_counties_but_suffolk_remains_unresolved`
- New Hampshire: `official_nh_dhhs_education_and_vr_host_families_still_return_access_denied_shell_and_saved_dhhs_replacement_hosts_remain_dns_dead`
- New Mexico: `official_webed_sharepoint_lists_and_six_public_workbooks_are_live_but_still_expose_no_county_field_or_rec_service_area_contract_and_official_dvr_root_still_returns_401_without_reviewed_public_alternate`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
- Rhode Island: `generic_or_statewide_evidence_used_where_local_required`
- South Dakota: `live_sd_educational_directory_exists_but_local_district_leaves_are_unauthored_and_localoffices_root_has_no_public_county_contract`
- Vermont: `official_ahs_district_jurisdiction_codes_are_public_but_no_reviewable_public_ahs_office_crosswalk_or_service_area_contract_exists`
- Washington: `official_dshs_local_offices_are_public_but_reviewed_pages_do_not_preserve_a_county_to_office_or_service_area_contract`
- Wisconsin: `generic_or_statewide_evidence_used_where_local_required`
- Wyoming: `legacy_or_inventory_only_evidence`

## Current Focus State: Arizona

### Blocker Reason

Arizona remains BLOCKED on two critical families, but the single highest-priority blocker is still `district_or_county_education_routing`. A bounded live recheck on 2026-06-25 exhausted the final three unresolved public district-owned domains without finding any role-bearing local special-education, student-services, 504, or Child Find leaf. `https://www.ccasdaz.org/` stayed live and its `page-sitemap.xml` and `post-sitemap.xml` stayed public, but they only replayed generic pages and WordPress JSON false positives. `https://www.mohavelearning.org/` stayed live, but the homepage preserved no role terms, `/page/504/`, `/page/special-education/`, and `/page/student-services/` all returned 404, and its public search-results surface still exposed no role-bearing content. `https://www.yavapaicountyhighschool.com/` stayed live, but its sitemap only exposed generic pages and handbook/document leaves, while `/page/504/`, `/page/special-education/`, and `/page/student-services/` all returned 404. Arizona is therefore source-final for the low-token education lane unless one of those district-owned hosts publishes a real local role leaf.

### Exact Evidence Needed

- Any district-owned `special education`, `student services`, `504`, `Child Find`, or equivalent local routing leaf on the final three reviewed public domains:
  - `ccasdaz.org`
  - `mohavelearning.org`
  - `yavapaicountyhighschool.com`
- Any official Arizona county-local office artifact that explicitly maps counties to AHCCCS ALTCS or DES office assignments, rather than just showing statewide contacts or unassigned office cards.
- Any new official HTML or parseable PDF artifact that turns the current Arizona county-local fallback into a real county-to-office contract.

### Useful Official URLs Already Tried

- [Coconino County Accommodation School District](https://www.ccasdaz.org/)
- [CCASD page sitemap](https://www.ccasdaz.org/page-sitemap.xml)
- [CCASD post sitemap](https://www.ccasdaz.org/post-sitemap.xml)
- [Mohave Accelerated Schools](https://www.mohavelearning.org/)
- [Yavapai Accommodation School District](https://www.yavapaicountyhighschool.com/)
- [Yavapai sitemap](https://www.yavapaicountyhighschool.com/sitemap.xml)
- [AHCCCS ALTCS office cards](https://www.azahcccs.gov/members/ALTCSlocations.html)
- [AHCCCS contacts](https://www.azahcccs.gov/shared/AHCCCScontacts.html)
- [ALTCS member resources](https://www.azahcccs.gov/Members/AlreadyCovered/MemberResources/ALTCS.html)

### Top Remaining Source-Scouting Targets

- Any newly published district-owned local special-education, student-services, or 504 leaf on the three exhausted Arizona education hosts.
- Any official Arizona county-to-office assignment artifact on AHCCCS or DES that binds counties to named offices instead of just listing statewide contacts or office cards.
- Any reviewed public replacement for the DES county-local lane if the current Cloudflare-blocked office-locator family later exposes a public county contract.

## Next State Order After Arizona

1. New Hampshire
