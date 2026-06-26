# Gemini Source Scout Handoff

Updated: 2026-06-25

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia, Wisconsin, Wyoming

## Current Blocked States

- Alaska: `reviewed_live_dpa_offices_page_still_only_groups_regions_while_raw_health_host_403_persists_and_dfcs_adds_no_borough_or_census_area_contract`
- Arizona: `official_des_locator_returns_14_explicit_counties_and_greenlee_zip_served_localities_but_no_reviewed_greenlee_county_contract`
- Idaho: `remaining_idaho_camas_and_clark_surfaces_still_reduce_to_wrong_role_contact_board_roster_title_ix_general_education_notice_and_image_only_child_find_lanes_while_live_dhw_sitemap_only_confirms_office_inventory_without_county_contract`
- Maine: `official_dhhs_nav_stack_maine_search_and_ofi_reports_still_expose_office_addresses_labels_or_counts_but_no_county_or_service_area_contract`
- New Hampshire: `official_nh_dhhs_education_and_vr_host_families_plus_diagnostic_robots_sitemaps_still_return_access_denied_shell_and_saved_dhhs_replacement_hosts_remain_dns_dead`
- New Mexico: `official_webed_sharepoint_lists_and_six_public_workbooks_are_live_but_still_expose_no_county_field_or_rec_service_area_contract_and_official_dvr_root_still_returns_401_without_reviewed_public_alternate`
- South Dakota: `current_dhs_host_exposes_no_public_county_or_local_office_contract_for_south_dakota_county_local_disability_routing`

## Current Focus State: Alaska

### Blocker Reason

`county_local_disability_resources` is still the only remaining Alaska blocker, but the truth is now dual-lane rather than challenge-only. The current official DPA offices page on `health.alaska.gov` is publicly readable in the reviewed browser lane and it clearly proves regional offices, office hours, addresses, fax numbers, virtual contact-center routing, secure upload options, and office-city groups such as Homer/Kenai, Fairbanks/Nome, Anchorage/Matanuska-Susitna Valley, Juneau/Ketchikan/Sitka, and Bethel/Kodiak. But it still only groups offices by broad regions and still does not map boroughs or census areas to those offices. In the raw low-token lane, the same health-host family still returns Cloudflare `Just a moment...` 403 shells, so it still offers no reusable raw export or fetch lane. The DFCS successor host remains negative: root, Services, Site Map, Department Contacts, and the live public search page only expose generic navigation results rather than any DPA/public-assistance office directory or county-equivalent assignment contract. Alaska remains BLOCKED because there is still no public official borough- or census-area office-assignment surface.

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
- [DFCS public search: public assistance](https://dfcs.alaska.gov/pages/search.aspx?q=public%20assistance)
- [DFCS public search: office](https://dfcs.alaska.gov/pages/search.aspx?q=office)
- [DFCS public search: medicaid](https://dfcs.alaska.gov/pages/search.aspx?q=medicaid)
- [DFCS public search: adult public assistance](https://dfcs.alaska.gov/pages/search.aspx?q=adult%20public%20assistance)
- [DFCS public search: virtual contact center](https://dfcs.alaska.gov/pages/search.aspx?q=virtual%20contact%20center)

### Top Remaining Source-Scouting Targets

- Any public official borough- or census-area-to-office assignment table on Alaska Department of Health or DFCS.
- Any public official DPA office directory export, API, or PDF that lists explicit borough/census-area coverage.

## Next State Order After Alaska

1. Maine
2. Idaho
3. New Mexico
4. Arizona
5. New Hampshire
