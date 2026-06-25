# Arizona California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 15
- primary_gap_reason: azed_host_challenged_and_ahcccs_county_mapping_requires_reviewed_admin_html_leaves_or_explicit_ocr_artifact

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
- county_local_disability_resources: blocked_admin_mapping_artifact_missing (Arizona county-local routing is now blocked on the missing admin-mapping artifact itself, not on generic source discovery. The official ALTCS county map PDF is partially text-extractable and the AHCCCS host still exposes named ALTCS office leaves, but the county-to-office contract remains trapped in CountyAdminOffice and PimaCountyAdmin PDFs that the current repo/runtime cannot OCR or rasterize. Without reviewed AHCCCS admin HTML leaves or a committed OCR artifact, county-grade office routing cannot be truthfully rewritten.)

## Failure ledger

- district_or_county_education_routing: three_reviewed_public_district_domains_exhaust_sitemaps_wp_api_and_exact_slug_replays_without_role_leafs :: Reviewed 2026-06-23 one more bounded Arizona district-owned official API and exact-slug pass for the final three unresolved education counties. https://www.ccasdaz.org/ stayed live, and https://www.ccasdaz.org/wp-json/wp/v2/search?search=special%20education&per_page=10 returned HTTP 200, but the official WordPress search only replayed false-positive Governing Board and staff records rather than a role-bearing special-education or student-services leaf; the official page-sitemap.xml and post-sitemap.xml still exposed zero matching role paths. https://www.mohavelearning.org/ stayed live, but exact Finalsite-style role candidates at /fs/pages/504, /fs/pages/special-education, /fs/pages/student-services, and /fs/pages/special-services all returned 404. https://www.yavapaicountyhighschool.com/ stayed live and its /page/contact-us/ route returned HTTP 200, proving the public page namespace is real, but /page/special-education/, /page/student-services/, and /page/504/ all returned 404. The remaining Arizona education blocker is now source-final on three reviewed public domains that still lack role-bearing local leaves even after sitemap, API, and exact-slug replay.
- county_local_disability_resources: ahcccs_county_mapping_requires_reviewed_admin_html_leaves_or_explicit_ocr_artifact :: Reviewed 2026-06-22 bounded official Arizona AHCCCS county-local artifacts plus the current local parser toolchain. The live ALTCS Offices HTML leaf still proves seven named official offices on the accessible AHCCCS host, and the official ALTCS County Map PDF still yields machine-readable county names in the bounded extraction lane. But the remaining CountyAdminOffice.pdf and PimaCountyAdmin.pdf artifacts still do not yield reviewable county/admin office text, and the current repo/runtime has no installed OCR or PDF raster tools for a deterministic low-token rescue lane: tesseract, pdftotext, and pdftoppm are absent on PATH, and pytesseract, pdf2image, and PIL are not importable. DES also remains challenge-blocked at root, robots.txt, sitemap.xml, and office-locator leaves. Arizona county-local routing therefore now narrows to reviewed AHCCCS admin HTML leaves or a separately committed OCR artifact, not to more pypdf retries or generic source discovery.

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
- county_local_disability_resources: blocked_admin_mapping_artifact_missing; samples=3; first=https://des.az.gov/

## Next actions

- [critical] district_or_county_education_routing: hold_three_reviewed_public_domains_until_role_bearing_special_education_or_student_services_leaves_exist
- [critical] county_local_disability_resources: attach_reviewed_ahcccs_admin_html_leaves_or_committed_ocr_artifact_before_rewriting_arizona_county_rows

## Repair decision

- Arizona remains BLOCKED and not index-safe.
- Education is still a district-owned leaf authoring problem because the AZED host blocks the statewide root, robots.txt, sitemap.xml, and the obvious statewide replacement leaves.
- County-local is now a tighter artifact-contract blocker: the official AHCCCS surfaces are partly readable, but the county-to-office assignment still depends on admin PDFs that the current repo/runtime cannot OCR or rasterize.
- Arizona should only reopen when district-owned education leaves and either reviewed AHCCCS admin HTML leaves or a committed OCR artifact supply the county-to-office contract.
