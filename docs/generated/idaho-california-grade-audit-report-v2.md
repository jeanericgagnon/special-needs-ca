# Idaho California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 44
- primary_gap_reason: live_db_rows_still_reuse_statewide_placeholders_for_both_local_families

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_no_district_owned_or_county_mapped_leaves (Reviewed live Idaho SDE special-education authority, staff, parent-resources, and Idaho Schools pages plus the current school_district DB inventory. The current official stack preserves statewide authority and staff support, but the live DB rows are still fully statewide placeholders: all 44 Idaho school_district rows reuse statewide SDE URLs instead of district-owned or county-mapped routing leaves. The Idaho Schools page exposes no district entries or county mapping in fetched public content, so district-grade education routing remains blocked.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (Reviewed Idaho Parents Unlimited About page now preserves explicit Idaho Parent Training and Information Center designation text, while the Connect With Us page preserves statewide contact routing and Boise office details.)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_named_office_leaves_only_partial_county_coverage (Reviewed live Idaho DHW Contact Us and /offices pages plus the current county_offices DB inventory. The reviewed official stack now proves that exact DHW office leaves exist, but the live county routing table is still mostly placeholder-backed: 27 rows still use the dead legacy dhhs.idaho.gov/locations storefront root, while the remaining 18 rows still point to the generic Medicaid page https://healthandwelfare.idaho.gov/services-programs/medicaid-health instead of exact office leaves. Because the public /offices page does not expose county-to-office mapping in fetched public content, county-grade local routing remains blocked.)

## Failure ledger

- district_or_county_education_routing: official_sde_special_education_stack_has_no_district_directory_or_local_leaves :: Reviewed 2026-06-22 current official Idaho SDE pages: https://www.sde.idaho.gov/about-us/departments/special-education/, https://www.sde.idaho.gov/about-us/our-staff/special-education/, https://www.sde.idaho.gov/about-us/departments/special-education/parent-resources/, and https://www.sde.idaho.gov/about-us/idaho-schools/, plus the live school_district DB rows. The official SDE stack preserves statewide authority, staff contacts, and parent resources, but the Idaho Schools page exposes no district entries or county mapping in fetched public content. The live DB inventory is still 44/44 statewide placeholders: every Idaho school_district row reuses a statewide SDE URL rather than a district-owned or county-mapped routing leaf.
- county_local_disability_resources: official_dhw_offices_directory_repairs_named_offices_but_27_counties_still_use_storefront_placeholders :: Reviewed 2026-06-22 current official Idaho DHW office routing pages: https://healthandwelfare.idaho.gov/contact-us and https://healthandwelfare.idaho.gov/offices, plus live county_offices DB rows. The exact office stack repairs named office proof for many locations, but the live DB table is still placeholder-backed: 27 county rows use the dead legacy locator https://dhhs.idaho.gov/locations and the other 18 rows still point to the generic Medicaid page https://healthandwelfare.idaho.gov/services-programs/medicaid-health rather than exact office leaves. The public /offices page also exposes no county-to-office mapping in fetched public content, so a truthful county mapping still cannot be verified.

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

- Idaho remains BLOCKED and not index-safe.
- Education is still blocked because all 44 current school_district rows are statewide placeholders and the reviewed Idaho Schools stack exposes no district or county mapping contract.
- County-local is still blocked because 27 current office rows still use the dead legacy locator and the other 18 still point at one generic Medicaid page rather than exact office leaves, while the public offices page exposes no county mapping contract.
