# Batch 316 Kansas Live Export Recovery Report v1

- state: kansas
- classification: BLOCKED
- blocker_family: district_or_county_education_routing
- blocker_code: live_ksde_directory_root_and_public_export_contract_recovered_but_reviewed_local_district_leaves_still_cover_only_16_counties

## What was confirmed

- Confirmed the current KSDE Directory Reports root is live again and exposes `__VIEWSTATE`, `__VIEWSTATEGENERATOR`, and `__EVENTVALIDATION`.
- Confirmed the current KSDE Directories page is live again.
- Confirmed the current Kansas Educational Directory URL is a real public PDF again.
- Confirmed one bounded public Directory Reports POST replay again returns a real Excel workbook.
- Confirmed Kansas still has reviewed local education-routing proof for only 16 counties.

## Why Kansas remains blocked

- County-grade local education proof is still incomplete across the remaining unresolved counties.
- The blocker is now incomplete local district-leaf coverage, not a dead KSDE root.
- The right next move is to resume exact district-leaf authoring from the live export-backed district inventory and preserved district domains.

## Next action

- resume_only_from_live_public_export_backed_district_inventory_and_saved_district_owned_domains_to_expand_reviewed_local_education_leaves

