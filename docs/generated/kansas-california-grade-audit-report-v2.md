# Kansas California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 105
- primary_gap_reason: kansas_dd_stack_is_uniformly_transport_blocked_and_live_ksde_directory_roots_still_lack_local_contract

## Family status

- medicaid_state_health_coverage: verified_state_grade (Reviewed live KanCare Home, Eligibility, and Appeals/Fair Hearings leaves now preserve Kansas Medicaid coverage, eligibility rules, and appeal routing on the official first-party stack.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (The live official KanCare stack now preserves reviewed HCBS waiver evidence even when sibling raw fetches to KDADS still hit access-denied shells: the KanCare home page explicitly says Kansas is developing the Community Support Waiver (CSW) to shorten the HCBS waiting list, and the official FS-7 KanCare fact sheet names seven HCBS waivers, including the Intellectual/Developmental Disability waiver, with application routing through the KanCare Clearinghouse.)
- developmental_disability_idd_authority: blocked_uniform_http_403_dd_stack (Kansas now has a transport-final DD blocker. A browser-style client still gets the same tiny official `Access Denied` shell on the KDADS root, the exact developmental-disabilities leaf, robots.txt, the KanCare root, and the exact KanCare HCBS fact-sheet leaf. The blocker is no longer a discovery problem; it is a uniform host-stack denial pattern with no public raw-fetch opening on the official DD surfaces.)
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

- developmental_disability_idd_authority: uniform_tiny_serve_403_shell_on_kdads_and_kancare_dd_stack :: Reviewed 2026-06-23 bounded live official Kansas DD probes with a browser-style client on https://www.kdads.ks.gov/, https://www.kdads.ks.gov/services/developmental-disabilities, https://www.kdads.ks.gov/robots.txt, https://www.kancare.ks.gov/, and https://www.kancare.ks.gov/home/showpublisheddocument/6224/639013892674730000. Every exact official root and leaf still returned HTTP 403 with the same tiny `Access Denied` HTML shell (roughly 412-476 bytes) and a pseudo-path containing `$(SERVE_403)` rather than role-bearing content. That same denial pattern now holds on the site root, the exact DD leaf, robots.txt, the KanCare root, and the HCBS fact-sheet leaf even under a browser-style fetch contract. Kansas therefore still lacks any publicly raw-fetch-reviewable official DD authority surface, and the blocker should stay classified as a uniform transport denial rather than a content-discovery gap.
- district_or_county_education_routing: live_ksde_directory_roots_preserved_but_no_county_or_district_special_education_contract_on_disk :: Reviewed 2026-06-23 bounded live official Kansas education probes on https://www.ksde.gov/, https://www.ksde.gov/policy-and-funding/special-education, https://www.ksde.gov/policy-and-funding/school-transportation/school-district-maps, https://www.ksde.gov/data-and-reporting/directories, https://www.ksde.gov/data-and-reporting/data-central, https://datacentral.ksde.gov/default.aspx, https://uapps.ksde.gov/Directory_Rpts/default.aspx, https://www.ksde.gov/policy-and-funding/special-education/special-education-law/dispute-resolution, https://www.ksde.gov/policy-and-funding/special-education/special-education-law/notices-and-forms/parents-rights, and the live USD county map PDF at https://www.ksde.gov/docs/default-source/sf/2025-usd-county-map.pdf?sfvrsn=8ceea3ce_5. The current KSDE roots are live and preserve better statewide authoring surfaces than the older stale paths, including a live Data Central root and a linked public Directory Reports app. But a live DB reconciliation still shows all 105 Kansas school_district rows pointing at the same statewide placeholder website https://www.ksde.org/Default.aspx?tabid=101, and the refreshed official roots still do not preserve a county-to-district join or district-owned special-education routing leaf on disk.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.kancare.ks.gov/
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=2; first=https://www.kancare.ks.gov/
- developmental_disability_idd_authority: blocked_uniform_tiny_serve_403_shell_on_dd_stack; samples=3; first=https://www.kdads.ks.gov/
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

- [critical] developmental_disability_idd_authority: keep_kansas_dd_blocked_until_browser_review_or_alternate_official_dd_leaf_exists_outside_uniform_serve_403_hosts
- [critical] district_or_county_education_routing: author_reviewed_district_owned_special_education_leaves_from_uapps_directory_reports_or_keep_kansas_blocked

## Repair decision

- Kansas remains BLOCKED and not index-safe.
- County-local routing is already complete on the official ombudsman county directory, but the DD authority stack is now proven to be uniformly transport-blocked rather than merely under-discovered.
- Education still lacks a county-to-district or district-owned special-education contract on disk, so Kansas cannot become COMPLETE yet.
