# Mississippi California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 92
- county_count: 82
- primary_gap_reason: mdek12_public_root_and_bounded_directory_guesses_return_uniform_azure_app_gateway_403

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_mdek12_public_host_uniform_403 (The Mississippi education blocker is now sharper: this is not one stale directory URL. The MDEK12 root and every bounded local directory guess tested under the same host return the same short Azure Application Gateway 403 shell in low-token mode, so Mississippi still lacks any reviewed district-directory or district-owned routing contract on the public official host.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed MDRS first-party routing now preserves live statewide vocational rehabilitation and Pre-Employment Transition Services paths.)
- protection_and_advocacy: verified_state_grade (Reviewed 2026-06-22 the dedicated first-party DRMS about page over the live HTTP endpoint. It explicitly identifies Disability Rights Mississippi as Mississippi’s Protection & Advocacy agency, says it has a federal mandate to protect and advocate for people with disabilities across Mississippi, and explains that every state has a congressionally mandated P&A agency. That is enough to verify protection_and_advocacy at statewide grade.)
- parent_training_information_center: verified_state_grade (reviewed first-party PTI evidence is present at the required authority level)
- legal_aid: verified_state_grade (Reviewed Mississippi Center for Justice preserves a live first-party statewide legal-justice route on disk.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_county_grade (Reviewed 2026-06-22 the official Mississippi DHS contact page. The live page embeds a county-office table directly in HTML with 82 unique Mississippi county names plus office addresses, emails, and client phone numbers, so county_local_disability_resources now passes at county grade from the first-party contact root itself.)

## Failure ledger

- district_or_county_education_routing: mdek12_public_host_returns_uniform_azure_app_gateway_403 :: Reviewed 2026-06-23 bounded Mississippi MDEK12 path probes. The public root https://www.mdek12.org/ itself returns the same short HTTP 403 shell as all bounded local-routing guesses, including /OTS/Directory, /School-Directory, /directory, /SchoolDirectory, /districts, /OSE, /Offices/OSE, /MBE/School-and-District-Directory, and /MBE/District-Directory. Every reviewed response preserves the same Microsoft-Azure-Application-Gateway/v2 403 shell rather than district rows, school-search content, or district-owned leaves. Mississippi therefore remains blocked on district_or_county_education_routing because the official MDEK12 public host is host-wide blocked in the current low-token lane, not because one specific directory child path is stale.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.dmh.ms.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.mississippi.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.mississippi.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.mdek12.org/
- district_or_county_education_routing: blocked_mdek12_public_host_uniform_403; samples=3; first=https://www.mdek12.org/OSE
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=2; first=https://www.mdrs.ms.gov/vocational-rehabilitation
- protection_and_advocacy: verified_state_grade; samples=2; first=http://www.drms.ms/about
- parent_training_information_center: verified_state_grade; samples=1; first=https://mspti.org
- legal_aid: verified_state_grade; samples=1; first=https://mscenterforjustice.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=3; first=https://www.ablenrc.org
- county_local_disability_resources: verified_county_grade; samples=3; first=https://www.mdhs.ms.gov/contact/

## Next actions

- [critical] district_or_county_education_routing: browser_or_alternate_client_probe_only_if_mdek12_hostwide_403_can_be_bypassed_without_lowering_standards

## Completion decision

- Protection and advocacy, PTI, legal aid, VR, and county-local routing remain verified from the existing reviewed first-party evidence chain.
- Mississippi remains `BLOCKED` and `index_safe=false` because district or county education routing still has no county- or district-grade official contract on disk, and the official MDEK12 public host now shows a uniform host-wide 403 pattern in the bounded low-token lane.

