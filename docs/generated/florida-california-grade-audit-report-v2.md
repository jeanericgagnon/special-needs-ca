# Florida California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 67
- primary_gap_reason: public_family_resource_center_html_and_csv_stop_at_34_counties_and_remaining_county_results_are_authenticated

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
- county_local_disability_resources: blocked_public_csv_partial_authenticated_county_contract (Official Florida DCF county-local routing remains blocked because the live public Family Resource Center HTML and the reviewed storefront CSV both stop at 34 counties, and the newly proven same-domain accountmanagement endpoints are not anonymous public contracts. The public bundle names `/accountmanagement/getZipCountyDetails` and `/accountmanagement/communityPartnerSearch`, but bounded POST probes return `401 Unauthorized`, so the remaining county-office results are authenticated-only rather than publicly reviewable. The older on-disk staging file is broader, but it still mixes source-listed community partners, kiosks, storefronts, and hub rows from the same generic MyACCESS lane rather than a newly reviewed anonymous county contract.)

## Failure ledger

- county_local_disability_resources: public_family_resource_center_html_and_csv_stop_at_34_counties_and_remaining_county_results_are_authenticated :: Reviewed 2026-06-23 bounded live official checks on https://familyresourcecenter.myflfamilies.com/, https://familyresourcecenter.myflfamilies.com/providers.csv, https://myaccess.myflfamilies.com/Public/CPCPS, https://myaccess.myflfamilies.com/config/appconfig.js, https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails, and https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch. The live public Family Resource Center page itself now preserves only 34 county labels in fetched HTML on its image-map surface (Washington, Gadsden, Escambia, Leon, Okaloosa, Duval, Bay, Columbia, Alachua, Volusia, Marion, Citrus, Sumter, Seminole, Orange, Hernando, Brevard, Osceola, Polk, Hillsborough, Pinellas, Indian River, Highlands, St. Lucie, Sarasota, Okeechobee, Martin, Palm Beach, Lee, Broward, Miami-Dade, and Monroe), and the Family Resource Center CSV still preserves reviewed storefront coverage for only 34/67 Florida counties. The public config and main bundle explicitly name partnerApproverServices=/accountmanagement and service paths `/getZipCountyDetails` plus `/communityPartnerSearch`, proving the MyACCESS lane does have a same-domain county-search contract. But bounded anonymous POST probes to those exact official endpoints returned HTTP 401 with `{"message":"Unauthorized"}` for ZIP and county sample payloads. A local audit of the older on-disk staging file (`data/state-upgrades/florida/staging_dcf_access_offices.json`) also shows why row volume cannot reopen the family: it contains 61 `source_listed` rows split across 25 community partners, 13 storefronts, 11 kiosks, 8 DCF service centers, 2 regional hubs, 1 online portal, and 1 central call center, all still rooted in the generic MyACCESS lane rather than a newly reviewed anonymous county contract. The older public shell, plain GET proxy lane, Broward/Dade stub, sample rows, and dead `ess-storefronts-and-lobbies` help link still fail as public county-grade evidence. Florida therefore remains blocked not because no official contract exists, but because public county coverage stops at 34 counties and the remaining county-results contract is authenticated-only and not publicly reviewable for the other 33 counties.

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
- county_local_disability_resources: blocked_public_csv_partial_authenticated_county_contract; samples=39; first=https://familyresourcecenter.myflfamilies.com/providers.csv

## Next actions

- [critical] county_local_disability_resources: hold_county_local_until_first_party_anonymous_county_dataset_or_public_office_contract_covers_remaining_33_counties

## Repair decision

- Florida remains BLOCKED and not index-safe.
- The reviewed official Family Resource Center HTML and CSV both still stop at 34 counties, and the broader 61-row staging artifact cannot cure the gap because it is still only source-listed MyACCESS partner/kiosk/storefront material rather than a newly reviewed anonymous county contract.
- The remaining MyACCESS lane is sharper than a generic JS-shell blocker: the public bundle points at same-domain county-search endpoints, but bounded anonymous POST probes to `/accountmanagement/getZipCountyDetails` and `/communityPartnerSearch` return `401 Unauthorized`.
- Florida should only reopen county-local once the state publishes an anonymous county dataset or another public office contract for the remaining 33 counties.
