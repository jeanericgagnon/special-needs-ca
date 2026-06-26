# South Dakota California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 66
- primary_gap_reason: bounded_2026_06_26_live_recheck_confirms_current_dhs_localoffices_path_now_returns_200_but_still_only_a_page_not_found_shell_without_county_or_local_office_contract

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_state_grade (reviewed official South Dakota DOE district-directory pages now preserve district-grade public routing and a Special Education Director field on live district detail pages)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party Disability Rights South Dakota evidence preserves statewide protection-and-advocacy identity on the live first-party domain)
- parent_training_information_center: verified_state_grade (authoritative Parent Center Hub South Dakota leaf explicitly labels South Dakota Parent Connection as the South Dakota PTI)
- legal_aid: verified_state_grade (reviewed official South Dakota UJS Get Legal Help page now preserves statewide free or low-cost legal-aid routing through SD Law Help)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_localoffices_path_now_200_but_still_page_not_found_shell_and_other_current_dhs_surfaces_statewide_only (Reviewed 2026-06-26 one more bounded live South Dakota DHS county-local pass. The current host family is live, but it still does not expose a county-grade routing contract. `https://dhs.sd.gov/en/localoffices` now returns HTTP 200 instead of the earlier failing route, but the rendered page still carries a page-not-found shell rather than a public local-office directory or county-to-office table. `https://dhs.sd.gov/en/contact-us`, `https://dhs.sd.gov/en/contactus`, `https://dhs.sd.gov/en/staff-directory`, and the DHS root all also return HTTP 200 on the current host family. But the current public surfaces still stop at statewide contact or staff-directory routing rather than any county-keyed local-office contract. The staff directory still includes statewide rows such as Disability Determination Services and Division of Rehabilitation Services, while the localoffices and legacy contactus paths still do not expose county or local-office assignment fields. South Dakota therefore still lacks any reviewable public county-to-office or local service-area contract on the current DHS host.)

## Failure ledger

- county_local_disability_resources: current_dhs_localoffices_path_now_returns_200_shell_but_still_no_public_county_or_local_office_contract :: Reviewed 2026-06-26 one more bounded live South Dakota DHS county-local pass. The current host family is live, but it still does not expose a county-grade routing contract. `https://dhs.sd.gov/en/localoffices` now returns HTTP 200 instead of the earlier failing route, but the rendered page still carries a page-not-found shell rather than a public local-office directory or county-to-office table. `https://dhs.sd.gov/en/contact-us`, `https://dhs.sd.gov/en/contactus`, `https://dhs.sd.gov/en/staff-directory`, and the DHS root all also return HTTP 200 on the current host family. But the current public surfaces still stop at statewide contact or staff-directory routing rather than any county-keyed local-office contract. The staff directory still includes statewide rows such as Disability Determination Services and Division of Rehabilitation Services, while the localoffices and legacy contactus paths still do not expose county or local-office assignment fields. South Dakota therefore still lacks any reviewable public county-to-office or local service-area contract on the current DHS host.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ssa.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://dhs.sd.gov/dd/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.south-dakota.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.south-dakota.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://doe.sd.gov/
- district_or_county_education_routing: verified_state_grade; samples=5; first=https://doe.sd.gov/ofm/edudir.aspx
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://dhs.sd.gov/dd
- protection_and_advocacy: verified_state_grade; samples=1; first=https://drsdlaw.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.parentcenterhub.org/findurcenter/south-dakota/
- legal_aid: verified_state_grade; samples=4; first=https://ujs.sd.gov/self-help/get-legal-help/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_localoffices_path_now_200_but_still_page_not_found_shell_and_other_current_dhs_surfaces_statewide_only; samples=3; first=https://dhs.sd.gov/en/localoffices

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_current_dhs_host_exposes_public_county_to_office_or_local_service_contract

## Completion decision

- South Dakota remains BLOCKED and not index-safe.
- County-local routing is still blocked because the current localoffices path is still not a real local-office contract and the remaining DHS surfaces are still statewide-only or staff-directory-only.
