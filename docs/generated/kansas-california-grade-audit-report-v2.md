# Kansas California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 92
- county_count: 105
- primary_gap_reason: official_ksde_directory_and_pdf_roots_now_only_serve_request_rejected_shells_and_the_directory_reports_root_exposes_no_hidden_submit_fields_while_reviewed_district_owned_leaves_cover_16_counties

## Family status

- medicaid_state_health_coverage: verified_state_grade (Reviewed live KanCare Home, Eligibility, and Appeals/Fair Hearings leaves now preserve Kansas Medicaid coverage, eligibility rules, and appeal routing on the official first-party stack.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (The live official KanCare stack now preserves reviewed HCBS waiver evidence even when sibling raw fetches to KDADS still hit access-denied shells: the KanCare home page explicitly says Kansas is developing the Community Support Waiver (CSW) to shorten the HCBS waiting list, and the official FS-7 KanCare fact sheet names seven HCBS waivers, including the Intellectual/Developmental Disability waiver, with application routing through the KanCare Clearinghouse.)
- developmental_disability_idd_authority: verified_state_grade (Kansas DD authority now clears at state grade from reviewed first-party KDADS leaves. The live KDADS root renders HCBS and disability program navigation, the official Intellectual / Developmentally Disabled Information page is public, the Community Support Waiver page explicitly serves Kansans with intellectual and developmental disabilities, and the HCBS Leadership & Staff page names I/DD and waiver staff roles on the same official host. The old host-wide 403 claim is no longer accurate for browser-readable review.)
- early_intervention_part_c: verified_state_grade (Reviewed live KSDE Early Childhood Special Education leaf again provides Kansas birth-to-three, Part C, KDHE administration, and the local ITS referral pointer.)
- special_education_idea_part_b: verified_state_grade (Reviewed live KSDE Special Education leaf again provides a role-pure IDEA Part B root and links to dispute-resolution plus parent-rights leaves on the same official path.)
- district_or_county_education_routing: blocked_reviewed_district_owned_and_coop_leads_but_live_ksde_roots_now_only_expose_rejected_shell_without_submit_contract (Kansas still has reviewed local education-routing proof for 16 counties, but the current bounded raw lane now shows the official KSDE state roots are stricter than a simple workbook retry failure. `https://uapps.ksde.gov/Directory_Rpts/default.aspx`, `https://www.ksde.gov/data-and-reporting/directories`, and the current Kansas educational directory PDF URL each return HTTP 200 only as the same `Request Rejected` shell. The current Directory Reports root also exposes no `__VIEWSTATE`, `__VIEWSTATEGENERATOR`, or `__EVENTVALIDATION` fields, so the old exact public district-submit contract is no longer reproducible in the raw lane. Kansas therefore remains blocked on incomplete county-grade local education proof, and the only safe next lane is saved district-owned and export-backed leaf repair, not more live KSDE root retries.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed live DCF Rehabilitation Services Program Overview page replaced the old KDADS misclassification.)
- protection_and_advocacy: verified_state_grade (Reviewed first-party DRC Kansas evidence plus live About/Get Help pages prove the statewide protection-and-advocacy role and help path.)
- parent_training_information_center: verified_state_grade (Reviewed first-party Families Together evidence explicitly states that it is Kansas’ federally designated PTI.)
- legal_aid: verified_state_grade (Reviewed live Kansas Legal Services homepage explicitly proves the statewide legal-aid role.)
- able_program: verified_state_grade (Statewide ABLE crossover evidence remains reviewed and intact.)
- ssi_ssa_federal_reference: verified_state_grade (SSA crossover evidence remains reviewed and intact.)
- county_local_disability_resources: verified_state_grade (The official KanCare Ombudsman Counties in Alphabetical Order directory now exposes county-specific Community Resources guide links across all 105 Kansas counties on the live first-party stack.)

## Failure ledger

- district_or_county_education_routing: official_ksde_directory_and_pdf_roots_now_only_serve_request_rejected_shells_and_the_directory_reports_root_exposes_no_hidden_submit_fields_while_reviewed_district_owned_leaves_cover_16_counties :: Reviewed 2026-06-23 one more bounded official Kansas district-routing pass focused on the exact official state directory/export roots plus one exact district-scoped submit attempt. `https://uapps.ksde.gov/Directory_Rpts/default.aspx`, `https://www.ksde.gov/data-and-reporting/directories`, and `https://www.ksde.gov/docs/default-source/crp/2025-2026-kansas-educational-directory.pdf?sfvrsn=7c81fd62_12` each returned HTTP 200 only as the same `Request Rejected` shell with `The requested URL was rejected. Please consult with your administrator.` The current raw Directory Reports root no longer exposes the hidden ASP.NET fields `__VIEWSTATE`, `__VIEWSTATEGENERATOR`, or `__EVENTVALIDATION`, so the previously preserved exact district-scoped public submit contract cannot be replayed from the raw lane at all. Kansas still has reviewed local proof for 16 counties from previously preserved district-owned or district-linked leaves, but the remaining county-grade gap is still unresolved across the rest of the state. The right next lane is therefore exact district-leaf repair from saved district leads, not more retries against the current KSDE roots.

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

- [critical] district_or_county_education_routing: continue_only_from_saved_export_backed_district_leads_and_reviewed_district_owned_domains_because_live_ksde_submit_contract_is_not_present_in_raw_lane

## Repair decision

- Kansas remains BLOCKED and not index-safe.
- Education is still the only remaining critical blocker.
- Kansas still has reviewed local education-routing proof for 16 counties from saved district-owned or district-linked local leaves.
- But the current official KSDE roots now expose only rejected shells, and the raw Directory Reports page no longer exposes the hidden ASP.NET fields needed to replay the old district-scoped public submit contract.
- That means the correct next lane is exact district-leaf repair from already-preserved district leads only, not more retries against live KSDE state roots.
