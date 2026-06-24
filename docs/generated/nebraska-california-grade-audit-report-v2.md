# Nebraska California-Grade Truth Refresh v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 92
- county_count: 93
- primary_gap_reason: official_public_office_service_root_has_no_tables_and_office_schema_has_no_service_area_fields

## Family status

- medicaid_state_health_coverage: verified_state_grade (Live Nebraska DHHS Medicaid eligibility and overview leaves now provide the statewide application, eligibility, and coverage path on the real official domain.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (Live Nebraska DHHS waiver-eligibility evidence now replaces the dead legacy waiver root.)
- developmental_disability_idd_authority: verified_state_grade (Live Nebraska DHHS Developmental Disabilities and waiver-eligibility leaves now prove the statewide DD authority and appeals path on the reviewed official domain.)
- early_intervention_part_c: verified_state_grade (The official Nebraska Early Development Network site now provides a live statewide Part C route with referral, eligibility, service-coordination, and planning-region navigation.)
- special_education_idea_part_b: verified_state_grade (Live Nebraska Department of Education special-education, complaint, mediation, and due-process leaves now replace the stale generic home-page packet sample.)
- district_or_county_education_routing: verified_county_grade (Reviewed 2026-06-23 the live official Nebraska NDE education-directory lane found in the public NDE sitemap. The NDE Data Services page at `dataservices/education-directory/` links directly to the official `educdirsrc.education.ne.gov` directory host. The public `QuickStaff.aspx` page exposes a county-selectable ASP.NET search contract with 93 county options, and a bounded postback for Adams County returns a live official county-specific `QuickStaffDisplay.aspx` results page with district names, county label, address, city, ZIP, phone, fax, and staff-role output. That county-selectable official directory is enough to verify district_or_county_education_routing at county grade.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Live Nebraska VR now provides the statewide vocational-rehabilitation route on the correct official subdomain.)
- protection_and_advocacy: verified_state_grade (Reviewed first-party Disability Rights Nebraska evidence explicitly proves the statewide P&A role.)
- parent_training_information_center: verified_state_grade (Reviewed first-party PTI Nebraska evidence explicitly states that it has served as Nebraska’s Parent Training and Information Center since 2001 and that Nebraska has one federally funded Parent Center.)
- legal_aid: verified_state_grade (Reviewed first-party Legal Aid of Nebraska evidence now provides a real statewide civil legal-aid route.)
- able_program: verified_state_grade (Statewide evidence is present at the required authority level.)
- ssi_ssa_federal_reference: verified_state_grade (Statewide evidence is present at the required authority level.)
- county_local_disability_resources: blocked_public_office_service_root_without_assignment_contract (Reviewed 2026-06-23 one more bounded official Nebraska county-local pass on the live DHHS office leaf plus the published ArcGIS app contract. The exact first-party leaf at `https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx` is live, but the official GIS portal still exposes no public county-assignment dependency behind it. The published ExperienceBuilder config at `.../resources/config/config.json` still binds only one web map data source (`dataSource_3`), one closest-office widget output, and one ArcGIS World Geocoding Service output. The public related-items endpoints for both the Web Experience item (`76a6ec0ec7c449448c95d00f59002457`) and the paired Web Map item (`4bdbf8e8703743b0b2ff290f98737825`) both return `total: 0`. The FeatureServer still has only two public layers, `tables: []`, zero relationships, and only 37 distinct `USER_County` values across 42 office rows. Nebraska therefore still lacks any public county-to-office assignment contract.)

## Failure ledger

- county_local_disability_resources: official_published_config_and_related_items_still_only_materialize_locator_outputs_without_county_assignment_contract :: Reviewed 2026-06-23 one more bounded official Nebraska county-local pass on the live DHHS leaf and the exact published ArcGIS stack. `https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx` returned HTTP 200, while the live office locator ExperienceBuilder config at `https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/resources/config/config.json` still materializes only three public data dependencies: the shared web map (`dataSource_3`), `widget_382_output_closest_000433549029275504` labeled `Public Assitance Office (Closest Feature)`, and `widget_383_output_config_0` labeled `Nebraska from ArcGIS World Geocoding Service`. The same published config lists only geocoding and routing utilities (`StreetMapPremiumNebraska2024`, ArcGIS World Geocoding Service, and Route World) rather than any county-assignment or service-area source. The public related-items endpoints for both the Web Experience item (`https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/relatedItems?relationshipType=WMA2Code&direction=forward&f=json`) and the paired Web Map item (`https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825/relatedItems?direction=forward&f=json`) both return `{"total":0}`, so there is no hidden public sibling item to recover. The public FeatureServer root still exposes only two layers, `tables: []`, and the office layer still exposes only contact-style fields like `USER_Address_1`, `USER_City`, `USER_County`, `USER_Tel`, `USER_Toll_Free_Line`, `USER_Hours`, `USER_Computer`, `USER_Scanning`, and `USER_Phone`, with only 37 distinct `USER_County` values across 42 office rows. Nebraska therefore remains final-blocked on missing public county-to-office assignment data.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=2; first=https://dhhs.ne.gov/Pages/Medicaid-Eligibility.aspx
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://dhhs.ne.gov/Pages/DD-Eligibility.aspx
- developmental_disability_idd_authority: verified_state_grade; samples=2; first=https://dhhs.ne.gov/Pages/Developmental-Disabilities.aspx
- early_intervention_part_c: verified_state_grade; samples=1; first=https://edn.ne.gov/cms/
- special_education_idea_part_b: verified_state_grade; samples=4; first=https://www.education.ne.gov/sped/
- district_or_county_education_routing: verified_county_grade; samples=5; first=https://www.education.ne.gov/dataservices/education-directory/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://vr.nebraska.gov/
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.disabilityrightsnebraska.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://pti-nebraska.org/about/
- legal_aid: verified_state_grade; samples=1; first=https://legalaidofnebraska.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_public_office_service_root_without_assignment_contract; samples=16; first=https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_official_service_area_table_or_county_assignment_artifact_exists

## Completion decision

- Nebraska remains BLOCKED and index_safe=false.
- district_or_county_education_routing remains verified_county_grade through the official county-selectable NDE directory host.
- county_local_disability_resources is still final-blocked: the live DHHS office leaf, the published ExperienceBuilder config, the empty related-items endpoints, and the public FeatureServer layers still expose only locator outputs rather than any county-to-office assignment artifact.
