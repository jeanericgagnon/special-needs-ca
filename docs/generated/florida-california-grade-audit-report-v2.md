# Florida California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 67
- primary_gap_reason: official_local_offices_leaf_routes_to_partial_family_resource_center_and_myaccess_results_stay_authenticated

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
- county_local_disability_resources: blocked_official_storefront_root_and_csv_only_cover_partial_county_set_and_authenticated_myaccess_results (Official Florida DCF county-local routing remains blocked after one more bounded first-party MyACCESS/config pass. The live public `food-cash-and-medical` leaf still resolves only to the partial Family Resource Center storefront lane, and the first-party storefront still derives its county UI from the same 34-county `providers.csv`. On the MyACCESS side, the public `config/appconfig.js` still wires the county-result search services under `/accountmanagement`, while `/swagger` and `/swagger/index.html` only replay the same generic SPA shell rather than exposing a public API surface. The anonymous county-result endpoints therefore still have no public, county-complete successor contract.)

## Failure ledger

- county_local_disability_resources: official_family_resource_center_html_and_csv_both_materialize_only_partial_county_contract_while_myaccess_results_stay_authenticated :: Reviewed 2026-06-23 one more bounded official Florida county-local pass on the first-party storefront and MyACCESS config shell. The Family Resource Center root at https://familyresourcecenter.myflfamilies.com/ remains live and `providers.csv` still preserves only 34 distinct county values across 39 rows rather than a 67-county contract. On the MyACCESS side, https://myaccess.myflfamilies.com/config/appconfig.js still wires the search services through `/accountmanagement`, including the county-result lanes already probed anonymously. Meanwhile https://myaccess.myflfamilies.com/config/config.json, https://myaccess.myflfamilies.com/swagger, and https://myaccess.myflfamilies.com/swagger/index.html all return only the same generic SPA shell rather than a public API description or alternate anonymous result surface. Florida therefore remains blocked because the readable storefront lane is partial and the MyACCESS county-result lane still has no public anonymous contract.

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
- county_local_disability_resources: blocked_official_storefront_root_and_csv_only_cover_partial_county_set_and_authenticated_myaccess_results; samples=11; first=https://www.myflfamilies.com/food-cash-and-medical

## Next actions

- [critical] county_local_disability_resources: hold_county_local_until_first_party_local_offices_lane_is_county_complete_or_anonymous_myaccess_results_exist

## Repair decision

- Florida remains BLOCKED and not index-safe.
- The exact official `food-cash-and-medical` leaf still lands on the partial Family Resource Center storefront lane.
- The MyACCESS public config still routes county-result services through `/accountmanagement`, and the public `/swagger` paths only replay the same generic SPA shell rather than exposing an anonymous API surface.
- Florida should reopen only when a county-complete first-party local-office contract or anonymous county-result lane becomes public.
