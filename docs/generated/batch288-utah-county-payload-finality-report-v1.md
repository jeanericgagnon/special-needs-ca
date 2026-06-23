# Batch 288 Utah County Payload Finality Report v1

- state: utah
- classification: BLOCKED
- blocker_family: county_local_disability_resources
- blocker_code: public_dws_office_api_only_materializes_26_of_29_physical_office_counties_and_still_lacks_county_service_area_contract

## What was confirmed

- Confirmed the official Utah DWS office-search host still exposes a live public office inventory API at `https://officesearch-api.jobs.utah.gov/api/v1/offices`.
- Confirmed the payload still has no `county`, `countiesServed`, or similar service-area field.
- Confirmed `Daggett` and `Morgan` do not appear anywhere in the public office JSON.
- Confirmed `Rich` appears only inside `Richfield` office naming rather than Rich County routing.
- Confirmed the only literal `county` office-name tokens in the public JSON are `Emery County (Castle Dale)` and `South County (Taylorsville)`, which is not a statewide county contract.

## Why Utah remains blocked

- The public office inventory still has no county field, counties-served field, or other reusable county-to-office service-area contract.
- The missing-county remainder is still explicit: Daggett, Morgan, and Rich have no proven county-grade office assignment, and Daggett/Morgan are absent from the payload text entirely.

## Exact blocker

- public_dws_office_api_only_materializes_26_of_29_physical_office_counties_and_still_lacks_county_service_area_contract

## Next action

- hold_blocked_until_public_office_api_or_successor_directory_exposes_county_or_service_area_assignments_for_missing_daggett_morgan_rich_counties

