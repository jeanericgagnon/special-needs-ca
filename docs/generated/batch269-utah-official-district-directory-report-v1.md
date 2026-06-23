# Batch 269 Utah Official District Directory Report v1

- classification_after: BLOCKED
- index_safe_after: false
- primary_gap_reason_after: official_usbe_district_lea_directory_clears_education_but_dws_locations_500_and_dhhs_locations_404_leave_no_live_county_local_contract

## What changed

- Cleared `district_or_county_education_routing` using the live official Utah Schools Directory.
- Left `county_local_disability_resources` blocked because the older DWS services locations page returned HTTP 500, the older DHHS locations route returned HTTP 404, and the live DHHS home only exposed a statewide office address with no county-grade office directory contract.

## Exact evidence

- `https://schools.utah.gov/schoolsdirectory` returned HTTP 200 on 2026-06-23.
- The page title is `Utah Schools Directory`.
- The page description says the data is provided from the District or Local Education Agency (LEA) in the CACTUS system and directs corrections back to the District/LEA.
- The page exposes a `District or LEA` filter control and an `Export to CSV file` action.

## Remaining blocker

- `county_local_disability_resources` remains the sole critical blocker for Utah.
