# Vermont California-Grade Batch 87 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 67
- county_count: 14
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
- parent_training_information_center: inventory_only (only legacy inventory hints or weak role matches exist)
- legal_aid: verified_state_grade (reviewed first-party Vermont Legal Aid evidence preserves statewide free civil legal-help routing on the live first-party domain)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 10 generic roots need leaf verification
- protection_and_advocacy: missing_required_source_family :: Protection and advocacy has no strong California-grade evidence for Vermont.
- parent_training_information_center: legacy_or_inventory_only_evidence :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 10 generic roots need leaf verification
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 10 generic roots need leaf verification

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ssa.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://ddsd.vermont.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.vermont.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.vermont.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://education.vermont.gov/
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://education.vermont.gov/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://ddsd.vermont.gov
- protection_and_advocacy: missing; samples=0
- parent_training_information_center: inventory_only; samples=3; first=https://vermontfamilynetwork.org
- legal_aid: verified_state_grade; samples=1; first=https://www.vtlegalaid.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://dhhs.vermont.gov/locations

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] protection_and_advocacy: author_or_verify_statewide_source_family
- [major] parent_training_information_center: author_verified_state_manifest
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- Vermont no longer belongs in UNSTARTED because the packet already preserves reviewed first-party statewide legal-aid evidence on disk instead of only generic inventory hints.
- Vermont Legal Aid now truthfully satisfies the statewide legal-aid family because the reviewed first-party domain explicitly offers free civil legal help to Vermonters.
- Vermont still cannot reach California-grade or become index-safe because district or county education routing still depends on statewide or structural evidence instead of county- or district-owned leaves, county/local disability resources still depend on statewide locator-derived office evidence instead of reviewed county-grade local-office proof, protection and advocacy still lacks a reviewed first-party designation artifact on disk, and Vermont Family Network still lacks a reviewed PTI-designation artifact chain.
- Vermont is therefore terminal BLOCKED, not COMPLETE.
