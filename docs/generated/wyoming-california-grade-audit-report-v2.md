# Wyoming California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 23
- primary_gap_reason: wde_idea_evidence_is_public_again_but_county_resource_fetches_are_forbidden_and_no_reviewable_county_to_district_special_education_crosswalk_exists

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (Reviewed 2026-06-25 one more bounded live check of the exact official Wyoming Department of Education special-education and IDEA pages. Both `https://edu.wyoming.gov/parents/special-education/` and `https://edu.wyoming.gov/parents/special-education/idea/` now return HTTP 200 again in the replayable lane, preserving current statewide Part B authority evidence on the official WDE host. The lane is still not sufficient for local county or district routing, but it does restore reviewable statewide IDEA authority evidence.)
- district_or_county_education_routing: blocked_official_wde_public_but_without_reviewable_county_to_district_special_education_crosswalk (Reviewed 2026-06-25 a bounded official Wyoming district-routing recheck on the exact WDE host family. The `special-education` hub, `IDEA` page, and `School District Enrollment & Staffing Data` page all return HTTP 200 in the replayable lane, but the reviewed WDE artifacts still do not preserve a statewide county-to-district crosswalk, district directory, or district-owned special-education leaf set. Existing Wyoming district evidence still stops at generic district roots such as Albany County School District #1, Big Horn County School District #1, and Campbell County School District #1. Wyoming district or county education routing therefore remains blocked on the missing local routing contract, not on a dead WDE host.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (Reviewed 2026-06-25 the live first-party Parents Information Center of Wyoming about page. The page states that `Wyoming has been home to the Parent Training and Information Center (PTI) since 1991` and that `PTIs are funded by the U.S. Department of Education, Office of Special Education Programs`. This now supplies direct first-party PTI designation evidence for Wyoming.)
- legal_aid: verified_state_grade (Reviewed 2026-06-25 live first-party Legal Aid of Wyoming plus the Wyoming Judicial Branch legal-services directory. The Legal Aid of Wyoming homepage says `We provide free civil legal help to low-income individuals in Wyoming` and identifies Legal Aid of Wyoming, Inc. as `a federally funded, non-profit law firm`, with listed locations in Cheyenne, Casper, Lander, Gillette, and Afton. The official Wyoming Judicial Branch `Find Legal Services` page then preserves a county-filtered `Legal Services Directory by County` and county listings for Legal Aid of Wyoming offices in Gillette, Lander, Cheyenne, Casper, and Cody. Together these first-party and official judicial artifacts supply current statewide legal-aid evidence for Wyoming.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_official_wdh_county_surfaces_are_aging_only_without_disability_specific_contract (Reviewed 2026-06-25 one more bounded official Wyoming Department of Health county-resource recheck on `https://health.wyo.gov/aging/communityliving/service-area-maps/` and `https://health.wyo.gov/aging/communityliving/public_resources/` using a browser-like replayable lane. Both exact pages return HTTP 200 again and remain publicly reviewable, but the live headings and content are still aging/community-living resources such as `Services by County`, `Public Resources`, `Supportive Services (Title IIIB)`, `Nutrition Services (Title IIIC1 and Title IIIC2)`, `National Family Caregiver Program (Title IIIE)`, and the senior-service provider map. They still do not provide a disability-specific county-to-office assignment table, county service-area contract, or county-owned developmental-disability office directory. Wyoming county-local disability routing therefore remains blocked on the missing disability-specific county contract, not on a dead host.)

## Failure ledger

- district_or_county_education_routing: official_wde_is_public_but_no_reviewable_county_to_district_or_special_education_crosswalk :: Reviewed 2026-06-25 a bounded official Wyoming district-routing recheck on the exact WDE host family. The `special-education` hub, `IDEA` page, and `School District Enrollment & Staffing Data` page all return HTTP 200 in the replayable lane, but the reviewed WDE artifacts still do not preserve a statewide county-to-district crosswalk, district directory, or district-owned special-education leaf set. Existing Wyoming district evidence still stops at generic district roots such as Albany County School District #1, Big Horn County School District #1, and Campbell County School District #1. Wyoming district or county education routing therefore remains blocked on the missing local routing contract, not on a dead WDE host.
- county_local_disability_resources: official_wdh_county_surfaces_are_aging_only_without_disability_specific_county_contract :: Reviewed 2026-06-25 one more bounded official Wyoming Department of Health county-resource recheck on `https://health.wyo.gov/aging/communityliving/service-area-maps/` and `https://health.wyo.gov/aging/communityliving/public_resources/` using a browser-like replayable lane. Both exact pages return HTTP 200 again and remain publicly reviewable, but the live headings and content are still aging/community-living resources such as `Services by County`, `Public Resources`, `Supportive Services (Title IIIB)`, `Nutrition Services (Title IIIC1 and Title IIIC2)`, `National Family Caregiver Program (Title IIIE)`, and the senior-service provider map. They still do not provide a disability-specific county-to-office assignment table, county service-area contract, or county-owned developmental-disability office directory. Wyoming county-local disability routing therefore remains blocked on the missing disability-specific county contract, not on a dead host.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ssa.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://health.wyo.gov/behavioralhealth/dd/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.wyoming.gov/dd
- early_intervention_part_c: verified_state_grade; samples=3; first=https://health.wyo.gov/behavioralhealth/early-intervention-education-program-eiep/find-a-center/#region-2
- special_education_idea_part_b: verified_state_grade; samples=3; first=https://edu.wyoming.gov/parents/special-education/
- district_or_county_education_routing: blocked_official_wde_public_but_without_reviewable_county_to_district_special_education_crosswalk; samples=5; first=https://edu.wyoming.gov/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://health.wyo.gov/behavioralhealth/dd
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.wypanda.com/
- parent_training_information_center: verified_state_grade; samples=2; first=https://wpic.org/about/
- legal_aid: verified_state_grade; samples=4; first=https://www.lawyoming.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_official_wdh_county_surfaces_are_aging_only_without_disability_specific_contract; samples=2; first=https://health.wyo.gov/aging/communityliving/service-area-maps/

## Next actions

- [critical] district_or_county_education_routing: hold_blocked_until_wde_or_district_hosts_publish_reviewable_county_to_district_or_special_education_leaf_crosswalk
- [critical] county_local_disability_resources: hold_blocked_until_wdh_publishes_reviewable_public_disability_specific_county_to_office_or_service_area_contract

## Repair decision

- Wyoming remains `BLOCKED` and `index_safe=false`.
- `special_education_idea_part_b` clears because the live WDE special-education and IDEA pages are publicly reviewable again and preserve current statewide Part B authority language plus the annual application artifact on the official WDE host.
- `district_or_county_education_routing` remains blocked because reviewed WDE artifacts still do not provide a county-to-district crosswalk, statewide district directory, or district-owned special-education leaf set, while existing preserved district evidence still stops at generic district roots.
- `county_local_disability_resources` remains blocked because the exact WDH county-resource pages are publicly reviewable again but still expose aging/community-living and senior-service resources rather than a disability-specific county office contract or county developmental-disability directory.
