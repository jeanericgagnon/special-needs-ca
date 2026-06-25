# Maine California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 16
- primary_gap_reason: official_maine_contact_and_superintendent_selectors_are_live_but_current_bangor_materialization_posts_still_return_same_500_shell_plus_dhhs_office_html_has_no_county_contract

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_live_contact_and_superintendent_selectors_but_current_materialization_posts_still_return_same_500_shell (Maine education remains blocked, but the live official contract is broader and still fails at the same materialization step. On 2026-06-25 the Primary Contacts By Organization selector, the Superintendent by SAU selector, the Superintendent by Town selector, and the official SAU workbook all remained publicly reachable on official Maine DOE hosts. The contact selector still exposes the anti-forgery token, the `OrgId` selector, and the `SAUs[*]` field family. But fresh bounded Bangor submits across those live first-party lanes still all return the same generic NEO Contact Search HTTP 500 error shell instead of reusable local contact rows, so the county-grade education materialization lane is still not recovered.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed first-party PTI designation evidence is present at the required authority level)
- legal_aid: verified_state_grade (Reviewed Pine Tree Legal Assistance now provides direct statewide Maine legal-aid evidence.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_district_office_locations_with_towns_but_without_county_crosswalk (Maine county-local remains blocked for the same reason as the prior pass: the official DHHS District Office Locations page is public and role-bearing and lists named office towns, addresses, phones, emails, and map links, but it still exposes no county-served labels and no service-area crosswalk in public HTML.)

## Failure ledger

- district_or_county_education_routing: official_contact_and_superintendent_selectors_are_live_but_current_bangor_materialization_posts_still_return_same_500_shell :: Reviewed 2026-06-25 official Maine education sources at https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU, https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/SAU, https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town, and the official workbook https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx. The contact selector returned HTTP 200 with title `NEO Contact Search [ v2.0.0.0 - A2 ]`; the Superintendent by SAU selector returned HTTP 200 with title `NEO Contact Search [ v2.0.0.0 - A4 ]`; the Town selector returned HTTP 200 with title `NEO Contact Search [ v2.0.0.0 - A3 ]`; and the workbook remained downloadable from the official DOE host. A bounded HTML inspection still found the anti-forgery token, the `OrgId` selector, and the `SAUs[*]` field family on the live contact selector page. But fresh bounded Bangor submits to the live contact search, contact export, Superintendent by SAU, and Superintendent by Town lanes all returned the same `Sorry, an error occurred while processing your request.` HTTP 500 shell. Maine therefore still has a public selector/workbook inventory lane but not a recovered county-grade education contact materialization lane.
- county_local_disability_resources: official_dhhs_office_page_lists_office_towns_but_has_no_county_or_service_area_crosswalk :: Reviewed 2026-06-23 live official Maine DHHS District Office Locations page at https://www.maine.gov/dhhs/about/contact/offices. The page preserves district office names, exact office towns and addresses, phones, emails, cross-office program notes, and `Show Map` links for offices such as Bangor, Biddeford, Calais, Caribou, Ellsworth, Machias, Portland, and Skowhegan. But a bounded HTML inspection still exposed zero county names such as Aroostook, Washington, or York, zero county-served labels, and zero service-area fields in the public page itself. The official page therefore remains office-grade evidence without a truthful county-to-office routing contract.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.maine.gov/dhhs/oads/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.maine.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.maine.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.maine.gov/doe/learning/specialed
- district_or_county_education_routing: blocked_live_contact_and_superintendent_selectors_but_current_materialization_posts_still_return_same_500_shell; samples=6; first=https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.maine.gov/dhhs/oads
- protection_and_advocacy: verified_state_grade; samples=1; first=https://drme.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.mpf.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.ptla.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_district_office_locations_with_towns_but_without_county_crosswalk; samples=1; first=https://www.maine.gov/dhhs/about/contact/offices

## Next actions

- [critical] district_or_county_education_routing: preserve_manual_export_or_browser_capture_lane_until_any_live_first_party_maine_education_rows_materialize
- [critical] county_local_disability_resources: find_official_county_or_service_area_crosswalk_for_named_dhhs_office_towns_or_keep_maine_counties_blocked

## Completion decision

- Maine remains BLOCKED and not index-safe.
- Education remains blocked because the official contact selector, superintendent selectors, and workbook are still public, but current Bangor materialization submits across those first-party lanes still return the same HTTP 500 error shell instead of reusable local rows.
- County-local remains blocked because the official DHHS office page still publishes office towns but no county or service-area crosswalk in public HTML.
