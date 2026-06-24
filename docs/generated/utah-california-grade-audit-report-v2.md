# Utah California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 29
- primary_gap_reason: official_usbe_district_lea_directory_clears_education_but_utah_dhhs_contacts_county_map_text_and_live_dws_office_stack_still_fail_to_expose_county_service_area_contract

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
- county_local_disability_resources: blocked_utah_contacts_map_text_plus_dws_city_zip_contract_without_county_assignment (The live official Utah Schools Directory still clears education, but Utah county-local routing remains blocked even after one more bounded official check on the live Utah DHHS contacts surface. `https://dhhs.utah.gov/contacts/` now explicitly says users can find services by clicking on a county in the map below or by using the search bar to find services by type, but the public reviewed text still does not expose county-to-office rows, county-to-disability-office assignments, or any reusable local-office contract; the same page also tells users to visit specific division or program pages for local office information. That leaves the DWS office-search stack as the closest live local-office lane, and it still only exposes a city/ZIP-oriented bundle contract plus office inventory rows without county or counties-served fields. Utah therefore still has no public county-grade disability-resource office contract.)

## Failure ledger

- county_local_disability_resources: utah_dhhs_contacts_county_map_text_and_live_dws_office_stack_still_fail_to_expose_county_service_area_contract :: Reviewed 2026-06-23 one more bounded official Utah county-local pass focused on the live DHHS contacts surface plus the already-reviewed DWS office-search contract. The official `https://dhhs.utah.gov/contacts/` page explicitly says users can find services by clicking on a county in the map below or using the search bar to find services by type, but the same reviewed public text still exposes no county-by-county office rows, no county-to-disability-office assignments, and no reusable local-office export or leaf set; it also says `Please visit specific division or program pages for local office information.` That means the page is still a statewide contact shell, not a county-grade office contract. The live DWS office-search lane remains the closest reviewed local-office stack, but it still only exposes a first-party bundle that filters by `city` and `zipCode`, a public `/api/v1/offices` payload with office inventory fields only, a public `/api/v1/services` payload with service classes only, and no county or counties-served field. Utah therefore still has no reviewable official county-to-office routing contract for county-local disability resources.

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
- county_local_disability_resources: legacy_state_grade; samples=14; first=https://dhhs.utah.gov/contacts/

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_public_utah_successor_directory_api_or_reviewable_leaf_explicitly_maps_counties_to_local_disability_resource_offices

## Completion decision

- Utah still keeps the education repair from the live Utah Schools Directory.
- Utah county-local routing remains the only critical blocker.
- The live DHHS contacts page is useful only as a statewide shell: it mentions a county-click service map and search-by-type workflow, but the reviewed public text still does not expose county-to-office rows, county-to-disability-office assignments, or a reusable local-office export.
- The same DHHS contacts page also tells users to visit specific division or program pages for local office information, which confirms it is not itself the county-grade local-office contract.
- The DWS office-search lane remains the closest reviewed local-office stack, but it still only exposes a city/ZIP-oriented bundle contract and office inventory rows without county or counties-served fields.
- Utah therefore still lacks a public county-to-office disability-resource contract and remains BLOCKED / not index-safe.
