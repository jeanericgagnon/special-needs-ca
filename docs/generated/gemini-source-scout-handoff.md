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

`county_local_disability_resources` remains the highest-priority Alaska blocker. The exact official Alaska DPA offices page on `health.alaska.gov` is still externally reviewable and proves the real office directory exists, but it only groups offices by broad regions like Alaska Peninsula, Northern Alaska, Southcentral Alaska, Southeast Alaska, and Southwest Alaska. It still does not assign boroughs or census areas to those offices. Repo-side raw fetches still return Cloudflare `Just a moment...` 403 shells on the health-host family, and one bounded repo-side Playwright check now also lands on the same challenge shell instead of a reusable office-contract page. The readable DFCS successor pages still expose only statewide phone relays or wrong-role branches rather than any borough-assignment table. Alaska remains BLOCKED because no public official county-equivalent office-assignment contract is currently reviewable or scraper-recoverable.

### Exact Evidence Needed

- Any official Alaska borough- or census-area-to-DPA-office assignment table on `health.alaska.gov`, `dfcs.alaska.gov`, or another current Alaska official host.
- Any official Alaska export, PDF, ArcGIS layer, API, or embedded map data that explicitly maps county-equivalent geographies to named DPA offices.
- Any reviewed official Alaska page that names specific boroughs or census areas under each DPA office rather than only broad regions.

### Useful Official URLs Already Tried

- [DPA offices page](https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/)
- [DPA division root](https://health.alaska.gov/en/division-of-public-assistance/)
- [Adult Public Assistance](https://health.alaska.gov/en/services/adult-public-assistance-apa/)
- [Apply for Medicaid](https://health.alaska.gov/en/services/division-of-public-assistance-services/apply-for-medicaid/)
- [DFCS root](https://dfcs.alaska.gov/Pages/default.aspx)
- [DFCS Services](https://dfcs.alaska.gov/Pages/Services.aspx)
- [DFCS Site Map](https://dfcs.alaska.gov/Pages/Site-Map.aspx)
- [DFCS Department Contacts](https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx)

### Top Remaining Source-Scouting Targets

- Any current official Alaska DPA office map data or page-embedded JSON that materially assigns boroughs or census areas to offices.
- Any current official Alaska PDF or publication that turns the broad regional office list into a county-equivalent assignment contract.
- Any current official Alaska public API, ArcGIS layer, or export behind the DPA directory that can be repo-side verified and cited directly.

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
