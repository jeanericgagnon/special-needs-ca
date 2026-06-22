# Washington California-Grade Batch 89 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 67
- county_count: 39
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
- parent_training_information_center: verified_state_grade (reviewed first-party WAPAVE artifact explicitly preserves the Parent Training and Information Program (PTI) on the live domain)
- legal_aid: missing (no credible current evidence)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 32 generic roots need leaf verification
- protection_and_advocacy: missing_required_source_family :: Protection and advocacy has no strong California-grade evidence for Washington.
- legal_aid: missing_required_source_family :: Legal aid has no strong California-grade evidence for Washington.
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 32 generic roots need leaf verification

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ssa.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.dshs.wa.gov/dda/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.washington.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.washington.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.k12.wa.us/student-success/special-education
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://www.k12.wa.us/student-success/special-education
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.dshs.wa.gov/dda
- protection_and_advocacy: missing; samples=0
- parent_training_information_center: verified_state_grade; samples=1; first=https://wapave.org/parent-training-and-information-program/
- legal_aid: missing; samples=0
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://dhhs.washington.gov/locations

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] protection_and_advocacy: author_or_verify_statewide_source_family
- [major] legal_aid: author_or_verify_statewide_source_family
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- Washington no longer belongs in UNSTARTED because the packet already preserves reviewed first-party statewide PTI evidence on disk instead of only weak inventory hints.
- WAPAVE now truthfully satisfies the statewide PTI family because the reviewed first-party artifact explicitly preserves the Parent Training and Information Program (PTI) on the live domain.
- Washington still cannot reach California-grade or become index-safe because district or county education routing still depends on statewide or structural evidence instead of county- or district-owned leaves, county/local disability resources still depend on statewide locator-derived office evidence instead of reviewed county-grade local-office proof, and reviewed first-party P&A plus legal-aid artifacts are still missing on disk.
- Washington is therefore terminal BLOCKED, not COMPLETE.
