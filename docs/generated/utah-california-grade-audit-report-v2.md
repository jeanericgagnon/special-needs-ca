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
- county_local_disability_resources: blocked_public_office_api_without_county_service_area_contract (the official Utah DWS office-search app exposes a public API at `https://officesearch-api.jobs.utah.gov/api/v1/offices` and that API returns 99 public rows covering 45 unique offices with names, addresses, lat/lng, service codes, and assistance instructions. But the payload still exposes no county fields or counties-served fields, a bounded reverse-geocode audit only materializes physical offices in 26 of Utah's 29 counties, and one more payload-text audit confirms `Daggett` and `Morgan` never appear anywhere in the public JSON while `Rich` appears only as `Richfield`, not as Rich County routing.)

## Failure ledger

- county_local_disability_resources: public_dws_office_api_only_materializes_26_of_29_physical_office_counties_and_still_lacks_county_service_area_contract :: Reviewed 2026-06-23 one more bounded official Utah county-local pass on the same live public DWS office API. The official `GET https://officesearch-api.jobs.utah.gov/api/v1/offices` payload still returns 99 public rows covering 45 unique offices with office names, addresses, service codes, lat/lng, and assistance instructions, but still no county field, counties-served field, or reusable county-to-office contract. A bounded reverse-geocode audit of those exact official office coordinates still materializes physical offices in only 26 of Utah's 29 counties, leaving Daggett, Morgan, and Rich without even an in-county office point. One more payload-text audit now tightens that blocker further: `Daggett` and `Morgan` do not appear anywhere in the public JSON at all, `Rich` appears only inside `Richfield` office names rather than as Rich County routing, and the only literal `county` office-name tokens are `Emery County (Castle Dale)` and `South County (Taylorsville)`, which is far short of a statewide county contract.

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
- county_local_disability_resources: legacy_state_grade; samples=7; first=https://jobs.utah.gov/office-search/

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_public_office_api_or_successor_directory_exposes_county_or_service_area_assignments_for_missing_daggett_morgan_rich_counties

## Completion decision

- Utah still keeps the education repair from the live Utah Schools Directory.
- Utah DWS county-local evidence is stronger than a shell-only story because the live office-search bundle points to a public official API at `https://officesearch-api.jobs.utah.gov/api/v1/offices`.
- That public API returns office inventory rows with office names, addresses, service codes, coordinates, and assistance instructions, but it still does not publish county fields, counties served, or another reusable county-to-office contract.
- A bounded official reverse-geocode audit of the 45 unique office coordinates still only materializes physical offices in 26 of Utah's 29 counties, leaving Daggett, Morgan, and Rich without even an in-county office point.
- One more bounded payload-text audit also confirmed `Daggett` and `Morgan` never appear anywhere in the public office JSON, while `Rich` appears only as `Richfield` office naming rather than Rich County routing.
- Utah therefore remains BLOCKED and not index-safe.
