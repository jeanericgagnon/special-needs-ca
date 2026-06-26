# Gemini Source Scout Handoff

Updated: 2026-06-26

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

## Current Focus State: Maine

### Blocker Reason

`county_local_disability_resources` is still the only remaining Maine critical blocker. One more bounded official pass widened from the DHHS public navigation stack and official Maine search host to include the live OFI Data & Reports lane. District Office Locations still preserves office towns, addresses, phones, emails, map shortlinks, and OFI program notes, but no county-served or service-area fields. OFI Contact only loops back to district offices plus statewide eligibility/help routing. OFI Programs & Services stays generic. Offices/Divisions and Administrative Office Locations add office and division labels plus addresses like Family Independence in Augusta and Health Insurance Marketplace in Portland, but still no county routing. The DHHS sitemap only reconfirms the same office leaves. Sampled `Show Map` shortlinks still only resolve to raw Google Maps address geocodes such as `35 Anthony Ave, Augusta, ME 04330` and `19 Maine Ave, Bangor, ME 04401`. The live OFI Data & Reports page now also exposes official `Geographic Distribution` and `Geographic Overflow` PDFs plus county and county-and-town spreadsheets, but the reviewed PDFs still contain only county-level and town-level program counts rather than office names, office identifiers, or county-to-office assignments. And the public `maine.gov/search` query pages stay live but only replay the generic portal shell without county-routing or district-office assignment results. Maine remains BLOCKED because the official host family still proves office addresses, labels, and counts, not county assignment.

### Exact Evidence Needed

- Any official Maine DHHS, OFI, or Maine search-discoverable county/service-area crosswalk that ties counties to the named district office towns on the public DHHS office page.
- Any official Maine DHHS or OFI office export, table, PDF, workbook, ArcGIS layer, or API that exposes office names together with county-served or service-area fields.
- Any official county-grade routing contract on a successor Maine DHHS surface that is public and reviewable without inference.

### Useful Official URLs Already Tried

- [Maine DHHS District Office Locations](https://www.maine.gov/dhhs/about/contact/offices)
- [Maine OFI Contact page](https://www.maine.gov/dhhs/ofi/about-us/contact)
- [Maine OFI Programs & Services](https://www.maine.gov/dhhs/ofi/programs-services)
- [Maine OFI Data & Reports](https://www.maine.gov/dhhs/ofi/about-us/data-reports)
- [Maine DHHS Offices/Divisions](https://www.maine.gov/dhhs/offices-divisions)
- [Maine DHHS Administrative Office Locations](https://www.maine.gov/dhhs/about/contact/administrative-offices)
- [Maine DHHS Sitemap](https://www.maine.gov/dhhs/about/sitemap)
- [May 2026 Geographic Distribution Report](https://www.maine.gov/dhhs/sites/maine.gov.dhhs/files/inline-files/MayGEORevisedReport2026%20%28002%29.pdf)
- [May 2026 Geographic Overflow Report](https://www.maine.gov/dhhs/sites/maine.gov.dhhs/files/inline-files/May%202026%20Geographich%20Overflow%20Report.pdf)
- [Official Maine Search: Aroostook district office dhhs](https://www.maine.gov/search/?q=Aroostook%20district%20office%20dhhs)
- [Official Maine Search: county district office ofi](https://www.maine.gov/search/?q=county%20district%20office%20ofi)
- [Sample Show Map: Augusta office](https://goo.gl/maps/D71ZqAnXQcp)
- [Sample Show Map: Bangor office](https://goo.gl/maps/LRVMzcdK23Mxx7g29)

### Top Remaining Source-Scouting Targets

- Any official DHHS/OFI workbook or export that contains office names plus county or service-area fields, not just program counts or address maps.
- Any official office-assignment artifact behind the district office page, OFI Data & Reports lane, administrative office page, or official Maine search index that binds district offices to counties.

## Next State Order After Maine

1. Idaho
2. New Mexico
3. Arizona
4. New Hampshire
