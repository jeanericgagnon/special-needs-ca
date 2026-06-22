# Florida California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 67
- primary_gap_reason: official_myaccess_county_locator_requires_browser_assisted_or_api_contract_repair

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
- county_local_disability_resources: blocked_browser_assisted_official_locator (The replatformed DCF Family Resource Center chain preserves reviewed storefront coverage for 34/67 counties, but the remaining county-grade office search now sits behind the live first-party MyACCESS Community Partner Search JavaScript shell and officeMapping dataexchangeproxy lane.)

## Failure ledger

- county_local_disability_resources: official_myaccess_county_locator_requires_browser_assisted_or_api_contract_repair :: The official Family Resource Center page and same-domain providers.csv preserve reviewed storefront rows for only 34 of Florida’s 67 counties. The live first-party MyACCESS Community Partner Search at https://myaccess.myflfamilies.com/Public/CPCPS is a JavaScript shell, appconfig.js exposes officeMapping=/dataexchangeproxy, and a bounded plain GET to https://myaccess.myflfamilies.com/dataexchangeproxy returns the same shell instead of county results. The remaining 33 counties therefore require browser-assisted or documented API-contract extraction from the official first-party lane.

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
- county_local_disability_resources: blocked_browser_assisted_official_locator; samples=34; first=https://familyresourcecenter.myflfamilies.com/providers.csv

## Next actions

- [critical] county_local_disability_resources: move_county_local_disability_resources_to_browser_assisted_myaccess_office_mapping_repair

## Florida repair decision

- District or county education routing remains verified from the live official FDLRS county routing page.
- County-local disability resources are still not California-grade complete. The reviewed Family Resource Center chain still covers only 34/67 counties, and the remaining official locator lane now resolves to the live first-party MyACCESS JS shell rather than static county office rows.
- Florida therefore remains truthfully BLOCKED and not index-safe until the remaining 33 counties are repaired through a browser-assisted or documented API-contract extraction from the official MyACCESS office-mapping lane.

## Evidence checks

- Family Resource Center partial coverage: 34/67 counties remain preserved from reviewed same-domain storefront rows.
- MyACCESS Community Partner Search: https://myaccess.myflfamilies.com/Public/CPCPS returned 200 with title "MyACCESS" but only a JavaScript shell and no county office rows in static HTML.
- MyACCESS app config: https://myaccess.myflfamilies.com/config/appconfig.js exposes officeMapping=/dataexchangeproxy.
- Office-mapping endpoint check: bounded plain GET to https://myaccess.myflfamilies.com/dataexchangeproxy returned 200 with the same shell, so the remaining county-local office evidence is browser-assisted or API-contract-only in the current lane.

## Final family count

- strong_critical_families: 11
- weak_critical_families: 1
- missing_critical_families: 0
- county_local_disability_resources: blocked_browser_assisted_official_locator
