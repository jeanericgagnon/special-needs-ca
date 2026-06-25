# Arizona California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 15
- primary_gap_reason: ahcccs_university_familycare_html_lane_replays_only_pdf_admin_artifacts_and_azed_remaining_three_public_domains_still_lack_role_leaves

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_three_reviewed_public_domains_official_api_and_exact_slug_exhausted_without_role_leafs (Arizona education remains blocked only on 3/15 counties whose public district domains are live but fully exhausted even after one more official API and exact-slug pass. Coconino County Accommodation School District returned HTTP 200 on the district root and official WordPress JSON search, but the wp-json search for `special education` only replayed false-positive Governing Board and staff records while the official page/post sitemaps still exposed zero role-bearing paths. Mohave Accelerated Schools stayed live on the district-owned root, but exact Finalsite-style role candidates such as `/fs/pages/504`, `/fs/pages/special-education`, `/fs/pages/student-services`, and `/fs/pages/special-services` all returned 404. Yavapai Accommodation School District proved its `/page/` namespace is live because `/page/contact-us/` returned HTTP 200, but `/page/special-education/`, `/page/student-services/`, and `/page/504/` all returned 404. The remaining Arizona education blocker is therefore source-final on three reviewed public domains that still lack role-bearing local leaves.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed live first-party PTI designation text is present on the Encircle Families acknowledgements page)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_ahcccs_html_lane_replays_only_pdf_admin_artifacts_without_county_contract (Arizona county-local routing is now blocked on a fully bounded official artifact contract, not on an undiscovered HTML lane. The public AHCCCS UniversityFamilyCare oversight page is live and reviewable, but its county-relevant links only replay the same PDF artifacts already in the blocker set: `Pima.pdf`, `PimaCountyAdmin.pdf`, and `CountyAdminOffice.pdf`. Those PDFs still do not yield reviewable county/admin office text in the current repo/runtime, and the current toolchain still lacks `tesseract`, `pdftotext`, `pdftoppm`, `pypdf`, `PyPDF2`, `pdfplumber`, `fitz`, `pdfminer`, `PIL`, and `pdf2image`. DES remains challenge-blocked at root, robots.txt, sitemap.xml, and office-locator leaves. Arizona therefore still lacks a truthful county-to-office contract, and the AHCCCS HTML lane itself is now exhausted into PDFs rather than hidden admin leaves.)

## Failure ledger

- district_or_county_education_routing: three_reviewed_public_district_domains_exhaust_sitemaps_wp_api_and_exact_slug_replays_without_role_leafs :: Reviewed 2026-06-23 one more bounded Arizona district-owned official API and exact-slug pass for the final three unresolved education counties. https://www.ccasdaz.org/ stayed live, and https://www.ccasdaz.org/wp-json/wp/v2/search?search=special%20education&per_page=10 returned HTTP 200, but the official WordPress search only replayed false-positive Governing Board and staff records rather than a role-bearing special-education or student-services leaf; the official page-sitemap.xml and post-sitemap.xml still exposed zero matching role paths. https://www.mohavelearning.org/ stayed live, but exact Finalsite-style role candidates at /fs/pages/504, /fs/pages/special-education, /fs/pages/student-services, and /fs/pages/special-services all returned 404. https://www.yavapaicountyhighschool.com/ stayed live and its /page/contact-us/ route returned HTTP 200, proving the public page namespace is real, but /page/special-education/, /page/student-services/, and /page/504/ all returned 404. The remaining Arizona education blocker is now source-final on three reviewed public domains that still lack role-bearing local leaves even after sitemap, API, and exact-slug replay.
- county_local_disability_resources: ahcccs_university_familycare_html_page_replays_only_pdf_admin_artifacts_without_html_county_contract :: Reviewed 2026-06-24 bounded official Arizona AHCCCS county-local artifacts plus the live HTML oversight family. The public AHCCCS page https://www.azahcccs.gov/Resources/OversightOfHealthPlans/UniversityFamilyCare.html returned HTTP 200 and explicitly linked `Pima Community Access Program`, `Pima County Administrator's Office`, and `County Administrator's Office`. But those exact county-relevant links only replay to the same PDF artifacts already in the blocker set: https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/Pima.pdf, https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/PimaCountyAdmin.pdf, and https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/CountyAdminOffice.pdf. The current repo/runtime still has no installed OCR or reviewable PDF text stack for those files: tesseract, pdftotext, pdftoppm, pypdf, PyPDF2, pdfplumber, fitz, pdfminer, PIL, and pdf2image are absent or not importable. DES also remains challenge-blocked at root, robots.txt, sitemap.xml, and office-locator leaves. Arizona county-local routing therefore now narrows to a committed OCR artifact or a new official HTML county-admin surface, not to more AHCCCS HTML discovery.

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
- county_local_disability_resources: blocked_ahcccs_html_lane_replays_only_pdf_admin_artifacts_without_county_contract; samples=4; first=https://www.azahcccs.gov/Resources/OversightOfHealthPlans/UniversityFamilyCare.html

## Next actions

- [critical] district_or_county_education_routing: hold_three_reviewed_public_domains_until_role_bearing_special_education_or_student_services_leaves_exist
- [critical] county_local_disability_resources: keep_county_local_blocked_until_committed_ocr_artifact_or_new_official_html_county_admin_surface_exists

## Repair decision

- Arizona remains BLOCKED and not index-safe.
- Education remains source-final on three reviewed public district domains that still lack role-bearing local leaves.
- County-local is now stricter than before: the official AHCCCS HTML oversight lane is public, but it only replays the same PDF county-admin artifacts and still does not supply a reviewable county-to-office contract in HTML.
- Arizona should only reopen when a committed OCR artifact or a new official HTML county-admin surface exists, alongside any newly published district-owned education leaves.
