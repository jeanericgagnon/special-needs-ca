# Maine California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 16
- primary_gap_reason: public_maine_sau_selectors_and_workbook_are_live_but_export_replay_still_500_and_dhhs_office_html_has_no_county_contract

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_live_public_sau_selectors_and_workbook_but_export_replay_still_500 (Maine still has a materially stronger official education lane than a selector-discovery blocker: the public Primary Contacts By Organization selector is live, the Town selector is live, and the official SAU-by-municipality workbook is still downloadable. But a fresh bounded 2026-06-23 replay using the exact first-party inputs (`__RequestVerificationToken`, the full hidden `SAUs[*]` inventory, `OrgId=42`, and `action:SAUExport=Export to Excel`) still returns HTTP 500 with only shell HTML instead of a reusable first-party workbook or local contact rows. Maine education therefore remains blocked until reviewed browser/manual capture or district-owned local leaves materialize county-grade routing across all 16 counties.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed first-party PTI designation evidence is present at the required authority level)
- legal_aid: verified_state_grade (Reviewed Pine Tree Legal Assistance now provides direct statewide Maine legal-aid evidence.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_district_office_locations_with_towns_but_without_county_crosswalk (Maine now has a narrower county-local blocker than the previous zero-town claim. The live DHHS District Office Locations page is public and role-bearing and it clearly lists named office towns such as Bangor, Biddeford, Calais, Caribou, Ellsworth, Machias, Portland, and Skowhegan, plus exact office addresses, phones, emails, and map links. But the same bounded 2026-06-23 HTML inspection still exposes zero county names, zero county-served labels, and zero service-area fields in the public page itself. Office-town text alone is not a truthful county-routing contract, so Maine county-local remains blocked until an official county or service-area crosswalk appears.)

## Failure ledger

- district_or_county_education_routing: live_public_sau_selectors_and_workbook_exist_but_export_replay_still_500 :: Reviewed 2026-06-23 official Maine education sources at https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU, https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town, and the official workbook https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx. The public selector HTML still exposes a real anti-forgery token, the full hidden `SAUs[*]` inventory, `OrgId` as the organization selector, and the exact first-party submit controls `action:CSearchBySAU` (`Search`) and `action:SAUExport` (`Export to Excel`). But a fresh bounded replay with `OrgId=42` for Bangor Public Schools and the literal `action:SAUExport=Export to Excel` value still returns HTTP 500 and only the generic NEO shell HTML instead of `SAUSearchResults.xls` or local contact rows. Maine therefore no longer has a selector-discovery problem, but it also cannot truthfully claim a recovered raw export lane in the current environment.
- county_local_disability_resources: official_dhhs_office_page_lists_office_towns_but_has_no_county_or_service_area_crosswalk :: Reviewed 2026-06-23 live official Maine DHHS District Office Locations page at https://www.maine.gov/dhhs/about/contact/offices. The page preserves district office names, exact office towns and addresses, phones, emails, cross-office program notes, and `Show Map` links for offices such as Bangor, Biddeford, Calais, Caribou, Ellsworth, Machias, Portland, and Skowhegan. But a bounded HTML inspection still exposed zero county names such as Aroostook, Washington, or York, zero county-served labels, and zero service-area fields in the public page itself. The official page therefore remains office-grade evidence without a truthful county-to-office routing contract.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.maine.gov/dhhs/oads/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.maine.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.maine.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.maine.gov/doe/learning/specialed
- district_or_county_education_routing: blocked_live_public_sau_selectors_and_workbook_but_export_replay_still_500; samples=5; first=https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.maine.gov/dhhs/oads
- protection_and_advocacy: verified_state_grade; samples=1; first=https://drme.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.mpf.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.ptla.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_district_office_locations_with_towns_but_without_county_crosswalk; samples=1; first=https://www.maine.gov/dhhs/about/contact/offices

## Next actions

- [critical] district_or_county_education_routing: preserve_manual_export_or_browser_capture_lane_and_do_not_treat_raw_export_as_recovered
- [critical] county_local_disability_resources: find_official_county_or_service_area_crosswalk_for_named_dhhs_office_towns_or_keep_maine_counties_blocked

## Completion decision

- Maine remains BLOCKED and not index-safe.
- Education still has a real public selector/workbook inventory lane on the official DOE host.
- Maine education does not clear because the current raw export replay still returns HTTP 500 shell HTML instead of reusable local contact rows.
- County-local remains blocked because the official DHHS office page still publishes zero county, town, or service-area mapping fields in public HTML.
