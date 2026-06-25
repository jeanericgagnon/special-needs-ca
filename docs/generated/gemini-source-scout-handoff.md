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

`district_or_county_education_routing` is still the highest-priority Arizona blocker. Reviewed 2026-06-25 one more bounded live pass on the final three district-owned public domains. Coconino County Accommodation School District stayed live, but its public page/post sitemaps and WordPress JSON searches still only replayed false-positive board, employment, and staff records. Mohave Accelerated Schools stayed live, but the homepage preserved no role terms, the exact role pages still 404, the public search-results surface stayed empty, and the sitemap lanes remained unavailable. Yavapai Accommodation School District stayed live, but its sitemap only exposed generic pages plus handbook/document leaves, the `documents/` page preserved no role-bearing content, and the exact `504`, `special-education`, and `student-services` pages still 404. County-local remains separately blocked because the official AHCCCS UniversityFamilyCare PDF bundle is reviewable but only proves non-contract support letters. Arizona therefore stays blocked and not index-safe.

### Exact Evidence Needed

- Any district-owned `special education`, `special services`, `student services`, `504`, or `Child Find` leaf on ccasdaz.org, mohavelearning.org, or yavapaicountyhighschool.com.
- Any official Arizona state or county export that maps the remaining counties to reviewed district routing without relying on generic statewide fallbacks.
- Any official AHCCCS, DES, or county-admin county-to-office assignment artifact for county-local disability resources.

### Useful Official URLs Already Tried

- [Coconino County Accommodation School District root](https://www.ccasdaz.org/)
- [Coconino page sitemap](https://www.ccasdaz.org/page-sitemap.xml)
- [Coconino post sitemap](https://www.ccasdaz.org/post-sitemap.xml)
- [Coconino wp-json special education search](https://www.ccasdaz.org/wp-json/wp/v2/search?search=special%20education&per_page=10)
- [Coconino wp-json 504 search](https://www.ccasdaz.org/wp-json/wp/v2/search?search=504&per_page=20)
- [Mohave Accelerated Schools root](https://www.mohavelearning.org/)
- [Mohave public special-education search results](https://www.mohavelearning.org/search-results/~board/news/post/special-education)
- [Mohave exact 504 page](https://www.mohavelearning.org/page/504/)
- [Yavapai Accommodation School District root](https://www.yavapaicountyhighschool.com/)
- [Yavapai sitemap](https://www.yavapaicountyhighschool.com/sitemap.xml)
- [Yavapai documents page](https://www.yavapaicountyhighschool.com/documents/)
- [Yavapai contact page](https://www.yavapaicountyhighschool.com/page/contact-us/)
- [AHCCCS University Family Care oversight page](https://www.azahcccs.gov/Resources/OversightOfHealthPlans/UniversityFamilyCare.html)
- [Pima Community Access Program PDF](https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/Pima.pdf)
- [Pima County Administrator PDF](https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/PimaCountyAdmin.pdf)
- [County Administrator Office PDF](https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/CountyAdminOffice.pdf)

### Top Remaining Source-Scouting Targets

- Any newly published role-bearing local education leaf on the final three Arizona district-owned domains.
- Any official Arizona export or public table that maps those counties to local district special-education routing.
- Any official AHCCCS, DES, or county-admin county-to-office routing artifact.

## Next State Order After Arizona

1. New Hampshire
