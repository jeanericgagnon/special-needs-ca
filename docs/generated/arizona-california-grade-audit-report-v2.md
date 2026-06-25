# Arizona California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 15
- primary_gap_reason: ahcccs_county_local_contract_still_missing_and_arizona_education_now_resolves_coconino_via_caviat_504_but_mohave_alt_leaf_still_needs_official_county_attachment_and_yavapai_still_lacks_role_leaf

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_coconino_caviat_504_resolved_mohave_alt_leaf_candidate_and_yavapai_public_domain_without_role_leaf (Reviewed 2026-06-25 one more bounded official Arizona alternative-district pass from the live AZ School Report Cards inventory. Coconino County is no longer limited to the accommodation-district root: the official detail API for Coconino Association for Vocation Industry and Technology (`educationOrganizationId 79381`) preserved `https://www.caviat.org/`, phone `928-645-2737`, and `19 Poplar Street, Page, AZ 86040`, and the official Census geocoder still resolved that address to Coconino County. The same official CAVIAT host now exposes a live `/page/504/` leaf whose rendered text preserves CAVIAT annual public nondiscrimination language plus district office contact details, which is enough to attach a local 504 route for Coconino. Mohave County also no longer bottoms out only in `mohavelearning.org`: the official detail API for Mohave Valley Elementary District (`educationOrganizationId 4379`) preserved `https://www.mvesd16.org/`, and that district-owned host now exposes a live `SPECIAL SERVICES` page plus a public `documents/special-education/3674` surface. But the same bounded official Census geocoder lane still fails to resolve the Mohave Valley address to a county in this pass, so that Mohave alternative remains a reviewed local-leaf candidate rather than a county-attached verified replacement. Yavapai Accommodation School District remains the only fully source-final local domain in the family: its public sitemap still exposes only generic pages and handbook/document leaves, and no role-bearing `504`, `special-education`, or `student-services` leaf is public. Arizona education therefore improves, but remains blocked on one still-empty reviewed public domain plus one Mohave alternative leaf that still needs official county attachment.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed live first-party PTI designation text is present on the Encircle Families acknowledgements page)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_des_challenge_plus_altcs_html_and_county_map_without_county_contract (Reviewed 2026-06-23 the live Arizona county-local fallback pages more tightly. The DES root, apply-benefits, Family Assistance Administration, FAA, office-locator, contact, robots.txt, and sitemap lanes are still Cloudflare 403 shells. The accessible AHCCCS fallback lane is public and preserves seven named ALTCS office cards in raw HTML for Chinle, Flagstaff, Kingman, Phoenix, Prescott Valley, Tucson, and Yuma, and the official ALTCS county map PDF is partly parseable for county names, but neither artifact provides a county-to-office table or county assignment contract. Arizona therefore still lacks county-grade official office routing.)

## Failure ledger

- district_or_county_education_routing: coconino_caviat_504_verified_mohave_alt_leaf_found_but_unattached_and_yavapai_still_lacks_role_leaf :: Reviewed 2026-06-25 a bounded official Arizona alternative-district lane from the live AZ School Report Cards app and exact district-owned same-domain leaves. `https://azreportcards.azed.gov/api/Entity/GetEntity?id=79381&fiscalYear=2025` preserved Coconino Association for Vocation Industry and Technology with `https://www.caviat.org/`, phone `928-645-2737`, and `19 Poplar Street, Page, AZ 86040`; the official Census geocoder still resolved that address to Coconino County; `https://www.caviat.org/wp-sitemap.xml` stayed live; and `https://www.caviat.org/page/504/` returned HTTP 200 with rendered annual public nondiscrimination language plus district office contact details, which is enough to attach a local 504 route for Coconino County. `https://azreportcards.azed.gov/api/Entity/GetEntity?id=4379&fiscalYear=2025` preserved Mohave Valley Elementary District with `https://www.mvesd16.org/`, phone `928-768-2507`, and `8450 S OLIVE AVE, MOHAVE VALLEY, AZ 86440-9214`; that district-owned host now exposes a live `https://www.mvesd16.org/page/special-services/` leaf plus a public `https://www.mvesd16.org/documents/special-education/3674` surface, but the bounded official Census geocoder still returned no match for the Mohave Valley address, so the alternative Mohave leaf remains candidate-only in this pass. `https://www.yavapaicountyhighschool.com/sitemap.xml` still exposed only generic pages plus handbook/document leaves, with no role-bearing `504`, `special-education`, or `student-services` URL. Arizona education therefore no longer fails equally across the old three-domain set, but it still cannot clear county grade while Mohave lacks official county attachment for the alternative leaf and Yavapai still lacks a role-bearing local leaf entirely.
- county_local_disability_resources: des_roots_still_challenged_and_ahcccs_altcs_html_plus_county_map_still_lack_county_to_office_contract :: Reviewed 2026-06-23 bounded Arizona county-local fallback pages after the earlier DES challenge findings and the official AHCCCS PDF lane. The DES host family remains challenge-blocked on the known office-locator and benefits roots. The accessible AHCCCS fallback lane is live and stronger than previously recorded: https://www.azahcccs.gov/members/ALTCSlocations.html returned HTTP 200 and its raw HTML preserved seven named ALTCS office cards for Chinle, Flagstaff, Kingman, Phoenix, Prescott Valley, Tucson, and Yuma. The official ALTCS County Map PDF is also partially parseable and preserves Arizona county names, but it still does not attach those counties to office addresses, phones, or a repeatable county-to-office assignment contract. https://www.azahcccs.gov/shared/AHCCCScontacts.html and https://www.azahcccs.gov/Members/AlreadyCovered/MemberResources/ALTCS.html remain statewide contact and program-guidance leaves rather than county-specific office assignments. Arizona therefore still lacks a reviewable official county-to-office routing contract.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.azahcccs.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.azahcccs.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.azed.gov/specialeducation
- district_or_county_education_routing: blocked_coconino_caviat_504_resolved_mohave_alt_leaf_candidate_and_yavapai_public_domain_without_role_leaf; samples=8; first=https://azreportcards.azed.gov/districts/Detail/79381
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://des.az.gov/ddd
- protection_and_advocacy: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://encirclefamilies.org/about-us/acknowledgements/
- legal_aid: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://www.azahcccs.gov
- county_local_disability_resources: blocked_des_challenge_plus_altcs_html_and_county_map_without_county_contract; samples=5; first=https://www.azahcccs.gov/Resources/OversightOfHealthPlans/UniversityFamilyCare.html

## Next actions

- [critical] district_or_county_education_routing: verify_mohave_alt_leaf_with_official_county_attachment_and_hold_yavapai_until_role_bearing_leaf_exists
- [critical] county_local_disability_resources: hold_blocked_until_des_clears_or_ahcccs_publishes_county_to_office_assignments_in_reviewable_html_or_parseable_admin_artifacts

## Repair decision

- Arizona remains BLOCKED and not index-safe.
- Education is narrower than the prior three-domain dead-end. Coconino now clears through the official CAVIAT root plus its live 504 leaf, Mohave has a stronger alternate district-owned special-services leaf that still needs official county attachment in this lane, and Yavapai remains the only still-empty reviewed public district domain.
- County-local remains blocked because the exact official AHCCCS PDF bundle is reviewable but still only proves non-contract support letters rather than county-to-office routing.
- Arizona should only reopen county-local when a real official county-admin contract, office directory, service-area table, or county-to-office crosswalk exists. Education should only reopen further if Mohave gains official county attachment for the alternative leaf or Yavapai publishes a real role-bearing local leaf.
