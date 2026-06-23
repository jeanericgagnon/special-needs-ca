# Batch 281 Utah County Coverage Finality Report v1

- state: utah
- classification: BLOCKED
- blocker_family: county_local_disability_resources
- blocker_code: public_dws_office_api_only_materializes_26_of_29_physical_office_counties_and_still_lacks_county_service_area_contract

## What was confirmed

- Confirmed the official Utah DWS office-search host still exposes a live public office inventory API at `https://officesearch-api.jobs.utah.gov/api/v1/offices`.
- Confirmed the companion public services API is live at `https://officesearch-api.jobs.utah.gov/api/v1/services`.
- Confirmed `https://officesearch-api.jobs.utah.gov/api/v1/office-services` returns HTTP 404.
- Confirmed the official API host does not expose public OpenAPI/Swagger docs at `openapi.json`, `swagger-ui/index.html`, or `v3/api-docs`.
- Confirmed `https://jobs.utah.gov/sitemap.xml` still returns an error page instead of a usable public sitemap for successor office discovery.
- Confirmed a bounded reverse-geocode audit of the 45 unique official office coordinates only materializes physical offices in 26 of Utah's 29 counties.

## Why Utah remains blocked

- The public office inventory still has no county field, counties-served field, or other reusable county-to-office service-area contract.
- Even the physical-office fallback is incomplete: Daggett County, Morgan County, Rich County still have no in-county office point in the official API payload.
- No additional public API-docs surface or sitemap-exposed successor leaf was available to close that county-grade gap in this bounded official pass.

## Exact blocker

- public_dws_office_api_only_materializes_26_of_29_physical_office_counties_and_still_lacks_county_service_area_contract

## Next action

- hold_blocked_until_public_office_api_or_successor_directory_exposes_county_or_service_area_assignments_for_missing_daggett_morgan_rich_counties

