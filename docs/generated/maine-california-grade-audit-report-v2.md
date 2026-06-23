# Maine California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 16
- primary_gap_reason: public_neo_selector_inventory_is_live_but_result_export_actions_return_500_and_dhhs_office_directory_lacks_county_or_town_mapping

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_live_public_org_selector_with_session_post_500 (Maine now has a narrower official education blocker: the public NEO Town selector, the public Primary Contacts By Organization selector, and the official SAU-by-municipality workbook are all live and reviewable on simple GET requests. The failure is concentrated in the result/export step: once a real OrgId is submitted, the official workflow still returns HTTP 500 before any district-grade contact rows or export file appear. All 16 county education rows still depend on statewide DOE fallbacks, so the next honest lane is reviewed browser/manual capture from the already-live selectors rather than more selector discovery.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed first-party PTI designation evidence is present at the required authority level)
- legal_aid: verified_state_grade (Reviewed Pine Tree Legal Assistance now provides direct statewide Maine legal-aid evidence.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_district_office_locations_without_county_mapping (Maine now has sharper county-office blocker evidence: the live DHHS district office page is a real office-grade directory with addresses, phones, emails, and cross-office program notes, but it still does not publish county labels, town lookup, or service-area boundaries that would let a county row be mapped truthfully. DOI mirror rows and dead locator fallbacks therefore still need a reviewed mapping contract before any county can upgrade.)

## Failure ledger

- district_or_county_education_routing: public_selector_inventory_live_but_result_export_actions_return_500 :: Reviewed 2026-06-23 bounded live official Maine education checks on https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town, https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU, https://neo.maine.gov/doe/neo/SuperSearch/Home/Index, and the official workbook https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx. The public Town selector page is live and reviewable with a full municipality dropdown, the public Primary Contacts By Organization page is live and reviewable with a full organization catalog, and the SAU-by-municipality workbook is still downloadable on the official DOE host. So Maine no longer has a selector-discovery problem. The blocker is narrower: a bounded cookie-backed submit using a real OrgId still returns HTTP 500 and the NEO Contact Search shell before any verified local contact rows or export file appear. Fourteen county rows still point at https://www.maine.gov/doe/learning/specialed and two still point at https://www.maine.gov/doe, so Maine remains blocked on reviewed browser/manual capture from these already-live selectors rather than speculative POST or discovery retries.
- county_local_disability_resources: official_district_office_pages_lack_county_coverage_contract :: Reviewed 2026-06-23 current Maine county-office blocker artifacts plus the live DHHS District Office Locations page. The official page preserves real office-grade evidence such as addresses, phones, emails, and program-routing notes like For Long Term Care questions: see Machias Office and For Child Support services: see Lewiston Office. But the page still does not expose county labels, town lists, or service-area boundaries for those offices, so those cross-office notes cannot be promoted into county coverage proof. Sixteen current county-office rows still depend on the DOI mirror source https://doi.org/10.7910/DVN/AVRHMI and four still use the dead https://dhhs.maine.gov/locations fallback, with Aroostook, Washington, and York remaining multi-office counties.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.maine.gov/dhhs/oads/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.maine.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.maine.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.maine.gov/doe/learning/specialed
- district_or_county_education_routing: blocked_live_public_org_selector_with_session_post_500; samples=4; first=https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.maine.gov/dhhs/oads
- protection_and_advocacy: verified_state_grade; samples=1; first=https://drme.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.mpf.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.ptla.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_district_office_locations_without_county_mapping; samples=1; first=https://www.maine.gov/dhhs/about/contact/offices

## Next actions

- [critical] district_or_county_education_routing: use_live_town_and_org_selectors_plus_workbook_for_reviewed_browser_capture_or_manual_export
- [critical] county_local_disability_resources: find_reviewed_county_or_town_to_district_office_contract_or_keep_mapped_counties_blocked

## Completion decision

- Maine remains BLOCKED and not index-safe.
- Education is still blocked, but the selector inventory is now clearly public and complete enough to support manual/browser capture without reopening discovery.
- County-local is still blocked because the DHHS office page remains office-grade only and still lacks county or town coverage boundaries.
