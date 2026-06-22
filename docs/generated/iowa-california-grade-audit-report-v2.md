# Iowa California-Grade Truth Refresh v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 99
- primary_gap_reason: official_iowa_education_pages_loop_only_to_statewide_structure_and_geodata

## Family status

- medicaid_state_health_coverage: verified_state_grade (Live Iowa HHS Medicaid and Apply for Medicaid leaves now replace the stale IME packet samples with real statewide application, eligibility, and appeals routing.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (The live Iowa HHS Home and Community-Based Services page now replaces the dead legacy HCBS eligibility sample.)
- developmental_disability_idd_authority: verified_state_grade (Live Iowa HHS Disability Services now replaces the dead legacy DD packet root with a role-aligned statewide disability-services authority.)
- early_intervention_part_c: verified_state_grade (Live Iowa HHS Early Intervention & Support now replaces the dead legacy early-start packet sample.)
- special_education_idea_part_b: verified_state_grade (Live Iowa Department of Education special-education and dispute-resolution leaves now replace the stale generic home-page packet sample.)
- district_or_county_education_routing: blocked_statewide_structure_dead_end (Reviewed 2026-06-22 current official Iowa Department of Education district-maps, special-education, dispute-resolution, and AEA Performance & Accountability pages. The district-maps surface still resolves only to statewide shapefile and geodata boundary artifacts plus more statewide DOE pages. The AEA page also loops only to statewide DOE structural, budget, CASA, and special-education pages rather than naming concrete AEA-owned routing leaves. No reviewed external AEA domain or district-owned special-education page is exposed from these official statewide surfaces, so they cannot truthfully seed county-grade education routing.)
- vocational_rehabilitation_pre_ets: verified_state_grade (The live Iowa Workforce Development VR page now replaces the stale generic HHS packet sample.)
- protection_and_advocacy: verified_state_grade (Reviewed first-party Disability Rights Iowa evidence now provides the statewide P&A route.)
- parent_training_information_center: verified_state_grade (Reviewed first-party ASK PTIC leaf explicitly preserves Iowa statewide PTI designation, statewide scope, and U.S. Department of Education support.)
- legal_aid: verified_state_grade (Reviewed first-party Iowa Legal Aid evidence now provides the statewide civil legal-aid route.)
- able_program: verified_state_grade (Statewide evidence is present at the required authority level.)
- ssi_ssa_federal_reference: verified_state_grade (Statewide evidence is present at the required authority level.)
- county_local_disability_resources: verified_state_grade (The live Iowa HHS Office Locations page preserves hundreds of county office entries directly in reviewed HTML, so one official leaf now truthfully satisfies statewide county-local routing coverage.)

## Failure ledger

- district_or_county_education_routing: official_iowa_education_pages_loop_only_to_statewide_structure_and_geodata :: Reviewed 2026-06-22 official Iowa district-maps, special-education, dispute-resolution, and AEA Performance & Accountability pages. The district-maps page links statewide map/geodata artifacts such as 2025-26 Iowa Public School District Boundaries and internal DOE pages, while the AEA page links only statewide DOE structural, budget, CASA, and special-education pages. These official statewide surfaces expose no reviewed external AEA domains, no district-owned special-education leaves, and no county-grade routing contracts.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=2; first=https://hhs.iowa.gov/medicaid
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://hhs.iowa.gov/medicaid/services-care/home-and-community-based-services
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://hhs.iowa.gov/family-community/disability-services
- early_intervention_part_c: verified_state_grade; samples=1; first=https://hhs.iowa.gov/programs/programs-and-services/early-intervention-and-support
- special_education_idea_part_b: verified_state_grade; samples=2; first=https://educate.iowa.gov/pk-12/special-education
- district_or_county_education_routing: blocked_statewide_structure_dead_end; samples=4; first=https://educate.iowa.gov/pk-12/special-education
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://workforce.iowa.gov/vr
- protection_and_advocacy: verified_state_grade; samples=1; first=https://disabilityrightsiowa.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.askresource.org/about/what-ASK-does-do/parent-training-and-information-center-ptic
- legal_aid: verified_state_grade; samples=1; first=https://iowalegalaid.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_state_grade; samples=1; first=https://hhs.iowa.gov/hhs-office-locations

## Next actions

- [critical] district_or_county_education_routing: hold_blocked_until_reviewed_district_owned_or_aea_owned_special_education_leaves_are_authored_outside_statewide_structure_pages

## Completion decision

- Iowa remains BLOCKED and not index-safe because district_or_county_education_routing still lacks any reviewed district-owned or county-grade special-education routing leaf on disk.
- The blocker is now sharper: the reviewed official district-maps and AEA pages are statewide structural dead ends that never link out to concrete AEA or district-owned routing leaves.
