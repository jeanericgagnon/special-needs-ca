# Missouri California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 115
- primary_gap_reason: official_dese_public_directory_postback_reaches_ssrs_shell_but_report_server_returns_404

## Family status

- medicaid_state_health_coverage: verified_state_grade (Reviewed live DSS Healthcare and Medicaid Annual Renewals leaves now provide role-pure statewide Medicaid coverage evidence.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (Reviewed live DMH waiver-enrollment and Home & Community Based Waivers leaves replaced the stale hcbs/eligibility packet path.)
- developmental_disability_idd_authority: verified_state_grade (Reviewed live DMH eligibility and regional-office leaves replaced the dead dhhs.missouri.gov DD packet root.)
- early_intervention_part_c: verified_state_grade (Reviewed live Missouri First Steps leaf now provides role-aligned Part C / early-intervention, referral, and SPOE evidence.)
- special_education_idea_part_b: verified_state_grade (Reviewed live DESE Office of Special Education leaf replaced the old generic dese.mo.gov homepage sample.)
- district_or_county_education_routing: blocked_official_dese_public_report_shell_returns_report_server_404 (Missouri still lacks reviewed district-owned or county-grade education-routing leaves. DESE School Data exposes a real public School Directory bridge, but the exact public-applications replay only reaches an SSRS shell whose rendered non-report content fails with report-server HTTP 404.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed live Missouri VR and Youth Services leaves now provide statewide VR routing plus explicit Pre-ETS evidence.)
- protection_and_advocacy: verified_state_grade (Reviewed first-party Missouri Protection and Advocacy Services evidence explicitly proves the statewide P&A role and help path.)
- parent_training_information_center: verified_state_grade (Reviewed browser-assisted first-party MPACT captures now preserve both statewide contact routing and explicit federally funded PTI designation evidence.)
- legal_aid: verified_state_grade (Reviewed Missouri Legal Services preserves a live first-party statewide legal-aid route on disk.)
- able_program: verified_state_grade (Statewide ABLE crossover evidence remains reviewed and intact.)
- ssi_ssa_federal_reference: verified_state_grade (SSA crossover evidence remains reviewed and intact.)
- county_local_disability_resources: verified_state_grade (Reviewed DMH regional-office map exposes county-selection and office-routing semantics directly in fetched HTML.)

## Failure ledger

- district_or_county_education_routing: official_dese_public_directory_postback_reaches_ssrs_shell_but_report_server_returns_404 :: Missouri district routing still lacks reviewed district-owned or county-grade leaves. The official DESE School Data page exposes real public School Directory links, but the exact WebLogin "View Public Applications" replay only reaches an SSRS shell whose rendered non-report content fails with "The request failed with HTTP status 404: Not Found."

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=2; first=https://mydss.mo.gov/healthcare
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=2; first=https://dmh.mo.gov/dev-disabilities/waiver-enrollment
- developmental_disability_idd_authority: verified_state_grade; samples=2; first=https://dmh.mo.gov/dev-disabilities/regional-offices/eligibility
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dese.mo.gov/childhood/early-intervention/first-steps
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://dese.mo.gov/special-education
- district_or_county_education_routing: blocked_official_dese_public_report_shell_returns_report_server_404; samples=4; first=https://dese.mo.gov/school-data
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=2; first=https://dese.mo.gov/adult-learning-rehabilitation-services/vocational-rehabilitation
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.moadvocacy.org/
- parent_training_information_center: verified_state_grade; samples=2; first=https://www.missouriparentsact.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.lsmo.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/
- county_local_disability_resources: verified_state_grade; samples=1; first=https://dmh.mo.gov/dev-disabilities/regional-offices

## Next actions

- [critical] district_or_county_education_routing: author_missouri_district_owned_special_education_or_student_services_leaves_from_local_district_sites

## Completion decision

- Missouri remains `BLOCKED` and `index_safe=false`.
- PTI is now repaired through exact first-party MPACT browser evidence, including the explicit statement "We have been Missouri’s federally-funded Parent Training and Information Center since 1988."
- Legal aid remains repaired through Missouri Legal Services and must not stay in the blocker summaries.
- Education routing remains the only critical blocker because the exact DESE public School Directory bridge still fails one layer deeper than the login page: the replayed SSRS report shell returns "The request failed with HTTP status 404: Not Found."
- The next honest Missouri lane is district-owned local leaf authoring, not more DESE root probing.

## Missouri truth refresh decision

- Missouri Medicaid state coverage stays verified only after replacing the old mixed-family packet evidence with exact live DSS Healthcare and Medicaid Annual Renewals leaves.
- Missouri DD authority and waiver families stay verified only after replacing the dead dhhs.missouri.gov packet roots and stale hcbs/eligibility path with exact current DMH eligibility, waiver-enrollment, and waiver-program leaves.
- Missouri early intervention upgrades because the reviewed live First Steps leaf now proves Part C, referral, parent information, and System Point of Entry routing from the DESE Office of Childhood.
- Missouri special-education authority stays verified only after replacing the old generic DESE homepage sample with the exact Office of Special Education leaf.
- Missouri vocational rehabilitation / Pre-ETS upgrades because reviewed DESE Vocational Rehabilitation and Youth Services leaves now provide statewide VR routing, office links, and explicit Pre-Employment Transition Services language for students with disabilities.
- Missouri protection and advocacy upgrades to verified statewide evidence because the reviewed first-party Missouri Protection and Advocacy Services artifact explicitly says it is designated by the Governor as the Protection and Advocacy system for Missouri.
- Missouri county-local disability resources stay verified because the live DMH regional-office page exposes county-selection and office-routing semantics directly in fetched HTML.
- Missouri PTI upgrades because browser-assisted exact first-party MPACT review preserved both statewide help routing and explicit federally funded PTI designation evidence, even though the low-token fetch lane still records a Cloudflare 403 challenge shell.
- Missouri legal aid stays verified because Missouri Legal Services already preserves a live first-party statewide legal-aid route on disk.
- Missouri district-or-county education routing remains blocked, but the blocker is now sharper: DESE School Data exposes real public directory links, the public WebLogin bridge reaches a live SSRS shell, and the shell itself fails with report-server HTTP 404 before any county- or district-grade routing data loads.
- Missouri is therefore still truthfully BLOCKED and not index-safe. After this bounded repair pass, district-or-county education routing is the only remaining final blocker.
