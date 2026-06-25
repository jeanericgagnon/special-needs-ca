# Wyoming California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 75
- county_count: 23
- primary_gap_reason: official_wde_special_education_hosts_return_cloudflare_403_and_reviewed_wdh_local_surfaces_still_lack_public_county_disability_contracts

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: blocked_official_wde_special_education_hosts_returning_cloudflare_403 (Reviewed 2026-06-25 one more bounded official statewide special-education pass. The current Wyoming Department of Education root plus both reviewed public special-education leaves on the official WDE host, including the parent-student and educator special-education paths, returned Cloudflare `Attention Required!` HTTP 403 pages in this pass. No reviewed public replacement state-grade special-education artifact on an official Wyoming education host was preserved on disk. Wyoming special-education statewide evidence therefore remains blocked rather than being upgraded from legacy assumptions.)
- district_or_county_education_routing: blocked_official_wde_hosts_and_unreviewed_local_district_special_education_leaves (Reviewed 2026-06-25 one more bounded official district-routing pass. Existing Wyoming district rows still only preserve generic district roots such as Albany County School District #1, Big Horn County School District #1, and Campbell County School District #1. The official WDE host that should anchor statewide district or special-education routing returned Cloudflare HTTP 403 pages for the root and reviewed special-education leaves in this pass, and no reviewed public statewide district directory, county-to-district crosswalk, or district-owned special-education leaf set was preserved on disk. Because the instructions forbid treating generic district roots as local-proof substitutes, Wyoming district or county education routing remains blocked.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (Reviewed 2026-06-25 the live first-party Parents Information Center of Wyoming about page. The page states that `Wyoming has been home to the Parent Training and Information Center (PTI) since 1991` and that `PTIs are funded by the U.S. Department of Education, Office of Special Education Programs`. This now supplies direct first-party PTI designation evidence for Wyoming.)
- legal_aid: verified_state_grade (Reviewed 2026-06-25 live first-party Legal Aid of Wyoming plus the Wyoming Judicial Branch legal-services directory. The Legal Aid of Wyoming homepage says `We provide free civil legal help to low-income individuals in Wyoming` and identifies Legal Aid of Wyoming, Inc. as `a federally funded, non-profit law firm`, with listed locations in Cheyenne, Casper, Lander, Gillette, and Afton. The official Wyoming Judicial Branch `Find Legal Services` page then preserves a county-filtered `Legal Services Directory by County` and county listings for Legal Aid of Wyoming offices in Gillette, Lander, Cheyenne, Casper, and Cody. Together these first-party and official judicial artifacts supply current statewide legal-aid evidence for Wyoming.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_official_wdh_local_resource_hosts_without_public_county_contract (Reviewed 2026-06-25 one more bounded official county-local disability pass. The prior Wyoming county-local evidence still depends on a statewide locations root rather than reviewed county-grade contracts, and the reviewed official Wyoming health and aging local-resource routes in this pass, including the public Aging and Disability Resource Center path and related WDH host family pages, returned Cloudflare `Attention Required!` HTTP 403 pages. No reviewed public county-to-office assignment table, county-service-area contract, or county-owned disability-office directory was preserved on disk. Wyoming county-local disability routing therefore remains blocked.)

## Failure ledger

- special_education_idea_part_b: official_wde_special_education_hosts_return_cloudflare_403_without_reviewable_state_grade_replacement :: Reviewed 2026-06-25 one more bounded official statewide special-education pass. The current Wyoming Department of Education root plus both reviewed public special-education leaves on the official WDE host, including the parent-student and educator special-education paths, returned Cloudflare `Attention Required!` HTTP 403 pages in this pass. No reviewed public replacement state-grade special-education artifact on an official Wyoming education host was preserved on disk. Wyoming special-education statewide evidence therefore remains blocked rather than being upgraded from legacy assumptions.
- district_or_county_education_routing: official_wde_hosts_return_cloudflare_403_and_local_district_special_education_leaves_remain_unreviewed :: Reviewed 2026-06-25 one more bounded official district-routing pass. Existing Wyoming district rows still only preserve generic district roots such as Albany County School District #1, Big Horn County School District #1, and Campbell County School District #1. The official WDE host that should anchor statewide district or special-education routing returned Cloudflare HTTP 403 pages for the root and reviewed special-education leaves in this pass, and no reviewed public statewide district directory, county-to-district crosswalk, or district-owned special-education leaf set was preserved on disk. Because the instructions forbid treating generic district roots as local-proof substitutes, Wyoming district or county education routing remains blocked.
- county_local_disability_resources: official_wdh_local_resource_hosts_return_cloudflare_403_or_only_locator_surfaces_without_public_county_contract :: Reviewed 2026-06-25 one more bounded official county-local disability pass. The prior Wyoming county-local evidence still depends on a statewide locations root rather than reviewed county-grade contracts, and the reviewed official Wyoming health and aging local-resource routes in this pass, including the public Aging and Disability Resource Center path and related WDH host family pages, returned Cloudflare `Attention Required!` HTTP 403 pages. No reviewed public county-to-office assignment table, county-service-area contract, or county-owned disability-office directory was preserved on disk. Wyoming county-local disability routing therefore remains blocked.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ssa.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://health.wyo.gov/behavioralhealth/dd/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.wyoming.gov/dd
- early_intervention_part_c: verified_state_grade; samples=3; first=https://health.wyo.gov/behavioralhealth/early-intervention-education-program-eiep/find-a-center/#region-2
- special_education_idea_part_b: blocked_official_wde_special_education_hosts_returning_cloudflare_403; samples=2; first=https://edu.wyoming.gov/for-parents-students/special-programs/special-education/
- district_or_county_education_routing: blocked_official_wde_hosts_and_unreviewed_local_district_special_education_leaves; samples=4; first=http://www.acsd1.org
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://health.wyo.gov/behavioralhealth/dd
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.wypanda.com/
- parent_training_information_center: verified_state_grade; samples=2; first=https://wpic.org/about/
- legal_aid: verified_state_grade; samples=4; first=https://www.lawyoming.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_official_wdh_local_resource_hosts_without_public_county_contract; samples=3; first=https://dhhs.wyoming.gov/locations

## Next actions

- [critical] district_or_county_education_routing: hold_blocked_until_wde_or_district_hosts_publish_reviewable_county_to_district_or_special_education_leaf_crosswalk
- [major] special_education_idea_part_b: hold_blocked_until_wde_publishes_reviewable_public_special_education_artifact_or_waf_accessible_successor_host
- [critical] county_local_disability_resources: hold_blocked_until_wdh_publishes_reviewable_public_county_to_office_or_service_area_contract

## Repair decision

- Wyoming remains `BLOCKED` and `index_safe=false`.
- `parent_training_information_center` now clears because Parents Information Center of Wyoming explicitly preserves PTI designation and U.S. Department of Education funding language on the live first-party about page.
- `legal_aid` now clears because Legal Aid of Wyoming preserves live first-party statewide civil legal-help language and the Wyoming Judicial Branch preserves a county-filtered legal-services directory naming Legal Aid of Wyoming offices.
- `special_education_idea_part_b` remains blocked because reviewed WDE special-education surfaces returned Cloudflare HTTP 403 pages and no public state-grade replacement artifact was preserved on disk.
- `district_or_county_education_routing` remains blocked because existing evidence still stops at generic district roots and the reviewed official WDE routing surfaces returned Cloudflare HTTP 403 pages.
- `county_local_disability_resources` remains blocked because reviewed official WDH local-resource routes returned Cloudflare HTTP 403 pages and no public county-to-office or service-area contract was preserved on disk.
