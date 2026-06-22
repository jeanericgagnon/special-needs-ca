# Arizona California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 15
- primary_gap_reason: challenged_official_roots_and_zero_exact_leaf_targets_in_authoring_packets

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_zero_exact_leaf_packet (The challenged AZED root is no longer the only blocker: the Arizona education leaf packet exists, but it still contains 0 exact district-owned leaves for the 15 affected counties. Until exact district-owned special-education or student-services targets are authored, the family remains blocked on generic statewide fallback rows rather than on a runnable local repair queue.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed live first-party PTI designation text is present on the Encircle Families acknowledgements page)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_zero_exact_leaf_packet (The challenged Arizona DES root is no longer the only blocker: the Arizona county-local office packet exists, but it still contains 0 exact county-specific or regional office leaves for the 15 affected counties. Until exact county or regional office targets are authored, the family remains blocked on DOI and generic locator fallback rows rather than on a runnable local repair queue.)

## Failure ledger

- district_or_county_education_routing: education_packet_scaffold_only_zero_exact_district_leaves :: Reviewed 2026-06-22 Arizona district-or-county education routing packet plus current blocker artifacts. The official AZED special-education lane remains challenge-blocked, and the authored packet at data/generated/arizona_district_or_county_education_routing_leaf_authoring_packet_v1.json still reports authoredExactLeafCount=0 across 15 affected counties. No district-owned Arizona special-education or student-services leaf has yet been attached to the repair queue, so the state packet still depends on generic https://www.azed.gov/specialeducation fallback rows.
- county_local_disability_resources: county_office_packet_scaffold_only_zero_exact_office_leaves :: Reviewed 2026-06-22 Arizona county-local office packet plus current blocker artifacts. The official Arizona DES lane remains challenge-blocked, and the authored packet at data/generated/arizona_county_local_disability_resources_leaf_authoring_packet_v1.json still reports authoredExactLeafCount=0 across 15 affected counties. No exact county-specific or regional DES/FAA office leaf has yet been attached to the repair queue, so the state packet still depends on 14 DOI placeholder rows plus 1 generic legacy locator row.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.azahcccs.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.azahcccs.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.azed.gov/specialeducation
- district_or_county_education_routing: blocked_zero_exact_leaf_packet; samples=3; first=https://www.azed.gov/specialeducation
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://des.az.gov/ddd
- protection_and_advocacy: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://encirclefamilies.org/about-us/acknowledgements/
- legal_aid: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://www.azahcccs.gov
- county_local_disability_resources: blocked_zero_exact_leaf_packet; samples=3; first=https://des.az.gov/

## Next actions

- [critical] district_or_county_education_routing: author_exact_district_owned_special_education_leaves_before_reopening_arizona_education
- [critical] county_local_disability_resources: author_exact_county_or_regional_des_office_leaves_before_reopening_arizona_county_local

## Repair decision

- Arizona remains BLOCKED and not index-safe.
- The official state education and DES roots are still challenge-blocked, but the sharper immediate blocker is now packet emptiness: both authored leaf packets still contain zero exact local targets.
- No district-owned education leaf or county-specific office leaf was attached to the Arizona repair queue in this bounded pass, so the state still depends on generic statewide or DOI fallback rows.
- Arizona should only reopen these two families once exact district-owned or county-specific first-party targets are authored into the packets themselves.
