# Gemini Source Scout Handoff

Updated: 2026-06-25

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, South Carolina, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia, Wisconsin

## Current Blocked States

- Alaska: `reviewed_live_dpa_offices_page_still_only_groups_regions_while_raw_health_host_403_persists_and_dfcs_adds_no_borough_or_census_area_contract`
- Arizona: `ahcccs_county_local_contract_still_missing_and_arizona_education_now_resolves_coconino_via_caviat_504_but_mohave_alt_leaf_still_needs_official_county_attachment_and_yavapai_still_lacks_role_leaf`
- Idaho: `remaining_idaho_camas_and_clark_surfaces_now_reduce_to_wrong_role_contact_board_roster_title_ix_or_general_education_notice_leaves_without_special_education_or_student_services_routing`
- Maine: `official_dhhs_nav_stack_and_official_maine_search_still_expose_office_addresses_and_labels_but_no_county_or_service_area_contract`
- Massachusetts: `official_dese_export_plus_census_county_subdivision_crosswalk_clears_education_and_reviewed_dds_locality_capture_covers_13_of_14_counties_but_suffolk_remains_unresolved`
- New Hampshire: `official_nh_dhhs_education_and_vr_host_families_plus_diagnostic_robots_sitemaps_still_return_access_denied_shell_and_saved_dhhs_replacement_hosts_remain_dns_dead`
- New Mexico: `official_webed_sharepoint_lists_and_six_public_workbooks_are_live_but_still_expose_no_county_field_or_rec_service_area_contract_and_official_dvr_root_still_returns_401_without_reviewed_public_alternate`
- Rhode Island: `generic_or_statewide_evidence_used_where_local_required`
- South Dakota: `current_dhs_host_exposes_no_public_county_or_local_office_contract_for_south_dakota_county_local_disability_routing`
- Wyoming: `wde_idea_evidence_is_now_public_but_no_reviewable_county_to_district_special_education_crosswalk_or_disability_specific_county_resource_contract`
## Current Focus State: New Hampshire

### Blocker Reason

`medicaid_state_health_coverage` is the highest-priority New Hampshire blocker because the same official host-family failure still blocks Medicaid, waiver, DD, early-intervention, and county-local routing together. Reviewed 2026-06-25 bounded exact first-party rechecks across the saved `dhhs.new-hampshire.gov` replacement-host family, the direct `dhhs.nh.gov` agency subdomain family, and the likely public `nh.gov` successor family. The current-looking saved replacement roots still fail DNS resolution. The direct DHHS roots and exact `/dhhs` successor roots still return the same short `Access Denied` shell with HTTP 403. One more bounded diagnostic pass now shows that even `https://www.dhhs.nh.gov/robots.txt`, `https://www.dhhs.nh.gov/sitemap.xml`, `https://www.nh.gov/dhhs/robots.txt`, and `https://www.nh.gov/dhhs/sitemap.xml` return the same short 403 shell, so no public successor or export lane is currently preserved on the official DHHS family. Education remains separately blocked because `education.nh.gov`, `www.education.nh.gov`, exact district-directory leaves, `my.doe.nh.gov/ehb/`, and the obvious `nh.gov` education successors all still return that same shell. VR remains separately blocked because the NHES roots, the BVR disabilities path, and the likely `nh.gov` successors still return the same 403 shell or do not resolve. New Hampshire therefore stays BLOCKED and not index-safe.

### Exact Evidence Needed

- Any reviewed public official New Hampshire DHHS host that actually renders Medicaid, DD, waiver, early-intervention, or district-office content instead of the Access Denied shell.
- Any public official district-office or county-export surface on the DHHS family that provides real county or district-office routing.
- Any reviewed public official New Hampshire education directory or district-profile surface that returns district- or county-grade routing instead of the Access Denied shell.
- Any reviewed public official New Hampshire VR or BVR surface that loads publicly instead of the same blocked shell.

### Useful Official URLs Already Tried

- [DHHS root](https://www.dhhs.nh.gov/)
- [DHHS root without www](https://dhhs.nh.gov/)
- [DHHS robots.txt](https://www.dhhs.nh.gov/robots.txt)
- [DHHS sitemap.xml](https://www.dhhs.nh.gov/sitemap.xml)
- [saved replacement root](https://dhhs.new-hampshire.gov/)
- [saved DD replacement root](https://dhhs.new-hampshire.gov/dd)
- [saved waiver replacement root](https://dhhs.new-hampshire.gov/dd/waivers)
- [saved early-intervention replacement root](https://dhhs.new-hampshire.gov/earlystart)
- [nh.gov DHHS successor root](https://www.nh.gov/dhhs/)
- [nh.gov DHHS robots.txt](https://www.nh.gov/dhhs/robots.txt)
- [nh.gov DHHS sitemap.xml](https://www.nh.gov/dhhs/sitemap.xml)
- [nh.gov DHHS contact-us](https://www.nh.gov/dhhs/contact-us/)
- [nh.gov DHHS district offices](https://www.nh.gov/dhhs/district-offices/)
- [Education root](https://www.education.nh.gov/)
- [Education root without www](https://education.nh.gov/)
- [nh.gov Education successor](https://www.nh.gov/education/)
- [nh.gov Education DOE successor](https://www.nh.gov/education/doe/)
- [DOE alternate host](https://my.doe.nh.gov/ehb/)
- [NHES root](https://www.nhes.nh.gov/)
- [NHES root without www](https://nhes.nh.gov/)
- [NHES successor root](https://www.nh.gov/nhes/)
- [nh.gov employment successor](https://www.nh.gov/employment/)

### Top Remaining Source-Scouting Targets

- Any newly public official NH DHHS successor host or export that resolves without the Access Denied shell.
- Any official New Hampshire education directory, profile export, or district-routing surface that becomes publicly reviewable on the current host family.
- Any official New Hampshire VR or BVR surface that becomes publicly reviewable on the current host family.

## Next State Order After New Hampshire

1. None remaining in assigned sequence
