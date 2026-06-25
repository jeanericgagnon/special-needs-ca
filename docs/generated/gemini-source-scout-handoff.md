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
- New Mexico: `current_ped_host_timeouts_plus_dead_legacy_education_host_leave_zero_local_education_leaves_and_official_dvr_root_still_returns_401_without_reviewed_public_alternate`
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

## Current Focus State: New Mexico

### Blocker Reason

`district_or_county_education_routing` is now the highest-priority New Mexico blocker. County-local routing no longer blocks the state: the current official HCA `Field Offices` page on `https://www.hca.nm.gov/lookingforassistance/field_offices/` now preserves county-to-office service-area assignments across all 33 counties, clearing the older Catron/Harding/Mora/Union remainder. New Mexico still remains BLOCKED because the education lane is now source-final on the state hosts: the legacy `education.new-mexico.gov` family is unresolvable, the current `webnew.ped.state.nm.us` host family still times out under bounded exact probes, and the packet still preserves zero reviewed district-owned, county-grade, or regional local education leaves on disk. VR remains a secondary blocker because the official DVR root still returns HTTP 401 with no reviewed public alternate.

### Exact Evidence Needed

- Any reviewed district-owned or regional New Mexico special-education, student-services, or exceptional-student leaf that can clear county-grade education routing without relying on the timed-out PED host.
- Any official New Mexico regional-education or district directory artifact on a public host that preserves local routing contact fields for county coverage.
- Any reviewed public alternate official VR / Pre-ETS root that truthfully replaces the current 401 `https://www.dvr.nm.gov/` lane.

### Useful Official URLs Already Tried

- [Current HCA Field Offices](https://www.hca.nm.gov/lookingforassistance/field_offices/)
- [Older HCA Field Offices archive](https://www.hca.nm.gov/lookingforassistance/field_offices_1/)
- [Current PED root](https://webnew.ped.state.nm.us/)
- [PED Special Education Bureau](https://webnew.ped.state.nm.us/bureaus/special-education/)
- [Legacy education host](https://education.new-mexico.gov/)
- [Official DVR root](https://www.dvr.nm.gov/)

### Top Remaining Source-Scouting Targets

- Any district-owned or regional public education leaf for New Mexico that preserves special-education or student-services routing on a live local host.
- Any reviewed public export, directory, or regional crosswalk that clears New Mexico county-grade education routing without returning to the timed-out PED host family.
- Any reviewed public alternate official VR root or public landing page that truthfully replaces the 401 DVR root.

## Next State Order After New Mexico

1. South Dakota
2. Rhode Island
3. Virginia
4. West Virginia
5. North Dakota
6. Wisconsin
7. Washington
8. Tennessee
9. Vermont
10. Wyoming
