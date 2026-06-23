# Batch 291 Utah Live Surface Sync Report v1

- state: utah
- classification: BLOCKED
- blocker_family: county_local_disability_resources
- blocker_code: public_dws_office_api_only_materializes_26_of_29_physical_office_counties_and_still_lacks_county_service_area_contract

## What was confirmed

- Confirmed the official Utah DWS office-search host still exposes a live public office inventory API at `https://officesearch-api.jobs.utah.gov/api/v1/offices`.
- Confirmed the public office payload still returns 99 rows across 45 unique offices and still has no county field or counties-served field.
- Confirmed the companion public services endpoint still exposes only service classes, not service-area mappings.
- Confirmed the guessed `office-services` route now returns an explicit JSON `404 Not Found` response.
- Confirmed the probed docs surfaces (`openapi.json`, `swagger-ui/index.html`, and `v3/api-docs`) now return `404 Service Not Found`.
- Confirmed the older public roots also still do not expose a successor contract: `jobs.utah.gov/sitemap.xml` and `jobs.utah.gov/customereducation/serviceslocations.html` now return `500`, while `dhhs.utah.gov/locations` returns `404`.
- Confirmed `Daggett` and `Morgan` do not appear anywhere in the public office JSON and `Rich` appears only inside `Richfield` office names.

## Why Utah remains blocked

- The public office inventory still has no county field, counties-served field, or other reusable county-to-office service-area contract.
- The exact API and older public roots now fail cleanly enough to prove there is still no public self-describing county contract on the current reviewed Utah stack.
- The missing-county remainder is still explicit: Daggett, Morgan, and Rich have no proven county-grade office assignment.

## Exact blocker

- public_dws_office_api_only_materializes_26_of_29_physical_office_counties_and_still_lacks_county_service_area_contract

## Next action

- hold_blocked_until_public_office_api_or_successor_directory_exposes_county_or_service_area_assignments_for_missing_daggett_morgan_rich_counties

