# Maine California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 16
- primary_gap_reason: official_dhhs_office_stack_and_new_ofi_county_reports_still_expose_no_office_assignment_or_service_area_crosswalk

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
- county_local_disability_resources: blocked_public_dhhs_office_stack_and_county_reports_without_office_assignment_contract (Reviewed 2026-06-25 one more bounded official Maine DHHS/OFI county-local pass. The public DHHS office stack still behaves exactly as before: the district office page preserves office towns, addresses, phones, emails, map shortlinks, and OFI program links, but no county-served or service-area fields; the same-host contact root, administrative offices page, offices/divisions hub, and DHHS sitemap also stay public while exposing no county crosswalk. The newly surfaced official OFI Data & Reports page adds real county-structured artifacts on the same host, including downloadable `Summary Counts By County.xlsx` and `Summary Counts By County And Town.xlsx` files. But those workbooks only preserve TANF/Food Supplement count columns by county and town; they expose zero office names, zero district-office identifiers, zero service-area labels, and zero county-to-office routing fields. Maine therefore still lacks any truthful county-to-office or county-to-service-area routing contract on the official public host family.)

## Failure ledger

- county_local_disability_resources: official_dhhs_office_stack_and_county_reports_expose_county_counts_but_zero_office_assignment_fields :: Reviewed 2026-06-25 bounded official Maine DHHS/OFI surfaces on `https://www.maine.gov/dhhs/about/contact/offices`, `https://www.maine.gov/dhhs/about/contact/`, `https://www.maine.gov/dhhs/about/contact/administrative-offices`, `https://www.maine.gov/dhhs/offices-divisions`, `https://www.maine.gov/dhhs/about/sitemap`, and `https://www.maine.gov/dhhs/ofi/about-us/data-reports`. The live district office page still preserves district office names, exact office towns and addresses, phones, emails, cross-office program notes, OFI program links, and `Show Map` shortlinks for Bangor, Biddeford, Calais, Caribou, Ellsworth, Machias, Portland, and Skowhegan. But the office page still exposes zero county names, zero county-served labels, and zero service-area fields in public HTML. The same-host follow-up pages remain public yet equally negative: the contact root, administrative offices page, offices/divisions page, and DHHS sitemap expose no county crosswalk and no alternate office-routing export. The OFI Data & Reports page does publish official county and county-and-town workbooks on the same host, including `May 2026 Summary Counts By County.xlsx` and `May 2026 Summary Counts By County And Town.xlsx`, but those sheets only contain TANF/Food Supplement summary count columns by county and town. They expose zero office names, zero district-office identifiers, and zero county-to-office routing fields. Maine therefore still has official county-coded program reports without any truthful county-to-office routing contract.

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
- county_local_disability_resources: blocked_public_dhhs_office_stack_and_county_reports_without_office_assignment_contract; samples=7; first=https://www.maine.gov/dhhs/about/contact/offices

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_official_maine_dhhs_or_ofi_surface_exposes_county_to_office_or_service_area_routing

## Completion decision

- Maine remains BLOCKED and not index-safe.
- Education remains cleared by the live official Superintendent-by-SAU and Superintendent-by-Town selectors.
- County-local remains blocked because the public DHHS office stack still exposes office-grade contact proof without county routing, and the newly surfaced official OFI county workbooks still contain only program counts rather than office-assignment fields.
