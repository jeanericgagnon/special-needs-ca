# Mississippi California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 92
- county_count: 82
- primary_gap_reason: mdek12_local_directory_paths_return_403

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_mdek12_local_directory_paths_return_403 (The likely Mississippi local education directory lanes under mdek12.org return HTTP 403 in bounded low-token fetches, and the packet still falls back to statewide special-education evidence instead of district-owned leaves.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed MDRS first-party routing now preserves live statewide vocational rehabilitation and Pre-Employment Transition Services paths.)
- protection_and_advocacy: verified_state_grade (Reviewed 2026-06-22 the dedicated first-party DRMS about page over the live HTTP endpoint. It explicitly identifies Disability Rights Mississippi as Mississippi’s Protection & Advocacy agency, says it has a federal mandate to protect and advocate for people with disabilities across Mississippi, and explains that every state has a congressionally mandated P&A agency. That is enough to verify protection_and_advocacy at statewide grade.)
- parent_training_information_center: verified_state_grade (reviewed first-party PTI evidence is present at the required authority level)
- legal_aid: verified_state_grade (Reviewed Mississippi Center for Justice preserves a live first-party statewide legal-justice route on disk.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_county_grade (Reviewed 2026-06-22 the official Mississippi DHS contact page. The live page embeds a county-office table directly in HTML with 82 unique Mississippi county names plus office addresses, emails, and client phone numbers, so county_local_disability_resources now passes at county grade from the first-party contact root itself.)

## Failure ledger

- district_or_county_education_routing: mdek12_local_directory_paths_return_403 :: The likely Mississippi local education directory lanes under mdek12.org return HTTP 403 in bounded low-token fetches, and the packet still falls back to statewide special-education evidence instead of district-owned leaves.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.dmh.ms.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.mississippi.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.mississippi.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.mdek12.org/
- district_or_county_education_routing: blocked_mdek12_local_directory_paths_return_403; samples=3; first=https://www.mdek12.org/OSE
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=2; first=https://www.mdrs.ms.gov/vocational-rehabilitation
- protection_and_advocacy: verified_state_grade; samples=2; first=http://www.drms.ms/about
- parent_training_information_center: verified_state_grade; samples=1; first=https://mspti.org
- legal_aid: verified_state_grade; samples=1; first=https://mscenterforjustice.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=3; first=https://www.ablenrc.org
- county_local_disability_resources: verified_county_grade; samples=3; first=https://www.mdhs.ms.gov/contact/

## Next actions

- [critical] district_or_county_education_routing: browser_or_alternate_client_probe_of_mdek12_directory_lanes

## Completion decision

- Protection and advocacy is now repaired through the first-party DRMS about page, which explicitly preserves Mississippi’s Protection & Advocacy designation and federal mandate language.
- County/local disability resources now pass at county grade because the official MDHS contact root itself publishes the statewide county-office table directly in HTML.
- Legal aid remains verified through Mississippi Center for Justice and is no longer carried as a summary-only blocker.
- Mississippi remains `BLOCKED` and `index_safe=false` because district or county education routing still depends on statewide fallback evidence while the likely local MDEK12 directory lanes return HTTP 403 in bounded low-token mode.
