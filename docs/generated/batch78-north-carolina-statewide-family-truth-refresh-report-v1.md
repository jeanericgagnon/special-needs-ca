# North Carolina California-Grade Batch 78 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 58
- county_count: 100
- primary_gap_reason: generic_or_statewide_evidence_used_where_local_required

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)
- vocational_rehabilitation_pre_ets: verified_state_grade (reviewed first-party EIPD evidence preserves statewide vocational rehabilitation routing and local office coverage language)
- protection_and_advocacy: missing (no credible current evidence)
- parent_training_information_center: inventory_only (reviewed ECAC evidence preserves PTI navigation and special-education family-support language, but no fetched statewide PTI designation leaf is preserved on disk)
- legal_aid: missing (no credible current evidence)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 12 generic roots need leaf verification
- protection_and_advocacy: missing_required_source_family :: Protection and advocacy has no strong California-grade evidence for North Carolina.
- parent_training_information_center: legacy_or_inventory_only_evidence :: Reviewed ECAC homepage artifact preserves PTI navigation and special-education family-support language, but the packet still lacks a fetched PTI leaf or explicit statewide North Carolina PTI designation on disk.
- legal_aid: missing_required_source_family :: Legal aid has no strong California-grade evidence for North Carolina.
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 12 generic roots need leaf verification

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.ncdhhs.gov/innovations/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.north-carolina.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.north-carolina.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.dpi.nc.gov/districts-schools/classroom-resources/exceptional-children
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://www.cmsk12.org/Page/213
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.ncdhhs.gov/divisions/eipd
- protection_and_advocacy: missing; samples=0
- parent_training_information_center: inventory_only; samples=1; first=https://www.ecac-parentcenter.org/
- legal_aid: missing; samples=0
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://doi.org/10.7910/DVN/AVRHMI

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] protection_and_advocacy: author_or_verify_statewide_source_family
- [major] parent_training_information_center: author_verified_state_manifest
- [major] legal_aid: author_or_verify_statewide_source_family
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- North Carolina no longer belongs in UNSTARTED because the packet now has explicit terminal blockers instead of an open-ended planning status.
- The reviewed ECAC artifact improves PTI truth enough to replace the weaker HOPE-only sample chain, but it still does not preserve a fetched statewide PTI designation leaf on disk, so PTI remains inventory_only rather than verified.
- The reviewed EIPD artifact strengthens vocational rehabilitation truth because it explicitly preserves statewide service language and local office coverage, so North Carolina no longer depends on a generic MH/DD/SAS sample for that family.
- North Carolina still cannot reach California-grade or become index-safe because district or county education routing still depends on generic or statewide fallback instead of district-owned leaves, county/local disability resources still depend on structural or non-county-owned sources, statewide P&A remains missing on disk, statewide legal aid remains missing on disk, and PTI still lacks explicit statewide designation evidence from a fetched leaf.
- North Carolina is therefore terminal BLOCKED, not COMPLETE.
