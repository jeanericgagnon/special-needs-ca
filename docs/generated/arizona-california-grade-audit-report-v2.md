# Arizona California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 92
- county_count: 15
- primary_gap_reason: des_roots_still_challenged_and_ahcccs_altcs_html_plus_county_map_still_lack_county_to_office_contract

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_county_grade (Reviewed 2026-06-25 one more bounded official Arizona alternative-district lane from the live AZ School Report Cards inventory plus exact district-owned leaves. Coconino County remains cleared through the official CAVIAT detail route and live `https://www.caviat.org/page/504/` leaf. Mohave County now also clears: the official Arizona report-cards detail API for Mohave Valley Elementary District (`educationOrganizationId 4379`) preserved exact coordinates (`latitude 34.9104059`, `longitude -114.6000147`), and the official Census reverse geocoder at `https://geocoding.geo.census.gov/geocoder/geographies/coordinates` returns `Mohave County` from those coordinates. The same district-owned host preserves a live `https://www.mvesd16.org/page/special-services/` leaf plus a public `https://www.mvesd16.org/documents/special-education/3674` surface. Yavapai County also clears through a better official LEA than the prior dead-end accommodation root: the public Arizona report-cards entity list exposes Prescott Unified District (`educationOrganizationId 4466`) in Prescott, its detail API preserves exact coordinates (`latitude 34.5423444`, `longitude -112.4651411`), and the official Census reverse geocoder returns `Yavapai County` from those coordinates. The same district-owned host preserves a live `https://www.prescottschools.com/district-info/departments/ess` page titled `Exceptional Student Services` with rendered `Special Education`, `Procedural Safeguards`, and `Child Find` language, plus a public `Parents Rights Handbook` page on the same host. Arizona district_or_county_education_routing therefore now clears at county grade through reviewed official local leaves across all remaining counties.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed live first-party PTI designation text is present on the Encircle Families acknowledgements page)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_des_challenge_plus_altcs_html_and_county_map_without_county_contract (Reviewed 2026-06-25 the live Arizona county-local fallback pages more tightly. The DES root, apply-benefits, Family Assistance Administration, FAA, office-locator, contact, robots.txt, and sitemap lanes are still Cloudflare 403 shells. The accessible AHCCCS fallback lane is still public and preserves seven named ALTCS office cards in raw HTML for Chinle, Flagstaff, Kingman, Phoenix, Prescott Valley, Tucson, and Yuma. The exact official county-map artifact at `https://www.azahcccs.gov/PlansProviders/Downloads/ALTCS_CountyMap.pdf` is still live as a PDF and remains partly parseable for county names, but it still does not publish a county-to-office table or county assignment contract. The AHCCCS contacts page remains a statewide contact leaf, while the older `Members/AlreadyCovered/MemberResources/ALTCS.html` path now returns an AHCCCS `Page/Document not found` shell rather than a usable county-local fallback. Arizona therefore still lacks county-grade official office routing.)

## Failure ledger

- county_local_disability_resources: des_roots_still_challenged_and_ahcccs_altcs_html_plus_county_map_still_lack_county_to_office_contract :: Reviewed 2026-06-23 bounded Arizona county-local fallback pages after the earlier DES challenge findings and the official AHCCCS PDF lane. The DES host family remains challenge-blocked on the known office-locator and benefits roots. The accessible AHCCCS fallback lane is live and stronger than previously recorded: https://www.azahcccs.gov/members/ALTCSlocations.html returned HTTP 200 and its raw HTML preserved seven named ALTCS office cards for Chinle, Flagstaff, Kingman, Phoenix, Prescott Valley, Tucson, and Yuma. The official ALTCS County Map PDF is also partially parseable and preserves Arizona county names, but it still does not attach those counties to office addresses, phones, or a repeatable county-to-office assignment contract. https://www.azahcccs.gov/shared/AHCCCScontacts.html and https://www.azahcccs.gov/Members/AlreadyCovered/MemberResources/ALTCS.html remain statewide contact and program-guidance leaves rather than county-specific office assignments. Arizona therefore still lacks a reviewable official county-to-office routing contract.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.azahcccs.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.azahcccs.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.azed.gov/specialeducation
- district_or_county_education_routing: verified_county_grade; samples=7; first=https://azreportcards.azed.gov/districts/Detail/79381
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://des.az.gov/ddd
- protection_and_advocacy: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://encirclefamilies.org/about-us/acknowledgements/
- legal_aid: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://www.azahcccs.gov
- county_local_disability_resources: blocked_des_challenge_plus_altcs_html_and_county_map_without_county_contract; samples=5; first=https://www.azahcccs.gov/members/ALTCSlocations.html

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_des_clears_or_ahcccs_publishes_county_to_office_assignments_in_reviewable_html_or_parseable_admin_artifacts

## Repair decision

- Arizona remains BLOCKED and not index-safe.
- Education now clears at county grade: Coconino remains covered through CAVIAT, Mohave clears through Mohave Valley Elementary plus official reverse-geocoded county attachment, and Yavapai clears through Prescott Unified plus a district-owned Exceptional Student Services leaf and Parents Rights Handbook.
- County-local remains the sole blocker because the public DES lane is still challenged and the accessible AHCCCS ALTCS artifacts still stop short of a county-to-office assignment contract.
- Arizona should only reopen next on county-local unless a stronger official office-routing contract appears.

