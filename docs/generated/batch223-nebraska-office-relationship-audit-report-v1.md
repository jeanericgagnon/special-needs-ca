# Batch 223 Nebraska Office Relationship Audit Report v1

- classification: BLOCKED
- index_safe: false
- refined_family: county_local_disability_resources
- failure_code: official_public_office_app_has_only_two_public_layers_and_no_service_area_relationships

## Evidence

- Reviewed 2026-06-23 the official Nebraska Public Office Location ExperienceBuilder config and backing feature service directly. The public app data at https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json is open, but the backing service still exposes only two public layers: https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0 for offices and /1 for counties. Layer 0 exposes office fields like USER_Address_1, USER_City, USER_County, USER_Tel, USER_Toll_Free_Line, USER_Hours, USER_Computer, and USER_Scanning, but `relationships` is an empty array. Layer 1 exposes only county boundary identifiers like NAME, COUNTYFP, GEOID, and NAMELSAD, and its `relationships` array is also empty. A bounded count check still returns 42 office rows and 93 county rows. So the public Nebraska office stack has no hidden service-area relationship table to bridge all counties back to offices.

## Repair decision

- Kept Nebraska BLOCKED.
- Confirmed the public office app is not hiding a service-area relationship table.
- Recorded that both public layers have empty relationship arrays, so later passes can stop rechecking for a latent county-assignment join.
