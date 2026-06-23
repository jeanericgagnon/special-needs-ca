# Maine California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 16
- primary_gap_reason: official_live_org_selector_posts_return_500_and_dhhs_office_directory_lacks_county_or_town_mapping

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_live_public_org_selector_with_session_post_500 (Maine now has stronger official education blocker evidence: the live NEO contact page publicly exposes the full organization selector and CSRF token in HTML, but a sessioned submit with a real OrgId still returns HTTP 500 before any local contact rows or export file are returned. All 16 county education rows still depend on statewide DOE fallbacks, so the next honest lane remains reviewed browser-assisted capture or manual export from the official selector, not more replay variations.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed first-party PTI designation evidence is present at the required authority level)
- legal_aid: verified_state_grade (Reviewed Pine Tree Legal Assistance now provides direct statewide Maine legal-aid evidence.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_district_office_locations_without_county_mapping (Maine now has sharper county-office blocker evidence: the live DHHS district office page is a real office-grade directory with addresses, phones, emails, and cross-office program notes, but it still does not publish county labels, town lookup, or service-area boundaries that would let a county row be mapped truthfully. DOI mirror rows and dead locator fallbacks therefore still need a reviewed mapping contract before any county can upgrade.)

## Failure ledger

- district_or_county_education_routing: official_live_org_selector_and_session_post_return_500 :: Reviewed 2026-06-23 current Maine education blocker artifacts plus one new live official session probe. The public NEO Primary Contacts By Organization page now proves a real result contract exists because the HTML embeds the __RequestVerificationToken, the POST action /DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU, and the live OrgId catalog including Portland Public Schools (OrgId 364) and York Public Schools (OrgId 542). A bounded cookie-backed submit using the live token and OrgId 364 still returns HTTP 500 and a response shell titled NEO Contact Search [ v2.0.0.0 - A3 ] before any verified local contact rows or export file appear. Fourteen county rows still point at https://www.maine.gov/doe/learning/specialed and two still point at https://www.maine.gov/doe, so Maine remains blocked on reviewed manual export or browser-assisted capture rather than speculative POST retries.
- county_local_disability_resources: official_district_office_pages_lack_county_coverage_contract :: Reviewed 2026-06-23 current Maine county-office blocker artifacts plus the live DHHS District Office Locations page. The official page preserves real office-grade evidence such as addresses, phones, emails, and program-routing notes like For Long Term Care questions: see Machias Office and For Child Support services: see Lewiston Office. But the page still does not expose county labels, town lists, or service-area boundaries for those offices, so those cross-office notes cannot be promoted into county coverage proof. Sixteen current county-office rows still depend on the DOI mirror source https://doi.org/10.7910/DVN/AVRHMI and four still use the dead https://dhhs.maine.gov/locations fallback, with Aroostook, Washington, and York remaining multi-office counties.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.maine.gov/dhhs/oads/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.maine.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.maine.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.maine.gov/doe/learning/specialed
- district_or_county_education_routing: blocked_live_public_org_selector_with_session_post_500; samples=4; first=https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.maine.gov/dhhs/oads
- protection_and_advocacy: verified_state_grade; samples=1; first=https://drme.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.mpf.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.ptla.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_district_office_locations_without_county_mapping; samples=1; first=https://www.maine.gov/dhhs/about/contact/offices

## Next actions

- [critical] district_or_county_education_routing: use_live_public_org_selector_packet_for_reviewed_browser_capture_or_manual_export
- [critical] county_local_disability_resources: find_reviewed_county_or_town_to_district_office_contract_or_keep_mapped_counties_blocked

## Completion decision

- Maine remains BLOCKED and not index-safe.
- Education is still blocked because the official NEO contact selector is definitely live and public, but a sessioned submit against the real form still returns HTTP 500 before any district-grade contact rows or export file are returned.
- County-local is still blocked because the DHHS office page is office-grade and program-aware, but still never publishes county or town coverage boundaries that would support truthful county mapping.

