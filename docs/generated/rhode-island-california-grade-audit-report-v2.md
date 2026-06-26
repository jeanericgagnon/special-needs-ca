# Rhode Island California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 92
- county_count: 5
- primary_gap_reason: public_ride_directory_exposes_district_inventory_but_zero_public_county_or_special_education_routing_contract

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_public_ride_directory_without_public_county_or_special_education_routing_contract (Reviewed 2026-06-25 bounded first-party Rhode Island education surfaces plus one more live check of the legacy public Master Directory lane. The live RIDE Special Education page remains statewide guidance only and links families to the public school directory stack instead of exposing district-owned special-education leaves. The public School Directory page explicitly says families can use the Search tool, Frequently Requested Lists, and Directory Reports for contact information, then routes into the public Data Center directory. On the public Data Center host, the Schools Directory explicitly says it provides only LEA, school, location, and contact information, while additional directory information is available only to authenticated users in the RIDE portal. The public table and search lanes expose LEA, school, school type, and school subtype, including special-education categories, but no county field and no public district special-education routing contract. The separate RI School Districts page lists 66 LEAs and district websites, but it also exposes no county column and no special-education contact routing. The legacy public Master Directory link exposed from the School Directory page is not a usable replacement proof lane because the reviewed public URL now returns HTTP 503. Rhode Island therefore still lacks a public county-grade or district-owned special-education routing contract.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party Disability Rights Rhode Island evidence preserves explicit federally mandated statewide P&A designation on the live first-party domain)
- parent_training_information_center: verified_state_grade (authoritative Parent Center Hub Rhode Island leaf explicitly labels RIPIN as the Rhode Island PTI and preserves statewide Rhode Island contact routing)
- legal_aid: verified_state_grade (reviewed first-party Help RI Law / Rhode Island Legal Services pages preserve explicit statewide low-income legal-help routing)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_state_grade (reviewed official DHS Office Locator now exposes a public city/town lookup that returns assigned home offices on the official host, supplying explicit local-routing coverage)

## Failure ledger

- district_or_county_education_routing: public_ride_directory_exposes_district_inventory_but_zero_public_county_or_special_education_routing_contract :: Reviewed 2026-06-25 bounded first-party Rhode Island education surfaces plus one more live check of the legacy public Master Directory lane. The live RIDE Special Education page remains statewide guidance only and links families to the public school directory stack instead of exposing district-owned special-education leaves. The public School Directory page explicitly says families can use the Search tool, Frequently Requested Lists, and Directory Reports for contact information, then routes into the public Data Center directory. On the public Data Center host, the Schools Directory explicitly says it provides only LEA, school, location, and contact information, while additional directory information is available only to authenticated users in the RIDE portal. The public table and search lanes expose LEA, school, school type, and school subtype, including special-education categories, but no county field and no public district special-education routing contract. The separate RI School Districts page lists 66 LEAs and district websites, but it also exposes no county column and no special-education contact routing. The legacy public Master Directory link exposed from the School Directory page is not a usable replacement proof lane because the reviewed public URL now returns HTTP 503. Rhode Island therefore still lacks a public county-grade or district-owned special-education routing contract.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://bhddh.ri.gov/developmental-disabilities/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.rhode-island.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.rhode-island.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.ride.ri.gov/StudentsFamilies/SpecialEducation.aspx
- district_or_county_education_routing: blocked_public_ride_directory_without_public_county_or_special_education_routing_contract; samples=4; first=https://ride.ri.gov/students-families/ri-public-schools/school-directory
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://bhddh.ri.gov/developmental-disabilities
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.drri.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.parentcenterhub.org/findurcenter/rhode-island/
- legal_aid: verified_state_grade; samples=1; first=https://www.helprilaw.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_state_grade; samples=5; first=https://dhs.ri.gov/office-locator-tool

## Next actions

- [critical] district_or_county_education_routing: hold_blocked_until_public_ride_or_district_owned_special_education_surface_exposes_county_or_district_routing

## Completion decision

- Rhode Island remains BLOCKED and not index-safe.
- `county_local_disability_resources` now stays cleared because the public DHS Office Locator exposes city/town-to-home-office assignments on the official host.
- `district_or_county_education_routing` remains the sole critical blocker because public RIDE directory surfaces still inventory districts and special-education school types without exposing a county field, a public district special-education routing contract, or a usable public replacement lane.
- Rhode Island therefore still cannot be marked COMPLETE until an official public local education-routing contract exists.
