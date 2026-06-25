# Batch 346 Nebraska DHHS Publication Finality Report v1

- state: Nebraska
- classification: BLOCKED
- blocker_family: county_local_disability_resources
- blocker_code: official_nebraska_dhhs_site_has_no_public_sitemap_or_search_recovery_and_portal_search_still_returns_only_the_same_web_map_feature_service_and_map_service_without_any_county_assignment_item_or_directory_leaf

## What was confirmed

- Confirmed the official DHHS publication layer does not expose a public office sitemap: `robots.txt` is live, but `/sitemap.xml` returns 404.
- Confirmed bounded DHHS SharePoint search API queries do not materialize a searchable county office leaf.
- Confirmed the official GIS portal search still returns only three public items: one web map, one feature service, and one map service.
- Confirmed no public county-assignment table, alternate directory app, county-routing leaf, or export artifact appears in either official publication lane.

## Why Nebraska remains blocked

- There is still no public county-assignment item anywhere on the official Nebraska office stack.
- The DHHS publication layer and ArcGIS publication layer both stop at wrappers, locator infrastructure, and contact-card surfaces rather than a statewide county-to-office contract.

## Next action

- hold_blocked_until_official_service_area_table_county_assignment_artifact_new_public_county_leaf_or_searchable_dhhs_publication_index_is_published

