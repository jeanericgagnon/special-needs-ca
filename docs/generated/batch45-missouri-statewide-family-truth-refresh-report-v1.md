# Missouri California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 58
- county_count: 115
- primary_gap_reason: district_grade_education_and_statewide_support_gaps_remain_after_live_official_repair

## Family status

- medicaid_state_health_coverage: verified_state_grade (Reviewed live DSS Healthcare and Medicaid Annual Renewals leaves now provide role-pure statewide Medicaid coverage evidence.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (Reviewed live DMH waiver-enrollment and Home & Community Based Waivers leaves replaced the stale hcbs/eligibility packet path.)
- developmental_disability_idd_authority: verified_state_grade (Reviewed live DMH eligibility and regional-office leaves replaced the dead dhhs.missouri.gov DD packet root.)
- early_intervention_part_c: missing_reviewed_role_aligned_part_c_source (The old dhhs.missouri.gov/earlystart packet root is dead and the bounded DESE repair pass did not surface a reviewed Part C / First Steps replacement leaf.)
- special_education_idea_part_b: verified_state_grade (Reviewed live DESE Office of Special Education leaf replaced the old generic dese.mo.gov homepage sample.)
- district_or_county_education_routing: blocked_exact_district_or_county_leafs_unverified (Missouri still lacks reviewed district-owned or county-grade special-education leaves; only statewide DESE routing is currently verified.)
- vocational_rehabilitation_pre_ets: missing_reviewed_vr_or_pre_ets_source (The old packet used DD pages for this family and the reviewed DMH Employment Services leaf still does not prove statewide VR or Pre-ETS routing.)
- protection_and_advocacy: verified_state_grade (Reviewed first-party Missouri Protection and Advocacy Services evidence explicitly proves the statewide P&A role and help path.)
- parent_training_information_center: blocked_exact_statewide_pti_source_access_blocked (The exact Missouri Parents Act / MPACT candidate is known, but the reviewed first-party fetch to missouriparentsact.org is access-blocked.)
- legal_aid: missing_reviewed_statewide_legal_aid_source (No reviewed statewide legal-aid source is present in the current Missouri packet.)
- able_program: verified_state_grade (Statewide ABLE crossover evidence remains reviewed and intact.)
- ssi_ssa_federal_reference: verified_state_grade (SSA crossover evidence remains reviewed and intact.)
- county_local_disability_resources: verified_state_grade (Reviewed DMH regional-office map exposes county-selection and office-routing semantics directly in fetched HTML.)

## Failure ledger

- early_intervention_part_c: legacy_early_intervention_source_dead_and_no_reviewed_replacement :: Reviewed 2026-06-21 live probe failed DNS resolution for dhhs.missouri.gov/earlystart, so the old packet early-intervention root is dead. Reviewed 2026-06-21 bounded DESE repair pass did not surface a reviewed Part C / First Steps leaf, and the guessed DESE First Steps path returned HTTP 404.
- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: Missouri district routing still depends on statewide DESE pages and directory roots; no reviewed district-owned or county-grade special-education leaf is on disk.
- vocational_rehabilitation_pre_ets: legacy_or_wrong_family_vr_sample :: Reviewed 2026-06-21 live probe returned "Employment Services | dmh.mo.gov", but this is a generic DMH employment-services page and does not prove statewide vocational rehabilitation or Pre-ETS routing.
- parent_training_information_center: reviewed_exact_statewide_pti_target_access_blocked :: Reviewed 2026-06-20 low-token fetch followed ptimpact.org to missouriparentsact.org and received HTTP 403, so the exact statewide PTI candidate could not be verified from fetched first-party evidence.
- legal_aid: missing_required_source_family :: Missouri still lacks a reviewed statewide legal-aid source on disk.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=2; first=https://mydss.mo.gov/healthcare
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=2; first=https://dmh.mo.gov/dev-disabilities/waiver-enrollment
- developmental_disability_idd_authority: verified_state_grade; samples=2; first=https://dmh.mo.gov/dev-disabilities/regional-offices/eligibility
- early_intervention_part_c: missing_reviewed_role_aligned_part_c_source; samples=0
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://dese.mo.gov/special-education
- district_or_county_education_routing: blocked_exact_district_or_county_leafs_unverified; samples=0
- vocational_rehabilitation_pre_ets: missing_reviewed_vr_or_pre_ets_source; samples=0
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.moadvocacy.org/
- parent_training_information_center: blocked_exact_statewide_pti_source_access_blocked; samples=1; first=https://ptimpact.org/
- legal_aid: missing_reviewed_statewide_legal_aid_source; samples=0
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/
- county_local_disability_resources: verified_state_grade; samples=1; first=https://dmh.mo.gov/dev-disabilities/regional-offices

## Next actions

- [critical] early_intervention_part_c: author_or_review_current_official_part_c_source
- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] vocational_rehabilitation_pre_ets: author_or_review_statewide_vr_pre_ets_source
- [major] parent_training_information_center: browser_or_manual_review_on_first_party_pti_domain
- [major] legal_aid: author_or_review_statewide_legal_aid_source

## Missouri truth refresh decision

- Missouri Medicaid state coverage stays verified only after replacing the old mixed-family packet evidence with exact live DSS Healthcare and Medicaid Annual Renewals leaves.
- Missouri DD authority and waiver families stay verified only after replacing the dead dhhs.missouri.gov packet roots and stale hcbs/eligibility path with exact current DMH eligibility, waiver-enrollment, and waiver-program leaves.
- Missouri special-education authority stays verified only after replacing the old generic DESE homepage sample with the exact Office of Special Education leaf.
- Missouri protection and advocacy upgrades to verified statewide evidence because the reviewed first-party Missouri Protection and Advocacy Services artifact explicitly says it is designated by the Governor as the Protection and Advocacy system for Missouri.
- Missouri county-local disability resources upgrade from stale structural evidence because the live DMH regional-office page exposes county-selection and office-routing semantics directly in fetched HTML.
- Missouri early intervention does not upgrade because the old Early Start packet root is dead and the bounded DESE repair pass did not surface a reviewed Part C / First Steps replacement leaf.
- Missouri district-or-county education routing remains blocked because no reviewed district-owned or county-grade special-education leaves replace the generic statewide DESE routing fallback.
- Missouri PTI remains blocked because the exact Missouri Parents Act / MPACT candidate redirected to missouriparentsact.org and returned HTTP 403 in the reviewed low-token fetch lane.
- Missouri VR / Pre-ETS remains missing because the old packet used DD pages for that family and the reviewed DMH Employment Services leaf still does not prove statewide vocational rehabilitation or Pre-ETS routing.
- Missouri legal aid remains missing because no reviewed statewide legal-aid source is present on disk.
- Missouri is therefore truthfully BLOCKED and not index-safe. The statewide packet is now materially cleaner than the old batch-4 claim, but California-grade completion still requires new reviewed early-intervention, district-grade education, PTI-access, VR/Pre-ETS, and legal-aid evidence.
