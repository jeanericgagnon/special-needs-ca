# Gemini Source Scout Handoff

Updated: 2026-06-25

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, Ohio, Oklahoma, Oregon, Pennsylvania, South Carolina, Tennessee, Texas, Utah, Virginia, Washington, West Virginia, Wisconsin

## Current Blocked States

- Alaska: `reviewed_live_dpa_offices_page_still_only_groups_regions_while_raw_health_host_403_persists_and_dfcs_adds_no_borough_or_census_area_contract`
- Arizona: `ahcccs_county_local_contract_still_missing_and_arizona_education_now_resolves_coconino_via_caviat_504_but_mohave_alt_leaf_still_needs_official_county_attachment_and_yavapai_still_lacks_role_leaf`
- Idaho: `remaining_idaho_camas_and_clark_surfaces_now_reduce_to_wrong_role_contact_board_roster_title_ix_or_general_education_notice_leaves_without_special_education_or_student_services_routing`
- Maine: `official_dhhs_nav_stack_and_official_maine_search_still_expose_office_addresses_and_labels_but_no_county_or_service_area_contract`
- Massachusetts: `official_dese_export_plus_census_county_subdivision_crosswalk_clears_education_and_reviewed_dds_locality_capture_covers_13_of_14_counties_but_suffolk_remains_unresolved`
- New Hampshire: `official_nh_dhhs_education_and_vr_host_families_still_return_access_denied_shell_and_saved_dhhs_replacement_hosts_remain_dns_dead`
- New Mexico: `official_webed_sharepoint_lists_and_six_public_workbooks_are_live_but_still_expose_no_county_field_or_rec_service_area_contract_and_official_dvr_root_still_returns_401_without_reviewed_public_alternate`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
- Rhode Island: `generic_or_statewide_evidence_used_where_local_required`
- South Dakota: `live_sd_educational_directory_exists_but_local_district_leaves_are_unauthored_and_localoffices_root_has_no_public_county_contract`
- Vermont: `official_ahs_district_jurisdiction_codes_are_public_but_no_reviewable_public_ahs_office_crosswalk_or_service_area_contract_exists`
- Wyoming: `legacy_or_inventory_only_evidence`

## Current Focus State: Arizona

### Blocker Reason

`district_or_county_education_routing` is still the highest-priority Arizona blocker, but it is no longer a flat three-domain dead end. The official AZ School Report Cards detail API now yields a better Coconino LEA: Coconino Association for Vocation Industry and Technology (`educationOrganizationId 79381`) preserves `https://www.caviat.org/`, and that official district-owned host exposes a live `/page/504/` leaf with annual public nondiscrimination language plus district office contact details, which is enough to attach a local 504 route for Coconino County. Mohave also now has a better alternative official district root: Mohave Valley Elementary District (`educationOrganizationId 4379`) preserves `https://www.mvesd16.org/`, and that host exposes a live `SPECIAL SERVICES` page plus a `documents/special-education/3674` surface. But the bounded official Census geocoder still does not resolve the Mohave Valley address in this lane, so Mohave remains candidate-only rather than county-attached. Yavapai Accommodation School District is still the only fully source-final public domain with no role-bearing local leaf. County-local remains separately blocked because the official AHCCCS support-letter PDFs still do not publish a county-to-office contract. Arizona therefore stays blocked and not index-safe.

### Exact Evidence Needed

- Any official county attachment for the Mohave Valley Elementary alternative root, such as a successful official geocoder match, a county-keyed district export, or another state/county official artifact that ties that district to Mohave County in the review lane.
- Any district-owned `special education`, `special services`, `student services`, `504`, or `Child Find` leaf on yavapaicountyhighschool.com.
- Any official Arizona state or county export that maps Yavapai to local district special-education routing without relying on generic statewide fallbacks.
- Any official AHCCCS, DES, or county-admin county-to-office assignment artifact for county-local disability resources.

### Useful Official URLs Already Tried

- [Coconino Association for Vocation Industry and Technology report-cards detail](https://azreportcards.azed.gov/districts/Detail/79381)
- [CAVIAT root](https://www.caviat.org/)
- [CAVIAT 504 leaf](https://www.caviat.org/page/504/)
- [CAVIAT parents/students page](https://www.caviat.org/information-for-parents-and-students/)
- [Mohave Valley Elementary District report-cards detail](https://azreportcards.azed.gov/districts/Detail/4379)
- [Mohave Valley School District root](https://www.mvesd16.org/)
- [Mohave Valley special-services leaf](https://www.mvesd16.org/page/special-services/)
- [Mohave Valley special-education document surface](https://www.mvesd16.org/documents/special-education/3674)
- [Yavapai Accommodation School District root](https://www.yavapaicountyhighschool.com/)
- [Yavapai sitemap](https://www.yavapaicountyhighschool.com/sitemap.xml)
- [Yavapai documents page](https://www.yavapaicountyhighschool.com/documents/)
- [AHCCCS University Family Care oversight page](https://www.azahcccs.gov/Resources/OversightOfHealthPlans/UniversityFamilyCare.html)
- [County Administrator Office PDF](https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/CountyAdminOffice.pdf)

### Top Remaining Source-Scouting Targets

- Any official artifact that county-attaches Mohave Valley Elementary District to Mohave County in the same bounded review lane.
- Any newly published role-bearing local education leaf on yavapaicountyhighschool.com.
- Any official Arizona county-local office assignment artifact.

## Next State Order After Arizona

1. New Hampshire
