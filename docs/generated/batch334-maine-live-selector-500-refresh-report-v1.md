# Batch 334 Maine Live Selector 500 Refresh Report v1

- state: maine
- classification: BLOCKED
- index_safe: false
- refined_family: district_or_county_education_routing

## What changed

- Rechecked the live Primary Contacts selector, Superintendent selectors, and official SAU workbook on 2026-06-25.
- Confirmed the current selector contract still exposes the `OrgId` selector and `SAUs[*]` hidden inventory, but no longer exposes the anti-forgery token referenced by the older packet.
- Confirmed fresh Bangor search and export posts still both return the same HTTP 500 NEO error shell instead of materialized local contact rows.
