# Maine California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 16
- primary_gap_reason: public_maine_selectors_and_workbook_are_live_but_full_hidden_form_post_still_errors_and_dhhs_office_html_has_no_county_contract

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_live_public_org_selector_with_hidden_form_error_shell (Maine now has a tighter official education blocker than a generic POST-500 claim. The public Primary Contacts By Organization selector is live, the Town selector is live, and the official SAU-by-municipality workbook is still downloadable. A bounded replay that includes the page token plus the full hidden `SAUs[*]` inputs no longer throws raw HTTP 500, but both the Search and Export submits still return the same generic official `Error.` shell before any contact rows or export file appear. Maine therefore remains blocked on reviewed browser/manual capture or another official export path, not on selector discovery or missing form hydration.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed first-party PTI designation evidence is present at the required authority level)
- legal_aid: verified_state_grade (Reviewed Pine Tree Legal Assistance now provides direct statewide Maine legal-aid evidence.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_district_office_locations_without_county_town_or_service_area_fields (Maine now has a tighter county-local blocker than a generic office-grade warning. The live DHHS District Office Locations page is public and role-bearing, but a bounded 2026-06-23 HTML inspection still exposes zero county terms, zero town terms, and zero service-area fields in the public page itself. Program cross-office notes such as Machias and Lewiston remain real office-routing hints, but they still cannot be promoted into county coverage proof. Maine county-local therefore remains blocked until an official county or town mapping contract appears.)

## Failure ledger

- district_or_county_education_routing: live_orgid_inventory_and_workbook_exist_but_full_hidden_form_post_returns_generic_error_shell :: Reviewed 2026-06-23 official Maine education sources at https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU, https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town, and the official workbook https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx. The public selector and workbook still prove a live OrgId and municipality inventory. A bounded replay that included the page token, OrgId, and the full hidden SAU fields changed the old transport behavior: Search and Export no longer returned raw HTTP 500, but both official submits still returned the same generic `Error.` shell with no contact rows, no export file, and no recoverable local result payload.
- county_local_disability_resources: official_dhhs_office_page_has_zero_county_town_or_service_area_fields :: Reviewed 2026-06-23 live official Maine DHHS District Office Locations page at https://www.maine.gov/dhhs/about/contact/offices. The page still preserves district office names, addresses, phones, emails, and cross-office program notes, but a bounded HTML inspection exposed zero county terms, zero town terms, zero service-area fields, and no county names such as Aroostook, Washington, or York in the public page itself. DOI mirror rows and dead locator fallbacks therefore still lack a truthful official mapping contract.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.maine.gov/dhhs/oads/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.maine.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.maine.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.maine.gov/doe/learning/specialed
- district_or_county_education_routing: blocked_live_public_org_selector_with_hidden_form_error_shell; samples=4; first=https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.maine.gov/dhhs/oads
- protection_and_advocacy: verified_state_grade; samples=1; first=https://drme.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.mpf.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.ptla.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_district_office_locations_without_county_town_or_service_area_fields; samples=1; first=https://www.maine.gov/dhhs/about/contact/offices

## Next actions

- [critical] district_or_county_education_routing: use_live_orgids_and_workbook_for_reviewed_browser_capture_now_that_hidden_form_replay_is_understood
- [critical] county_local_disability_resources: find_official_county_or_town_mapping_contract_or_keep_maine_counties_blocked

## Completion decision

- Maine remains BLOCKED and not index-safe.
- Education is still blocked, but the blocker is now more precise: the fully hydrated official form still collapses to a generic error shell before any local contact rows or export file appear.
- County-local is still blocked because the official DHHS office page remains office-grade only and still publishes zero county/town/service-area fields in the public HTML.
- Future Maine repair should start from reviewed browser/manual capture on the already-live DOE selectors and workbook, not from more selector discovery or partial POST guesses.
