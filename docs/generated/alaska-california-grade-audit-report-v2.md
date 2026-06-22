# Alaska California-Grade Batch 13 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 67
- county_count: 20
- primary_gap_reason: generic_or_statewide_evidence_used_where_local_required

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: blocked_reviewed_statewide_legal_advocacy_source_not_explicit_pa (reviewed first-party statewide legal-advocacy evidence exists, but the saved artifact does not preserve explicit Protection and Advocacy designation text)
- parent_training_information_center: blocked_reviewed_first_party_support_without_explicit_pti_designation (reviewed first-party statewide family-support evidence exists, but the saved artifact does not preserve explicit PTI designation text)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 12 generic roots need leaf verification
- protection_and_advocacy: reviewed_statewide_legal_advocacy_source_not_explicit_pa :: Reviewed DLCAK evidence proves statewide disability legal advocacy plus intake routing, but the saved first-party artifact does not preserve explicit Protection and Advocacy designation text.
- parent_training_information_center: reviewed_first_party_support_source_lacks_explicit_pti_designation :: Reviewed Stone Soup Group evidence proves statewide family-support, training, and intake scope, but the saved first-party artifact does not preserve explicit PTI / Parent Training and Information designation text.
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 12 generic roots need leaf verification

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://dhss.alaska.gov/dsds/Pages/hcbw/eligibility.aspx
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.alaska.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.alaska.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://education.alaska.gov/sped
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://education.alaska.gov/sped
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://dhss.alaska.gov/dsds
- protection_and_advocacy: blocked_reviewed_statewide_legal_advocacy_source_not_explicit_pa; samples=1; first=http://www.dlcak.org/
- parent_training_information_center: blocked_reviewed_first_party_support_without_explicit_pti_designation; samples=1; first=https://stonesoupgroup.org/
- legal_aid: verified_state_grade; samples=1; first=http://www.dlcak.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://dhhs.alaska.gov/locations

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] protection_and_advocacy: hold_blocked_until_explicit_pa_designation_is_preserved_from_reviewed_first_party_source
- [major] parent_training_information_center: hold_blocked_until_explicit_pti_designation_is_preserved_from_reviewed_first_party_source
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- Alaska no longer belongs in UNSTARTED. Reviewed first-party DLCAK evidence on disk now truthfully upgrades statewide legal aid, and the remaining statewide support blockers are more exact than the old missing/inventory-only packet labels.
- Disability Law Center of Alaska clearly proves statewide disability legal advocacy plus intake routing, but the saved artifact does not preserve explicit Protection and Advocacy designation text, so protection_and_advocacy remains blocked on evidence precision rather than missing-source absence.
- Stone Soup Group is preserved as real reviewed statewide parent-support evidence, but the saved artifact still lacks explicit PTI / Parent Training and Information designation text, so the PTI family remains blocked rather than promoted by assumption.
- Alaska still cannot reach California-grade or become index-safe because district or county education routing and county/local disability resources remain county-grade weak, and the statewide support families are not all fully proven at the required designation level.
- Alaska is therefore terminal BLOCKED, not COMPLETE.
