# Louisiana California-Grade Batch 67 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 64
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
- parent_training_information_center: verified_state_grade (reviewed first-party PTI designation evidence is present at the required authority level)
- legal_aid: verified_state_grade (Reviewed LouisianaLawHelp now provides a statewide parish-searchable legal-help route with named legal-aid organizations.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 8 generic roots need leaf verification
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 8 generic roots need leaf verification

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://ldh.la.gov/ocdd/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.louisiana.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.louisiana.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.louisianabelieves.com/academics/special-education
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://www.louisianabelieves.com/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://ldh.la.gov/ocdd
- protection_and_advocacy: verified_state_grade; samples=1; first=https://disabilityrightsla.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://fhfofgno.org/laptic
- legal_aid: verified_state_grade; samples=1; first=https://louisianalawhelp.org/find-legal-help
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://dhhs.louisiana.gov/locations

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- Louisiana district/county education routing remains blocked because district rows still depend on generic statewide fallback pages instead of parish- or district-owned leaves.
- Louisiana county/local disability resources remain blocked because packet rows still depend on a generic statewide locations root instead of reviewed parish-grade local-office leaves.
- Louisiana legal aid upgrades because LouisianaLawHelp now provides a statewide parish-searchable legal-help route with named legal-aid organizations.
- Louisiana is therefore still truthfully BLOCKED and not index-safe. The only remaining blockers are the two parish-grade local-routing families.
