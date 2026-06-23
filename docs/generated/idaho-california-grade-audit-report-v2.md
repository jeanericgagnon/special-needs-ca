# Idaho California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 44
- primary_gap_reason: reviewed_idaho_district_leaves_exist_but_county_grade_education_and_dhw_mapping_remain_incomplete

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_reviewed_local_district_leaves_exist_but_not_statewide_county_grade (The Idaho education blocker is now an exact reviewed-leaf expansion lane, not just a root packet. Official district-owned local leaves are already reviewable on the public web for five counties: Cassia County School District Special Services, Payette Joint District Special Services, Pocatello-Chubbuck School District 25 Special Services, Boundary County School District 101 Special Services, and Butte County Joint District Special Education. Those pages preserve district-owned special-education or special-services context, and Boundary plus Butte were verified directly from official district sitemap exact leaves. Idaho still is not county-grade because the statewide SDE directory exposes no county-to-district contract and the current packet still carries reviewed local leaves for only a small subset of the 44 counties.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (Reviewed Idaho Parents Unlimited About page now preserves explicit Idaho Parent Training and Information Center designation text, while the Connect With Us page preserves statewide contact routing and Boise office details.)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_live_office_directory_without_public_county_contract (The official Idaho DHW office stack is live and materially useful for office-leaf authoring, but it still does not satisfy county-grade office routing on its own. A bounded 2026-06-23 HTML review of https://healthandwelfare.idaho.gov/offices preserved named office entries and exact office leaves, but exposed zero county terms or county-served fields in the public office directory HTML. The current packet still resolves only 17 clean county-to-office leaf matches plus one Canyon split, while 27 counties remain on the dead legacy locator with no public county-to-office contract.)

## Failure ledger

- district_or_county_education_routing: reviewed_district_special_services_leaves_exist_but_county_grade_mapping_is_still_incomplete :: Reviewed 2026-06-23 bounded live exact district leaf checks taken directly from the existing Idaho packet signals and official district sitemap-backed roots. https://www.cassiaschools.org/page/special-services/ returned HTTP 200 with title `Special Services | Cassia County School District` and preserved special-education, special-services, 504, and procedural-safeguards text on the district-owned page. https://www.payetteschools.org/our-district/departments/special-education returned HTTP 200 with title `Special Services - Payette Joint District` and preserved special-education and special-services text on the district-owned page. https://www.sd25.us/departments/special-services returned HTTP 200 with title `Special Services - Pocatello-Chubbuck School District 25` and preserved special-education, special-services, 504, and procedural-safeguards text on the district-owned page. The official Boundary County District #101 sitemap at https://www.bcsd101.com/sitemap.xml exposed an exact local leaf https://www.bcsd101.com/page/special-services/, which returned HTTP 200 with title `Special Services | Boundary County School District 101`. The official Butte County District #111 sitemap at https://www.butteschooldistrict.org/sitemap.xml exposed an exact local leaf https://www.butteschooldistrict.org/departments/special_education, which returned HTTP 200 with title `Special Education - buttecountyschools` and preserved a Special Education page heading on the district-owned host. A bounded Blaine County District #61 probe also found a district-owned support-services page, but it stayed signal-only because the exact special-education role text was weaker than the other verified leaves. Those reviewed exact leaves prove Idaho education has moved beyond root authoring for a small but growing county subset. But the statewide SDE directory still exposes no county-to-district contract, and the packet still does not carry reviewed local leaves across all counties, so Idaho remains blocked until that exact-leaf coverage expands county by county.
- county_local_disability_resources: official_dhw_office_stack_has_zero_county_fields_and_only_17_clean_leaf_matches :: Reviewed 2026-06-23 live official Idaho DHW sources at https://healthandwelfare.idaho.gov/offices and https://healthandwelfare.idaho.gov/sitemap.xml. The public office directory HTML preserves named office entries such as Caldwell, Boise, Blackfoot, Idaho Falls, and Sandpoint-Ponderay and the sitemap preserves exact office leaves, but the office directory HTML exposes zero county terms or county-served fields. The county-local packet still resolves only 17 clean county-to-office leaf matches plus one Canyon split, while 27 counties remain on the dead legacy locator https://dhhs.idaho.gov/locations with no public county-to-office contract.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://healthandwelfare.idaho.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.idaho.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.idaho.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.sde.idaho.gov/sped/
- district_or_county_education_routing: blocked_reviewed_local_district_leaves_exist_but_not_statewide_county_grade; samples=8; first=https://www.sde.idaho.gov/school-districts/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://healthandwelfare.idaho.gov
- protection_and_advocacy: verified_state_grade; samples=1; first=https://disabilityrightsidaho.org/
- parent_training_information_center: verified_state_grade; samples=2; first=https://ipulidaho.org/about_ipul/
- legal_aid: verified_state_grade; samples=1; first=https://disabilityrightsidaho.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_live_office_directory_without_public_county_contract; samples=3; first=https://healthandwelfare.idaho.gov/sitemap.xml

## Next actions

- [critical] district_or_county_education_routing: expand_reviewed_exact_district_special_education_leaves_county_by_county_from_the_official_idaho_root_packet
- [critical] county_local_disability_resources: hold_17_clean_office_leaf_matches_and_keep_27_counties_blocked_until_public_county_contract_exists

## Repair decision

- Idaho remains BLOCKED and not index-safe.
- Education is still an exact reviewed-leaf expansion lane, but it is stronger than before: five counties now have reviewed district-owned special-education or special-services leaves.
- Boundary and Butte were promoted from official district sitemap exact leaves; Blaine remains signal-only until a role-exact local leaf is verified.
- County-local remains blocked separately on incomplete DHW county-to-office mapping.
