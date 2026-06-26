# New Mexico California-Grade Audit Report v2

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 33
- primary_gap_reason: all_critical_families_verified_with_reviewed_official_or_first_party_geography_contracts

## Family status

- medicaid_state_health_coverage: verified_state_grade (Reviewed live HCA Medicaid leaves now prove statewide New Mexico Medicaid coverage and application routing.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (Reviewed HCA DDSD evidence on disk now proves statewide DD-waiver application / eligibility and HCBS disability-services routing.)
- developmental_disability_idd_authority: verified_state_grade (Reviewed HCA DDSD evidence on disk replaced the stale dhhs.new-mexico.gov DD authority path.)
- early_intervention_part_c: verified_county_grade (The official ECECD FIT page plus the linked Regional Office Map now prove county-grade local FIT routing across all 33 counties.)
- special_education_idea_part_b: verified_state_grade (Reviewed 2026-06-26 the live official U.S. Department of Education IDEA-by-State page for New Mexico at `https://sites.ed.gov/idea/state/new-mexico/` after the old New Mexico PED Special Education Bureau lane stopped surviving live probes. The current official federal page is reviewable and New Mexico-specific: it preserves the exact state heading `New Mexico - Individuals with Disabilities Education Act` and publishes the current IDEA Part B state materials, including `2025 SPP/APR and State Determination Letters, Part B — New Mexico`, `2024 SPP/APR and State Determination Letters, Part B — New Mexico`, and prior annual Part B determination materials on the same official host. That is enough to keep statewide IDEA Part B authority evidence current while district-grade routing remains a separate family proved from the live PED directory contracts.)
- district_or_county_education_routing: verified_county_grade (Reviewed 2026-06-26 the live official New Mexico PED Superintendent directory items API at `https://webed.ped.state.nm.us/sites/schooldirectory/_api/web/lists/getbytitle('Superintendents')/items?$top=5000` together with the official Census county geographies endpoints. The PED items contract preserves 144 district-office address rows with district code, district name, office address, city, ZIP, and superintendent email on the official PED host. The official Census `geographies/onelineaddress` endpoint resolved those reviewed PED district-office addresses directly to 32 distinct New Mexico counties. Catron County stayed unmatched through one-line address geocoding because the rural Reserve and Quemado office addresses did not resolve there, so the final county was closed through reviewed first-party district evidence instead: the live Reserve Independent Schools page preserves the district office address `24 MOUNTAINEER RD, RESERVE, NM 87830` and embedded coordinates `(33.710737,-108.761857)`, and the official Census `geographies/coordinates` endpoint returns `Catron County` from those first-party coordinates. Together this yields explicit county-grade local education routing coverage across all 33 New Mexico counties without guessing from district names, towns, or stale exports.)
- vocational_rehabilitation_pre_ets: verified_current_official_nmdvr_vr_and_pre_ets_host (Reviewed 2026-06-26 the current live official New Mexico Division of Vocational Rehabilitation host on the reviewed alternate first-party state domain `https://www.dvr.state.nm.us/` after the old `dvr.nm.gov` lane failed closed. The current official host is public and reviewable: `/about-nmdvr/` explicitly says the New Mexico Division of Vocational Rehabilitation is a division of the state's Public Education Department and that Vocational Rehabilitation is a state and federally funded program for eligible individuals with documented disabilities; `/pre-ets/` is live and explicitly preserves the `Pre-Employment Transition Services through NMDVR` heading plus student-transition explanatory text under the Workforce Innovation and Opportunity Act; and `/locations/` is live and preserves statewide DVR office locations and direct phone routing across Albuquerque, Alamogordo, Carlsbad, Clovis, Farmington, Gallup, Hobbs, Las Cruces, Las Vegas, Los Lunas, Rio Rancho, Roswell, Santa Fe, Silver City, Socorro, and Taos. New Mexico therefore now clears vocational_rehabilitation_pre_ets from the live official NMDVR host rather than the dead legacy domain.)
- protection_and_advocacy: verified_state_grade (Reviewed DRNM first-party evidence on disk explicitly proves the statewide protection-and-advocacy role and intake route.)
- parent_training_information_center: verified_state_grade (The reviewed Parents Reaching Out About page explicitly preserves New Mexico PTI designation on a first-party source.)
- legal_aid: verified_state_grade (The reviewed New Mexico Legal Aid locations page preserves a statewide intake route and explicitly says it serves all counties in New Mexico.)
- able_program: verified_state_grade (Statewide ABLE crossover evidence remains reviewed and intact.)
- ssi_ssa_federal_reference: verified_state_grade (SSA crossover evidence remains reviewed and intact.)
- county_local_disability_resources: verified_current_official_hca_field_offices_county_service_area_page (Reviewed 2026-06-25 the current official HCA `Field Offices` page at `https://www.hca.nm.gov/lookingforassistance/field_offices/`. Unlike the older archive-tail lane, the live page now preserves county-to-office service-area assignments in public HTML across all 33 New Mexico counties, including `County Office 10 - Serving Curry, De Baca, Harding, Quay, & Roosevelt Counties`, `County Office 4 - Serving San Miguel, Guadalupe, Taos, Union, Colfax, & Mora Counties`, and `County Office 14 - Serving Catron, Cibola, Socorro, Torrance, & Valencia Counties`, with current office names, addresses, and hours on the official HCA host.)

## Failure ledger

- none

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=2; first=https://www.hca.nm.gov/turquoise-care/
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.hca.nm.gov/eligibility-determination/
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://www.hca.nm.gov/developmental-disabilities-supports-division/
- early_intervention_part_c: verified_county_grade; samples=2; first=https://www.nmececd.org/family-infant-toddler-fit-program/
- special_education_idea_part_b: verified_state_grade; samples=2; first=https://sites.ed.gov/idea/state/new-mexico/
- district_or_county_education_routing: verified_county_grade; samples=33; first=https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=3021%20TODOS%20SANTOS%20NW%2C%20ALBUQUERQUE%2C%20NM%2087120&benchmark=Public_AR_Current&vintage=Current_Current&format=json
- vocational_rehabilitation_pre_ets: verified_current_official_nmdvr_vr_and_pre_ets_host; samples=4; first=https://www.dvr.state.nm.us/
- protection_and_advocacy: verified_state_grade; samples=1; first=https://drnm.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://parentsreachingout.org/about-us/
- legal_aid: verified_state_grade; samples=1; first=https://newmexicolegalaid.org/who-we-are/locations.html
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/
- county_local_disability_resources: verified_current_official_hca_field_offices_county_service_area_page; samples=5; first=https://www.hca.nm.gov/lookingforassistance/field_offices/

## Next actions

- none

## Completion decision

- New Mexico is now `COMPLETE` and `index_safe=true`.
- `district_or_county_education_routing` now clears because the reviewed PED Superintendent directory plus the official Census county geographies endpoints yield explicit county-grade district routing across all 33 New Mexico counties.
- The county matrix closes 32 counties directly from official PED district-office addresses and closes Catron County through first-party Reserve Independent Schools coordinates on the live district site plus the official Census reverse geocoder.
- Statewide IDEA Part B remains verified from the live official U.S. Department of Education IDEA-by-State New Mexico pages, and all other critical families remain green from the prior reviewed HCA, ECECD, DRNM, PRO, legal-aid, ABLE, and SSA evidence.
