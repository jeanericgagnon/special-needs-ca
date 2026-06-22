# Florida California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 67
- primary_gap_reason: official_family_resource_center_csv_only_covers_34_counties

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
- county_local_disability_resources: blocked_official_csv_contract_partial (The public first-party Family Resource Center contract is now explicit: the homepage fetches providers.csv to power the county filter, and that official CSV covers only 34/67 Florida counties.)

## Failure ledger

- county_local_disability_resources: official_family_resource_center_csv_only_covers_34_counties :: Reviewed 2026-06-22 live first-party Family Resource Center homepage https://familyresourcecenter.myflfamilies.com/ and its published dataset https://familyresourcecenter.myflfamilies.com/providers.csv. The homepage JavaScript explicitly fetches providers.csv to populate the county filter, and the official CSV contains only 39 rows covering 34 unique Florida counties. The public first-party dataset therefore stops at 34/67 counties, so the remaining 33 counties are absent from the published county-local routing contract rather than merely hidden behind the blocked MyACCESS browser lane.

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
- county_local_disability_resources: blocked_official_csv_contract_partial; samples=34; first=https://familyresourcecenter.myflfamilies.com/providers.csv

## Next actions

- [critical] county_local_disability_resources: hold_county_local_until_first_party_family_resource_center_dataset_expands_or_new_official_county_locator_is_published

## Florida repair decision

- District or county education routing remains verified from the live official FDLRS county routing page.
- County-local disability resources are still not California-grade complete. The public first-party Family Resource Center homepage openly uses providers.csv as its county filter dataset, and that official CSV still covers only 34 of Florida’s 67 counties.
- Florida therefore remains truthfully BLOCKED and not index-safe until the first-party Family Resource Center dataset expands to the remaining counties or a new official county locator is published.
