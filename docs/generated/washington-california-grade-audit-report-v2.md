# Washington California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 39
- primary_gap_reason: official_dshs_local_offices_are_public_but_reviewed_pages_do_not_preserve_a_county_to_office_or_service_area_contract

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_state_grade (Reviewed 2026-06-25 the official OSPI `Websites and Contact Info` district directory and the OSPI `Educational Service Districts (ESD)` page. The live OSPI directory says `This page lists websites and addresses for school districts, charter schools, tribal schools, and ESDs`, exposes public `District or Entity` and `ESD` columns, and publicly maps district rows such as Aberdeen -> 113, Adna -> 113, Almira -> 101, Anacortes -> 189, Auburn -> 121, and Bellingham -> 189. The companion official ESD page publishes named ESD offices, addresses, and downloadable `School Districts and ESDs` maps. This replaces Washington's old statewide education fallback with a current official district-to-ESD routing surface on the OSPI host.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (Reviewed 2026-06-25 the live first-party Disability Rights Washington homepage. The page heading says `Washington's Protection and Advocacy System`, and the body says `Disability Rights Washington is a private non-profit organization that protects the rights of people with disabilities statewide.` This now supplies direct first-party protection-and-advocacy designation evidence for Washington.)
- parent_training_information_center: verified_state_grade (reviewed first-party WAPAVE artifact explicitly preserves the Parent Training and Information Program (PTI) on the live domain)
- legal_aid: verified_state_grade (Reviewed 2026-06-25 the live first-party Washington Law Help homepage plus its page metadata. The page is visibly `Maintained by Northwest Justice Project`, and the reviewed page metadata and JSON-LD describe Washington Law Help as a public library of free legal information in Washington State with a Northwest Justice Project contact path. This supplies current first-party statewide legal-help evidence for Washington.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_official_local_office_locator_without_county_contract (Reviewed 2026-06-25 one more bounded official county-local pass on DSHS. The official `Office Locator` page publicly supports lookup by `zip code, city, or county` and preserves county-named local office cards such as `Okanogan County Community Services Office`, `Grays Harbor County DDCS Field Office`, `Kitsap County DDCS Field Office`, `Lewis County DDCS Field Office`, and `Whitman County DDA Field Office`, plus multi-county cards such as `Tri County-Colville Community Service Office` and `Tri County DDA Field Office`. Individual DSHS office detail pages confirm official addresses and phone numbers for county-named leaves like Whitman County DDA Field Office in Colfax and Tri County DDA Field Office in Colville. The companion `ESA Find an Office` page also says the Community Services Division serves the public through a network of 52 local Community Services Offices. But the reviewed public DSHS pages still do not preserve a complete county-to-office assignment table or an explicit service-area contract, and the office locator remains a search or locator surface rather than a reviewable county routing crosswalk. Because the instructions forbid inferring local routing from nearest-office or geodistance behavior, Washington's county-local disability family remains blocked.)

## Failure ledger

- county_local_disability_resources: official_local_office_locator_exists_but_no_public_county_to_office_or_service_area_contract :: Reviewed 2026-06-25 one more bounded official county-local pass on DSHS. The official `Office Locator` page publicly supports lookup by `zip code, city, or county` and preserves county-named local office cards such as `Okanogan County Community Services Office`, `Grays Harbor County DDCS Field Office`, `Kitsap County DDCS Field Office`, `Lewis County DDCS Field Office`, and `Whitman County DDA Field Office`, plus multi-county cards such as `Tri County-Colville Community Service Office` and `Tri County DDA Field Office`. Individual DSHS office detail pages confirm official addresses and phone numbers for county-named leaves like Whitman County DDA Field Office in Colfax and Tri County DDA Field Office in Colville. The companion `ESA Find an Office` page also says the Community Services Division serves the public through a network of 52 local Community Services Offices. But the reviewed public DSHS pages still do not preserve a complete county-to-office assignment table or an explicit service-area contract, and the office locator remains a search or locator surface rather than a reviewable county routing crosswalk. Because the instructions forbid inferring local routing from nearest-office or geodistance behavior, Washington's county-local disability family remains blocked.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ssa.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.dshs.wa.gov/dda/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.washington.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.washington.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.k12.wa.us/student-success/special-education
- district_or_county_education_routing: verified_state_grade; samples=4; first=https://ospi.k12.wa.us/about-ospi/about-school-districts/websites-and-contact-info
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.dshs.wa.gov/dda
- protection_and_advocacy: verified_state_grade; samples=2; first=https://disabilityrightswa.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://wapave.org/parent-training-and-information-program/
- legal_aid: verified_state_grade; samples=3; first=https://www.washingtonlawhelp.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_official_local_office_locator_without_county_contract; samples=4; first=https://www.dshs.wa.gov/office-locations

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_washington_publishes_reviewable_county_to_office_or_service_area_contract

## Repair decision

- Washington remains `BLOCKED` and `index_safe=false`.
- `district_or_county_education_routing` now clears because OSPI publishes a live district directory with district-to-ESD assignments plus downloadable official school-district and ESD maps.
- `protection_and_advocacy` now clears because Disability Rights Washington explicitly identifies itself as Washington's Protection and Advocacy System on the live first-party homepage.
- `legal_aid` now clears because Washington Law Help preserves a live first-party Northwest Justice Project legal-help route for Washington.
- `county_local_disability_resources` is the only remaining blocker. DSHS publishes real local office leaves, but the reviewed public surfaces still do not preserve a reviewable county-to-office assignment or service-area contract, so the family cannot be cleared without forbidden locator inference.
