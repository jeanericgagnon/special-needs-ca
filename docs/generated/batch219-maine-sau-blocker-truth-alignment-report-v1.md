# Batch 219 Maine SAU Blocker Truth Alignment Report v1

- classification: BLOCKED
- index_safe: false
- refined_family: district_or_county_education_routing
- failure_code: public_maine_sau_selectors_are_live_but_raw_export_replay_still_500_and_county_grade_contacts_remain_unmaterialized

## Evidence

- Reviewed 2026-06-23 official Maine education sources at https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU, https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town, and the official workbook https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx. The public selector HTML still exposes `__RequestVerificationToken`, live OrgIds such as `42` for Bangor Public Schools, and the named submit actions `action:CSearchBySAU` and `action:SAUExport`, and the official workbook still parses with municipality-to-OrganizationId mappings. But a fresh bounded raw replay in this lane with the anti-forgery token, full hidden SAU inventory, OrgId=42, and each named submit still failed to produce stable role-bearing contact rows: the POST lane returned HTTP 500 or shell-only HTML instead of a reusable first-party export. Maine therefore no longer has a discovery blocker for education, but it still does have a materialization blocker because the public selector/workbook contract does not currently yield county-grade local routing rows in the low-token raw lane.

## Repair decision

- Kept Maine BLOCKED.
- Preserved the official selector and workbook as real discovery primitives.
- Removed the overclaim that the raw export contract is already working in this lane.
- Repointed the next action toward reviewed browser capture or district-owned local leaves instead of pretending the raw export lane is scrape-ready.
