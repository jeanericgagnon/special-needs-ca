# Arizona California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 92
- county_count: 15
- primary_gap_reason: bounded_2026_06_26_live_recheck_confirms_des_wrapper_still_403_salesforce_locator_still_live_and_no_public_greenlee_county_assignment_on_des_or_ahcccs

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_county_grade (Reviewed 2026-06-25 one more bounded official Arizona alternative-district lane from the live AZ School Report Cards inventory plus exact district-owned leaves. Coconino County remains cleared through the official CAVIAT detail route and live `https://www.caviat.org/page/504/` leaf. Mohave County now also clears: the official Arizona report-cards detail API for Mohave Valley Elementary District (`educationOrganizationId 4379`) preserved exact coordinates (`latitude 34.9104059`, `longitude -114.6000147`), and the official Census reverse geocoder at `https://geocoding.geo.census.gov/geocoder/geographies/coordinates` returns `Mohave County` from those coordinates. The same district-owned host preserves a live `https://www.mvesd16.org/page/special-services/` leaf plus a public `https://www.mvesd16.org/documents/special-education/3674` surface. Yavapai County also clears through a better official LEA than the prior dead-end accommodation root: the public Arizona report-cards entity list exposes Prescott Unified District (`educationOrganizationId 4466`) in Prescott, its detail API preserves exact coordinates (`latitude 34.5423444`, `longitude -112.4651411`), and the official Census reverse geocoder returns `Yavapai County` from those coordinates. The same district-owned host preserves a live `https://www.prescottschools.com/district-info/departments/ess` page titled `Exceptional Student Services` with rendered `Special Education`, `Procedural Safeguards`, and `Child Find` language, plus a public `Parents Rights Handbook` page on the same host. Arizona district_or_county_education_routing therefore now clears at county grade through reviewed official local leaves across all remaining counties.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed live first-party PTI designation text is present on the Encircle Families acknowledgements page)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_des_salesforce_locator_still_exposes_only_greenlee_locality_zip_coverage_without_explicit_greenlee_county_assignment (Reviewed 2026-06-26 one more bounded live Arizona county-local pass across the exact official DES, Salesforce, AHCCCS, and Greenlee-locality lanes. The official DES wrapper roots `https://des.az.gov/office-locator` and `https://des.az.gov/find-your-local-office` still return HTTP 403 `Just a moment...` shells. The linked public Salesforce-hosted DES office-locator app at `https://azdes-community.my.salesforce-sites.com/EOL/` still returns HTTP 200 and remains the only reviewable official DES county-local lane. The AHCCCS fallback family also remains unchanged: `https://www.azahcccs.gov/Members/ALTCSlocations.html` is still live, while the older `ALTCS_CountyMap.pdf` and `AHCCCScontacts.html` URLs still return HTTP 200 HTML stale shells instead of usable office-routing documents. The official Greenlee County health page plus first-party Clifton, Duncan, and Morenci town surfaces remain live, but they still do not name any DES or AHCCCS office assignment for Greenlee County. Arizona therefore still lacks one reviewed public official artifact that explicitly binds Greenlee County itself to a DES or AHCCCS office.)

## Failure ledger

- county_local_disability_resources: official_des_locator_still_lacks_explicit_greenlee_assignment_while_live_salesforce_and_ahcccs_fallbacks_remain_non_closing :: Reviewed 2026-06-26 one more bounded live Arizona county-local pass across the exact official DES, Salesforce, AHCCCS, and Greenlee-locality lanes. The official DES wrapper roots `https://des.az.gov/office-locator` and `https://des.az.gov/find-your-local-office` still return HTTP 403 `Just a moment...` shells. The linked public Salesforce-hosted DES office-locator app at `https://azdes-community.my.salesforce-sites.com/EOL/` still returns HTTP 200 and remains the only reviewable official DES county-local lane. The AHCCCS fallback family also remains unchanged: `https://www.azahcccs.gov/Members/ALTCSlocations.html` is still live, while the older `ALTCS_CountyMap.pdf` and `AHCCCScontacts.html` URLs still return HTTP 200 HTML stale shells instead of usable office-routing documents. The official Greenlee County health page plus first-party Clifton, Duncan, and Morenci town surfaces remain live, but they still do not name any DES or AHCCCS office assignment for Greenlee County. Arizona therefore still lacks one reviewed public official artifact that explicitly binds Greenlee County itself to a DES or AHCCCS office.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.azahcccs.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.azahcccs.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.azed.gov/specialeducation
- district_or_county_education_routing: verified_county_grade; samples=7; first=https://azreportcards.azed.gov/districts/Detail/79381
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://des.az.gov/ddd
- protection_and_advocacy: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://encirclefamilies.org/about-us/acknowledgements/
- legal_aid: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://www.azahcccs.gov
- county_local_disability_resources: blocked_des_salesforce_locator_still_exposes_only_greenlee_locality_zip_coverage_without_explicit_greenlee_county_assignment; samples=14; first=https://azdes-community.my.salesforce-sites.com/EOL/

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_des_or_ahcccs_publish_explicit_greenlee_county_assignment_or_reviewable_county_to_office_contract

## Completion decision

- Arizona remains BLOCKED and not index-safe.
- County-local routing is still blocked on one exact unresolved contract: a reviewed public DES or AHCCCS artifact that explicitly assigns Greenlee County to an office.
