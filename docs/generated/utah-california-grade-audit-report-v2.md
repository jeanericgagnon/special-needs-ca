# Utah California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 29
- primary_gap_reason: official_usbe_district_lea_directory_clears_education_and_live_dws_office_search_shell_still_lacks_public_county_office_contract

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
- county_local_disability_resources: legacy_state_grade (the official DWS contact page now links a live Office Map that redirects to `jobs.utah.gov/office-search/`, but the public shell still exposes only map/search controls and no county list, office rows, addresses, or county-to-office contract in raw public HTML. The older DWS services locations page still returns HTTP 500, the older DHHS locations route still returns HTTP 404, and current DHHS contacts/customer-service pages still do not publish a county-grade office directory)

## Failure ledger

- county_local_disability_resources: live_dws_office_search_shell_and_dhhs_contacts_still_lack_public_county_office_contract :: The public DWS contact page now leads to a live official `office-search` app, but the raw public shell still exposes only map/search controls and no county-grade office rows or county-to-office contract. The older DWS services locations page still returns HTTP 500, the older DHHS locations route still returns HTTP 404, and DHHS contacts/customer-service pages still do not publish a county-grade office directory.

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
- county_local_disability_resources: legacy_state_grade; samples=4; first=https://jobs.utah.gov/department/contact/index.html

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_office_search_materializes_public_office_rows_or_a_county_grade_utah_directory_is_verified

## Completion decision

- Utah still keeps the education repair from the live Utah Schools Directory.
- Utah now also has a live official DWS Office Map route: the older public contact page links `/jsp/officesearch/`, which redirects to `https://jobs.utah.gov/office-search/`.
- That official office-search surface still does not clear county-grade routing because the public shell only exposes map/search controls and not a county list, office rows, addresses, or another reusable county-to-office contract in raw public HTML.
- Utah therefore remains BLOCKED and not index-safe.
