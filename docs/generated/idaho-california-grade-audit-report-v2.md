# Idaho California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 44
- primary_gap_reason: official_sde_special_education_stack_has_no_district_directory_or_local_leaves

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_no_district_owned_or_county_mapped_leaves (Reviewed live Idaho SDE special-education authority, staff, parent-resources, and Idaho Schools pages. The current official stack preserves statewide authority and staff support, but the Idaho Schools page exposes no district entries and all 44 current district rows still reuse statewide SDE URLs instead of district-owned or county-mapped routing leaves.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (Reviewed Idaho Parents Unlimited About page now preserves explicit Idaho Parent Training and Information Center designation text, while the Connect With Us page preserves statewide contact routing and Boise office details.)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_named_office_leaves_only_partial_county_coverage (Reviewed live Idaho DHW Contact Us and /offices pages plus sitemap office leaves. The exact official directory now preserves named office pages such as Boise, Caldwell, Burley, Blackfoot, Idaho Falls, Sandpoint-Ponderay, and Lewiston, but current county routing still splits into 18 named-office rows and 27 storefront placeholders with no reviewed county-to-office mapping for the placeholder counties.)

## Failure ledger

- district_or_county_education_routing: official_sde_special_education_stack_has_no_district_directory_or_local_leaves :: Reviewed 2026-06-22 current official Idaho SDE pages: https://www.sde.idaho.gov/about-us/departments/special-education/, https://www.sde.idaho.gov/about-us/our-staff/special-education/, https://www.sde.idaho.gov/about-us/departments/special-education/parent-resources/, and https://www.sde.idaho.gov/about-us/idaho-schools/. These leaves preserve statewide authority, staff contacts, and parent resources, but the Idaho Schools page exposes no district entries or county mapping and current DB rows still use statewide SDE URLs for all 44 counties.
- county_local_disability_resources: official_dhw_offices_directory_repairs_named_offices_but_27_counties_still_use_storefront_placeholders :: Reviewed 2026-06-22 current official Idaho DHW office routing pages: https://healthandwelfare.idaho.gov/contact-us and https://healthandwelfare.idaho.gov/offices, plus DHW sitemap office leaves such as Boise, Caldwell, Pocatello, Idaho Falls, Rexburg, Mountain Home, Grangeville, Moscow, Lewiston, and Sandpoint-Ponderay. This exact office stack repairs named office proof for many rows, but current county routing still includes 27 storefront placeholders with no reviewed county-to-office coverage.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://healthandwelfare.idaho.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.idaho.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.idaho.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.sde.idaho.gov/sped/
- district_or_county_education_routing: blocked_no_district_owned_or_county_mapped_leaves; samples=3; first=https://www.sde.idaho.gov/about-us/idaho-schools/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://healthandwelfare.idaho.gov
- protection_and_advocacy: verified_state_grade; samples=1; first=https://disabilityrightsidaho.org/
- parent_training_information_center: verified_state_grade; samples=2; first=https://ipulidaho.org/about_ipul/
- legal_aid: verified_state_grade; samples=1; first=https://disabilityrightsidaho.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_named_office_leaves_only_partial_county_coverage; samples=3; first=https://healthandwelfare.idaho.gov/offices

## Next actions

- [critical] district_or_county_education_routing: hold_blocked_until_reviewed_district_owned_or_state_directory_county_mapping_leaves_exist
- [critical] county_local_disability_resources: author_exact_office_leaf_mappings_or_hold_counties_blocked

## Completion decision

- Idaho Parents Unlimited now clears the PTI family because the reviewed first-party About page explicitly says the organization houses the Idaho Parent Training and Information Center, and the Connect With Us page preserves current statewide contact routing.
- Idaho still cannot reach California-grade or become index-safe because district-or-county education routing remains statewide-only: the official SDE special-education, staff, parent-resources, and Idaho Schools pages preserve statewide authority and contacts, but not district-owned or county-mapped routing leaves.
- County/local disability resources are sharper but still blocked: Idaho DHW now exposes an exact /offices directory and sitemap-backed office leaves for named offices, but the state packet still contains 27 storefront placeholders without reviewed county-to-office coverage.
- Idaho therefore remains BLOCKED and not index-safe until district-routing and county-local families move from statewide or placeholder evidence to reviewed local routing proof.
