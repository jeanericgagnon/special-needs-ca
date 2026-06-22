# Arizona California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 15
- primary_gap_reason: challenged_official_roots_and_db_inventory_still_placeholder_only

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_zero_exact_leaf_packet (The Arizona education packet still contains 0 exact district-owned leaves, and the current DB inventory is still only statewide fallback coverage: 15/15 Arizona school_district rows point at the same challenged https://www.azed.gov/specialeducation root instead of district-owned special-education leaves. The obvious official replacement roots https://www.azed.gov/school-district-web-sites/, https://www.azed.gov/asd/school-district-web-sites/, https://www.azed.gov/exceptionalstudentservices/, and https://www.azed.gov/ess also returned the same Cloudflare challenge shell in bounded live checks. Until exact district-owned special-education or student-services targets are authored, the family remains blocked on statewide placeholders rather than on a runnable local repair queue.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed live first-party PTI designation text is present on the Encircle Families acknowledgements page)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_zero_exact_leaf_packet (The Arizona county-local office packet still contains 0 exact office leaves, and the current DB inventory is still placeholder-only: 14/15 Arizona county_offices rows point at the DOI-derived FAA placeholder through https://www.azahcccs.gov/ and the remaining 1/15 row points at the generic legacy root https://dhhs.arizona.gov/locations. The obvious official replacement roots https://des.az.gov/office-locator, https://des.az.gov/services/basic-needs/apply-for-benefits/where-to-apply, and https://des.az.gov/find-your-local-office all returned the same Cloudflare challenge shell, while companion AHCCCS guesses https://www.azahcccs.gov/Members/GetCovered/Categories/where.html and https://www.azahcccs.gov/AHCCCS/Downloads/FFA.pdf returned 200 "Page/Document not found" shells. Until the stale county-root inventory is replaced with live official office roots or exact leaves, the family remains blocked on statewide placeholders rather than on a trustworthy local repair queue.)

## Failure ledger

- district_or_county_education_routing: education_packet_scaffold_only_zero_exact_district_leaves :: Reviewed 2026-06-22 bounded live probes of Arizona Department of Education replacement candidates for district routing plus the current Arizona school_district DB rows. The existing statewide root https://www.azed.gov/specialeducation still returns the Cloudflare "Just a moment..." shell, and the likely replacement leaves https://www.azed.gov/school-district-web-sites/, https://www.azed.gov/asd/school-district-web-sites/, https://www.azed.gov/exceptionalstudentservices/, and https://www.azed.gov/ess also each returned HTTP 403 with cf-mitigated: challenge. The live DB inventory is still placeholder-only: 15/15 Arizona school_district rows point at the same statewide AZED root and are labeled as county fallback coverage rather than district-owned evidence pages. The authored packet at data/generated/arizona_district_or_county_education_routing_leaf_authoring_packet_v1.json still reports authoredExactLeafCount=0 across 15 affected counties, so no district-owned Arizona special-education or student-services leaf has yet been attached to the repair queue.
- county_local_disability_resources: county_office_packet_empty_and_county_root_inventory_nonresolving :: Reviewed 2026-06-22 bounded live probes of Arizona local-office replacement candidates plus the current Arizona county_offices DB rows. Apache, Cochise, Coconino, Gila, Graham, La Paz, Mohave, Navajo, Pima, Pinal, Santa Cruz, Yavapai, and Yuma still rely on a DOI-derived FAA placeholder row through https://www.azahcccs.gov/, Greenlee still points at the generic legacy root https://dhhs.arizona.gov/locations, and Maricopa still lacks a reviewed county-specific official office leaf. The likely DES office replacements https://des.az.gov/office-locator, https://des.az.gov/services/basic-needs/apply-for-benefits/where-to-apply, and https://des.az.gov/find-your-local-office also each returned HTTP 403 with cf-mitigated: challenge, and the companion AHCCCS guesses https://www.azahcccs.gov/Members/GetCovered/Categories/where.html plus https://www.azahcccs.gov/AHCCCS/Downloads/FFA.pdf returned 200 "Page/Document not found" shells. The authored packet at data/generated/arizona_county_local_disability_resources_leaf_authoring_packet_v1.json still reports authoredExactLeafCount=0, so the county-local repair queue cannot yet be truthfully seeded from either the stale county-root inventory or the reviewed replacement roots.

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
- Education is still blocked because 15/15 current Arizona district rows are the same challenged statewide ADE fallback URL, and no district-owned special-education leaf has been authored for any county.
- County-local is still blocked because the current office inventory is still 14 DOI/AHCCCS placeholder rows plus 1 generic legacy locator row, and the reviewed DES/AHCCCS replacement roots remain challenge or not-found shells rather than county-grade office leaves.
- Arizona should only reopen these families once exact district-owned or county-specific first-party targets are authored, not by retrying the same statewide placeholders or challenged roots.
