# Batch 264 Idaho Emmett Reviewed District Leaf Report v1

- classification: BLOCKED
- index_safe: false
- refined_family: district_or_county_education_routing
- failure_code: reviewed_district_special_services_leaves_now_cover_12_counties_but_county_grade_mapping_is_still_incomplete

## Evidence

- Reviewed 2026-06-23 one more bounded live Idaho district-owned leaf directly from the official SDE district root lane. The official Idaho School Districts page JSON links Emmett School District #221 at https://www.emmettschools.org/. That live district root exposed exact special-education candidates, including https://www.emmettschools.org/departments/special-education and https://www.emmettschools.org/our-district/programs/special-education-early-childhood-preschool. The exact district-owned Special Education page returned HTTP 200 with title `Special Education - Emmett Independent School District`, H1 `Special Education`, and preserved procedural-safeguards text on the district-owned host. Idaho education therefore now has twelve reviewed county-level district-owned leaves, but the statewide SDE directory still exposes no county-to-district contract and the remaining counties still need exact leaf expansion.

## Repair decision

- Idaho remains blocked and not index-safe.
- Education is still a county-by-county exact-leaf expansion lane.
- Emmett Independent School District adds Gem County to the reviewed district-owned special-education leaf set, bringing the reviewed count to twelve counties.
