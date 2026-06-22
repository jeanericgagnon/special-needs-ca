# Arizona California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 15
- primary_gap_reason: challenged_official_roots_zero_exact_education_leaves_and_nonresolving_county_root_inventory

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_zero_exact_leaf_packet (The Arizona education packet still contains 0 exact district-owned leaves, and the obvious official replacement roots are now exhausted too: https://www.azed.gov/school-district-web-sites/, https://www.azed.gov/asd/school-district-web-sites/, https://www.azed.gov/exceptionalstudentservices/, and https://www.azed.gov/ess all returned the same Cloudflare challenge shell in bounded live checks. Until exact district-owned special-education or student-services targets are authored, the family remains blocked on generic statewide fallback rows rather than on a runnable local repair queue.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed live first-party PTI designation text is present on the Encircle Families acknowledgements page)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_zero_exact_leaf_packet (The Arizona county-local office packet still contains 0 exact office leaves, and the obvious official replacement roots are now exhausted too: https://des.az.gov/office-locator, https://des.az.gov/services/basic-needs/apply-for-benefits/where-to-apply, and https://des.az.gov/find-your-local-office all returned the same Cloudflare challenge shell, while companion AHCCCS guesses https://www.azahcccs.gov/Members/GetCovered/Categories/where.html and https://www.azahcccs.gov/AHCCCS/Downloads/FFA.pdf returned 200 "Page/Document not found" shells. Until the stale county-root inventory is replaced with live official office roots or exact leaves, the family remains blocked on DOI and generic locator fallback rows rather than on a trustworthy local repair queue.)

## Failure ledger

- district_or_county_education_routing: education_packet_scaffold_only_zero_exact_district_leaves :: Reviewed 2026-06-22 bounded live probes of Arizona Department of Education replacement candidates for district routing. The existing statewide root https://www.azed.gov/specialeducation still returns the Cloudflare "Just a moment..." shell, and the likely replacement leaves https://www.azed.gov/school-district-web-sites/, https://www.azed.gov/asd/school-district-web-sites/, https://www.azed.gov/exceptionalstudentservices/, and https://www.azed.gov/ess also each returned HTTP 403 with cf-mitigated: challenge. The authored packet at data/generated/arizona_district_or_county_education_routing_leaf_authoring_packet_v1.json still reports authoredExactLeafCount=0 across 15 affected counties, so no district-owned Arizona special-education or student-services leaf has yet been attached to the repair queue.
- county_local_disability_resources: county_office_packet_empty_and_county_root_inventory_nonresolving :: Reviewed 2026-06-22 bounded live probes of Arizona local-office replacement candidates. Apache, Cochise, Coconino, Gila, Graham, Greenlee, La Paz, Mohave, Navajo, Pima, Pinal, Santa Cruz, Yavapai, and Yuma still fail DNS resolution on their stored `*-az.gov` roots, while Maricopa returns HTTP 403. The likely DES office replacements https://des.az.gov/office-locator, https://des.az.gov/services/basic-needs/apply-for-benefits/where-to-apply, and https://des.az.gov/find-your-local-office also each returned HTTP 403 with cf-mitigated: challenge, and the companion AHCCCS guesses https://www.azahcccs.gov/Members/GetCovered/Categories/where.html plus https://www.azahcccs.gov/AHCCCS/Downloads/FFA.pdf returned 200 "Page/Document not found" shells. The authored packet at data/generated/arizona_county_local_disability_resources_leaf_authoring_packet_v1.json still reports authoredExactLeafCount=0, so the county-local repair queue cannot yet be truthfully seeded from either the stale county-root inventory or the reviewed replacement roots.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.azahcccs.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.azahcccs.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.azed.gov/specialeducation
- district_or_county_education_routing: blocked_zero_exact_leaf_packet; samples=3; first=https://www.azed.gov/specialeducation
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://des.az.gov/ddd
- protection_and_advocacy: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://encirclefamilies.org/about-us/acknowledgements/
- legal_aid: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://www.azahcccs.gov
- county_local_disability_resources: blocked_zero_exact_leaf_packet; samples=3; first=https://des.az.gov/

## Next actions

- [critical] district_or_county_education_routing: author_exact_district_owned_special_education_leaves_before_reopening_arizona_education
- [critical] county_local_disability_resources: replace_nonresolving_county_root_seeds_before_authoring_arizona_county_local_leaves

## Repair decision

- Arizona remains BLOCKED and not index-safe.
- Education is still blocked because the packet has zero district-owned exact leaves, and the obvious AZED replacement roots now also prove out as challenge shells rather than runnable district-routing surfaces.
- County-local is still blocked because the stale county-root inventory is mostly dead, the DES office-locator guesses are also challenge-blocked, and the companion AHCCCS guesses are only 200 Page/Document not found shells.
- Arizona should only reopen these families once exact district-owned or county-specific first-party targets are authored, not by retrying the same challenged or not-found roots.
