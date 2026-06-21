# Illinois California-Grade Batch 3 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 50
- county_count: 102
- primary_gap_reason: generic_or_statewide_evidence_used_where_local_required

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)
- vocational_rehabilitation_pre_ets: missing (no credible current evidence)
- protection_and_advocacy: missing (no credible current evidence)
- parent_training_information_center: inventory_only (only legacy inventory hints or weak role matches exist)
- legal_aid: missing (no credible current evidence)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 44 inventory rows show federal/state mismatch; 10 generic roots need leaf verification
- vocational_rehabilitation_pre_ets: missing_required_source_family :: Vocational rehabilitation / Pre-ETS has no strong California-grade evidence for Illinois.
- protection_and_advocacy: missing_required_source_family :: Protection and advocacy has no strong California-grade evidence for Illinois.
- parent_training_information_center: legacy_or_inventory_only_evidence :: 4 inventory rows use DB-field agency labels; 44 inventory rows show federal/state mismatch; 10 generic roots need leaf verification
- legal_aid: missing_required_source_family :: Legal aid has no strong California-grade evidence for Illinois.
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 44 inventory rows show federal/state mismatch; 10 generic roots need leaf verification

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.dhs.state.il.us/page.aspx?item=29737
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=3; first=https://www.dhs.state.il.us/page.aspx?item=47257
- developmental_disability_idd_authority: verified_state_grade; samples=3; first=https://www.dhs.state.il.us/page.aspx?item=31182
- early_intervention_part_c: verified_state_grade; samples=0
- special_education_idea_part_b: verified_state_grade; samples=3; first=https://www.roe1.net
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://www.roe1.net
- vocational_rehabilitation_pre_ets: missing; samples=0
- protection_and_advocacy: missing; samples=1; first=https://www.equipforequality.org
- parent_training_information_center: inventory_only; samples=1; first=https://www.fmptic.org
- legal_aid: missing; samples=0
- able_program: verified_state_grade; samples=1; first=https://illinoisable.com/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/benefits/disability/apply-child.html
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://www.dhs.state.il.us/page.aspx?item=33612

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] vocational_rehabilitation_pre_ets: author_or_verify_statewide_source_family
- [major] protection_and_advocacy: author_or_verify_statewide_source_family
- [major] parent_training_information_center: author_verified_state_manifest
- [major] legal_aid: author_or_verify_statewide_source_family
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- Illinois remains BLOCKED and not index-safe because one or more critical families are still legacy, inventory-only, or missing.
