# Batch 344 Nebraska Portal Search Finality Report v1

- state: Nebraska
- classification: BLOCKED
- blocker_family: county_local_disability_resources
- blocker_code: official_nebraska_portal_search_still_returns_only_the_same_web_map_feature_service_and_map_service_without_any_county_assignment_item_or_directory_leaf

## What was confirmed

- Confirmed the official public GIS portal search for `Public Assistance Offices` still returns only three public items: one web map, one feature service, and one map service.
- Confirmed the exact `Public Assistance Office Location Lookup` search also returns only the same office-location item family.
- Confirmed no public county-assignment table, alternate directory app, county-routing leaf, or export artifact appears in that official search result set.

## Why Nebraska remains blocked

- There is still no public county-assignment item anywhere on the official Nebraska office stack.
- The public DHHS wrapper and ArcGIS items still resolve only to locator infrastructure, office contact cards, and map services, not a statewide county-to-office contract.

## Next action

- hold_blocked_until_official_service_area_table_county_assignment_artifact_or_new_public_resource_is_published

