# Arizona California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 15
- primary_gap_reason: official_browser_challenge_and_generic_local_fallbacks

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_official_education_root_challenge_and_county_fallback_only_rows (Reviewed 2026-06-22 Arizona Department of Education special-education root plus robots.txt and sitemap endpoints. The leaf, root, robots.txt, and sitemap URLs all returned Cloudflare security-verification or 403 shells, while the current 15 Arizona school_district rows still point at https://www.azed.gov/specialeducation as generic county fallback evidence rather than district-owned pages.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed live first-party PTI designation text is present on the Encircle Families acknowledgements page)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_official_local_office_roots_challenge_and_doi_fallback_rows (Reviewed 2026-06-22 Arizona DES root plus robots.txt and sitemap endpoints. The root, robots.txt, and sitemap URLs all returned Cloudflare security-verification or 403 shells, while 14 Arizona county_office rows still rely on the DOI FAA placeholder https://doi.org/10.7910/DVN/AVRHMI and one row still points at the generic legacy locations root https://dhhs.arizona.gov/locations instead of reviewed county-specific official office leaves.)

## Failure ledger

- district_or_county_education_routing: official_education_root_challenge_and_county_fallback_only_rows :: Reviewed 2026-06-22 Arizona Department of Education special-education root plus robots.txt and sitemap endpoints. The leaf, root, robots.txt, and sitemap URLs all returned Cloudflare security-verification or 403 shells, while the current 15 Arizona school_district rows still point at https://www.azed.gov/specialeducation as generic county fallback evidence rather than district-owned pages.
- county_local_disability_resources: official_local_office_roots_challenge_and_doi_fallback_rows :: Reviewed 2026-06-22 Arizona DES root plus robots.txt and sitemap endpoints. The root, robots.txt, and sitemap URLs all returned Cloudflare security-verification or 403 shells, while 14 Arizona county_office rows still rely on the DOI FAA placeholder https://doi.org/10.7910/DVN/AVRHMI and one row still points at the generic legacy locations root https://dhhs.arizona.gov/locations instead of reviewed county-specific official office leaves.

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

- [critical] district_or_county_education_routing: hold_blocked_until_district_owned_exact_targets_or_browser_rehydrated_state_directory_exist
- [critical] county_local_disability_resources: hold_blocked_until_reviewed_county_specific_office_leaves_replace_doi_or_generic_fallback_rows

## Completion decision

- Arizona now has reviewed live first-party PTI designation evidence on Encircle Families, so Parent Training and Information Center is no longer a blocker.
- Arizona still cannot reach California-grade or become index-safe because district or county education routing still depends on statewide fallback evidence while the official AZED domain is challenged across the root, leaf, robots.txt, and sitemap endpoints, and county/local disability resources still depend on DOI or generic locator rows while the official DES domain is challenged across the root, robots.txt, and sitemap endpoints.
- Arizona is therefore still BLOCKED and not index-safe, but the final blockers are now limited to the two county- or district-grade local-proof families.

## Evidence checks

- Parent training and information center: Reviewed 2026-06-22 live Encircle Families acknowledgements page at https://encirclefamilies.org/about-us/acknowledgements/. The fetched first-party page explicitly says Encircle Families is Arizona’s Parent Training and Information (PTI) Center and cites IDEA Part D grant support, so the PTI family is now verified from live first-party designation text rather than inferred family-support scope.
- Education routing: Reviewed 2026-06-22 Arizona Department of Education special-education root plus robots.txt and sitemap endpoints. The leaf, root, robots.txt, and sitemap URLs all returned Cloudflare security-verification or 403 shells, while the current 15 Arizona school_district rows still point at https://www.azed.gov/specialeducation as generic county fallback evidence rather than district-owned pages.
- County/local disability resources: Reviewed 2026-06-22 Arizona DES root plus robots.txt and sitemap endpoints. The root, robots.txt, and sitemap URLs all returned Cloudflare security-verification or 403 shells, while 14 Arizona county_office rows still rely on the DOI FAA placeholder https://doi.org/10.7910/DVN/AVRHMI and one row still points at the generic legacy locations root https://dhhs.arizona.gov/locations instead of reviewed county-specific official office leaves.
