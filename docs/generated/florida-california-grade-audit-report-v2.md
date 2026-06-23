# Florida California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 67
- primary_gap_reason: official_local_offices_leaf_routes_to_partial_family_resource_center_and_myaccess_public_shell_only_exposes_dataexchangeproxy_shell

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
- county_local_disability_resources: blocked_partial_storefront_lane_and_public_dataexchangeproxy_shell_without_county_results (Official Florida DCF county-local routing remains blocked after one more bounded first-party MyACCESS static-contract pass. The live public `food-cash-and-medical` leaf still resolves only to the partial Family Resource Center storefront lane, and `providers.csv` still preserves only 34 distinct county values across 39 rows rather than a 67-county contract. On the MyACCESS side, the current public `config/appconfig.js` no longer advertises the old county-result method names; instead it wires `officeMapping` and `CreateCBOAccountService` to `/dataexchangeproxy` while leaving `communicationPreferenceService` and `partnerApproverServices` on `/accountmanagement`. The public `Public/CPCPS`, `Help/HCINT`, `config/config.json`, `/swagger`, `/swagger/index.html`, and `/dataexchangeproxy` routes all replay the same generic SPA shell rather than exposing a county-complete anonymous result surface. Florida therefore still has no public county-complete local-office contract.)

## Failure ledger

- county_local_disability_resources: official_family_resource_center_still_partial_and_myaccess_office_mapping_now_resolves_only_to_public_shell_contract :: Reviewed 2026-06-23 bounded live official checks on `https://www.myflfamilies.com/food-cash-and-medical`, `https://familyresourcecenter.myflfamilies.com/`, `https://familyresourcecenter.myflfamilies.com/providers.csv`, `https://myaccess.myflfamilies.com/Public/CPCPS`, `https://myaccess.myflfamilies.com/Help/HCINT`, `https://myaccess.myflfamilies.com/config/appconfig.js`, `https://myaccess.myflfamilies.com/config/config.json`, `https://myaccess.myflfamilies.com/swagger`, `https://myaccess.myflfamilies.com/swagger/index.html`, and `https://myaccess.myflfamilies.com/dataexchangeproxy`. The exact official `food-cash-and-medical` leaf still includes a `Find Local Offices` link, but that link lands on the Family Resource Center host, whose reviewed `providers.csv` still preserves only 34 distinct county values across 39 rows rather than a 67-county local-office contract. The first-party storefront HTML remains a derivative of that same partial dataset. On the MyACCESS side, the current public `config/appconfig.js` now advertises `officeMapping: '/dataexchangeproxy'` and `CreateCBOAccountService: '/dataexchangeproxy'`, while `communicationPreferenceService` and `partnerApproverServices` remain on `/accountmanagement`; the older `getZipCountyDetails` and `communityPartnerSearch` names are no longer exposed in the current public config. But the public `Public/CPCPS`, `Help/HCINT`, `config/config.json`, `/swagger`, `/swagger/index.html`, and bare `/dataexchangeproxy` routes all replay the same generic MyACCESS SPA shell rather than exposing an anonymous county-result contract. A bounded static bundle check on `UXModule.flPartnerLocation.85b7166d.js` also found county/zip/partner form wiring but no explicit public endpoint names to reopen the lane. Florida therefore remains blocked because the readable storefront lane is still partial and the current public MyACCESS shell still does not expose a county-complete anonymous office-mapping contract.

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
- county_local_disability_resources: blocked_partial_storefront_lane_and_public_dataexchangeproxy_shell_without_county_results; samples=23; first=https://www.myflfamilies.com/food-cash-and-medical

## Next actions

- [critical] county_local_disability_resources: hold_county_local_until_first_party_local_offices_lane_is_county_complete_or_anonymous_dataexchangeproxy_results_exist

## Repair decision

- Florida remains BLOCKED and not index-safe.
- The exact official `food-cash-and-medical` leaf still resolves only to the partial Family Resource Center storefront lane.
- The current public MyACCESS config now points `officeMapping` at `/dataexchangeproxy`, but the public CPCPS, HCINT, swagger, config.json, and bare dataexchangeproxy routes all replay the same shell instead of a county-result contract.
- Florida should reopen only when a county-complete first-party local-offices directory or anonymous office-mapping contract becomes public.
