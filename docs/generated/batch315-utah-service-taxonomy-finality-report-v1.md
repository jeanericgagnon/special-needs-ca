# Batch 315 Utah Service Taxonomy Finality v1

- state: Utah
- classification: BLOCKED
- blocker_family: county_local_disability_resources

## What was confirmed

- Confirmed the current repo-side lane still sees `https://dhhs.utah.gov/contacts/` as a Cloudflare `403 Attention Required` shell.
- Confirmed the surviving official local-office stack is still bounded to the DWS `office-search` app plus `offices` and `services` API routes.
- Confirmed the public services API only exposes three labels: `All Offices`, `USOR Services`, and `Employment Centers`.
- Confirmed same-host county-style probes still do not materialize public county or service-area endpoints.
- Confirmed the public offices payload still exposes only sparse county-like office labels rather than a complete 29-county contract.

## Why Utah remains blocked

- The former DHHS local-office lead is currently challenge-gated in the repo-side lane.
- The surviving DWS public API surface still stops at inventory plus service taxonomy.
- No same-host county endpoint, county field, or service-area field materializes on the official Utah office stack.

## Exact blocker

- utah_dhhs_contacts_cloudflare_403_and_live_dws_public_api_surface_still_stops_at_inventory_and_three_service_labels_without_any_county_contract

## Next action

- hold_blocked_until_public_utah_successor_directory_api_or_reviewable_leaf_explicitly_maps_all_counties_to_local_disability_resource_offices

