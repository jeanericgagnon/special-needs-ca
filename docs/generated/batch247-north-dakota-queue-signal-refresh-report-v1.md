# Batch 247 North Dakota Queue Signal Refresh Report v1

- classification: BLOCKED
- index_safe: false
- change: tightened the North Dakota local-family blockers with shared queue-contamination counts and preserved the legal-aid source-family blocker

## Evidence

- Reviewed 2026-06-23 the current North Dakota education-routing packet plus the live queue audit summary. The current district or county education-routing labels are still state-root-backed district labels that collapse to the statewide `https://www.nd.gov/` surface, including rows labeled as Burleigh and Cass special education, and the local queue remains visibly contaminated before fetch: 4 inventory rows use DB-field agency labels, 49 rows show federal/state mismatch, and 9 generic roots still need exact leaf verification. The blocker is a district-owned local-leaf authoring and queue-cleanup gap with no trustworthy local leaves yet preserved on disk.
- Reviewed 2026-06-23 the current North Dakota county-local packet plus the live queue audit summary. The saved county-local samples still point at the DOI mirror `https://doi.org/10.7910/DVN/AVRHMI` rather than reviewed county-owned Human Service Zone or local assistance directories, and the same upstream weak-signal queue contamination is still present: 4 inventory rows use DB-field agency labels, 49 rows show federal/state mismatch, and 9 generic roots still need exact leaf verification. The blocker is explicitly a county-owned replacement and queue-cleanup packet, not a discovery-only gap.
- Reviewed 2026-06-23 the current North Dakota statewide-support set. P&A and PTI are now covered by reviewed first-party sources, but statewide legal-aid support still has no reviewed first-party or authoritative statewide artifact on disk. The remaining legal-aid work is still a standalone source-family packet, not part of county or district leaf repair.

## Repair decision

- Kept North Dakota BLOCKED.
- Preserved the shared weak-signal inventory signature on both local families so later work can clean exact leaves instead of statewide roots.
- Kept legal aid isolated as a missing statewide source-family blocker.
