# Oklahoma California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 77
- primary_gap_reason: generic_state_education_page_collapse_and_dead_dhhs_locator_host

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_generic_state_page_collapse (the only live Oklahoma education leaf guess collapses back to a generic state education page instead of a district-owned or county-grade routing leaf)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party Disability Rights Oklahoma evidence preserves statewide disability-rights and advocacy identity)
- parent_training_information_center: verified_state_grade (reviewed first-party Oklahoma Parents Center evidence preserves statewide Parent Training and Information identity and Oklahoma special-education support language)
- legal_aid: verified_state_grade (reviewed first-party Legal Aid Services of Oklahoma evidence preserves statewide legal-aid identity and Oklahoma-specific help language)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_dead_statewide_locator_and_planning_rows (the current statewide DHHS locations host fails DNS and the remaining county rows still depend on dead-locator or DOI planning evidence)

## Failure ledger

- district_or_county_education_routing: education_leaf_guesses_collapse_to_generic_state_page :: Reviewed 2026-06-23 bounded live Oklahoma education checks. The only live school-district source URL on disk is the state root `https://sde.ok.gov/`, and `https://sde.ok.gov/special-education` plus in-site search guesses for district directory and special education all return HTTP 200 only by collapsing to the same generic Oklahoma State Department of Education page at `https://oklahoma.gov/education.html?page=543`. No district-owned or county-grade routing leaf is verified from this bounded pass.
- county_local_disability_resources: dead_dhhs_locator_host_plus_doi_planning_rows :: Reviewed 2026-06-23 bounded live Oklahoma county-local checks. The current statewide locator source `https://dhhs.oklahoma.gov/locations` now fails DNS resolution, while the remaining county-office rows still split between that dead locator host and the DOI-hosted planning dataset. No live county-owned or state-maintained county office directory was verified in this bounded pass.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://oklahoma.gov/okdhs/services/dds/hcbs/eligibility.html
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.oklahoma.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.oklahoma.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://sde.ok.gov/
- district_or_county_education_routing: blocked_generic_state_page_collapse; samples=3; first=https://sde.ok.gov/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://oklahoma.gov/okdhs/services/dds
- protection_and_advocacy: verified_state_grade; samples=1; first=https://okdlc.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://oklahomaparentscenter.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.legalaidok.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_dead_statewide_locator_and_planning_rows; samples=3; first=https://dhhs.oklahoma.gov/locations

## Next actions

- [critical] district_or_county_education_routing: hold_blocked_until_new_exact_district_or_county_education_leaves_are_authored
- [critical] county_local_disability_resources: hold_blocked_until_new_live_county_grade_directory_or_county_owned_leaves_are_verified

## Completion decision

- Oklahoma no longer lacks statewide first-party support proof for protection_and_advocacy or legal_aid.
- Oklahoma still cannot reach California-grade or become index-safe because district or county education routing still has no district-owned leaf beyond a generic state page collapse, and county/local disability resources still have no live county-grade directory after the DHHS locator host failed DNS resolution.
- Oklahoma therefore remains BLOCKED, not COMPLETE.
