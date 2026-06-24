# Florida California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 67
- primary_gap_reason: official_local_offices_leaf_routes_to_partial_family_resource_center_and_current_myaccess_public_shell_and_main_bundle_still_expose_no_anonymous_county_contract

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
- county_local_disability_resources: blocked_partial_storefront_lane_and_recovered_myaccess_bundle_without_anonymous_county_results (Official Florida DCF county-local routing remains blocked after one more bounded live first-party MyACCESS bundle check. The exact `food-cash-and-medical` leaf still routes families only into the partial Family Resource Center storefront lane, and `providers.csv` still preserves only 34 distinct county values across 39 rows rather than a 67-county local-office contract. The MyACCESS public lane remains readable, but it still does not expose an anonymous county-result contract: the root, `Public/CPCPS`, `config/appconfig.js`, `asset-manifest.json`, and the live main bundle all return HTTP 200. Appconfig still exposes `officeMapping: /dataexchangeproxy` plus `CreateCBOAccountService: /dataexchangeproxy`, the public `dataexchangeproxy` root still replays the same shell, the exact `/accountmanagement/getZipCountyDetails` plus `/accountmanagement/communityPartnerSearch` endpoints still return HTTP 401 `Unauthorized`, and a bounded string sweep across `static/js/main.d43b0959.js` finds no public county-result endpoint names or even `county`, `office`, or `zip` tokens. Florida therefore still has no county-complete public local-office contract.)

## Failure ledger

- county_local_disability_resources: official_family_resource_center_still_partial_and_recovered_myaccess_public_bundle_exposes_no_anonymous_county_results :: Reviewed 2026-06-23 bounded live official checks on `https://www.myflfamilies.com/food-cash-and-medical`, `https://familyresourcecenter.myflfamilies.com/providers.csv`, `https://myaccess.myflfamilies.com/`, `https://myaccess.myflfamilies.com/Public/CPCPS`, `https://myaccess.myflfamilies.com/config/appconfig.js`, `https://myaccess.myflfamilies.com/asset-manifest.json`, `https://myaccess.myflfamilies.com/static/js/main.d43b0959.js`, `https://myaccess.myflfamilies.com/dataexchangeproxy`, `https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails`, and `https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch`. The exact official `food-cash-and-medical` leaf still points families to the Family Resource Center lane, whose reviewed `providers.csv` still preserves only 34 distinct county values across 39 rows rather than a 67-county local-office contract. The MyACCESS public lane remains readable: the root, `Public/CPCPS`, `config/appconfig.js`, `asset-manifest.json`, and `static/js/main.d43b0959.js` all return HTTP 200. But the recovered public surfaces still do not materialize a county-result contract. Current `appconfig.js` exposes `officeMapping: '/dataexchangeproxy'` and `CreateCBOAccountService: '/dataexchangeproxy'`, while `/dataexchangeproxy` itself only replays the same generic shell as the root and `Public/CPCPS`. The only exact county-result endpoints still visible in the host family remain `/accountmanagement/getZipCountyDetails` and `/accountmanagement/communityPartnerSearch`, and bounded GET plus POST probes to those endpoints still return HTTP 401 `{"message":"Unauthorized"}`. A bounded string sweep across the live main bundle also found no public county-result endpoint names and no `county`, `office`, or `zip` tokens at all, so the recovered SPA bundle itself still exposes no anonymous county-result contract. Florida therefore remains blocked because the storefront lane is still partial and the recovered MyACCESS public shell plus main bundle still do not expose anonymous county results.

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
- county_local_disability_resources: blocked_partial_storefront_lane_and_recovered_myaccess_bundle_without_anonymous_county_results; samples=13; first=https://www.myflfamilies.com/food-cash-and-medical

## Next actions

- [critical] county_local_disability_resources: hold_county_local_until_first_party_local_offices_lane_is_county_complete_or_a_public_myaccess_county_result_contract_exists

## Repair decision

- Florida remains BLOCKED and not index-safe.
- The exact official `food-cash-and-medical` leaf still routes county-local discovery only into the partial Family Resource Center storefront lane.
- The recovered MyACCESS root, public entry, config, asset manifest, and live main bundle still do not expose an anonymous county-result contract.
- The only exact county-result endpoints still visible in the host family remain authenticated-only and return HTTP 401 on bounded anonymous probes.
- Florida should reopen only when a county-complete first-party local-offices directory or anonymous MyACCESS office-mapping result lane becomes public.
