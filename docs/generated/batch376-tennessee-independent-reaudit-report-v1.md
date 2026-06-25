# Tennessee California-Grade Independent Re-Audit Report v1

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 95
- strong_critical_families: 12
- weak_critical_families: 0
- missing_critical_families: 0
- reviewed_at: 2026-06-25

## Family status

- medicaid_state_health_coverage: verified_state_grade (Reviewed 2026-06-25 the live official TennCare application page. It states there are three ways to apply for TennCare Medicaid and Medicare Savings Programs, preserves TennCare Connect online and phone application routes, and preserves local AAAD and DDA help routes for applicants who need disability-related application support.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (Reviewed 2026-06-25 the live official TennCare 1915(c) HCBS waivers page and Employment and Community First CHOICES page. Together they preserve Tennessee's HCBS waiver structure for people with intellectual disabilities and the current I/DD-focused ECF CHOICES program with live application and DDA regional-office help routes.)
- developmental_disability_idd_authority: verified_state_grade (Reviewed 2026-06-25 the live official Department of Disability and Aging intake page. It explicitly covers intake for people with intellectual and developmental disabilities and directs applicants to the regional office in their area with separate West, Middle, and East Tennessee contact numbers.)
- early_intervention_part_c: verified_state_grade (Reviewed 2026-06-25 the live official Tennessee Early Intervention System page and TEIS district-office dataset. The referral workflow asks for the child's county of residence and the official district-office dataset preserves district names, addresses, cities, and phone numbers for local TEIS offices.)
- special_education_idea_part_b: verified_state_grade (Reviewed 2026-06-25 the live official Tennessee Department of Education special-education page on its current family-support path. It preserves statewide special-education program language, IDEA Part B guidance, and district obligations to provide high-quality education to students with disabilities.)
- district_or_county_education_routing: verified_state_grade (Reviewed 2026-06-25 the live Tennessee School Directory on the official Tennessee Department of Education host. The directory publicly supports region, district, and school search, offers an Excel export of Tennessee schools, districts, and regions, and preserves district schema fields including District No. and County.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed 2026-06-25 the live official Tennessee VR office locator, vocational rehabilitation services page, and Pre-Employment Transition Services page. Together they preserve statewide VR referral routes, county-served local office anchors, and the required Pre-ETS student-transition services language.)
- protection_and_advocacy: verified_state_grade (Reviewed 2026-06-25 the live first-party Disability Rights Tennessee homepage. It explicitly identifies DRT as Tennessee's Protection and Advocacy agency and states that it provides free services and resources across all 95 counties.)
- parent_training_information_center: verified_state_grade (Reviewed 2026-06-25 the live first-party TNSTEP homepage. It explicitly states that TNSTEP is Tennessee's only Parent Training and Information Center and that it provides special-education support and training to families of children and youth with disabilities and special health care needs.)
- legal_aid: verified_state_grade (Reviewed 2026-06-25 the live first-party Help4TN homepage and free senior legal helpline page. They preserve Tennessee Alliance for Legal Services branding, statewide free legal-help routes, and no-cost attorney help for older Tennesseans.)
- able_program: verified_state_grade (Reviewed 2026-06-25 the live official Tennessee Treasury ABLE TN page. It states that ABLE TN is Tennessee's own ABLE program and that it helps Tennesseans with disabilities save and invest with tax-free earnings to help maintain independence and quality of life.)
- ssi_ssa_federal_reference: verified_state_grade (Reviewed 2026-06-25 the live official TennCare eligibility reference guide. It preserves the SSI coverage group and states that low-income aged, blind, or disabled recipients of federal SSI cash payments qualify with SSI eligibility determined by SSA.)
- county_local_disability_resources: verified_state_grade (Reviewed 2026-06-25 the live official Tennessee Family Assistance county office locator. It preserves a county-office-hours workbook, a Select a County menu, and county-specific office entries with direct phone and fax fields including Anderson, Bedford, Davidson, and Shelby County offices.)

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=1; first=https://www.tn.gov/tenncare/members-applicants/how-do-i-apply-for-tenncare.html
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=2; first=https://www.tn.gov/tenncare/long-term-services-supports/persons-with-intellectual-disabilities-receiving-services-in-the-1915-c-hcbs-waivers.html
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://www.tn.gov/disability-and-aging/disability-aging-programs/intake-for-dda-programs.html
- early_intervention_part_c: verified_state_grade; samples=2; first=https://www.tn.gov/disability-and-aging/disability-aging-programs/teis.html
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.tn.gov/education/families/student-support/special-education.html
- district_or_county_education_routing: verified_state_grade; samples=1; first=https://k-12.education.tn.gov/sde/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=2; first=https://www.tn.gov/humanservices/ds/office-locator-trc-ttap.html
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.disabilityrightstn.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://tnstep.info/
- legal_aid: verified_state_grade; samples=2; first=https://www.help4tn.org/
- able_program: verified_state_grade; samples=1; first=https://treasury.tn.gov/Services/For-All-Tennesseans/ABLE-TN
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.tn.gov/tenncare/members-applicants/eligibility-reference-guide.html
- county_local_disability_resources: verified_state_grade; samples=1; first=https://www.tn.gov/humanservices/for-families/supplemental-nutrition-assistance-program-snap/office-locator-family-assistance.html

## Evidence modes

- medicaid_state_health_coverage: raw_fetch
- medicaid_waiver_hcbs_disability_services: raw_fetch
- developmental_disability_idd_authority: raw_fetch
- early_intervention_part_c: raw_fetch
- special_education_idea_part_b: raw_fetch
- district_or_county_education_routing: raw_fetch
- vocational_rehabilitation_pre_ets: raw_fetch
- protection_and_advocacy: raw_fetch
- parent_training_information_center: raw_fetch
- legal_aid: raw_fetch
- able_program: raw_fetch
- ssi_ssa_federal_reference: raw_fetch
- county_local_disability_resources: raw_fetch

## Completion decision

- Tennessee remains `COMPLETE` and `index_safe=true` after an independent re-audit of all 12 critical families.
- The packet no longer depends on fake `dhhs.tennessee.gov` placeholders for developmental-disability and early-intervention routing.
- The packet also no longer depends on the dead 404 special-education URL or the generic ABLE NRC / SSA hub rows for Tennessee-specific proof.
- TEIS district-office data, DDA regional intake numbers, the Tennessee School Directory, TennCare waiver pages, and the Tennessee Treasury ABLE TN page now provide reproducible first-party or official evidence across the remaining repaired families.

## Failure ledger

- none

## Next actions

- none
