# Nebraska California-Grade Truth Refresh v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 92
- county_count: 93
- primary_gap_reason: public_nebraska_office_config_still_only_references_one_web_map_and_a_closest_feature_output_while_the_feature_service_stops_at_42_offices_for_93_counties

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
- county_local_disability_resources: blocked_public_config_confirms_no_county_assignment_datasource (Reviewed 2026-06-24 one more bounded official Nebraska county-local pass and confirmed both the public ArcGIS stack and the same-host DHHS sibling leaves still fail to expose a county assignment contract. The public ExperienceBuilder `config/config.json` still references only one web map item and one `closest feature` output layer, while the web map still has two operational layers and zero tables. The exact DHHS sibling leaves `economic-assistance.aspx`, `Contact-DHHS.aspx`, and `DD-Contact-Us.aspx` all preserve the same `Local DHHS Offices` link back to `Public-Assistance-Offices.aspx`, not a county directory leaf. The public FeatureServer still stops at 42 offices, 93 county boundaries, empty relationships, and only 37 distinct office counties. Nebraska therefore still lacks a public statewide county-to-office assignment contract.)

## Failure ledger

- county_local_disability_resources: public_nebraska_office_config_still_only_references_one_web_map_and_a_closest_feature_output_while_the_feature_service_stops_at_42_offices_for_93_counties :: Reviewed 2026-06-24 one more bounded official Nebraska county-local pass across the live DHHS and ArcGIS publication stack, then re-checked exact same-host DHHS sibling leaves. `https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx` is still only the SharePoint wrapper for the locator, not a county directory leaf. The public resource list for item `76a6ec0ec7c449448c95d00f59002457` exposes `config/config.json`, and that config still references only one web map item (`4bdbf8e8703743b0b2ff290f98737825`) plus one `closest feature` output layer (`widget_382_output_closest_000433549029275504`) and the geocoder search widget. No additional table datasource, county-assignment datasource, or service-area output appears anywhere in the public config. The underlying public web map data still carries exactly two operational layers (`FeatureServer/0` offices and `FeatureServer/1` counties) and zero tables. The public FeatureServer still reports 42 office rows against 93 county rows, both layers still expose `relationships: []`, and the distinct office-county query still returns only 37 county values. One fresh bounded same-host pass also confirmed that `https://dhhs.ne.gov/Pages/economic-assistance.aspx`, `https://dhhs.ne.gov/Pages/Contact-DHHS.aspx`, and `https://dhhs.ne.gov/Pages/DD-Contact-Us.aspx` do not open a county-local office contract: each page only preserves a `Local DHHS Offices` link back to `Public-Assistance-Offices.aspx`, while the only alternate locality leaf exposed in the same nav is `Local Health Departments`, which is the wrong role for this family. Nebraska therefore still has no hidden table, output layer, related record, or published same-host county assignment bridge anywhere on the current official stack.

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
- county_local_disability_resources: blocked_public_config_confirms_no_county_assignment_datasource; samples=9; first=https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_official_service_area_table_county_assignment_artifact_or_new_public_resource_is_published

## Completion decision

- Nebraska remains BLOCKED and index_safe=false.
- district_or_county_education_routing remains verified_county_grade through the official county-selectable NDE directory host.
- county_local_disability_resources remains the only critical blocker.
- The public ExperienceBuilder resource config still exposes only one web map plus a closest-feature output and geocoder search, not a county-assignment datasource.
- The exact same-host DHHS sibling leaves still only loop `Local DHHS Offices` back to the same Public Assistance Offices wrapper, not a county directory leaf.
- Nebraska therefore still lacks a public statewide county-to-office assignment contract.
