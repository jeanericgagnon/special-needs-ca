# Arizona California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 15
- primary_gap_reason: education_gap_now_limited_to_reviewed_no_leaf_public_domains_plus_des_county_office_blocker

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_reviewed_public_domains_without_leaf_after_county_owned_no_website_repairs (Arizona education is now blocked only on 3/15 counties whose live district domains still fail a bounded homepage plus sitemap/site-map pass without any role-verifiable special-education or student-services leaf (coconino-az, mohave-az, yavapai-az). The 4 counties whose report-cards district roots exposed no public district website (cochise-az, gila-az, navajo-az, pima-az) are now covered by reviewed county-owned superintendent or accommodation-district routing leaves.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed live first-party PTI designation text is present on the Encircle Families acknowledgements page)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_ahcccs_accessible_host_without_county_office_contract (Reviewed 2026-06-22 live Arizona DES candidates. The root, apply-benefits, Family Assistance Administration, FAA, office-locator, contact, robots.txt, and sitemap URLs all returned the Cloudflare "Just a moment..." HTTP 403 shell. The live county_offices table currently contains 14 Arizona rows still anchored to the DOI FAA placeholder https://doi.org/10.7910/DVN/AVRHMI and 1 row still anchored to the generic legacy root https://dhhs.arizona.gov/locations. The existing authoring packet at data/generated/arizona_county_local_disability_resources_leaf_authoring_packet_v1.json is real, but it still reports authoredExactLeafCount=0, so Arizona still has no reviewed county-office leaves to replace the stale rows.)

## Failure ledger

- district_or_county_education_routing: county_owned_superintendent_leaves_resolve_no_website_counties_but_three_reviewed_public_domains_still_lack_role_leafs :: Reviewed 2026-06-23 bounded Arizona county-owned education follow-up on the four report-cards rows that had no public district website. That pass found strong county-owned local routing leaves for all four counties: Cochise County now has an official School Districts page that lists Cochise Elementary School District and links the county directory of schools with contact information; Gila County now has an exact superintendent-host leaf titled Gila County Regional School District #49; Navajo County now has an official Accommodation District leaf plus linked district-directory entry for Navajo County Accommodation District #99; and Pima County Schools now has an exact Pima Accommodation page describing the Pima Accommodation District and CAPE educational services. Arizona education therefore no longer blocks on no-website counties and is now limited to the three already-reviewed public district domains that still lack any role-verifiable special-education or student-services leaf: https://www.ccasdaz.org/, https://www.mohavelearning.org/, and https://www.yavapaicountyhighschool.com/.
- county_local_disability_resources: official_local_office_roots_challenge_and_existing_packet_still_zero_exact_leaves :: Reviewed 2026-06-22 live Arizona DES candidates. The root, apply-benefits, Family Assistance Administration, FAA, office-locator, contact, robots.txt, and sitemap URLs all returned the Cloudflare "Just a moment..." HTTP 403 shell. The live county_offices table currently contains 14 Arizona rows still anchored to the DOI FAA placeholder https://doi.org/10.7910/DVN/AVRHMI and 1 row still anchored to the generic legacy root https://dhhs.arizona.gov/locations. The existing authoring packet at data/generated/arizona_county_local_disability_resources_leaf_authoring_packet_v1.json is real, but it still reports authoredExactLeafCount=0, so Arizona still has no reviewed county-office leaves to replace the stale rows.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.azahcccs.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.azahcccs.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.azed.gov/specialeducation
- district_or_county_education_routing: blocked_reviewed_public_domains_without_leaf_after_county_owned_no_website_repairs; samples=18; first=https://www.sjusd.net/page/special-education/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://des.az.gov/ddd
- protection_and_advocacy: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://encirclefamilies.org/about-us/acknowledgements/
- legal_aid: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://www.azahcccs.gov
- county_local_disability_resources: blocked_ahcccs_accessible_host_without_county_office_contract; samples=9; first=https://des.az.gov/

## Next actions

- [critical] district_or_county_education_routing: hold_reviewed_public_domains_without_role_leafs_until_new_local_pages_exist_and_do_not_reopen_county_superintendent_lane_for_the_resolved_no_website_counties
- [critical] county_local_disability_resources: use_existing_arizona_county_local_packet_to_author_reviewed_county_specific_office_leaves_before_reopening_browser_lane

## Completion decision

- Arizona remains BLOCKED and not index-safe.
- Education is sharper again: the four no-website counties now have reviewed county-owned routing leaves, so the remaining education blocker is limited to three already-reviewed public district domains that still expose no role-verifiable local leaf.
- County/local disability resources remain blocked separately because the DES office lane is still challenge-blocked and the accessible AHCCCS lane still lacks a county-to-office contract.
