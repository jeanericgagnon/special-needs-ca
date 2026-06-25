# Washington California-Grade Audit Report v2

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 39
- primary_gap_reason: all_critical_families_verified_with_reviewed_first_party_or_official_evidence

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (Reviewed 2026-06-25 the official DSHS Developmental Disabilities Administration `Find a DDCS Office` page and its linked DDCS county map PDF. The DSHS page sits under DDA, publishes a `DDCS Office Locator`, and links a one-page `DEVELOPMENTAL DISABILITIES COMMUNITY SERVICES CONTACTS` PDF that visibly assigns every Washington county to DDCS Region 1, Region 2, or Region 3 while listing regional administrator contacts. This supplies current official DDA/DDCS authority and statewide regional routing on the DSHS host.)
- early_intervention_part_c: verified_state_grade (Reviewed 2026-06-25 the official Washington DCYF Early Support for Infants and Toddlers (ESIT) page. The page states that ESIT gives early help to children from birth to age 3 who have developmental delays or disabilities and identifies IDEA Part C as the federal program funding and guiding ESIT's statewide system. The same official page also links an `ESIT Statewide Directory` for families who need services or support in their local area. This supplies current official Part C authority plus state-to-local routing evidence.)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_state_grade (Reviewed 2026-06-25 the official OSPI `Websites and Contact Info` district directory and the OSPI `Educational Service Districts (ESD)` page. The live OSPI directory says `This page lists websites and addresses for school districts, charter schools, tribal schools, and ESDs`, exposes public `District or Entity` and `ESD` columns, and publicly maps district rows such as Aberdeen -> 113, Adna -> 113, Almira -> 101, Anacortes -> 189, Auburn -> 121, and Bellingham -> 189. The companion official ESD page publishes named ESD offices, addresses, and downloadable `School Districts and ESDs` maps. This replaces Washington's old statewide education fallback with a current official district-to-ESD routing surface on the OSPI host.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed 2026-06-25 the official DSHS DVR `Pre-Employment Transition Services (Pre-ETS)` page, the `Student and Youth VR Transition Services` page, and the filtered DSHS office locator for `Vocational rehabilitation services`. The Transition Services page tells families to connect with a `Regional Transition Consultant` or `DVR School Transition Counselor` in their area and says they can start by contacting their local DVR office. The official office locator simultaneously preserves public DVR office leaves across Washington, including Aberdeen, Bellevue, Bellingham, Spokane, Tacoma, Vancouver, Wenatchee, Yakima, and many more. This replaces Washington's stale DDA-backed VR row with current official DVR and Pre-ETS routing evidence.)
- protection_and_advocacy: verified_state_grade (Reviewed 2026-06-25 the live first-party Disability Rights Washington homepage. The page heading says `Washington's Protection and Advocacy System`, and the body says `Disability Rights Washington is a private non-profit organization that protects the rights of people with disabilities statewide.` This now supplies direct first-party protection-and-advocacy designation evidence for Washington.)
- parent_training_information_center: verified_state_grade (reviewed first-party WAPAVE artifact explicitly preserves the Parent Training and Information Program (PTI) on the live domain)
- legal_aid: verified_state_grade (Reviewed 2026-06-25 the live first-party Washington Law Help homepage plus its page metadata. The page is visibly `Maintained by Northwest Justice Project`, and the reviewed page metadata and JSON-LD describe Washington Law Help as a public library of free legal information in Washington State with a Northwest Justice Project contact path. This supplies current first-party statewide legal-help evidence for Washington.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_state_grade (Reviewed 2026-06-25 the official DSHS DDA `Find a DDCS Office` page and its linked DDCS county map PDF. The page publicly links a `DDCS Office Locator` and a one-page `DEVELOPMENTAL DISABILITIES COMMUNITY SERVICES CONTACTS` PDF that visibly colors every Washington county into DDCS Region 1, Region 2, or Region 3 while listing regional administrator contacts. The reviewed routing packet also directs families seeking an application packet, an assessment for services, or more about DDCS services and resources to the official DDA service-and-information-request path. Because Washington now publishes a reviewable county-to-region DDCS routing crosswalk on the DSHS host, county/local disability resources clear without forbidden city, distance, or nearest-office inference.)

## Failure ledger

- none

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ssa.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.dshs.wa.gov/dda/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=3; first=https://www.dshs.wa.gov/dda/find-ddcs-office
- early_intervention_part_c: verified_state_grade; samples=3; first=https://dcyf.wa.gov/services/child-development-supports/esit
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.k12.wa.us/student-success/special-education
- district_or_county_education_routing: verified_state_grade; samples=4; first=https://ospi.k12.wa.us/about-ospi/about-school-districts/websites-and-contact-info
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=4; first=https://www.dshs.wa.gov/dvr/services-individuals-disabilities
- protection_and_advocacy: verified_state_grade; samples=2; first=https://disabilityrightswa.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://wapave.org/parent-training-and-information-program/
- legal_aid: verified_state_grade; samples=3; first=https://www.washingtonlawhelp.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_state_grade; samples=4; first=https://www.dshs.wa.gov/dda/find-ddcs-office

## Next actions

- none

## Completion decision

- Washington is now `COMPLETE` and `index_safe=true`.
- `county_local_disability_resources` now clears because DSHS publishes a reviewable DDCS county-to-region routing crosswalk on the `Find a DDCS Office` page and linked county map PDF.
- `developmental_disability_idd_authority` is now anchored to current official DDA/DDCS evidence on the DSHS host rather than a stale placeholder URL.
- `early_intervention_part_c` is now anchored to the official DCYF ESIT page and its statewide local-support directory.
- `vocational_rehabilitation_pre_ets` is now anchored to current official DVR, Pre-ETS, transition-services, and local DVR office-locator evidence on the DSHS host.
