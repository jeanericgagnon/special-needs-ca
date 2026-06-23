# Arizona California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 15
- primary_gap_reason: three_public_district_domains_official_api_and_exact_slug_sweeps_still_lack_role_leafs_and_altcs_office_cards_still_lack_county_assignments

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_three_reviewed_public_domains_official_api_and_exact_slug_exhausted_without_role_leafs (Arizona education is now blocked only on 3/15 counties whose public district domains are live but fully exhausted even after one more official API and exact-slug pass. Coconino County Accommodation School District returned HTTP 200 on the district root and official WordPress JSON search, but the wp-json search for `special education` only replayed false-positive Governing Board and staff records while the official page/post sitemaps still exposed zero role-bearing paths. Mohave Accelerated Schools stayed live on the district-owned root, but exact Finalsite-style role candidates such as `/fs/pages/504`, `/fs/pages/special-education`, `/fs/pages/student-services`, and `/fs/pages/special-services` all returned 404. Yavapai Accommodation School District proved its `/page/` namespace is live because `/page/contact-us/` returned HTTP 200, but `/page/special-education/`, `/page/student-services/`, and `/page/504/` all returned 404. The remaining Arizona education blocker is therefore source-final on three reviewed public domains that still lack role-bearing local leaves.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed live first-party PTI designation text is present on the Encircle Families acknowledgements page)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_des_challenge_plus_altcs_html_and_county_map_without_county_contract (Reviewed 2026-06-23 the live Arizona county-local fallback pages more tightly. The DES root, apply-benefits, Family Assistance Administration, FAA, office-locator, contact, robots.txt, and sitemap lanes are still Cloudflare 403 shells. The accessible AHCCCS fallback lane is public and preserves seven named ALTCS office cards in raw HTML for Chinle, Flagstaff, Kingman, Phoenix, Prescott Valley, Tucson, and Yuma, and the official ALTCS county map PDF is partly parseable for county names, but neither artifact provides a county-to-office table or county assignment contract. Arizona therefore still lacks county-grade official office routing.)

## Failure ledger

- district_or_county_education_routing: three_reviewed_public_district_domains_exhaust_sitemaps_wp_api_and_exact_slug_replays_without_role_leafs :: Reviewed 2026-06-23 one more bounded Arizona district-owned official API and exact-slug pass for the final three unresolved education counties. https://www.ccasdaz.org/ stayed live, and https://www.ccasdaz.org/wp-json/wp/v2/search?search=special%20education&per_page=10 returned HTTP 200, but the official WordPress search only replayed false-positive Governing Board and staff records rather than a role-bearing special-education or student-services leaf; the official page-sitemap.xml and post-sitemap.xml still exposed zero matching role paths. https://www.mohavelearning.org/ stayed live, but exact Finalsite-style role candidates at /fs/pages/504, /fs/pages/special-education, /fs/pages/student-services, and /fs/pages/special-services all returned 404. https://www.yavapaicountyhighschool.com/ stayed live and its /page/contact-us/ route returned HTTP 200, proving the public page namespace is real, but /page/special-education/, /page/student-services/, and /page/504/ all returned 404. The remaining Arizona education blocker is now source-final on three reviewed public domains that still lack role-bearing local leaves even after sitemap, API, and exact-slug replay.
- county_local_disability_resources: des_roots_still_challenged_and_ahcccs_altcs_html_plus_county_map_still_lack_county_to_office_contract :: Reviewed 2026-06-23 bounded Arizona county-local fallback pages after the earlier DES challenge findings and the official AHCCCS PDF lane. The DES host family remains challenge-blocked on the known office-locator and benefits roots. The accessible AHCCCS fallback lane is live and stronger than previously recorded: https://www.azahcccs.gov/members/ALTCSlocations.html returned HTTP 200 and its raw HTML preserved seven named ALTCS office cards for Chinle, Flagstaff, Kingman, Phoenix, Prescott Valley, Tucson, and Yuma. The official ALTCS County Map PDF is also partially parseable and preserves Arizona county names, but it still does not attach those counties to office addresses, phones, or a repeatable county-to-office assignment contract. https://www.azahcccs.gov/shared/AHCCCScontacts.html and https://www.azahcccs.gov/Members/AlreadyCovered/MemberResources/ALTCS.html remain statewide contact and program-guidance leaves rather than county-specific office assignments. Arizona therefore still lacks a reviewable official county-to-office routing contract.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.azahcccs.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.azahcccs.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.azed.gov/specialeducation
- district_or_county_education_routing: blocked_three_reviewed_public_domains_official_api_and_exact_slug_exhausted_without_role_leafs; samples=8; first=https://www.ccasdaz.org/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://des.az.gov/ddd
- protection_and_advocacy: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://encirclefamilies.org/about-us/acknowledgements/
- legal_aid: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://www.azahcccs.gov
- county_local_disability_resources: blocked_des_challenge_plus_altcs_html_and_county_map_without_county_contract; samples=3; first=https://des.az.gov/

## Next actions

- [critical] district_or_county_education_routing: hold_three_reviewed_public_domains_until_role_bearing_special_education_or_student_services_leaves_exist
- [critical] county_local_disability_resources: hold_blocked_until_des_clears_or_ahcccs_publishes_county_to_office_assignments_in_reviewable_html_or_parseable_admin_artifacts

## Completion decision

- Arizona remains BLOCKED and not index-safe.
- Education is now source-final on exactly three reviewed public district domains even after one more official WordPress API, sitemap, and exact-slug replay.
- County/local disability resources remain blocked separately because the DES host family is still challenge-blocked and the accessible AHCCCS fallback only proves seven named ALTCS office cards plus a partial county map, not a county-to-office contract.
