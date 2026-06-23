# Kansas California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 105
- primary_gap_reason: kansas_dd_stack_is_uniformly_403_blocked_and_live_ksde_directory_roots_still_lack_local_contract

## Family status

- medicaid_state_health_coverage: verified_state_grade (Reviewed live KanCare Home, Eligibility, and Appeals/Fair Hearings leaves now preserve Kansas Medicaid coverage, eligibility rules, and appeal routing on the official first-party stack.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (The live official KanCare stack now preserves reviewed HCBS waiver evidence even when sibling raw fetches to KDADS still hit access-denied shells: the KanCare home page explicitly says Kansas is developing the Community Support Waiver (CSW) to shorten the HCBS waiting list, and the official FS-7 KanCare fact sheet names seven HCBS waivers, including the Intellectual/Developmental Disability waiver, with application routing through the KanCare Clearinghouse.)
- developmental_disability_idd_authority: blocked_uniform_http_403_dd_stack (Kansas now has a stricter DD blocker: the live KDADS root, the exact KDADS developmental-disabilities leaf, the KDADS robots file, the KanCare root, and the KanCare HCBS fact-sheet leaf all return HTTP 403 / access denied in bounded raw fetches. There is no longer even a public robots exception to justify same-host retries, so the only honest next lane is browser-assisted review or an alternate official DD leaf outside the blocked hosts.)
- early_intervention_part_c: verified_state_grade (Reviewed live KSDE Early Childhood Special Education leaf again provides Kansas birth-to-three, Part C, KDHE administration, and the local ITS referral pointer.)
- special_education_idea_part_b: verified_state_grade (Reviewed live KSDE Special Education leaf again provides a role-pure IDEA Part B root and links to dispute-resolution plus parent-rights leaves on the same official path.)
- district_or_county_education_routing: blocked_live_ksde_directory_roots_without_local_contract (Kansas now has a better education authoring packet but not county-grade proof. The live KSDE Special Education root links to current official School District Maps, Directories, Dispute Resolution, and Parents Rights leaves, and Data Central redirects to a live datacentral.ksde.gov root that links the public Directory Reports app. But all 105 Kansas school_district rows still point at the same statewide KSDE placeholder, and no reviewed county-to-district join or district-owned special-education contact leaf is preserved on disk.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed live DCF Rehabilitation Services Program Overview page replaced the old KDADS misclassification.)
- protection_and_advocacy: verified_state_grade (Reviewed first-party DRC Kansas evidence plus live About/Get Help pages prove the statewide protection-and-advocacy role and help path.)
- parent_training_information_center: verified_state_grade (Reviewed first-party Families Together evidence explicitly states that it is Kansas’ federally designated PTI.)
- legal_aid: verified_state_grade (Reviewed live Kansas Legal Services homepage explicitly proves the statewide legal-aid role.)
- able_program: verified_state_grade (Statewide ABLE crossover evidence remains reviewed and intact.)
- ssi_ssa_federal_reference: verified_state_grade (SSA crossover evidence remains reviewed and intact.)
- county_local_disability_resources: verified_state_grade (The official KanCare Ombudsman Counties in Alphabetical Order directory now exposes county-specific Community Resources guide links across all 105 Kansas counties on the live first-party stack.)

## Failure ledger

- developmental_disability_idd_authority: kdads_and_kancare_roots_and_dd_surfaces_now_return_uniform_http_403 :: Reviewed 2026-06-23 bounded live official Kansas DD probes on https://www.kdads.ks.gov/, https://www.kdads.ks.gov/services/developmental-disabilities, https://www.kdads.ks.gov/robots.txt, https://www.kancare.ks.gov/, and https://www.kancare.ks.gov/home/showpublisheddocument/6224/639013892674730000. Every one of those exact official roots and leaves now returns HTTP 403 Forbidden / access denied under the same low-token fetch contract. Kansas therefore still lacks any raw-fetch-reviewable official DD authority leaf, and the blocker is now a uniform 403 host-stack pattern rather than a content-discovery problem.
- district_or_county_education_routing: live_ksde_directory_roots_preserved_but_no_county_or_district_special_education_contract_on_disk :: Reviewed 2026-06-23 bounded live official Kansas education probes on https://www.ksde.gov/, https://www.ksde.gov/policy-and-funding/special-education, https://www.ksde.gov/policy-and-funding/school-transportation/school-district-maps, https://www.ksde.gov/data-and-reporting/directories, https://www.ksde.gov/data-and-reporting/data-central, https://datacentral.ksde.gov/default.aspx, https://uapps.ksde.gov/Directory_Rpts/default.aspx, https://www.ksde.gov/policy-and-funding/special-education/special-education-law/dispute-resolution, https://www.ksde.gov/policy-and-funding/special-education/special-education-law/notices-and-forms/parents-rights, and the live USD county map PDF at https://www.ksde.gov/docs/default-source/sf/2025-usd-county-map.pdf?sfvrsn=8ceea3ce_5. The current KSDE roots are live and preserve better statewide authoring surfaces than the older stale paths, including a live Data Central root and a linked public Directory Reports app. But a live DB reconciliation still shows all 105 Kansas school_district rows pointing at the same statewide placeholder website https://www.ksde.org/Default.aspx?tabid=101, and the refreshed official roots still do not preserve a county-to-district join or district-owned special-education routing leaf on disk.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.kancare.ks.gov/
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=2; first=https://www.kancare.ks.gov/
- developmental_disability_idd_authority: blocked_uniform_http_403_dd_stack; samples=3; first=https://www.kdads.ks.gov/
- early_intervention_part_c: verified_state_grade; samples=1; first=https://www.ksde.gov/student-success/early-childhood/early-childhood-special-education
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.ksde.gov/policy-and-funding/special-education
- district_or_county_education_routing: blocked_live_ksde_directory_roots_without_local_contract; samples=3; first=https://www.ksde.gov/policy-and-funding/school-transportation/school-district-maps
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.dcf.ks.gov/services/RS/Pages/default.aspx
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.drckansas.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://familiestogetherinc.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.kansaslegalservices.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/
- county_local_disability_resources: verified_state_grade; samples=105; first=https://www.kancare.ks.gov/members/help-resources/kancare-ombudsman/resources/counties-in-alphabetical-order

## Next actions

- [critical] developmental_disability_idd_authority: browser_assisted_or_alternate_official_dd_leaf_after_uniform_403_confirmation
- [critical] district_or_county_education_routing: author_reviewed_district_owned_special_education_leaves_from_uapps_directory_reports_or_keep_kansas_blocked

## Repair decision

- Kansas remains BLOCKED and not index-safe.
- The DD blocker is now stricter and simpler: KDADS root, DD leaf, and the supporting KanCare root and HCBS leaf all return HTTP 403, so no same-host low-token lane remains honest.
- The KSDE statewide stack is healthier than the old packet implied: current Special Education navigation exposes live School District Maps, Directories, Data Central, and Directory Reports roots.
- That still does not clear county-grade education routing because all 105 district rows remain statewide placeholders and no district-owned special-education leaves are preserved yet.
