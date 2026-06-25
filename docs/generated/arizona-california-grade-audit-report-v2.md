# Arizona California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 15
- primary_gap_reason: ahcccs_university_familycare_pdf_bundle_now_proves_non_contract_support_letters_and_live_public_education_surface_recheck_confirms_three_public_domains_still_lack_role_leaves

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_three_reviewed_public_district_domains_live_surface_recheck_still_without_role_leafs (Reviewed 2026-06-25 one more bounded live Arizona district-owned public-surface pass for the final three unresolved education counties. Coconino County Accommodation School District stayed live at https://www.ccasdaz.org/, but its official `page-sitemap.xml` and `post-sitemap.xml` still exposed no role-bearing special-education, student-services, 504, or Child Find URLs, and fresh WordPress JSON searches for `special education`, `504`, `child find`, and `student services` only replayed false-positive Governing Board, About, Employment, school, or staff pages. Mohave Accelerated Schools stayed live at https://www.mohavelearning.org/, but the homepage preserved no role terms, exact leaf candidates such as `/page/504/`, `/page/special-education/`, and `/page/student-services/` returned 404, and the public `search-results/~board/news/post/special-education` surface returned HTTP 200 with no role-bearing content while the sitemap lane stayed unavailable (`/sitemap.xml` 404 and `/fs/pages/sitemap` 406). Yavapai Accommodation School District stayed live at https://www.yavapaicountyhighschool.com/, but its official sitemap only exposed generic pages, handbook/document leaves, and student outing forms; the `documents/` page preserved no role-bearing content; and `/page/504/`, `/page/special-education/`, and `/page/student-services/` all returned 404 even though `/page/contact-us/` remained public. The remaining Arizona education blocker is therefore source-final on three reviewed public domains that still lack role-bearing local leaves after live search, sitemap, documents, and exact-role rechecks.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed live first-party PTI designation text is present on the Encircle Families acknowledgements page)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_des_challenge_plus_altcs_html_and_county_map_without_county_contract (Reviewed 2026-06-23 the live Arizona county-local fallback pages more tightly. The DES root, apply-benefits, Family Assistance Administration, FAA, office-locator, contact, robots.txt, and sitemap lanes are still Cloudflare 403 shells. The accessible AHCCCS fallback lane is public and preserves seven named ALTCS office cards in raw HTML for Chinle, Flagstaff, Kingman, Phoenix, Prescott Valley, Tucson, and Yuma, and the official ALTCS county map PDF is partly parseable for county names, but neither artifact provides a county-to-office table or county assignment contract. Arizona therefore still lacks county-grade official office routing.)

## Failure ledger

- district_or_county_education_routing: three_reviewed_public_district_domains_live_surface_recheck_exhausts_search_sitemap_and_exact_role_surfaces_without_role_leafs :: Reviewed 2026-06-25 a bounded live Arizona district-owned public-surface recheck for the final three unresolved education counties. https://www.ccasdaz.org/ returned HTTP 200, `https://www.ccasdaz.org/page-sitemap.xml` and `https://www.ccasdaz.org/post-sitemap.xml` returned HTTP 200 with no role-bearing special-education, student-services, 504, or Child Find URLs, and WordPress JSON searches for `special education`, `504`, `child find`, and `student services` only replayed Governing Board, About, Employment, school, or staff false positives. https://www.mohavelearning.org/ returned HTTP 200 with no role-bearing terms on the homepage, `https://www.mohavelearning.org/page/504/`, `/page/special-education/`, and `/page/student-services/` all returned 404, `https://www.mohavelearning.org/search-results/~board/news/post/special-education` returned HTTP 200 but contained no role-bearing content, `https://www.mohavelearning.org/sitemap.xml` returned 404, and `https://www.mohavelearning.org/fs/pages/sitemap` returned 406. https://www.yavapaicountyhighschool.com/ returned HTTP 200, `https://www.yavapaicountyhighschool.com/sitemap.xml` returned HTTP 200 but only exposed generic pages and handbook/document leaves, `https://www.yavapaicountyhighschool.com/documents/` returned HTTP 200 with no role-bearing content, and `/page/504/`, `/page/special-education/`, and `/page/student-services/` all returned 404 while `/page/contact-us/` remained public. Arizona education therefore remains blocked because the reviewed public domains still expose no local role-bearing special-education, student-services, or 504 leaf.
- county_local_disability_resources: des_roots_still_challenged_and_ahcccs_altcs_html_plus_county_map_still_lack_county_to_office_contract :: Reviewed 2026-06-23 bounded Arizona county-local fallback pages after the earlier DES challenge findings and the official AHCCCS PDF lane. The DES host family remains challenge-blocked on the known office-locator and benefits roots. The accessible AHCCCS fallback lane is live and stronger than previously recorded: https://www.azahcccs.gov/members/ALTCSlocations.html returned HTTP 200 and its raw HTML preserved seven named ALTCS office cards for Chinle, Flagstaff, Kingman, Phoenix, Prescott Valley, Tucson, and Yuma. The official ALTCS County Map PDF is also partially parseable and preserves Arizona county names, but it still does not attach those counties to office addresses, phones, or a repeatable county-to-office assignment contract. https://www.azahcccs.gov/shared/AHCCCScontacts.html and https://www.azahcccs.gov/Members/AlreadyCovered/MemberResources/ALTCS.html remain statewide contact and program-guidance leaves rather than county-specific office assignments. Arizona therefore still lacks a reviewable official county-to-office routing contract.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.azahcccs.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.azahcccs.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.azed.gov/specialeducation
- district_or_county_education_routing: blocked_three_reviewed_public_district_domains_live_surface_recheck_still_without_role_leafs; samples=10; first=https://www.ccasdaz.org/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://des.az.gov/ddd
- protection_and_advocacy: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://encirclefamilies.org/about-us/acknowledgements/
- legal_aid: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://www.azahcccs.gov
- county_local_disability_resources: blocked_des_challenge_plus_altcs_html_and_county_map_without_county_contract; samples=5; first=https://www.azahcccs.gov/Resources/OversightOfHealthPlans/UniversityFamilyCare.html

## Next actions

- [critical] district_or_county_education_routing: hold_three_reviewed_public_domains_until_role_bearing_special_education_student_services_or_504_leaves_exist
- [critical] county_local_disability_resources: hold_blocked_until_des_clears_or_ahcccs_publishes_county_to_office_assignments_in_reviewable_html_or_parseable_admin_artifacts

## Completion decision

- Arizona remains BLOCKED and not index-safe.
- Education is now source-final for low-token work on exactly three live public district domains: their homepages plus robots/sitemap inventories expose no role-bearing special-education or student-services leafs.
- County/local disability resources remain blocked separately because the DES host family is still challenge-blocked and the accessible AHCCCS fallback only proves seven named ALTCS office cards plus a partially parseable county map, not a county-to-office contract.
