# Gemini Source Scout Handoff

Updated: 2026-06-30

Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.

## Current Complete States

Alabama, Arkansas, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New Mexico, New York, North Carolina, North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina, South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia, Wisconsin, Wyoming

## Current Blocked States

- Alaska: `bounded_2026_06_29_exact_official_recheck_confirms_alaska_health_host_part_c_and_dpa_targets_now_fail_closed_on_cloudflare_challenge_while_dfcs_successors_still_publish_no_borough_assignment_contract_and_alaska_labor_dvr_proves_vr_and_pre_ets`
- Arizona: `bounded_2026_06_29_live_des_successor_recheck_confirms_part_c_and_vocational_rehabilitation_are_publicly_reviewable_while_reviewed_salesforce_remoting_still_only_proves_14_of_15_counties_and_greenlee_lacks_public_county_assignment`
- California: `county_local_disability_resources_exhausted_after_bounded_exact_leaf_and_browser_review`
- Idaho: `bounded_2026_06_29_exact_target_recheck_confirms_idaho_itp_and_idvr_successors_verify_while_residual_camas_and_clark_local_education_targets_bottom_out_in_roots_404s_or_wrong_role_content_and_dhw_office_stack_still_lacks_county_contract`
- Maine: `bounded_2026_06_29_exact_official_recheck_confirms_maine_doe_part_c_and_maine_dvr_successors_verify_while_dhhs_ofi_office_report_and_search_surfaces_still_expose_no_county_to_office_or_service_area_contract`
- New Hampshire: `bounded_2026_06_30_browser_and_raw_host_recheck_confirms_nh_dhhs_doe_and_nhes_roots_all_return_public_access_denied_shells_with_no_browser_recovery_lane`

## Current Focus State: New Hampshire

### Blocker Reason

`medicaid_state_health_coverage` is still the highest-priority New Hampshire blocker because the same official DHHS host-family failure blocks Medicaid, waiver, DD, early-intervention, and county-local routing together. Reviewed 2026-06-30 one more bounded pass in both raw-fetch and browser context. `https://www.dhhs.nh.gov/`, `https://dhhs.nh.gov/`, and `https://www.nh.gov/dhhs/` all still render the same public `Access Denied` shell in browser review, not just in raw HTTP fetches. The same browser-context parity now also holds for `https://education.nh.gov/`, `https://www.education.nh.gov/`, `https://www.nh.gov/education/`, `https://my.doe.nh.gov/ehb/`, `https://nhes.nh.gov/`, `https://www.nhes.nh.gov/`, and `https://www.nh.gov/nhes/`. New Hampshire therefore still has no public reviewable DHHS, DOE, or NHES content lane on the current official hosts.

### Exact Evidence Needed

- Any reviewed public official New Hampshire DHHS host that renders Medicaid, DD, waiver, early-intervention, or district-office content instead of the Access Denied shell.
- Any public official district-office or county-export surface on the DHHS family that provides real county or district-office routing.
- Any reviewed public official New Hampshire education directory or district-routing surface that renders publicly instead of the Access Denied shell.
- Any reviewed public official New Hampshire VR or BVR surface that renders publicly instead of the Access Denied shell.

### Useful Official URLs Already Tried

- [DHHS root](https://www.dhhs.nh.gov/)
- [DHHS root without www](https://dhhs.nh.gov/)
- [nh.gov DHHS successor root](https://www.nh.gov/dhhs/)
- [DHHS robots.txt](https://www.dhhs.nh.gov/robots.txt)
- [nh.gov robots.txt](https://www.nh.gov/robots.txt)
- [Education root](https://www.education.nh.gov/)
- [Education root without www](https://education.nh.gov/)
- [nh.gov Education successor](https://www.nh.gov/education/)
- [DOE alternate host](https://my.doe.nh.gov/ehb/)
- [NHES root](https://www.nhes.nh.gov/)
- [NHES root without www](https://nhes.nh.gov/)
- [NHES successor root](https://www.nh.gov/nhes/)

## Next State Order After New Hampshire

1. Arizona
2. California
3. Idaho
4. Maine
5. Alaska

