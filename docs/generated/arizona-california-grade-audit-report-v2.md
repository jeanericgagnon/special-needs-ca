# Arizona California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 15
- primary_gap_reason: education_gap_split_between_no_public_website_counties_and_reviewed_no_leaf_domains_plus_des_county_office_blocker

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_split_between_no_public_website_and_reviewed_public_domain_without_leaf (Arizona education remains blocked, but the remaining counties are now split cleanly into two bounded failure modes: 4/15 county-keyed district roots still expose no public district website in the official report-cards API (cochise-az, gila-az, navajo-az, pima-az), while the other 3 unresolved counties do have live district domains and now fail a bounded homepage plus sitemap/site-map pass without any role-verifiable special-education or student-services leaf (coconino-az, mohave-az, yavapai-az).)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed live first-party PTI designation text is present on the Encircle Families acknowledgements page)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_ahcccs_accessible_host_without_county_office_contract (Reviewed 2026-06-22 live Arizona DES candidates. The root, apply-benefits, Family Assistance Administration, FAA, office-locator, contact, robots.txt, and sitemap URLs all returned the Cloudflare "Just a moment..." HTTP 403 shell. The live county_offices table currently contains 14 Arizona rows still anchored to the DOI FAA placeholder https://doi.org/10.7910/DVN/AVRHMI and 1 row still anchored to the generic legacy root https://dhhs.arizona.gov/locations. The existing authoring packet at data/generated/arizona_county_local_disability_resources_leaf_authoring_packet_v1.json is real, but it still reports authoredExactLeafCount=0, so Arizona still has no reviewed county-office leaves to replace the stale rows.)

## Failure ledger

- district_or_county_education_routing: unresolved_counties_now_split_between_no_public_website_roots_and_reviewed_public_domains_without_role_leafs :: Reviewed 2026-06-23 bounded Arizona education follow-up on the remaining unresolved counties only. The official report-cards API still shows no district website at all for cochise-az, gila-az, navajo-az, and pima-az, so those counties have no district-owned leaf lane to probe in the current official data. The other unresolved counties do expose live district domains, but a bounded homepage plus sitemap/site-map pass still failed closed: https://www.ccasdaz.org/ returned a live homepage plus sitemap_index.xml yet surfaced only school-resources student/parent anchors and no role-verifiable special-education or student-services leaf; https://www.mohavelearning.org/ returned a live homepage and /site-map, but only generic parents/students pages and no role-verifiable education-routing leaf; https://www.yavapaicountyhighschool.com/ returned a live homepage and sitemap.xml, but the sitemap surfaced only business/finance, parent handbook, and general student documents with no special-education or student-services leaf. Arizona education therefore remains blocked on 4 no-website counties plus 3 reviewed public domains without a role-verifiable local leaf, rather than on generic unresolved district roots.
- county_local_disability_resources: official_local_office_roots_challenge_and_existing_packet_still_zero_exact_leaves :: Reviewed 2026-06-22 live Arizona DES candidates. The root, apply-benefits, Family Assistance Administration, FAA, office-locator, contact, robots.txt, and sitemap URLs all returned the Cloudflare "Just a moment..." HTTP 403 shell. The live county_offices table currently contains 14 Arizona rows still anchored to the DOI FAA placeholder https://doi.org/10.7910/DVN/AVRHMI and 1 row still anchored to the generic legacy root https://dhhs.arizona.gov/locations. The existing authoring packet at data/generated/arizona_county_local_disability_resources_leaf_authoring_packet_v1.json is real, but it still reports authoredExactLeafCount=0, so Arizona still has no reviewed county-office leaves to replace the stale rows.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.azahcccs.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.azahcccs.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.azed.gov/specialeducation
- district_or_county_education_routing: blocked_split_between_no_public_website_and_reviewed_public_domain_without_leaf; samples=10; first=https://www.sjusd.net/page/special-education/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://des.az.gov/ddd
- protection_and_advocacy: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://encirclefamilies.org/about-us/acknowledgements/
- legal_aid: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://www.azahcccs.gov
- county_local_disability_resources: blocked_ahcccs_accessible_host_without_county_office_contract; samples=9; first=https://des.az.gov/

## Next actions

- [critical] district_or_county_education_routing: route_no_website_counties_to_county_or_superintendent_official_lanes_and_stop_reprobing_reviewed_public_domains_without_role_leafs_until_new_local_pages_exist
- [critical] county_local_disability_resources: use_existing_arizona_county_local_packet_to_author_reviewed_county_specific_office_leaves_before_reopening_browser_lane

## Completion decision

- Arizona remains BLOCKED and not index-safe.
- Education is now materially sharper: the unresolved counties are no longer one generic bucket, but 4 no-website counties plus 3 live district domains that have already failed a bounded local-leaf pass.
- County/local disability resources remain blocked separately because the DES office lane is still challenge-blocked and the accessible AHCCCS lane still lacks a county-to-office contract.
