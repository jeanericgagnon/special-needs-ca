# Florida California-Grade Audit Report v2

- classification: PARTIAL
- index_safe: false
- completeness_pct: 83
- county_count: 67
- primary_gap_reason: county_grade_coverage_still_incomplete_after_exact_target_verification

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (Official APD regional offices page lists counties served across 67/67 Florida counties.)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (Official FDLRS directory exposes statewide associate center routing with 26 reviewed center links on the live official page.)
- district_or_county_education_routing: exact_leaf_targets_verified_partial (Reviewed district-owned education exact leaves verified (12) across multiple Florida district domains, but county-grade coverage still requires broader district mapping.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Official statewide Florida Vocational Rehabilitation transition and Pre-ETS source is present and verified.)
- protection_and_advocacy: verified_state_grade (Disability Rights Florida is already present as a verified first-party statewide P&A source.)
- parent_training_information_center: verified_state_grade (Family Network on Disabilities is already present as a verified first-party statewide PTI source.)
- legal_aid: verified_state_grade (Reviewed first-party Florida legal aid sources are present in the Florida source pack and verified discovery artifacts.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (The legacy ACCESS local service center map now 404s, and bounded same-domain live recheck still exposes only community-partner search plus a statewide customer service center, not a county-grade official locator.)

## Failure ledger

- district_or_county_education_routing: county_grade_coverage_still_incomplete_after_exact_target_verification :: Verified exact leaf targets: https://www.bakerk12.org/departments/exceptional-student-education-student-services/exceptional-student-education-student-services, https://www.bakerk12.org/departments/exceptional-student-education-student-services/student-services-resources, https://www.bakerk12.org/departments/exceptional-student-education-student-services/staff, https://www.bay.k12.fl.us/page/ese/, https://www.bay.k12.fl.us/page/special-education-programs/, https://www.bradfordschools.org/departments/exceptional-student-education, https://www.yourcharlotteschools.net/72951_3, https://www.collierschools.com/students-families/ese, https://www.collierschools.com/students-families/ese/parent-resources, https://www.citrusschools.org/exceptional-student-education-2, https://www.oneclay.net/page/exceptional-student-education/, https://www.oneclay.net/page/ese-parent-services/
- county_local_disability_resources: official_local_service_center_locator_missing_after_same_domain_repair :: The legacy ACCESS local service center map now 404s, and bounded same-domain live recheck still exposes only community-partner search plus a statewide customer service center, not a county-grade official locator.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.floridahealth.gov/individual-family-health/child-infant-youth/special-health-care-needs/cms/
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=3; first=https://apd.myflorida.com/cdcplus/
- developmental_disability_idd_authority: verified_state_grade; samples=6; first=https://apd.myflorida.com/region/northwest
- early_intervention_part_c: verified_state_grade; samples=3; first=https://www.floridaearlysteps.com
- special_education_idea_part_b: verified_state_grade; samples=26; first=https://www.fdlrs.org/
- district_or_county_education_routing: exact_leaf_targets_verified_partial; samples=12; first=https://www.bakerk12.org/departments/exceptional-student-education-student-services/exceptional-student-education-student-services
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.rehabworks.org/student-youth/
- protection_and_advocacy: verified_state_grade; samples=4; first=https://www.disabilityrightsflorida.org
- parent_training_information_center: verified_state_grade; samples=2; first=https://fndusa.org
- legal_aid: verified_state_grade; samples=2; first=https://bals.org
- able_program: verified_state_grade; samples=1; first=https://www.ableunited.com/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/benefits/disability/apply-child.html
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://myaccess.myflfamilies.com

## Next actions

- [critical] district_or_county_education_routing: expand_verified_leaf_targets_into_county_or_district_mapping
- [critical] county_local_disability_resources: keep_blocked_until_official_county_service_center_locator_is_recovered

## Batch 35 Florida statewide-family truth refresh

- Upgraded only the statewide Florida families already proven by first-party sources on disk.
- County-grade education routing and county-local disability resources remain the real unresolved Florida blockers.
