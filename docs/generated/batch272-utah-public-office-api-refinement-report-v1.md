# Batch 272 Utah Public Office API Refinement Report v1

- classification_after: BLOCKED
- index_safe_after: false
- primary_gap_reason_after: official_usbe_district_lea_directory_clears_education_and_public_dws_office_api_still_lacks_county_service_area_contract

## What changed

- Confirmed the Utah DWS office-search app has a live public API contract, not just a public shell.
- Verified the office inventory endpoint returns 99 rows covering 45 unique offices with office names, addresses, service codes, and coordinates.
- Kept Utah blocked because the API still does not publish county fields, counties served, or another reusable county-to-office contract.

## Exact evidence

- The live bundle `https://jobs.utah.gov/office-search/main-NUCK4XJI.js` sets `apiUrl:"https://officesearch-api.jobs.utah.gov"`.
- The same bundle uses `getOfficeDataFromApi()` to call `GET /api/v1/offices`.
- `https://officesearch-api.jobs.utah.gov/api/v1/offices` is publicly reachable and returns office rows with `officeName`, `address1`, `city`, `zipCode`, `serviceName`, `latitude`, and `longitude`.
- The public payload still exposes no `county`, `countiesServed`, `serviceArea`, or equivalent county-assignment field.
- `https://officesearch-api.jobs.utah.gov/api/v1/services` is public, but only enumerates service classes, and `GET /api/v1/office-services` returns HTTP 404.

## Remaining blocker

- `county_local_disability_resources` remains the sole critical blocker for Utah because the public office inventory still lacks county-grade assignment proof.
