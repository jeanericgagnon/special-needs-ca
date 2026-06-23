# Idaho California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 44
- primary_gap_reason: reviewed_idaho_district_leaves_exist_and_dhw_split_is_explicit_but_county_grade_remains_incomplete

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_reviewed_local_district_leaves_exist_but_not_statewide_county_grade (The Idaho education blocker is now an exact reviewed-leaf expansion lane, not just a root packet. Official district-owned local leaves are already reviewable on the public web for nine counties: Cassia County School District Special Services, Payette Joint District Special Services, Pocatello-Chubbuck School District 25 Special Services, Boundary County School District 101 Special Services, Butte County Joint District Special Education, Bonneville Joint District #93 Special Education Programs, Jerome SD #261 Special Services, Minidoka School District Special Services, and Blaine County District #61 Special Education. Those pages preserve district-owned special-education or special-services context, and Boundary, Butte, Bonneville, Minidoka, and Blaine were verified from sitemap, packet-backed exact-path, or district-page-linked exact leaves. Idaho still is not county-grade because the statewide SDE directory exposes no county-to-district contract and the current packet still carries reviewed local leaves for only a subset of the 44 counties.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (Reviewed Idaho Parents Unlimited About page now preserves explicit Idaho Parent Training and Information Center designation text, while the Connect With Us page preserves statewide contact routing and Boise office details.)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_split_between_clean_exact_office_leaves_and_legacy_counties_without_public_contract (The Idaho DHW office lane is now an explicit split, not a generic local-office blocker. The live official office root and sitemap still expose no county terms or county-served fields, so they do not prove county-grade routing by themselves. But the existing deterministic office packet now safely materializes 17 clean county-to-exact-office leaf matches plus one Canyon split, while 27 counties remain blocked on the dead legacy locator because no public county-to-office contract exists for them.)

## Failure ledger

- district_or_county_education_routing: reviewed_district_special_services_leaves_exist_but_county_grade_mapping_is_still_incomplete :: Reviewed 2026-06-23 bounded live exact district leaf checks taken directly from the existing Idaho packet signals and official district sitemap-backed roots. https://www.cassiaschools.org/page/special-services/ returned HTTP 200 with title `Special Services | Cassia County School District` and preserved special-education, special-services, 504, and procedural-safeguards text on the district-owned page. https://www.payetteschools.org/our-district/departments/special-education returned HTTP 200 with title `Special Services - Payette Joint District` and preserved special-education and special-services text on the district-owned page. https://www.sd25.us/departments/special-services returned HTTP 200 with title `Special Services - Pocatello-Chubbuck School District 25` and preserved special-education, special-services, 504, and procedural-safeguards text on the district-owned page. The official Boundary County District #101 sitemap at https://www.bcsd101.com/sitemap.xml exposed an exact local leaf https://www.bcsd101.com/page/special-services/, which returned HTTP 200 with title `Special Services | Boundary County School District 101`. The official Butte County District #111 sitemap at https://www.butteschooldistrict.org/sitemap.xml exposed an exact local leaf https://www.butteschooldistrict.org/departments/special_education, which returned HTTP 200 with title `Special Education - buttecountyschools` and preserved a Special Education page heading on the district-owned host. The official Bonneville Joint District #93 sitemap at https://www.d93schools.org/sitemap.xml exposed an exact local leaf https://www.d93schools.org/special-education-programs-home, which returned HTTP 200 with title `Special Education Programs` and preserved Special Education Programs text on the district-owned host. A bounded Jerome SD #261 anchor-text probe surfaced https://www.jeromeschools.org/specialserviceshome, which returned HTTP 200 with title `Special Services | Jerome SD #261` and preserved special-education plus special-services context on the district-owned page. The official Minidoka School District sitemap at https://www.minidokaschools.org/sitemap.xml exposed an exact local leaf https://www.minidokaschools.org/page/special-services/, which returned HTTP 200 with title `Special Services | We are Minidoka` and preserved special-services plus Section 504 context on the district-owned host. A bounded Blaine County District #61 follow-up on https://www.blaineschools.org/teaching-and-learning/teaching-learning/educational-programs found direct district-owned links to hidden CMS leaves for `Special Education` and `504 Plans`; the exact `Special Education` leaf at https://www.blaineschools.org/fs/pages/2147 resolved live to https://www.blaineschools.org/teaching-and-learning/teaching-learning/educational-programs/special-education with title `Special Education` and preserved procedural-safeguards text plus Director of Special Programs contact routing on the district-owned host. Those reviewed exact leaves prove Idaho education has moved beyond root authoring for a small but growing county subset. But the statewide SDE directory still exposes no county-to-district contract, and the packet still does not carry reviewed local leaves across all counties, so Idaho remains blocked until that exact-leaf coverage expands county by county.
- county_local_disability_resources: official_dhw_office_stack_supports_17_clean_leaf_matches_but_27_legacy_counties_still_lack_public_contract :: Reviewed 2026-06-23 bounded live Idaho DHW confirmation on the official root plus the existing office-leaf packet. The public root at https://healthandwelfare.idaho.gov/offices is live with title `Find a Service Location` and still preserves exact city office cards like Caldwell Office in HTML, but it exposes zero county terms or county-served fields. The exact office leaf https://healthandwelfare.idaho.gov/dhw/caldwell-office is live with title `Caldwell Office`, confirming that the packet is grounded in real reviewable DHW office leaves. Idaho county-local routing therefore splits cleanly into 17 safe county-to-exact-office replacements plus one Canyon split that still rejects Nampa as SWITC-only, while 27 counties remain blocked because the public DHW stack still exposes no truthful county-to-office contract for them.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://healthandwelfare.idaho.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.idaho.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.idaho.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.sde.idaho.gov/sped/
- district_or_county_education_routing: blocked_reviewed_local_district_leaves_exist_but_not_statewide_county_grade; samples=11; first=https://www.sde.idaho.gov/school-districts/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://healthandwelfare.idaho.gov
- protection_and_advocacy: verified_state_grade; samples=1; first=https://disabilityrightsidaho.org/
- parent_training_information_center: verified_state_grade; samples=2; first=https://ipulidaho.org/about_ipul/
- legal_aid: verified_state_grade; samples=1; first=https://disabilityrightsidaho.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_split_between_clean_exact_office_leaves_and_legacy_counties_without_public_contract; samples=4; first=https://healthandwelfare.idaho.gov/offices

## Next actions

- [critical] district_or_county_education_routing: expand_reviewed_exact_district_special_education_leaves_county_by_county_from_the_official_idaho_root_packet
- [critical] county_local_disability_resources: retain_17_clean_exact_office_replacements_keep_canyon_split_explicit_and_leave_27_legacy_counties_blocked_until_idaho_publishes_county_contract

## Repair decision

- Idaho remains BLOCKED and not index-safe.
- Education is still a county-by-county exact-leaf expansion lane.
- County-local is sharper than before: 17 clean exact office replacements and the Canyon split are now explicitly separated from 27 counties that remain blocked on the absent public county-to-office contract.
