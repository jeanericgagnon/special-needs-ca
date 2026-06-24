# Batch 312 Utah Live County Contract Refresh v1

- state: Utah
- classification: BLOCKED
- blocker_family: county_local_disability_resources

## What was confirmed

- Confirmed the current repo-side lane now sees `https://dhhs.utah.gov/contacts/` as a Cloudflare `403 Attention Required` shell.
- Confirmed `jobs.utah.gov/department/contact/index.html` still links users to an online `Office Map` route.
- Confirmed the surviving `jobs.utah.gov/office-search/` stack is still live and the public office API still returns inventory rows.
- Confirmed the office payload still has no `county` or `countiesServed` field.
- Confirmed only two unique office names carry county-like labels in the public payload: `Emery County (Castle Dale)` and `South County (Taylorsville)`.

## Why Utah remains blocked

- The former DHHS local-office lead is currently challenge-gated in the repo-side lane.
- The surviving DWS office payload remains an inventory, not a reusable county-to-office contract.
- Sparse county-like labels inside a few office names still do not create a complete 29-county disability-resource mapping.

## Exact blocker

- utah_dhhs_contacts_now_serves_cloudflare_403_while_live_dws_office_inventory_and_sparse_county_named_labels_still_fail_to_expose_complete_county_service_area_contract

## Next action

- hold_blocked_until_public_utah_successor_directory_api_or_reviewable_leaf_explicitly_maps_all_counties_to_local_disability_resource_offices

