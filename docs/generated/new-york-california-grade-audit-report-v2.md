# New York California-Grade Batch 2 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 50
- county_count: 62
- primary_gap_reason: generic_or_statewide_evidence_used_where_local_required

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)
- vocational_rehabilitation_pre_ets: inventory_only (only legacy inventory hints or weak role matches exist)
- protection_and_advocacy: missing (no credible current evidence)
- parent_training_information_center: inventory_only (only legacy inventory hints or weak role matches exist)
- legal_aid: missing (no credible current evidence)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 9 inventory rows use DB-field agency labels; 44 inventory rows show federal/state mismatch; 18 generic roots need leaf verification
- vocational_rehabilitation_pre_ets: legacy_or_inventory_only_evidence :: 9 inventory rows use DB-field agency labels; 44 inventory rows show federal/state mismatch; 18 generic roots need leaf verification
- protection_and_advocacy: missing_required_source_family :: Protection and advocacy has no strong California-grade evidence for New York.
- parent_training_information_center: legacy_or_inventory_only_evidence :: 9 inventory rows use DB-field agency labels; 44 inventory rows show federal/state mismatch; 18 generic roots need leaf verification
- legal_aid: missing_required_source_family :: Legal aid has no strong California-grade evidence for New York.
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: 9 inventory rows use DB-field agency labels; 44 inventory rows show federal/state mismatch; 18 generic roots need leaf verification

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.nysed.gov/career-development-and-studies/adult-career-and-continuing-education-services
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://opwdd.ny.gov/services-support/home-community-based-services-waiver
- developmental_disability_idd_authority: verified_state_grade; samples=3; first=https://opwdd.ny.gov/get-started/front-door
- early_intervention_part_c: verified_state_grade; samples=3; first=https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm
- special_education_idea_part_b: verified_state_grade; samples=3; first=https://www.btboces.org
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://www.brentwood.k12.ny.us
- vocational_rehabilitation_pre_ets: inventory_only; samples=0
- protection_and_advocacy: missing; samples=3; first=https://thearc.org/chapter/advocacy-and-resource-center/
- parent_training_information_center: inventory_only; samples=3; first=http://www.parentnetworkwny.org
- legal_aid: missing; samples=0
- able_program: verified_state_grade; samples=1; first=https://www.mynyable.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://www.health.ny.gov/health_care/medicaid/redesign/cdpap.htm
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://www.health.ny.gov/health_care/medicaid/ldss.htm

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] vocational_rehabilitation_pre_ets: author_verified_state_manifest
- [major] protection_and_advocacy: author_or_verify_statewide_source_family
- [major] parent_training_information_center: author_verified_state_manifest
- [major] legal_aid: author_or_verify_statewide_source_family
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- New York remains BLOCKED and not index-safe because one or more critical families are still legacy, inventory-only, or missing.
