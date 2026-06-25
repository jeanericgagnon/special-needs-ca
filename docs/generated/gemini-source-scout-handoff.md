# Gemini Source Scout Handoff

Updated: 2026-06-25

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, Ohio, Oklahoma, Oregon, Pennsylvania, South Carolina, Texas, Utah

## Current Blocked States

- Alaska: `reviewed_live_dpa_offices_and_dpa_services_pages_still_lack_borough_assignment_while_raw_health_page_sitemap_robots_and_search_all_403`
- Arizona: `ahcccs_university_familycare_pdf_bundle_now_proves_non_contract_support_letters_and_live_public_education_surface_recheck_confirms_three_public_domains_still_lack_role_leaves`
- Idaho: `remaining_idaho_district_roots_and_live_sitemaps_still_materialize_only_wrong_role_or_generic_leaves_without_special_education_routing`
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

`county_local_disability_resources` is the only remaining Maine blocker. The current official Maine DHHS district-office stack is public and reviewable, but it still preserves only office-grade contact proof: district office names, towns, street addresses, phones, emails, map shortlinks, and OFI program links. It does not assign counties to those offices or expose any service-area labels. The OFI contact page, OFI programs-and-services page, Offices/Divisions page, Administrative Office Locations page, and the human-readable DHHS sitemap all stay live, but they still add no county-to-office or county-to-service-area routing contract. The official public county workbooks are real and parse cleanly, but they only preserve beneficiary counts by county and town, not office bindings.

### Exact Evidence Needed

- Any current official Maine DHHS or OFI public page, PDF, export, XLS/XLSX, API, or map data that explicitly assigns counties to DHHS/OFI district offices.
- Any reviewed official county-to-service-area crosswalk on `maine.gov/dhhs` or another current Maine official host that binds a county to a district office or named OFI routing area.
- Any public official successor to the district-office page that preserves county-served or service-area text, not just office addresses.

### Useful Official URLs Already Tried

- [District Office Locations](https://www.maine.gov/dhhs/about/contact/offices)
- [OFI Contact](https://www.maine.gov/dhhs/ofi/about-us/contact)
- [OFI Programs & Services](https://www.maine.gov/dhhs/ofi/programs-services)
- [DHHS Offices/Divisions](https://www.maine.gov/dhhs/offices-divisions)
- [Administrative Office Locations](https://www.maine.gov/dhhs/about/contact/administrative-offices)
- [DHHS human-readable sitemap](https://www.maine.gov/dhhs/about/sitemap)
- [DHHS sitemap.xml guess](https://www.maine.gov/dhhs/about/sitemap.xml)
- [DHHS root sitemap.xml guess](https://www.maine.gov/dhhs/sitemap.xml)
- [OFI county workbook](https://www.maine.gov/dhhs/sites/maine.gov.dhhs/files/inline-files/May%202026%20Summary%20Counts%20By%20County.xlsx)
- [OFI county-and-town workbook](https://www.maine.gov/dhhs/sites/maine.gov.dhhs/files/inline-files/May%202026%20Summary%20Counts%20By%20County%20And%20Town.xlsx)

### Top Remaining Source-Scouting Targets

- Any official Maine surface that names counties under DHHS or OFI district-office coverage.
- Any current Maine DHHS or OFI export/API/workbook that exposes office identifiers or county-to-office bindings instead of counts only.
- Any official successor page that preserves service-area text more specific than office town and address inventory.

## Next State Order After Maine

1. Idaho
2. Arizona
3. Massachusetts
4. New Mexico
5. South Dakota
6. Rhode Island
7. Virginia
8. West Virginia
9. North Dakota
10. Wisconsin
