# Batch 348 Kansas Official Export Completion v1

- classification: COMPLETE
- index_safe: true
- county_count: 105
- cleared_family: district_or_county_education_routing

## What changed

- Promoted Kansas from BLOCKED to COMPLETE/index-safe.
- Cleared `district_or_county_education_routing` from the current official KSDE Directory Reports export contract instead of waiting on more district-by-district special-education leaves.
- Verified that the live official Directory Reports root exposes `__VIEWSTATE`, `__VIEWSTATEGENERATOR`, and `__EVENTVALIDATION`, that the current Directories page is public again, that the current Kansas Educational Directory PDF is a real public PDF, and that an exact public district-scoped submit replay returns a real `Directory.xls` workbook.
- Recorded that the official workbook preserves `Organization Name`, `County Name`, `Superintendent Address`, `Superintendent City`, `Superintendent State`, `Superintendent Zip`, `Board President Email`, and `Board Clerk Email`, and that a bounded county-name coverage audit matched all 105 Kansas counties.

