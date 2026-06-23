# Nebraska California-Grade Truth Refresh v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 92
- county_count: 93
- primary_gap_reason: official_public_office_app_has_only_two_public_layers_and_no_service_area_relationships

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
- county_local_disability_resources: blocked_public_office_layers_without_service_area_relationships (Reviewed 2026-06-23 the live official Nebraska office ExperienceBuilder stack more tightly. The public app config is open, but it still resolves only to two public layers: the office feature layer and the county-boundary layer. The office layer exposes office contact fields such as address, phone, hours, and USER_County, but it has no relationships or related tables. The county layer exposes only county geometry and identifiers and also has no relationships. The public counts remain 42 office rows and 93 county rows, so Nebraska still lacks a service-area or county-to-office contract for the missing counties.)

## Failure ledger

- county_local_disability_resources: official_public_office_app_has_only_two_public_layers_and_no_service_area_relationships :: Reviewed 2026-06-23 the official Nebraska Public Office Location ExperienceBuilder config and backing feature service directly. The public app data at https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json is open, but the backing service still exposes only two public layers: https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0 for offices and /1 for counties. Layer 0 exposes office fields like USER_Address_1, USER_City, USER_County, USER_Tel, USER_Toll_Free_Line, USER_Hours, USER_Computer, and USER_Scanning, but `relationships` is an empty array. Layer 1 exposes only county boundary identifiers like NAME, COUNTYFP, GEOID, and NAMELSAD, and its `relationships` array is also empty. A bounded count check still returns 42 office rows and 93 county rows. So the public Nebraska office stack has no hidden service-area relationship table to bridge all counties back to offices.

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
- county_local_disability_resources: blocked_public_office_layers_without_service_area_relationships; samples=3; first=https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_official_service_area_or_county_assignment_contract_exists

## Completion decision

- Nebraska remains BLOCKED and index_safe=false.
- district_or_county_education_routing is now verified_county_grade through the live official NDE county-selectable directory host.
- county_local_disability_resources remains blocked because the public office app still exposes only office and county layers with no service-area relationships.
