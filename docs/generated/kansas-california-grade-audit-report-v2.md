# Kansas California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 92
- county_count: 105
- primary_gap_reason: official_ksde_directory_export_roots_now_return_request_rejected_shells_while_reviewed_district_owned_leaves_cover_16_counties_but_county_grade_is_still_incomplete

## Family status

- medicaid_state_health_coverage: verified_state_grade (Reviewed live KanCare Home, Eligibility, and Appeals/Fair Hearings leaves now preserve Kansas Medicaid coverage, eligibility rules, and appeal routing on the official first-party stack.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (The live official KanCare stack now preserves reviewed HCBS waiver evidence even when sibling raw fetches to KDADS still hit access-denied shells: the KanCare home page explicitly says Kansas is developing the Community Support Waiver (CSW) to shorten the HCBS waiting list, and the official FS-7 KanCare fact sheet names seven HCBS waivers, including the Intellectual/Developmental Disability waiver, with application routing through the KanCare Clearinghouse.)
- developmental_disability_idd_authority: verified_state_grade (Kansas DD authority now clears at state grade from reviewed first-party KDADS leaves. The live KDADS root renders HCBS and disability program navigation, the official Intellectual / Developmentally Disabled Information page is public, the Community Support Waiver page explicitly serves Kansans with intellectual and developmental disabilities, and the HCBS Leadership & Staff page names I/DD and waiver staff roles on the same official host. The old host-wide 403 claim is no longer accurate for browser-readable review.)
- early_intervention_part_c: verified_state_grade (Reviewed live KSDE Early Childhood Special Education leaf again provides Kansas birth-to-three, Part C, KDHE administration, and the local ITS referral pointer.)
- special_education_idea_part_b: verified_state_grade (Reviewed live KSDE Special Education leaf again provides a role-pure IDEA Part B root and links to dispute-resolution plus parent-rights leaves on the same official path.)
- district_or_county_education_routing: blocked_reviewed_district_owned_and_coop_leads_but_live_ksde_export_roots_now_request_rejected (Kansas still has reviewed local education-routing proof for 16 counties, but the current bounded raw lane now confirms the official KSDE export roots themselves are not reusable scrape entrypoints. `https://uapps.ksde.gov/Directory_Rpts/default.aspx`, `https://www.ksde.gov/data-and-reporting/directories`, and the current Kansas educational directory PDF URL each returned HTTP 200 only as the same `Request Rejected` shell in the live bounded pass, not as district inventory or export content. Kansas therefore remains blocked on incomplete county-grade local education proof, and future repairs should continue only from already-preserved export-backed district leads plus exact district-owned leaves rather than spending more low-token passes on the rejected state roots.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed live DCF Rehabilitation Services Program Overview page replaced the old KDADS misclassification.)
- protection_and_advocacy: verified_state_grade (Reviewed first-party DRC Kansas evidence plus live About/Get Help pages prove the statewide protection-and-advocacy role and help path.)
- parent_training_information_center: verified_state_grade (Reviewed first-party Families Together evidence explicitly states that it is Kansas’ federally designated PTI.)
- legal_aid: verified_state_grade (Reviewed live Kansas Legal Services homepage explicitly proves the statewide legal-aid role.)
- able_program: verified_state_grade (Statewide ABLE crossover evidence remains reviewed and intact.)
- ssi_ssa_federal_reference: verified_state_grade (SSA crossover evidence remains reviewed and intact.)
- county_local_disability_resources: verified_state_grade (The official KanCare Ombudsman Counties in Alphabetical Order directory now exposes county-specific Community Resources guide links across all 105 Kansas counties on the live first-party stack.)

## Failure ledger

- district_or_county_education_routing: official_ksde_directory_export_roots_now_return_request_rejected_shells_while_reviewed_district_owned_leaves_cover_16_counties_but_county_grade_is_still_incomplete :: Reviewed 2026-06-23 one more bounded official Kansas district-routing pass focused on the exact official state directory/export roots before any new county leaf guesses. The current live raw lane now returns the same `Request Rejected` shell for all three official state roots that previously anchored Kansas district authoring: `https://uapps.ksde.gov/Directory_Rpts/default.aspx`, `https://www.ksde.gov/data-and-reporting/directories`, and `https://www.ksde.gov/docs/default-source/crp/2025-2026-kansas-educational-directory.pdf?sfvrsn=7c81fd62_12`. Each returned HTTP 200 with `<title>Request Rejected</title>` and the same `The requested URL was rejected. Please consult with your administrator.` body, so none of them currently materialize district inventory in the bounded raw lane. Kansas still has reviewed local proof for 16 counties from previously preserved export-backed district hosts and district-owned leaves, but the remaining county-grade gap is still unresolved across the rest of the state. The right next lane is therefore exact district-leaf authoring from saved export-backed district leads, not more retries on the current KSDE roots.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.kancare.ks.gov/
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=2; first=https://www.kancare.ks.gov/
- developmental_disability_idd_authority: verified_state_grade; samples=4; first=https://www.kdads.ks.gov/
- early_intervention_part_c: verified_state_grade; samples=1; first=https://www.ksde.gov/student-success/early-childhood/early-childhood-special-education
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.ksde.gov/policy-and-funding/special-education
- district_or_county_education_routing: blocked_reviewed_district_owned_and_coop_leads_but_not_statewide_county_grade; samples=63; first=https://www.usd409.net/page/special-education-services/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.dcf.ks.gov/services/RS/Pages/default.aspx
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.drckansas.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://familiestogetherinc.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.kansaslegalservices.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/
- county_local_disability_resources: verified_state_grade; samples=105; first=https://www.kancare.ks.gov/members/help-resources/kancare-ombudsman/resources/counties-in-alphabetical-order

## Next actions

- [critical] district_or_county_education_routing: continue_only_from_saved_export_backed_district_leads_and_reviewed_district_owned_domains_not_from_live_ksde_root_retries

## Repair decision

- Kansas remains BLOCKED and not index-safe.
- Education is still the only remaining critical blocker.
- Kansas still has reviewed local education-routing proof for 16 counties from saved export-backed district leads and district-owned or district-linked local leaves.
- But the current bounded raw lane now shows the official KSDE directory/export roots themselves returning the same `Request Rejected` shell instead of reusable district inventory or workbook content.
- That means the correct next lane is exact district-leaf repair from already-preserved district leads, not more retries against the current rejected state roots.
