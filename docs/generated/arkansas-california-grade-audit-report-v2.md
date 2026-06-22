# Arkansas California-Grade Batch 6 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 75
- primary_gap_reason: generic_or_statewide_evidence_used_where_local_required

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party statewide support evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed first-party statewide support evidence is present at the required authority level)
- legal_aid: verified_state_grade (reviewed first-party statewide support evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 5 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 10 generic roots need leaf verification
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: 5 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 10 generic roots need leaf verification

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://humanservices.arkansas.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.arkansas.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.arkansas.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://dese.ade.arkansas.gov/
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://dese.ade.arkansas.gov/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://humanservices.arkansas.gov/dds
- protection_and_advocacy: verified_state_grade; samples=1; first=https://disabilityrightsar.org/
- parent_training_information_center: verified_state_grade; samples=1; first=http://thecenterforexceptionalfamilies.org/
- legal_aid: verified_state_grade; samples=1; first=https://disabilityrightsar.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://dhhs.arkansas.gov/locations

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- Arkansas no longer belongs in UNSTARTED. Reviewed first-party Disability Rights Arkansas and Center for Exceptional Families evidence on disk now truthfully upgrades all three statewide support families from stale missing or inventory-only packet states.
- Disability Rights Arkansas is explicit enough for Protection and Advocacy because the saved first-party artifact preserves that it is designated by the Governor of Arkansas to implement the federally funded Protection and Advocacy systems throughout the state, and it is explicit enough for statewide legal aid because the same saved artifact preserves free legal representation and statewide assistance language.
- The Center for Exceptional Families is explicit enough for PTI because the saved first-party Arkansas artifact preserves parent-training-and-information language plus a live Request Services route, while the older adcpti.org candidate has clearly drifted into unrelated non-Arkansas investment content and cannot count as reviewed disability evidence.
- Arkansas still cannot reach California-grade or become index-safe because district or county education routing still depends on statewide fallback evidence instead of county- or district-owned leaves, and county/local disability resources still depend on generic or statewide locator-style evidence.
- Arkansas is therefore terminal BLOCKED, not COMPLETE.
