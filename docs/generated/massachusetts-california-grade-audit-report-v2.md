# Massachusetts California-Grade Batch 70 Report v1

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
- parent_training_information_center: verified_state_grade (reviewed first-party PTI evidence is present at the required authority level)
- legal_aid: missing (no credible current evidence)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 68 inventory rows show federal/state mismatch; 9 generic roots need leaf verification
- protection_and_advocacy: missing_required_source_family :: Protection and advocacy has no strong California-grade evidence for Massachusetts.
- legal_aid: missing_required_source_family :: Legal aid has no strong California-grade evidence for Massachusetts.
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 68 inventory rows show federal/state mismatch; 9 generic roots need leaf verification

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.mass.gov/masshealth
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.mass.gov/dds/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.massachusetts.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.massachusetts.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.doe.mass.edu/sped/
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://www.doe.mass.edu/sped/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.mass.gov/dds
- protection_and_advocacy: missing; samples=0
- parent_training_information_center: verified_state_grade; samples=1; first=https://fcsn.org/
- legal_aid: missing; samples=0
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://dhhs.massachusetts.gov/locations

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] protection_and_advocacy: author_or_verify_statewide_source_family
- [major] legal_aid: author_or_verify_statewide_source_family
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- Massachusetts no longer belongs in UNSTARTED. The packet already had enough reviewed on-disk evidence to identify the final blockers truthfully.
- Federation for Children with Special Needs is explicit enough for PTI because the reviewed first-party page preserves a Parent Training & Information Center route, organization identity, and direct Massachusetts contact evidence.
- Massachusetts still cannot reach California-grade or become index-safe because district or county education routing still depends on generic statewide fallback pages instead of county- or district-owned leaves, county/local disability resources still depend on generic statewide location evidence instead of reviewed county-owned local routing, and reviewed first-party statewide Protection and Advocacy plus legal-aid proof is still missing on disk.
- Massachusetts is therefore terminal BLOCKED, not COMPLETE.
