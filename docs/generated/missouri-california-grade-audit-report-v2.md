# Missouri California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 75
- county_count: 115
- primary_gap_reason: district_grade_education_and_statewide_support_gaps_remain_after_live_official_repair

## Family status

- medicaid_state_health_coverage: verified_state_grade (Reviewed live DSS Healthcare and Medicaid Annual Renewals leaves now provide role-pure statewide Medicaid coverage evidence.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (Reviewed live DMH waiver-enrollment and Home & Community Based Waivers leaves replaced the stale hcbs/eligibility packet path.)
- developmental_disability_idd_authority: verified_state_grade (Reviewed live DMH eligibility and regional-office leaves replaced the dead dhhs.missouri.gov DD packet root.)
- early_intervention_part_c: verified_state_grade (Reviewed live Missouri First Steps leaf now provides role-aligned Part C / early-intervention, referral, and SPOE evidence.)
- special_education_idea_part_b: verified_state_grade (Reviewed live DESE Office of Special Education leaf replaced the old generic dese.mo.gov homepage sample.)
- district_or_county_education_routing: blocked_exact_district_or_county_leafs_unverified (Missouri still lacks reviewed district-owned or county-grade special-education leaves; only statewide DESE routing is currently verified.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed live Missouri VR and Youth Services leaves now provide statewide VR routing plus explicit Pre-ETS evidence.)
- protection_and_advocacy: verified_state_grade (Reviewed first-party Missouri Protection and Advocacy Services evidence explicitly proves the statewide P&A role and help path.)
- parent_training_information_center: blocked_exact_statewide_pti_source_access_blocked (The exact Missouri Parents Act / MPACT candidate is known, but the reviewed first-party fetch to missouriparentsact.org is access-blocked.)
- legal_aid: missing_reviewed_statewide_legal_aid_source (No reviewed statewide legal-aid source is present in the current Missouri packet.)
- able_program: verified_state_grade (Statewide ABLE crossover evidence remains reviewed and intact.)
- ssi_ssa_federal_reference: verified_state_grade (SSA crossover evidence remains reviewed and intact.)
- county_local_disability_resources: verified_state_grade (Reviewed DMH regional-office map exposes county-selection and office-routing semantics directly in fetched HTML.)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: Missouri district routing still depends on statewide DESE pages and directory roots; no reviewed district-owned or county-grade special-education leaf is on disk.
- parent_training_information_center: reviewed_exact_statewide_pti_target_access_blocked :: Reviewed 2026-06-20 low-token fetch followed ptimpact.org to missouriparentsact.org and received HTTP 403, so the exact statewide PTI candidate could not be verified from fetched first-party evidence.
- legal_aid: missing_required_source_family :: Missouri still lacks a reviewed statewide legal-aid source on disk.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=2; first=https://mydss.mo.gov/healthcare
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=2; first=https://dmh.mo.gov/dev-disabilities/waiver-enrollment
- developmental_disability_idd_authority: verified_state_grade; samples=2; first=https://dmh.mo.gov/dev-disabilities/regional-offices/eligibility
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dese.mo.gov/childhood/early-intervention/first-steps
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://dese.mo.gov/special-education
- district_or_county_education_routing: blocked_exact_district_or_county_leafs_unverified; samples=0
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=2; first=https://dese.mo.gov/adult-learning-rehabilitation-services/vocational-rehabilitation
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.moadvocacy.org/
- parent_training_information_center: blocked_exact_statewide_pti_source_access_blocked; samples=1; first=https://ptimpact.org/
- legal_aid: missing_reviewed_statewide_legal_aid_source; samples=0
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/
- county_local_disability_resources: verified_state_grade; samples=1; first=https://dmh.mo.gov/dev-disabilities/regional-offices

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] parent_training_information_center: browser_or_manual_review_on_first_party_pti_domain
- [major] legal_aid: author_or_review_statewide_legal_aid_source

## Missouri truth refresh decision

- Missouri Medicaid state coverage stays verified only after replacing the old mixed-family packet evidence with exact live DSS Healthcare and Medicaid Annual Renewals leaves.
- Missouri DD authority and waiver families stay verified only after replacing the dead dhhs.missouri.gov packet roots and stale hcbs/eligibility path with exact current DMH eligibility, waiver-enrollment, and waiver-program leaves.
- Missouri early intervention upgrades because the reviewed live First Steps leaf now proves Part C, referral, parent information, and System Point of Entry routing from the DESE Office of Childhood.
- Missouri special-education authority stays verified only after replacing the old generic DESE homepage sample with the exact Office of Special Education leaf.
- Missouri vocational rehabilitation / Pre-ETS upgrades because reviewed DESE Vocational Rehabilitation and Youth Services leaves now provide statewide VR routing, office links, and explicit Pre-Employment Transition Services language for students with disabilities.
- Missouri protection and advocacy upgrades to verified statewide evidence because the reviewed first-party Missouri Protection and Advocacy Services artifact explicitly says it is designated by the Governor as the Protection and Advocacy system for Missouri.
- Missouri county-local disability resources upgrade from stale structural evidence because the live DMH regional-office page exposes county-selection and office-routing semantics directly in fetched HTML.
- Missouri district-or-county education routing remains blocked because no reviewed district-owned or county-grade special-education leaves replace the generic statewide DESE routing fallback.
- Missouri PTI remains blocked because the exact Missouri Parents Act / MPACT candidate redirected to missouriparentsact.org and returned HTTP 403 in the reviewed low-token fetch lane.
- Missouri legal aid remains missing because no reviewed statewide legal-aid source is present on disk.
- Missouri is therefore still truthfully BLOCKED and not index-safe. The statewide packet now preserves repaired First Steps and VR / Pre-ETS evidence, but California-grade completion still requires district-grade education routing, PTI access, and legal-aid coverage.
