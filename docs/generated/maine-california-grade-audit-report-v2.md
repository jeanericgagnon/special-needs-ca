# Maine California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 16
- primary_gap_reason: public_maine_sau_export_contract_now_works_but_not_yet_materialized_county_grade_and_dhhs_office_html_has_no_county_contract

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_live_public_sau_export_contract_not_materialized_county_grade (Maine now has a materially stronger official education lane than a generic hidden-form error blocker. The public Primary Contacts By Organization selector is live, the Town selector is live, the official SAU-by-municipality workbook is still downloadable, and a bounded 2026-06-23 replay with the anti-forgery token, hidden SAU inventory, OrgId, and the named `action:SAUExport` submit returned a real first-party Excel attachment rather than a generic error shell. That export preserves role-bearing contact rows such as `504 Coordinator`, plus phone, email, town, and SAU fields on the official host. Maine education remains blocked only because the working export contract is not yet materialized into reviewed county-grade district routing coverage across all 16 counties.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed first-party PTI designation evidence is present at the required authority level)
- legal_aid: verified_state_grade (Reviewed Pine Tree Legal Assistance now provides direct statewide Maine legal-aid evidence.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_district_office_locations_without_county_town_or_service_area_fields (Maine now has a tighter county-local blocker than a generic office-grade warning. The live DHHS District Office Locations page is public and role-bearing, but a bounded 2026-06-23 HTML inspection still exposes zero county terms, zero town terms, and zero service-area fields in the public page itself. Program cross-office notes such as Machias and Lewiston remain real office-routing hints, but they still cannot be promoted into county coverage proof. Maine county-local therefore remains blocked until an official county or town mapping contract appears.)

## Failure ledger

- district_or_county_education_routing: public_sau_export_contract_works_but_not_yet_materialized_into_county_grade_local_routing :: Reviewed 2026-06-23 official Maine education sources at https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU, https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town, and the official workbook https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx. A fresh bounded replay of the live public form included the anti-forgery `__RequestVerificationToken`, the full hidden `SAUs[*]` inventory, `OrgId=42`, and the named submit actions exposed on the page (`action:CSearchBySAU` and `action:SAUExport`). The Search submit now returns the official ContactSearchBySAU page without a raw transport failure, and the Export submit returns HTTP 200 with `content-type: application/ms-excel` and `content-disposition: attachment; filename=SAUSearchResults.xls`. The first-party export preserves local contact rows on the official host, including `504 Coordinator`, `Phone`, `Email`, `Town`, and `SAU` columns plus Bangor Public Schools values such as Daniel Chadbourne, dchadbourne@bangorschools.net, 73 Harlow Street, Bangor, ME 04401. Maine therefore no longer has a generic hidden-form error blocker for education. It remains blocked only because this working OrgId/workbook/export contract is not yet materialized into reviewed county-grade district routing rows across all counties.
- county_local_disability_resources: official_dhhs_office_page_has_zero_county_town_or_service_area_fields :: Reviewed 2026-06-23 live official Maine DHHS District Office Locations page at https://www.maine.gov/dhhs/about/contact/offices. The page still preserves district office names, addresses, phones, emails, and cross-office program notes, but a bounded HTML inspection exposed zero county terms, zero town terms, zero service-area fields, and no county names such as Aroostook, Washington, or York in the public page itself. DOI mirror rows and dead locator fallbacks therefore still lack a truthful official mapping contract.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.maine.gov/dhhs/oads/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.maine.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.maine.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.maine.gov/doe/learning/specialed
- district_or_county_education_routing: blocked_live_public_sau_export_contract_not_materialized_county_grade; samples=5; first=https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.maine.gov/dhhs/oads
- protection_and_advocacy: verified_state_grade; samples=1; first=https://drme.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.mpf.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.ptla.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_district_office_locations_without_county_town_or_service_area_fields; samples=1; first=https://www.maine.gov/dhhs/about/contact/offices

## Next actions

- [critical] district_or_county_education_routing: use_live_orgids_workbook_and_working_sau_export_to_materialize_reviewed_local_district_contacts_county_by_county
- [critical] county_local_disability_resources: find_official_county_or_town_mapping_contract_or_keep_maine_counties_blocked

## Completion decision

- Maine remains BLOCKED and not index-safe.
- Education is stronger than before: the official export contract now works and returns role-bearing local contact rows on the first-party DOE host.
- Maine still does not clear because that OrgId/workbook/export lane is not yet materialized into reviewed county-grade district routing coverage across all counties.
- County-local remains blocked because the official DHHS office page still publishes zero county, town, or service-area mapping fields in public HTML.
