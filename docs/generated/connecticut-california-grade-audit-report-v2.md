# Connecticut California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 8
- primary_gap_reason: district_grade_education_and_official_county_office_directory_leaves_still_missing

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_statewide_ct_sde_fallback_rows_only (Reviewed 2026-06-22 bounded live checks on the exact Connecticut SDE special-education leaf https://portal.ct.gov/sde/special-education, the generic SDE root https://portal.ct.gov/sde, and the official EdSight portal https://edsight.ct.gov/. The special-education leaf exposed no district-directory links beyond itself, the SDE root exposed only statewide Bureau/central-office and data-portal links, and EdSight described statewide reports about schools and districts but did not preserve district-owned special-education routing contacts. No district-grade education leaf is currently verified for any of Connecticut’s 8 counties.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (The live first-party CPAC About page now explicitly preserves federally funded Parent Training and Information (PTI) Center designation text.)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_doi_and_generic_locations_rows_only (Reviewed 2026-06-22 bounded live checks on the Connecticut DSS root https://portal.ct.gov/dss/home plus likely office-location leaves https://portal.ct.gov/dss/common-elements/office-locations and https://portal.ct.gov/dss/common-elements/search-dss-office-locations. The DSS home exposed statewide program/help and hearing links only, and both office-location guesses returned HTTP 404, so no reviewed official county office directory leaf currently replaces the DOI mirror office rows.)

## Failure ledger

- district_or_county_education_routing: all_counties_still_use_statewide_ct_sde_roots :: Reviewed 2026-06-22 bounded live checks on the exact Connecticut SDE special-education leaf https://portal.ct.gov/sde/special-education, the generic SDE root https://portal.ct.gov/sde, and the official EdSight portal https://edsight.ct.gov/. The special-education leaf exposed no district-directory links beyond itself, the SDE root exposed only statewide Bureau/central-office and data-portal links, and EdSight described statewide reports about schools and districts but did not preserve district-owned special-education routing contacts. No district-grade education leaf is currently verified for any of Connecticut’s 8 counties.
- county_local_disability_resources: county_office_rows_still_backed_by_doi_or_generic_locations_root :: Reviewed 2026-06-22 bounded live checks on the Connecticut DSS root https://portal.ct.gov/dss/home plus likely office-location leaves https://portal.ct.gov/dss/common-elements/office-locations and https://portal.ct.gov/dss/common-elements/search-dss-office-locations. The DSS home exposed statewide program/help and hearing links only, and both office-location guesses returned HTTP 404, so no reviewed official county office directory leaf currently replaces the DOI mirror office rows.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://portal.ct.gov/dds/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.connecticut.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.connecticut.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://portal.ct.gov/sde/special-education
- district_or_county_education_routing: blocked_statewide_ct_sde_fallback_rows_only; samples=3; first=https://portal.ct.gov/sde/special-education
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://portal.ct.gov/dds
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.disrightsct.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://cpacinc.org/about.aspx
- legal_aid: verified_state_grade; samples=1; first=https://www.disrightsct.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_doi_and_generic_locations_rows_only; samples=3; first=https://doi.org/10.7910/DVN/AVRHMI

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- Connecticut still cannot reach California-grade or become index-safe because district routing remains unresolved after bounded checks of the exact SDE and EdSight leaves, and county-local office routing still lacks a reviewed official county office directory leaf after bounded DSS location-path checks.
- CPAC is no longer a blocker because the live first-party About page explicitly preserves federally funded Parent Training and Information (PTI) Center designation text.
- Connecticut is therefore still BLOCKED and not index-safe, but the remaining blockers are now reduced to the two local-proof families with sharper bounded-source evidence.
