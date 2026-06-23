# Maine California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 16
- primary_gap_reason: public_maine_sau_selectors_and_workbook_are_live_but_raw_export_replay_still_500_and_dhhs_office_html_has_no_county_contract

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_live_public_sau_selectors_and_workbook_but_raw_export_replay_still_500 (The official Maine DOE Primary Contacts By Organization selector is public, the Town selector is public, and the official SAU-by-municipality workbook is still downloadable. But a fresh bounded 2026-06-23 raw replay with the anti-forgery token, full hidden SAU inventory, OrgId=42, and the named submit actions still does not yield reusable local contact rows in this lane: both `action:CSearchBySAU` and `action:SAUExport` end in HTTP 500 or shell-only responses instead of a stable first-party contact export. Maine education therefore remains blocked until reviewed browser capture or district-owned local leaves materialize county-grade routing across all 16 counties.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed first-party PTI designation evidence is present at the required authority level)
- legal_aid: verified_state_grade (Reviewed Pine Tree Legal Assistance now provides direct statewide Maine legal-aid evidence.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_district_office_locations_without_county_town_or_service_area_fields (Maine now has a tighter county-local blocker than a generic office-grade warning. The live DHHS District Office Locations page is public and role-bearing, but a bounded 2026-06-23 HTML inspection still exposes zero county terms, zero town terms, and zero service-area fields in the public page itself. Program cross-office notes such as Machias and Lewiston remain real office-routing hints, but they still cannot be promoted into county coverage proof. Maine county-local therefore remains blocked until an official county or town mapping contract appears.)

## Failure ledger

- district_or_county_education_routing: public_maine_sau_selectors_are_live_but_raw_export_replay_still_500_and_county_grade_contacts_remain_unmaterialized :: Reviewed 2026-06-23 official Maine education sources at https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU, https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town, and the official workbook https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx. The public selector HTML still exposes `__RequestVerificationToken`, live OrgIds such as `42` for Bangor Public Schools, and the named submit actions `action:CSearchBySAU` and `action:SAUExport`, and the official workbook still parses with municipality-to-OrganizationId mappings. But a fresh bounded raw replay in this lane with the anti-forgery token, full hidden SAU inventory, OrgId=42, and each named submit still failed to produce stable role-bearing contact rows: the POST lane returned HTTP 500 or shell-only HTML instead of a reusable first-party export. Maine therefore no longer has a discovery blocker for education, but it still does have a materialization blocker because the public selector/workbook contract does not currently yield county-grade local routing rows in the low-token raw lane.
- county_local_disability_resources: official_dhhs_office_page_has_zero_county_town_or_service_area_fields :: Reviewed 2026-06-23 live official Maine DHHS District Office Locations page at https://www.maine.gov/dhhs/about/contact/offices. The page still preserves district office names, addresses, phones, emails, and cross-office program notes, but a bounded HTML inspection exposed zero county terms, zero town terms, zero service-area fields, and no county names such as Aroostook, Washington, or York in the public page itself. DOI mirror rows and dead locator fallbacks therefore still lack a truthful official mapping contract.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.maine.gov/dhhs/oads/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.maine.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.maine.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.maine.gov/doe/learning/specialed
- district_or_county_education_routing: blocked_live_public_sau_selectors_and_workbook_but_raw_export_replay_still_500; samples=4; first=https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.maine.gov/dhhs/oads
- protection_and_advocacy: verified_state_grade; samples=1; first=https://drme.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.mpf.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.ptla.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_district_office_locations_without_county_town_or_service_area_fields; samples=1; first=https://www.maine.gov/dhhs/about/contact/offices

## Next actions

- [critical] district_or_county_education_routing: use_reviewed_browser_capture_or_district_owned_leaves_to_materialize_county_grade_contacts_because_raw_sau_export_replay_still_500s
- [critical] county_local_disability_resources: find_official_county_or_town_mapping_contract_or_keep_maine_counties_blocked

## Completion decision

- Maine remains BLOCKED and not index-safe.
- Education has real official discovery primitives: the public selectors are live and the municipality workbook still downloads from the DOE host.
- Maine education still does not clear because the raw postback lane remains unstable in bounded replay and has not yielded reusable county-grade local contact rows in this environment.
- County-local remains blocked because the official DHHS office page still publishes zero county, town, or service-area mapping fields in public HTML.
