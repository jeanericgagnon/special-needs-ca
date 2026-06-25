# Maine California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 16
- primary_gap_reason: official_dhhs_office_stack_ofi_contact_page_and_show_map_shortlinks_still_expose_no_county_or_service_area_contract

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
- county_local_disability_resources: blocked_public_dhhs_office_stack_ofi_contact_and_map_shortlinks_without_office_assignment_contract (Reviewed 2026-06-25 one more bounded official Maine DHHS/OFI county-local pass on same-host contact surfaces and two representative `Show Map` shortlinks. The DHHS district office page still preserves office towns, addresses, phones, emails, map shortlinks, and OFI program links, but no county-served or service-area fields. The OFI contact page at `/dhhs/ofi/about-us/contact` stays live, yet it only repeats the same `District Office locations` link plus statewide eligibility/help routing and exposes no county crosswalk, no office-assignment table, and no service-area text. The OFI programs-and-services page stays equally generic. The `Show Map` shortlinks from the district office page resolve only to raw Google Maps address geocodes such as `35 Anthony Ave, Augusta, ME 04330` and `19 Maine Ave, Bangor, ME 04401`; they add address confirmation, but no county names, no district-office identifiers, and no county-to-office routing metadata. Maine therefore still has office-grade address proof without any truthful county-to-office or county-to-service-area routing contract on the official public host family.)

## Failure ledger

- county_local_disability_resources: official_dhhs_office_stack_ofi_contact_and_map_shortlinks_expose_office_addresses_but_zero_county_assignment_fields :: Reviewed 2026-06-25 bounded official Maine DHHS/OFI surfaces on `https://www.maine.gov/dhhs/about/contact/offices`, `https://www.maine.gov/dhhs/ofi/about-us/contact`, `https://www.maine.gov/dhhs/ofi/programs-services`, and two representative `Show Map` shortlinks from the district office table. The live district office page still preserves district office names, office towns and addresses, phones, emails, map shortlinks, and OFI program links, but zero county names, zero county-served labels, and zero service-area fields in public HTML. The OFI contact page still only points back to `District Office locations` and statewide eligibility/help routing. The OFI programs-and-services page stays live but exposes no county or office-assignment metadata. The representative `Show Map` shortlinks resolved only to Google Maps address geocodes for `35 Anthony Ave, Augusta, ME 04330` and `19 Maine Ave, Bangor, ME 04401`, adding no county names, no district-office identifiers, and no county-to-office routing fields. Maine therefore still has official office addresses without any public county-assignment contract.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.maine.gov/dhhs/oads/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.maine.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.maine.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.maine.gov/doe/learning/specialed
- district_or_county_education_routing: verified_current_official_neo_superintendent_selectors; samples=4; first=https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/SAU
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.maine.gov/dhhs/oads
- protection_and_advocacy: verified_state_grade; samples=1; first=https://drme.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.mpf.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.ptla.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_public_dhhs_office_stack_ofi_contact_and_map_shortlinks_without_office_assignment_contract; samples=9; first=https://www.maine.gov/dhhs/about/contact/offices

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_official_maine_dhhs_or_ofi_surface_exposes_county_to_office_or_service_area_routing

## Completion decision

- Maine remains BLOCKED and not index-safe.
- Education remains cleared by the live official Superintendent-by-SAU and Superintendent-by-Town selectors.
- County-local remains blocked because the public DHHS office stack, OFI contact page, OFI programs-and-services page, and sampled `Show Map` shortlinks still expose office-grade address proof without county routing or service-area fields.
