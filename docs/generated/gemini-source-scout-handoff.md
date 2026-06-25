# Gemini Source Scout Handoff

Updated: 2026-06-25

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, Ohio, Oklahoma, Oregon, Pennsylvania, South Carolina, Tennessee, Texas, Utah

## Current Blocked States

- Alaska: `reviewed_live_dpa_regions_cross_multiple_borough_or_census_area_boundaries_and_raw_health_page_sitemap_robots_search_all_403`
- Arizona: `ahcccs_university_familycare_pdf_bundle_now_proves_non_contract_support_letters_and_live_public_education_surface_recheck_confirms_three_public_domains_still_lack_role_leaves`
- Idaho: `remaining_idaho_district_roots_and_live_sitemaps_still_materialize_only_contact_title_ix_or_generic_leaves_without_special_education_routing`
- Maine: `official_dhhs_office_cross_program_referrals_and_public_county_workbooks_still_expose_no_county_to_office_or_service_area_contract`
- Massachusetts: `official_dese_export_plus_census_county_subdivision_crosswalk_clears_education_and_reviewed_dds_locality_capture_covers_13_of_14_counties_but_suffolk_remains_unresolved`
- New Hampshire: `all_reviewed_official_nh_dhhs_education_and_vr_roots_and_likely_nh_gov_successors_still_return_same_access_denied_shell_or_dns_dead`
- New Mexico: `official_webed_directory_rest_list_and_rec_home_are_live_but_expose_no_county_field_or_rec_service_area_contract_and_official_dvr_root_still_returns_401_without_reviewed_public_alternate`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
- Rhode Island: `generic_or_statewide_evidence_used_where_local_required`
- South Dakota: `live_sd_educational_directory_exists_but_local_district_leaves_are_unauthored_and_localoffices_root_has_no_public_county_contract`
- Vermont: `generic_or_statewide_evidence_used_where_local_required`
- Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Washington: `generic_or_statewide_evidence_used_where_local_required`
- West Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Wisconsin: `generic_or_statewide_evidence_used_where_local_required`
- Wyoming: `legacy_or_inventory_only_evidence`

## Current Focus State: New Hampshire

### Blocker Reason

`medicaid_state_health_coverage` remains the top New Hampshire blocker, but the packet is really one host-family failure shared across DHHS, education, county-local, and VR. Reviewed 2026-06-25 one more bounded live pass on the exact official roots, direct agency subdomains, and likely `nh.gov` successors. `https://www.dhhs.nh.gov/`, `https://dhhs.nh.gov/`, `https://www.education.nh.gov/`, `https://education.nh.gov/`, `https://my.doe.nh.gov/ehb/`, `https://www.nhes.nh.gov/`, `https://nhes.nh.gov/`, plus exact `nh.gov` successors like `/dhhs/`, `/dhhs/contact-us/`, `/dhhs/district-offices/`, `/education/`, `/education/doe/`, `/nhes/`, and `/employment/` all still return the same short `Access Denied` shell with HTTP 403. The saved `dhhs.new-hampshire.gov` replacement-host family still fails DNS resolution. New Hampshire therefore stays blocked and not index-safe because no reviewed public official successor host is currently preserved for Medicaid, DD, early intervention, local DHHS routing, education routing, or VR.

### Exact Evidence Needed

- Any reviewed public official DHHS host or exact successor path that materializes real Medicaid, DD, early-intervention, or district-office content instead of the current access-denied shell.
- Any reviewed public official New Hampshire education host or district-directory path that materializes local routing content instead of the current access-denied shell.
- Any reviewed public official NHES or other first-party VR successor path that materializes public VR or Pre-ETS content instead of the current access-denied shell.

### Useful Official URLs Already Tried

- [NH DHHS root](https://www.dhhs.nh.gov/)
- [NH DHHS district offices](https://www.dhhs.nh.gov/contact-us/district-offices)
- [Saved replacement DHHS root](https://dhhs.new-hampshire.gov/)
- [Saved replacement DD path](https://dhhs.new-hampshire.gov/dd)
- [Saved replacement waivers path](https://dhhs.new-hampshire.gov/dd/waivers)
- [Saved replacement early-start path](https://dhhs.new-hampshire.gov/earlystart)
- [NH DOE root](https://www.education.nh.gov/)
- [Alternate DOE host](https://my.doe.nh.gov/ehb/)
- [NH.gov education successor guess](https://www.nh.gov/education/)
- [NHES root](https://www.nhes.nh.gov/)
- [NH.gov NHES successor guess](https://www.nh.gov/nhes/)
- [NH.gov employment successor guess](https://www.nh.gov/employment/)

### Top Remaining Source-Scouting Targets

- Any current public official New Hampshire successor host that has moved outside the reviewed blocked host family.
- Any new public district-office or district-directory export released on a reviewable official host.
- Any new public NHES or VR successor path on a reviewable official host.

## Next State Order After New Hampshire

- Assigned queue exhausted.
