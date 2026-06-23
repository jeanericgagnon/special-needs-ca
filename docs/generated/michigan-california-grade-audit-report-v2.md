# Michigan California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 92
- county_count: 83
- primary_gap_reason: official_mde_isd_plans_page_is_guidance_only_and_arcgis_layers_still_lack_local_routing_contract

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_mde_arcgis_map_without_local_routing_contract (Reviewed 2026-06-22/2026-06-23 the official Michigan MDE education lane more tightly: the live Special Education page and sitemap surface an exact ISD Plans leaf, but that page only publishes statewide planning guidance, a webinar link, and the generic school-district ArcGIS map. It does not enumerate district-owned special-education leaves, county-to-ISD routing, ISD contact directories, or a local education routing contract. The public ArcGIS district and ISD layers still expose geometry and identifier fields only, and the DB still carries 83 generic county fallback rows cloned from the statewide MDE Office of Special Education root, so Michigan remains blocked on district_or_county_education_routing.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed first-party PTI evidence is present at the required authority level)
- legal_aid: verified_state_grade (Reviewed Michigan Legal Help first-party homepage preserves a statewide legal-help and legal-aid access route.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_county_grade (Reviewed 2026-06-22 the official MDHHS county-offices root, the East Michigan, Urban Counties, U.P. and Northern Michigan, and West Michigan region pages, and the exact missing county leaves for Alger, Alpena, Ingham, Lenawee, and St. Joseph. Those reviewed first-party leaf pages close the previous 78-county plus one combined-leaf contract and now preserve a full 83-county official MDHHS county-office lane.)

## Failure ledger

- district_or_county_education_routing: official_mde_arcgis_school_map_exposes_geometry_without_local_routing_contract :: Reviewed 2026-06-22/2026-06-23 the official Michigan MDE Special Education page, sitemap, ISD Plans leaf, and public ArcGIS district/ISD map stack. The exact leaf https://www.michigan.gov/mde/services/special-education/program-planning/isd-plans is live, titled "ISD Plans," and links only to statewide guidance PDF, a webinar, and the generic School District Maps app. It does not publish an ISD-by-ISD directory, county-to-ISD contract, district-owned special-education routing leaves, or local routing contacts. The public ArcGIS district and ISD layers still expose geometry and identifiers like FIPSCODE, DCODE, and ISD/ISDCode without routing contacts or local special-education evidence. A bounded DB check also shows 83 `official_verified` Michigan school_district rows named `Michigan Department of Education - Office of Special Education (<County> County fallback)` that all reuse the same statewide source URL `https://www.michigan.gov/mde/services/special-education`; those cloned statewide fallback rows do not satisfy county-grade routing evidence. Michigan therefore cannot pass county-grade education routing.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.michigan.gov/mdhhs/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.michigan.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.michigan.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.michigan.gov/mde/services/special-education
- district_or_county_education_routing: blocked_mde_arcgis_map_without_local_routing_contract; samples=5; first=https://www.detroitk12.org/admin/exceptional_education
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

- County-local disability resources still pass at county grade from the reviewed MDHHS county-office leaves.
- District or county education routing remains blocked because the live MDE education lane now proves only statewide ISD-planning guidance plus a generic ArcGIS district/ISD map, not a county-grade local routing contract.
- A bounded DB check also confirms the remaining 83 Michigan school-district rows are cloned `County fallback` records pointing at the statewide MDE special-education root, so they cannot be treated as local-routing coverage.
- Michigan therefore remains `BLOCKED` and `index_safe=false` until the education-routing blocker is replaced with county-grade official routing evidence.
