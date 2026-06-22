# South Carolina California-Grade Batch 83 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 75
- county_count: 46
- primary_gap_reason: generic_or_statewide_evidence_used_where_local_required

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party Disability Rights South Carolina evidence preserves statewide protection-and-advocacy identity on the live first-party domain)
- parent_training_information_center: inventory_only (only legacy inventory hints or weak role matches exist)
- legal_aid: verified_state_grade (reviewed first-party South Carolina Legal Services evidence preserves statewide low-income civil legal-aid identity plus direct intake routing on the live first-party domain)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 10 generic roots need leaf verification
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 10 generic roots need leaf verification
- parent_training_information_center: legacy_or_inventory_only_evidence :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 10 generic roots need leaf verification

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ssa.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://ddsn.sc.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.south-carolina.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.south-carolina.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://ed.sc.gov/
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://ed.sc.gov/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://ddsn.sc.gov
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.disabilityrightssc.org/
- parent_training_information_center: inventory_only; samples=0
- legal_aid: verified_state_grade; samples=1; first=https://sclegal.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://doi.org/10.7910/DVN/AVRHMI

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] parent_training_information_center: author_verified_state_manifest
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- South Carolina no longer belongs in UNSTARTED because the packet already preserves reviewed first-party statewide protection-and-advocacy and legal-aid evidence on disk instead of only legacy nonprofit or legal inventory rows.
- Disability Rights South Carolina is preserved as statewide protection-and-advocacy support from the reviewed first-party domain.
- South Carolina Legal Services is preserved as statewide legal aid because the reviewed first-party page explicitly describes a statewide civil legal-services role for low-income South Carolinians and preserves direct intake routes.
- South Carolina still cannot reach California-grade or become index-safe because district or county education routing still depends on statewide or structural evidence instead of county- or district-owned leaves, county/local disability resources still depend on DOI mirror-backed office evidence instead of reviewed county-grade official local-office proof, and the Family Connection artifact still does not explicitly preserve PTI-grade designation text in the reviewed chain.
- South Carolina is therefore terminal BLOCKED, not COMPLETE.
