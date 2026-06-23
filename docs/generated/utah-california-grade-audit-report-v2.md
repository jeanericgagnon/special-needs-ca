# Utah California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 29
- primary_gap_reason: official_usbe_district_lea_directory_clears_education_but_public_dws_office_api_only_materializes_26_of_29_physical_office_counties_and_still_lacks_county_service_area_contract

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
- county_local_disability_resources: blocked_public_office_api_without_county_service_area_contract (the live official Utah DWS office-search stack still exposes a public office inventory API at `https://officesearch-api.jobs.utah.gov/api/v1/offices`, and that payload still returns 99 rows covering 45 unique offices with fields like `officeName`, `address1`, `city`, `zipCode`, `serviceName`, `latitude`, and `longitude`. But there is still no county field, counties-served field, or other reusable county-to-office contract, the companion `services` endpoint still exposes only service classes, the guessed `office-services` route now returns `404`, the docs surfaces (`openapi.json`, `swagger-ui/index.html`, and `v3/api-docs`) now return `404 Service Not Found`, the older DWS roots (`jobs.utah.gov/sitemap.xml` and `jobs.utah.gov/customereducation/serviceslocations.html`) now return `500`, `dhhs.utah.gov/locations` now returns `404`, and a bounded reverse-geocode audit still materializes physical offices in only 26 of Utah's 29 counties while `Daggett` and `Morgan` never appear in the payload and `Rich` appears only as `Richfield`.)

## Failure ledger

- county_local_disability_resources: public_dws_office_api_only_materializes_26_of_29_physical_office_counties_and_still_lacks_county_service_area_contract :: Reviewed 2026-06-23 one more bounded official Utah county-local pass on the current live DWS office-search surfaces. `https://jobs.utah.gov/office-search/` and the older `https://jobs.utah.gov/jsp/officesearch/` alias both still land on the live Office Search shell, and `GET https://officesearch-api.jobs.utah.gov/api/v1/offices` still returns 99 public rows covering 45 unique offices with `officeName`, address, city, zip, service, and coordinate fields but no county or counties-served field. The companion `GET https://officesearch-api.jobs.utah.gov/api/v1/services` endpoint still exposes only service classes (`All`, `USOR`, `EC`), while the guessed `GET https://officesearch-api.jobs.utah.gov/api/v1/office-services` route now returns an explicit JSON `404 Not Found` and the docs probes (`/openapi.json`, `/swagger-ui/index.html`, `/v3/api-docs`) now return `404 Service Not Found`. The older public roots also still add no successor county contract: `jobs.utah.gov/sitemap.xml` and `jobs.utah.gov/customereducation/serviceslocations.html` now return `500 Internal Server Error`, and `dhhs.utah.gov/locations` returns `404`. A bounded reverse-geocode audit of the exact official office coordinates still materializes physical offices in only 26 of Utah's 29 counties, leaving Daggett, Morgan, and Rich without even an in-county office point. One more payload-text audit confirms `Daggett` and `Morgan` never appear anywhere in the public JSON, `Rich` appears only inside `Richfield` office names, and the only literal county-looking office names are `Emery County (Castle Dale)` and `South County (Taylorsville)`, which is still far short of a statewide county contract.

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
- county_local_disability_resources: legacy_state_grade; samples=10; first=https://jobs.utah.gov/office-search/

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_public_office_api_or_successor_directory_exposes_county_or_service_area_assignments_for_missing_daggett_morgan_rich_counties

## Completion decision

- Utah still keeps the education repair from the live Utah Schools Directory.
- Utah county-local routing remains the only critical blocker and the live official DWS office-search stack is now narrowed to today’s exact public surfaces rather than an assumed successor lane.
- The live public office API still returns office inventory rows and service classes only. It does not publish county fields, counties served, or another reusable county-to-office contract.
- The guessed `office-services` route and all probed docs surfaces now fail explicitly with `404`, which strengthens the finding that no public self-describing county contract is exposed on the current API host.
- The older public roots also still fail to supply a successor county contract: `jobs.utah.gov/sitemap.xml` and `jobs.utah.gov/customereducation/serviceslocations.html` now return `500`, while `dhhs.utah.gov/locations` returns `404`.
- A bounded official reverse-geocode audit of the 45 unique office coordinates still only materializes physical offices in 26 of Utah's 29 counties, leaving Daggett, Morgan, and Rich without even an in-county office point.
- One more bounded payload-text audit also confirmed `Daggett` and `Morgan` never appear anywhere in the public office JSON, while `Rich` appears only as `Richfield` office naming rather than Rich County routing.
- Utah therefore remains BLOCKED and not index-safe.
