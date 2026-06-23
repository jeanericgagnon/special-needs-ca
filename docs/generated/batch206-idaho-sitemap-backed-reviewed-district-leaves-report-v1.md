# Batch 206 Idaho Sitemap-Backed Reviewed District Leaves Report v1

- classification: BLOCKED
- index_safe: false
- refined_family: district_or_county_education_routing
- failure_code: reviewed_district_special_services_leaves_exist_but_county_grade_mapping_is_still_incomplete

## Evidence

- Reviewed 2026-06-23 bounded live exact district leaf checks taken directly from the existing Idaho packet signals and official district sitemap-backed roots. https://www.cassiaschools.org/page/special-services/ returned HTTP 200 with title `Special Services | Cassia County School District` and preserved special-education, special-services, 504, and procedural-safeguards text on the district-owned page. https://www.payetteschools.org/our-district/departments/special-education returned HTTP 200 with title `Special Services - Payette Joint District` and preserved special-education and special-services text on the district-owned page. https://www.sd25.us/departments/special-services returned HTTP 200 with title `Special Services - Pocatello-Chubbuck School District 25` and preserved special-education, special-services, 504, and procedural-safeguards text on the district-owned page. The official Boundary County District #101 sitemap at https://www.bcsd101.com/sitemap.xml exposed an exact local leaf https://www.bcsd101.com/page/special-services/, which returned HTTP 200 with title `Special Services | Boundary County School District 101`. The official Butte County District #111 sitemap at https://www.butteschooldistrict.org/sitemap.xml exposed an exact local leaf https://www.butteschooldistrict.org/departments/special_education, which returned HTTP 200 with title `Special Education - buttecountyschools` and preserved a Special Education page heading on the district-owned host. A bounded Blaine County District #61 probe also found a district-owned support-services page, but it stayed signal-only because the exact special-education role text was weaker than the other verified leaves. Those reviewed exact leaves prove Idaho education has moved beyond root authoring for a small but growing county subset. But the statewide SDE directory still exposes no county-to-district contract, and the packet still does not carry reviewed local leaves across all counties, so Idaho remains blocked until that exact-leaf coverage expands county by county.

## Repair decision

- Idaho remains blocked and not index-safe.
- Boundary and Butte now join Cassia, Payette, and Bannock as reviewed district-owned education-routing leaves.
- Blaine remains signal-only because the bounded pass found a support-services page but not a cleaner role-exact special-education leaf.
- Idaho should keep expanding exact district-owned leaves from official roots and sitemaps, county by county, without reopening statewide SDE discovery.
