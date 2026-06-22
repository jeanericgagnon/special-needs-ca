# Arizona California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 15
- primary_gap_reason: challenged_official_roots_zero_exact_education_leaves_and_nonresolving_county_root_inventory

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
- county_local_disability_resources: blocked_zero_exact_leaf_packet (The Arizona county-local office packet is still not runnable: it contains 0 exact office leaves, and a bounded live probe of the 15 county-root seeds currently stored in the DB showed 14/15 do not resolve at all while the remaining Maricopa root returned HTTP 403. Until the stale county-root inventory is replaced with live official office roots or exact leaves, the family remains blocked on DOI and generic locator fallback rows rather than on a trustworthy local repair queue.)

## Failure ledger

- district_or_county_education_routing: education_packet_scaffold_only_zero_exact_district_leaves :: Reviewed 2026-06-22 Arizona district-or-county education routing packet plus current blocker artifacts. The official AZED special-education lane remains challenge-blocked, and the authored packet at data/generated/arizona_district_or_county_education_routing_leaf_authoring_packet_v1.json still reports authoredExactLeafCount=0 across 15 affected counties. No district-owned Arizona special-education or student-services leaf has yet been attached to the repair queue, so the state packet still depends on generic https://www.azed.gov/specialeducation fallback rows.
- county_local_disability_resources: county_office_packet_empty_and_county_root_inventory_nonresolving :: Reviewed 2026-06-22 bounded live probes of the 15 Arizona county-root URLs currently stored in the DB for county-local authoring. Apache, Cochise, Coconino, Gila, Graham, Greenlee, La Paz, Mohave, Navajo, Pima, Pinal, Santa Cruz, Yavapai, and Yuma all failed DNS resolution on their current `*-az.gov` roots, while Maricopa returned HTTP 403. The official Arizona DES lane also remains challenge-blocked, and the authored packet at data/generated/arizona_county_local_disability_resources_leaf_authoring_packet_v1.json still reports authoredExactLeafCount=0, so the county-local repair queue cannot yet be truthfully seeded from the existing county-root inventory.

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
- [critical] county_local_disability_resources: replace_nonresolving_county_root_seeds_before_authoring_arizona_county_local_leaves

## Repair decision

- Arizona remains BLOCKED and not index-safe.
- Education is still blocked because the packet has zero district-owned exact leaves.
- County-local is now sharper than “zero exact leaves” alone: the current county-root inventory itself is mostly dead, so the repair lane cannot be trusted until those seeds are replaced with live official office roots or exact leaves.
- Arizona should only reopen county-local once the stale county-root inventory is replaced and exact first-party office targets are authored.
