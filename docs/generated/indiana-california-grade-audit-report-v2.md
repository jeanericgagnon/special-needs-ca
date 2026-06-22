# Indiana California-Grade Batch 66 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 67
- county_count: 92
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

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 51 inventory rows show federal/state mismatch; 10 generic roots need leaf verification
- parent_training_information_center: reviewed_first_party_support_source_lacks_explicit_pti_designation :: Reviewed INSOURCE evidence proves Indiana statewide family-support and training scope, but the saved first-party artifact does not preserve explicit PTI / Parent Training and Information designation text.
- legal_aid: missing_required_source_family :: Legal aid has no strong California-grade evidence for Indiana.
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 51 inventory rows show federal/state mismatch; 10 generic roots need leaf verification

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.in.gov/fssa/ddrs/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.indiana.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.indiana.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.in.gov/doe/students/special-education/
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://www.in.gov/doe/students/special-education/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.in.gov/fssa/ddrs
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.in.gov/idr/
- parent_training_information_center: blocked_reviewed_first_party_support_without_explicit_pti_designation; samples=1; first=https://www.insource.org/
- legal_aid: missing; samples=0
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://doi.org/10.7910/DVN/AVRHMI

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] parent_training_information_center: hold_blocked_until_explicit_pti_designation_is_preserved_from_reviewed_first_party_source
- [major] legal_aid: author_or_verify_statewide_source_family
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- Indiana no longer belongs in UNSTARTED. Reviewed first-party Indiana Disability Rights and INSOURCE evidence already on disk is enough to move the packet to an explicit final blocker state.
- Indiana Disability Rights is explicit enough for Protection and Advocacy because the reviewed first-party page preserves Indiana Disability Rights branding, statewide contact routing, and direct Protection and Advocacy system language.
- INSOURCE is preserved as real reviewed statewide Indiana parent-support, training, and special-education navigation evidence, but the saved first-party artifact still does not preserve explicit PTI / Parent Training and Information designation text, so PTI remains blocked rather than being upgraded by assumption.
- Indiana still cannot reach California-grade or become index-safe because district or county education routing still depends on generic statewide fallback pages instead of county- or district-owned leaves, county/local disability resources still depend on a DOI dataset mirror rather than reviewed county-owned local routing, PTI remains below the explicit designation bar, and statewide legal-aid proof is still missing.
- Indiana is therefore terminal BLOCKED, not COMPLETE.
