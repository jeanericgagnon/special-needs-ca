# Louisiana California-Grade Batch 67 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 75
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
- legal_aid: missing (no credible current evidence)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 8 generic roots need leaf verification
- legal_aid: missing_required_source_family :: Legal aid has no strong California-grade evidence for Louisiana.
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
- legal_aid: missing; samples=0
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://dhhs.louisiana.gov/locations

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] legal_aid: author_or_verify_statewide_source_family
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- Louisiana no longer belongs in UNSTARTED. Reviewed first-party Disability Rights Louisiana and LaPTIC evidence already on disk is enough to move the packet into an explicit final blocker state.
- Disability Rights Louisiana is strong enough for the statewide protection-and-advocacy family because the reviewed first-party page preserves direct statewide help routing, CAP and PABSS program signals, and direct statewide contact information on the disability-rights organization itself.
- LaPTIC is explicit enough for PTI because the reviewed first-party page says Families Helping Families of Greater New Orleans serves as the Louisiana Parent Training and Information Center.
- Louisiana still cannot reach California-grade or become index-safe because district or county education routing still depends on generic statewide fallback pages instead of district- or parish-owned leaves, county/local disability resources still depend on a generic statewide locations root instead of reviewed parish-grade local-office leaves, and statewide legal-aid proof is still missing.
- Louisiana is therefore terminal BLOCKED, not COMPLETE.
