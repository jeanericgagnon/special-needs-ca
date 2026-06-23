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
- district_or_county_education_routing: blocked_mde_app_query_layers_without_local_routing_contract (Reviewed 2026-06-23 the official Michigan MDE ISD Plans leaf, the linked ArcGIS app config, and the exact public layers the app actually queries. The public app does not hide a separate contact export: it queries the ISD boundary layer, the school-district boundary layer, and a school-campus layer. The ISD and district layers still expose only boundary and identifier fields, while the school layer adds campus street/city/ZIP fields only. None of the official queried layers publish district websites, district special-education contacts, ISD contact directories, or county-to-ISD routing fields, so the official stack still lacks a county-grade education-routing contract.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed first-party PTI evidence is present at the required authority level)
- legal_aid: verified_state_grade (Reviewed Michigan Legal Help first-party homepage preserves a statewide legal-help and legal-aid access route.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_county_grade (Reviewed 2026-06-22 the official MDHHS county-offices root, the East Michigan, Urban Counties, U.P. and Northern Michigan, and West Michigan region pages, and the exact missing county leaves for Alger, Alpena, Ingham, Lenawee, and St. Joseph. Those reviewed first-party leaf pages close the previous 78-county plus one combined-leaf contract and now preserve a full 83-county official MDHHS county-office lane.)

## Failure ledger

- district_or_county_education_routing: official_mde_app_queries_public_school_and_boundary_layers_but_still_no_district_routing_contract :: Reviewed 2026-06-23 the official Michigan MDE Special Education page, ISD Plans leaf, the linked ArcGIS app config at https://michigan.maps.arcgis.com/sharing/rest/content/items/438dc453faf749d786e0c6e8be731cfd/data?f=json, and the exact public layers referenced by that app. The app queries https://gisagocss.state.mi.us/arcgis/rest/services/CSS/Schools_Districts/MapServer/1 for ISDs, https://gisagocss.state.mi.us/arcgis/rest/services/OpenData/michigan_geographic_framework/MapServer/10 for school-district boundaries, and https://gisagocss.state.mi.us/arcgis/rest/services/CSS/Schools_Districts/MapServer/0 for school campuses. Layer 1 still exposes only boundary/identifier fields like NAME, LABEL, TYPE, ISD, and ISDCode. Layer 10 still exposes only boundary/identifier fields like FIPSCODE, NAME, LABEL, DCODE, and ISD. Layer 0 adds school-campus address fields such as STREET, CITY, STATE, ZIP, LATITUDE, LONGITUDE, and COUNTY, but no district website, district special-education contact, ISD routing contact, or local education-routing URL. So even the exact public layers the official app queries still do not provide the district-or-county routing contract Michigan needs.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.michigan.gov/mdhhs/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.michigan.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.michigan.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.michigan.gov/mde/services/special-education
- district_or_county_education_routing: blocked_mde_app_query_layers_without_local_routing_contract; samples=5; first=https://www.michigan.gov/mde/services/special-education/program-planning/isd-plans
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.michigan.gov/mdhhs
- protection_and_advocacy: verified_state_grade; samples=1; first=https://drmich.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.michiganallianceforfamilies.org/
- legal_aid: verified_state_grade; samples=1; first=https://michiganlegalhelp.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_county_grade; samples=6; first=https://www.michigan.gov/mdhhs/inside-mdhhs/county-offices

## Next actions

- [critical] district_or_county_education_routing: hold_blocked_until_official_isd_or_district_contact_directory_or_export_exists

## Completion decision

- Michigan remains BLOCKED and index_safe=false.
- The only remaining blocker is district_or_county_education_routing.
- The exact public layers used by the official MDE-linked app are now fully accounted for: ISD boundaries, district boundaries, and school-campus addresses.
- None of those queried layers preserve district special-education contacts, district websites, or ISD routing directories, so Michigan still lacks a county-grade local education-routing contract.
