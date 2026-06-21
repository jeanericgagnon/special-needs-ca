# Kansas California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 50
- county_count: 105
- primary_gap_reason: official_medicaid_kdads_stack_blocked_and_county_grade_local_district_proof_unverified

## Family status

- medicaid_state_health_coverage: blocked_live_medicaid_source_access_denied (The reviewed exact KanCare Medicaid root is challenge-blocked and the old packet also mixed unrelated ABLE and KDADS rows into the Medicaid family.)
- medicaid_waiver_hcbs_disability_services: blocked_live_waiver_source_access_denied (The reviewed exact KDADS waiver eligibility leaf is challenge-blocked and no reviewed waiver content is preserved on disk.)
- developmental_disability_idd_authority: blocked_live_dd_authority_source_access_denied (The old dhhs.kansas.gov DD root is dead and the reviewed KDADS DD replacement remains challenge-blocked.)
- early_intervention_part_c: missing_reviewed_role_aligned_part_c_source (The old dhhs.kansas.gov early-start root is dead and the bounded Tiny-K repair probe did not yield a reviewed Part C replacement.)
- special_education_idea_part_b: verified_state_grade (Reviewed live KSDE Special Education leaf replaced the old generic KSDE homepage sample.)
- district_or_county_education_routing: blocked_exact_district_or_county_leafs_unverified (Kansas still lacks reviewed district-owned or county-grade special-education leaves; only statewide KSDE evidence is currently verified.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed live DCF Rehabilitation Services Program Overview page replaced the old KDADS misclassification.)
- protection_and_advocacy: verified_state_grade (Reviewed first-party DRC Kansas evidence plus live About/Get Help pages prove the statewide protection-and-advocacy role and help path.)
- parent_training_information_center: verified_state_grade (Reviewed first-party Families Together evidence explicitly states that it is Kansas’ federally designated PTI.)
- legal_aid: verified_state_grade (Reviewed live Kansas Legal Services homepage explicitly proves the statewide legal-aid role.)
- able_program: verified_state_grade (Statewide ABLE crossover evidence remains reviewed and intact.)
- ssi_ssa_federal_reference: verified_state_grade (SSA crossover evidence remains reviewed and intact.)
- county_local_disability_resources: blocked_live_county_locator_source_dead_or_access_denied (The old county-local locator root is dead and no reviewed live official county-grade replacement was captured.)

## Failure ledger

- medicaid_state_health_coverage: reviewed_exact_medicaid_root_access_blocked :: Reviewed 2026-06-21 live probe to the exact Kansas Medicaid root returned an Akamai-style "Access Denied" 403 challenge page instead of Medicaid content.
- medicaid_waiver_hcbs_disability_services: reviewed_exact_waiver_leaf_access_blocked :: Reviewed 2026-06-21 live probe to the exact KDADS waiver eligibility leaf returned an Akamai-style "Access Denied" 403 challenge page.
- developmental_disability_idd_authority: legacy_dd_root_dead_and_reviewed_replacement_access_blocked :: Reviewed 2026-06-21 live probe failed DNS resolution for dhhs.kansas.gov/dd, so the old packet DD root is dead. Reviewed 2026-06-21 live probe to the exact KDADS root returned an Akamai-style "Access Denied" 403 challenge page instead of DD, waiver, or early-intervention content.
- early_intervention_part_c: legacy_early_intervention_source_dead_and_no_reviewed_replacement :: Reviewed 2026-06-21 live probe failed DNS resolution for dhhs.kansas.gov/earlystart, so the old packet early-intervention root is dead. Reviewed 2026-06-21 bounded Part C repair probe to the likely Tiny-K root failed DNS resolution, so no reviewed role-aligned Kansas Part C replacement was captured.
- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: Kansas district routing still depends on statewide KSDE pages and generic district fallbacks; no reviewed district-owned or county-grade special-education leaf is on disk.
- county_local_disability_resources: legacy_county_locator_dead_and_reviewed_replacement_access_blocked :: Reviewed 2026-06-21 live probe failed DNS resolution for dhhs.kansas.gov/locations, so the old county-local locator root is dead. Reviewed 2026-06-21 live probe to the exact KDADS root returned an Akamai-style "Access Denied" 403 challenge page instead of DD, waiver, or early-intervention content.

## Verified source samples

- medicaid_state_health_coverage: blocked_live_medicaid_source_access_denied; samples=0
- medicaid_waiver_hcbs_disability_services: blocked_live_waiver_source_access_denied; samples=0
- developmental_disability_idd_authority: blocked_live_dd_authority_source_access_denied; samples=0
- early_intervention_part_c: missing_reviewed_role_aligned_part_c_source; samples=0
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.ksde.gov/policy-and-funding/special-education
- district_or_county_education_routing: blocked_exact_district_or_county_leafs_unverified; samples=0
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
- [critical] early_intervention_part_c: author_or_review_current_official_part_c_source
- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [critical] county_local_disability_resources: author_county_local_exact_targets

## Kansas truth refresh decision

- Kansas special-education authority upgrades only after replacing the old generic KSDE homepage sample with the exact KSDE Special Education leaf.
- Kansas statewide support improves materially: Disability Rights Center of Kansas now upgrades the P&A family, Families Together upgrades the PTI family because the reviewed first-party homepage explicitly says it is Kansas’ federally designated PTI, and Kansas Legal Services upgrades the legal-aid family from live first-party evidence.
- Kansas VR / Pre-ETS upgrades only after replacing the old KDADS misclassification with the live DCF Rehabilitation Services Program Overview page.
- Kansas Medicaid, waiver, and DD authority families do not stay verified because the reviewed exact official roots now return only challenge-blocked 403 pages, while the legacy dhhs.kansas.gov roots are dead.
- Kansas early intervention remains missing because the old early-start root is dead and the bounded Tiny-K repair probe did not yield a reviewed Part C replacement.
- Kansas county-local disability resources remain blocked because the old county locator root is dead and no reviewed live official county-grade replacement was captured.
- Kansas district-or-county education routing remains blocked because no reviewed district-owned or county-grade special-education leaves replace the statewide fallback.
- Kansas is therefore truthfully BLOCKED and not index-safe. The packet is cleaner and more useful, but California-grade completion still requires reviewed official Medicaid/KDADS access, a reviewed Part C source, and county-grade district/local routing proof.
