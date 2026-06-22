# Arizona California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 15
- primary_gap_reason: azed_and_des_hosts_challenged_but_ahcccs_exposes_partial_official_local_artifacts

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
- county_local_disability_resources: blocked_zero_exact_leaf_packet (Arizona county-local routing is no longer blocked on a total absence of official candidates: DES remains challenge-blocked even at robots.txt and sitemap.xml, but accessible AHCCCS artifacts now provide a partial official office lane through live AHCCCS contacts, ALTCS Offices, and county-map/admin PDFs. The family remains blocked because those official AHCCCS artifacts have not yet been translated into full county-grade office mapping for all 15 counties.)

## Failure ledger

- district_or_county_education_routing: azed_host_blocks_root_robots_and_sitemap_so_district_leafs_must_come_from_district_sites :: Reviewed 2026-06-22 bounded live official Arizona education probes across the existing statewide root https://www.azed.gov/specialeducation plus host-level discovery surfaces https://www.azed.gov/robots.txt and https://www.azed.gov/sitemap.xml. All three returned HTTP 403 with the Cloudflare "Just a moment..." challenge shell, and the previously checked likely replacement leaves https://www.azed.gov/school-district-web-sites/, https://www.azed.gov/asd/school-district-web-sites/, https://www.azed.gov/exceptionalstudentservices/, and https://www.azed.gov/ess did the same. The current DB inventory remains placeholder-only at 15/15 statewide AZED fallback rows, so Arizona education cannot reopen on AZED-host discovery and now requires district-owned leaf authoring.
- county_local_disability_resources: des_host_challenged_but_ahcccs_sitemap_exposes_partial_altcs_office_and_county_map_artifacts :: Reviewed 2026-06-22 bounded live official Arizona county-local probes across DES and AHCCCS hosts. The DES root and discovery surfaces https://des.az.gov/, https://des.az.gov/robots.txt, https://des.az.gov/sitemap.xml, https://des.az.gov/office-locator, https://des.az.gov/services/basic-needs/apply-for-benefits/where-to-apply, and https://des.az.gov/find-your-local-office all returned HTTP 403 with the Cloudflare "Just a moment..." challenge shell, so DES cannot currently seed exact office leaves. In contrast, the official AHCCCS host kept discovery open: https://www.azahcccs.gov/sitemap.xml and robots.txt returned 200, and the sitemap exposed live exact artifacts including https://www.azahcccs.gov/shared/AHCCCScontacts.html, https://www.azahcccs.gov/members/ALTCSlocations.html, https://www.azahcccs.gov/PlansProviders/Downloads/ALTCS_CountyMap.pdf, and county-admin PDFs such as https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/PimaCountyAdmin.pdf. The ALTCS Offices page preserves named official offices in Phoenix, Tucson, and Yuma, but the current lane still lacks parsed county-to-office mapping for all 15 counties, so the stale DOI and legacy-placeholder county rows cannot yet be replaced truthfully.

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
- county_local_disability_resources: blocked_zero_exact_leaf_packet; samples=6; first=https://des.az.gov/

## Next actions

- [critical] district_or_county_education_routing: author_district_owned_special_education_or_student_services_leaves_from_local_district_sites_not_azed
- [critical] county_local_disability_resources: extract_county_to_altcs_admin_mapping_from_accessible_ahcccs_office_and_county_map_artifacts_before_rewriting_county_rows

## Repair decision

- Arizona remains BLOCKED and not index-safe.
- Education is now a cleaner district-leaf authoring problem: the AZED host blocks the statewide root, robots.txt, and sitemap.xml, so further AZED-host discovery is not a useful lane.
- County-local is no longer a total-candidate void: DES remains blocked, but AHCCCS exposes live ALTCS office and county-map artifacts that can seed a narrower official county-mapping lane once parsed and attached to counties.
- Arizona should only reopen when district-owned education leaves and county-grade office mappings are attached from these exact official surfaces rather than from statewide placeholders.
