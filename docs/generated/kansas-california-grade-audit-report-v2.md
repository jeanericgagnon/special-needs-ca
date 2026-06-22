# Kansas California-Grade Part C Repair v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 42
- county_count: 105
- primary_gap_reason: ksde_request_rejected_shell_plus_kancare_kdads_access_blocked

## Family status

- medicaid_state_health_coverage: blocked_live_medicaid_source_access_denied (The reviewed exact KanCare Medicaid root is challenge-blocked and the old packet also mixed unrelated ABLE and KDADS rows into the Medicaid family.)
- medicaid_waiver_hcbs_disability_services: blocked_live_waiver_source_access_denied (The reviewed exact KDADS waiver eligibility leaf is challenge-blocked and no reviewed waiver content is preserved on disk.)
- developmental_disability_idd_authority: blocked_live_dd_authority_source_access_denied (The old dhhs.kansas.gov DD root is dead and the reviewed KDADS DD replacement remains challenge-blocked.)
- early_intervention_part_c: blocked_ksde_ecse_root_request_rejected (Reviewed 2026-06-22 live probe to the exact KSDE Early Childhood Special Education leaf now returns the same 245-byte Request Rejected shell as the KSDE root and special-education page, so the previously reviewed KSDE Part C evidence is no longer fetchable in the current lane.)
- special_education_idea_part_b: blocked_ksde_special_education_root_request_rejected (Reviewed 2026-06-22 live probe to the exact KSDE Special Education leaf now returns a 245-byte Request Rejected shell rather than special-education content, so the prior statewide IDEA Part B verification no longer survives live host checks.)
- district_or_county_education_routing: blocked_ksde_host_request_rejected_and_no_local_leafs (Kansas district routing remains blocked because the live KSDE host now returns the same Request Rejected shell on both the statewide Special Education root and likely directory paths, while no reviewed district-owned or county-grade special-education leaf is preserved on disk.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed live DCF Rehabilitation Services Program Overview page replaced the old KDADS misclassification.)
- protection_and_advocacy: verified_state_grade (Reviewed first-party DRC Kansas evidence plus live About/Get Help pages prove the statewide protection-and-advocacy role and help path.)
- parent_training_information_center: verified_state_grade (Reviewed first-party Families Together evidence explicitly states that it is Kansas’ federally designated PTI.)
- legal_aid: verified_state_grade (Reviewed live Kansas Legal Services homepage explicitly proves the statewide legal-aid role.)
- able_program: verified_state_grade (Statewide ABLE crossover evidence remains reviewed and intact.)
- ssi_ssa_federal_reference: verified_state_grade (SSA crossover evidence remains reviewed and intact.)
- county_local_disability_resources: blocked_live_county_locator_source_dead_or_access_denied (The old county-local locator root is dead and no reviewed live official county-grade replacement was captured.)

## Failure ledger

- medicaid_state_health_coverage: reviewed_exact_medicaid_root_access_blocked :: Reviewed 2026-06-22 live probe to the exact Kansas Medicaid root https://www.kancare.ks.gov/ still returns HTTP 403 Forbidden / access denied instead of Medicaid content.
- medicaid_waiver_hcbs_disability_services: reviewed_exact_waiver_leaf_access_blocked :: Reviewed 2026-06-22 live probe to the exact KDADS waiver and HCBS surfaces still returns HTTP 403 Forbidden / access denied.
- developmental_disability_idd_authority: legacy_dd_root_dead_and_reviewed_replacement_access_blocked :: The old dhhs.kansas.gov/dd root remains dead, and reviewed 2026-06-22 live probe to the exact KDADS root still returns HTTP 403 Forbidden / access denied instead of DD content.
- early_intervention_part_c: ksde_request_rejected_shell_on_exact_special_education_and_ecse_roots :: Reviewed 2026-06-22 live probe to https://www.ksde.gov/student-success/early-childhood/early-childhood-special-education returned a 245-byte Request Rejected shell with support ID instead of Early Childhood Special Education or Part C content.
- special_education_idea_part_b: ksde_request_rejected_shell_on_exact_special_education_and_ecse_roots :: Reviewed 2026-06-22 live probe to https://www.ksde.gov/policy-and-funding/special-education returned a 245-byte Request Rejected shell with support ID instead of special-education content.
- district_or_county_education_routing: ksde_request_rejected_shell_on_exact_special_education_and_ecse_roots :: Reviewed 2026-06-22 live probes to the KSDE root, Special Education root, and likely directory paths all returned the same 245-byte Request Rejected shell, while no reviewed district-owned or county-grade special-education leaf is preserved on disk.
- county_local_disability_resources: legacy_county_locator_dead_and_reviewed_replacement_access_blocked :: The old dhhs.kansas.gov/locations locator remains dead, and reviewed 2026-06-22 live probe to the exact KDADS root still returns HTTP 403 Forbidden / access denied, so no reviewed county-grade replacement is captured.

## Verified source samples

- medicaid_state_health_coverage: blocked_live_medicaid_source_access_denied; samples=0
- medicaid_waiver_hcbs_disability_services: blocked_live_waiver_source_access_denied; samples=0
- developmental_disability_idd_authority: blocked_live_dd_authority_source_access_denied; samples=0
- early_intervention_part_c: blocked_ksde_ecse_root_request_rejected; samples=0
- special_education_idea_part_b: blocked_ksde_special_education_root_request_rejected; samples=0
- district_or_county_education_routing: blocked_ksde_host_request_rejected_and_no_local_leafs; samples=0
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.dcf.ks.gov/services/RS/Pages/default.aspx
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.drckansas.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://familiestogetherinc.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.kansaslegalservices.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/
- county_local_disability_resources: blocked_live_county_locator_source_dead_or_access_denied; samples=0

## Next actions

- [critical] medicaid_state_health_coverage: browser_assisted_or_reviewed_alt_official_medicaid_leaf
- [critical] medicaid_waiver_hcbs_disability_services: browser_assisted_or_reviewed_alt_official_waiver_leaf
- [critical] developmental_disability_idd_authority: browser_assisted_or_reviewed_alt_official_dd_leaf
- [critical] early_intervention_part_c: browser_assisted_or_reviewed_alt_official_part_c_leaf
- [critical] special_education_idea_part_b: browser_assisted_or_reviewed_alt_official_special_education_leaf
- [critical] district_or_county_education_routing: browser_assisted_or_author_exact_district_targets_after_host_access_is_restored
- [critical] county_local_disability_resources: browser_assisted_or_author_county_local_exact_targets

## Completion decision

- Kansas remains BLOCKED and not index-safe because the live KanCare and KDADS roots are still blocked, and the live KSDE host now returns the same tiny Request Rejected shell for the previously verified Special Education and Early Childhood Special Education roots.
- This pass tightens the packet truth model by downgrading KSDE-backed special-education and Part C families that no longer survive current live host checks, instead of preserving stale verified status from earlier fetch conditions.
