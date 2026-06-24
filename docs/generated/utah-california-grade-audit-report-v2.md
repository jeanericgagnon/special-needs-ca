# Utah California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 29
- primary_gap_reason: official_usbe_district_lea_directory_clears_education_but_live_dws_bundle_only_supports_city_or_zip_search_and_public_office_api_still_lacks_county_service_area_contract

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_current_official_district_lea_directory (the live Utah Schools Directory now clears district-grade education routing. The official page title is `Utah Schools Directory`, its description says the data is provided from the District or Local Education Agency (LEA) in the CACTUS system and directs corrections back to the District/LEA, the page exposes a District or LEA filter control, and it provides an export-to-CSV action on the current schools.utah.gov host.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party Disability Law Center evidence explicitly preserves Utah's Protection and Advocacy agency designation)
- parent_training_information_center: verified_state_grade (reviewed first-party Utah Parent Center PTI leaf explicitly preserves Parent Training and Information identity plus Utah contact evidence)
- legal_aid: verified_state_grade (reviewed first-party Disability Law Center evidence preserves statewide disability legal-rights help plus Apply for Help intake routing)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_live_dws_bundle_city_zip_only_without_county_service_area_contract (The live official Utah DWS office-search app is now narrowed to its current first-party page and bundle contract. `https://jobs.utah.gov/office-search/` loads a public JS bundle whose config points to `https://officesearch-api.jobs.utah.gov`, whose resolver fetches `/api/v1/offices`, whose service cache fetches `/api/v1/services`, and whose optional `getOfficeServices()` call still points to `/api/v1/office-services`. But the public office payload still returns only office inventory fields like `officeName`, `address1`, `city`, `zipCode`, `serviceName`, `latitude`, and `longitude`, the public services payload still returns only service classes (`All`, `USOR`, `EC`), the exact `office-services` route still returns `404 Not Found`, and the bundle search logic still only filters by `city` or `zipCode` before falling back to nearest-office geocoding. Neither the page HTML nor the reviewed bundle carries a county field, counties-served field, county filter, or other reusable county-to-office contract, and a bounded reverse-geocode audit still materializes physical offices in only 26 of Utah's 29 counties while `Daggett` and `Morgan` never appear in the public JSON and `Rich` appears only inside `Richfield`.)

## Failure ledger

- county_local_disability_resources: live_dws_bundle_only_supports_city_or_zip_search_and_public_office_api_still_lacks_county_service_area_contract :: Reviewed 2026-06-23 one more bounded official Utah county-local pass on the exact live office-search page plus its first-party JS bundle and public API surfaces. `https://jobs.utah.gov/office-search/` still returns a live public shell, and the current app bundle (`main-NUCK4XJI.js` plus imported chunks) now makes the contract explicit: the config sets `apiUrl` to `https://officesearch-api.jobs.utah.gov`, `getOfficeDataFromApi()` calls `/api/v1/offices`, `getServicesList()` calls `/api/v1/services`, and `getOfficeServices()` still points to `/api/v1/office-services`. The search logic in the live bundle only filters office rows by `city` and then `zipCode`, and otherwise falls back to nearest-office geocoding; there is still no county filter, county field, or counties-served field in the page HTML or reviewed bundle text. The public office payload still returns 99 rows covering 45 unique offices with `officeName`, address, city, zip, service, and coordinate fields but no county or service-area assignment, the companion services endpoint still exposes only service classes (`All`, `USOR`, `EC`), and the exact `office-services` route still returns JSON `404 Not Found`. A bounded reverse-geocode audit of the exact official office coordinates still materializes physical offices in only 26 of Utah's 29 counties, leaving Daggett, Morgan, and Rich without even an in-county office point. One more payload-text audit confirms `Daggett` and `Morgan` never appear anywhere in the public JSON, `Rich` appears only inside `Richfield` office names, and there is still no public county-grade office contract.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ssa.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://dspd.utah.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.utah.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.utah.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://schools.utah.gov/
- district_or_county_education_routing: verified_current_official_district_lea_directory; samples=3; first=https://schools.utah.gov/schoolsdirectory
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://dspd.utah.gov
- protection_and_advocacy: verified_state_grade; samples=1; first=http://disabilitylawcenter.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://utahparentcenter.org/projects/pti
- legal_aid: verified_state_grade; samples=1; first=http://disabilitylawcenter.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: legacy_state_grade; samples=12; first=https://jobs.utah.gov/office-search/

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_public_utah_dws_successor_exposes_county_or_service_area_assignments_in_api_payload_or_reviewable_official_leaf

## Completion decision

- Utah still keeps the education repair from the live Utah Schools Directory.
- Utah county-local routing remains the only critical blocker, and the live DWS office-search stack is now narrowed not just to the public APIs but to the current bundle contract itself.
- The live office-search bundle explicitly sets `apiUrl` to `https://officesearch-api.jobs.utah.gov` and only calls `/api/v1/offices`, `/api/v1/services`, and `/api/v1/office-services`.
- The reviewed bundle search logic only filters by `city` and then `zipCode`, and otherwise falls back to nearest-office geocoding. It does not expose a county filter, county field, or counties-served field.
- The public office payload still returns office inventory and coordinates only, the services payload still returns only service classes, and the exact `office-services` route still returns `404`.
- A bounded official reverse-geocode audit of the 45 unique office coordinates still only materializes physical offices in 26 of Utah's 29 counties, leaving Daggett, Morgan, and Rich without even an in-county office point.
- One more bounded payload-text audit also confirmed `Daggett` and `Morgan` never appear anywhere in the public office JSON, while `Rich` appears only as `Richfield` office naming rather than Rich County routing.
- Utah therefore remains BLOCKED and not index-safe.
