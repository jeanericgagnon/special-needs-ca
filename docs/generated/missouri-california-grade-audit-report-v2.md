# Missouri California-Grade Audit Report v2

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 115
- primary_gap_reason: none

## Family status

- medicaid_state_health_coverage: verified_state_grade (Reviewed live DSS Healthcare and Medicaid Annual Renewals leaves now provide role-pure statewide Medicaid coverage evidence.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (Reviewed live DMH waiver-enrollment and Home & Community Based Waivers leaves replaced the stale hcbs/eligibility packet path.)
- developmental_disability_idd_authority: verified_state_grade (Reviewed live DMH eligibility and regional-office leaves replaced the dead dhhs.missouri.gov DD packet root.)
- early_intervention_part_c: verified_state_grade (Reviewed live Missouri First Steps leaf now provides role-aligned Part C / early-intervention, referral, and SPOE evidence.)
- special_education_idea_part_b: verified_state_grade (Reviewed live DESE Office of Special Education leaf replaced the old generic dese.mo.gov homepage sample.)
- district_or_county_education_routing: verified_county_grade (Reviewed 2026-06-23 the live official Missouri DESE School Directory page plus its public ArcGIS district layer. The official district layer returns county-mapped district rows with DIST_NAME, COUNTY, DIST_CODE, address, phone, district email, and URL fields, and a bounded distinct-value query covers all 115 Missouri counties. That county-grade official local-routing contract clears district_or_county_education_routing.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed live Missouri VR and Youth Services leaves now provide statewide VR routing plus explicit Pre-ETS evidence.)
- protection_and_advocacy: verified_state_grade (Reviewed first-party Missouri Protection and Advocacy Services evidence explicitly proves the statewide P&A role and help path.)
- parent_training_information_center: verified_state_grade (Reviewed browser-assisted first-party MPACT captures now preserve both statewide contact routing and explicit federally funded PTI designation evidence.)
- legal_aid: verified_state_grade (Reviewed Missouri Legal Services preserves a live first-party statewide legal-aid route on disk.)
- able_program: verified_state_grade (Statewide ABLE crossover evidence remains reviewed and intact.)
- ssi_ssa_federal_reference: verified_state_grade (SSA crossover evidence remains reviewed and intact.)
- county_local_disability_resources: verified_state_grade (Reviewed DMH regional-office map exposes county-selection and office-routing semantics directly in fetched HTML.)

## Failure ledger

- none

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=2; first=https://mydss.mo.gov/healthcare
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=2; first=https://dmh.mo.gov/dev-disabilities/waiver-enrollment
- developmental_disability_idd_authority: verified_state_grade; samples=2; first=https://dmh.mo.gov/dev-disabilities/regional-offices/eligibility
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dese.mo.gov/childhood/early-intervention/first-steps
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://dese.mo.gov/special-education
- district_or_county_education_routing: verified_county_grade; samples=5; first=https://dese.mo.gov/data-system-management/directory
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=2; first=https://dese.mo.gov/adult-learning-rehabilitation-services/vocational-rehabilitation
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.moadvocacy.org/
- parent_training_information_center: verified_state_grade; samples=2; first=https://www.missouriparentsact.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.lsmo.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/
- county_local_disability_resources: verified_state_grade; samples=1; first=https://dmh.mo.gov/dev-disabilities/regional-offices

## Next actions

- [info] maintenance: Preserve Missouri as COMPLETE/index_safe and rerun only maintenance truth audits unless the DESE School Directory page or ArcGIS district layer regresses.

## Completion decision

- Missouri now reaches California-grade and is index-safe.
- The old DESE SSRS/report-shell blocker was stale because the live School Directory page now exposes a public ArcGIS district layer and direct county/district directory downloads.
- The official district layer returns county-mapped district rows with contact and website fields across all 115 Missouri counties, so the last district-or-county education routing blocker is cleared.
