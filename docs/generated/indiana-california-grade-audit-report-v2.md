# Indiana California-Grade Batch 88 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 75
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
- parent_training_information_center: blocked_reviewed_first_party_support_without_explicit_pti_designation (Bounded live review of the INSOURCE home, about, get-help, and contact pages still preserves statewide Indiana parent-support and training scope, but does not preserve explicit PTI designation text.)
- legal_aid: verified_state_grade (Indiana Legal Services now provides reviewed statewide first-party legal-aid routing from a live homepage.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 51 inventory rows show federal/state mismatch; 10 generic roots need leaf verification
- parent_training_information_center: bounded_live_first_party_review_still_lacks_explicit_pti_designation :: Bounded live review of the INSOURCE home, about, get-help, and contact pages still preserves statewide Indiana parent-support and training scope, but does not preserve explicit PTI / Parent Training and Information Center designation text.
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
- legal_aid: verified_state_grade; samples=1; first=https://www.indianalegalservices.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://doi.org/10.7910/DVN/AVRHMI

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] parent_training_information_center: hold_blocked_until_explicit_pti_designation_is_preserved_from_reviewed_first_party_source
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- Indiana remains BLOCKED and not index-safe because district or county education routing still depends on generic statewide Indiana DOE fallback pages rather than county- or district-owned leaves, and county/local disability resources still depend on a DOI dataset mirror instead of reviewed county-owned local routing.
- Indiana Legal Services is explicit enough for legal aid because the reviewed first-party homepage preserves Help for Hoosiers language plus free civil legal assistance for eligible low-income residents throughout the state of Indiana.
- INSOURCE remains blocked for PTI because the bounded live first-party review preserves statewide Indiana parent-support and training scope, but still does not preserve explicit PTI / Parent Training and Information Center designation text.
- Indiana is therefore still terminal BLOCKED, not COMPLETE.
