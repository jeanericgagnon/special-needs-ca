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
- county_local_disability_resources: blocked_public_office_service_root_without_assignment_contract (Reviewed 2026-06-23 the live official Nebraska county-local office lane on the DHHS content host, the public ExperienceBuilder app config, and the referenced public web map item. The exact first-party leaf at `https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx` is live and now proves the office lane exists, but its body only preserves a temporary Scottsbluff closing notice plus a `View the Nebraska Public Office Location Lookup` handoff and no county-to-office table, county list, or county assignment text. The public app config still resolves only to the same office and county layers, the FeatureServer root reports `tables: []`, both public layers have empty relationship arrays, and the office schema contains only address/contact fields such as USER_Address_1, USER_City, USER_County, USER_Tel, USER_Toll_Free_Line, USER_Hours, USER_Computer, USER_Scanning, and USER_Phone. The referenced public web map item (`4bdbf8e8703743b0b2ff290f98737825`) adds no hidden county bridge: the county popup lists only boundary/identifier fields, while the office popup only renders office address, phone/toll-free/hours/scanning fields, Google Maps directions, and last-edited metadata. There are still only 42 office rows and 37 distinct USER_County values for 93 counties, with no service-area, assigned-counties, region, or coverage fields. Nebraska therefore still lacks any public county-to-office assignment contract.)

## Failure ledger

- county_local_disability_resources: official_public_office_service_root_has_no_tables_no_relationships_and_webmap_popup_only_materializes_contact_fields :: Reviewed 2026-06-23 the official Nebraska county-local office lane directly on the DHHS content host, the public office locator stack, and the referenced web map item. The exact leaf at https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx is live and titled `Public Assistance Offices`, but the body only preserves a temporary Scottsbluff closing notice plus `View the Nebraska Public Office Location Lookup`; it does not publish a county list, office table, or county assignment contract, and the `Local DHHS Offices` nav loops back to the same page. The public app data at https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json is open and still exposes only the shared web map plus two derived feature layers. The service root at https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer?f=pjson reports exactly two layers, `tables: []`, and no extra public assignment table. Layer 0 still exposes only office contact fields like USER_Address_1, USER_City, USER_County, USER_Tel, USER_Toll_Free_Line, USER_Hours, USER_Computer, USER_Scanning, and USER_Phone; it has no service-area or coverage fields, no multi-county USER_County values, and only 37 distinct counties across 42 office rows. The referenced public web map at https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825/data?f=json confirms there is no hidden county bridge in popup configuration: the `County Boundary` popup only lists NAME and other county geometry/identifier fields, and the `Public Assistance Office` popup only renders address, city, ZIP, phone/toll-free/hours/scanning, a Google Maps directions expression, and last-edited metadata. So the official Nebraska county-local office stack is final-blocked on missing public county-assignment data, not on an unresolved popup or ArcGIS-discovery question.

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
- county_local_disability_resources: blocked_public_office_service_root_without_assignment_contract; samples=6; first=https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_official_service_area_table_or_county_assignment_artifact_exists

## Completion decision

- Nebraska remains BLOCKED and index_safe=false.
- district_or_county_education_routing is still verified_county_grade through the live official NDE county-selectable directory host.
- county_local_disability_resources is now final-blocked more tightly: the exact DHHS Public Assistance Offices leaf is live but only hands off to the locator, and the public FeatureServer root, county layer, and office popup configuration still expose no county-to-office assignment contract.
