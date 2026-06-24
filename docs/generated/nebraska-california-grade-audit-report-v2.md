# Nebraska California-Grade Truth Refresh v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 92
- county_count: 93
- primary_gap_reason: recovered_public_office_stack_still_has_no_hidden_table_assignment_bridge_and_only_42_offices_for_93_counties

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
- county_local_disability_resources: blocked_republished_public_office_stack_without_hidden_assignment_bridge (Reviewed 2026-06-24 one more bounded official Nebraska county-local pass and confirmed the refreshed public ArcGIS stack still has no hidden county-assignment bridge. The ExperienceBuilder app is fresh, but its web map still carries only two operational layers and zero tables; the only widget output is a closest-feature office layer that mirrors the same office contact schema; the public FeatureServer still has 42 office rows versus 93 county rows; both layers still expose empty relationships; and the distinct office-county query still returns only 37 county values. Nebraska therefore still lacks a public statewide county-to-office assignment contract.)

## Failure ledger

- county_local_disability_resources: recovered_public_office_stack_still_has_no_hidden_table_assignment_bridge_and_only_42_offices_for_93_counties :: Reviewed 2026-06-24 one more bounded official Nebraska county-local pass across the live DHHS and ArcGIS publication stack. `https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx` is still only the SharePoint wrapper for the locator, not a county directory leaf. The refreshed ExperienceBuilder item data at `https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json` still exposes only one web map data source (`4bdbf8e8703743b0b2ff290f98737825`), one closest-feature office output, and one geocoder output. The underlying public web map data at `https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825/data?f=json` still carries exactly two operational layers (`FeatureServer/0` offices and `FeatureServer/1` counties) and zero tables. The closest-feature output schema in the app still mirrors the office layer fields (`USER_Address_1`, `USER_City`, `USER_County`, phones, hours) rather than any county-assignment table. The public FeatureServer still reports 42 office rows against 93 county rows, both layers still expose `relationships: []`, and the distinct office-county query still returns only 37 county values. Nebraska therefore still has no hidden table, related record, or published county-assignment bridge anywhere on the current public stack.

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
- county_local_disability_resources: blocked_republished_public_office_stack_without_hidden_assignment_bridge; samples=7; first=https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_official_service_area_table_county_assignment_artifact_or_new_public_resource_is_published

## Completion decision

- Nebraska remains BLOCKED and index_safe=false.
- district_or_county_education_routing remains verified_county_grade through the official county-selectable NDE directory host.
- county_local_disability_resources remains the only critical blocker.
- The refreshed ArcGIS app still exposes only a two-layer web map, no tables, and a closest-feature office output that mirrors the same contact-card schema.
- The official public stack still stops at 42 office rows, 93 county rows, empty relationships, and only 37 distinct office counties.
- Nebraska therefore still lacks a public statewide county-to-office assignment contract.
