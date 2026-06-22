# New Jersey California-Grade Batch 77 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 67
- county_count: 21
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
- parent_training_information_center: verified_state_grade (reviewed first-party SPAN evidence preserves New Jersey statewide parent-to-parent identity, PTI program navigation, and direct support contact)
- legal_aid: missing (no credible current evidence)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 6 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 8 generic roots need leaf verification
- protection_and_advocacy: missing_required_source_family :: Protection and advocacy has no strong California-grade evidence for New Jersey.
- legal_aid: missing_required_source_family :: Legal aid has no strong California-grade evidence for New Jersey.
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: 6 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 8 generic roots need leaf verification

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.nj.gov/humanservices/ddd/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=3; first=https://nj.gov/humanservices/ddd/
- early_intervention_part_c: verified_state_grade; samples=3; first=https://www.nj.gov/health/fhs/eis/
- special_education_idea_part_b: verified_state_grade; samples=2; first=https://www.bergen.org/bcss
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://www.atlantic-county.org/education/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.nj.gov/humanservices/ddd
- protection_and_advocacy: missing; samples=3; first=https://drnj.org
- parent_training_information_center: verified_state_grade; samples=1; first=https://spanadvocacy.org/programs/p2p/
- legal_aid: missing; samples=0
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://www.nj.gov/humanservices/dmahs
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://doi.org/10.7910/DVN/AVRHMI

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] protection_and_advocacy: author_or_verify_statewide_source_family
- [major] legal_aid: author_or_verify_statewide_source_family
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- New Jersey no longer belongs in UNSTARTED because the packet already preserves reviewed first-party statewide PTI-style evidence on disk instead of only inventory hints.
- SPAN Parent Advocacy Network is preserved as strong statewide PTI-style support because the reviewed first-party pages explicitly preserve NJ Statewide Parent to Parent identity, PTI program navigation, direct support language, and program staff contact.
- New Jersey still cannot reach California-grade or become index-safe because district or county education routing still depends on county or statewide fallback pages instead of district-owned leaves, county/local disability resources still depend on structural data rather than reviewed county-owned routing, no reviewed DRNJ first-party artifact exists on disk for statewide P&A, and no reviewed statewide legal-aid artifact exists on disk.
- New Jersey is therefore terminal BLOCKED, not COMPLETE.
