# Kansas California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 92
- county_count: 105
- primary_gap_reason: live_ksde_directory_root_and_public_export_contract_recovered_but_reviewed_local_district_leaves_still_cover_only_16_counties

## Family status

- medicaid_state_health_coverage: verified_state_grade (Reviewed live KanCare Home, Eligibility, and Appeals/Fair Hearings leaves now preserve Kansas Medicaid coverage, eligibility rules, and appeal routing on the official first-party stack.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (The live official KanCare stack now preserves reviewed HCBS waiver evidence even when sibling raw fetches to KDADS still hit access-denied shells: the KanCare home page explicitly says Kansas is developing the Community Support Waiver (CSW) to shorten the HCBS waiting list, and the official FS-7 KanCare fact sheet names seven HCBS waivers, including the Intellectual/Developmental Disability waiver, with application routing through the KanCare Clearinghouse.)
- developmental_disability_idd_authority: verified_state_grade (Kansas DD authority now clears at state grade from reviewed first-party KDADS leaves. The live KDADS root renders HCBS and disability program navigation, the official Intellectual / Developmentally Disabled Information page is public, the Community Support Waiver page explicitly serves Kansans with intellectual and developmental disabilities, and the HCBS Leadership & Staff page names I/DD and waiver staff roles on the same official host. The old host-wide 403 claim is no longer accurate for browser-readable review.)
- early_intervention_part_c: verified_state_grade (Reviewed live KSDE Early Childhood Special Education leaf again provides Kansas birth-to-three, Part C, KDHE administration, and the local ITS referral pointer.)
- special_education_idea_part_b: verified_state_grade (Reviewed live KSDE Special Education leaf again provides a role-pure IDEA Part B root and links to dispute-resolution plus parent-rights leaves on the same official path.)
- district_or_county_education_routing: blocked_live_ksde_export_contract_recovered_but_reviewed_local_district_leaves_still_incomplete (Kansas still has reviewed local education-routing proof for only 16 counties, so the state remains blocked on incomplete county-grade local education evidence. But the official KSDE statewide lane is no longer dead: `https://uapps.ksde.gov/Directory_Rpts/default.aspx` is now live again with `__VIEWSTATE`, `__VIEWSTATEGENERATOR`, and `__EVENTVALIDATION`, `https://www.ksde.gov/data-and-reporting/directories` is live again, and the current Kansas Educational Directory PDF is once again a real public PDF. One bounded public replay of the Directory Reports app also again returns a real `Directory.xls` workbook, proving the official export-backed district inventory lane is back. Kansas therefore remains blocked, but the correct next lane has shifted from dead-root freeze to live export-backed district leaf authoring.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed live DCF Rehabilitation Services Program Overview page replaced the old KDADS misclassification.)
- protection_and_advocacy: verified_state_grade (Reviewed first-party DRC Kansas evidence plus live About/Get Help pages prove the statewide protection-and-advocacy role and help path.)
- parent_training_information_center: verified_state_grade (Reviewed first-party Families Together evidence explicitly states that it is Kansas’ federally designated PTI.)
- legal_aid: verified_state_grade (Reviewed live Kansas Legal Services homepage explicitly proves the statewide legal-aid role.)
- able_program: verified_state_grade (Statewide ABLE crossover evidence remains reviewed and intact.)
- ssi_ssa_federal_reference: verified_state_grade (SSA crossover evidence remains reviewed and intact.)
- county_local_disability_resources: verified_state_grade (The official KanCare Ombudsman Counties in Alphabetical Order directory now exposes county-specific Community Resources guide links across all 105 Kansas counties on the live first-party stack.)

## Failure ledger

- district_or_county_education_routing: live_ksde_directory_root_and_public_export_contract_recovered_but_reviewed_local_district_leaves_still_cover_only_16_counties :: Reviewed 2026-06-24 one more bounded official Kansas district-routing pass against the exact KSDE roots. `https://uapps.ksde.gov/Directory_Rpts/default.aspx` now returns a live HTML page with hidden ASP.NET fields `__VIEWSTATE`, `__VIEWSTATEGENERATOR`, and `__EVENTVALIDATION` again present. `https://www.ksde.gov/data-and-reporting/directories` now returns a live KSDE directories page, and `https://www.ksde.gov/docs/default-source/crp/2025-2026-kansas-educational-directory.pdf?sfvrsn=7c81fd62_12` now returns a real PDF (`content-type: application/pdf`, about 7.4 MB) instead of a rejected shell. A bounded public POST replay on the live Directory Reports root using the current hidden fields, `ctl00$MainContent$ddDistricts=D0435`, `ctl00$MainContent$RadioGroup1=RadioUSD1`, `ctl00$MainContent$rblFormat=Excel`, and `ctl00$MainContent$btnPrintSection1=Run Report` now again returns a real Excel workbook (`content-type: application/vnd.ms-excel`) whose extracted strings preserve `SCHOOL DISTRICT SUPERINTENDENTS AND BOARD PRESIDENTS`, `County Name`, `Superintendent Address`, `Phone`, and district values including Abilene / Dickinson plus district email domains on the official public export lane. Kansas still has reviewed local proof for only 16 counties from preserved district-owned or district-linked leaves, so county-grade education routing remains incomplete. The state therefore stays BLOCKED, but the blocker is now incomplete local leaf coverage, not a dead KSDE root.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.kancare.ks.gov/
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=2; first=https://www.kancare.ks.gov/
- developmental_disability_idd_authority: verified_state_grade; samples=4; first=https://www.kdads.ks.gov/
- early_intervention_part_c: verified_state_grade; samples=1; first=https://www.ksde.gov/student-success/early-childhood/early-childhood-special-education
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.ksde.gov/policy-and-funding/special-education
- district_or_county_education_routing: blocked_live_ksde_export_contract_recovered_but_reviewed_local_district_leaves_still_incomplete; samples=20; first=https://uapps.ksde.gov/Directory_Rpts/default.aspx
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
- The live official KSDE export lane has recovered: the Directory Reports root, Directories page, and current educational-directory PDF are public again, and one bounded public report replay again returns a real Excel workbook.
- Kansas still clears only 16 counties with reviewed district-owned or district-linked local education leaves, so county-grade local coverage remains incomplete.
- The correct next lane is now live export-backed district leaf authoring, not a dead-root retry freeze.
