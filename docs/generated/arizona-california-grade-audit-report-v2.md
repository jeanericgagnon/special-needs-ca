# Arizona California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 15
- primary_gap_reason: official_roots_challenged_and_local_leaf_packets_authored_but_unverified

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_official_education_root_challenge_and_county_fallback_only_rows (Reviewed 2026-06-22 live Arizona Department of Education special-education candidates. The root, parental-rights, dispute-resolution, az-find, ESSO, publications, contact, robots.txt, and sitemap URLs all returned the Cloudflare "Just a moment..." HTTP 403 shell. The live school_district table still contains 15/15 Arizona rows pointing at https://www.azed.gov/specialeducation as generic county fallback evidence, but a county-by-county local leaf authoring packet now exists on disk at data/generated/arizona_district_or_county_education_routing_leaf_authoring_packet_v1.json so later repairs can target district-owned leaves instead of re-reading the challenged state root.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed live first-party PTI designation text is present on the Encircle Families acknowledgements page)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_official_local_office_roots_challenge_and_doi_fallback_rows (Reviewed 2026-06-22 live Arizona DES candidates. The root, apply-benefits, Family Assistance Administration, FAA, office-locator, contact, robots.txt, and sitemap URLs all returned the Cloudflare "Just a moment..." HTTP 403 shell. The live county_offices table still contains 14 Arizona rows anchored to the DOI FAA placeholder https://doi.org/10.7910/DVN/AVRHMI and 1 row anchored to the generic legacy root https://dhhs.arizona.gov/locations, but a county-by-county local office authoring packet now exists on disk at data/generated/arizona_county_local_disability_resources_leaf_authoring_packet_v1.json so later repairs can replace those fallback rows with reviewed county-specific leaves.)

## Failure ledger

- district_or_county_education_routing: official_education_root_challenge_and_county_fallback_only_rows :: Reviewed 2026-06-22 live Arizona Department of Education special-education candidates. The root, parental-rights, dispute-resolution, az-find, ESSO, publications, contact, robots.txt, and sitemap URLs all returned the Cloudflare "Just a moment..." HTTP 403 shell. The live school_district table still contains 15/15 Arizona rows pointing at https://www.azed.gov/specialeducation as generic county fallback evidence, but a county-by-county local leaf authoring packet now exists on disk at data/generated/arizona_district_or_county_education_routing_leaf_authoring_packet_v1.json so later repairs can target district-owned leaves instead of re-reading the challenged state root.
- county_local_disability_resources: official_local_office_roots_challenge_and_doi_fallback_rows :: Reviewed 2026-06-22 live Arizona DES candidates. The root, apply-benefits, Family Assistance Administration, FAA, office-locator, contact, robots.txt, and sitemap URLs all returned the Cloudflare "Just a moment..." HTTP 403 shell. The live county_offices table still contains 14 Arizona rows anchored to the DOI FAA placeholder https://doi.org/10.7910/DVN/AVRHMI and 1 row anchored to the generic legacy root https://dhhs.arizona.gov/locations, but a county-by-county local office authoring packet now exists on disk at data/generated/arizona_county_local_disability_resources_leaf_authoring_packet_v1.json so later repairs can replace those fallback rows with reviewed county-specific leaves.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.azahcccs.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.azahcccs.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.azed.gov/specialeducation
- district_or_county_education_routing: blocked_official_education_root_challenge_and_county_fallback_only_rows; samples=3; first=https://www.azed.gov/specialeducation
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://des.az.gov/ddd
- protection_and_advocacy: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://encirclefamilies.org/about-us/acknowledgements/
- legal_aid: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://www.azahcccs.gov
- county_local_disability_resources: blocked_official_local_office_roots_challenge_and_doi_fallback_rows; samples=3; first=https://des.az.gov/

## Next actions

- [critical] district_or_county_education_routing: use_authored_arizona_education_leaf_packet_to_collect_district_owned_leaves
- [critical] county_local_disability_resources: use_authored_arizona_county_local_packet_to_collect_county_specific_office_leaves

## Repair decision

- Arizona remains BLOCKED and not index-safe.
- The official state education and DES roots are still challenged, so this pass did not claim local proof.
- The missing control-plane gap is now closed: both blocked families have deterministic Arizona leaf authoring packets on disk so later bounded repairs can target exact district-owned or county-specific leaves instead of generic fallbacks.
