# Mississippi California-Grade Batch 73 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 58
- county_count: 82
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
- parent_training_information_center: verified_state_grade (reviewed first-party PTI evidence is present at the required authority level)
- legal_aid: missing (no credible current evidence)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 51 inventory rows show federal/state mismatch; 9 generic roots need leaf verification
- vocational_rehabilitation_pre_ets: legacy_or_inventory_only_evidence :: 4 inventory rows use DB-field agency labels; 51 inventory rows show federal/state mismatch; 9 generic roots need leaf verification
- protection_and_advocacy: missing_required_source_family :: Protection and advocacy has no strong California-grade evidence for Mississippi.
- legal_aid: missing_required_source_family :: Legal aid has no strong California-grade evidence for Mississippi.
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 51 inventory rows show federal/state mismatch; 9 generic roots need leaf verification

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.dmh.ms.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.mississippi.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.mississippi.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.mdek12.org/
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://www.mdek12.org/
- vocational_rehabilitation_pre_ets: inventory_only; samples=1; first=https://www.dmh.ms.gov
- protection_and_advocacy: missing; samples=0
- parent_training_information_center: verified_state_grade; samples=1; first=https://mspti.org
- legal_aid: missing; samples=0
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=3; first=https://www.ablenrc.org
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://dhhs.mississippi.gov/locations

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] vocational_rehabilitation_pre_ets: author_verified_state_manifest
- [major] protection_and_advocacy: author_or_verify_statewide_source_family
- [major] legal_aid: author_or_verify_statewide_source_family
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- Mississippi no longer belongs in UNSTARTED. The packet already has enough reviewed on-disk evidence to repair PTI truthfully and to terminalize the remaining blockers without inflating county-grade readiness.
- Mississippi PTI is explicit enough to verify because the reviewed first-party page itself says “Welcome to the Mississippi Parent Training and Information Center,” preserves family-support and IDEA/transition guidance, and preserves the federal Department of Education grant statement.
- Mississippi still cannot reach California-grade or become index-safe because district or county education routing still depends on generic statewide fallback pages instead of county- or district-owned leaves, county/local disability resources still depend on a generic statewide locations page instead of reviewed county-owned local routing, statewide Protection and Advocacy plus legal-aid proof is still missing, and the reviewed statewide MS CAP page is not enough to prove direct statewide VR / Pre-ETS routing.
- Mississippi is therefore terminal BLOCKED, not COMPLETE.
