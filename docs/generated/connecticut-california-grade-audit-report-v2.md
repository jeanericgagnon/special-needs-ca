# Connecticut California-Grade Batch 62 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 75
- county_count: 8
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
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 8 generic roots need leaf verification
- parent_training_information_center: reviewed_first_party_support_source_lacks_explicit_pti_designation :: Reviewed CPAC evidence proves Connecticut statewide family-support and training scope, but the saved first-party artifact does not preserve explicit PTI / Parent Training and Information designation text.
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 8 generic roots need leaf verification

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://portal.ct.gov/dds/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.connecticut.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.connecticut.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://portal.ct.gov/sde/special-education
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://portal.ct.gov/sde/special-education
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://portal.ct.gov/dds
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.disrightsct.org/
- parent_training_information_center: blocked_reviewed_first_party_support_without_explicit_pti_designation; samples=1; first=https://cpacinc.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.disrightsct.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://doi.org/10.7910/DVN/AVRHMI

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] parent_training_information_center: hold_blocked_until_explicit_pti_designation_is_preserved_from_reviewed_first_party_source
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- Connecticut no longer belongs in UNSTARTED. Reviewed first-party Disability Rights Connecticut evidence on disk now truthfully upgrades Protection and Advocacy and statewide disability legal aid from stale missing packet states.
- Disability Rights Connecticut is explicit enough for Protection and Advocacy because the saved first-party artifact preserves that DRCT is Connecticut's designated Protection & Advocacy System, and it is explicit enough for statewide legal aid because the same reviewed artifact preserves legally based advocacy services language plus live request-accommodation and education-rights help routes.
- CPAC is preserved as real reviewed statewide family-support and IDEA-training evidence for Connecticut, but the saved artifact still does not preserve explicit PTI / Parent Training and Information designation text, so the PTI family remains blocked rather than being upgraded by assumption.
- Connecticut still cannot reach California-grade or become index-safe because district or county education routing still depends on statewide fallback evidence instead of county- or district-owned leaves, county/local disability resources still depend on generic or statewide locator-style evidence, and PTI remains below the explicit designation bar.
- Connecticut is therefore terminal BLOCKED, not COMPLETE.
