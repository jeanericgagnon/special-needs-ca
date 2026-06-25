# Tennessee California-Grade Batch 91 Report v1

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 95
- primary_gap_reason: all_critical_families_verified_with_reviewed_first_party_or_official_evidence

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_state_grade (Reviewed 2026-06-25 the live Tennessee School Directory, a product of the Tennessee Department of Education, on the official `k-12.education.tn.gov` host. The directory describes itself as the online hub for Tennessee K-12 district, school, and region information, exposes a public search form that lets users search by Regions, Districts, or Schools, embeds a public region-and-district map, and offers a `Download the Directory` action for an Excel file of Tennessee Schools, Districts, and Regions. The same reviewed page and download-table script preserve directory fields including Region, District, District No., County, address, phone, fax, and email, and the commissioner message says Tennessee is home to 149 unique school districts. This replaces Tennessee’s old statewide education fallback with current official district-routing evidence that preserves district and county locality fields.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed 2026-06-25 current first-party Tennessee Department of Human Services vocational-rehabilitation pages. The official `VR Office Locations` page explicitly covers `Vocational Rehabilitation Regional Offices, Community Tennessee Rehabilitation Centers, and Tennessee Technology Access Centers`, provides a live `OneDHS - Vocational Rehabilitation Referral` route, and preserves county-served groupings plus county office anchors such as Bedford County, Benton County, Maury County, Sumner County, and Williamson County. The reviewed `Employment Services for Tennesseans with Disabilities` page states that Tennessee’s VR program helps Tennesseans with disabilities prepare for the competitive job market, find jobs, and advance in their career fields, while the reviewed `Pre-Employment Transition Services` page says DRS works collaboratively with local education agencies, sets aside federal funds for Pre-ETS under WIOA, and preserves the five required Pre-ETS services. This resolves Tennessee’s prior inventory-only vocational-rehabilitation and Pre-ETS gap with current official service and routing leaves.)
- protection_and_advocacy: verified_state_grade (reviewed first-party Disability Rights Tennessee evidence preserves statewide protection-and-advocacy identity on the live first-party domain)
- parent_training_information_center: verified_state_grade (reviewed first-party TNSTEP evidence explicitly preserves Tennessee's only Parent Training and Information Center designation)
- legal_aid: verified_state_grade (Reviewed 2026-06-25 the live first-party Help4TN domain. The homepage identifies Help4TN as `A program of Tennessee Alliance for Legal Services`, describes it as `Find free legal help and social services`, and states that it provides Tennesseans with a broad range of legal and social services resources. The same reviewed homepage preserves the Legal Wellness Checkup and Tennessee Free Legal Answers routes, and the reviewed `Free Senior Legal Helpline` leaf states that Help4TN attorneys offer confidential legal advice and information at no cost to Tennesseans age 60 and above through 844-HELP4TN. This supplies current first-party statewide legal-aid evidence for Tennessee.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_state_grade (Reviewed 2026-06-25 first-party Tennessee Department of Human Services office-locator pages. The live `Find Our Offices` page links families to Family Assistance and Rehabilitation Services and states that DHS provides Adult Protective Services and Vocational Rehabilitation Services statewide. The official Family Assistance office locator then preserves a public `Family Assistance District/County Office Hours` workbook link, a `Select a County` jump menu with county anchors such as Anderson, Bedford, and Benton, and county-specific office blocks with direct phone and fax fields such as Anderson County, Bedford County, Davidson County Office, and Shelby County Family Assistance Office. This replaces Tennessee’s old DOI-backed county-office evidence with current first-party county-local routing on the live TDHS host family.)

## Failure ledger

- none

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ssa.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.tn.gov/didd/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.tennessee.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.tennessee.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.tn.gov/education/student-support-special-education.html
- district_or_county_education_routing: verified_state_grade; samples=4; first=https://k-12.education.tn.gov/sde/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=4; first=https://www.tn.gov/humanservices/ds/office-locator-trc-ttap.html
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.disabilityrightstn.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://tnstep.info/
- legal_aid: verified_state_grade; samples=3; first=https://www.help4tn.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_state_grade; samples=4; first=https://www.tn.gov/humanservices/need-help-/tdhs-find-our-offices.html

## Next actions

- none

## Completion decision

- Tennessee is now `COMPLETE` and `index_safe=true`.
- `district_or_county_education_routing` now clears because the official Tennessee School Directory publicly supports district search, district download, district map routing, and county-tagged directory fields on a Tennessee Department of Education host.
- `county_local_disability_resources` now clears because TDHS publishes a county-based Family Assistance office locator plus statewide DHS office-routing instructions on the live official host family.
- `vocational_rehabilitation_pre_ets` now clears because the official VR office locator, employment-services page, and Pre-Employment Transition Services page preserve statewide referral, county/regional routing, and explicit student-transition service language.
- `legal_aid` now clears because Help4TN preserves current first-party Tennessee Alliance for Legal Services routing for free legal help, legal wellness, Tennessee Free Legal Answers, and the free senior legal helpline.
