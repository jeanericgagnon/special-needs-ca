# Nebraska California-Grade Truth Refresh v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 92
- county_count: 93
- primary_gap_reason: official_public_office_feature_service_supports_export_formats_but_schema_and_distinct_county_values_still_expose_no_statewide_assignment_contract

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
- county_local_disability_resources: blocked_public_office_service_exportable_but_without_assignment_contract (Reviewed 2026-06-23 one more bounded official Nebraska county-local pass on the public ArcGIS FeatureServer itself. The official service root is live and even advertises `supportedExportFormats` including `csv`, `filegdb`, `shapefile`, and `geojson`, but the public office layer schema still contains only contact-style fields plus one county field, and a bounded distinct-value query still returns only 37 county names with no multi-county or service-area strings. Combined with the already-reviewed config-only resource list and missing metadata/info files, that means the current official Nebraska office stack is exportable but still does not expose a statewide county-assignment contract.)

## Failure ledger

- county_local_disability_resources: official_public_office_feature_service_supports_export_formats_but_schema_and_distinct_county_values_still_expose_no_statewide_assignment_contract :: Reviewed 2026-06-23 one more bounded official Nebraska county-local pass on the public ArcGIS FeatureServer and export surfaces. `https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer?f=pjson` returns HTTP 200 and now explicitly reports `supportedExportFormats: sqlite,filegdb,shapefile,csv,geojson`. But the public office layer schema at `.../FeatureServer/0?f=pjson` still exposes only contact-style fields plus `USER_County`, with no `countiesServed`, region, assignment, or service-area field. A bounded distinct-value query at `.../FeatureServer/0/query?...outFields=USER_County&returnDistinctValues=true...` still returns only 37 county values across the office inventory, and none of those values are multi-county coverage strings. The public ExperienceBuilder item resource list still contains only `config/config.json` plus image assets, the paired Web Map resource list is empty, and the metadata/info-file routes still expose no hidden artifact. Nebraska therefore still has an exportable office layer but no public statewide county-to-office assignment contract, so county_local_disability_resources remains final-blocked.

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
- county_local_disability_resources: blocked_public_office_service_exportable_but_without_assignment_contract; samples=21; first=https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_official_service_area_table_county_assignment_artifact_or_new_public_resource_is_published

## Completion decision

- Nebraska remains BLOCKED and index_safe=false.
- district_or_county_education_routing remains verified_county_grade through the official county-selectable NDE directory host.
- county_local_disability_resources is now frozen even past the export theory: the public FeatureServer is exportable, but its schema still has no assignment fields and its distinct county values still cover only 37 counties with no multi-county service strings.
