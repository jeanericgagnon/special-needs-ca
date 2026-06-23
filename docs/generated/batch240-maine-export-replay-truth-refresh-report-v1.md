# Batch 240 Maine Export Replay Truth Refresh Report v1

- classification: BLOCKED
- index_safe: false
- refined_family: district_or_county_education_routing
- failure_code: live_public_sau_selectors_and_workbook_exist_but_export_replay_still_500

## Evidence

- Reviewed 2026-06-23 official Maine education sources at https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU, https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town, and the official workbook https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx. The public selector HTML still exposes a real anti-forgery token, the full hidden `SAUs[*]` inventory, `OrgId` as the organization selector, and the exact first-party submit controls `action:CSearchBySAU` (`Search`) and `action:SAUExport` (`Export to Excel`). But a fresh bounded replay with `OrgId=42` for Bangor Public Schools and the literal `action:SAUExport=Export to Excel` value still returns HTTP 500 and only the generic NEO shell HTML instead of `SAUSearchResults.xls` or local contact rows. Maine therefore no longer has a selector-discovery problem, but it also cannot truthfully claim a recovered raw export lane in the current environment.

## Repair decision

- Maine remains blocked and not index-safe.
- The official DOE selector and workbook inventory is still live and useful for future manual/browser capture.
- The current raw export replay is not truthfully recovered: Bangor `OrgId=42` still returns HTTP 500 shell HTML instead of a reusable first-party workbook.
