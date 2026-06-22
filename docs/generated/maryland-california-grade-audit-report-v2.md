# Maryland California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 24
- primary_gap_reason: only_two_maryland_county_district_rows_are_locally_verified_while_the_remaining_county_equivalents_still_depend_on_statewide_special_education_fallbacks

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_twenty_two_county_equivalent_districts_still_on_statewide_fallbacks (Maryland has 24 county-equivalent school systems, but only Montgomery and Prince George's currently have district-owned local routing rows; the remaining 22 still depend on statewide MSDE special-education fallback evidence.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (Reviewed Disability Rights Maryland About page explicitly preserves designated Protection & Advocacy language.)
- parent_training_information_center: verified_state_grade (Reviewed Parents’ Place of Maryland About page explicitly preserves PTI designation.)
- legal_aid: verified_state_grade (Reviewed Maryland Legal Aid homepage now provides direct statewide free civil legal services evidence.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_county_grade (The official Maryland DHS Local Offices root now exposes 24 county-equivalent leaf pages, each named for a Maryland county or Baltimore City and carrying county-specific office contact details.)

## Failure ledger

- district_or_county_education_routing: twenty_two_county_equivalent_districts_still_depend_on_statewide_special_education_fallbacks :: Maryland has 24 county-equivalent school systems, but the current packet still proves only Montgomery and Prince George's with district-owned local rows; the remaining 22 district rows still point to generic statewide MSDE special-education pages rather than county- or district-owned leaves.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://dda.health.maryland.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.maryland.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.maryland.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://marylandpublicschools.org/programs/SpecialEducation/
- district_or_county_education_routing: blocked_twenty_two_county_equivalent_districts_still_on_statewide_fallbacks; samples=3; first=https://marylandpublicschools.org/programs/SpecialEducation/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://dda.health.maryland.gov
- protection_and_advocacy: verified_state_grade; samples=1; first=https://disabilityrightsmd.org/about/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.ppmd.org/about-us/
- legal_aid: verified_state_grade; samples=1; first=https://www.mdlab.org
- able_program: verified_state_grade; samples=1; first=https://marylandable.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/ssi
- county_local_disability_resources: verified_county_grade; samples=24; first=https://dhs.maryland.gov/local-offices/

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets

## Completion decision

- Maryland remains `BLOCKED` and `index_safe=false`.
- County-local disability routing is now repaired: the official Maryland DHS Local Offices root exposes 24 county-equivalent leaf pages and county-specific contact details.
- Education routing remains the only critical blocker because 22 of 24 county-equivalent school-system rows still depend on statewide MSDE special-education fallback evidence instead of district-owned leaves.
