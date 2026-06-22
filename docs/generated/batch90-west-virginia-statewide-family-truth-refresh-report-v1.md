# West Virginia California-Grade Batch 90 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 75
- county_count: 55
- primary_gap_reason: generic_or_statewide_evidence_used_where_local_required

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party DRWV artifact explicitly preserves statewide protection-and-advocacy rights and referral language on the live domain)
- parent_training_information_center: verified_state_grade (reviewed first-party WVPTI artifact explicitly preserves the state Parent Training Center role on the live domain)
- legal_aid: missing (no credible current evidence)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 8 generic roots need leaf verification
- legal_aid: missing_required_source_family :: Legal aid has no strong California-grade evidence for West Virginia.
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 8 generic roots need leaf verification

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ssa.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://dhhr.wv.gov/bms/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.west-virginia.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.west-virginia.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://wvde.us/
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://wvde.us/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://dhhr.wv.gov/bms
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.drofwv.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://wvpti.org
- legal_aid: missing; samples=0
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://doi.org/10.7910/DVN/AVRHMI

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] legal_aid: author_or_verify_statewide_source_family
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- West Virginia no longer belongs in UNSTARTED because the packet already preserves reviewed first-party statewide protection-and-advocacy and PTI evidence on disk instead of only weak inventory hints.
- Disability Rights of West Virginia now truthfully satisfies statewide protection and advocacy because the reviewed first-party artifact explicitly states that it protects and advocates for the human and legal rights of persons with disabilities and provides information and referral services.
- WVPTI now truthfully satisfies the statewide PTI family because the reviewed first-party artifact explicitly states that it serves as West Virginia’s Parent Training Center.
- West Virginia still cannot reach California-grade or become index-safe because district or county education routing still depends on statewide or structural evidence instead of county- or district-owned leaves, county/local disability resources still depend on generic or structural office evidence instead of reviewed county-grade local-office proof, and statewide legal-aid evidence is still missing on disk.
- West Virginia is therefore terminal BLOCKED, not COMPLETE.
