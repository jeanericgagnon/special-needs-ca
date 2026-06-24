# Kansas California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 92
- county_count: 105
- primary_gap_reason: live_ksde_directory_root_and_public_export_contract_recovered_but_reviewed_local_district_leaves_still_cover_only_18_counties

## Family status

- medicaid_state_health_coverage: verified_state_grade (Reviewed live KanCare Home, Eligibility, and Appeals/Fair Hearings leaves now preserve Kansas Medicaid coverage, eligibility rules, and appeal routing on the official first-party stack.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (The live official KanCare stack now preserves reviewed HCBS waiver evidence even when sibling raw fetches to KDADS still hit access-denied shells: the KanCare home page explicitly says Kansas is developing the Community Support Waiver (CSW) to shorten the HCBS waiting list, and the official FS-7 KanCare fact sheet names seven HCBS waivers, including the Intellectual/Developmental Disability waiver, with application routing through the KanCare Clearinghouse.)
- developmental_disability_idd_authority: verified_state_grade (Kansas DD authority now clears at state grade from reviewed first-party KDADS leaves. The live KDADS root renders HCBS and disability program navigation, the official Intellectual / Developmentally Disabled Information page is public, the Community Support Waiver page explicitly serves Kansans with intellectual and developmental disabilities, and the HCBS Leadership & Staff page names I/DD and waiver staff roles on the same official host. The old host-wide 403 claim is no longer accurate for browser-readable review.)
- early_intervention_part_c: verified_state_grade (Reviewed live KSDE Early Childhood Special Education leaf again provides Kansas birth-to-three, Part C, KDHE administration, and the local ITS referral pointer.)
- special_education_idea_part_b: verified_state_grade (Reviewed live KSDE Special Education leaf again provides a role-pure IDEA Part B root and links to dispute-resolution plus parent-rights leaves on the same official path.)
- district_or_county_education_routing: blocked_live_ksde_export_contract_recovered_but_reviewed_local_district_leaves_still_incomplete (Kansas still has reviewed local education-routing proof for only 18 counties, so the state remains blocked on incomplete county-grade local education evidence. The live official KSDE export lane is still recovered, and the right next lane remains exact district-owned or district-linked local leaf authoring from the export-backed district inventory.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed live DCF Rehabilitation Services Program Overview page replaced the old KDADS misclassification.)
- protection_and_advocacy: verified_state_grade (Reviewed first-party DRC Kansas evidence plus live About/Get Help pages prove the statewide protection-and-advocacy role and help path.)
- parent_training_information_center: verified_state_grade (Reviewed first-party Families Together evidence explicitly states that it is Kansas’ federally designated PTI.)
- legal_aid: verified_state_grade (Reviewed live Kansas Legal Services homepage explicitly proves the statewide legal-aid role.)
- able_program: verified_state_grade (Statewide ABLE crossover evidence remains reviewed and intact.)
- ssi_ssa_federal_reference: verified_state_grade (SSA crossover evidence remains reviewed and intact.)
- county_local_disability_resources: verified_state_grade (The official KanCare Ombudsman Counties in Alphabetical Order directory now exposes county-specific Community Resources guide links across all 105 Kansas counties on the live first-party stack.)

## Failure ledger

- district_or_county_education_routing: live_ksde_directory_root_and_public_export_contract_recovered_but_reviewed_local_district_leaves_still_cover_only_18_counties :: Reviewed 2026-06-24 one more bounded official Kansas district-routing pass using only the recovered live KSDE export contract, official district-owned hosts, official public sitemaps, and exact same-domain role-bearing leaves. Education routing now has reviewed local proof for 18/105 counties: atchison-ks, butler-ks, cowley-ks, doniphan-ks, douglas-ks, ellis-ks, finney-ks, geary-ks, harvey-ks, johnson-ks, leavenworth-ks, lyon-ks, nemaha-ks, riley-ks, saline-ks, sedgwick-ks, shawnee-ks, wyandotte-ks. Doniphan now clears because the official Doniphan West USD 111 sitemap exposed an exact same-domain `/o/dwes/page/special-education/` leaf and the fetched district-host page returned HTTP 200 with title `Special Education | Elementary School` on usd111.org. Nemaha now clears because the official Nemaha Central USD 115 sitemap exposed an `mnesc` subtree on the district-owned host and the fetched page title `EARLY CHILDHOOD | Marshall-Nemaha Special Education Co-op` preserves an explicit district-linked special-education cooperative route on usd115.org. Kansas therefore remains blocked because county-grade local education proof is still incomplete across the remaining unresolved counties even though the live export-backed local-leaf lane keeps producing exact district-host matches.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.kancare.ks.gov/
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=2; first=https://www.kancare.ks.gov/
- developmental_disability_idd_authority: verified_state_grade; samples=4; first=https://www.kdads.ks.gov/
- early_intervention_part_c: verified_state_grade; samples=1; first=https://www.ksde.gov/student-success/early-childhood/early-childhood-special-education
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.ksde.gov/policy-and-funding/special-education
- district_or_county_education_routing: blocked_live_ksde_export_contract_recovered_but_reviewed_local_district_leaves_still_incomplete; samples=22; first=https://uapps.ksde.gov/Directory_Rpts/default.aspx
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.dcf.ks.gov/services/RS/Pages/default.aspx
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.drckansas.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://familiestogetherinc.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.kansaslegalservices.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/
- county_local_disability_resources: verified_state_grade; samples=105; first=https://www.kancare.ks.gov/members/help-resources/kancare-ombudsman/resources/counties-in-alphabetical-order

## Next actions

- [critical] district_or_county_education_routing: resume_only_from_live_public_export_backed_district_inventory_and_saved_district_owned_domains_to_expand_reviewed_local_education_leaves

## Repair decision

- Kansas remains BLOCKED and not index-safe.
- Education is still the only remaining critical blocker.
- Doniphan now clears from the district-owned Doniphan West USD 111 special-education leaf exposed in the public district sitemap.
- Nemaha now clears from the district-linked Marshall-Nemaha Special Education Co-op leaf exposed on the official Nemaha Central USD 115 host.
- Kansas now has reviewed local education-routing proof for eighteen counties, but county-grade local coverage remains incomplete across the remaining unresolved counties.
