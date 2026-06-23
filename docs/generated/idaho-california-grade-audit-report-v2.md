# Idaho California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 44
- primary_gap_reason: live_official_idaho_directory_pages_exist_but_still_do_not_expose_county_grade_contracts_for_education_or_dhw_office_routing

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_live_official_district_directory_without_county_grade_contract (The official Idaho School Districts directory is live and materially useful for leaf authoring, but it still does not satisfy county-grade routing on its own. A bounded 2026-06-23 HTML and JSON review preserved 116 exact outbound district website links plus only 12 county-bearing district names, while exposing zero explicit county fields and zero special-education or student-services fields on the official directory page itself. The district leaf packet still has 0 authored reviewed local leaves, so Idaho education remains blocked until district-owned special-education or student-services leaves are attached county by county.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (Reviewed Idaho Parents Unlimited About page now preserves explicit Idaho Parent Training and Information Center designation text, while the Connect With Us page preserves statewide contact routing and Boise office details.)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_live_office_directory_without_public_county_contract (The official Idaho DHW office stack is live and materially useful for office-leaf authoring, but it still does not satisfy county-grade office routing on its own. A bounded 2026-06-23 HTML review of https://healthandwelfare.idaho.gov/offices preserved named office entries and exact office leaves, but exposed zero county terms or county-served fields in the public office directory HTML. The current packet still resolves only 17 clean county-to-office leaf matches plus one Canyon split, while 27 counties remain on the dead legacy locator with no public county-to-office contract.)

## Failure ledger

- district_or_county_education_routing: official_district_directory_has_116_links_but_zero_county_or_special_education_fields :: Reviewed 2026-06-23 live official Idaho SDE sources at https://www.sde.idaho.gov/school-districts/ and https://www.sde.idaho.gov/wp-json/wp/v2/pages/9049. The directory and public JSON preserve 116 exact outbound district website links, but only 12 county-bearing district names and no explicit county field, county filter, district special-education contact field, special-education heading, or student-services heading. Idaho therefore still lacks a public county-to-district education-routing contract, and the district leaf packet still has 0 authored reviewed local leaves.
- county_local_disability_resources: official_dhw_office_stack_has_zero_county_fields_and_only_17_clean_leaf_matches :: Reviewed 2026-06-23 live official Idaho DHW sources at https://healthandwelfare.idaho.gov/offices and https://healthandwelfare.idaho.gov/sitemap.xml. The public office directory HTML preserves named office entries such as Caldwell, Boise, Blackfoot, Idaho Falls, and Sandpoint-Ponderay and the sitemap preserves exact office leaves, but the office directory HTML exposes zero county terms or county-served fields. The county-local packet still resolves only 17 clean county-to-office leaf matches plus one Canyon split, while 27 counties remain on the dead legacy locator https://dhhs.idaho.gov/locations with no public county-to-office contract.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://healthandwelfare.idaho.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.idaho.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.idaho.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.sde.idaho.gov/sped/
- district_or_county_education_routing: blocked_live_official_district_directory_without_county_grade_contract; samples=5; first=https://www.sde.idaho.gov/school-districts/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://healthandwelfare.idaho.gov
- protection_and_advocacy: verified_state_grade; samples=1; first=https://disabilityrightsidaho.org/
- parent_training_information_center: verified_state_grade; samples=2; first=https://ipulidaho.org/about_ipul/
- legal_aid: verified_state_grade; samples=1; first=https://disabilityrightsidaho.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_live_office_directory_without_public_county_contract; samples=3; first=https://healthandwelfare.idaho.gov/sitemap.xml

## Next actions

- [critical] district_or_county_education_routing: author_reviewed_district_owned_special_education_or_student_services_leaves_from_existing_idaho_packet
- [critical] county_local_disability_resources: hold_17_clean_office_leaf_matches_and_keep_27_counties_blocked_until_public_county_contract_exists

## Repair decision

- Idaho remains BLOCKED and not index-safe.
- Education stays blocked because the live official SDE directory is only an authoring surface today: it has 116 district links but still no county field and no special-education field on the official directory itself.
- County-local stays blocked because the live official DHW office stack is only a partial authoring surface today: it has exact office leaves, but the public directory still shows zero county-served fields and only 17 clean county matches on disk.
- Future Idaho work should start from the existing district-leaf packet and office-leaf packet rather than rereading statewide Idaho roots.
