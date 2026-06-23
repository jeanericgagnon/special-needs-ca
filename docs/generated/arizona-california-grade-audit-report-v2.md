# Arizona California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 15
- primary_gap_reason: partial_district_owned_education_leafs_plus_des_county_office_blocker

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_county_keyed_report_cards_roots_without_district_owned_special_education_leaves (Arizona education now has reviewed district-owned special-education or student-services leaves for some county-keyed district roots, but the family remains blocked until every county has a reviewed local education-routing leaf rather than only a county-keyed district root.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed live first-party PTI designation text is present on the Encircle Families acknowledgements page)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_ahcccs_accessible_host_without_county_office_contract (Reviewed 2026-06-22 live Arizona DES candidates. The root, apply-benefits, Family Assistance Administration, FAA, office-locator, contact, robots.txt, and sitemap URLs all returned the Cloudflare "Just a moment..." HTTP 403 shell. The live county_offices table currently contains 14 Arizona rows still anchored to the DOI FAA placeholder https://doi.org/10.7910/DVN/AVRHMI and 1 row still anchored to the generic legacy root https://dhhs.arizona.gov/locations. The existing authoring packet at data/generated/arizona_county_local_disability_resources_leaf_authoring_packet_v1.json is real, but it still reports authoredExactLeafCount=0, so Arizona still has no reviewed county-office leaves to replace the stale rows.)

## Failure ledger

- district_or_county_education_routing: district_owned_special_education_leaves_verified_for_some_counties_but_remaining_counties_still_lack_reviewed_local_leaves :: Reviewed 2026-06-23 bounded district-owned Arizona education leaf verification from the county-keyed report-cards inventory. Exact same-domain special-education or student-services leaves were verified for 8/15 county-keyed district roots: apache-az, graham-az, greenlee-az, la-paz-az, maricopa-az, pinal-az, santa-cruz-az, yuma-az. The verified local leaves came from direct district-owned hrefs or sitemap candidates rather than the challenged AZED host. Remaining unresolved counties are cochise-az, coconino-az, gila-az, mohave-az, navajo-az, pima-az, yavapai-az, where the current chosen district root either exposes no same-domain special-education candidate, has no public district website, or still lacks a role-verifiable local leaf. Arizona education is sharper because some county-grade local leaves are now proven, but the family remains blocked until all counties have reviewed district-owned education-routing leaves.
- county_local_disability_resources: official_local_office_roots_challenge_and_existing_packet_still_zero_exact_leaves :: Reviewed 2026-06-22 live Arizona DES candidates. The root, apply-benefits, Family Assistance Administration, FAA, office-locator, contact, robots.txt, and sitemap URLs all returned the Cloudflare "Just a moment..." HTTP 403 shell. The live county_offices table currently contains 14 Arizona rows still anchored to the DOI FAA placeholder https://doi.org/10.7910/DVN/AVRHMI and 1 row still anchored to the generic legacy root https://dhhs.arizona.gov/locations. The existing authoring packet at data/generated/arizona_county_local_disability_resources_leaf_authoring_packet_v1.json is real, but it still reports authoredExactLeafCount=0, so Arizona still has no reviewed county-office leaves to replace the stale rows.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.azahcccs.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.azahcccs.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.azed.gov/specialeducation
- district_or_county_education_routing: blocked_partial_district_owned_special_education_leaf_coverage; samples=10; first=https://www.sjusd.net/page/special-education/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://des.az.gov/ddd
- protection_and_advocacy: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://encirclefamilies.org/about-us/acknowledgements/
- legal_aid: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://www.azahcccs.gov
- county_local_disability_resources: blocked_ahcccs_accessible_host_without_county_office_contract; samples=9; first=https://des.az.gov/

## Next actions

- [critical] district_or_county_education_routing: finish_district_owned_special_education_leaves_for_unresolved_counties_from_county_keyed_roots
- [critical] county_local_disability_resources: use_existing_arizona_county_local_packet_to_author_reviewed_county_specific_office_leaves_before_reopening_browser_lane

## Completion decision

- Arizona remains BLOCKED and not index-safe.
- Education improved because reviewed district-owned leaves now exist for part of the county-keyed district inventory, so the blocker is no longer just root authoring. The remaining work is explicit unresolved county coverage.
- County/local disability resources are still blocked separately because the DES office lane remains challenge-blocked and the accessible AHCCCS artifacts still do not preserve a county-to-office contract.
