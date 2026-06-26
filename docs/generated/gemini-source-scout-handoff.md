# Gemini Source Scout Handoff

Updated: 2026-06-26

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia, Wisconsin, Wyoming

## Current Blocked States

- Alaska: `reviewed_live_dpa_offices_page_still_only_groups_regions_while_raw_health_host_403_persists_and_dfcs_adds_no_borough_or_census_area_contract`
- Arizona: `official_des_locator_returns_14_explicit_counties_and_greenlee_zip_served_localities_but_no_reviewed_greenlee_county_contract`
- Idaho: `remaining_idaho_camas_and_clark_surfaces_now_reduce_to_wrong_role_contact_board_roster_title_ix_or_general_education_notice_leaves_without_special_education_or_student_services_routing`
- Maine: `official_dhhs_nav_stack_and_official_maine_search_still_expose_office_addresses_and_labels_but_no_county_or_service_area_contract`
- Massachusetts: `official_dese_export_plus_census_county_subdivision_crosswalk_clears_education_and_reviewed_dds_locality_capture_covers_13_of_14_counties_but_suffolk_remains_unresolved`
- New Hampshire: `official_nh_dhhs_education_and_vr_host_families_plus_diagnostic_robots_sitemaps_still_return_access_denied_shell_and_saved_dhhs_replacement_hosts_remain_dns_dead`
- New Mexico: `official_webed_sharepoint_lists_and_six_public_workbooks_are_live_but_still_expose_no_county_field_or_rec_service_area_contract_and_official_dvr_root_still_returns_401_without_reviewed_public_alternate`
- Rhode Island: `generic_or_statewide_evidence_used_where_local_required`
- South Dakota: `current_dhs_host_exposes_no_public_county_or_local_office_contract_for_south_dakota_county_local_disability_routing`
- Wyoming: `wde_idea_evidence_is_now_public_but_no_reviewable_county_to_district_special_education_crosswalk_or_disability_specific_county_resource_contract`
## Current Focus State: New Mexico

### Blocker Reason

`district_or_county_education_routing` remains the highest-priority New Mexico blocker. The official `2017 NM Schools` list is still live and REST-backed, and the public workbook stack is broader than the earlier packet captured: `NM Schools.xlsx`, `Superintendents.xlsx`, `REC Directors.xlsx`, `Elementary School Principals.xlsx`, `Middle School Principals.xlsx`, and `High School Principals.xlsx` all download successfully from the same official host. A follow-up schema and folder inventory pass also closed the remaining uncertainty on that host: the public `Document Library` contains only those six workbook files and `SitePages` contains only `Home.aspx`, `RECHome.aspx`, `How To Use This Library.aspx`, `Home1.aspx`, and `untitled_1.aspx`, with no separate county-crosswalk page. A final bounded API pass tightened the crucial distinction on the host: the live 935-row `2017 NM Schools` list exposes only district/location/contact columns on actual public rows, while a separate zero-item shadow `NM Schools` schema does expose a `County Name` field but cannot satisfy county-grade routing because it has no live rows. `Superintendents.xlsx` preserves district contacts only. `REC Directors.xlsx` preserves REC contact rows only. The principal workbooks preserve school and contact columns only. `RECHome.aspx` still groups districts under REC headings without county labels or REC service-area text. New Mexico remains BLOCKED because the public official PED stack still lacks a truthful county-to-district or county-to-REC crosswalk.

### Exact Evidence Needed

- Any official PED-managed county-to-district crosswalk, county column, county selector, or county-keyed export on the live WebED host.
- Any official PED-managed REC service-area artifact that explicitly labels counties served by each REC.
- Any official district-owned or REC-owned local special-education routing leaf that proves county-grade coverage without inference.

### Useful Official URLs Already Tried

- [PED SharePoint school directory home](https://webed.ped.state.nm.us/sites/schooldirectory/SitePages/Home.aspx)
- [2017 NM Schools list](https://webed.ped.state.nm.us/sites/schooldirectory/Lists/2017%20NM%20Schools/AllItems.aspx)
- [2017 NM Schools live-list metadata](https://webed.ped.state.nm.us/sites/schooldirectory/_api/web/lists(guid'ed760a23-c290-4b26-8fec-4f94210cf7c3')?$select=Title,ItemCount,RootFolder/ServerRelativeUrl&$expand=RootFolder)
- [NM Schools workbook](https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/NM%20Schools.xlsx)
- [Superintendents workbook](https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/Superintendents.xlsx)
- [REC Directors workbook](https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/REC%20Directors.xlsx)
- [Elementary School Principals workbook](https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/Elementary%20School%20Principals.xlsx)
- [Middle School Principals workbook](https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/Middle%20School%20Principals.xlsx)
- [High School Principals workbook](https://webed.ped.state.nm.us/sites/schooldirectory/Document%20Library/High%20School%20Principals.xlsx)
- [REC home page](https://webed.ped.state.nm.us/sites/schooldirectory/SitePages/RECHome.aspx)
- [Special Education Bureau page](https://webnew.ped.state.nm.us/bureaus/special-education/)

### Top Remaining Source-Scouting Targets

- Any live WebED list, workbook, or site page with an explicit county column or county-keyed filter.
- Any live WebED row contract, not just a shadow schema, that actually materializes county on public rows.
- Any official REC service-area contract with county labels on the PED-managed host or REC-owned official hosts.
- Any official district-owned local special-education or student-services leaf that can clear counties without relying on statewide PED exports.

## Next State Order After New Mexico

1. Arizona
2. New Hampshire
