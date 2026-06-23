# Montana California-Grade Batch 74 Report v1

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 56
- primary_gap_reason: all_critical_families_verified_with_reviewed_first_party_or_official_evidence

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_county_grade (Reviewed official OPI county search and public superintendent databases preserve county-keyed and district-keyed routing across all 56 Montana counties.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (Reviewed first-party Disability Rights Montana leaves now preserve explicit statewide P&A designation text, including both federally mandated system language and a designated statewide P&A statement.)
- parent_training_information_center: verified_state_grade (the reviewed authoritative Parent Center Hub Montana state leaf explicitly labels Parents, Let's Unite For Kids (PLUK) as Montana PTI and preserves statewide Montana contact evidence even though the current pluk.org root has degraded to a bare index page)
- legal_aid: verified_state_grade (the reviewed Montana Legal Services Association homepage preserves a live first-party statewide legal-aid route, direct apply-for-services navigation, and statewide free civil legal services language for low-income Montanans)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_county_grade (Reviewed official DPHHS County Offices page lists all 56 counties with local office contact data directly in public HTML, and the Public Assistance field-office page adds county-keyed email routing.)

## Failure ledger

- none

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://dphhs.mt.gov/dsd/ddp/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.montana.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.montana.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://opi.mt.gov/
- district_or_county_education_routing: verified_county_grade; samples=3; first=https://opi.mt.gov/Leadership/Management-Operations/Montana-Schools-Directory
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://dphhs.mt.gov/dsd/ddp
- protection_and_advocacy: verified_state_grade; samples=2; first=https://disabilityrightsmt.org/about-us/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.parentcenterhub.org/findurcenter/montana/
- legal_aid: verified_state_grade; samples=1; first=https://www.mtlsa.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_county_grade; samples=2; first=https://dphhs.mt.gov/CFSD/countyoffice

## Next actions

- none

## Completion decision

- Montana is now `COMPLETE` and `index_safe=true`.
- Disability Rights Montana now clears statewide Protection and Advocacy because first-party reviewed pages explicitly call DRM both the federally mandated protection and advocacy system for Montana and the designated statewide Protection and Advocacy system for Montana.
- District or county education routing now clears at county grade because the official OPI Montana Schools Directory exposes a public county search page that visibly enumerates all 56 counties and links direct public county-superintendent and district-superintendent databases.
- County/local disability resources now clear at county grade because the official DPHHS County Offices page lists all 56 counties with local contact data directly in public HTML, and the Public Assistance field-office page adds named offices and county-keyed email routing.
- The old `https://dphhs.mt.gov/locations` placeholder is now a hard 404, so future work should stay on the newer `AboutUs/OfficeLocations` and `CFSD/countyoffice` leaves rather than reopening the dead root.
