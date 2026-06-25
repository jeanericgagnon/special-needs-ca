# Kansas California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 92
- county_count: 105
- primary_gap_reason: current_ksde_directory_roots_and_pdf_url_return_request_rejected_shells_and_exact_submit_replay_is_rejected_while_reviewed_local_district_leaves_cover_only_25_counties

## Family status

- medicaid_state_health_coverage: verified_state_grade (Reviewed live KanCare Home, Eligibility, and Appeals/Fair Hearings leaves now preserve Kansas Medicaid coverage, eligibility rules, and appeal routing on the official first-party stack.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (The live official KanCare stack now preserves reviewed HCBS waiver evidence even when sibling raw fetches to KDADS still hit access-denied shells: the KanCare home page explicitly says Kansas is developing the Community Support Waiver (CSW) to shorten the HCBS waiting list, and the official FS-7 KanCare fact sheet names seven HCBS waivers, including the Intellectual/Developmental Disability waiver, with application routing through the KanCare Clearinghouse.)
- developmental_disability_idd_authority: verified_state_grade (Kansas DD authority now clears at state grade from reviewed first-party KDADS leaves. The live KDADS root renders HCBS and disability program navigation, the official Intellectual / Developmentally Disabled Information page is public, the Community Support Waiver page explicitly serves Kansans with intellectual and developmental disabilities, and the HCBS Leadership & Staff page names I/DD and waiver staff roles on the same official host. The old host-wide 403 claim is no longer accurate for browser-readable review.)
- early_intervention_part_c: verified_state_grade (Reviewed live KSDE Early Childhood Special Education leaf again provides Kansas birth-to-three, Part C, KDHE administration, and the local ITS referral pointer.)
- special_education_idea_part_b: verified_state_grade (Reviewed live KSDE Special Education leaf again provides a role-pure IDEA Part B root and links to dispute-resolution plus parent-rights leaves on the same official path.)
- district_or_county_education_routing: blocked_reviewed_local_kansas_district_leaves_expand_to_25_counties_but_current_live_ksde_submit_replay_is_rejected (Kansas still has reviewed local education-routing proof for only 25 counties, so the state remains blocked on incomplete county-grade local education evidence. The preserved district-owned and district-linked local leaf lane is still real, but the current live KSDE state directory/export lane is no longer reproducibly usable in the bounded raw pass because the Directory Reports root, Directories page, educational-directory PDF URL, and an exact district-scoped submit replay all now return `Request Rejected` shells. The correct next lane is therefore saved district-owned or district-linked local leaf authoring only, not more retries against the current live KSDE state roots.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed live DCF Rehabilitation Services Program Overview page replaced the old KDADS misclassification.)
- protection_and_advocacy: verified_state_grade (Reviewed first-party DRC Kansas evidence plus live About/Get Help pages prove the statewide protection-and-advocacy role and help path.)
- parent_training_information_center: verified_state_grade (Reviewed first-party Families Together evidence explicitly states that it is Kansas’ federally designated PTI.)
- legal_aid: verified_state_grade (Reviewed live Kansas Legal Services homepage explicitly proves the statewide legal-aid role.)
- able_program: verified_state_grade (Statewide ABLE crossover evidence remains reviewed and intact.)
- ssi_ssa_federal_reference: verified_state_grade (SSA crossover evidence remains reviewed and intact.)
- county_local_disability_resources: verified_state_grade (The official KanCare Ombudsman Counties in Alphabetical Order directory now exposes county-specific Community Resources guide links across all 105 Kansas counties on the live first-party stack.)

## Failure ledger

- district_or_county_education_routing: current_ksde_directory_roots_and_pdf_url_return_request_rejected_shells_and_exact_submit_replay_is_rejected_while_reviewed_local_district_leaves_cover_only_25_counties :: Reviewed 2026-06-24 one more bounded official Kansas district-routing pass against exact saved district-host leads, then promoted only exact local district-host evidence. The current live raw lane still returns the same `Request Rejected` shell for `https://uapps.ksde.gov/Directory_Rpts/default.aspx`, `https://www.ksde.gov/data-and-reporting/directories`, and `https://www.ksde.gov/docs/default-source/crp/2025-2026-kansas-educational-directory.pdf?sfvrsn=7c81fd62_12`. One fresh exact district-scoped submit replay against the current Directory Reports root using the public hidden fields and `ctl00$MainContent$ddDistricts=D0435`, `ctl00$MainContent$RadioGroup1=RadioUSD1`, `ctl00$MainContent$rblFormat=Excel`, and `ctl00$MainContent$btnPrintSection1=Run Report` also returned the same `Request Rejected` shell instead of a workbook. Kansas now has reviewed local proof for 25/105 counties from preserved district-owned or district-linked leaves: atchison-ks, barton-ks, butler-ks, coffey-ks, cowley-ks, doniphan-ks, douglas-ks, ellis-ks, finney-ks, geary-ks, harvey-ks, johnson-ks, labette-ks, leavenworth-ks, lyon-ks, marshall-ks, mcpherson-ks, montgomery-ks, nemaha-ks, reno-ks, riley-ks, saline-ks, sedgwick-ks, shawnee-ks, wyandotte-ks. Coffey now clears because the official Burlington USD 244 homepage exposes a district-linked `Coffey County Special Education Cooperative` route, and the fetched `usd244ks.org/ccsec` page preserves the county-named cooperative identity plus a statement that CCSEC provides a broad continuum of services for students from birth through 21 years of age in USD 244 Burlington and USD 245 Southern Coffey County. Kansas therefore remains blocked because county-grade local education proof is still incomplete across the remaining unresolved counties, and the only trustworthy next lane is saved district-owned or district-linked local leaf authoring rather than the current flapping-or-rejected KSDE export stack.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.kancare.ks.gov/
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=2; first=https://www.kancare.ks.gov/
- developmental_disability_idd_authority: verified_state_grade; samples=4; first=https://www.kdads.ks.gov/
- early_intervention_part_c: verified_state_grade; samples=1; first=https://www.ksde.gov/student-success/early-childhood/early-childhood-special-education
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.ksde.gov/policy-and-funding/special-education
- district_or_county_education_routing: blocked_reviewed_local_kansas_district_leaves_expand_to_25_counties_but_current_live_ksde_submit_replay_is_rejected; samples=29; first=https://uapps.ksde.gov/Directory_Rpts/default.aspx
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.dcf.ks.gov/services/RS/Pages/default.aspx
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.drckansas.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://familiestogetherinc.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.kansaslegalservices.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/
- county_local_disability_resources: verified_state_grade; samples=105; first=https://www.kancare.ks.gov/members/help-resources/kancare-ombudsman/resources/counties-in-alphabetical-order

## Next actions

- [critical] district_or_county_education_routing: continue_only_from_saved_district_owned_and_district_linked_local_leads_because_current_live_ksde_state_export_lane_is_not_reproducible

## Repair decision

- Kansas remains BLOCKED and not index-safe.
- Education is still the only remaining critical blocker.
- Coffey now clears from the district-linked Burlington USD 244 `Coffey County Special Education Cooperative` route.
- Kansas now has reviewed local education-routing proof for 25 counties, but county-grade local coverage remains incomplete across the remaining unresolved counties.
- The current official KSDE Directory Reports root, Directories page, educational-directory PDF URL, and exact district-scoped submit replay still fail closed as `Request Rejected` shells in the bounded raw lane.
