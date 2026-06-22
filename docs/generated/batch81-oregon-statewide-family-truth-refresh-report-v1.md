# Oregon California-Grade Batch 81 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 67
- county_count: 36
- primary_gap_reason: generic_or_statewide_evidence_used_where_local_required

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party Disability Rights Oregon evidence preserves statewide protection-and-advocacy identity plus Oregon-specific disability legal help language)
- parent_training_information_center: inventory_only (only legacy inventory hints or weak role matches exist)
- legal_aid: missing (no credible current evidence)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 11 generic roots need leaf verification
- parent_training_information_center: legacy_or_inventory_only_evidence :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 11 generic roots need leaf verification
- legal_aid: missing_required_source_family :: Legal aid has no strong California-grade evidence for Oregon.
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 11 generic roots need leaf verification

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.oregon.gov/odhs/dds/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.oregon.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.oregon.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.oregon.gov/ode
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://www.oregon.gov/ode
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.oregon.gov/odhs/dds
- protection_and_advocacy: verified_state_grade; samples=1; first=https://droregon.org/
- parent_training_information_center: inventory_only; samples=0
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

- Oregon no longer belongs in UNSTARTED because the packet already preserves reviewed first-party statewide protection-and-advocacy evidence on disk instead of only legacy nonprofit inventory rows.
- Disability Rights Oregon is preserved as strong statewide protection-and-advocacy support because the reviewed first-party page explicitly says it helps people with disabilities with disability-related legal issues in Oregon and preserves direct first-party contact and office evidence.
- Oregon still cannot reach California-grade or become index-safe because district or county education routing still depends on statewide or structural evidence instead of district-owned leaves, county/local disability resources still depend on structural rather than reviewed county-owned local routing proof, PTI still remains inventory-only rather than explicit PTI-grade evidence, and statewide legal aid is still missing on disk.
- Oregon is therefore terminal BLOCKED, not COMPLETE.
