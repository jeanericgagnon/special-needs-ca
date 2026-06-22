# Iowa California-Grade Truth Refresh v2

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 99
- primary_gap_reason: none

## Family status

- medicaid_state_health_coverage: verified_state_grade (Live Iowa HHS Medicaid and Apply for Medicaid leaves now replace the stale IME packet samples with real statewide application, eligibility, and appeals routing.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (The live Iowa HHS Home and Community-Based Services page now replaces the dead legacy HCBS eligibility sample.)
- developmental_disability_idd_authority: verified_state_grade (Live Iowa HHS Disability Services now replaces the dead legacy DD packet root with a role-aligned statewide disability-services authority.)
- early_intervention_part_c: verified_state_grade (Live Iowa HHS Early Intervention & Support now replaces the dead legacy early-start packet sample.)
- special_education_idea_part_b: verified_state_grade (Live Iowa Department of Education special-education and dispute-resolution leaves now replace the stale generic home-page packet sample.)
- district_or_county_education_routing: verified_county_grade (Reviewed 2026-06-22 the live official Iowa DOE district directory and superintendent files. The 2025-26 Iowa Public School District Directory explicitly assigns districts to counties and preserves 325 district rows spanning all 99 Iowa counties, with County Name, AEA Name, District Name, Administrator Name, Phone, Email, and Website fields present. That official county-mapped district-routing directory is enough to verify district_or_county_education_routing at county grade.)
- vocational_rehabilitation_pre_ets: verified_state_grade (The live Iowa Workforce Development VR page now replaces the stale generic HHS packet sample.)
- protection_and_advocacy: verified_state_grade (Reviewed first-party Disability Rights Iowa evidence now provides the statewide P&A route.)
- parent_training_information_center: verified_state_grade (Reviewed first-party ASK PTIC leaf explicitly preserves Iowa statewide PTI designation, statewide scope, and U.S. Department of Education support.)
- legal_aid: verified_state_grade (Reviewed first-party Iowa Legal Aid evidence now provides the statewide civil legal-aid route.)
- able_program: verified_state_grade (Statewide evidence is present at the required authority level.)
- ssi_ssa_federal_reference: verified_state_grade (Statewide evidence is present at the required authority level.)
- county_local_disability_resources: verified_state_grade (The live Iowa HHS Office Locations page preserves hundreds of county office entries directly in reviewed HTML, so one official leaf now truthfully satisfies statewide county-local routing coverage.)

## Failure ledger

- none

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=2; first=https://hhs.iowa.gov/medicaid
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://hhs.iowa.gov/medicaid/services-care/home-and-community-based-services
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://hhs.iowa.gov/family-community/disability-services
- early_intervention_part_c: verified_state_grade; samples=1; first=https://hhs.iowa.gov/programs/programs-and-services/early-intervention-and-support
- special_education_idea_part_b: verified_state_grade; samples=2; first=https://educate.iowa.gov/pk-12/special-education
- district_or_county_education_routing: verified_county_grade; samples=3; first=https://educate.iowa.gov/media/11655/download?inline
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://workforce.iowa.gov/vr
- protection_and_advocacy: verified_state_grade; samples=1; first=https://disabilityrightsiowa.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.askresource.org/about/what-ASK-does-do/parent-training-and-information-center-ptic
- legal_aid: verified_state_grade; samples=1; first=https://iowalegalaid.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_state_grade; samples=1; first=https://hhs.iowa.gov/hhs-office-locations

## Next actions

- [info] maintenance: Preserve Iowa as COMPLETE/index_safe and rerun only maintenance truth audits unless new evidence regresses.

## Completion decision

- Iowa now reaches California-grade and is index-safe.
- The live official Iowa DOE district directory is a real county-mapped routing source, not a statewide structural dead end.
- Because all 99 counties are covered by official district rows with county, AEA, district, phone, email, and website fields, the last education blocker is cleared.
