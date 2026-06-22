# North Dakota California-Grade Batch 79 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 75
- county_count: 53
- primary_gap_reason: generic_or_statewide_evidence_used_where_local_required

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party NDP&A evidence preserves statewide protection-and-advocacy identity on the live first-party domain)
- parent_training_information_center: verified_state_grade (reviewed first-party Pathfinder evidence preserves statewide nonprofit scope and explicit Parent Training and Information (PTI) identity)
- legal_aid: missing (no credible current evidence)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 9 generic roots need leaf verification
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 9 generic roots need leaf verification
- legal_aid: missing_required_source_family :: Legal aid has no strong California-grade evidence for North Dakota.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.hhs.nd.gov/dd/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.north-dakota.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.north-dakota.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.nd.gov/
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://www.nd.gov/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.hhs.nd.gov/dd
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.ndpanda.org/home
- parent_training_information_center: verified_state_grade; samples=1; first=https://pathfinder-nd.org/
- legal_aid: missing; samples=0
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://doi.org/10.7910/DVN/AVRHMI

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] legal_aid: author_or_verify_statewide_source_family
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- North Dakota no longer belongs in UNSTARTED because the packet now preserves reviewed first-party statewide P&A and PTI evidence instead of relying on legacy inventory hints.
- Pathfinder Services of North Dakota is preserved as strong statewide PTI support because the reviewed first-party page explicitly labels Parent Training and Information (PTI) and describes statewide nonprofit scope.
- NDP&A is preserved as strong statewide protection-and-advocacy support because the reviewed first-party page preserves Protection Advocacy Project, North Dakota identity and P&A-branded navigation on the live first-party domain.
- North Dakota still cannot reach California-grade or become index-safe because district or county education routing still depends on generic statewide or non-district leaves, county/local disability resources still depend on structural rather than reviewed county-owned routing evidence, and statewide legal aid is still missing on disk.
- North Dakota is therefore terminal BLOCKED, not COMPLETE.
