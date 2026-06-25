# Gemini Source Scout Handoff

Updated: 2026-06-25

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, Ohio, Oklahoma, Oregon, Pennsylvania, South Carolina, Tennessee, Texas, Utah

## Current Blocked States

- Alaska: `reviewed_live_dpa_regions_cross_multiple_borough_or_census_area_boundaries_and_raw_health_page_sitemap_robots_search_all_403`
- Arizona: `current_altcs_html_lane_and_ahcccs_universityfamilycare_bundle_remain_non_contract_and_three_reviewed_public_district_domains_still_lack_role_leaves`
- Idaho: `remaining_idaho_district_roots_and_live_sitemaps_still_materialize_only_contact_title_ix_or_generic_leaves_without_special_education_routing`
- Maine: `official_dhhs_office_cross_program_referrals_and_public_county_workbooks_still_expose_no_county_to_office_or_service_area_contract`
- Massachusetts: `official_dese_export_plus_census_county_subdivision_crosswalk_clears_education_and_reviewed_dds_locality_capture_covers_13_of_14_counties_but_suffolk_remains_unresolved`
- New Hampshire: `official_nh_dhhs_education_and_vr_host_families_still_return_access_denied_shell_and_saved_dhhs_replacement_hosts_remain_dns_dead`
- New Mexico: `official_webed_directory_workbooks_are_live_single_sheet_exports_with_no_county_field_or_rec_service_area_contract_and_official_dvr_root_still_returns_401_without_reviewed_public_alternate`
- North Dakota: `generic_or_statewide_evidence_used_where_local_required`
- Rhode Island: `generic_or_statewide_evidence_used_where_local_required`
- South Dakota: `live_sd_educational_directory_exists_but_local_district_leaves_are_unauthored_and_localoffices_root_has_no_public_county_contract`
- Vermont: `generic_or_statewide_evidence_used_where_local_required`
- Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Washington: `generic_or_statewide_evidence_used_where_local_required`
- West Virginia: `generic_or_statewide_evidence_used_where_local_required`
- Wisconsin: `generic_or_statewide_evidence_used_where_local_required`
- Wyoming: `legacy_or_inventory_only_evidence`

## Current Focus State: Maine

### Blocker Reason

`county_local_disability_resources` is the only Maine blocker left. The live official DHHS district office lane is stronger than a simple missing-page assumption: `https://www.maine.gov/dhhs/about/contact/offices` preserves real district office names, street addresses, phones, emails, Google Maps shortlinks, and program-specific office handoffs such as Bangor long-term-care questions routing to Machias and Farmington child-support questions routing to Lewiston. But that same reviewed public stack also proves why Maine is still blocked: it exposes zero county-served labels, zero service-area fields, and zero county-to-office assignment metadata. The companion OFI contact/help pages, Offices/Divisions page, Administrative Office Locations page, sitemap surfaces, and live county-count workbooks all stay public, but they still only add office addresses, statewide help routing, or county/town counts without binding those counties or towns to DHHS/OFI office responsibility.

### Exact Evidence Needed

- Any current official Maine DHHS or OFI page, export, workbook, API, ArcGIS layer, or service-area table that explicitly maps counties to district offices or office service areas.
- Any current official Maine county-to-office or county-to-program routing contract that names which district office serves each county.
- Any public machine-readable office field that binds office IDs, office names, or office regions to county names instead of just listing office addresses or county counts.

### Useful Official URLs Already Tried

- [Maine DHHS District Office Locations](https://www.maine.gov/dhhs/about/contact/offices)
- [Maine OFI Contact Us](https://www.maine.gov/dhhs/ofi/about-us/contact)
- [Maine OFI Programs & Services](https://www.maine.gov/dhhs/ofi/programs-services)
- [Maine DHHS Offices/Divisions](https://www.maine.gov/dhhs/offices-divisions)
- [Maine Administrative Office Locations](https://www.maine.gov/dhhs/about/contact/administrative-offices)
- [Maine DHHS sitemap](https://www.maine.gov/dhhs/about/sitemap)

### Top Remaining Source-Scouting Targets

- Any official Maine machine-readable office coverage artifact that names counties and district offices in the same record.
- Any official DHHS/OFI export, workbook, or API that preserves office responsibility by county rather than counts-only county data.
- Any reviewed official leaf that explicitly ties district offices, OFI services, or office service areas to named counties.

## Next State Order After Maine

1. Idaho
2. New Mexico
3. Arizona
4. New Hampshire
