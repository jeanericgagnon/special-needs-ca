# Mississippi California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 75
- county_count: 82
- primary_gap_reason: mdek12_local_directory_lanes_return_403_and_mdhs_county_office_paths_are_missing_or_unpublished

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_mdek12_local_directory_paths_return_403 (The likely Mississippi local education directory lanes under mdek12.org return HTTP 403 in bounded low-token fetches, and the packet still falls back to statewide special-education evidence instead of district-owned leaves.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed MDRS first-party routing now preserves live statewide vocational rehabilitation and Pre-Employment Transition Services paths.)
- protection_and_advocacy: blocked_likely_p_and_a_domain_tls_failure (The likely first-party Mississippi Protection and Advocacy domain drms.ms failed TLS handshake in bounded fetch mode, so explicit statewide P&A evidence is still unproven on disk.)
- parent_training_information_center: verified_state_grade (reviewed first-party PTI evidence is present at the required authority level)
- legal_aid: verified_state_grade (Reviewed Mississippi Center for Justice preserves a live first-party statewide legal-justice route on disk.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_mdhs_contact_root_live_but_county_office_paths_missing (The Mississippi DHS contact root is live, but the likely county-office location paths tested so far return 404 and do not expose a county-grade local office contract in bounded low-token mode.)

## Failure ledger

- district_or_county_education_routing: mdek12_local_directory_paths_return_403 :: The likely Mississippi local education directory lanes under mdek12.org return HTTP 403 in bounded low-token fetches, and the packet still falls back to statewide special-education evidence instead of district-owned leaves.
- protection_and_advocacy: likely_p_and_a_domain_drms_ms_fails_tls_handshake_in_bounded_fetch :: The likely first-party Mississippi Protection and Advocacy domain drms.ms failed TLS handshake in bounded fetch mode, so explicit statewide P&A evidence is still unproven on disk.
- county_local_disability_resources: mdhs_contact_root_is_live_but_county_office_location_paths_are_missing_or_unpublished :: The Mississippi DHS contact root is live, but the likely county-office location paths tested so far return 404 and do not expose a county-grade local office contract in bounded low-token mode.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.dmh.ms.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.mississippi.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.mississippi.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.mdek12.org/
- district_or_county_education_routing: blocked_mdek12_local_directory_paths_return_403; samples=3; first=https://www.mdek12.org/OSE
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=2; first=https://www.mdrs.ms.gov/vocational-rehabilitation
- protection_and_advocacy: blocked_likely_p_and_a_domain_tls_failure; samples=1; first=https://www.drms.ms/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.mspti.org/
- legal_aid: verified_state_grade; samples=1; first=https://mscenterforjustice.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/ssi
- county_local_disability_resources: blocked_mdhs_contact_root_live_but_county_office_paths_missing; samples=3; first=https://www.mdhs.ms.gov/contact/

## Next actions

- [critical] district_or_county_education_routing: browser_or_alternate_client_probe_of_mdek12_directory_lanes
- [major] protection_and_advocacy: browser_or_alternate_client_probe_of_drms_ms
- [critical] county_local_disability_resources: find_live_mdhs_county_office_directory_or_browser_capture

## Completion decision

- Mississippi remains `BLOCKED` and `index_safe=false`.
- Vocational rehabilitation / Pre-ETS is now repaired through live MDRS first-party routing.
- Legal aid is now repaired through Mississippi Center for Justice.
- Education routing remains blocked because the likely MDEK12 local directory lanes return HTTP 403 in bounded low-token mode.
- Protection and advocacy remains blocked because the likely first-party domain drms.ms fails TLS handshake in bounded fetch mode.
- County/local disability resources remain blocked because MDHS contact is live but the likely county-office paths tested so far are 404 or unpublished.
