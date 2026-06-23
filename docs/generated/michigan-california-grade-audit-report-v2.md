# Michigan California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 92
- county_count: 83
- primary_gap_reason: official_mde_layers_lack_local_routing_fields_and_cepi_public_dataset_export_500s

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_mde_layers_without_local_routing_fields_and_cepi_export_postback_500s (Reviewed 2026-06-23 the official Michigan MDE ISD Plans leaf, the linked ArcGIS app config and public layers, plus the official CEPI Educational Entity Master Public Data Sets page. The MDE-linked ISD and district layers still expose only boundary and identifier fields, and the school-campus layer adds address fields only. CEPI does expose an official Public Data Sets page with ISD District and LEA District export options, but the exact dataset download postback currently returns a server-side "Validation of viewstate MAC failed" error instead of a stable public export. Michigan therefore still lacks a reproducible county-grade education-routing contract.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed first-party PTI evidence is present at the required authority level)
- legal_aid: verified_state_grade (Reviewed Michigan Legal Help first-party homepage preserves a statewide legal-help and legal-aid access route.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_county_grade (Reviewed 2026-06-22 the official MDHHS county-offices root, the East Michigan, Urban Counties, U.P. and Northern Michigan, and West Michigan region pages, and the exact missing county leaves for Alger, Alpena, Ingham, Lenawee, and St. Joseph. Those reviewed first-party leaf pages close the previous 78-county plus one combined-leaf contract and now preserve a full 83-county official MDHHS county-office lane.)

## Failure ledger

- district_or_county_education_routing: official_mde_layers_lack_local_routing_contract_and_cepi_public_dataset_export_500s :: Reviewed 2026-06-23 the official Michigan MDE Special Education ISD Plans leaf at https://www.michigan.gov/mde/services/special-education/program-planning/isd-plans, the linked ArcGIS app config at https://michigan.maps.arcgis.com/sharing/rest/content/items/438dc453faf749d786e0c6e8be731cfd/data?f=json, and the exact public layers the app queries. The app still only reaches ISD boundaries, district boundaries, and school-campus addresses, with no district website, district special-education contact, ISD routing contact, or county-to-ISD routing fields. A bounded official follow-up on the CEPI Educational Entity Master page at https://cepi.state.mi.us/EEM/PublicDatasets.aspx confirmed that the live page exposes CSV/Excel/XML export options and entity types including ISD District and LEA District, but an exact scripted download postback for those public entity types currently fails with HTTP 500 and the server message "Validation of viewstate MAC failed." So Michigan still has no stable official export or directory contract that preserves local education-routing fields at county grade.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.michigan.gov/mdhhs/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.michigan.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.michigan.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.michigan.gov/mde/services/special-education
- district_or_county_education_routing: blocked_mde_layers_without_local_routing_fields_and_cepi_export_postback_500s; samples=7; first=https://www.michigan.gov/mde/services/special-education/program-planning/isd-plans
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.michigan.gov/mdhhs
- protection_and_advocacy: verified_state_grade; samples=1; first=https://drmich.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://www.michiganallianceforfamilies.org/
- legal_aid: verified_state_grade; samples=1; first=https://michiganlegalhelp.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_county_grade; samples=6; first=https://www.michigan.gov/mdhhs/inside-mdhhs/county-offices

## Next actions

- [critical] district_or_county_education_routing: hold_blocked_until_official_isd_or_district_contact_directory_or_stable_cepi_export_exists

## Completion decision

- Michigan remains BLOCKED and index_safe=false.
- The only remaining blocker is district_or_county_education_routing.
- The exact public MDE-linked ArcGIS stack is still fully accounted for and still lacks district websites, district special-education contacts, ISD routing contacts, or county-to-ISD routing fields.
- The exact official CEPI Educational Entity Master datasets page is live and exposes ISD District and LEA District export options, but the bounded public dataset postback currently fails with a server-side viewstate MAC error, so Michigan still lacks a stable official export contract for county-grade education routing.
