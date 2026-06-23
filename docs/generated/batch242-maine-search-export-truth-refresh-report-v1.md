# Batch 242 Maine Search+Export Truth Refresh Report v1

- classification: BLOCKED
- index_safe: false
- refined_family: district_or_county_education_routing
- failure_code: live_public_sau_selectors_and_workbook_exist_but_search_and_export_replays_still_500

## Evidence

- Reviewed 2026-06-23 official Maine education sources at https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU, https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town, and the official workbook https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx. The public selector HTML still exposes a real anti-forgery token, the full hidden `SAUs[*]` inventory, `OrgId` as the organization selector, and the exact first-party submit controls `action:CSearchBySAU` (`Search`) and `action:SAUExport` (`Export to Excel`). But fresh bounded Bangor replays with `OrgId=42` and those literal named submit values both return HTTP 500 and only the generic NEO Contact Search error shell rather than local contact rows or `SAUSearchResults.xls`. Maine therefore no longer has a selector-discovery problem, but it also cannot truthfully claim a recovered raw search or export lane in the current environment.

## Repair decision

- Maine remains blocked and not index-safe.
- The official DOE selector/workbook inventory is still live and useful for future browser/manual capture.
- The raw low-token lane is now sharper: both named search and export submits fail with the same app-side HTTP 500 error shell for Bangor `OrgId=42`.
- County-local remains separately blocked because the official DHHS office page still has no county or service-area crosswalk.
