# Kansas California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 92
- county_count: 105
- primary_gap_reason: public_ksde_directory_export_contract_exists_but_not_yet_converted_into_reviewed_district_owned_special_education_leaves

## Family status

- medicaid_state_health_coverage: verified_state_grade (Reviewed live KanCare Home, Eligibility, and Appeals/Fair Hearings leaves now preserve Kansas Medicaid coverage, eligibility rules, and appeal routing on the official first-party stack.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (The live official KanCare stack now preserves reviewed HCBS waiver evidence even when sibling raw fetches to KDADS still hit access-denied shells: the KanCare home page explicitly says Kansas is developing the Community Support Waiver (CSW) to shorten the HCBS waiting list, and the official FS-7 KanCare fact sheet names seven HCBS waivers, including the Intellectual/Developmental Disability waiver, with application routing through the KanCare Clearinghouse.)
- developmental_disability_idd_authority: verified_state_grade (Kansas DD authority now clears at state grade from reviewed first-party KDADS leaves. The live KDADS root renders HCBS and disability program navigation, the official Intellectual / Developmentally Disabled Information page is public, the Community Support Waiver page explicitly serves Kansans with intellectual and developmental disabilities, and the HCBS Leadership & Staff page names I/DD and waiver staff roles on the same official host. The old host-wide 403 claim is no longer accurate for browser-readable review.)
- early_intervention_part_c: verified_state_grade (Reviewed live KSDE Early Childhood Special Education leaf again provides Kansas birth-to-three, Part C, KDHE administration, and the local ITS referral pointer.)
- special_education_idea_part_b: verified_state_grade (Reviewed live KSDE Special Education leaf again provides a role-pure IDEA Part B root and links to dispute-resolution plus parent-rights leaves on the same official path.)
- district_or_county_education_routing: blocked_public_ksde_export_contract_without_reviewed_local_leaves (Kansas now has a stronger first-party education inventory lane than a static dropdown alone. The public KSDE Directory Reports app accepts a reviewed submit contract and returns a real Excel attachment for district reports, while the official Directories page publishes annual Kansas Educational Directory PDFs. A bounded live export for D0435 Abilene USD 435 produced an official `Directory.xls` workbook whose extracted strings preserve county and district contact fields such as `County Name`, `Superintendent Address`, `Phone`, plus Abilene/Dickinson and district email domains like `dsprinkle@abileneschools.org`. That means the public stack already yields a county-to-district join plus district-domain hints on a first-party surface. Kansas still remains blocked because those export-backed district rows are not yet converted into reviewed district-owned special-education or student-services leaves on disk.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed live DCF Rehabilitation Services Program Overview page replaced the old KDADS misclassification.)
- protection_and_advocacy: verified_state_grade (Reviewed first-party DRC Kansas evidence plus live About/Get Help pages prove the statewide protection-and-advocacy role and help path.)
- parent_training_information_center: verified_state_grade (Reviewed first-party Families Together evidence explicitly states that it is Kansas’ federally designated PTI.)
- legal_aid: verified_state_grade (Reviewed live Kansas Legal Services homepage explicitly proves the statewide legal-aid role.)
- able_program: verified_state_grade (Statewide ABLE crossover evidence remains reviewed and intact.)
- ssi_ssa_federal_reference: verified_state_grade (SSA crossover evidence remains reviewed and intact.)
- county_local_disability_resources: verified_state_grade (The official KanCare Ombudsman Counties in Alphabetical Order directory now exposes county-specific Community Resources guide links across all 105 Kansas counties on the live first-party stack.)

## Failure ledger

- district_or_county_education_routing: public_ksde_directory_export_contract_exists_but_not_yet_converted_into_reviewed_district_owned_special_education_leaves :: Reviewed 2026-06-23 bounded live official Kansas education probes on https://uapps.ksde.gov/Directory_Rpts/default.aspx and https://www.ksde.gov/data-and-reporting/directories, then reproduced one exact public report export using the live ASP.NET form contract (`__VIEWSTATE`, `__VIEWSTATEGENERATOR`, `__EVENTVALIDATION`, `ctl00$MainContent$ddDistricts=D0435`, `ctl00$MainContent$RadioGroup1=RadioUSD1`, `ctl00$MainContent$rblFormat=Excel`, `ctl00$MainContent$btnPrintSection1=Run Report`). The public Directory Reports app returned HTTP 200 on the same official host with `content-type: application/vnd.ms-excel` and `content-disposition: attachment ; filename=Directory.xls`. Bounded string extraction from that first-party export preserved the report title `SCHOOL DISTRICT SUPERINTENDENTS AND BOARD PRESIDENTS`, column names including `County Name`, `Superintendent Address`, `Phone`, and district-specific values for Abilene USD 435 such as `Abilene`, `Dickinson`, `785-263-2630`, and district email domains like `dsprinkle@abileneschools.org`, `cwest@abileneschools.org`, and `acornell@abileneschools.org`. The official KSDE Directories page also still publishes annual Kansas Educational Directory PDFs. Kansas therefore now has a public export-backed county join lane plus district-domain hints, but it remains blocked because no reviewed district-owned special-education or student-services leaves are yet preserved on disk for those districts.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.kancare.ks.gov/
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=2; first=https://www.kancare.ks.gov/
- developmental_disability_idd_authority: verified_state_grade; samples=4; first=https://www.kdads.ks.gov/
- early_intervention_part_c: verified_state_grade; samples=1; first=https://www.ksde.gov/student-success/early-childhood/early-childhood-special-education
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.ksde.gov/policy-and-funding/special-education
- district_or_county_education_routing: blocked_public_ksde_export_contract_without_reviewed_local_leaves; samples=5; first=https://www.ksde.gov/data-and-reporting/directories
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.dcf.ks.gov/services/RS/Pages/default.aspx
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.drckansas.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://familiestogetherinc.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.kansaslegalservices.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/
- county_local_disability_resources: verified_state_grade; samples=105; first=https://www.kancare.ks.gov/members/help-resources/kancare-ombudsman/resources/counties-in-alphabetical-order

## Next actions

- [critical] district_or_county_education_routing: use_public_directory_export_county_join_and_directory_artifacts_to_author_reviewed_district_owned_special_education_leaves

## Repair decision

- Kansas remains BLOCKED and not index-safe.
- Education is still the only remaining critical blocker, but the public first-party lane is now stronger than a dropdown-only inventory.
- The KSDE Directory Reports app returns a real district export with county and district contact fields, which is enough to drive district-owned leaf authoring without reopening statewide KSDE roots.
- Kansas still does not clear until those export-backed district rows are converted into reviewed district-owned special-education or student-services leaves.
