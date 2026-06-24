# Batch 328 Utah Zip/City Contract Finality Report v1

- state: Utah
- classification: BLOCKED
- blocker_family: county_local_disability_resources

## What was confirmed

- Confirmed `https://dhhs.utah.gov/contacts/` is publicly reviewable again at HTTP 200 on the current official host.
- Confirmed the recovered DHHS contacts page still acts as a central contacts hub and explicitly says `Please visit specific division or program pages for local office information.`
- Confirmed the same live DHHS page routes broad community-service discovery to Utah 211 rather than exposing a county-to-office disability directory on the page itself.
- Confirmed the surviving official local-office stack is still bounded to the DWS `office-search` app plus `offices` and `services` API routes.
- Confirmed the live DWS office-search shell now makes the input contract explicit in the footer: the placeholder is `Zip Code or City` and the public button only routes to `search/<zip-or-city>` or `map`.
- Confirmed the public services API still exposes only three labels: `All Offices`, `USOR Services`, and `Employment Centers`.
- Confirmed same-host county-style probes still do not materialize public county or service-area endpoints.

## Why Utah remains blocked

- The recovered DHHS contacts page does not itself provide county-grade office routing.
- The same official page explicitly defers local office proof to other division or program pages.
- The surviving DWS shell only proves zip-or-city search, not county assignments.
- The surviving DWS public API surface still stops at inventory plus service taxonomy.
- No same-host county endpoint, county field, or service-area field materializes on the official Utah office stack.

## Exact blocker

- live_utah_dhhs_contacts_page_recovers_but_explicitly_defers_local_office_info_and_current_dws_office_search_still_limits_public_lookup_to_zip_or_city_without_any_county_contract

## Next action

- hold_blocked_until_public_utah_successor_directory_api_or_reviewable_leaf_explicitly_maps_all_counties_to_local_disability_resource_offices

