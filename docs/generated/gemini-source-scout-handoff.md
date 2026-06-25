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

## Current Focus State: Massachusetts

### Blocker Reason

`district_or_county_education_routing` remains the highest-priority Massachusetts blocker, but the exact DESE truth is now corrected. The official `search_link.aspx` bridge still auto-posts into `search.aspx`, and a fresh exact replay of that hidden payload still renders real district rows with superintendent and grades-served data. But the rendered result surface still has zero county column, zero county filter, and no county-keyed export contract. The separate live `get_closest_orgs.aspx` School Finder is still address/city/town based only. County-local remains separately blocked because the DDS locations and interactive-map pages are still raw-403 in the low-token lane and still lack a county export or county crosswalk.

### Exact Evidence Needed

- Any official DESE county-to-district contract, county selector, county column, or county-keyed export.
- Any official DDS county crosswalk, county-served export, or machine-readable county-to-office contract.
- Or, a reviewed browser/cached locality capture from DESE or DDS that can be truthfully bridged to counties.

### Useful Official URLs Already Tried

- [DESE district-directory bridge](https://profiles.doe.mass.edu/search/search_link.aspx?orgType=5,12&runOrgSearch=Y&leftNavId=11238)
- [DESE Profiles Search results](https://profiles.doe.mass.edu/search/search.aspx?leftNavId=11238)
- [DESE School Finder](https://profiles.doe.mass.edu/search/get_closest_orgs.aspx)
- [DDS org page](https://www.mass.gov/orgs/department-of-developmental-services)
- [DDS locations index](https://www.mass.gov/orgs/department-of-developmental-services/locations)
- [DDS interactive regional map](https://www.mass.gov/info-details/interactive-dds-regional-map)

### Top Remaining Source-Scouting Targets

- Any official Massachusetts county-keyed DESE export or selector.
- Any official DDS county crosswalk or locality export that can be bridged to county rows without inference.
- Any reviewed browser/cached locality capture from DESE or DDS that preserves county-safe routing evidence.

## Next State Order After Massachusetts

1. New Mexico
2. South Dakota
3. Rhode Island
4. Virginia
5. West Virginia
6. North Dakota
7. Wisconsin
8. Washington
9. Tennessee
10. Vermont
