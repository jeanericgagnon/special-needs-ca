# Batch 184 Maine Public Selector Scope Refinement Report v1

- classification: BLOCKED
- index_safe: false
- refined_family: district_or_county_education_routing
- failure_code: public_selector_inventory_live_but_result_export_actions_return_500

## Evidence

- Reviewed 2026-06-23 bounded live official Maine education checks on https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town, https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU, https://neo.maine.gov/doe/neo/SuperSearch/Home/Index, and the official workbook https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx. The public Town selector page is live and reviewable with a full municipality dropdown, the public Primary Contacts By Organization page is live and reviewable with a full organization catalog, and the SAU-by-municipality workbook is still downloadable on the official DOE host. So Maine no longer has a selector-discovery problem. The blocker is narrower: a bounded cookie-backed submit using a real OrgId still returns HTTP 500 and the NEO Contact Search shell before any verified local contact rows or export file appear. Fourteen county rows still point at https://www.maine.gov/doe/learning/specialed and two still point at https://www.maine.gov/doe, so Maine remains blocked on reviewed browser/manual capture from these already-live selectors rather than speculative POST or discovery retries.

## Repair decision

- Maine remains blocked and not index-safe.
- The Maine NEO selector inventory is no longer the blocker: both public selector pages and the SAU workbook are live and reviewable.
- The failure is narrower and should stay narrow in later work: the result/export step still fails, so the next lane is manual or browser capture from the already-live selectors.
