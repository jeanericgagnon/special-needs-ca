# Rhode Island California-Grade Audit Report v2

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 5
- primary_gap_reason: all_critical_families_verified

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_state_grade (Reviewed 2026-06-26 bounded first-party Rhode Island education surfaces and upgraded the remaining local-routing lane from blocked to verified. The preserved district-specific pages and public LEA detail pages now supply explicit local-routing coverage across all 5 Rhode Island counties. The public RIDE Data Center LEA detail host preserves named local special-education routing contacts on live public LEA pages, including East Providence (`Director of Pupil Personnel Services`, `Assistant Director of Special Education`), Warwick (`Interim Director of Special Education`, multiple `Assistant Director of Special Education` contacts), Rhode Island School for the Deaf (`Special Education Administrator`), and the RI Department of Corrections Education Unit (`Principal/Special Education Director`). The remaining nontraditional public LEAs that did not expose enough role detail on the LEA host now clear through exact first-party leaves on their own hosts: Highlander publishes a live `Special Education` page covering referral, IEP, 504, and procedural safeguards; International Charter publishes a live `Special Education` page with a named `Student Services Director`, special-education team, and 504 contact; and the public Nowell Student & Family Handbook names a `Special Education Administrator` with direct contact information. The residual NCES Code 0 rows without true public-LEA routing contracts are Catholic/private, preschool, higher-education, or out-of-state placement inventory placeholders rather than required Rhode Island public local-routing entities, so they do not block California-grade local education routing.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party Disability Rights Rhode Island evidence preserves explicit federally mandated statewide P&A designation on the live first-party domain)
- parent_training_information_center: verified_state_grade (authoritative Parent Center Hub Rhode Island leaf explicitly labels RIPIN as the Rhode Island PTI and preserves statewide Rhode Island contact routing)
- legal_aid: verified_state_grade (reviewed first-party Help RI Law / Rhode Island Legal Services pages preserve explicit statewide low-income legal-help routing)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_state_grade (reviewed official DHS Office Locator now exposes a public city/town lookup that returns assigned home offices on the official host, supplying explicit local-routing coverage)

## Failure ledger

- none

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://bhddh.ri.gov/developmental-disabilities/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.rhode-island.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.rhode-island.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.ride.ri.gov/StudentsFamilies/SpecialEducation.aspx
- district_or_county_education_routing: verified_state_grade; samples=7; first=https://datacenter.ride.ri.gov/Directory/LEADetail?orgid=57
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://bhddh.ri.gov/developmental-disabilities
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.drri.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.parentcenterhub.org/findurcenter/rhode-island/
- legal_aid: verified_state_grade; samples=1; first=https://www.helprilaw.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_state_grade; samples=5; first=https://dhs.ri.gov/office-locator-tool

## Next actions

- none

## Completion decision

- Rhode Island is now COMPLETE and index-safe.
- `district_or_county_education_routing` clears through a reviewed mix of public RIDE LEA detail pages and exact district-owned / first-party special-education leaves.
- Blank NCES Code 0 inventory rows that only represent Catholic/private, preschool, higher-education, or out-of-state placement placeholders do not count as Rhode Island public LEA routing entities and do not block completion.
