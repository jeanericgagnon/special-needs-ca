# Missouri California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 115
- primary_gap_reason: official_dese_district_directory_paths_are_dead_or_login_gated_and_pti_first_party_fetches_remain_access_blocked

## Family status

- medicaid_state_health_coverage: verified_state_grade (Reviewed live DSS Healthcare and Medicaid Annual Renewals leaves now provide role-pure statewide Medicaid coverage evidence.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (Reviewed live DMH waiver-enrollment and Home & Community Based Waivers leaves replaced the stale hcbs/eligibility packet path.)
- developmental_disability_idd_authority: verified_state_grade (Reviewed live DMH eligibility and regional-office leaves replaced the dead dhhs.missouri.gov DD packet root.)
- early_intervention_part_c: verified_state_grade (Reviewed live Missouri First Steps leaf now provides role-aligned Part C / early-intervention, referral, and SPOE evidence.)
- special_education_idea_part_b: verified_state_grade (Reviewed live DESE Office of Special Education leaf replaced the old generic dese.mo.gov homepage sample.)
- district_or_county_education_routing: blocked_official_dese_directory_paths_dead_or_login_gated (Missouri still lacks reviewed district-owned or county-grade special-education leaves; the obvious DESE school-directory paths return 404 and the MCDS district-directory route redirects to a login gate.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed live Missouri VR and Youth Services leaves now provide statewide VR routing plus explicit Pre-ETS evidence.)
- protection_and_advocacy: verified_state_grade (Reviewed first-party Missouri Protection and Advocacy Services evidence explicitly proves the statewide P&A role and help path.)
- parent_training_information_center: blocked_exact_statewide_pti_sources_access_blocked_or_tls_failed (The exact Missouri Parents Act / MPACT candidates are known, but reviewed low-token fetches still fail: missouriparentsact.org returns 403 and ptimpact.org fails TLS protocol negotiation.)
- legal_aid: verified_state_grade (Reviewed Missouri Legal Services preserves a live first-party statewide legal-aid route on disk.)
- able_program: verified_state_grade (Statewide ABLE crossover evidence remains reviewed and intact.)
- ssi_ssa_federal_reference: verified_state_grade (SSA crossover evidence remains reviewed and intact.)
- county_local_disability_resources: verified_state_grade (Reviewed DMH regional-office map exposes county-selection and office-routing semantics directly in fetched HTML.)

## Failure ledger

- district_or_county_education_routing: official_dese_district_directory_paths_are_dead_or_login_gated :: Missouri district routing still depends on statewide DESE pages; the obvious DESE school-directory paths return 404 and the MCDS district directory route redirects to a login gate instead of a public district-owned or county-grade special-education leaf.
- parent_training_information_center: reviewed_exact_statewide_pti_targets_fail_with_403_and_tls_protocol_error :: Reviewed low-token PTI fetches still fail: missouriparentsact.org returns HTTP 403 and ptimpact.org fails TLS protocol negotiation before first-party PTI evidence can be preserved.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=2; first=https://mydss.mo.gov/healthcare
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=2; first=https://dmh.mo.gov/dev-disabilities/waiver-enrollment
- developmental_disability_idd_authority: verified_state_grade; samples=2; first=https://dmh.mo.gov/dev-disabilities/regional-offices/eligibility
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dese.mo.gov/childhood/early-intervention/first-steps
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://dese.mo.gov/special-education
- district_or_county_education_routing: blocked_official_dese_directory_paths_dead_or_login_gated; samples=3; first=https://dese.mo.gov/directories
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=2; first=https://dss.mo.gov/dvr
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.moadvocacy.org/
- parent_training_information_center: blocked_exact_statewide_pti_sources_access_blocked_or_tls_failed; samples=2; first=https://www.missouriparentsact.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.lsmo.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/ssi
- county_local_disability_resources: verified_state_grade; samples=1; first=https://dmh.mo.gov/dev-disabilities/regional-offices

## Next actions

- [critical] district_or_county_education_routing: browser_or_alternate_client_probe_of_dese_district_directory_contract
- [major] parent_training_information_center: browser_or_manual_review_on_first_party_pti_domain

## Completion decision

- Missouri remains `BLOCKED` and `index_safe=false`.
- Legal aid is now repaired through Missouri Legal Services.
- Education routing remains the only critical blocker because the likely official public directory lanes are either dead or login-gated.
- PTI remains blocked because the known first-party domains still fail in bounded low-token mode.
