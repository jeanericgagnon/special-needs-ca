# Gemini Source Scout Handoff

Updated: 2026-06-25

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, Ohio, Oklahoma, Oregon, Pennsylvania, South Carolina, Texas, Utah

## Current Blocked States

- Alaska: `reviewed_live_dpa_offices_and_dpa_services_pages_still_lack_borough_assignment_while_raw_health_page_sitemap_robots_and_search_all_403`
- Arizona: `ahcccs_university_familycare_pdf_bundle_now_proves_non_contract_support_letters_and_live_public_education_surface_recheck_confirms_three_public_domains_still_lack_role_leaves`
- Idaho: `remaining_idaho_district_roots_now_reduce_to_wrong_role_contact_or_title_ix_leaves_without_special_education_or_student_services_routing`
- Maine: `official_dhhs_office_pages_and_public_county_workbooks_exist_but_still_expose_no_county_to_office_or_service_area_contract`
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

## Current Focus State: Maine

### Blocker Reason

`county_local_disability_resources` is the highest-priority Maine blocker. The current official Maine DHHS/OFI stack proves that district offices, administrative offices, and OFI county-count reporting are all public and live, but none of those official surfaces actually binds counties to DHHS/OFI office names or service areas. The district-office page preserves office names, towns, addresses, phones, emails, and map shortlinks. The OFI contact/help lane only loops back to that office page plus statewide help routing. The official county and county-plus-town workbooks are real public XLSX files, but they are counts-only artifacts and still contain no office identifiers or county-to-office routing fields.

### Exact Evidence Needed

- Any reviewed official Maine DHHS or OFI page, export, PDF, XLSX, or public API that explicitly assigns one or more counties to a named district office or service area.
- Any current official crosswalk showing how Maine DHHS/OFI district offices map to counties rather than only office addresses, counties, or town counts separately.
- Any public machine-readable office dataset on the Maine host family that adds office identifiers, office regions, or county-served fields to the current office stack.

### Useful Official URLs Already Tried

- [DHHS District Office Locations](https://www.maine.gov/dhhs/about/contact/offices)
- [OFI Contact page](https://www.maine.gov/dhhs/ofi/about-us/contact)
- [OFI Programs & Services](https://www.maine.gov/dhhs/ofi/programs-services)
- [DHHS Offices/Divisions](https://www.maine.gov/dhhs/offices-divisions)
- [Administrative Office Locations](https://www.maine.gov/dhhs/about/contact/administrative-offices)
- [DHHS sitemap](https://www.maine.gov/dhhs/about/sitemap)
- [DHHS sitemap.xml guess](https://www.maine.gov/dhhs/about/sitemap.xml)
- [DHHS root sitemap.xml guess](https://www.maine.gov/dhhs/sitemap.xml)
- [May 2026 Summary Counts By County.xlsx](https://www.maine.gov/dhhs/sites/maine.gov.dhhs/files/inline-files/May%202026%20Summary%20Counts%20By%20County.xlsx)
- [May 2026 Summary Counts By County And Town.xlsx](https://www.maine.gov/dhhs/sites/maine.gov.dhhs/files/inline-files/May%202026%20Summary%20Counts%20By%20County%20And%20Town.xlsx)

### Top Remaining Source-Scouting Targets

- Any official Maine county-to-district-office crosswalk, map layer, or export that binds counties to named DHHS/OFI offices.
- Any official machine-readable office dataset on `maine.gov` that adds county-served, district-office region, or office identifier fields to the current office stack.
- Any public official DHHS/OFI reporting artifact that ties the existing county or county-town counts to office names or district service areas.

## Next State Order After Maine

1. South Dakota
2. Idaho
3. Arizona
4. Massachusetts
5. New Mexico
6. Rhode Island
7. Virginia
8. West Virginia
9. North Dakota
10. Wisconsin
