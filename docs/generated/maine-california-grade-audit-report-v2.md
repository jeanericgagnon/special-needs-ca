# Maine California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 16
- primary_gap_reason: official_dhhs_nav_stack_maine_search_and_ofi_reports_still_expose_office_addresses_labels_or_counts_but_no_county_or_service_area_contract

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
- county_local_disability_resources: blocked_public_dhhs_nav_stack_state_search_and_reports_without_county_to_office_or_service_area_assignment_contract (Reviewed 2026-06-25 one more bounded official Maine county-local pass across the live DHHS navigation stack, the official Maine search host, and the live OFI Data & Reports lane. District Office Locations, OFI Contact, OFI Programs & Services, Offices/Divisions, Administrative Office Locations, the DHHS sitemap, sampled `Show Map` shortlinks, the official Maine search query pages, the OFI Data & Reports index, and the live Geographic Distribution / Geographic Overflow PDFs still preserve office names, office towns, street addresses, phones, emails, program labels, office/division descriptions, map shortlinks, generic search-shell results, and county or county-and-town benefit counts, but they still expose zero county-served fields, zero service-area labels, and zero county-to-office assignment metadata. The reports PDFs materially strengthen the blocker because they prove the reports lane is live and county-aware, yet still counts-only rather than office-assignment crosswalks. Maine therefore still has official office-grade address proof and official county-count reporting without any truthful county-to-office or county-to-service-area routing contract on the public host family.)

## Failure ledger

- county_local_disability_resources: official_dhhs_nav_stack_maine_search_and_ofi_reports_confirm_office_addresses_or_counts_but_zero_county_assignment_fields :: Reviewed 2026-06-25 bounded official Maine DHHS/OFI navigation-stack surfaces on `https://www.maine.gov/dhhs/about/contact/offices`, `https://www.maine.gov/dhhs/ofi/about-us/contact`, `https://www.maine.gov/dhhs/ofi/programs-services`, `https://www.maine.gov/dhhs/ofi/about-us/data-reports`, `https://www.maine.gov/dhhs/offices-divisions`, `https://www.maine.gov/dhhs/about/contact/administrative-offices`, `https://www.maine.gov/dhhs/about/sitemap`, two representative `Show Map` shortlinks from the district office table, live official PDFs at `https://www.maine.gov/dhhs/sites/maine.gov.dhhs/files/inline-files/MayGEORevisedReport2026%20%28002%29.pdf` and `https://www.maine.gov/dhhs/sites/maine.gov.dhhs/files/inline-files/May%202026%20Geographich%20Overflow%20Report.pdf`, live official workbooks at `https://www.maine.gov/dhhs/sites/maine.gov.dhhs/files/inline-files/May%202026%20Summary%20Counts%20By%20County.xlsx` and `https://www.maine.gov/dhhs/sites/maine.gov.dhhs/files/inline-files/May%202026%20Summary%20Counts%20By%20County%20And%20Town.xlsx`, and official Maine search queries such as `https://www.maine.gov/search/?q=Aroostook%20district%20office%20dhhs` and `https://www.maine.gov/search/?q=county%20district%20office%20ofi`. The live district office page still preserves district office names, office towns and addresses, phones, emails, map shortlinks, and OFI program links, but zero county names, zero county-served labels, and zero service-area fields in public HTML. The OFI contact page still only points back to `District Office locations` and statewide eligibility/help routing. The OFI programs-and-services page stays live but exposes no county or office-assignment metadata. The Offices/Divisions page and Administrative Office Locations page add office and division descriptions plus administrative addresses such as Family Independence in Augusta and Health Insurance Marketplace in Portland, but still no county-served or service-area routing fields. The DHHS sitemap only reconfirms the same office leaves. The representative `Show Map` shortlinks resolved only to Google Maps address geocodes for `35 Anthony Ave, Augusta, ME 04330` and `19 Maine Ave, Bangor, ME 04401`, adding no county names, no district-office identifiers, and no county-to-office routing fields. The OFI Data & Reports page is live and publicly links `Geographic Distribution` and `Geographic Overflow` PDFs plus county and county-and-town spreadsheets, but the reviewed PDFs still contain only county-level and town-level program counts with no office names, no office identifiers, no county-served office assignments, and no service-area crosswalk. The official Maine search host returned `Maine.gov: Search IFW` pages that still only replay the generic portal shell with zero county-routing or district-office assignment results for the sampled county-targeted queries. Maine therefore still has official office addresses, labels, and county-count reporting without any public county-assignment contract.

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
- county_local_disability_resources: blocked_public_dhhs_nav_stack_state_search_and_reports_without_county_to_office_or_service_area_assignment_contract; samples=16; first=https://www.maine.gov/dhhs/about/contact/offices

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_official_maine_dhhs_ofi_or_maine_search_surface_exposes_county_to_office_or_service_area_routing

## Completion decision

- Maine remains BLOCKED and not index-safe.
- Education remains cleared by the live official Superintendent-by-SAU and Superintendent-by-Town selectors.
- County-local remains blocked because the full public DHHS navigation stack, official Maine search host, and live OFI reports lane still prove office locations, office labels, or county-count reporting, not county-to-office or service-area routing.
