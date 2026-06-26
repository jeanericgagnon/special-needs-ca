# Gemini Source Scout Handoff

Updated: 2026-06-26

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia, Wisconsin

## Current Blocked States

- Alaska: `reviewed_live_dpa_offices_page_still_only_groups_regions_while_raw_health_host_403_persists_and_dfcs_adds_no_borough_or_census_area_contract`
- Arizona: `official_des_locator_returns_14_explicit_counties_and_greenlee_zip_served_localities_but_no_reviewed_greenlee_county_contract`
- Idaho: `remaining_idaho_camas_and_clark_surfaces_now_reduce_to_wrong_role_contact_board_roster_title_ix_or_general_education_notice_leaves_without_special_education_or_student_services_routing`
- Maine: `official_dhhs_nav_stack_and_official_maine_search_still_expose_office_addresses_and_labels_but_no_county_or_service_area_contract`
- New Hampshire: `official_nh_dhhs_education_and_vr_host_families_plus_diagnostic_robots_sitemaps_still_return_access_denied_shell_and_saved_dhhs_replacement_hosts_remain_dns_dead`
- New Mexico: `official_webed_sharepoint_lists_and_six_public_workbooks_are_live_but_still_expose_no_county_field_or_rec_service_area_contract_and_official_dvr_root_still_returns_401_without_reviewed_public_alternate`
- South Dakota: `current_dhs_host_exposes_no_public_county_or_local_office_contract_for_south_dakota_county_local_disability_routing`
- Wyoming: `wde_idea_evidence_is_now_public_but_no_reviewable_county_to_district_special_education_crosswalk_or_disability_specific_county_resource_contract`

## Current Focus State: Arizona

### Blocker Reason

`county_local_disability_resources` is now the narrowest Arizona blocker. The official DES Salesforce locator is live and preserves explicit county fields for 14 counties, but Greenlee County still needs a reviewed official county contract rather than ZIP-based inference.

### Exact Evidence Needed

- Any current official DES or AHCCCS page, export, or public locator response that explicitly names Greenlee County in the county-to-office contract.
- Any current official Arizona county-local DDS or Medicaid/HHS routing leaf that preserves Greenlee County service-area proof without relying on ZIP inference.

### Useful Official URLs Already Tried

- [DES Salesforce office locator](https://azdes-community.my.salesforce-sites.com/EOL/)
- [DES office-locator root](https://des.az.gov/office-locator)
- [DES find-your-local-office root](https://des.az.gov/find-your-local-office)

### Top Remaining Source-Scouting Targets

- Any official Arizona county-bearing locator response for Greenlee.
- Any official Greenlee-serving DES or AHCCCS office leaf with explicit county language.

## Next State Order After Arizona

1. Alaska
2. Maine
3. Idaho
4. New Mexico
5. New Hampshire
6. South Dakota
