# Mississippi California-Grade Audit Report v2

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 82
- primary_gap_reason: none

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_county_grade (Reviewed 2026-06-23 the live official Mississippi Department of Education District Special Education Contacts leaf. The official page now exposes district-grade routing with named districts, supervisors, addresses, phone/fax numbers, district sites, and contact emails, and the current Mississippi audit already preserves 82 district rows for 82 counties. That direct local routing contract is sufficient to clear district_or_county_education_routing.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed MDRS first-party routing now preserves live statewide vocational rehabilitation and Pre-Employment Transition Services paths.)
- protection_and_advocacy: verified_state_grade (Reviewed 2026-06-22 the dedicated first-party DRMS about page over the live HTTP endpoint. It explicitly identifies Disability Rights Mississippi as Mississippi’s Protection & Advocacy agency, says it has a federal mandate to protect and advocate for people with disabilities across Mississippi, and explains that every state has a congressionally mandated P&A agency. That is enough to verify protection_and_advocacy at statewide grade.)
- parent_training_information_center: verified_state_grade (reviewed first-party PTI evidence is present at the required authority level)
- legal_aid: verified_state_grade (Reviewed Mississippi Center for Justice preserves a live first-party statewide legal-justice route on disk.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_county_grade (Reviewed 2026-06-22 the official Mississippi DHS contact page. The live page embeds a county-office table directly in HTML with 82 unique Mississippi county names plus office addresses, emails, and client phone numbers, so county_local_disability_resources now passes at county grade from the first-party contact root itself.)

## Failure ledger

- none

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.dmh.ms.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.mississippi.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.mississippi.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.mdek12.org/
- district_or_county_education_routing: verified_county_grade; samples=4; first=https://www.mdek12.org/directory/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=2; first=https://www.mdrs.ms.gov/vocational-rehabilitation
- protection_and_advocacy: verified_state_grade; samples=2; first=http://www.drms.ms/about
- parent_training_information_center: verified_state_grade; samples=1; first=https://mspti.org
- legal_aid: verified_state_grade; samples=1; first=https://mscenterforjustice.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=3; first=https://www.ablenrc.org
- county_local_disability_resources: verified_county_grade; samples=3; first=https://www.mdhs.ms.gov/contact/

## Next actions

- [info] maintenance: Preserve Mississippi as COMPLETE/index_safe and rerun only maintenance truth audits unless the official MDEK12 district-contact leaf regresses.

## Completion decision

- Mississippi now reaches California-grade and is index-safe.
- The old MDEK12 host-wide 403 conclusion was stale; the live official district-contacts leaf is publicly reachable and preserves district-grade local routing fields.
- Because the state audit already carries 82 district rows for 82 counties, replacing the old statewide fallback with the official District Special Education Contacts leaf clears the last critical family.
