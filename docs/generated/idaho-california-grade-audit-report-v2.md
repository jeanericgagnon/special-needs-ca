# Idaho California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 44
- primary_gap_reason: reviewed_idaho_district_leaves_now_cover_12_counties_and_dhw_split_is_explicit_but_county_grade_remains_incomplete

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_reviewed_local_district_leaves_exist_but_not_statewide_county_grade (The Idaho education blocker remains an exact reviewed-leaf expansion lane, but it is stronger than before: official district-owned local leaves are now reviewable for twelve counties. Emmett Independent School District now joins Cassia, Payette, Bannock, Boundary, Butte, Bonneville, Jerome, Minidoka, Blaine, Teton, Gooding, and the earlier reviewed set through a direct district-owned `Special Education` page. Idaho still is not county-grade because the statewide SDE directory exposes no county-to-district contract and the packet still carries reviewed local leaves for only a subset of the 44 counties.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (Reviewed Idaho Parents Unlimited About page now preserves explicit Idaho Parent Training and Information Center designation text, while the Connect With Us page preserves statewide contact routing and Boise office details.)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_split_between_clean_exact_office_leaves_and_legacy_counties_without_public_contract (The Idaho DHW office lane is now an explicit split, not a generic local-office blocker. The live official office root and sitemap still expose no county terms or county-served fields, so they do not prove county-grade routing by themselves. But the existing deterministic office packet now safely materializes 17 clean county-to-exact-office leaf matches plus one Canyon split, while 27 counties remain blocked on the dead legacy locator because no public county-to-office contract exists for them.)

## Failure ledger

- district_or_county_education_routing: reviewed_district_special_services_leaves_now_cover_12_counties_but_county_grade_mapping_is_still_incomplete :: Reviewed 2026-06-23 one more bounded live Idaho district-owned leaf directly from the official SDE district root lane. The official Idaho School Districts page JSON links Emmett School District #221 at https://www.emmettschools.org/. That live district root exposed exact special-education candidates, including https://www.emmettschools.org/departments/special-education and https://www.emmettschools.org/our-district/programs/special-education-early-childhood-preschool. The exact district-owned Special Education page returned HTTP 200 with title `Special Education - Emmett Independent School District`, H1 `Special Education`, and preserved procedural-safeguards text on the district-owned host. Idaho education therefore now has twelve reviewed county-level district-owned leaves, but the statewide SDE directory still exposes no county-to-district contract and the remaining counties still need exact leaf expansion.
- county_local_disability_resources: official_dhw_office_stack_supports_17_clean_leaf_matches_but_27_legacy_counties_still_lack_public_contract :: Reviewed 2026-06-23 bounded live Idaho DHW confirmation on the official root plus the existing office-leaf packet. The public root at https://healthandwelfare.idaho.gov/offices is live with title `Find a Service Location` and still preserves exact city office cards like Caldwell Office in HTML, but it exposes zero county terms or county-served fields. The exact office leaf https://healthandwelfare.idaho.gov/dhw/caldwell-office is live with title `Caldwell Office`, confirming that the packet is grounded in real reviewable DHW office leaves. Idaho county-local routing therefore splits cleanly into 17 safe county-to-exact-office replacements plus one Canyon split that still rejects Nampa as SWITC-only, while 27 counties remain blocked because the public DHW stack still exposes no truthful county-to-office contract for them.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://healthandwelfare.idaho.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.idaho.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.idaho.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.sde.idaho.gov/sped/
- district_or_county_education_routing: blocked_reviewed_local_district_leaves_exist_but_not_statewide_county_grade; samples=14; first=https://www.sde.idaho.gov/school-districts/
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
- Education is still a county-by-county exact-leaf expansion lane, but Emmett Independent School District brings the reviewed count to twelve counties with a newly verified district-owned Special Education page.
- County-local remains the same explicit split: 17 clean office replacements plus the Canyon split are preserved, and 27 counties stay blocked until Idaho publishes a public county-to-office contract.
