# Michigan California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 92
- county_count: 83
- primary_gap_reason: official_mde_arcgis_school_map_exposes_geometry_without_local_routing_contract

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
- county_local_disability_resources: verified_county_grade (Reviewed 2026-06-22 the official MDHHS county-offices root, the East Michigan, Urban Counties, U.P. and Northern Michigan, and West Michigan region pages, and the exact missing county leaves for Alger, Alpena, Ingham, Lenawee, and St. Joseph. Those reviewed first-party leaf pages close the previous 78-county plus one combined-leaf contract and now preserve a full 83-county official MDHHS county-office lane.)

## Failure ledger

- district_or_county_education_routing: official_mde_arcgis_school_map_exposes_geometry_without_local_routing_contract :: The official Michigan Schools and Districts ArcGIS app is public and its reviewed map data exposes district and ISD layers with fields such as FIPSCODE, NAME, DCODE, and ISD, but the public contract still preserves no district routing contacts, district-owned special-education leaves, or county-to-district routing table for California-grade local education proof.

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
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_county_grade; samples=6; first=https://www.michigan.gov/mdhhs/inside-mdhhs/county-offices

## Next actions

- [critical] district_or_county_education_routing: hold_blocked_until_official_district_or_isd_routing_contract_exists

## Completion decision

- County-local disability resources now pass at county grade because the official MDHHS region pages and the newly reviewed exact leaves for Alger, Alpena, Ingham, Lenawee, and St. Joseph close the last five unmatched counties from the prior bounded extraction.
- District or county education routing remains blocked because the reviewed official MDE ArcGIS app still exposes only geometry and identifiers, not district-owned special-education leaves, routing contacts, or a county-to-district routing contract.
- Michigan therefore remains `BLOCKED` and `index_safe=false` until the education-routing blocker is replaced with county-grade official routing evidence.
