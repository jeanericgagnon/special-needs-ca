# Batch 334 Maine Live Selector 500 Refresh Report v1

- state: maine
- classification: BLOCKED
- index_safe: false
- refined_family: district_or_county_education_routing

## What changed

- Rechecked the live Primary Contacts selector, Town selector, and official SAU workbook on 2026-06-24.
- Confirmed the selector still exposes a live anti-forgery token, the `OrgId` selector, and the `SAUs[*]` field family.
- Confirmed fresh Bangor search and export posts still both return the same HTTP 500 NEO error shell instead of materialized local contact rows.
