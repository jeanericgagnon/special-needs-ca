# Florida California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 67
- primary_gap_reason: official_myaccess_public_shell_and_proxy_do_not_expose_county_rows

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
- county_local_disability_resources: blocked_public_shell_and_proxy_without_county_rows (Official Florida DCF county-local routing remains split between a reviewed Family Resource Center CSV that covers 34/67 counties and a MyACCESS public shell/proxy lane that still does not expose a public county-row contract. The live app config still points officeMapping at /dataexchangeproxy, but the fetched UXModule.flPartnerLocation bundle only exposes blank form-schema fields like id/locationName/phoneNumber/streetAddress plus a county select control rather than a reviewed public county-result dataset.)

## Failure ledger

- county_local_disability_resources: official_myaccess_public_shell_and_proxy_do_not_expose_county_rows :: Reviewed 2026-06-22 bounded live official checks on https://familyresourcecenter.myflfamilies.com/providers.csv, https://myaccess.myflfamilies.com/Public/CPCPS, https://myaccess.myflfamilies.com/config/appconfig.js, https://myaccess.myflfamilies.com/dataexchangeproxy, and the live official bundle https://myaccess.myflfamilies.com/static/js/UXModule.flPartnerLocation.85b7166d.js. The Family Resource Center CSV still preserves reviewed storefront coverage for only 34/67 Florida counties. The public CPCPS entry and plain GET to /dataexchangeproxy both return the same 5165-byte MyACCESS shell instead of county results. Appconfig still exposes officeMapping=/dataexchangeproxy, but the fetched flPartnerLocation bundle only exposes county form controls and a blank location template (`id`, `locationName`, `phoneNumber`, `faxNumber`, `streetAddress`) rather than a documented public county-office search response or downloadable county dataset. Florida therefore still lacks reviewed first-party county-grade local-routing evidence for the remaining 33 counties.

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
- county_local_disability_resources: blocked_public_shell_and_proxy_without_county_rows; samples=34; first=https://familyresourcecenter.myflfamilies.com/providers.csv

## Next actions

- [critical] county_local_disability_resources: hold_county_local_until_first_party_county_dataset_or_search_contract_is_publicly_documented

## Repair decision

- Florida remains BLOCKED and not index-safe.
- The reviewed official Family Resource Center CSV still clears only 34 counties.
- The remaining MyACCESS lane is still not a public county-results contract: the shell and proxy return only the public app chrome, and the reviewed JS bundle exposes form-schema fields instead of a downloadable or queryable county-office dataset.
- Florida should only reopen county-local once a first-party county dataset or documented anonymous search contract is public for the remaining 33 counties.
