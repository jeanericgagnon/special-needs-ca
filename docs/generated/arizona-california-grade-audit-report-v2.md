# Arizona California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 15
- primary_gap_reason: azed_host_challenged_and_ahcccs_county_mapping_now_narrows_to_admin_pdf_ocr_or_reviewed_admin_leaves

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_zero_exact_leaf_packet (Arizona education remains blocked because the official AZED host challenges not only the statewide special-education root but also robots.txt and sitemap.xml, leaving 15/15 current district rows stuck on one statewide fallback URL. Exact district-routing proof must now come from district-owned leaves, not from further AZED-host probing.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed live first-party PTI designation text is present on the Encircle Families acknowledgements page)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_altcs_county_text_partial_admin_mapping_unresolved (Arizona county-local routing is no longer blocked on total PDF unreadability. The official ALTCS county map PDF yields machine-readable county enrollment text on the bundled pypdf lane, proving the AHCCCS PDF surface is partly parseable, but it still does not preserve a county-to-office address and phone contract. The remaining CountyAdminOffice and PimaCountyAdmin PDFs are still image-only in the current lane, so county-grade office routing remains blocked on admin-office OCR or reviewed HTML admin leaves rather than on source discovery alone.)

## Failure ledger

- district_or_county_education_routing: azed_host_blocks_root_robots_and_sitemap_so_district_leafs_must_come_from_district_sites :: Reviewed 2026-06-22 bounded live official Arizona education probes across the existing statewide root https://www.azed.gov/specialeducation plus host-level discovery surfaces https://www.azed.gov/robots.txt and https://www.azed.gov/sitemap.xml. All three returned HTTP 403 with the Cloudflare "Just a moment..." challenge shell, and the previously checked likely replacement leaves https://www.azed.gov/school-district-web-sites/, https://www.azed.gov/asd/school-district-web-sites/, https://www.azed.gov/exceptionalstudentservices/, and https://www.azed.gov/ess did the same. The current DB inventory remains placeholder-only at 15/15 statewide AZED fallback rows, so Arizona education cannot reopen on AZED-host discovery and now requires district-owned leaf authoring.
- county_local_disability_resources: ahcccs_county_map_pdf_yields_county_text_but_admin_office_mapping_still_requires_ocr_or_reviewed_leaves :: Reviewed 2026-06-22 bounded official Arizona AHCCCS county-local artifacts again using the bundled workspace Python runtime. The live ALTCS Offices HTML leaf still proves seven named official offices on the accessible AHCCCS host: Chinle, Flagstaff, Kingman, Phoenix, Prescott, Tucson, and Yuma. The official ALTCS County Map PDF is not fully image-only after all: bundled pypdf extraction preserves county names such as Yuma, Mohave, La Paz, Gila, Santa Cruz, Cochise, Graham, Maricopa, Pinal, Apache, Navajo, Coconino, Yavapai, Greenlee, and Pima alongside ALTCS enrollment text. But that county-map artifact still does not preserve office addresses, phones, or a county-to-office assignment contract. The remaining official CountyAdminOffice.pdf and PimaCountyAdmin.pdf artifacts still did not yield reviewable county/admin text in the current lane, and DES remains challenge-blocked at root, robots.txt, sitemap.xml, and office-locator leaves. Arizona county-local routing therefore narrows to admin-office OCR or reviewed AHCCCS admin leaves, not to generic source discovery.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.azahcccs.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.azahcccs.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.azed.gov/specialeducation
- district_or_county_education_routing: blocked_zero_exact_leaf_packet; samples=4; first=https://www.azed.gov/specialeducation
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://des.az.gov/ddd
- protection_and_advocacy: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://encirclefamilies.org/about-us/acknowledgements/
- legal_aid: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://www.azahcccs.gov
- county_local_disability_resources: blocked_altcs_county_text_partial_admin_mapping_unresolved; samples=8; first=https://des.az.gov/

## Next actions

- [critical] district_or_county_education_routing: author_district_owned_special_education_or_student_services_leaves_from_local_district_sites_not_azed
- [critical] county_local_disability_resources: ocr_or_review_ahcccs_county_admin_pdfs_or_equivalent_admin_leaves_before_rewriting_arizona_county_rows

## Repair decision

- Arizona remains BLOCKED and not index-safe.
- Education is still a district-owned leaf authoring problem because the AZED host blocks the statewide root, robots.txt, sitemap.xml, and the obvious statewide replacement leaves.
- County-local is now narrower than a generic PDF parser blocker: the official ALTCS county map is partially text-extractable, but the county-to-office assignment still lives in unreviewed admin PDFs or equivalent AHCCCS admin leaves.
- Arizona should only reopen when district-owned education leaves and a reviewable county-to-office contract are attached from these exact official surfaces rather than from statewide placeholders.
