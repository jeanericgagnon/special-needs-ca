# Gemini Source Scout Handoff

Updated: 2026-06-26

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New Mexico, New York, North Carolina, North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia, Wisconsin, Wyoming

## Current Blocked States

- Alaska: `bounded_2026_06_26_live_recheck_confirms_dpa_offices_page_is_browser_readable_but_region_only_while_raw_health_fetches_still_403_and_dfcs_successor_surfaces_expose_no_borough_or_census_area_contract`
- Arizona: `bounded_2026_06_26_live_des_salesforce_remoting_confirms_explicit_county_fields_for_la_paz_mohave_and_yuma_and_greenlee_zip_served_localities_but_still_no_greenlee_county_assignment`
- Idaho: `bounded_2026_06_26_attachment_recheck_confirms_camas_board_doc_and_clark_child_find_manual_policy_attachments_still_fail_to_create_local_special_ed_contract`
- Maine: `bounded_2026_06_26_live_recheck_confirms_maine_dhhs_ofi_nav_stack_reports_and_search_surfaces_are_public_but_still_expose_no_county_to_office_or_service_area_contract`
- New Hampshire: `bounded_2026_06_26_browser_recheck_confirms_nh_dhhs_doe_and_nhes_hosts_fail_with_public_access_denied_shells_not_just_raw_fetch_403s`

## Current Focus State: Arizona

### Blocker Reason

`county_local_disability_resources` is still the sole Arizona blocker, but it is now narrower. The live official DES Salesforce remoting lane proves literal office county fields for La Paz, Mohave, and Yuma, and it also preserves Greenlee locality ZIP service-area values `85533`, `85534`, and `85540` on the Tucson DDS row. Greenlee County alone still lacks reviewed public official county-literal routing proof, and the AHCCCS fallback still stops at office cards plus county enrollment reporting rather than a Greenlee county-to-office contract.
