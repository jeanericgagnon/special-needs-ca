# Kansas California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 92
- county_count: 105
- primary_gap_reason: reviewed_kansas_district_and_district_linked_coop_leaves_now_cover_12_counties_but_export_backed_county_grade_coverage_is_still_incomplete

## Family status

- medicaid_state_health_coverage: verified_state_grade (Reviewed live KanCare Home, Eligibility, and Appeals/Fair Hearings leaves now preserve Kansas Medicaid coverage, eligibility rules, and appeal routing on the official first-party stack.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (The live official KanCare stack now preserves reviewed HCBS waiver evidence even when sibling raw fetches to KDADS still hit access-denied shells: the KanCare home page explicitly says Kansas is developing the Community Support Waiver (CSW) to shorten the HCBS waiting list, and the official FS-7 KanCare fact sheet names seven HCBS waivers, including the Intellectual/Developmental Disability waiver, with application routing through the KanCare Clearinghouse.)
- developmental_disability_idd_authority: verified_state_grade (Kansas DD authority now clears at state grade from reviewed first-party KDADS leaves. The live KDADS root renders HCBS and disability program navigation, the official Intellectual / Developmentally Disabled Information page is public, the Community Support Waiver page explicitly serves Kansans with intellectual and developmental disabilities, and the HCBS Leadership & Staff page names I/DD and waiver staff roles on the same official host. The old host-wide 403 claim is no longer accurate for browser-readable review.)
- early_intervention_part_c: verified_state_grade (Reviewed live KSDE Early Childhood Special Education leaf again provides Kansas birth-to-three, Part C, KDHE administration, and the local ITS referral pointer.)
- special_education_idea_part_b: verified_state_grade (Reviewed live KSDE Special Education leaf again provides a role-pure IDEA Part B root and links to dispute-resolution plus parent-rights leaves on the same official path.)
- district_or_county_education_routing: blocked_reviewed_district_owned_and_coop_leads_but_not_statewide_county_grade (Kansas is past a root-only blocker: reviewed district-owned and district-linked cooperative local education-routing leaves now exist for 12/105 counties, but county-grade local education routing is still incomplete across the packet. Export-backed district hosts remain the right lane, and exact non-match districts such as Abilene USD 435 should stay frozen until a role-exact local leaf appears on the official host stack.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed live DCF Rehabilitation Services Program Overview page replaced the old KDADS misclassification.)
- protection_and_advocacy: verified_state_grade (Reviewed first-party DRC Kansas evidence plus live About/Get Help pages prove the statewide protection-and-advocacy role and help path.)
- parent_training_information_center: verified_state_grade (Reviewed first-party Families Together evidence explicitly states that it is Kansas’ federally designated PTI.)
- legal_aid: verified_state_grade (Reviewed live Kansas Legal Services homepage explicitly proves the statewide legal-aid role.)
- able_program: verified_state_grade (Statewide ABLE crossover evidence remains reviewed and intact.)
- ssi_ssa_federal_reference: verified_state_grade (SSA crossover evidence remains reviewed and intact.)
- county_local_disability_resources: verified_state_grade (The official KanCare Ombudsman Counties in Alphabetical Order directory now exposes county-specific Community Resources guide links across all 105 Kansas counties on the live first-party stack.)

## Failure ledger

- district_or_county_education_routing: reviewed_kansas_district_and_district_linked_coop_leaves_now_cover_12_counties_but_export_backed_county_grade_coverage_is_still_incomplete :: Reviewed 2026-06-23 one more bounded official Kansas district-routing pass using only export-backed district hosts, official district-owned pages, and exact same-domain checks. Education routing now has reviewed local proof for 12/105 counties: atchison-ks, butler-ks, cowley-ks, douglas-ks, finney-ks, johnson-ks, leavenworth-ks, riley-ks, saline-ks, sedgwick-ks, shawnee-ks, wyandotte-ks. Two more counties now clear from exact district-owned Special Education leaves on live district hosts. Cowley clears because https://www.usd470.com/academics/special-education returned HTTP 200 with title and H1 `Special Education` on the official Arkansas City USD 470 domain. Sedgwick also now clears from a reviewed district-owned leaf even though Wichita USD 259 stayed generic: https://www.derbyschools.com/academics/special-education returned HTTP 200 with title and H1 `Special Education` on the official Derby Public Schools host. Dickinson remains a correct exact non-match freeze: the official Abilene Public Schools host at https://www.abileneschools.org/ and its public sitemap both returned HTTP 200, but the bounded same-domain pass still found no role-exact special-education, student-services, procedural-safeguards, or parent-rights leaf. Kansas therefore remains blocked because county-grade local education proof is still incomplete across the remaining unresolved counties.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.kancare.ks.gov/
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=2; first=https://www.kancare.ks.gov/
- developmental_disability_idd_authority: verified_state_grade; samples=4; first=https://www.kdads.ks.gov/
- early_intervention_part_c: verified_state_grade; samples=1; first=https://www.ksde.gov/student-success/early-childhood/early-childhood-special-education
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.ksde.gov/policy-and-funding/special-education
- district_or_county_education_routing: blocked_reviewed_district_owned_and_coop_leads_but_not_statewide_county_grade; samples=67; first=https://www.usd409.net/page/special-education-services/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.dcf.ks.gov/services/RS/Pages/default.aspx
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.drckansas.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://familiestogetherinc.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.kansaslegalservices.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/
- county_local_disability_resources: verified_state_grade; samples=105; first=https://www.kancare.ks.gov/members/help-resources/kancare-ombudsman/resources/counties-in-alphabetical-order

## Next actions

- [critical] district_or_county_education_routing: continue_export_backed_district_and_affiliated_coop_leaf_authoring_county_by_county_and_keep_exact_non_matches_frozen

## Repair decision

- Kansas remains BLOCKED and not index-safe.
- Education is the only remaining critical blocker.
- Cowley now clears from the district-owned Arkansas City USD 470 Special Education leaf.
- Sedgwick now clears from the district-owned Derby Public Schools Special Education leaf, so the old Wichita USD 259 generic-page freeze no longer controls the county.
- Dickinson remains frozen as an exact non-match on the live Abilene district host and sitemap.
- Kansas now has reviewed local education-routing proof for twelve counties, but county-grade coverage is still incomplete across the remaining unresolved counties.
