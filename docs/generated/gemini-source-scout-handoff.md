# Gemini Source Scout Handoff

Updated: 2026-06-25

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, Ohio, Oklahoma, Oregon, Pennsylvania, South Carolina, Tennessee, Texas, Utah, Virginia, Washington, West Virginia, Wisconsin

## Current Blocked States

- Alaska: `reviewed_live_dpa_offices_page_still_only_groups_regions_while_raw_health_host_403_persists_and_dfcs_adds_no_borough_or_census_area_contract`
- Arizona: `ahcccs_university_familycare_pdf_bundle_now_proves_non_contract_support_letters_and_live_public_education_surface_recheck_confirms_three_public_domains_still_lack_role_leaves`
- Idaho: `remaining_idaho_district_roots_now_reduce_to_camas_and_clark_wrong_role_leaves_without_special_education_or_student_services_routing`
- Maine: `official_dhhs_nav_stack_and_official_maine_search_still_expose_office_addresses_and_labels_but_no_county_or_service_area_contract`
- Massachusetts: `official_dese_export_plus_census_county_subdivision_crosswalk_clears_education_and_reviewed_dds_locality_capture_covers_13_of_14_counties_but_suffolk_remains_unresolved`
- New Hampshire: `official_nh_dhhs_education_and_vr_host_families_still_return_access_denied_shell_and_saved_dhhs_replacement_hosts_remain_dns_dead`
- New Mexico: `official_webed_sharepoint_lists_and_six_public_workbooks_are_live_but_still_expose_no_county_field_or_rec_service_area_contract_and_official_dvr_root_still_returns_401_without_reviewed_public_alternate`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
- Rhode Island: `generic_or_statewide_evidence_used_where_local_required`
- South Dakota: `live_sd_educational_directory_exists_but_local_district_leaves_are_unauthored_and_localoffices_root_has_no_public_county_contract`
- Vermont: `official_ahs_district_jurisdiction_codes_are_public_but_no_reviewable_public_ahs_office_crosswalk_or_service_area_contract_exists`
- Wyoming: `legacy_or_inventory_only_evidence`

## Current Focus State: Maine

### Blocker Reason

`county_local_disability_resources` is still the only remaining Maine critical blocker. One more bounded official pass widened from the DHHS public navigation stack to include the official Maine search host. District Office Locations still preserves office towns, addresses, phones, emails, map shortlinks, and OFI program notes, but no county-served or service-area fields. OFI Contact only loops back to district offices plus statewide eligibility/help routing. OFI Programs & Services stays generic. Offices/Divisions and Administrative Office Locations add office and division labels plus addresses like Family Independence in Augusta and Health Insurance Marketplace in Portland, but still no county routing. The DHHS sitemap only reconfirms the same office leaves. Sampled `Show Map` shortlinks still only resolve to raw Google Maps address geocodes such as `35 Anthony Ave, Augusta, ME 04330` and `19 Maine Ave, Bangor, ME 04401`. And the public `maine.gov/search` query pages stay live but only replay the generic portal shell without county-routing or district-office assignment results. Maine remains BLOCKED because the official host family still proves office addresses and office labels, not county assignment.

### Exact Evidence Needed

- Any official Maine DHHS, OFI, or Maine search-discoverable county/service-area crosswalk that ties counties to the named district office towns on the public DHHS office page.
- Any official Maine DHHS or OFI office export, table, PDF, workbook, ArcGIS layer, or API that exposes office names together with county-served or service-area fields.
- Any official county-grade routing contract on a successor Maine DHHS surface that is public and reviewable without inference.

### Useful Official URLs Already Tried

- [Maine DHHS District Office Locations](https://www.maine.gov/dhhs/about/contact/offices)
- [Maine OFI Contact page](https://www.maine.gov/dhhs/ofi/about-us/contact)
- [Maine OFI Programs & Services](https://www.maine.gov/dhhs/ofi/programs-services)
- [Maine DHHS Offices/Divisions](https://www.maine.gov/dhhs/offices-divisions)
- [Maine DHHS Administrative Office Locations](https://www.maine.gov/dhhs/about/contact/administrative-offices)
- [Maine DHHS Sitemap](https://www.maine.gov/dhhs/about/sitemap)
- [Official Maine Search: Aroostook district office dhhs](https://www.maine.gov/search/?q=Aroostook%20district%20office%20dhhs)
- [Official Maine Search: county district office ofi](https://www.maine.gov/search/?q=county%20district%20office%20ofi)
- [Sample Show Map: Augusta office](https://goo.gl/maps/D71ZqAnXQcp)
- [Sample Show Map: Bangor office](https://goo.gl/maps/LRVMzcdK23Mxx7g29)

### Top Remaining Source-Scouting Targets

- Any official DHHS/OFI workbook or export that contains office names plus county or service-area fields, not just program counts or address maps.
- Any official office-assignment artifact behind the district office page, administrative office page, reports lane, or official Maine search index that binds district offices to counties.

## Next State Order After Maine

1. Idaho
2. New Mexico
3. Arizona
4. New Hampshire
