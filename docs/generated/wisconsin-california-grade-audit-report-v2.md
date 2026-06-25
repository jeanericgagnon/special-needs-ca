# Wisconsin California-Grade Audit Report v2

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 72
- primary_gap_reason: all_critical_families_verified_with_reviewed_first_party_or_official_evidence

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (Reviewed 2026-06-25 the official Wisconsin DHS `Services for People with Developmental/Intellectual Disabilities` page and the official `Services for Children with Delays or Disabilities` page. The DHS disabilities page says adults with developmental and intellectual disabilities should reach out to their local ADRC and links adult disability programs, while the children page lists Birth to 3, the Children's Long-Term Support Program, Katie Beckett Medicaid, and CCOP as programs for children with delays or disabilities. This supplies current official DHS developmental-disability authority and family-routing evidence.)
- early_intervention_part_c: verified_state_grade (Reviewed 2026-06-25 the official Wisconsin DHS `Birth to 3 Program` page. The page states that the Wisconsin Birth to 3 Program is an early intervention special education program for children under age 3 with delays or disabilities, says the program is required under Part C of IDEA, and provides a `Birth to 3 Program contacts` button under `Find your local Birth to 3 Program`. This supplies current official Part C authority and state-to-local routing evidence.)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_state_grade (Reviewed 2026-06-25 the live official Wisconsin School Directory public portal on the DPI host. The public `School Districts` page tells families to use one or more filters to search school districts, exposes official `CESA` and `County` filter buttons, and renders a statewide district table whose header includes `CESA` and `County/Locale`. Reviewed public rows include `Abbotsford (0007)` with `CESA 10` and `Clark`, and `Adams-Friendship Area (0014)` with `CESA 5` and `Adams`, while the page footer shows `1-5 of 488 items`. A reviewed district-profile leaf such as Abbotsford further preserves `County | CESA` as `Clark County | CESA 10`. This supplies a reviewable official statewide district-to-county-to-CESA routing contract on the DPI host.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed 2026-06-25 the official Wisconsin DWD DVR home page and the official `Transition Services` page. The DVR home page says DVR helps people with disabilities find, keep, or improve a job and links `Education & Transition Services`. The reviewed transition page says DVR works with high school students transitioning to post-secondary education and employment, links a `Policy Guide for Pre-Employment Transition Services`, and publishes `DVR's Liaisons to Wisconsin Schools` plus university and technical-college liaison lists. This replaces Wisconsin's stale statewide VR placeholder with current official DWD DVR and transition-routing evidence.)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (Reviewed 2026-06-25 live first-party WI FACETS pages. The current staff page says Nelsinia Ramos is `Co-Director of the Wisconsin Parent Training and Information Center, which the U.S. Department of Education funds`, and says Courtney Salzer is `Co-Director of the OSEP-funded Wisconsin Parent Training and Information Center (PTI)`. The live statewide projects page states `Parent Training and Information Center (PTIC)` and says WI FACETS has been funded by the U.S. Department of Education since 2001 to support families and others with training, information, and support related to children with disabilities and IDEA. This now supplies direct first-party PTI designation evidence for Wisconsin.)
- legal_aid: verified_state_grade (Reviewed 2026-06-25 live first-party Legal Action Wisconsin pages. The homepage preserves an `Apply for FREE legal help` route, statewide service categories including housing, employment, debt and taxes, public benefits, family law, and victim support, and a current news item titled `Legal Action of Wisconsin and Judicare Legal Aid Merge, Creating Wisconsin's Largest Statewide Civil Legal...`. The about page also states the website was made possible by generous support of the Legal Services Corporation. Together these live first-party artifacts supply current statewide legal-aid evidence for Wisconsin.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_state_grade (Reviewed 2026-06-25 the live official Wisconsin DHS ADRC contact directory. The page says `Call or visit your local ADRC in person`, lets families `Find your local ADRC or Tribal ADRS`, and publicly preserves contact cards with explicit `Service area` fields. Reviewed examples include `ADRC of Adams County` with `Service area Adams County`, `ADRC of Clark County` with `Service area Clark County`, and Tribal ADRS entries for Wisconsin Tribal nations. This replaces Wisconsin's old DOI-derived county-office evidence with a current first-party statewide county-local disability routing directory on the DHS host.)

## Failure ledger

- none

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ssa.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.dhs.wisconsin.gov/familycare/eligibility.htm
- developmental_disability_idd_authority: verified_state_grade; samples=3; first=https://www.dhs.wisconsin.gov/disabilities/index.htm
- early_intervention_part_c: verified_state_grade; samples=3; first=https://www.dhs.wisconsin.gov/birthto3/index.htm
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://dpi.wi.gov/
- district_or_county_education_routing: verified_state_grade; samples=4; first=https://dpi.wi.gov/schooldirectory
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=4; first=https://dwd.wisconsin.gov/dvr/
- protection_and_advocacy: verified_state_grade; samples=1; first=https://disabilityrightswi.org/
- parent_training_information_center: verified_state_grade; samples=3; first=https://wifacets.org/projects/statewide/
- legal_aid: verified_state_grade; samples=3; first=https://legalaction.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_state_grade; samples=4; first=https://www.dhs.wisconsin.gov/adrc/contacts.htm

## Next actions

- none

## Completion decision

- Wisconsin is now `COMPLETE` and `index_safe=true`.
- `district_or_county_education_routing` now clears because DPI's public School Directory preserves `CESA` and `County/Locale` fields in a statewide district table and repeats the contract on district-profile leaves such as Abbotsford.
- `developmental_disability_idd_authority` is now anchored to current Wisconsin DHS developmental-disability and children's-services pages rather than a stale placeholder URL.
- `early_intervention_part_c` is now anchored to the official Wisconsin Birth to 3 page and its local contacts path.
- `vocational_rehabilitation_pre_ets` is now anchored to the official Wisconsin DWD DVR and Transition Services pages, including school liaison and Pre-ETS guidance links.
