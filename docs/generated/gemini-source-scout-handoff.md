# Gemini Source Scout Handoff

Updated: 2026-06-25

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, Ohio, Oklahoma, Oregon, Pennsylvania, South Carolina, Texas, Utah

## Current Blocked States

- Alaska: `reviewed_live_dpa_regions_cross_multiple_borough_or_census_area_boundaries_and_raw_health_page_sitemap_robots_search_all_403`
- Arizona: `current_altcs_html_lane_and_ahcccs_universityfamilycare_bundle_remain_non_contract_and_three_reviewed_public_district_domains_still_lack_role_leaves`
- Idaho: `remaining_idaho_district_roots_and_live_sitemaps_still_materialize_only_contact_title_ix_or_generic_leaves_without_special_education_routing`
- Maine: `official_dhhs_office_cross_program_referrals_and_public_county_workbooks_still_expose_no_county_to_office_or_service_area_contract`
- Massachusetts: `official_dese_export_plus_census_county_subdivision_crosswalk_clears_education_and_reviewed_dds_locality_capture_covers_13_of_14_counties_but_suffolk_remains_unresolved`
- New Hampshire: `official_nh_dhhs_education_and_vr_host_families_still_return_access_denied_shell_and_saved_dhhs_replacement_hosts_remain_dns_dead`
- New Mexico: `official_webed_directory_workbooks_are_live_single_sheet_exports_with_no_county_field_or_rec_service_area_contract_and_official_dvr_root_still_returns_401_without_reviewed_public_alternate`
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

## Current Focus State: New Hampshire

### Blocker Reason

`medicaid_state_health_coverage` is the highest-leverage New Hampshire blocker because the same DHHS host-family failure also keeps `medicaid_waiver_hcbs_disability_services`, `developmental_disability_idd_authority`, `early_intervention_part_c`, and `county_local_disability_resources` blocked. A fresh bounded 2026-06-25 recheck confirmed the saved `dhhs.new-hampshire.gov` replacement-host family is still DNS-dead, while `www.dhhs.nh.gov`, `dhhs.nh.gov`, `www.nh.gov/`, `www.nh.gov/dhhs/`, `www.nh.gov/dhhs/contact-us/`, and `www.nh.gov/dhhs/district-offices/` all still return the same short `Access Denied` shell with HTTP 403. Parallel rechecks also confirmed the official education and VR host families still return the same access-denied shell, so New Hampshire remains blocked on live official host families that are public-addressable but not publicly reviewable in the low-token lane.

### Exact Evidence Needed

- Any reviewed public official New Hampshire DHHS successor host that resolves without the `Access Denied` shell and preserves Medicaid, DD, EI, or district-office content.
- Any reviewed public official New Hampshire education directory or district-routing host that resolves without the `Access Denied` shell and exposes county- or district-grade routing.
- Any reviewed public official New Hampshire VR or Pre-ETS host that resolves without the `Access Denied` shell and preserves first-party VR routing.

### Useful Official URLs Already Tried

- [New Hampshire DHHS](https://www.dhhs.nh.gov/)
- [New Hampshire state root](https://www.nh.gov/)
- [New Hampshire DOE](https://www.education.nh.gov/)
- [New Hampshire DOE alternate host](https://my.doe.nh.gov/ehb/)
- [New Hampshire Employment Security](https://www.nhes.nh.gov/)

### Top Remaining Source-Scouting Targets

- Any public successor host or reviewed alternate official root on NH DHHS that avoids the current access-denied shell.
- Any public successor host or reviewed alternate official root on NH education that exposes district-grade routing.
- Any public successor host or reviewed alternate official root on NHES that exposes VR or Pre-ETS routing.

## Next State Order After Arizona

1. Alaska
