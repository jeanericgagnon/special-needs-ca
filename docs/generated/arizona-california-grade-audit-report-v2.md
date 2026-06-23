# Arizona California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 15
- primary_gap_reason: three_public_district_domains_sitemap_exhausted_and_altcs_office_cards_still_lack_county_assignments

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_three_reviewed_public_domains_sitemap_exhausted_without_role_leafs (Arizona education is now blocked only on 3/15 counties whose public district domains are live but role-exhausted. Bounded 2026-06-23 root, robots.txt, sitemap, and one-hop sitemap checks on ccasdaz.org, mohavelearning.org, and yavapaicountyhighschool.com found no special-education, exceptional-student-services, student-services, or 504/IEP leaf URLs. The only sitemap hits were generic student handbook, outing, or student-portal pages on Mohave and Yavapai, while Coconino's root, robots, sitemap index, page sitemap, and post sitemap exposed zero role-bearing paths.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed live first-party PTI designation text is present on the Encircle Families acknowledgements page)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_des_challenge_plus_altcs_html_and_county_map_without_county_contract (Reviewed 2026-06-23 the live Arizona county-local fallback pages more tightly. The DES root, apply-benefits, Family Assistance Administration, FAA, office-locator, contact, robots.txt, and sitemap lanes are still Cloudflare 403 shells. The accessible AHCCCS fallback lane is public and preserves seven named ALTCS office cards in raw HTML for Chinle, Flagstaff, Kingman, Phoenix, Prescott Valley, Tucson, and Yuma, and the official ALTCS county map PDF is partly parseable for county names, but neither artifact provides a county-to-office table or county assignment contract. Arizona therefore still lacks county-grade official office routing.)

## Failure ledger

- district_or_county_education_routing: three_reviewed_public_district_domains_exhaust_robots_and_sitemaps_without_role_leafs :: Reviewed 2026-06-23 bounded Arizona district-owned public domains for the final three unresolved education counties. https://www.ccasdaz.org/ returned HTTP 200 and its robots.txt pointed to sitemap_index.xml, but the official sitemap index plus page-sitemap.xml and post-sitemap.xml exposed zero URLs containing special-education, student-services, exceptional-student-services, 504, or IEP role terms. https://www.mohavelearning.org/ returned HTTP 200 and robots.txt exposed the official /fs/pages/sitemap inventory, but that inventory only yielded generic student-facing pages such as student council, StudentVUE, student handbooks, and portal links, with no role-verifiable special-education or student-services leaf. https://www.yavapaicountyhighschool.com/ returned HTTP 200 and its sitemap.xml only exposed student-handbook and outing-form documents, not a special-education or student-services leaf. So the remaining Arizona education blocker is now source-final on three reviewed public domains that still lack role-bearing local leaves.
- county_local_disability_resources: des_roots_still_challenged_and_ahcccs_altcs_html_plus_county_map_still_lack_county_to_office_contract :: Reviewed 2026-06-23 bounded Arizona county-local fallback pages after the earlier DES challenge findings and the official AHCCCS PDF lane. The DES host family remains challenge-blocked on the known office-locator and benefits roots. The accessible AHCCCS fallback lane is live and stronger than previously recorded: https://www.azahcccs.gov/members/ALTCSlocations.html returned HTTP 200 and its raw HTML preserved seven named ALTCS office cards for Chinle, Flagstaff, Kingman, Phoenix, Prescott Valley, Tucson, and Yuma. The official ALTCS County Map PDF is also partially parseable and preserves Arizona county names, but it still does not attach those counties to office addresses, phones, or a repeatable county-to-office assignment contract. https://www.azahcccs.gov/shared/AHCCCScontacts.html and https://www.azahcccs.gov/Members/AlreadyCovered/MemberResources/ALTCS.html remain statewide contact and program-guidance leaves rather than county-specific office assignments. Arizona therefore still lacks a reviewable official county-to-office routing contract.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.azahcccs.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.azahcccs.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.azed.gov/specialeducation
- district_or_county_education_routing: blocked_three_reviewed_public_domains_sitemap_exhausted_without_role_leafs; samples=5; first=https://www.ccasdaz.org/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://des.az.gov/ddd
- protection_and_advocacy: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://encirclefamilies.org/about-us/acknowledgements/
- legal_aid: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://www.azahcccs.gov
- county_local_disability_resources: blocked_des_challenge_plus_altcs_html_and_county_map_without_county_contract; samples=3; first=https://www.azahcccs.gov/members/ALTCSlocations.html

## Next actions

- [critical] district_or_county_education_routing: hold_three_reviewed_public_domains_until_role_bearing_special_education_or_student_services_leaves_exist
- [critical] county_local_disability_resources: hold_blocked_until_des_clears_or_ahcccs_publishes_county_to_office_assignments_in_reviewable_html_or_parseable_admin_artifacts

## Completion decision

- Arizona remains BLOCKED and not index-safe.
- Education is now source-final for low-token work on exactly three live public district domains: their homepages plus robots/sitemap inventories expose no role-bearing special-education or student-services leafs.
- County/local disability resources remain blocked separately because the DES host family is still challenge-blocked and the accessible AHCCCS fallback only proves seven named ALTCS office cards plus a partially parseable county map, not a county-to-office contract.
