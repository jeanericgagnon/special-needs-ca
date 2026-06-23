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
- county_local_disability_resources: blocked_official_storefront_root_and_csv_only_cover_partial_county_set_and_authenticated_myaccess_results (Official Florida DCF county-local routing remains blocked after one more bounded first-party storefront pass. The live public `food-cash-and-medical` leaf still advertises `Local Offices` and links to the Family Resource Center host, but that first-party lane now proves its own limit in two places: the reviewed `providers.csv` still preserves only 34 distinct county values across 39 rows, and the reviewed storefront HTML hardcodes only 33 unique `filterByCountyFromMap(...)` county pins, including a `Monore` typo, while deriving the county dropdown directly from the same `providers.csv` dataset. The public DCF contacts.csv still proves 67/67 county-to-circuit coverage but zero true ACCESS, Medicaid, SNAP, TANF, economic self-sufficiency, food assistance, cash assistance, or customer service center rows. The live sitemap still exposes `contact-us/circuit-*` children that return HTTP 404, and the anonymous MyACCESS county-result endpoints still return HTTP 401.)

## Failure ledger

- county_local_disability_resources: official_family_resource_center_html_and_csv_both_materialize_only_partial_county_contract_while_myaccess_results_stay_authenticated :: Reviewed 2026-06-23 bounded live official checks on https://www.myflfamilies.com/sitemap.xml, https://www.myflfamilies.com/contact-us, https://www.myflfamilies.com/contact-us/contacts.csv, https://www.myflfamilies.com/services/public-assistance, https://www.myflfamilies.com/services/public-assistance/applying-for-assistance, https://www.myflfamilies.com/services/public-assistance/economic-self-sufficiency-frequently-asked-questions/, https://www.myflfamilies.com/services/public-assistance/additional-resources-and-services/community/, https://www.myflfamilies.com/food-cash-and-medical, https://familyresourcecenter.myflfamilies.com/, https://familyresourcecenter.myflfamilies.com/providers.csv, https://myaccess.myflfamilies.com/Public/CPCPS, https://myaccess.myflfamilies.com/Help/HCINT, https://myaccess.myflfamilies.com/config/appconfig.js, https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails, and https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch. The exact official `food-cash-and-medical` leaf still includes a `Find Local Offices` link, but that link lands on the Family Resource Center host, whose reviewed `providers.csv` preserves only 34 distinct county values across 39 rows rather than a 67-county local-office contract. The same first-party storefront HTML proves there is no hidden county-complete dataset on the public root: it hardcodes only 33 unique `filterByCountyFromMap(...)` county pins (38 total pin calls because some counties repeat) and even includes a `Monore` typo, while the inline dropdown logic explicitly fetches `https://familyresourcecenter.myflfamilies.com/providers.csv` and populates the county selector from `new Set(data.map(item => item.counties.trim()))`. The public contacts.csv still loads with all 67 counties mapped to circuits, but a bounded role-field audit across all 109 rows still returns zero true matches for ACCESS, Medicaid, SNAP, TANF, economic self-sufficiency, food assistance, cash assistance, or customer service center, and the apparent `ESS` hits remain false positives from `5920 Arlington Expressway`. The live sitemap still advertises `contact-us/circuit-*` children, and sampled circuit leaves such as `/contact-us/circuit-3` and `/contact-us/circuit-11` still return live HTTP 404 responses. The anonymous MyACCESS `Public/CPCPS` and `Help/HCINT` routes still return the same generic MyACCESS shell, and bounded anonymous POST probes to the exact official `getZipCountyDetails` plus `communityPartnerSearch` endpoints still return HTTP 401 with `{"message":"Unauthorized"}`. Florida therefore remains blocked because the exact official local-offices leaf still resolves only to a partial storefront lane, the storefront root itself derives its county UI from that same partial CSV, the public circuit leaves are dead, and the county-result search lane remains authenticated-only.

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
- county_local_disability_resources: blocked_official_storefront_root_and_csv_only_cover_partial_county_set_and_authenticated_myaccess_results; samples=8; first=https://www.myflfamilies.com/food-cash-and-medical

## Next actions

- [critical] county_local_disability_resources: hold_county_local_until_first_party_local_offices_lane_is_county_complete_or_anonymous_myaccess_results_exist

## Repair decision

- Florida remains BLOCKED and not index-safe.
- The exact official `food-cash-and-medical` leaf still resolves only to the partial Family Resource Center storefront lane.
- The first-party storefront root itself derives its county dropdown and county pins from the same partial `providers.csv`, so the root is not a stronger county-complete contract than the CSV.
- The public DCF contacts.csv remains the wrong service role, the public circuit leaves remain dead, and the anonymous MyACCESS county-result endpoints remain authenticated-only.
- Florida should reopen county-local only if a county-complete first-party local-offices directory or anonymous county-result contract becomes public.
