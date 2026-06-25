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
- Massachusetts: `official_dese_export_plus_census_county_subdivision_crosswalk_clears_education_but_live_dds_locations_lane_still_lacks_county_capture_or_export`
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

## Current Focus State: New Mexico

### Blocker Reason

`district_or_county_education_routing` remains the highest-priority New Mexico blocker. The legacy repo host family `https://education.new-mexico.gov/` is now source-finally dead: exact probes on the root, `/regional`, `/sitemap.xml`, `/robots.txt`, `/special-education/`, and `/districts/` all failed DNS resolution. The current official PED host family still does not yield a reusable local contract in the low-token lane: the packet already had 25-second timeouts on the exact root and Special Education Bureau leaf, and fresh bounded probes on search/API-shaped routes also timed out. The state packet still preserves zero district-owned, county-grade, or regional local education leaves on disk, so New Mexico cannot move without exact local leaf authoring.

### Exact Evidence Needed

- Any district-owned New Mexico special-education, student-services, exceptional-services, or child-find leaf that can replace the current PED fallback for a county row.
- Any official regional education cooperative or county-owned education-routing page that preserves local routing coverage for named New Mexico counties or districts.
- Any current official PED directory, export, or API that returns district-local rows without timing out and can be replayed deterministically from disk.

### Useful Official URLs Already Tried

- [Current PED root](https://webnew.ped.state.nm.us/)
- [Current PED Special Education Bureau](https://webnew.ped.state.nm.us/bureaus/special-education/)
- [Current PED WordPress search API shape](https://webnew.ped.state.nm.us/wp-json/wp/v2/search?search=district)
- [Current PED search page shape](https://webnew.ped.state.nm.us/?s=district)
- [Legacy education root](https://education.new-mexico.gov/)
- [Legacy education regional route](https://education.new-mexico.gov/regional)
- [HCA field offices archive root](https://www.hca.nm.gov/lookingforassistance/field_offices_1/)

### Top Remaining Source-Scouting Targets

- District-owned New Mexico local special-education or student-services leaves by county.
- Regional education cooperative leaves that explicitly preserve local routing for covered New Mexico districts or counties.
- Same-host HCA county office followups only for Catron, Harding, Mora, and Union.

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
