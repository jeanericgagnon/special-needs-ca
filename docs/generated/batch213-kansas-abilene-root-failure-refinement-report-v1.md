# Batch 213 Kansas Abilene Root Failure Refinement Report v1

- classification: BLOCKED
- index_safe: false
- refined_family: district_or_county_education_routing
- failure_code: reviewed_district_owned_special_education_leaves_exist_but_kansas_county_grade_coverage_is_still_incomplete

## Evidence

- Reviewed 2026-06-23 bounded Kansas district-owned exact leaf checks after the public KSDE export contract was proven. District-owned special-education leaves are now reviewed for 3/105 counties: atchison-ks, butler-ks, shawnee-ks. https://www.usd385.org/departments/special-education returned HTTP 200 with title `Special Education - Andover Public Schools` and H1 `Special Education`. https://www.usd409.net/page/special-education-services/ returned HTTP 200 with title `Special Education Services | Atchison Public Schools` on the district-owned host. https://www.topekapublicschools.net/departments/special_education returned HTTP 200 with title `Special Education - Topeka Public Schools` on the district-owned host. A bounded export-backed Abilene USD 435 follow-up then verified the official district root https://www.abileneschools.org/ and its public sitemap https://www.abileneschools.org/sitemap.xml, but the obvious role-exact candidates `/page/special-education`, `/page/special-services`, `/departments/special-education`, `/departments/special-services`, `/special-education`, and `/student-services` all returned clean `Page Not Found` shells, and the sitemap preserved no role-exact special-education leaf. A bounded probe also showed the public KSDE app's `***ALL DISTRICTS***` export attempt returns the generic `There was a problem` shell, while district-scoped submits still return the workbook contract. Kansas therefore has real reviewed district-owned leaves for a small county subset and at least one export-backed district root that still fails closed, but education remains blocked until local-leaf coverage expands county by county across the 105-county packet.

## Repair decision

- Kansas remains blocked and not index-safe.
- Abilene USD 435 now proves that a KSDE export-backed district root and sitemap can still fail closed when no role-exact special-education leaf survives bounded fetches.
- Future Kansas work should keep using the official export-backed inventory, but must still require district-owned role-exact leaves before a county can count.
