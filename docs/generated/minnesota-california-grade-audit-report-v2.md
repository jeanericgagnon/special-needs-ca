# Minnesota California-Grade Batch 72 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 58
- county_count: 87
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
- parent_training_information_center: blocked_reviewed_first_party_support_without_explicit_pti_designation (reviewed first-party statewide family-support evidence exists, but the saved artifact does not preserve explicit PTI designation text)
- legal_aid: missing (reviewed first-party Mid-Minnesota Legal Aid evidence is only a Page not found shell and does not preserve a live role-aligned statewide legal-aid leaf)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 5 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 10 generic roots need leaf verification
- protection_and_advocacy: missing_required_source_family :: Protection and advocacy has no strong California-grade evidence for Minnesota.
- parent_training_information_center: reviewed_first_party_support_source_lacks_explicit_pti_designation :: Reviewed PACER Center evidence preserves Minnesota family-support language, special-education guidance, and direct advocate/help routing, but the saved first-party artifact does not preserve explicit PTI / Parent Training and Information designation text.
- legal_aid: reviewed_first_party_404_shell_not_role_aligned :: The reviewed Mid-Minnesota Legal Aid fetch is a Page not found shell with site chrome and contact/navigation text, not a live role-aligned statewide legal-aid leaf.
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: 5 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 10 generic roots need leaf verification

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://mn.gov/dhs/waivers/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.minnesota.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.minnesota.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://education.mn.gov/
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://education.mn.gov/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://mn.gov/dhs
- protection_and_advocacy: missing; samples=0
- parent_training_information_center: blocked_reviewed_first_party_support_without_explicit_pti_designation; samples=1; first=https://www.pacer.org/
- legal_aid: missing; samples=0
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://mn.gov/dhs/pca
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://doi.org/10.7910/DVN/AVRHMI

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] protection_and_advocacy: author_or_verify_statewide_source_family
- [major] parent_training_information_center: hold_blocked_until_explicit_pti_designation_is_preserved_from_reviewed_first_party_source
- [major] legal_aid: hold_blocked_until_live_role_aligned_first_party_legal_aid_leaf_is_reviewed
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- Minnesota no longer belongs in UNSTARTED. The packet already has enough reviewed on-disk evidence to terminalize the real blockers without pretending the state is closer to California-grade than the evidence supports.
- PACER Center is preserved as real reviewed statewide family-support evidence because the first-party page explicitly preserves Minnesota family-support language, special-education guidance, and direct ask-an-advocate routing.
- That reviewed PACER artifact still does not preserve explicit PTI / Parent Training and Information Center designation text, so PTI remains blocked rather than being upgraded by assumption.
- The inherited Minnesota Disability Law Center / Mid-Minnesota Legal Aid sample chain was demoted because the reviewed first-party fetch is a Page not found shell, not a live role-aligned statewide legal-aid or protection-and-advocacy leaf.
- Minnesota still cannot reach California-grade or become index-safe because district or county education routing still depends on generic statewide fallback pages instead of county- or district-owned leaves, county/local disability resources still depend on generic statewide or structural sources instead of reviewed county-owned local routing, and reviewed first-party statewide Protection and Advocacy plus legal-aid proof is still missing on disk.
- Minnesota is therefore terminal BLOCKED, not COMPLETE.
