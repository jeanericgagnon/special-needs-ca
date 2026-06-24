# Florida California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 67
- primary_gap_reason: official_local_offices_leaf_routes_to_partial_family_resource_center_and_current_myaccess_public_lane_is_cloudfront_blocked

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
- county_local_disability_resources: blocked_partial_storefront_lane_and_current_myaccess_public_lane_cloudfront_blocked (Official Florida DCF county-local routing remains blocked after one more bounded live first-party MyACCESS regression check. The live public `food-cash-and-medical` leaf still resolves county-local discovery only into the partial Family Resource Center storefront lane, and `providers.csv` still preserves only 34 distinct county values across 39 rows rather than a 67-county contract. But the current MyACCESS public lane is now even weaker than the last saved shell-only packet: direct live checks on `Public/CPCPS`, `config/appconfig.js`, and the current partner-location bundle path all return CloudFront `403 Request blocked` responses instead of even replaying a readable public shell. Florida therefore still has no county-complete public local-office contract, and the current MyACCESS public lane is now edge-blocked as well.)

## Failure ledger

- county_local_disability_resources: official_family_resource_center_still_partial_and_current_myaccess_public_shell_assets_now_return_cloudfront_403 :: Reviewed 2026-06-24 bounded live official checks on `https://www.myflfamilies.com/food-cash-and-medical`, `https://familyresourcecenter.myflfamilies.com/providers.csv`, `https://myaccess.myflfamilies.com/Public/CPCPS`, `https://myaccess.myflfamilies.com/config/appconfig.js`, `https://myaccess.myflfamilies.com/static/js/UXModule.flPartnerLocation.85b7166d.js`, `https://myaccess.myflfamilies.com/asset-manifest.json`, and `https://myaccess.myflfamilies.com/dataexchangeproxy/swagger/index.html`. The exact official `food-cash-and-medical` leaf still points families to the Family Resource Center lane, whose reviewed `providers.csv` still preserves only 34 distinct county values across 39 rows rather than a 67-county local-office contract. On the MyACCESS side, the current public lane has regressed from a readable shell to an edge-blocked surface: live `HEAD` checks on `Public/CPCPS`, `config/appconfig.js`, and `static/js/UXModule.flPartnerLocation.85b7166d.js` now all return HTTP 403 with CloudFront `Request blocked` responses, and direct fetches for `asset-manifest.json` and `dataexchangeproxy/swagger/index.html` also return the same CloudFront 403 body. Florida therefore remains blocked because the readable storefront lane is still partial and the current official MyACCESS public lane is now CloudFront-blocked rather than a reviewable anonymous county-result contract.

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
- county_local_disability_resources: blocked_partial_storefront_lane_and_current_myaccess_public_lane_cloudfront_blocked; samples=33; first=https://www.myflfamilies.com/food-cash-and-medical

## Next actions

- [critical] county_local_disability_resources: hold_county_local_until_first_party_local_offices_lane_is_county_complete_or_current_myaccess_public_lane_recovers_anonymous_results

## Repair decision

- Florida remains BLOCKED and not index-safe.
- The exact official `food-cash-and-medical` leaf still routes county-local discovery only into the partial Family Resource Center storefront lane.
- The current official MyACCESS public lane has now regressed to CloudFront 403 `Request blocked` responses on the public shell, config, bundle, and asset-manifest paths.
- Florida should reopen only when a county-complete first-party local-offices directory or a recovered anonymous MyACCESS county-result lane becomes public.
