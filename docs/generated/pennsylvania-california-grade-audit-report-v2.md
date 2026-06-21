# Pennsylvania California-Grade Audit Report v2

- classification: PARTIAL
- index_safe: false
- completeness_pct: 58
- county_count: 67
- primary_gap_reason: county_grade_coverage_still_incomplete_after_exact_target_verification

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: exact_leaf_targets_verified_partial (Reviewed Pennsylvania district exact leaves verified (5), but 59/67 school-district routing rows still point to the generic PDE Intermediate Units directory instead of county/district exact leaves.)
- vocational_rehabilitation_pre_ets: inventory_only (only legacy inventory hints or weak role matches exist)
- protection_and_advocacy: missing (no credible current evidence)
- parent_training_information_center: inventory_only (only legacy inventory hints or weak role matches exist)
- legal_aid: missing (no credible current evidence)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_state_grade (Official county MH/ID offices page lists verified county office coverage across 67/67 Pennsylvania counties.)

## Failure ledger

- district_or_county_education_routing: generic_intermediate_unit_directory_still_used_for_county_grade_routing :: 59/67 Pennsylvania district-routing rows still use https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx; only 5 reviewed district-owned exact leaves are currently proven (https://www.pghschools.org/academics/pse-special-education/pse-special-education, https://readingsdpa.sites.thrillshare.com/o/rsd/page/special-education, https://readingsdpa.sites.thrillshare.com/o/rsd/page/student-services, https://www.pennsburysd.org/departments/special_education, https://www.pennsburysd.org/departments/student_services).
- vocational_rehabilitation_pre_ets: legacy_or_inventory_only_evidence :: 14 inventory rows use DB-field agency labels; 43 inventory rows show federal/state mismatch; 15 generic roots need leaf verification
- protection_and_advocacy: missing_required_source_family :: Protection and advocacy has no strong California-grade evidence for Pennsylvania.
- parent_training_information_center: legacy_or_inventory_only_evidence :: 14 inventory rows use DB-field agency labels; 43 inventory rows show federal/state mismatch; 15 generic roots need leaf verification
- legal_aid: missing_required_source_family :: Legal aid has no strong California-grade evidence for Pennsylvania.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.dhs.pa.gov/Services/Disabilities-Aging/Pages/ODP-Waivers.aspx
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=3; first=https://www.dhs.pa.gov/Services/Disabilities-Aging/Pages/ODP-Waivers.aspx
- developmental_disability_idd_authority: verified_state_grade; samples=3; first=https://www.alleghenycounty.us/Human-Services/About/Offices/Developmental-Disabilities.aspx
- early_intervention_part_c: verified_state_grade; samples=3; first=https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html
- special_education_idea_part_b: verified_state_grade; samples=3; first=https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx
- district_or_county_education_routing: exact_leaf_targets_verified_partial; samples=5; first=https://www.pghschools.org/academics/pse-special-education/pse-special-education
- vocational_rehabilitation_pre_ets: inventory_only; samples=0
- protection_and_advocacy: missing; samples=3; first=https://www.disabilityrightspa.org
- parent_training_information_center: inventory_only; samples=3; first=https://pealcenter.org
- legal_aid: missing; samples=0
- able_program: verified_state_grade; samples=1; first=https://www.paable.gov/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/benefits/disability/apply-child.html
- county_local_disability_resources: verified_state_grade; samples=67; first=https://www.pa.gov/agencies/dhs/contact/county-mh-id-offices

## Next actions

- [critical] district_or_county_education_routing: replace_generic_intermediate_unit_directory_rows_with_county_or_district_exact_leaves
- [major] vocational_rehabilitation_pre_ets: author_verified_state_manifest
- [major] protection_and_advocacy: author_or_verify_statewide_source_family
- [major] parent_training_information_center: author_verified_state_manifest
- [major] legal_aid: author_or_verify_statewide_source_family

## Batch 32 Pennsylvania education blocker audit

- verified exact district leaves still proven: 5
- generic Intermediate Units directory rows remaining: 59/67
- next repair lane: replace_generic_intermediate_unit_directory_rows_with_county_or_district_exact_leaves
- blocker URL still overused: https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx
