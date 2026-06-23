# Batch 246 North Carolina Queue Signal Refresh Report v1

- classification: BLOCKED
- index_safe: false
- change: tightened the North Carolina local-family blockers with shared queue-contamination counts

## Evidence

- Reviewed 2026-06-23 the current North Carolina education-routing packet plus the live queue audit summary. The state still preserves one real district-owned exact leaf at Charlotte-Mecklenburg Schools, but the remaining education lane is visibly contaminated before fetch: 4 inventory rows use DB-field agency labels, 49 rows show federal/state mismatch, and 12 generic roots still need exact leaf verification. Many counties therefore still collapse to the statewide DPI Exceptional Children root or other generic/non-district leaves. The blocker is an exact district-leaf authoring and queue-cleanup gap, not a missing statewide education authority gap.
- Reviewed 2026-06-23 the current North Carolina county-local packet plus the live queue audit summary. The saved county-local samples still point at the DOI mirror `https://doi.org/10.7910/DVN/AVRHMI` rather than reviewed county-owned DSS or local assistance directories, and the same weak-signal queue contamination is still present upstream: 4 inventory rows use DB-field agency labels, 49 rows show federal/state mismatch, and 12 generic roots still need exact leaf verification. The blocker is now explicitly a county-owned local office replacement and queue-cleanup packet, not a generic local-resource shortage.

## Repair decision

- Kept North Carolina BLOCKED.
- Preserved that the same weak-signal inventory signature is hitting both district-routing and county-local lanes.
- Kept the next lane on exact district/county leaf authoring rather than more statewide retries.
