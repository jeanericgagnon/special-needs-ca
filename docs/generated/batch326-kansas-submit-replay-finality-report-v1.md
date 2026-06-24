# Batch 326 Kansas Submit Replay Finality Report v1

- state: kansas
- classification: BLOCKED
- blocker_family: district_or_county_education_routing
- blocker_code: current_ksde_directory_roots_and_pdf_url_return_request_rejected_shells_and_exact_submit_replay_is_rejected_while_reviewed_local_district_leaves_cover_only_18_counties

## What was confirmed

- Confirmed Kansas still has 18 counties with reviewed district-owned or district-linked local education leaves.
- Confirmed the current KSDE Directory Reports root now returns HTTP 200 only as a `Request Rejected` shell in the bounded raw lane.
- Confirmed the current KSDE Directories page returns the same `Request Rejected` shell.
- Confirmed the current Kansas educational-directory PDF URL also returns the same `Request Rejected` shell in the bounded raw lane.
- Confirmed one fresh exact district-scoped submit replay on the Directory Reports root also returns the same `Request Rejected` shell instead of a workbook.

## Why Kansas remains blocked

- County-grade local education proof is still incomplete across the remaining unresolved counties.
- The current official KSDE state roots are not reproducible low-token repair entrypoints right now.
- The safe next move is exact district-leaf authoring from saved district leads, not more live KSDE state-root retries.

## Next action

- continue_only_from_saved_district_owned_and_district_linked_local_leads_because_current_live_ksde_state_export_lane_is_not_reproducible

