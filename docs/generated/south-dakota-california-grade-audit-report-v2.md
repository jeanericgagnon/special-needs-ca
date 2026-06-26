# South Dakota California-Grade Batch 84 Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 66
- primary_gap_reason: current_dhs_host_exposes_no_public_county_or_local_office_contract_for_south_dakota_county_local_disability_routing

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
- county_local_disability_resources: blocked_current_dhs_host_without_public_county_or_local_office_contract (Reviewed 2026-06-25 and rechecked 2026-06-25 bounded first-party South Dakota DHS surfaces. The current `/en/localoffices` route still serves a JS shell in raw HTML and the embedded application payload resolves the `localoffices` entry to `title":"Page Not Found"` on a page-not-found content record instead of a public local-office directory. The current `Contact Us` page also serves through the same client-rendered shell, but its embedded payload only exposes statewide phone, email, and Pierre mailing contacts. A fresh raw recheck of `Staff and Program Directory` returned HTTP 502 `Bad Gateway`, and the saved reviewed evidence for that route still exposes only division/program staff tables rather than county or local-office assignments. South Dakota therefore still lacks a truthful public county-grade local-office routing contract on the current official DHS host family.)

## Failure ledger

- county_local_disability_resources: current_dhs_host_exposes_page_not_found_localoffices_route_and_statewide_contact_surfaces_only :: Reviewed 2026-06-25 and rechecked 2026-06-25 bounded first-party South Dakota DHS surfaces. The current `/en/localoffices` route still serves a JS shell in raw HTML and the embedded application payload resolves the `localoffices` entry to `title":"Page Not Found"` on a page-not-found content record instead of a public local-office directory. The current `Contact Us` page also serves through the same client-rendered shell, but its embedded payload only exposes statewide phone, email, and Pierre mailing contacts. A fresh raw recheck of `Staff and Program Directory` returned HTTP 502 `Bad Gateway`, and the saved reviewed evidence for that route still exposes only division/program staff tables rather than county or local-office assignments. South Dakota therefore still lacks a truthful public county-grade local-office routing contract on the current official DHS host family.

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
- county_local_disability_resources: blocked_current_dhs_host_without_public_county_or_local_office_contract; samples=3; first=https://dhs.sd.gov/en/localoffices

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_current_dhs_host_exposes_public_county_to_office_or_local_service_contract

## Completion decision

- South Dakota remains `BLOCKED` and `index_safe=false`.
- `district_or_county_education_routing` is now cleared with official DOE district-directory pages that publish district contacts and a `Special Education Director` field on the public host.
- `legal_aid` is now cleared with the official South Dakota UJS `Get Legal Help` page and its statewide SD Law Help routing references.
- `county_local_disability_resources` is the sole remaining critical blocker because the current DHS host still exposes no public county or local-office contract.
