# Batch 208 Maine SAU Export Recovery Report v1

- classification: BLOCKED
- index_safe: false
- refined_family: district_or_county_education_routing
- failure_code: public_sau_export_contract_works_but_not_yet_materialized_into_county_grade_local_routing

## Evidence

- Reviewed 2026-06-23 official Maine education sources at https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU, https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town, and the official workbook https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx. A fresh bounded replay of the live public form included the anti-forgery `__RequestVerificationToken`, the full hidden `SAUs[*]` inventory, `OrgId=42`, and the named submit actions exposed on the page (`action:CSearchBySAU` and `action:SAUExport`). The Search submit now returns the official ContactSearchBySAU page without a raw transport failure, and the Export submit returns HTTP 200 with `content-type: application/ms-excel` and `content-disposition: attachment; filename=SAUSearchResults.xls`. The first-party export preserves local contact rows on the official host, including `504 Coordinator`, `Phone`, `Email`, `Town`, and `SAU` columns plus Bangor Public Schools values such as Daniel Chadbourne, dchadbourne@bangorschools.net, 73 Harlow Street, Bangor, ME 04401. Maine therefore no longer has a generic hidden-form error blocker for education. It remains blocked only because this working OrgId/workbook/export contract is not yet materialized into reviewed county-grade district routing rows across all counties.

## Repair decision

- Maine remains blocked and not index-safe.
- The official DOE education lane is stronger than before: the named SAU export submit now returns a real first-party workbook with local contact rows.
- Maine education still does not clear until that OrgId/workbook/export lane is turned into reviewed county-grade routing coverage across all counties.
