# Florida California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 67
- primary_gap_reason: bounded_official_leaf_packets_exhausted_without_county_grade_closure

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (Official APD regional offices page lists counties served across 67/67 Florida counties.)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (Official FDLRS directory exposes statewide associate center routing with 26 reviewed center links on the live official page.)
- district_or_county_education_routing: blocked_exact_leaf_repair_exhausted (Reviewed district-owned education exact leaves verified (12) across 8 bounded Florida packet roots, but county-grade coverage still cannot be proven for all 67 counties from the authored exact targets.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Official statewide Florida Vocational Rehabilitation transition and Pre-ETS source is present and verified.)
- protection_and_advocacy: verified_state_grade (Disability Rights Florida is already present as a verified first-party statewide P&A source.)
- parent_training_information_center: verified_state_grade (Family Network on Disabilities is already present as a verified first-party statewide PTI source.)
- legal_aid: verified_state_grade (Reviewed first-party Florida legal aid sources are present in the Florida source pack and verified discovery artifacts.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_missing_official_locator (The legacy ACCESS local service center map now 404s, and bounded same-domain repair only surfaced community-partner search and a statewide customer service center, not a county-grade official locator.)

## Failure ledger

- district_or_county_education_routing: bounded_official_district_leaf_packet_exhausted_before_county_grade_coverage :: Verified exact leaf targets remain limited to 12 reviewed district-owned leaves across 8 bounded Florida packet roots (fldoe.org, bakerk12.org, bay.k12.fl.us, bradfordschools.org, yourcharlotteschools.net, citrusschools.org, myoneclay.net, collierschools.com); this does not truthfully prove county-grade district routing statewide.
- county_local_disability_resources: official_local_service_center_locator_missing_after_same_domain_repair :: The legacy ACCESS local service center map now 404s, and bounded same-domain repair only surfaced community-partner search and a statewide customer service center, not a county-grade official locator.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.floridahealth.gov/individual-family-health/child-infant-youth/special-health-care-needs/cms/
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=3; first=https://apd.myflorida.com/cdcplus/
- developmental_disability_idd_authority: verified_state_grade; samples=6; first=https://apd.myflorida.com/region/northwest
- early_intervention_part_c: verified_state_grade; samples=3; first=https://www.floridaearlysteps.com
- special_education_idea_part_b: verified_state_grade; samples=26; first=https://www.fdlrs.org/
- district_or_county_education_routing: blocked_exact_leaf_repair_exhausted; samples=12; first=https://www.bakerk12.org/departments/exceptional-student-education-student-services/exceptional-student-education-student-services
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.rehabworks.org/student-youth/
- protection_and_advocacy: verified_state_grade; samples=4; first=https://www.disabilityrightsflorida.org
- parent_training_information_center: verified_state_grade; samples=2; first=https://fndusa.org
- legal_aid: verified_state_grade; samples=2; first=https://bals.org
- able_program: verified_state_grade; samples=1; first=https://www.ableunited.com/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/benefits/disability/apply-child.html
- county_local_disability_resources: blocked_missing_official_locator; samples=3; first=https://myaccess.myflfamilies.com

## Next actions

- [critical] district_or_county_education_routing: hold_blocked_until_new_exact_district_targets_are_authored
- [critical] county_local_disability_resources: hold_blocked_until_official_county_locator_is_restored_or_new_official_root_is_authored

## Florida final blocker decision

- Florida remains not index-safe because 12 reviewed district-owned leaves across 8 bounded district packet roots still do not prove county-grade education routing statewide.
- Florida county-local disability resources remain blocked because the only reviewed DCF root packet (myaccess.myflfamilies.com) still collapses to a dead legacy map plus community-partner and statewide-customer-center replacements, not a county-grade official locator.
- No further bounded official/static repair is currently available from the reviewed Florida packet roots, so the state is now treated as truthfully final-blocked until new exact official targets are authored or the missing official locator is restored.
