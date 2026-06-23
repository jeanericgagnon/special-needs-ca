# Batch 190 Maine Public OrgId Refinement Report v1

- classification: BLOCKED
- index_safe: false
- refined_family: district_or_county_education_routing
- failure_code: public_orgid_inventory_and_workbook_are_live_but_contact_result_step_still_500

## Evidence

- Reviewed 2026-06-23 bounded live official Maine education checks on https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU, https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town, https://neo.maine.gov/doe/neo/SuperSearch/Home/Index, and the official workbook https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx. The public Primary Contacts By Organization selector itself now proves a concrete official OrgId inventory on simple GET, with live option values such as 1761 Acadia Academy, 2 Acton Public Schools, 14 Auburn Public Schools, 28 Augusta Public Schools, and 42 Bangor Public Schools rendered directly in the HTML. The public Town selector is still live and reviewable, and the SAU-by-municipality workbook is still downloadable on the official DOE host. So Maine no longer has a selector-discovery problem or an unknown organization-id problem. The blocker is narrower: a bounded cookie-backed submit using a real OrgId still returns HTTP 500 and the NEO Contact Search shell before any verified local contact rows or export file appear. Fourteen county rows still point at https://www.maine.gov/doe/learning/specialed and two still point at https://www.maine.gov/doe, so Maine remains blocked on reviewed browser/manual capture or alternate export recovery from the already-live OrgId inventory and workbook rather than speculative POST or discovery retries.

## Repair decision

- Maine remains blocked and not index-safe.
- The public Maine selector lane is now even narrower: OrgId discovery is already solved on the first-party selector HTML itself.
- The remaining blocker is the result/export capture step, not selector discovery.
- The county-local blocker is unchanged in this pass.
