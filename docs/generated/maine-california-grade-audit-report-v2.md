# Maine California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 16
- primary_gap_reason: bounded_2026_06_26_live_recheck_confirms_maine_dhhs_ofi_nav_stack_reports_and_search_surfaces_are_public_but_still_expose_no_county_to_office_or_service_area_contract

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_current_official_neo_superintendent_selectors (Maine education now clears from the live official NEO superintendent selectors. On 2026-06-25 the Superintendent by SAU selector and the Superintendent by Town selector both remained publicly reachable on official Maine DOE hosts, both exposed fresh anti-forgery tokens, and bounded Bangor submits on both routes materialized real local superintendent rows with address, phone, fax, and email on the official host. The sibling Primary Contacts By Organization search/export lane still falls into the NEO CustomError shell, but that no longer blocks district-grade routing because the superintendent selectors themselves now provide reusable local routing rows.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed first-party PTI designation evidence is present at the required authority level)
- legal_aid: verified_state_grade (Reviewed Pine Tree Legal Assistance now provides direct statewide Maine legal-aid evidence.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_live_dhhs_ofi_nav_stack_reports_and_search_surfaces_public_but_still_not_county_grade (Reviewed 2026-06-26 one more bounded live Maine DHHS/OFI county-local pass. The exact public office and report surfaces are still live and reviewable: `https://www.maine.gov/dhhs/about/contact/offices`, `/ofi/about-us/contact`, `/ofi/programs-services`, `/ofi/about-us/data-reports`, `/offices-divisions`, `/about/contact/administrative-offices`, and `/about/sitemap` all still return HTTP 200. The current official report artifacts are also still live: the Geographic Distribution PDF, Geographic Overflow PDF, counts-by-county workbook, and counts-by-county-and-town workbook all still return HTTP 200. A fresh document-level recheck now proves those reports are geographic counts only, not routing contracts: the 2026 county workbook preserves headers like `COUNTY` and `TOTAL COUNT`; the county-and-town workbook preserves `COUNTY` plus `TOWN`; and the 2026 Geographic Distribution / Overflow PDFs enumerate counties and towns such as Androscoggin, Aroostook, Auburn, Augusta, Bangor, Machias, Portland, Rockland, Sanford, and Skowhegan only as benefit-geography rows. The public District Office Locations page also remains office-address only and does not name counties on-page. No reviewed live DHHS/OFI page, workbook, PDF, sitemap, or search surface publishes `county served`, `service area`, district-office assignments, or any county-to-office routing table. Maine therefore still lacks a reviewable public county-to-office or service-area routing contract on the live DHHS/OFI stack.)

## Failure ledger

- county_local_disability_resources: official_maine_dhhs_ofi_surfaces_still_expose_offices_and_counts_without_county_assignment_contract :: Reviewed 2026-06-26 one more bounded live Maine DHHS/OFI county-local pass. The exact public office and report surfaces are still live and reviewable: `https://www.maine.gov/dhhs/about/contact/offices`, `/ofi/about-us/contact`, `/ofi/programs-services`, `/ofi/about-us/data-reports`, `/offices-divisions`, `/about/contact/administrative-offices`, and `/about/sitemap` all still return HTTP 200. The current official report artifacts are also still live: the Geographic Distribution PDF, Geographic Overflow PDF, counts-by-county workbook, and counts-by-county-and-town workbook all still return HTTP 200. A fresh document-level recheck now proves those reports are geographic counts only, not routing contracts: the 2026 county workbook preserves headers like `COUNTY` and `TOTAL COUNT`; the county-and-town workbook preserves `COUNTY` plus `TOWN`; and the 2026 Geographic Distribution / Overflow PDFs enumerate counties and towns such as Androscoggin, Aroostook, Auburn, Augusta, Bangor, Machias, Portland, Rockland, Sanford, and Skowhegan only as benefit-geography rows. The public District Office Locations page also remains office-address only and does not name counties on-page. No reviewed live DHHS/OFI page, workbook, PDF, sitemap, or search surface publishes `county served`, `service area`, district-office assignments, or any county-to-office routing table. Maine therefore still lacks a reviewable public county-to-office or service-area routing contract on the live DHHS/OFI stack.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.maine.gov/dhhs/oads/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.maine.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.maine.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.maine.gov/doe/learning/specialed
- district_or_county_education_routing: verified_current_official_neo_superintendent_selectors; samples=5; first=https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/SAU
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.maine.gov/dhhs/oads
- protection_and_advocacy: verified_state_grade; samples=1; first=https://drme.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.mpf.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.ptla.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_live_dhhs_ofi_nav_stack_reports_and_search_surfaces_public_but_still_not_county_grade; samples=16; first=https://www.maine.gov/dhhs/about/contact/offices

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_official_maine_dhhs_ofi_or_maine_search_surface_exposes_county_to_office_or_service_area_routing

## Completion decision

- Maine remains BLOCKED and not index-safe.
- County-local routing is still blocked because the current public DHHS/OFI stack is live but still does not publish a county-to-office or service-area contract.
