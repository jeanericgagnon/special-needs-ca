# Maryland California-Grade Audit Report v2

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 24
- primary_gap_reason: all_critical_families_verified_with_reviewed_first_party_or_official_evidence

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_state_grade (The official MSDE Local School Systems page now preserves all 24 Maryland county-equivalent school systems in reviewed first-party HTML, with each row naming the county or Baltimore City system plus superintendent, address, phone, school-year dates, and district website.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (Reviewed Disability Rights Maryland About page explicitly preserves designated Protection & Advocacy language.)
- parent_training_information_center: verified_state_grade (Reviewed Parents’ Place of Maryland About page explicitly preserves PTI designation.)
- legal_aid: verified_state_grade (Reviewed Maryland Legal Aid homepage now provides direct statewide free civil legal services evidence.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_county_grade (The official Maryland DHS Local Offices root now exposes 24 county-equivalent leaf pages, each named for a Maryland county or Baltimore City and carrying county-specific office contact details.)

## Failure ledger

- none

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://dda.health.maryland.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.maryland.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.maryland.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://marylandpublicschools.org/programs/SpecialEducation/
- district_or_county_education_routing: verified_state_grade; samples=24; first=https://marylandpublicschools.org/about/Pages/School-Systems/index.aspx
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://dda.health.maryland.gov
- protection_and_advocacy: verified_state_grade; samples=1; first=https://disabilityrightsmd.org/about/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.ppmd.org/about-us/
- legal_aid: verified_state_grade; samples=1; first=https://www.mdlab.org
- able_program: verified_state_grade; samples=1; first=https://marylandable.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/ssi
- county_local_disability_resources: verified_county_grade; samples=24; first=https://dhs.maryland.gov/local-offices/

## Next actions

- [info] maintenance: Preserve Maryland as COMPLETE/index_safe and rerun only maintenance truth audits unless the MSDE Local School Systems directory regresses.

## Completion decision

- Maryland is now `COMPLETE` and `index_safe=true`.
- County-local disability routing stays repaired because the official Maryland DHS Local Offices root exposes 24 county-equivalent leaf pages and county-specific contact details.
- Education routing is now repaired because the live official MSDE About page links a Local School Systems index that preserves all 24 county-equivalent school-system rows directly in first-party HTML instead of relying on statewide special-education fallback evidence.
