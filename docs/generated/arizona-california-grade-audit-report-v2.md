# Arizona California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 15
- primary_gap_reason: azed_host_challenged_and_ahcccs_sitemap_exposes_no_county_office_contract

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_zero_exact_leaf_packet (Arizona education remains blocked because the official AZED host challenges not only the statewide special-education root but also robots.txt and sitemap.xml, leaving 15/15 current district rows stuck on one statewide fallback URL. The on-disk district leaf authoring packet still shows authoredExactLeafCount=0 for all 15 affected counties, so exact district-routing proof must still come from district-owned leaves, not from further AZED-host probing.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed live first-party PTI designation text is present on the Encircle Families acknowledgements page)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_ahcccs_accessible_host_without_county_office_contract (Arizona county-local routing is no longer blocked on total PDF unreadability. The official ALTCS county map PDF yields machine-readable county enrollment text on the bundled PDF lane, but it still does not preserve a county-to-office address and phone contract. Rendered first-page review shows the cited CountyAdminOffice and PimaCountyAdmin PDFs are county-administrator support letters to AHCCCS rather than county office-directory artifacts, a bounded filter over the live AHCCCS sitemap surfaced no overlooked county-office locator leaves beyond those same known artifacts, and the county-local authoring packet still shows authoredExactLeafCount=0 with only DOI and legacy placeholder rows across the 15 affected counties.)

## Failure ledger

- district_or_county_education_routing: azed_host_blocks_root_robots_and_sitemap_so_district_leafs_must_come_from_district_sites :: Reviewed 2026-06-22 bounded live official Arizona education probes across the existing statewide root https://www.azed.gov/specialeducation plus host-level discovery surfaces https://www.azed.gov/robots.txt and https://www.azed.gov/sitemap.xml. All three returned HTTP 403 with the Cloudflare "Just a moment..." challenge shell, and the previously checked likely replacement leaves https://www.azed.gov/school-district-web-sites/, https://www.azed.gov/asd/school-district-web-sites/, https://www.azed.gov/exceptionalstudentservices/, and https://www.azed.gov/ess did the same. The current DB inventory remains placeholder-only at 15/15 statewide AZED fallback rows, and the deterministic authoring packet already on disk (`data/generated/arizona_district_or_county_education_routing_leaf_authoring_packet_v1.json`) still shows authoredExactLeafCount=0 across Apache, Cochise, Coconino, Gila, Graham, Greenlee, La Paz, Maricopa, Mohave, Navajo, Pima, Pinal, Santa Cruz, Yavapai, and Yuma. Arizona education therefore cannot reopen on AZED-host discovery and still requires district-owned leaf authoring.
- county_local_disability_resources: ahcccs_accessible_host_exposes_only_county_map_and_support_letters_no_office_contract :: Reviewed 2026-06-22 bounded official Arizona AHCCCS county-local artifacts again using the bundled workspace PDF runtime plus one rendered first-page check on the two cited admin PDFs, then re-checked the live AHCCCS sitemap and reconciled the result against the deterministic county-local authoring packet on disk. The live ALTCS Offices HTML leaf still proves seven named official offices on the accessible AHCCCS host: Chinle, Flagstaff, Kingman, Phoenix, Prescott, Tucson, and Yuma. The official ALTCS County Map PDF is not fully image-only after all: bundled pdfplumber extraction preserves county names such as Yuma, Mohave, La Paz, Gila, Santa Cruz, Cochise, Graham, Maricopa, Pinal, Apache, Navajo, Coconino, Yavapai, Greenlee, and Pima alongside ALTCS enrollment text. But that county-map artifact still does not preserve office addresses, phones, or a county-to-office assignment contract. Rendered first-page review shows CountyAdminOffice.pdf and PimaCountyAdmin.pdf are county-administrator support letters to AHCCCS rather than county office-directory artifacts. A bounded filter over the live AHCCCS sitemap surfaced no overlooked county-office locator leaves beyond the known ALTCS county map and county-admin/support-letter PDFs. DES remains challenge-blocked at root, robots.txt, sitemap.xml, and office-locator leaves. The county-local authoring packet still shows authoredExactLeafCount=0, 14 DOI placeholder county rows, and 1 generic legacy locator row across the 15 affected counties.

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
- county_local_disability_resources: blocked_ahcccs_accessible_host_without_county_office_contract; samples=9; first=https://des.az.gov/

## Next actions

- [critical] district_or_county_education_routing: author_district_owned_special_education_or_student_services_leaves_from_local_district_sites_not_azed (packet: `data/generated/arizona_district_or_county_education_routing_leaf_authoring_packet_v1.json`)
- [critical] county_local_disability_resources: hold_blocked_until_reviewable_ahcccs_or_des_county_to_office_contract_exists

## Repair decision

- Arizona remains BLOCKED and not index-safe.
- Education is still a district-owned leaf authoring problem because the AZED host blocks the statewide root, robots.txt, sitemap.xml, and the obvious statewide replacement leaves, while the on-disk deterministic authoring packet still has zero authored exact district leaves for the 15 affected counties.
- County-local is now narrower than a generic OCR blocker: the official ALTCS county map is partially text-extractable, the cited admin PDFs are support-letter artifacts rather than county office directories, a bounded filter over the live AHCCCS sitemap surfaced no overlooked county-office locator leaf, and the current county-local authoring packet still has zero exact county leaves. The missing piece is still a real county-to-office contract on AHCCCS or DES surfaces.
- Arizona should only reopen when district-owned education leaves and a reviewable county-to-office contract are attached from these exact official surfaces rather than from statewide placeholders.
