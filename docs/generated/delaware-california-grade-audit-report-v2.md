# Delaware California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 3
- primary_gap_reason: district_grade_education_leafs_still_missing

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (reviewed live Delaware DOE navigation now preserves an exact statewide special-education authority leaf)
- district_or_county_education_routing: blocked_statewide_de_doe_root_rows_only (Reviewed 2026-06-22 bounded live Delaware DOE checks on the statewide special-education root, the legacy "For Districts and Charters" leaf, and the official public-school-list leaves discovered through the DOE WordPress sitemap. Those pages preserve statewide special-education authority and public-school list headings, but the fetched HTML still does not preserve district-owned special-education contact routing for Kent, New Castle, or Sussex. Delaware therefore still lacks county-grade district routing evidence.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party statewide support evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed first-party statewide support evidence is present at the required authority level)
- legal_aid: verified_state_grade (reviewed first-party statewide support evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_state_grade (The live DHSS State Service Centers page preserves county-grouped local office routing directly in HTML for New Castle, Kent, and Sussex.)

## Failure ledger

- district_or_county_education_routing: all_counties_still_use_statewide_de_doe_root :: Reviewed 2026-06-22 bounded live Delaware DOE checks on the statewide special-education root, the legacy "For Districts and Charters" leaf, and the official public-school-list leaves discovered through the DOE WordPress sitemap. Those pages preserve statewide special-education authority and public-school list headings, but the fetched HTML still does not preserve district-owned special-education contact routing for Kent, New Castle, or Sussex. Delaware therefore still lacks county-grade district routing evidence.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://dhss.delaware.gov/ddds/hcbs/eligibility.html
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.delaware.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.delaware.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://education.delaware.gov/families/k12/special-education/
- district_or_county_education_routing: blocked_statewide_de_doe_root_rows_only; samples=3; first=https://www.doe.k12.de.us/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://dhss.delaware.gov/ddds
- protection_and_advocacy: verified_state_grade; samples=1; first=http://www.declasi.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://picofdel.org/
- legal_aid: verified_state_grade; samples=1; first=http://www.declasi.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_state_grade; samples=1; first=https://dhss.delaware.gov/dss/division-of-social-services/state-service-centers/

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets

## Completion decision

- Delaware now has reviewed statewide special-education authority evidence again, because the live DOE navigation exposes an exact current special-education leaf that resolves to the legacy special-education page.
- Delaware now also has reviewed county-local office routing because the live DHSS State Service Centers page preserves county-grouped service-center listings directly in HTML for New Castle, Kent, and Sussex.
- Delaware still cannot reach California-grade or become index-safe because district routing remains unresolved after bounded DOE special-education, district-and-charter, and public-school-list checks failed to preserve district-owned special-education contacts.
- Delaware is therefore still BLOCKED and not index-safe, but only the education local-proof family remains blocked.
