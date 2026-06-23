# Utah California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 29
- primary_gap_reason: official_usbe_district_lea_directory_clears_education_and_public_dws_office_api_still_lacks_county_service_area_contract

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
- county_local_disability_resources: legacy_state_grade (the official Utah DWS office-search app now exposes a public API at `https://officesearch-api.jobs.utah.gov/api/v1/offices` and that API returns 99 public rows covering 45 unique offices with names, addresses, lat/lng, service codes, and assistance instructions. But neither the API payload nor the current shell publishes county fields, counties served, or another reusable county-to-office contract, and one more bounded public-surface pass confirmed no public OpenAPI/Swagger docs or sitemap-exposed successor endpoint fills that gap.)

## Failure ledger

- county_local_disability_resources: public_dws_office_api_exposes_office_inventory_but_no_county_or_service_area_contract :: The public official DWS office API still returns 99 rows covering 45 unique offices with names, addresses, service codes, and coordinates, but it still does not publish county fields, counties served, or another reusable county-to-office contract. The companion `/api/v1/office-services` route is not available publicly and returns HTTP 404. The official API host also returns HTTP 404 for `openapi.json`, `swagger-ui/index.html`, and `v3/api-docs`, while `jobs.utah.gov/sitemap.xml` still returns an error page instead of a usable successor sitemap.

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
- county_local_disability_resources: legacy_state_grade; samples=5; first=https://jobs.utah.gov/office-search/

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_public_office_api_or_successor_directory_exposes_county_or_service_area_assignments

## Completion decision

- Utah still keeps the education repair from the live Utah Schools Directory.
- Utah DWS county-local evidence is now stronger than a shell-only story because the live office-search bundle points to a public official API at `https://officesearch-api.jobs.utah.gov/api/v1/offices`.
- That public API returns office inventory rows with office names, addresses, service codes, coordinates, and assistance instructions, but it still does not publish county fields, counties served, or another reusable county-to-office contract.
- One more bounded public-surface pass also confirmed `openapi.json`, `swagger-ui/index.html`, and `v3/api-docs` return 404 on the official API host, `jobs.utah.gov/sitemap.xml` returns an error page, and the shell exposes no other public county/service-area contract.
- Utah therefore remains BLOCKED and not index-safe.
