# New Hampshire California-Grade Batch 76 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 58
- county_count: 10
- primary_gap_reason: generic_or_statewide_evidence_used_where_local_required

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)
- vocational_rehabilitation_pre_ets: inventory_only (only legacy inventory hints or weak role matches exist)
- protection_and_advocacy: missing (no credible current evidence)
- parent_training_information_center: verified_state_grade (reviewed first-party Parent Information Center of NH evidence preserves statewide parent-center identity, special-education support, and Department of Education funding)
- legal_aid: missing (no credible current evidence)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 2 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 9 generic roots need leaf verification
- vocational_rehabilitation_pre_ets: legacy_or_inventory_only_evidence :: 2 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 9 generic roots need leaf verification
- protection_and_advocacy: missing_required_source_family :: Protection and advocacy has no strong California-grade evidence for New Hampshire.
- legal_aid: missing_required_source_family :: Legal aid has no strong California-grade evidence for New Hampshire.
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: 2 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 9 generic roots need leaf verification

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://dhhs.new-hampshire.gov/dd/waivers
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.new-hampshire.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.new-hampshire.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.education.nh.gov/
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://www.education.nh.gov/
- vocational_rehabilitation_pre_ets: inventory_only; samples=1; first=https://dhhs.new-hampshire.gov/rehab
- protection_and_advocacy: missing; samples=0
- parent_training_information_center: verified_state_grade; samples=1; first=https://picnh.org/
- legal_aid: missing; samples=0
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://doi.org/10.7910/DVN/AVRHMI

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] vocational_rehabilitation_pre_ets: author_verified_state_manifest
- [major] protection_and_advocacy: author_or_verify_statewide_source_family
- [major] legal_aid: author_or_verify_statewide_source_family
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- New Hampshire no longer belongs in UNSTARTED because the packet already preserves reviewed first-party PTI evidence on disk instead of only legacy inventory hints.
- PICNH is preserved as strong statewide PTI-style support because the saved first-party pages explicitly preserve Parent Information Center identity, special-education support language, direct contact routing, and Department of Education funding support.
- New Hampshire still cannot reach California-grade or become index-safe because district or county education routing still depends on generic statewide fallback pages, county/local disability resources still depend on non-county-owned structural sources, statewide P&A proof is still missing on disk, statewide legal-aid proof is still missing on disk, and vocational rehabilitation remains inventory-only.
- New Hampshire is therefore terminal BLOCKED, not COMPLETE.
