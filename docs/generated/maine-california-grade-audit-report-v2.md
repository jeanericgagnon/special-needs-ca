# Maine California-Grade Batch 13 Report v1

- classification: UNSTARTED
- index_safe: false
- completeness_pct: 58
- county_count: 16
- primary_gap_reason: generic_or_statewide_evidence_used_where_local_required

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: missing (no credible current evidence)
- parent_training_information_center: inventory_only (only legacy inventory hints or weak role matches exist)
- legal_aid: missing (no credible current evidence)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 8 generic roots need leaf verification
- protection_and_advocacy: missing_required_source_family :: Protection and advocacy has no strong California-grade evidence for Maine.
- parent_training_information_center: legacy_or_inventory_only_evidence :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 8 generic roots need leaf verification
- legal_aid: missing_required_source_family :: Legal aid has no strong California-grade evidence for Maine.
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 8 generic roots need leaf verification

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.maine.gov/dhhs/oads/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.maine.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.maine.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.maine.gov/doe/learning/specialed
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://www.maine.gov/doe
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.maine.gov/dhhs/oads
- protection_and_advocacy: missing; samples=3; first=http://www.drme.org
- parent_training_information_center: inventory_only; samples=3; first=https://mpf.org
- legal_aid: missing; samples=0
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://dhhs.maine.gov/locations

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] protection_and_advocacy: author_or_verify_statewide_source_family
- [major] parent_training_information_center: author_verified_state_manifest
- [major] legal_aid: author_or_verify_statewide_source_family
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- Maine remains UNSTARTED and not index-safe because one or more critical families are still legacy, inventory-only, or missing.
