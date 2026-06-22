# Colorado California-Grade Batch 11 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 64
- primary_gap_reason: district_grade_education_and_county_local_office_proof_still_unverified

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

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 9 generic roots need leaf verification
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 9 generic roots need leaf verification

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://hcpf.colorado.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.colorado.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.colorado.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.cde.state.co.us/cdesped
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://www.cde.state.co.us/cdesped
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://hcpf.colorado.gov/developmental-disabilities
- protection_and_advocacy: verified_state_grade; samples=1; first=https://disabilitylawco.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://peakparent.org
- legal_aid: verified_state_grade; samples=1; first=https://www.coloradolegalservices.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://doi.org/10.7910/DVN/AVRHMI

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- Colorado no longer belongs in UNSTARTED. Reviewed first-party Disability Justice and PEAK Parent Center evidence on disk now truthfully upgrades Protection and Advocacy and the Parent Training & Information Center from stale missing or inventory-only packet states.
- Disability Justice is explicit enough for Protection and Advocacy because the saved first-party artifact preserves that its team forms Colorado’s Protection and Advocacy system.
- PEAK Parent Center is explicit enough for PTI because the saved first-party artifact preserves Parent Center identity, Colorado family-support scope, and free or low-cost services for families of children with disabilities across Colorado and beyond.
- Colorado Legal Services is explicit enough for legal aid because the reviewed first-party homepage preserves statewide free civil legal help for low-income Coloradans together with an Apply for Help route.
- Colorado still cannot reach California-grade or become index-safe because district or county education routing still depends on statewide fallback evidence instead of county- or district-owned leaves, and county/local disability resources still depend on generic or statewide locator-style evidence.
- Colorado is therefore terminal BLOCKED, not COMPLETE.
