# Pennsylvania California-Grade Batch 1 Report v1

- classification: PARTIAL
- index_safe: false
- completeness_pct: 50
- county_count: 67
- primary_gap_reason: legacy_index_exposed_without_california_grade_reaudit

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

- launch_gate: legacy_index_exposed_without_california_grade_reaudit :: Legacy state report still labels Pennsylvania eligible/exposed, but California-grade audit has not re-proved county-grade gates.
- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 14 inventory rows use DB-field agency labels; 43 inventory rows show federal/state mismatch; 15 generic roots need leaf verification
- vocational_rehabilitation_pre_ets: legacy_or_inventory_only_evidence :: 14 inventory rows use DB-field agency labels; 43 inventory rows show federal/state mismatch; 15 generic roots need leaf verification
- protection_and_advocacy: missing_required_source_family :: Protection and advocacy has no strong California-grade evidence for Pennsylvania.
- parent_training_information_center: legacy_or_inventory_only_evidence :: 14 inventory rows use DB-field agency labels; 43 inventory rows show federal/state mismatch; 15 generic roots need leaf verification
- legal_aid: missing_required_source_family :: Legal aid has no strong California-grade evidence for Pennsylvania.
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: 14 inventory rows use DB-field agency labels; 43 inventory rows show federal/state mismatch; 15 generic roots need leaf verification

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.dhs.pa.gov/Services/Disabilities-Aging/Pages/ODP-Waivers.aspx
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=3; first=https://www.dhs.pa.gov/Services/Disabilities-Aging/Pages/ODP-Waivers.aspx
- developmental_disability_idd_authority: verified_state_grade; samples=3; first=https://www.alleghenycounty.us/Human-Services/About/Offices/Developmental-Disabilities.aspx
- early_intervention_part_c: verified_state_grade; samples=3; first=https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html
- special_education_idea_part_b: verified_state_grade; samples=3; first=https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx
- vocational_rehabilitation_pre_ets: inventory_only; samples=0
- protection_and_advocacy: missing; samples=3; first=https://www.disabilityrightspa.org
- parent_training_information_center: inventory_only; samples=3; first=https://pealcenter.org
- legal_aid: missing; samples=0
- able_program: verified_state_grade; samples=1; first=https://www.paable.gov/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/benefits/disability/apply-child.html
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://doi.org/10.7910/DVN/AVRHMI

## Next actions

- [critical] launch_gate: keep_noindex_and_run_state_repair_lane
- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] vocational_rehabilitation_pre_ets: author_verified_state_manifest
- [major] protection_and_advocacy: author_or_verify_statewide_source_family
- [major] parent_training_information_center: author_verified_state_manifest
- [major] legal_aid: author_or_verify_statewide_source_family
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- Pennsylvania remains PARTIAL and not index-safe because one or more critical families are still legacy, inventory-only, or missing.
