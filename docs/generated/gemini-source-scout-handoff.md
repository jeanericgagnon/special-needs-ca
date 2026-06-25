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
- Massachusetts: `official_dese_export_plus_census_county_subdivision_crosswalk_clears_education_and_reviewed_dds_locality_capture_covers_13_of_14_counties_but_suffolk_remains_unresolved`
- New Hampshire: `official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable_with_no_live_nh_gov_successor_root`
- New Mexico: `official_webed_school_directory_and_rec_workbooks_live_but_no_county_crosswalk_or_county_labeled_local_education_contract_and_official_dvr_root_still_returns_401_without_reviewed_public_alternate`
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

`county_local_disability_resources` is the highest-priority Massachusetts blocker. Education is already cleared by the live official DESE district export plus the official Census TIGERweb county-subdivision crosswalk, and the live Massachusetts DDS locations lane already yields reviewed locality evidence for 13 of 14 counties. The remaining blocker is narrow: Suffolk County still lacks a preserved official DDS town/community locality contract. The same live DDS lane preserves 21 reviewed `DDS ... Area Office` cards with explicit `This area office serves the following towns and communities:` text, but bounded Boston, Chelsea, Revere, Winthrop, and Charlestown scans still do not expose a Suffolk-serving locality contract, and the raw fetch lane for the live locations index and interactive map continues to return HTTP 403.

### Exact Evidence Needed

- Any official Massachusetts DDS Suffolk-serving town/community list on the live locations lane, interactive regional map, or another current Mass.gov DDS locality page.
- Any official county field, county export, or preserved browser/cached Suffolk locality contract that truthfully bridges Suffolk County to a named DDS area office.
- Any reviewed first-party Mass.gov DDS page that explicitly names Boston, Chelsea, Revere, Winthrop, or Charlestown as served communities for one DDS area office.

### Useful Official URLs Already Tried

- [Massachusetts DDS org page](https://www.mass.gov/orgs/department-of-developmental-services)
- [Massachusetts DDS locations index](https://www.mass.gov/orgs/department-of-developmental-services/locations)
- [Massachusetts interactive DDS regional map](https://www.mass.gov/info-details/interactive-dds-regional-map)
- [Stale DDS area-offices child path](https://www.mass.gov/info-details/dds-area-offices)

### Top Remaining Source-Scouting Targets

- Any reviewed Suffolk-serving DDS locality contract on the live Mass.gov lane.
- Any official Suffolk-specific DDS office leaf or locality export that names the served towns/communities directly.
- Any first-party Mass.gov DDS artifact that turns the remaining Suffolk ambiguity between Charlestown and Chelsea into a county-grade office assignment without inventing a mapping.

## Next State Order After New Mexico

1. Alaska
2. Maine
3. Idaho
4. New Mexico
5. Arizona
6. New Hampshire
