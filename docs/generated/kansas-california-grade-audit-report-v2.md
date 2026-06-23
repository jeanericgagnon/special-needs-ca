# Kansas California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 92
- county_count: 105
- primary_gap_reason: reviewed_kansas_district_owned_leaves_exist_but_full_county_grade_coverage_is_incomplete

## Family status

- medicaid_state_health_coverage: verified_state_grade (Reviewed live KanCare Home, Eligibility, and Appeals/Fair Hearings leaves now preserve Kansas Medicaid coverage, eligibility rules, and appeal routing on the official first-party stack.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (The live official KanCare stack now preserves reviewed HCBS waiver evidence even when sibling raw fetches to KDADS still hit access-denied shells: the KanCare home page explicitly says Kansas is developing the Community Support Waiver (CSW) to shorten the HCBS waiting list, and the official FS-7 KanCare fact sheet names seven HCBS waivers, including the Intellectual/Developmental Disability waiver, with application routing through the KanCare Clearinghouse.)
- developmental_disability_idd_authority: verified_state_grade (Kansas DD authority now clears at state grade from reviewed first-party KDADS leaves. The live KDADS root renders HCBS and disability program navigation, the official Intellectual / Developmentally Disabled Information page is public, the Community Support Waiver page explicitly serves Kansans with intellectual and developmental disabilities, and the HCBS Leadership & Staff page names I/DD and waiver staff roles on the same official host. The old host-wide 403 claim is no longer accurate for browser-readable review.)
- early_intervention_part_c: verified_state_grade (Reviewed live KSDE Early Childhood Special Education leaf again provides Kansas birth-to-three, Part C, KDHE administration, and the local ITS referral pointer.)
- special_education_idea_part_b: verified_state_grade (Reviewed live KSDE Special Education leaf again provides a role-pure IDEA Part B root and links to dispute-resolution plus parent-rights leaves on the same official path.)
- district_or_county_education_routing: blocked_reviewed_district_owned_leaves_exist_but_not_statewide_county_grade (Kansas is past a root-only blocker: reviewed district-owned special-education leaves now exist for 6/105 counties, but the education family remains blocked because county-grade local leaf coverage is still incomplete across the 105-county packet. Export-backed district domains are useful authoring hints, but they still fail closed unless a role-exact local leaf is preserved on the district-owned host.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed live DCF Rehabilitation Services Program Overview page replaced the old KDADS misclassification.)
- protection_and_advocacy: verified_state_grade (Reviewed first-party DRC Kansas evidence plus live About/Get Help pages prove the statewide protection-and-advocacy role and help path.)
- parent_training_information_center: verified_state_grade (Reviewed first-party Families Together evidence explicitly states that it is Kansas’ federally designated PTI.)
- legal_aid: verified_state_grade (Reviewed live Kansas Legal Services homepage explicitly proves the statewide legal-aid role.)
- able_program: verified_state_grade (Statewide ABLE crossover evidence remains reviewed and intact.)
- ssi_ssa_federal_reference: verified_state_grade (SSA crossover evidence remains reviewed and intact.)
- county_local_disability_resources: verified_state_grade (The official KanCare Ombudsman Counties in Alphabetical Order directory now exposes county-specific Community Resources guide links across all 105 Kansas counties on the live first-party stack.)

## Failure ledger

- district_or_county_education_routing: reviewed_district_owned_special_education_leaves_exist_but_kansas_county_grade_coverage_is_still_incomplete :: Reviewed 2026-06-23 bounded Kansas district-owned exact leaf checks after the public KSDE export contract was proven. District-owned special-education leaves are now reviewed for 6/105 counties: atchison-ks, butler-ks, douglas-ks, finney-ks, johnson-ks, shawnee-ks. https://www.usd385.org/departments/special-education returned HTTP 200 with title `Special Education - Andover Public Schools` and H1 `Special Education`. https://www.usd409.net/page/special-education-services/ returned HTTP 200 with title `Special Education Services | Atchison Public Schools` on the district-owned host. https://www.topekapublicschools.net/departments/special_education returned HTTP 200 with title `Special Education - Topeka Public Schools` on the district-owned host. https://www.olatheschools.org/academics/special-education returned HTTP 200 with title and H1 `Special Education` on the district-owned host. https://www.usd497.org/about-us/departments/student-support-services/special-education-services returned HTTP 200 with title `Special Education Services - Lawrence Public Schools` and H1 `Special Education Services`. https://www.gckschools.com/page/special-education/ returned HTTP 200 with title `Special Education | Garden City Public Schools`, and the live district sitemap exposed that exact leaf. A bounded Sedgwick follow-up also showed https://www.usd259.org/schools23/special-programs-and-schools is live on the district-owned host but remains a generic `Special Schools and Programs` page rather than a role-exact special-education or student-services leaf. Kansas therefore has real reviewed district-owned leaves for a larger county subset, but education remains blocked until local-leaf coverage expands county by county across the 105-county packet.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.kancare.ks.gov/
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=2; first=https://www.kancare.ks.gov/
- developmental_disability_idd_authority: verified_state_grade; samples=4; first=https://www.kdads.ks.gov/
- early_intervention_part_c: verified_state_grade; samples=1; first=https://www.ksde.gov/student-success/early-childhood/early-childhood-special-education
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.ksde.gov/policy-and-funding/special-education
- district_or_county_education_routing: blocked_reviewed_district_owned_leaves_exist_but_not_statewide_county_grade; samples=10; first=https://www.usd409.net/page/special-education-services/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.dcf.ks.gov/services/RS/Pages/default.aspx
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.drckansas.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://familiestogetherinc.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.kansaslegalservices.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/
- county_local_disability_resources: verified_state_grade; samples=105; first=https://www.kancare.ks.gov/members/help-resources/kancare-ombudsman/resources/counties-in-alphabetical-order

## Next actions

- [critical] district_or_county_education_routing: expand_reviewed_kansas_district_owned_special_education_leaves_from_public_export_backed_inventory

## Repair decision

- Kansas remains BLOCKED and not index-safe.
- Education is sharper than before because reviewed district-owned leaves now exist for six counties rather than only three.
- Sedgwick still proves the gate is holding: a live district-owned `Special Schools and Programs` page does not count without role-exact special-education or student-services routing.
- Kansas still does not clear until reviewed district-owned special-education or student-services leaves expand county by county across the remaining unresolved counties.
