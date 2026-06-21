# Florida California-Grade Batch 1 Report v1

- classification: PARTIAL
- index_safe: false
- completeness_pct: 33
- county_count: 67
- primary_gap_reason: legacy_index_exposed_without_california_grade_reaudit

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)
- district_or_county_education_routing: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)
- vocational_rehabilitation_pre_ets: inventory_only (only legacy inventory hints or weak role matches exist)
- protection_and_advocacy: missing (no credible current evidence)
- parent_training_information_center: inventory_only (only legacy inventory hints or weak role matches exist)
- legal_aid: missing (no credible current evidence)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)

## Failure ledger

- launch_gate: legacy_index_exposed_without_california_grade_reaudit :: Legacy state report still labels Florida eligible/exposed, but California-grade audit has not re-proved county-grade gates.
- developmental_disability_idd_authority: generic_or_statewide_evidence_used_where_local_required :: 2 inventory rows use DB-field agency labels; 48 inventory rows show federal/state mismatch; 12 generic roots need leaf verification
- special_education_idea_part_b: legacy_or_inventory_only_evidence :: 2 inventory rows use DB-field agency labels; 48 inventory rows show federal/state mismatch; 12 generic roots need leaf verification
- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 2 inventory rows use DB-field agency labels; 48 inventory rows show federal/state mismatch; 12 generic roots need leaf verification
- vocational_rehabilitation_pre_ets: legacy_or_inventory_only_evidence :: 2 inventory rows use DB-field agency labels; 48 inventory rows show federal/state mismatch; 12 generic roots need leaf verification
- protection_and_advocacy: missing_required_source_family :: Protection and advocacy has no strong California-grade evidence for Florida.
- parent_training_information_center: legacy_or_inventory_only_evidence :: 2 inventory rows use DB-field agency labels; 48 inventory rows show federal/state mismatch; 12 generic roots need leaf verification
- legal_aid: missing_required_source_family :: Legal aid has no strong California-grade evidence for Florida.
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: 2 inventory rows use DB-field agency labels; 48 inventory rows show federal/state mismatch; 12 generic roots need leaf verification

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.floridahealth.gov/individual-family-health/child-infant-youth/special-health-care-needs/cms/
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=3; first=https://apd.myflorida.com/cdcplus/
- developmental_disability_idd_authority: legacy_state_grade; samples=3; first=https://apd.myflorida.com/region/
- early_intervention_part_c: verified_state_grade; samples=3; first=https://www.floridaearlysteps.com
- special_education_idea_part_b: legacy_state_grade; samples=3; first=https://www.fdlrs.org
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://www.fldoe.org/academics/exceptional-student-edu/
- vocational_rehabilitation_pre_ets: inventory_only; samples=1; first=https://www.rehabworks.org/student-youth/
- protection_and_advocacy: missing; samples=3; first=https://thearc.org/chapter/advocacy-resource-center-marion-inc/
- parent_training_information_center: inventory_only; samples=3; first=https://fndusa.org
- legal_aid: missing; samples=0
- able_program: verified_state_grade; samples=1; first=https://www.ableunited.com/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/benefits/disability/apply-child.html
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://myaccess.myflfamilies.com

## Next actions

- [critical] launch_gate: keep_noindex_and_run_state_repair_lane
- [critical] developmental_disability_idd_authority: author_county_or_district_exact_targets
- [major] special_education_idea_part_b: author_verified_state_manifest
- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] vocational_rehabilitation_pre_ets: author_verified_state_manifest
- [major] protection_and_advocacy: author_or_verify_statewide_source_family
- [major] parent_training_information_center: author_verified_state_manifest
- [major] legal_aid: author_or_verify_statewide_source_family
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- Florida remains PARTIAL and not index-safe because one or more critical families are still legacy, inventory-only, or missing.
