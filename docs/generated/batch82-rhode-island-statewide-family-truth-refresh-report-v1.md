# Rhode Island California-Grade Batch 82 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 5
- primary_gap_reason: generic_or_statewide_evidence_used_where_local_required

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party Disability Rights Rhode Island evidence preserves explicit federally mandated statewide P&A designation on the live first-party domain)
- parent_training_information_center: verified_state_grade (authoritative Parent Center Hub Rhode Island leaf explicitly labels RIPIN as the Rhode Island PTI and preserves statewide Rhode Island contact routing)
- legal_aid: verified_state_grade (reviewed first-party Help RI Law / Rhode Island Legal Services pages preserve explicit statewide low-income legal-help routing)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (statewide or structural evidence exists, but not California-grade proof)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 9 generic roots need leaf verification
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: 4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 9 generic roots need leaf verification

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://bhddh.ri.gov/developmental-disabilities/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.rhode-island.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.rhode-island.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.ride.ri.gov/StudentsFamilies/SpecialEducation.aspx
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://www.ride.ri.gov/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://bhddh.ri.gov/developmental-disabilities
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.drri.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.parentcenterhub.org/findurcenter/rhode-island/
- legal_aid: verified_state_grade; samples=1; first=https://www.helprilaw.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://dhhs.rhode-island.gov/locations

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Completion decision

- Rhode Island no longer belongs in UNSTARTED because the packet already preserves reviewed first-party statewide protection-and-advocacy evidence on disk instead of only legacy nonprofit inventory rows.
- Disability Rights Rhode Island is preserved as strong statewide protection-and-advocacy support because the reviewed first-party page explicitly says it is the independent federally mandated Protection and Advocacy (P&A) System for the state of Rhode Island.
- Rhode Island still cannot reach California-grade or become index-safe because district or county education routing still depends on statewide or structural evidence instead of county- or district-owned leaves, and county/local disability resources still depend on generic locator-derived or mirror-backed evidence instead of reviewed county-grade local proof.
- Rhode Island is therefore terminal BLOCKED, not COMPLETE.
