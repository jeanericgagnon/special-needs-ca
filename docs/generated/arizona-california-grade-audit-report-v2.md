# Arizona California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 15
- primary_gap_reason: azed_host_challenged_and_ahcccs_county_mapping_still_requires_pdf_extraction_or_reviewed_county_admin_leaves

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
- county_local_disability_resources: blocked_html_offices_verified_but_county_pdf_contract_unparsed (Arizona county-local routing is blocked on evidence extraction, not on source discovery alone. The accessible AHCCCS HTML lane already preserves seven named ALTCS offices, but it does not name the counties they serve, while the remaining official county-map and county-admin artifacts are image-heavy PDFs that the current local toolchain does not extract into reviewable county text.)

## Failure ledger

- district_or_county_education_routing: azed_host_blocks_root_robots_and_sitemap_so_district_leafs_must_come_from_district_sites :: Reviewed 2026-06-22 bounded live official Arizona education probes across the existing statewide root https://www.azed.gov/specialeducation plus host-level discovery surfaces https://www.azed.gov/robots.txt and https://www.azed.gov/sitemap.xml. All three returned HTTP 403 with the Cloudflare "Just a moment..." challenge shell, and the previously checked likely replacement leaves https://www.azed.gov/school-district-web-sites/, https://www.azed.gov/asd/school-district-web-sites/, https://www.azed.gov/exceptionalstudentservices/, and https://www.azed.gov/ess did the same. The current DB inventory remains placeholder-only at 15/15 statewide AZED fallback rows, so Arizona education cannot reopen on AZED-host discovery and now requires district-owned leaf authoring.
- county_local_disability_resources: ahcccs_html_office_lane_is_live_but_county_mapping_remains_trapped_in_image_pdfs :: Reviewed 2026-06-22 bounded live official Arizona AHCCCS county-local artifacts after the earlier DES/AHCCCS host split. The live ALTCS Offices HTML leaf now proves seven named official offices on the accessible AHCCCS host: Chinle, Flagstaff, Kingman, Phoenix, Prescott, Tucson, and Yuma. But the fetched HTML does not preserve counties served or a county-to-office contract. The remaining county-specific official artifacts are the AHCCCS ALTCS County Map PDF and county-admin PDFs such as CountyAdminOffice.pdf and PimaCountyAdmin.pdf, and both fetched as image-heavy PDFs in the current local toolchain with no usable county/admin text extraction. DES remains fully challenge-blocked at root, robots.txt, sitemap.xml, and office-locator leaves, so Arizona still has no reviewable DES county-office lane. That leaves the county-local family blocked not by a total source void but by unparsed official county-mapping PDFs and unreviewed county-admin leaves on the accessible AHCCCS host.

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
- county_local_disability_resources: blocked_html_offices_verified_but_county_pdf_contract_unparsed; samples=8; first=https://des.az.gov/

## Next actions

- [critical] district_or_county_education_routing: author_district_owned_special_education_or_student_services_leaves_from_local_district_sites_not_azed
- [critical] county_local_disability_resources: parse_or_manually_review_ahcccs_county_map_and_county_admin_pdfs_before_rewriting_arizona_county_rows

## Repair decision

- Arizona remains BLOCKED and not index-safe.
- Education is still a district-owned leaf authoring problem because the AZED host blocks the statewide root, robots.txt, sitemap.xml, and the obvious statewide replacement leaves.
- County-local is now sharper than a generic “partial official artifact” blocker: the accessible AHCCCS HTML lane already proves seven named ALTCS offices, but county mapping still sits in image-heavy PDFs and unreviewed county-admin leaves.
- Arizona should only reopen when district-owned education leaves and a reviewable county-to-office contract are attached from these exact official surfaces rather than from statewide placeholders.
