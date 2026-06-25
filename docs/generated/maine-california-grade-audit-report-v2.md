# Maine California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 16
- primary_gap_reason: official_dhhs_office_page_and_same_host_contact_sitemap_surfaces_still_expose_no_county_or_service_area_crosswalk

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
- county_local_disability_resources: blocked_district_office_locations_and_same_host_followups_without_county_crosswalk (Reviewed 2026-06-25 one more bounded official Maine DHHS county-local pass against the current public host family only: `https://www.maine.gov/dhhs/about/contact/offices`, `https://www.maine.gov/dhhs/about/contact/`, `https://www.maine.gov/dhhs/about/contact/administrative-offices`, `https://www.maine.gov/dhhs/offices-divisions`, and `https://www.maine.gov/dhhs/about/sitemap`. The live district office page still preserves office towns, addresses, phones, emails, map shortlinks, and OFI program links for Bangor, Biddeford, Calais, Caribou, Ellsworth, Machias, Portland, Skowhegan, and others, but it still exposes zero county names and zero service-area labels in public HTML. The same-host follow-up surfaces stay negative too: the DHHS contact root, offices/divisions page, administrative offices page, and DHHS sitemap all remain public but still expose no county-served fields, no service-area crosswalk, and no alternate county-grade office export on the current official host family. Maine therefore remains blocked because the current official DHHS public stack still has office-grade contact proof without a truthful county-to-office routing contract.)

## Failure ledger

- county_local_disability_resources: official_dhhs_office_page_and_same_host_followups_expose_zero_county_or_service_area_fields :: Reviewed 2026-06-25 bounded official Maine checks on `https://www.maine.gov/dhhs/about/contact/offices`, `https://www.maine.gov/dhhs/about/contact/`, `https://www.maine.gov/dhhs/about/contact/administrative-offices`, `https://www.maine.gov/dhhs/offices-divisions`, and `https://www.maine.gov/dhhs/about/sitemap`. The live district office page preserves district office names, exact office towns and addresses, phones, emails, cross-office program notes, OFI program links, and `Show Map` shortlinks for Bangor, Biddeford, Calais, Caribou, Ellsworth, Machias, Portland, and Skowhegan. But the office page still exposes zero county names such as Aroostook, Washington, or York, zero county-served labels, and zero service-area fields in public HTML. The same-host follow-up pages remain public yet equally negative: the contact root, administrative offices page, offices/divisions page, and DHHS sitemap all expose no county crosswalk and no alternate county-grade office export or service-area table. Maine therefore still has office-grade evidence without a truthful county-to-office routing contract on the current official public host family.

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
- county_local_disability_resources: blocked_district_office_locations_and_same_host_followups_without_county_crosswalk; samples=5; first=https://www.maine.gov/dhhs/about/contact/offices

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_official_maine_dhhs_county_or_service_area_crosswalk_is_publicly_reviewable

## Completion decision

- Maine remains BLOCKED and not index-safe.
- Education remains cleared by the live official Superintendent-by-SAU and Superintendent-by-Town selectors.
- County-local remains blocked because the official DHHS office page plus the bounded same-host contact, sitemap, offices/divisions, and administrative-office follow-ups still expose no county or service-area crosswalk in public HTML.
