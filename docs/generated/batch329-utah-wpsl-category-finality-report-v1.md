# Batch 329 Utah WPSL Category Finality Report v1

- state: Utah
- classification: BLOCKED
- blocker_family: county_local_disability_resources

## What was confirmed

- Confirmed `https://dhhs.utah.gov/contacts/` is publicly reviewable again at HTTP 200 on the current official host.
- Confirmed the recovered DHHS contacts page still acts as a central contacts hub and explicitly says `Please visit specific division or program pages for local office information.`
- Confirmed the live official DHHS WordPress API root is publicly reviewable.
- Confirmed the current first-party `wp/v2/wpsl_stores` and `wp/v2/wpsl_store_category` collections only publish two category families: `Double Up Food Bucks locations` and `Home Visiting Locations`.
- Confirmed the surviving official DWS office-search shell still limits public lookup to `Zip Code or City`.
- Confirmed the public services API still exposes only three labels: `All Offices`, `USOR Services`, and `Employment Centers`.
- Confirmed same-host county-style probes still do not materialize public county or service-area endpoints.

## Why Utah remains blocked

- The recovered DHHS contacts page does not itself provide county-grade office routing.
- The same official page explicitly defers local office proof to other division or program pages.
- The live first-party DHHS WPSL location stack is program-specific and does not publish county disability-resource office routing.
- The surviving DWS shell only proves zip-or-city search, not county assignments.
- The surviving DWS public API surface still stops at inventory plus service taxonomy.
- No same-host county endpoint, county field, or service-area field materializes on the official Utah office stack.

## Exact blocker

- live_utah_dhhs_contacts_and_first_party_wpsl_location_api_only_prove_general_contacts_plus_non_disability_program_location_categories_while_dws_lookup_remains_zip_city_without_any_county_contract

## Next action

- hold_blocked_until_public_utah_successor_directory_api_or_reviewable_leaf_explicitly_maps_all_counties_to_local_disability_resource_offices

