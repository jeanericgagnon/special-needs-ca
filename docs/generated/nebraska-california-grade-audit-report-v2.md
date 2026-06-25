# Nebraska California-Grade Truth Refresh v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 92
- county_count: 93
- primary_gap_reason: official_nebraska_dhhs_site_has_no_public_sitemap_or_search_recovery_and_portal_search_still_returns_only_the_same_web_map_feature_service_and_map_service_without_any_county_assignment_item_or_directory_leaf

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
- county_local_disability_resources: blocked_official_dhhs_publication_layer_and_portal_search_both_fail_to_materialize_county_assignment_contract (Reviewed 2026-06-24 one more bounded official Nebraska county-local pass and confirmed both official publication lanes still fail closed. `https://dhhs.ne.gov/robots.txt` is live, but `https://dhhs.ne.gov/sitemap.xml` returns 404, the live SharePoint wrapper still loops `Public Assistance Offices` back to the same locator stack, and bounded DHHS SharePoint search API queries for office-routing terms return only 500/400 errors instead of a searchable public publication index. The official GIS portal search still returns only the same locator trilogy for `Public Assistance Offices`: one web map item, one feature service, and one map service, all with no county-assignment table, directory leaf, or alternate public item. Nebraska therefore still lacks a public statewide county-to-office assignment contract.)

## Failure ledger

- county_local_disability_resources: official_nebraska_dhhs_site_has_no_public_sitemap_or_search_recovery_and_portal_search_still_returns_only_the_same_web_map_feature_service_and_map_service_without_any_county_assignment_item_or_directory_leaf :: Reviewed 2026-06-24 one more bounded official Nebraska county-local pass across both the DHHS publication layer and the ArcGIS publication stack. `https://dhhs.ne.gov/robots.txt` is live, but `https://dhhs.ne.gov/sitemap.xml` returns HTTP 404, so there is still no first-party sitemap publication index for office leaves. The live SharePoint HTML for `https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx`, `https://dhhs.ne.gov/Pages/Contact-DHHS.aspx`, and `https://dhhs.ne.gov/Pages/economic-assistance.aspx` still loops users only to the same office wrapper and sibling economic-assistance pages, while bounded SharePoint search API queries such as `_api/search/query?querytext='Public Assistance Offices'` return only HTTP 500/400 errors rather than any searchable county office leaves. On the ArcGIS side, `https://gis.ne.gov/portal/sharing/rest/search?q=title%3A%22Public%20Assistance%20Offices%22&f=json` still returns only three public items with the same office-location title and owner family: the web map item `4bdbf8e8703743b0b2ff290f98737825`, the feature service item `cf70cb74fcc94634afc89f0a22a7d06f`, and the map service item `90a19933cfc444be836f51d15e2e23ec`. No table item, CSV, county assignment app item, or county directory leaf appears anywhere in either official publication lane. Nebraska therefore still has no public county-assignment item anywhere on the current official stack.

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
- county_local_disability_resources: blocked_official_dhhs_publication_layer_and_portal_search_both_fail_to_materialize_county_assignment_contract; samples=8; first=https://dhhs.ne.gov/robots.txt

## Next actions

- [critical] county_local_disability_resources: hold_blocked_until_official_service_area_table_county_assignment_artifact_new_public_county_leaf_or_searchable_dhhs_publication_index_is_published

## Completion decision

- Nebraska remains BLOCKED and index_safe=false.
- district_or_county_education_routing remains verified_county_grade through the official county-selectable NDE directory host.
- county_local_disability_resources remains the only critical blocker.
- The DHHS publication layer still exposes no recoverable county office index: robots is live, sitemap is 404, and SharePoint search does not yield a public office leaf.
- The official GIS portal search still returns only the same office-locator trilogy: one web map, one feature service, and one map service.
- Nebraska therefore still lacks a public statewide county-to-office assignment contract.
