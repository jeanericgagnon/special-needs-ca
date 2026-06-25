# Gemini Source Scout Handoff

Updated: 2026-06-25

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, Ohio, Oklahoma, Oregon, Pennsylvania, South Carolina, Texas, Utah

## Current Blocked States

- Alaska: `raw_health_host_challenge_persists_while_browser_reviewed_dpa_offices_page_still_lacks_borough_or_census_area_assignment_and_dfcs_contacts_add_no_local_contract`
- Arizona: `ahcccs_university_familycare_pdf_bundle_now_proves_non_contract_support_letters_and_azed_remaining_three_public_domains_still_lack_role_leaves`
- Idaho: `remaining_idaho_district_roots_now_split_between_live_homepage_sitemap_surfaces_without_role_bearing_leaves_and_one_blank_shell_challenge_after_bounded_exact_leaf_review`
- Maine: `official_dhhs_office_page_and_same_host_contact_sitemap_surfaces_still_expose_no_county_or_service_area_crosswalk`
- Massachusetts: `official_dese_export_plus_census_county_subdivision_crosswalk_clears_education_but_live_dds_browser_lane_without_raw_county_contract_remains`
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

## Current Focus State: Alaska

### Blocker Reason

`county_local_disability_resources` is the only remaining Alaska critical blocker. One more bounded live check confirmed the health-host DPA family is still not reproducibly fetchable in the raw low-token lane: the exact DPA landing page, DPA offices page, DPA dashboard PDF, and Medicaid snapshot PDF all returned HTTP 403 Cloudflare challenge shells with the title "Just a moment...". The prior browser-reviewed lane still proves the official DPA offices page exists, but that page still only groups offices by broad regions and still does not map Alaska boroughs or census areas to those offices. The DFCS successor host remains public but still adds no county-equivalent contract: `Services.aspx` is still only statewide phone routing, the Site Map still surfaces only wrong-role OCS and Pioneer Homes branches, and the Commissioner Department Contacts page still exposes no DPA/public-assistance office directory or borough-assignment text. Alaska remains BLOCKED because there is still no public official borough- or census-area office assignment surface.

### Exact Evidence Needed

- Any official Alaska page, table, export, PDF, or API that explicitly maps boroughs or census areas to DPA office locations.
- Any public detail surface on the Department of Health host that adds service-area or office-assignment geography beyond the regional office groupings now visible in reviewed rendering.
- Any official DFCS or successor host page that publishes a DPA/public-assistance office directory with borough or census-area routing.

### Useful Official URLs Already Tried

- [Alaska DPA landing page](https://health.alaska.gov/dpa)
- [Alaska DPA offices directory](https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/)
- [Alaska DPA Dashboard PDF](https://health.alaska.gov/media/b54gx4ic/dpa-dashboard.pdf)
- [Alaska Medicaid enrollment snapshot PDF](https://health.alaska.gov/media/kk5orhkc/medicaid-enrollment-monthly-snapshot.pdf)
- [Alaska DFCS Services](https://dfcs.alaska.gov/Pages/Services.aspx)
- [Alaska DFCS Site Map](https://dfcs.alaska.gov/Pages/Site-Map.aspx)
- [Alaska DFCS Department Contacts](https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx)

## Next State Order After Alaska

1. Maine
2. Idaho
3. Arizona
4. Massachusetts
5. New Mexico
6. South Dakota
7. Rhode Island
8. Virginia
9. West Virginia
10. North Dakota
