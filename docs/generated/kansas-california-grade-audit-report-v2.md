# Kansas California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 92
- county_count: 105
- primary_gap_reason: kansas_now_has_reviewed_first_party_dd_authority_but_public_district_inventory_is_still_not_converted_into_local_special_education_leaves

## Family status

- medicaid_state_health_coverage: verified_state_grade (Reviewed live KanCare Home, Eligibility, and Appeals/Fair Hearings leaves now preserve Kansas Medicaid coverage, eligibility rules, and appeal routing on the official first-party stack.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (The live official KanCare stack now preserves reviewed HCBS waiver evidence even when sibling raw fetches to KDADS still hit access-denied shells: the KanCare home page explicitly says Kansas is developing the Community Support Waiver (CSW) to shorten the HCBS waiting list, and the official FS-7 KanCare fact sheet names seven HCBS waivers, including the Intellectual/Developmental Disability waiver, with application routing through the KanCare Clearinghouse.)
- developmental_disability_idd_authority: verified_state_grade (Kansas DD authority now clears at state grade from reviewed first-party KDADS leaves. The live KDADS root renders HCBS and disability program navigation, the official Intellectual / Developmentally Disabled Information page is public, the Community Support Waiver page explicitly serves Kansans with intellectual and developmental disabilities, and the HCBS Leadership & Staff page names I/DD and waiver staff roles on the same official host. The old host-wide 403 claim is no longer accurate for browser-readable review.)
- early_intervention_part_c: verified_state_grade (Reviewed live KSDE Early Childhood Special Education leaf again provides Kansas birth-to-three, Part C, KDHE administration, and the local ITS referral pointer.)
- special_education_idea_part_b: verified_state_grade (Reviewed live KSDE Special Education leaf again provides a role-pure IDEA Part B root and links to dispute-resolution plus parent-rights leaves on the same official path.)
- district_or_county_education_routing: blocked_live_ksde_directory_roots_without_local_contract (Kansas now has only one remaining critical blocker. The live KSDE Directories page publishes current annual Kansas Educational Directory PDFs, and the public Directory Reports app exposes an `***ALL DISTRICTS***` selector plus named USD options such as Abilene USD 435, Andover USD 385, and Atchison Public Schools USD 409. That means the official stack preserves a concrete first-party district inventory lane. But the DB still shows all 105 school_district rows pointing at the same statewide KSDE placeholder, and no reviewed county-to-district join or district-owned special-education contact leaves are preserved on disk. Kansas therefore remains blocked until that public district inventory is turned into reviewed district-owned local leaves.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed live DCF Rehabilitation Services Program Overview page replaced the old KDADS misclassification.)
- protection_and_advocacy: verified_state_grade (Reviewed first-party DRC Kansas evidence plus live About/Get Help pages prove the statewide protection-and-advocacy role and help path.)
- parent_training_information_center: verified_state_grade (Reviewed first-party Families Together evidence explicitly states that it is Kansas’ federally designated PTI.)
- legal_aid: verified_state_grade (Reviewed live Kansas Legal Services homepage explicitly proves the statewide legal-aid role.)
- able_program: verified_state_grade (Statewide ABLE crossover evidence remains reviewed and intact.)
- ssi_ssa_federal_reference: verified_state_grade (SSA crossover evidence remains reviewed and intact.)
- county_local_disability_resources: verified_state_grade (The official KanCare Ombudsman Counties in Alphabetical Order directory now exposes county-specific Community Resources guide links across all 105 Kansas counties on the live first-party stack.)

## Failure ledger

- district_or_county_education_routing: public_directory_reports_dropdown_and_annual_directory_pdfs_exist_but_no_reviewed_local_special_education_leaves :: Reviewed 2026-06-23 bounded live official Kansas education probes on https://uapps.ksde.gov/Directory_Rpts/default.aspx, https://datacentral.ksde.gov/default.aspx, and https://www.ksde.gov/data-and-reporting/directories, in addition to the existing live KSDE Special Education and School District Maps roots already preserved on disk. The public Directory Reports app is not just an empty root: its HTML preserves a real `Kansas Educational Directory Reports` home page with `Organizational Directory Reports`, `Educator Directory Reports`, a `Complete Directory` link, and a public district selector that includes `***ALL DISTRICTS***` plus specific district IDs and names such as `D0435 :: ABILENE USD 435`, `D0385 :: ANDOVER USD 385`, and `D0409 :: ATCHISON PUBLIC SCHOOLS USD 409`. The official KSDE Directories page also publishes current annual Kansas Educational Directory PDFs. But a live DB reconciliation still shows all 105 Kansas school_district rows pointing at the same statewide placeholder website and no reviewed district-owned special-education or student-services leaves are preserved on disk.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.kancare.ks.gov/
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=2; first=https://www.kancare.ks.gov/
- developmental_disability_idd_authority: verified_state_grade; samples=4; first=https://www.kdads.ks.gov/
- early_intervention_part_c: verified_state_grade; samples=1; first=https://www.ksde.gov/student-success/early-childhood/early-childhood-special-education
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.ksde.gov/policy-and-funding/special-education
- district_or_county_education_routing: blocked_live_ksde_directory_roots_without_local_contract; samples=4; first=https://www.ksde.gov/data-and-reporting/directories
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.dcf.ks.gov/services/RS/Pages/default.aspx
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.drckansas.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://familiestogetherinc.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.kansaslegalservices.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/
- county_local_disability_resources: verified_state_grade; samples=105; first=https://www.kancare.ks.gov/members/help-resources/kancare-ombudsman/resources/counties-in-alphabetical-order

## Next actions

- [critical] district_or_county_education_routing: use_public_directory_dropdown_and_annual_directory_pdfs_to_author_reviewed_district_owned_special_education_leaves

## Repair decision

- Kansas remains BLOCKED and not index-safe.
- Developmental-disability authority now clears from reviewed first-party KDADS pages, so the old host-wide 403 blocker is retired.
- Education is now the only remaining critical blocker: Kansas has a real public district inventory, but it is still not converted into reviewed district-owned special-education or student-services leaves.
