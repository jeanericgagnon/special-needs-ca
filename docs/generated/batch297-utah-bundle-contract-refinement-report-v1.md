# Batch 297 Utah Bundle Contract Refinement Report v1

- state: utah
- classification: BLOCKED
- blocker_family: county_local_disability_resources
- blocker_code: live_dws_bundle_only_supports_city_or_zip_search_and_public_office_api_still_lacks_county_service_area_contract

## What was confirmed

- Confirmed the live Utah office-search page loads a first-party bundle whose config sets `apiUrl` to `https://officesearch-api.jobs.utah.gov`.
- Confirmed the bundle calls only `/api/v1/offices`, `/api/v1/services`, and a still-broken `/api/v1/office-services` route.
- Confirmed the reviewed bundle search logic only filters office rows by `city` and then `zipCode`, then falls back to nearest-office geocoding.
- Confirmed the public office payload still exposes no county field or counties-served field.
- Confirmed the public services payload still exposes only service classes, not service-area mappings.
- Confirmed the exact `office-services` route still returns `404 Not Found`.
- Confirmed the county remainder is still explicit at Daggett, Morgan, and Rich.

## Why Utah remains blocked

- The live bundle contract itself proves the office-search lane is city/ZIP-oriented, not county-oriented.
- The public API family still exposes no reusable county-to-office or counties-served mapping.
- The missing-county remainder is still explicit and cannot be truthfully inferred from nearest-office search behavior.

## Exact blocker

- live_dws_bundle_only_supports_city_or_zip_search_and_public_office_api_still_lacks_county_service_area_contract

## Next action

- hold_blocked_until_public_utah_dws_successor_exposes_county_or_service_area_assignments_in_api_payload_or_reviewable_official_leaf

