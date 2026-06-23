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
- district_or_county_education_routing: blocked_mde_arcgis_layers_without_local_contact_contract (Reviewed 2026-06-23 the official Michigan MDE ISD Plans leaf plus the exact public ArcGIS app item-data and Schools_Districts service layers. The ISD Plans page links only to statewide policy resources and the generic Michigan Schools and Districts ArcGIS app. The app config resolves to public ISD and district boundary services, but the ISD layer exposes only fields like NAME, LABEL, TYPE, ISD, and ISDCode, while the district layers expose NAME, LABEL, DCODE, ISD, FIPSCODE, and boundary metadata only. No phone, website, email, special-education contact, or local routing URL fields are present, so the official stack still lacks a district-or-county routing contract.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed first-party PTI evidence is present at the required authority level)
- legal_aid: verified_state_grade (Reviewed Michigan Legal Help first-party homepage preserves a statewide legal-help and legal-aid access route.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_county_grade (Reviewed 2026-06-22 the official MDHHS county-offices root, the East Michigan, Urban Counties, U.P. and Northern Michigan, and West Michigan region pages, and the exact missing county leaves for Alger, Alpena, Ingham, Lenawee, and St. Joseph. Those reviewed first-party leaf pages close the previous 78-county plus one combined-leaf contract and now preserve a full 83-county official MDHHS county-office lane.)

## Failure ledger

- district_or_county_education_routing: official_mde_arcgis_layers_expose_boundaries_and_codes_without_local_contact_contract :: Reviewed 2026-06-23 the official Michigan MDE Special Education page, sitemap, ISD Plans leaf, and the exact public ArcGIS contract linked from that leaf. The live ISD Plans page at https://www.michigan.gov/mde/services/special-education/program-planning/isd-plans links only to statewide policy resources at https://training.catamaran.partners/isd-policy-resources/ and the generic Michigan Schools and Districts map at https://michigan.maps.arcgis.com/apps/webappviewer/index.html?id=438dc453faf749d786e0c6e8be731cfd. The public ArcGIS app item data resolves to the Schools_Districts service on gisagocss.state.mi.us, including ISD layer 1 and district layers 2-5. Layer 1 fields are limited to boundary and identifier values such as NAME, LABEL, TYPE, ISD, and ISDCode. District layers 2-5 are likewise limited to NAME, LABEL, DCODE, ISD, FIPSCODE, FIPSNUM, VER, LAYOUT, and PENINSULA. Those public services preserve boundaries and codes, but no phone, website, email, district-owned special-education leaf, or county-to-ISD routing contact fields. A bounded DB check still shows 83 official_verified Michigan school_district fallback rows all reusing the statewide MDE special-education root, so Michigan cannot pass county-grade education routing.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.michigan.gov/mdhhs/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.michigan.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.michigan.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.michigan.gov/mde/services/special-education
- district_or_county_education_routing: blocked_mde_arcgis_layers_without_local_contact_contract; samples=4; first=https://www.michigan.gov/mde/services/special-education/program-planning/isd-plans
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.michigan.gov/mdhhs
- protection_and_advocacy: verified_state_grade; samples=1; first=https://drmich.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.michiganallianceforfamilies.org/
- legal_aid: verified_state_grade; samples=1; first=https://michiganlegalhelp.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_county_grade; samples=6; first=https://www.michigan.gov/mdhhs/inside-mdhhs/county-offices

## Next actions

- [critical] district_or_county_education_routing: use_michigan_arcgis_contract_packet_and_hold_blocked_until_official_isd_or_district_contact_export_exists

## Completion decision

- Michigan remains BLOCKED and index_safe=false.
- The only remaining blocker is district_or_county_education_routing.
- The official MDE-linked ArcGIS stack now proves something narrower than before: it preserves public district and ISD boundary identifiers, but still no local contact, district-owned special-education leaf, or county-to-ISD routing contract.
