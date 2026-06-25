# Gemini Source Scout Handoff

Updated: 2026-06-25

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, Ohio, Oklahoma, Oregon, Pennsylvania, South Carolina, Tennessee, Texas, Utah, Virginia, West Virginia

## Current Blocked States

- Alaska: `reviewed_live_dpa_offices_page_still_only_groups_regions_while_raw_health_host_403_persists_and_dfcs_adds_no_borough_or_census_area_contract`
- Arizona: `ahcccs_university_familycare_pdf_bundle_now_proves_non_contract_support_letters_and_live_public_education_surface_recheck_confirms_three_public_domains_still_lack_role_leaves`
- Idaho: `remaining_idaho_district_roots_and_live_sitemaps_still_materialize_only_contact_title_ix_or_generic_leaves_without_special_education_routing`
- Maine: `official_dhhs_office_cross_program_referrals_and_public_county_workbooks_still_expose_no_county_to_office_or_service_area_contract`
- Massachusetts: `official_dese_export_plus_census_county_subdivision_crosswalk_clears_education_and_reviewed_dds_locality_capture_covers_13_of_14_counties_but_suffolk_remains_unresolved`
- New Hampshire: `official_nh_dhhs_education_and_vr_host_families_still_return_access_denied_shell_and_saved_dhhs_replacement_hosts_remain_dns_dead`
- New Mexico: `official_webed_directory_rest_list_and_rec_home_are_live_but_expose_no_county_field_or_rec_service_area_contract_and_official_dvr_root_still_returns_401_without_reviewed_public_alternate`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
- Rhode Island: `generic_or_statewide_evidence_used_where_local_required`
- South Dakota: `live_sd_educational_directory_exists_but_local_district_leaves_are_unauthored_and_localoffices_root_has_no_public_county_contract`
- Vermont: `official_ahs_district_jurisdiction_codes_are_public_but_no_reviewable_public_ahs_office_crosswalk_or_service_area_contract_exists`
- Washington: `official_dshs_local_offices_are_public_but_reviewed_pages_do_not_preserve_a_county_to_office_or_service_area_contract`
- Wisconsin: `generic_or_statewide_evidence_used_where_local_required`
- Wyoming: `legacy_or_inventory_only_evidence`

## Current Focus State: Alaska

### Blocker Reason

`county_local_disability_resources` is still the only remaining Alaska blocker, but the truth is now dual-lane rather than challenge-only. The current official DPA offices page on `health.alaska.gov` is publicly readable in the reviewed browser lane and it clearly proves regional offices, office hours, addresses, fax numbers, virtual contact-center routing, and secure upload options. But it still only groups offices by broad regions and still does not map boroughs or census areas to those offices. In the raw low-token lane, the same health-host family still returns Cloudflare `Just a moment...` 403 shells, so it still offers no reusable raw export or fetch lane. The DFCS successor host remains negative: root, Services, Site Map, Department Contacts, and bounded search-result guesses still expose no DPA/public-assistance office directory or county-equivalent assignment contract. Alaska remains BLOCKED because there is still no public official borough- or census-area office-assignment surface.

### Exact Evidence Needed

- Any official Alaska page, table, export, PDF, API, or directory that explicitly maps boroughs or census areas to DPA office locations.
- Any public detail surface on the current Department of Health DPA host that adds service-area or region-to-borough assignment beyond the regional office groupings now visible.
- Any official DFCS or Department of Health directory leaf that directly names borough/census-area coverage for public-assistance offices.

### Useful Official URLs Already Tried

- [Alaska DPA offices page](https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/)
- [Alaska DPA landing page](https://health.alaska.gov/en/division-of-public-assistance/)
- [Alaska DPA dashboard PDF](https://health.alaska.gov/media/b54gx4ic/dpa-dashboard.pdf)
- [Alaska Medicaid enrollment snapshot PDF](https://health.alaska.gov/media/kk5orhkc/medicaid-enrollment-monthly-snapshot.pdf)
- [DFCS root](https://dfcs.alaska.gov/Pages/default.aspx)
- [DFCS Services](https://dfcs.alaska.gov/Pages/Services.aspx)
- [DFCS Site Map](https://dfcs.alaska.gov/Pages/Site-Map.aspx)
- [DFCS Department Contacts](https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx)
- [DFCS search guess](https://dfcs.alaska.gov/Pages/search-results.aspx?k=public%20assistance)
- [DFCS search guess](https://dfcs.alaska.gov/Pages/search-results.aspx?k=office)
- [DFCS search guess](https://dfcs.alaska.gov/Pages/search-results.aspx?k=medicaid)
- [DFCS search guess](https://dfcs.alaska.gov/Pages/search-results.aspx?k=adult%20public%20assistance)

### Top Remaining Source-Scouting Targets

- Any public official borough- or census-area-to-office assignment table on Alaska Department of Health or DFCS.
- Any public official DPA office directory export, API, or PDF that lists explicit borough/census-area coverage.

## Next State Order After Alaska

1. Maine
2. Idaho
3. Arizona
4. Massachusetts
5. New Mexico
6. South Dakota
7. Rhode Island
8. North Dakota
9. Wisconsin
10. Washington
