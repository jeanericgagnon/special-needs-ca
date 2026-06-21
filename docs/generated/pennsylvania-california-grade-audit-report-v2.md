# Pennsylvania California-Grade Audit Report v2

- classification: PARTIAL
- index_safe: false
- completeness_pct: 83
- county_count: 67
- primary_gap_reason: remaining_counties_lack_exact_iu_or_district_education_leaf_after_bounded_official_repair

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: exact_leaf_targets_verified_partial (Official IU and district exact education leaves now cover 64/67 Pennsylvania counties. Remaining unresolved counties: Lackawanna County, Susquehanna County, Wayne County.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Official statewide OVR transition and vocational rehabilitation source is present and verified.)
- protection_and_advocacy: verified_state_grade (Disability Rights Pennsylvania is already present as a verified first-party statewide P&A source.)
- parent_training_information_center: verified_state_grade (PEAL Center is already present as a verified first-party statewide PTI source.)
- legal_aid: missing (no credible current evidence)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_state_grade (Official county MH/ID offices page lists verified county office coverage across 67/67 Pennsylvania counties.)

## Failure ledger

- district_or_county_education_routing: remaining_counties_lack_exact_iu_or_district_education_leaf_after_bounded_official_repair :: Verified official IU/district exact leaves now cover 64/67 Pennsylvania counties. Remaining unresolved counties: Lackawanna County, Susquehanna County, Wayne County. Exact blockers: Northeastern Educational Intermediate Unit 19:official_iu_root_unresolved_after_bounded_probe.
- legal_aid: missing_required_source_family :: Legal aid has no strong California-grade evidence for Pennsylvania.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.dhs.pa.gov/Services/Disabilities-Aging/Pages/ODP-Waivers.aspx
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=3; first=https://www.dhs.pa.gov/Services/Disabilities-Aging/Pages/ODP-Waivers.aspx
- developmental_disability_idd_authority: verified_state_grade; samples=3; first=https://www.alleghenycounty.us/Human-Services/About/Offices/Developmental-Disabilities.aspx
- early_intervention_part_c: verified_state_grade; samples=3; first=https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html
- special_education_idea_part_b: verified_state_grade; samples=3; first=https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx
- district_or_county_education_routing: exact_leaf_targets_verified_partial; samples=20; first=https://www.iu08.org/page/special-education-services
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.dli.pa.gov/Individuals/Disability-Services/ovr/Pages/default.aspx
- protection_and_advocacy: verified_state_grade; samples=3; first=https://www.disabilityrightspa.org
- parent_training_information_center: verified_state_grade; samples=3; first=https://pealcenter.org
- legal_aid: missing; samples=0
- able_program: verified_state_grade; samples=1; first=https://www.paable.gov/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/benefits/disability/apply-child.html
- county_local_disability_resources: verified_state_grade; samples=67; first=https://www.pa.gov/agencies/dhs/contact/county-mh-id-offices

## Next actions

- [critical] district_or_county_education_routing: resolve_remaining_intermediate_unit_or_county_specific_education_leaves_for_uncovered_counties
- [major] legal_aid: author_or_verify_statewide_source_family
