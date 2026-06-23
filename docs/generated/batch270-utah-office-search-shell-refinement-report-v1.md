# Batch 270 Utah Office Search Shell Refinement Report v1

- classification_after: BLOCKED
- index_safe_after: false
- primary_gap_reason_after: official_usbe_district_lea_directory_clears_education_and_live_dws_office_search_shell_still_lacks_public_county_office_contract

## What changed

- Confirmed the older public DWS contact page now leads to a live official `Office Search - DWS` app.
- Confirmed the public shell still does not expose county-grade office rows, addresses, or a county-to-office contract in raw HTML.
- Kept Utah blocked, but sharpened the blocker from dead-route-only evidence to the stronger live-shell-without-county-contract evidence.

## Exact evidence

- `https://jobs.utah.gov/department/contact/index.html` is live and links an `Office Map` at `/jsp/officesearch/`.
- `/jsp/officesearch/` now redirects to `https://jobs.utah.gov/office-search/`.
- The live shell title is `Office Search - DWS` and exposes map/search controls including `Zip Code or City` input and `search/<zip-or-city>` / `map` routes.
- The public shell still exposes no county list, office rows, office addresses, or county-to-office contract in raw public HTML.

## Remaining blocker

- `county_local_disability_resources` remains the sole critical blocker for Utah.
