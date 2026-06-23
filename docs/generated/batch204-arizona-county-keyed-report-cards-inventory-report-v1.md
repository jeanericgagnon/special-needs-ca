# Arizona California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 15
- primary_gap_reason: des_host_challenge_plus_county_keyed_report_cards_roots_without_district_owned_special_education_leaves

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_county_keyed_report_cards_roots_without_district_owned_special_education_leaves (The official AZ School Report Cards host now preserves a county-keyed Arizona district-root inventory through its district detail API plus official-address geocoding, but Arizona is still not county-grade because no district-owned special-education or student-services leaves have been verified from those local district roots.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed live first-party PTI designation text is present on the Encircle Families acknowledgements page)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_ahcccs_accessible_host_without_county_office_contract (Reviewed 2026-06-22 live Arizona DES candidates. The root, apply-benefits, Family Assistance Administration, FAA, office-locator, contact, robots.txt, and sitemap URLs all returned the Cloudflare "Just a moment..." HTTP 403 shell. The live county_offices table currently contains 14 Arizona rows still anchored to the DOI FAA placeholder https://doi.org/10.7910/DVN/AVRHMI and 1 row still anchored to the generic legacy root https://dhhs.arizona.gov/locations, and no authored Arizona county-office leaf packet is currently present on disk to replace them.)

## Failure ledger

- district_or_county_education_routing: official_report_cards_district_roots_county_keyed_but_no_district_owned_special_education_leaves_verified :: Reviewed 2026-06-23 bounded official Arizona report-cards checks and then materialized a county-keyed district-root inventory from the live /api/Entity/GetEntityList inventory plus exact /api/Entity/GetEntity?id=<educationOrganizationId>&fiscalYear=2025 detail responses. A bounded official Census geocoder pass over district detail addresses now yields one reviewed district root for all 15 Arizona counties, with first-party district website, phone, and address fields preserved on the official report-cards host. Arizona education is no longer blocked by missing county-keyed district roots; it is now blocked because those county-keyed district roots still do not have reviewed district-owned special-education or student-services leaves attached. Counties covered: apache-az, cochise-az, coconino-az, gila-az, graham-az, greenlee-az, la-paz-az, maricopa-az, mohave-az, navajo-az, pima-az, pinal-az, santa-cruz-az, yavapai-az, yuma-az.
- county_local_disability_resources: ahcccs_accessible_host_exposes_only_county_map_and_support_letters_no_office_contract :: Reviewed 2026-06-22 live Arizona DES candidates. The root, apply-benefits, Family Assistance Administration, FAA, office-locator, contact, robots.txt, and sitemap URLs all returned the Cloudflare "Just a moment..." HTTP 403 shell. The live county_offices table currently contains 14 Arizona rows still anchored to the DOI FAA placeholder https://doi.org/10.7910/DVN/AVRHMI and 1 row still anchored to the generic legacy root https://dhhs.arizona.gov/locations, and no authored Arizona county-office leaf packet is currently present on disk to replace them.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.azahcccs.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.azahcccs.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.azed.gov/specialeducation
- district_or_county_education_routing: blocked_county_keyed_report_cards_roots_without_district_owned_special_education_leaves; samples=17; first=https://azreportcards.azed.gov/api/Entity/GetEntityList
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://des.az.gov/ddd
- protection_and_advocacy: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://encirclefamilies.org/about-us/acknowledgements/
- legal_aid: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://www.azahcccs.gov
- county_local_disability_resources: blocked_ahcccs_accessible_host_without_county_office_contract; samples=9; first=https://des.az.gov/

## Next actions

- [critical] district_or_county_education_routing: author_district_owned_special_education_leaves_from_county_keyed_report_cards_roots
- [critical] county_local_disability_resources: author_reviewed_county_specific_office_leaves_before_reopening_browser_lane

## Completion decision

- Arizona remains BLOCKED and not index-safe.
- Education is sharper again: the official report-cards app now yields one county-keyed district root for all 15 Arizona counties through reviewed district detail responses plus bounded official geocoding, so the remaining education work is exact district-owned special-education or student-services leaf verification.
- County/local disability resources are still blocked separately because the DES office lane remains challenge-blocked and the accessible AHCCCS artifacts still do not preserve a county-to-office contract.

