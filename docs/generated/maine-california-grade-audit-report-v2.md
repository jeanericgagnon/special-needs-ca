# Maine California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 16
- primary_gap_reason: official_sau_contact_search_actions_return_500_and_dhhs_office_pages_lack_county_mapping

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_official_sau_contact_actions_return_500 (DOE now exposes an official SAU-by-municipality workbook plus live NEO town and SAU selector pages, but bounded POSTs to the public search/export actions still return HTTP 500 before yielding verified local contact rows or an export file.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed first-party PTI designation evidence is present at the required authority level)
- legal_aid: verified_state_grade (Reviewed Pine Tree Legal Assistance now provides direct statewide Maine legal-aid evidence.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_district_office_locations_without_county_mapping (DHHS now exposes a real District Office Locations page, but it does not assign counties to offices or provide a public county/town lookup contract.)

## Failure ledger

- district_or_county_education_routing: official_sau_contact_search_and_export_actions_return_500 :: Maine DOE now exposes an official List of SAUs by Municipality workbook plus live NEO town and SAU selector pages, but the workbook only lists organization names/types and bounded POSTs to the public CSearchBySAU and SAUExport actions returned HTTP 500 instead of verified local contact rows or an export file.
- county_local_disability_resources: official_district_office_pages_lack_county_coverage_contract :: The official DHHS District Office Locations page is live and preserves office addresses, phones, and eligibility notes, but it does not expose county-to-office coverage or a public town/county lookup contract.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.maine.gov/dhhs/oads/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.maine.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.maine.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.maine.gov/doe/learning/specialed
- district_or_county_education_routing: blocked_official_sau_contact_actions_return_500; samples=4; first=https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.maine.gov/dhhs/oads
- protection_and_advocacy: verified_state_grade; samples=1; first=https://drme.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.mpf.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.ptla.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_district_office_locations_without_county_mapping; samples=1; first=https://www.maine.gov/dhhs/about/contact/offices

## Next actions

- [critical] district_or_county_education_routing: browser_assisted_capture_or_manual_export_from_neo_sau_contact_search
- [critical] county_local_disability_resources: find_county_or_town_to_district_office_mapping

## Completion decision

- Maine legal aid upgrades because Pine Tree Legal Assistance explicitly states that it provides free civil legal aid in Maine and preserves statewide help topics on the public page.
- Maine district/county education routing remains blocked, but the blocker is now sharper: Maine DOE exposes an official SAU-by-municipality workbook plus live NEO town and SAU selector pages, yet the workbook lacks direct contact fields and bounded POSTs to the public `CSearchBySAU` and `SAUExport` actions still return HTTP 500 instead of verified district contact rows or an export file.
- Maine county/local disability resources remain blocked, but the blocker is now sharper: the official DHHS District Office Locations page is live and lists real district offices with addresses and phones, yet it still does not expose county coverage or a public town/county lookup contract.
- Maine is therefore still truthfully BLOCKED and not index-safe. The only remaining blockers are the two local-routing families.
