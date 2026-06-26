# New Mexico California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 92
- county_count: 33
- primary_gap_reason: live_official_nmdvr_host_and_federal_part_b_materials_now_clear_but_ped_directory_stack_still_lacks_explicit_geography_contract_and_clean_live_tls_probe

## Family status

- medicaid_state_health_coverage: verified_state_grade (Reviewed live HCA Medicaid leaves now prove statewide New Mexico Medicaid coverage and application routing.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (Reviewed HCA DDSD evidence on disk now proves statewide DD-waiver application / eligibility and HCBS disability-services routing.)
- developmental_disability_idd_authority: verified_state_grade (Reviewed HCA DDSD evidence on disk replaced the stale dhhs.new-mexico.gov DD authority path.)
- early_intervention_part_c: verified_county_grade (The official ECECD FIT page plus the linked Regional Office Map now prove county-grade local FIT routing across all 33 counties.)
- special_education_idea_part_b: verified_state_grade (Reviewed 2026-06-26 the live official U.S. Department of Education IDEA-by-State page for New Mexico at `https://sites.ed.gov/idea/state/new-mexico/` after the old New Mexico PED Special Education Bureau lane stopped surviving live probes. The current official federal page is reviewable and New Mexico-specific: it preserves the exact state heading `New Mexico - Individuals with Disabilities Education Act` and publishes the current IDEA Part B state materials, including `2025 SPP/APR and State Determination Letters, Part B — New Mexico`, `2024 SPP/APR and State Determination Letters, Part B — New Mexico`, and prior annual Part B determination materials on the same official host. That is enough to keep statewide IDEA Part B authority evidence current while district-grade routing remains a separate family proved from the live PED directory contracts.)
- district_or_county_education_routing: blocked_live_ped_superintendent_directory_materializes_district_rows_but_still_lacks_explicit_geography_contract_and_clean_live_tls_probe (Reviewed 2026-06-26 the live official PED SharePoint directory stack beyond the earlier county-crosswalk blocker lane. The public Superintendent directory now materializes directly from the official PED-managed SharePoint host through the public RenderListDataAsStream contract, returning 155 live rows and 145 unique district codes with district names, public contact email, office or campus location name, street address, city, and ZIP on the official host. The companion public 2017 NM Schools directory also remains live on the same host and materializes 935 current public school rows with district code, district name, location name, address, city, ZIP, phone, and status fields. That proves the PED directory lane is real and materially stronger than the earlier blocker packet. But New Mexico still cannot clear full district_or_county_education_routing: the reviewed public PED contract still does not preserve an explicit county-to-district or county-to-REC geography contract sufficient to justify all 33 counties, and current live certification probes to the PED SharePoint leaves fail closed on certificate verification. New Mexico therefore remains blocked on education routing until a live official geography contract or certificate-clean equivalent official leaf is public.)
- vocational_rehabilitation_pre_ets: verified_current_official_nmdvr_vr_and_pre_ets_host (Reviewed 2026-06-26 the current live official New Mexico Division of Vocational Rehabilitation host on the reviewed alternate first-party state domain `https://www.dvr.state.nm.us/` after the old `dvr.nm.gov` lane failed closed. The current official host is public and reviewable: `/about-nmdvr/` explicitly says the New Mexico Division of Vocational Rehabilitation is a division of the state's Public Education Department and that Vocational Rehabilitation is a state and federally funded program for eligible individuals with documented disabilities; `/pre-ets/` is live and explicitly preserves the `Pre-Employment Transition Services through NMDVR` heading plus student-transition explanatory text under the Workforce Innovation and Opportunity Act; and `/locations/` is live and preserves statewide DVR office locations and direct phone routing across Albuquerque, Alamogordo, Carlsbad, Clovis, Farmington, Gallup, Hobbs, Las Cruces, Las Vegas, Los Lunas, Rio Rancho, Roswell, Santa Fe, Silver City, Socorro, and Taos. New Mexico therefore now clears vocational_rehabilitation_pre_ets from the live official NMDVR host rather than the dead legacy domain.)
- protection_and_advocacy: verified_state_grade (Reviewed DRNM first-party evidence on disk explicitly proves the statewide protection-and-advocacy role and intake route.)
- parent_training_information_center: verified_state_grade (The reviewed Parents Reaching Out About page explicitly preserves New Mexico PTI designation on a first-party source.)
- legal_aid: verified_state_grade (The reviewed New Mexico Legal Aid locations page preserves a statewide intake route and explicitly says it serves all counties in New Mexico.)
- able_program: verified_state_grade (Statewide ABLE crossover evidence remains reviewed and intact.)
- ssi_ssa_federal_reference: verified_state_grade (SSA crossover evidence remains reviewed and intact.)
- county_local_disability_resources: verified_current_official_hca_field_offices_county_service_area_page (Reviewed 2026-06-25 the current official HCA `Field Offices` page at `https://www.hca.nm.gov/lookingforassistance/field_offices/`. Unlike the older archive-tail lane, the live page now preserves county-to-office service-area assignments in public HTML across all 33 New Mexico counties, including `County Office 10 - Serving Curry, De Baca, Harding, Quay, & Roosevelt Counties`, `County Office 4 - Serving San Miguel, Guadalupe, Taos, Union, Colfax, & Mora Counties`, and `County Office 14 - Serving Catron, Cibola, Socorro, Torrance, & Valencia Counties`, with current office names, addresses, and hours on the official HCA host.)

## Failure ledger

- district_or_county_education_routing remains blocked because the live PED directory stack is stronger but still does not preserve an explicit county-to-district or county-to-REC contract, and the PED SharePoint leaves still fail current live certificate verification in certification.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=2; first=https://www.hca.nm.gov/turquoise-care/
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.hca.nm.gov/eligibility-determination/
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://www.hca.nm.gov/developmental-disabilities-supports-division/
- early_intervention_part_c: verified_county_grade; samples=2; first=https://www.nmececd.org/family-infant-toddler-fit-program/
- special_education_idea_part_b: verified_state_grade; samples=2; first=https://sites.ed.gov/idea/state/new-mexico/
- district_or_county_education_routing: blocked_live_ped_superintendent_directory_materializes_district_rows_but_still_lacks_explicit_geography_contract_and_clean_live_tls_probe; samples=4; first=https://webed.ped.state.nm.us/sites/schooldirectory/Lists/Superintendents/AllItems.aspx
- vocational_rehabilitation_pre_ets: verified_current_official_nmdvr_vr_and_pre_ets_host; samples=4; first=https://www.dvr.state.nm.us/
- protection_and_advocacy: verified_state_grade; samples=1; first=https://drnm.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://parentsreachingout.org/about-us/
- legal_aid: verified_state_grade; samples=1; first=https://newmexicolegalaid.org/who-we-are/locations.html
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/
- county_local_disability_resources: verified_current_official_hca_field_offices_county_service_area_page; samples=5; first=https://www.hca.nm.gov/lookingforassistance/field_offices/

## Next actions

- Keep New Mexico blocked and not index-safe until one live official PED geography contract or another certificate-clean official equivalent proves full local education coverage.

## Completion decision

- New Mexico remains BLOCKED and not index-safe.
- Vocational rehabilitation / Pre-ETS now clears from the live official NMDVR host on `dvr.state.nm.us`, which preserves statewide VR authority, an exact Pre-ETS leaf, and a statewide office locations page.
- Statewide IDEA Part B authority now clears from the live official U.S. Department of Education IDEA-by-State New Mexico page and its New Mexico-specific Part B materials after the old PED bureau lane stopped surviving live probes.
- County-local remains verified from the official HCA field-office county service-area page across all 33 counties.
- The remaining blocker is district_or_county_education_routing: the PED directory stack is real and useful, but it still does not preserve an explicit geography contract sufficient for full county-grade certification and it still fails clean live TLS probing.
