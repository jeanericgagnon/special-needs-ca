# Nevada California-Grade Batch 75 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 17
- primary_gap_reason: generic_or_statewide_evidence_used_where_local_required

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party NDALC evidence explicitly identifies Nevada’s federally mandated protection and advocacy system)
- parent_training_information_center: verified_state_grade (reviewed first-party Nevada PEP evidence preserves statewide family support, training, and Department of Education-backed services)
- legal_aid: verified_state_grade (reviewed first-party NDALC evidence preserves statewide disability legal-rights routing through the Nevada Disability Advocacy and Law Center)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 12 generic roots need leaf verification
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 12 generic roots need leaf verification

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://adsd.nv.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.nevada.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.nevada.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://doe.nv.gov/Special_Education/
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://doe.nv.gov/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://adsd.nv.gov
- protection_and_advocacy: verified_state_grade; samples=1; first=https://ndalc.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://nvpep.org/
- legal_aid: verified_state_grade; samples=1; first=https://ndalc.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://dhhs.nevada.gov/locations

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- Nevada no longer belongs in UNSTARTED because the packet already preserves reviewed first-party statewide evidence for protection and advocacy, parent-training support, and disability legal-rights routing.
- NDALC is preserved as strong statewide proof because the saved first-party page explicitly says it is Nevada’s federally mandated protection and advocacy system and preserves disability legal-rights language.
- Nevada PEP is preserved as strong statewide PTI-style support because the saved first-party page preserves statewide family information, support, training, and statewide contact routing plus Department of Education support.
- Nevada still cannot reach California-grade or become index-safe because district or county education routing still depends on generic statewide fallback pages instead of county- or district-owned leaves, and county/local disability resources still depend on statewide locator or structural sources rather than reviewed county-owned local routing.
- Nevada is therefore terminal BLOCKED, not COMPLETE.
