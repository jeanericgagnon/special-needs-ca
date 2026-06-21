# Florida California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 67
- primary_gap_reason: official_family_resource_center_locator_partial_county_coverage

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (Official APD regional offices page lists counties served across 67/67 Florida counties.)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (Official FDLRS directory exposes statewide associate center routing with 26 reviewed center links on the live official page.)
- district_or_county_education_routing: verified_state_grade (Official FDLRS county routing now preserves associate-center coverage for 67/67 Florida counties on the live statewide contact page, replacing the stale limited eight-root district packet.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Official statewide Florida Vocational Rehabilitation transition and Pre-ETS source is present and verified.)
- protection_and_advocacy: verified_state_grade (Disability Rights Florida is already present as a verified first-party statewide P&A source.)
- parent_training_information_center: verified_state_grade (Family Network on Disabilities is already present as a verified first-party statewide PTI source.)
- legal_aid: verified_state_grade (Reviewed first-party Florida legal aid sources are present in the Florida source pack and verified discovery artifacts.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_partial_official_county_locator (The replatformed DCF Family Resource Center page and same-domain providers.csv preserve structured official storefront coverage for 34/67 Florida counties, but 33 counties still lack reviewed county-grade office coverage.)

## Failure ledger

- county_local_disability_resources: official_family_resource_center_locator_partial_county_coverage :: The live official Family Resource Center locator and providers.csv now replace the dead legacy ACCESS map, but they only preserve reviewed county-grade office coverage for 34 of Florida’s 67 counties.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.floridahealth.gov/individual-family-health/child-infant-youth/special-health-care-needs/cms/
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=3; first=https://apd.myflorida.com/cdcplus/
- developmental_disability_idd_authority: verified_state_grade; samples=6; first=https://apd.myflorida.com/region/northwest
- early_intervention_part_c: verified_state_grade; samples=3; first=https://www.floridaearlysteps.com
- special_education_idea_part_b: verified_state_grade; samples=26; first=https://www.fdlrs.org/
- district_or_county_education_routing: verified_state_grade; samples=67; first=https://www.fdlrssouth.org/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.rehabworks.org/student-youth/
- protection_and_advocacy: verified_state_grade; samples=4; first=https://www.disabilityrightsflorida.org
- parent_training_information_center: verified_state_grade; samples=2; first=https://fndusa.org
- legal_aid: verified_state_grade; samples=2; first=https://bals.org
- able_program: verified_state_grade; samples=1; first=https://www.ableunited.com/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/benefits/disability/apply-child.html
- county_local_disability_resources: blocked_partial_official_county_locator; samples=34; first=https://familyresourcecenter.myflfamilies.com/providers.csv

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_remaining_33_counties_gain_reviewed_official_family_resource_center_or_equivalent_office_rows

## Florida repair decision

- District or county education routing is now verified because the live official FDLRS county directory preserves associate-center routing for 67/67 counties and explicitly states that support exists in every county and school district.
- County-local disability resources improved from a dead legacy ACCESS map to a reviewed official DCF Family Resource Center chain on https://www.myflfamilies.com/food-cash-and-medical -> https://familyresourcecenter.myflfamilies.com/ -> https://familyresourcecenter.myflfamilies.com/providers.csv, but that chain only preserves 34/67 counties.
- Florida therefore remains truthfully BLOCKED and not index-safe because 33 counties still lack reviewed official county-grade storefront coverage.

## Evidence checks

- FDLRS statewide county routing: Reviewed 2026-06-21 live probe returned official FDLRS county sections with associate-center routing and the statement that FDLRS supports families and educators in every county and school district in Florida.
- Family Resource Center landing: Reviewed 2026-06-21 live probe returned the replatformed DCF Food, Cash, and Medical page with a direct official "Find Local Offices" link to the Family Resource Center domain.
- Family Resource Center county coverage: The official Family Resource Center page and same-domain providers.csv preserve structured storefront coverage for 34 Florida counties, but 33 counties still lack reviewed official county-grade office rows in the fetched artifact chain.
- County-local covered samples: Alachua (Gainesville Service Center); Bay (Bay County Service Center); Brevard (Brevard County ACCESS Application Center)
- County-local uncovered sample counties: Baker, Bradford, Calhoun, Charlotte, Clay, DeSoto, Dixie, Flagler

## Final family count

- strong_critical_families: 11
- weak_critical_families: 1
- missing_critical_families: 0
- district_or_county_education_routing: verified_state_grade
- county_local_disability_resources: blocked_partial_official_county_locator
