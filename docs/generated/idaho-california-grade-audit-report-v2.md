# Idaho California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 44
- primary_gap_reason: official_local_directories_exist_but_live_rows_still_lack_county_mapped_replacements

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_official_district_directory_without_county_mapping (Reviewed 2026-06-22 official Idaho SDE district routing sources: https://www.sde.idaho.gov/school-districts/, https://www.sde.idaho.gov/about-us/departments/special-education/, https://www.sde.idaho.gov/about-us/our-staff/special-education/, and https://www.sde.idaho.gov/about-us/departments/special-education/parent-resources/, plus live school_district DB rows. The official SDE stack now clearly preserves a real district directory: the public /school-districts/ page exposes 106 district website links. But the reviewed fetched markup still exposes no county-mapped fields or county-to-district contract, and the live DB inventory is still 44/44 statewide placeholders that reuse statewide SDE URLs rather than reviewed county-mapped or district-owned special-education routing leaves.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (Reviewed Idaho Parents Unlimited About page now preserves explicit Idaho Parent Training and Information Center designation text, while the Connect With Us page preserves statewide contact routing and Boise office details.)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_official_office_leaves_without_county_mapping (Reviewed 2026-06-22 official Idaho DHW office routing sources: https://healthandwelfare.idaho.gov/offices, https://healthandwelfare.idaho.gov/contact-us, the official DHW sitemap, and live county_offices DB rows. The official office stack is stronger than the current packet implied: the sitemap now exposes 23 exact DHW office leaves. But the public /offices page still exposes no county-to-office mapping contract in fetched content, and the live DB table remains placeholder-backed: 27 county rows still use the dead legacy locator https://dhhs.idaho.gov/locations while the other 18 still point to the generic Medicaid page https://healthandwelfare.idaho.gov/services-programs/medicaid-health instead of exact office leaves.)

## Failure ledger

- district_or_county_education_routing: official_sde_district_directory_exists_but_no_county_mapped_special_education_contract :: Reviewed 2026-06-22 current official Idaho SDE sources including https://www.sde.idaho.gov/school-districts/, https://www.sde.idaho.gov/about-us/departments/special-education/, https://www.sde.idaho.gov/about-us/our-staff/special-education/, and https://www.sde.idaho.gov/about-us/departments/special-education/parent-resources/, plus the live school_district DB rows. The official /school-districts/ page exposes 106 district website links, proving local district leaves exist. But the fetched public markup exposes no county header, district header, address header, website header, phone header, or other county-mapped table contract, and the live DB inventory is still 44/44 statewide placeholders: every Idaho school_district row still reuses a statewide SDE URL rather than a reviewed county-mapped or district-owned routing leaf.
- county_local_disability_resources: official_dhw_office_leaves_exist_but_live_rows_still_lack_county_to_office_mapping :: Reviewed 2026-06-22 current official Idaho DHW sources including https://healthandwelfare.idaho.gov/offices, https://healthandwelfare.idaho.gov/contact-us, and the official sitemap https://healthandwelfare.idaho.gov/sitemap.xml, plus live county_offices DB rows. The official sitemap exposes 23 exact office leaves such as /dhw/boise-office-westgate-building, /dhw/caldwell-office, and /dhw/idaho-falls-office, proving local office leaves exist. But the fetched public /offices page still exposes no county-to-office mapping contract, while 27 live county rows still use the dead legacy locator https://dhhs.idaho.gov/locations and the other 18 still point to the generic Medicaid page https://healthandwelfare.idaho.gov/services-programs/medicaid-health rather than exact office leaves.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://healthandwelfare.idaho.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.idaho.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.idaho.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.sde.idaho.gov/sped/
- district_or_county_education_routing: blocked_official_district_directory_without_county_mapping; samples=4; first=https://www.sde.idaho.gov/school-districts/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://healthandwelfare.idaho.gov
- protection_and_advocacy: verified_state_grade; samples=1; first=https://disabilityrightsidaho.org/
- parent_training_information_center: verified_state_grade; samples=2; first=https://ipulidaho.org/about_ipul/
- legal_aid: verified_state_grade; samples=1; first=https://disabilityrightsidaho.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_official_office_leaves_without_county_mapping; samples=4; first=https://healthandwelfare.idaho.gov/sitemap.xml

## Next actions

- [critical] district_or_county_education_routing: author_county_mapped_district_routing_from_official_directory_or_hold_blocked
- [critical] county_local_disability_resources: author_exact_county_to_office_mappings_from_official_office_leaves_or_hold_blocked

## Completion decision

- Idaho remains BLOCKED and not index-safe.
- Education is no longer blocked because local leaves are absent; it is blocked because the official district directory is not county-mapped and the live school rows still reuse statewide placeholders.
- County-local is no longer blocked because exact office leaves are unknown; it is blocked because the office leaves are not mapped back to counties in public source and the live county rows still point at placeholder URLs.
