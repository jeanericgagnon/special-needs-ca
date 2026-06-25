# Gemini Source Scout Handoff

Updated: 2026-06-25

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, Ohio, Oklahoma, Oregon, Pennsylvania, South Carolina, Tennessee, Texas, Utah, Virginia, Washington, West Virginia, Wisconsin

## Current Blocked States

- Alaska: `reviewed_live_dpa_offices_page_still_only_groups_regions_while_raw_health_host_403_persists_and_dfcs_adds_no_borough_or_census_area_contract`
- Arizona: `ahcccs_university_familycare_pdf_bundle_now_proves_non_contract_support_letters_and_live_public_education_surface_recheck_confirms_three_public_domains_still_lack_role_leaves`
- Idaho: `remaining_idaho_district_roots_now_reduce_to_camas_and_clark_wrong_role_leaves_without_special_education_or_student_services_routing`
- Maine: `official_dhhs_nav_stack_still_exposes_office_addresses_and_labels_but_no_county_or_service_area_contract`
- Massachusetts: `official_dese_export_plus_census_county_subdivision_crosswalk_clears_education_and_reviewed_dds_locality_capture_covers_13_of_14_counties_but_suffolk_remains_unresolved`
- New Hampshire: `official_nh_dhhs_education_and_vr_host_families_still_return_access_denied_shell_and_saved_dhhs_replacement_hosts_remain_dns_dead`
- New Mexico: `official_webed_sharepoint_lists_and_six_public_workbooks_are_live_but_still_expose_no_county_field_or_rec_service_area_contract_and_official_dvr_root_still_returns_401_without_reviewed_public_alternate`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
- Rhode Island: `generic_or_statewide_evidence_used_where_local_required`
- South Dakota: `live_sd_educational_directory_exists_but_local_district_leaves_are_unauthored_and_localoffices_root_has_no_public_county_contract`
- Vermont: `official_ahs_district_jurisdiction_codes_are_public_but_no_reviewable_public_ahs_office_crosswalk_or_service_area_contract_exists`
- Wyoming: `legacy_or_inventory_only_evidence`

## Current Focus State: Idaho

### Blocker Reason

`district_or_county_education_routing` remains the highest-priority Idaho blocker, but the residual district remainder is now down to two districts. Jefferson still clears from district-owned special-education / special-services / section-504 / student-services leaves. Oneida still clears from the district-owned Child Find PDF. Fremont still clears from the public official Apptegy events API. Shoshone now also clears from the district-owned `Early Childhood Find` page, which preserves pre-eligibility screening language for resident 3 to 5-year-old children, developmental-concerns intake language, and district office phone routing on the official host. The two remaining district roots still materialize only wrong-role leaves. Camas only exposes a district-owned `Contact Information` leaf with address and phone. Clark exposes exact district-owned `Contact Us`, `Title IX`, and `Parent Notification of General Education Instruction` leaves, but they only provide generic district office, compliance, or general-education intervention routing. Idaho remains BLOCKED because the remaining district-owned leaves are real but still the wrong role for local special-education routing.

### Exact Evidence Needed

- Any official district-owned special-education, special-services, student-services, 504, procedural-safeguards, or Child Find leaf on Camas or Clark.
- Any district-owned PDF, handbook, or notice on those two hosts that explicitly preserves special-education routing plus named contact information.
- Any official Idaho DHW county-to-office crosswalk, service-area table, export, PDF, ArcGIS layer, or API that ties counties to named office leaves.

### Useful Official URLs Already Tried

- [Camas root](https://www.camascountyschools.org/)
- [Camas Contact Information](https://www.camascountyschools.org/contact-information)
- [Clark root](https://www.clarkcountyschools161.org/)
- [Clark Contact Us](https://www.clarkcountyschools161.org/about-us/contact-us-ccsd)
- [Clark Title IX](https://www.clarkcountyschools161.org/administration/title-ix)
- [Clark Parent Notification of General Education Instruction](https://www.clarkcountyschools161.org/about-us/parent-notification-of-general-education-instruction)
- [Shoshone root](https://shoshonesd.org/)
- [Shoshone Early Childhood Find](https://shoshonesd.org/early-childhood-find/)
- [Oneida Child Find PDF](https://5il.co/26a73)
- [Fremont district events API](https://thrillshare-cmsv2.services.thrillshare.com/api/v4/o/12771/cms/events)

### Top Remaining Source-Scouting Targets

- Any current district-owned special-education, student-services, 504, or procedural-safeguards leaf for Camas or Clark.
- Any district-owned Child Find PDF or special-ed handbook already linked from those two hosts but not yet surfaced on the homepage HTML.
- Any public Idaho DHW county-to-office contract that can reduce the separate county-local blocker.

## Next State Order After Idaho

1. New Mexico
2. Arizona
3. New Hampshire
