# Iowa California-Grade Truth Refresh v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 99
- primary_gap_reason: district_grade_education_still_unverified

## Family status

- medicaid_state_health_coverage: verified_state_grade (Live Iowa HHS Medicaid and Apply for Medicaid leaves now replace the stale IME packet samples with real statewide application, eligibility, and appeals routing.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (The live Iowa HHS Home and Community-Based Services page now replaces the dead legacy HCBS eligibility sample.)
- developmental_disability_idd_authority: verified_state_grade (Live Iowa HHS Disability Services now replaces the dead legacy DD packet root with a role-aligned statewide disability-services authority.)
- early_intervention_part_c: verified_state_grade (Live Iowa HHS Early Intervention & Support now replaces the dead legacy early-start packet sample.)
- special_education_idea_part_b: verified_state_grade (Live Iowa Department of Education special-education and dispute-resolution leaves now replace the stale generic home-page packet sample.)
- district_or_county_education_routing: blocked_exact_district_or_county_leafs_unverified (Reviewed Iowa education pages expose school-district maps and AEA structural materials, but no district-owned or county-grade special-education routing leaf is preserved on disk.)
- vocational_rehabilitation_pre_ets: verified_state_grade (The live Iowa Workforce Development VR page now replaces the stale generic HHS packet sample.)
- protection_and_advocacy: verified_state_grade (Reviewed first-party Disability Rights Iowa evidence now provides the statewide P&A route.)
- parent_training_information_center: verified_state_grade (Reviewed first-party ASK PTIC leaf explicitly preserves Iowa statewide PTI designation, statewide scope, and U.S. Department of Education support.)
- legal_aid: verified_state_grade (Reviewed first-party Iowa Legal Aid evidence now provides the statewide civil legal-aid route.)
- able_program: verified_state_grade (Statewide evidence is present at the required authority level.)
- ssi_ssa_federal_reference: verified_state_grade (Statewide evidence is present at the required authority level.)
- county_local_disability_resources: verified_state_grade (The live Iowa HHS Office Locations page preserves hundreds of county office entries directly in reviewed HTML, so one official leaf now truthfully satisfies statewide county-local routing coverage.)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: Reviewed Iowa special-education, dispute-resolution, district-maps, and AEA pages are statewide or structural only; no district-owned or county-grade special-education routing leaf is preserved on disk.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=2; first=https://hhs.iowa.gov/medicaid
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://hhs.iowa.gov/medicaid/services-care/home-and-community-based-services
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://hhs.iowa.gov/family-community/disability-services
- early_intervention_part_c: verified_state_grade; samples=1; first=https://hhs.iowa.gov/programs/programs-and-services/early-intervention-and-support
- special_education_idea_part_b: verified_state_grade; samples=2; first=https://educate.iowa.gov/pk-12/special-education
- district_or_county_education_routing: blocked_exact_district_or_county_leafs_unverified; samples=4; first=https://educate.iowa.gov/pk-12/special-education
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://workforce.iowa.gov/vr
- protection_and_advocacy: verified_state_grade; samples=1; first=https://disabilityrightsiowa.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.askresource.org/about/what-ASK-does-do/parent-training-and-information-center-ptic
- legal_aid: verified_state_grade; samples=1; first=https://iowalegalaid.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_state_grade; samples=1; first=https://hhs.iowa.gov/hhs-office-locations

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets

## Completion decision

- Iowa is no longer UNSTARTED. The statewide packet has been truth-refreshed onto live replatformed Iowa HHS and Education leaves plus reviewed first-party statewide support evidence.
- County-local upgrade: the reviewed Iowa HHS Office Locations page itself preserves structured county coverage directly in HTML, including county office entries like Adair County HHS, Adams County HHS, and Polk County HHS, so one official leaf now truthfully satisfies statewide county-local routing coverage.
- VR upgrade: the legacy `ivrs.iowa.gov` root now redirects to the live Iowa Workforce Development page `workforce.iowa.gov/vr`, which explicitly provides Vocational Rehabilitation Services.
- PTI upgrade: the first-party ASK PTIC leaf now explicitly states that ASK Resource Center has been Iowa’s PTIC since 1998, that Iowa has only one PTI, and that it operates statewide with U.S. Department of Education support.
- Iowa remains BLOCKED and not index-safe because district_or_county_education_routing still lacks any reviewed district-owned or county-grade special-education routing leaf on disk.
