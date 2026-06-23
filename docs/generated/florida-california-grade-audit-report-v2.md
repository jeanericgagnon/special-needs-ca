# Florida California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 67
- primary_gap_reason: public_myaccess_cpcps_and_help_routes_are_identical_shells_and_partner_services_stay_accountmanagement_401

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
- county_local_disability_resources: blocked_county_complete_public_contacts_wrong_role_and_authenticated_public_assistance_lane (Official Florida DCF county-local routing remains blocked because the live public contacts.csv now proves 67/67 county-to-circuit coverage, but a role-field audit across all 109 public rows still shows zero matches for ACCESS, Medicaid, SNAP, TANF, economic self-sufficiency, food assistance, or cash assistance. The public MyACCESS `Public/CPCPS` and `Help/HCINT` routes are not separate county-result surfaces: bounded fetches returned the same 5165-byte MyACCESS shell on both URLs with no county, office, storefront, or customer-service-center rows. The first-party appconfig still exposes partner services only under `/accountmanagement`, and bounded anonymous POST probes to `getZipCountyDetails` and `communityPartnerSearch` still return HTTP 401, so the county-result contract remains authenticated-only.)

## Failure ledger

- county_local_disability_resources: public_myaccess_cpcps_and_help_routes_are_identical_shells_and_partner_services_stay_accountmanagement_401 :: Reviewed 2026-06-23 bounded live official checks on https://familyresourcecenter.myflfamilies.com/providers.csv, https://www.myflfamilies.com/contact-us, https://www.myflfamilies.com/contact-us/contacts.csv, https://www.myflfamilies.com/services/public-assistance, https://www.myflfamilies.com/services/public-assistance/applying-for-assistance, https://myaccess.myflfamilies.com/Public/CPCPS, https://myaccess.myflfamilies.com/config/appconfig.js, https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails, https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch, and https://myaccess.myflfamilies.com/Help/HCINT. The Family Resource Center HTML and providers.csv still preserve reviewed storefront coverage for only 34/67 counties. The public Florida DCF contact-us page still loads a live first-party contacts.csv with explicit county coverage for all 67 counties, but the role-field audit returned zero matches for ACCESS, Medicaid, SNAP, TANF, economic self-sufficiency, food assistance, and cash assistance. The public MyACCESS `Public/CPCPS` and `Help/HCINT` routes returned the same 5165-byte generic MyACCESS shell with the same `<title>MyACCESS</title>`, the same appconfig bootstrap, and no county, office, or storefront result rows. The first-party appconfig still exposes partnerApproverServices only under `/accountmanagement`, and bounded anonymous POST probes to the exact official `getZipCountyDetails` plus `communityPartnerSearch` endpoints still return HTTP 401 with `{"message":"Unauthorized"}`. Florida therefore remains blocked because the county-complete public contract is the wrong service role, the public MyACCESS surfaces collapse to one generic shell, and the public-assistance county-result lane remains authenticated-only.

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
- county_local_disability_resources: blocked_county_complete_public_contacts_wrong_role_and_authenticated_public_assistance_lane; samples=8; first=https://www.myflfamilies.com/contact-us

## Next actions

- [critical] county_local_disability_resources: hold_county_local_until_first_party_public_assistance_county_contract_or_anonymous_myaccess_results_exist

## Repair decision

- Florida remains BLOCKED and not index-safe.
- The public county-complete DCF contacts.csv is still the wrong service role for county-local disability routing.
- The public MyACCESS `Public/CPCPS` and `Help/HCINT` routes are now proven to be the same generic shell, not two separate fallback contracts.
- The first-party appconfig still points partner services only to `/accountmanagement`, and the county-result endpoints remain authenticated-only under bounded anonymous probes.
- Florida should only reopen county-local once a first-party public-assistance county contract appears publicly or the existing MyACCESS county-result lane becomes anonymously reviewable.
