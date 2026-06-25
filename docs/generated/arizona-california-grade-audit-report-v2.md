# Arizona California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 15
- primary_gap_reason: ahcccs_university_familycare_pdf_bundle_now_proves_non_contract_support_letters_and_azed_remaining_three_public_domains_still_lack_role_leaves

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
- county_local_disability_resources: blocked_ahcccs_pdf_bundle_resolves_to_support_letters_without_county_contract (Reviewed 2026-06-25 the exact official Arizona AHCCCS UniversityFamilyCare PDF bundle with the current bundled PDF runtime instead of relying on the older missing-parser assumption. The oversight page https://www.azahcccs.gov/Resources/OversightOfHealthPlans/UniversityFamilyCare.html still points to three county-relevant PDFs: `Pima.pdf`, `PimaCountyAdmin.pdf`, and `CountyAdminOffice.pdf`. The current bundled runtime can now parse or render those files, and the result is stronger but still blocking: `Pima.pdf` is text-extractable and reads as a support letter from Michal Goforth of Pima Community Access Program backing the University Family Care merger, not as a county office directory or routing contract. `PimaCountyAdmin.pdf` and `CountyAdminOffice.pdf` render as image-based letters on Pima County Administrator letterhead to AHCCCS Director Tom Betlach, dated September 5, 2014, offering support for the University Family Care merger. Those PDFs preserve county and administrator identity, but they still do not expose county-to-office routing, office assignments, service areas, or a county-admin contact contract that can clear county-local disability resources. DES remains challenge-blocked on its office surfaces, so Arizona county-local routing is now source-final on non-contract support letters rather than on a missing PDF toolchain.)

## Failure ledger

- district_or_county_education_routing: three_reviewed_public_district_domains_exhaust_sitemaps_wp_api_and_exact_slug_replays_without_role_leafs :: Reviewed 2026-06-23 one more bounded Arizona district-owned official API and exact-slug pass for the final three unresolved education counties. https://www.ccasdaz.org/ stayed live, and https://www.ccasdaz.org/wp-json/wp/v2/search?search=special%20education&per_page=10 returned HTTP 200, but the official WordPress search only replayed false-positive Governing Board and staff records rather than a role-bearing special-education or student-services leaf; the official page-sitemap.xml and post-sitemap.xml still exposed zero matching role paths. https://www.mohavelearning.org/ stayed live, but exact Finalsite-style role candidates at /fs/pages/504, /fs/pages/special-education, /fs/pages/student-services, and /fs/pages/special-services all returned 404. https://www.yavapaicountyhighschool.com/ stayed live and its /page/contact-us/ route returned HTTP 200, proving the public page namespace is real, but /page/special-education/, /page/student-services/, and /page/504/ all returned 404. The remaining Arizona education blocker is now source-final on three reviewed public domains that still lack role-bearing local leaves even after sitemap, API, and exact-slug replay.
- county_local_disability_resources: ahcccs_university_familycare_pdf_bundle_is_parseable_but_only_support_letters_not_county_admin_routing_contract :: Reviewed 2026-06-25 exact official Arizona AHCCCS PDF artifacts from https://www.azahcccs.gov/Resources/OversightOfHealthPlans/UniversityFamilyCare.html using the bundled Codex runtime PDF stack (`pypdf`, `pdfplumber`, `pdfminer`, `pdfinfo`, and `pdftoppm`). `Pima.pdf` returned HTTP 200, extracted cleanly as text, and proved to be a support letter from Michal Goforth, Executive Director of Pima Community Access Program, supporting the University Family Care merger. `PimaCountyAdmin.pdf` and `CountyAdminOffice.pdf` both returned HTTP 200, produced no embedded text via `pypdf`, but rendered cleanly to page images that show Pima County Administrator's Office letterhead, county address `130 W. Congress, Floor 10, Tucson, AZ 85701-1317`, phone `(520) 724-8661`, and a support letter to AHCCCS Director Tom Betlach dated September 5, 2014. None of the three official PDFs is a county office directory, county-admin routing table, service-area crosswalk, or county-to-office contract. DES office surfaces remain challenge-blocked. Arizona county-local therefore remains blocked because the reviewed official PDF bundle is non-contract evidence, not because the PDF parser lane is missing.

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
- county_local_disability_resources: blocked_ahcccs_pdf_bundle_resolves_to_support_letters_without_county_contract; samples=5; first=https://www.azahcccs.gov/Resources/OversightOfHealthPlans/UniversityFamilyCare.html

## Next actions

- [critical] district_or_county_education_routing: hold_three_reviewed_public_domains_until_role_bearing_special_education_or_student_services_leaves_exist
- [critical] county_local_disability_resources: hold_county_local_until_new_official_html_or_pdf_county_contract_exists_not_support_letters

## Repair decision

- Arizona remains BLOCKED and not index-safe.
- Education remains source-final on the remaining three reviewed public district domains that still lack role-bearing local leaves.
- County-local is now blocked for a stronger reason: the exact official AHCCCS PDF bundle is reviewable with the current bundled runtime, but the files are support letters rather than county-routing contracts.
- Arizona should only reopen county-local when a real official county-admin contract, office directory, service-area table, or county-to-office crosswalk exists.
