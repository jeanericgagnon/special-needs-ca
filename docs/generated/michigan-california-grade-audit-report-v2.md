# Michigan California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 83
- primary_gap_reason: official_mde_arcgis_school_map_exposes_geometry_only_and_mdhhs_region_pages_cover_78_counties_plus_one_combined_leaf

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_mde_arcgis_map_without_local_routing_contract (The official Michigan Schools and Districts ArcGIS app is public and its reviewed map data exposes district and ISD layers with fields such as FIPSCODE, NAME, DCODE, and ISD, but the public contract still preserves no district routing contacts, district-owned special-education leaves, or county-to-district routing table.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed first-party PTI evidence is present at the required authority level)
- legal_aid: verified_state_grade (Reviewed Michigan Legal Help first-party homepage preserves a statewide legal-help and legal-aid access route.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_mdhhs_region_pages_partial_county_leaf_coverage (The official MDHHS county-offices root plus the reviewed region pages now expose 78 distinct county leaf URLs plus one combined Emmet/Charlevoix leaf, but the bounded public lane still does not preserve a full 83-county contract because Alger, Alpena, Ingham, Lenawee, and St. Joseph remain unmatched.)

## Failure ledger

- district_or_county_education_routing: official_mde_arcgis_school_map_exposes_geometry_without_local_routing_contract :: The official Michigan Schools and Districts ArcGIS app is public and its reviewed map data exposes district and ISD layers with fields such as FIPSCODE, NAME, DCODE, and ISD, but the public contract still preserves no district routing contacts, district-owned special-education leaves, or county-to-district routing table for California-grade local education proof.
- county_local_disability_resources: mdhhs_region_pages_expose_78_county_leafs_plus_one_combined_leaf_but_not_full_83_county_contract :: The official MDHHS county-offices root plus the reviewed East, Northern Mid-Michigan, U.P. and Northern Michigan, Urban Counties, and West Michigan region pages now expose 78 distinct county leaf URLs plus one combined Emmet/Charlevoix leaf, but the reviewed public lane still does not preserve a complete 83-county contract: Alger, Alpena, Ingham, Lenawee, and St. Joseph remain unmatched from the bounded region-page extraction.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.michigan.gov/mdhhs/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.michigan.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.michigan.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.michigan.gov/mde/services/special-education
- district_or_county_education_routing: blocked_mde_arcgis_map_without_local_routing_contract; samples=4; first=https://www.detroitk12.org/admin/exceptional_education
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.michigan.gov/mdhhs
- protection_and_advocacy: verified_state_grade; samples=1; first=https://drmich.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.michiganallianceforfamilies.org/
- legal_aid: verified_state_grade; samples=1; first=https://michiganlegalhelp.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/ssi
- county_local_disability_resources: blocked_mdhhs_region_pages_partial_county_leaf_coverage; samples=4; first=https://www.michigan.gov/mdhhs/inside-mdhhs/county-offices

## Next actions

- [critical] district_or_county_education_routing: hold_blocked_until_official_district_or_isd_routing_contract_exists
- [critical] county_local_disability_resources: author_or_capture_remaining_mdhhs_county_leafs_from_official_region_pages_and_composite_directory

## Completion decision

- Michigan remains `BLOCKED` and `index_safe=false`.
- Legal aid is now repaired through Michigan Legal Help.
- Education routing remains blocked because the reviewed official MDE ArcGIS map app only preserves geometry and district/ISD identifiers, not local routing contacts or a county-to-district routing contract.
- County/local disability resources remain blocked because the reviewed MDHHS root and region pages expose 78 distinct county leaf URLs plus one combined Emmet/Charlevoix leaf, but the public contract still leaves Alger, Alpena, Ingham, Lenawee, and St. Joseph unmatched.
