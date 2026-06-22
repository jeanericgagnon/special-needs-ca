# Wisconsin California-Grade Batch 91 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 67
- county_count: 72
- primary_gap_reason: generic_or_statewide_evidence_used_where_local_required

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: blocked_reviewed_first_party_support_without_explicit_pti_designation (reviewed first-party statewide family-support evidence exists, but the saved artifact does not preserve explicit PTI designation text)
- legal_aid: missing (no credible current evidence)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 11 generic roots need leaf verification
- parent_training_information_center: blocked_reviewed_first_party_support_without_explicit_pti_designation :: WI FACETS is reviewed and statewide, but the saved first-party artifact proves special-education help scope rather than explicit PTI designation.
- legal_aid: missing_required_source_family :: Legal aid has no strong California-grade evidence for Wisconsin.
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 11 generic roots need leaf verification

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ssa.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.dhs.wisconsin.gov/familycare/eligibility.htm
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.wisconsin.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.wisconsin.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://dpi.wi.gov/
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://dpi.wi.gov/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.dhs.wisconsin.gov
- protection_and_advocacy: verified_state_grade; samples=1; first=https://disabilityrightswi.org/
- parent_training_information_center: blocked_reviewed_first_party_support_without_explicit_pti_designation; samples=1; first=https://wifacets.org/
- legal_aid: missing; samples=0
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://doi.org/10.7910/DVN/AVRHMI

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] parent_training_information_center: author_verified_state_manifest
- [major] legal_aid: author_or_verify_statewide_source_family
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- Wisconsin no longer belongs in UNSTARTED because the packet already preserves reviewed first-party statewide nonprofit evidence on disk and its remaining gaps are now explicit terminal blockers.
- Disability Rights Wisconsin now truthfully satisfies statewide protection and advocacy because the reviewed first-party artifact explicitly preserves statewide disability-rights identity and a dedicated Protection and Advocacy program on the live domain.
- WI FACETS no longer stays vague inventory-only evidence. The reviewed first-party artifact proves real statewide family-support and special-education guidance scope, but it still does not preserve explicit PTI designation text, so PTI remains blocked rather than being upgraded by assumption.
- Wisconsin still cannot reach California-grade or become index-safe because district or county education routing still depends on statewide or structural evidence instead of county- or district-owned leaves, county/local disability resources still depend on generic or structural office evidence instead of reviewed county-grade local-office proof, statewide PTI designation is still not explicit in the saved artifact, and statewide legal-aid proof is still missing on disk.
- Wisconsin is therefore terminal BLOCKED, not COMPLETE.
